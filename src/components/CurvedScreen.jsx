import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

/**
 * A real CRT screen: the picture is geometrically barrel-warped, so the grid
 * of the image itself bends and the corners pull in — not a rounded rectangle
 * with shading faked on top.
 *
 * The warp happens in the fragment shader. Each pixel's uv is pushed out from
 * the centre proportional to r², which is the classic barrel lens model.
 * Anything pushed past the edge of the texture is discarded, and because the
 * renderer is alpha-enabled that discarded region shows the page background —
 * which is what produces the bowed screen silhouette.
 *
 * `curve` is the flatten dial and accepts a Framer MotionValue: it is read
 * inside the render loop, so scroll-linked flattening never re-renders React.
 * At 0 the picture is perfectly flat and fills the whole panel.
 *
 * The source must be CORS-enabled or WebGL cannot sample it. That is why the
 * hero clip is served from a host that sends `Access-Control-Allow-Origin`.
 */

const VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const FRAG = `
  precision highp float;

  uniform sampler2D uTex;
  uniform float uCurve;
  uniform vec2  uCover;
  uniform float uHasTex;

  varying vec2 vUv;

  void main() {
    // barrel: push each point out from the centre by r^2
    vec2 p = vUv * 2.0 - 1.0;
    float r2 = dot(p, p);
    p *= 1.0 + uCurve * r2;

    vec2 uv = p * 0.5 + 0.5;

    // past the edge of the tube — let the page show through, feathered so the
    // curved silhouette stays smooth without multisampling
    vec2 outside = max(-uv, uv - 1.0);
    float over = max(outside.x, outside.y);
    float alpha = 1.0 - smoothstep(0.0, 0.0035, over);
    if (alpha <= 0.001) discard;

    vec2 cuv = (uv - 0.5) * uCover + 0.5;
    vec3 col = uHasTex > 0.5 ? texture2D(uTex, cuv).rgb : vec3(0.04, 0.04, 0.05);

    // glass: edges fall off, and a soft sheen across the upper half.
    // Both are tied to how curved it currently is, so they lift as it flattens.
    float edge = 1.0 - smoothstep(0.62, 1.25, length(p));
    float amt  = clamp(uCurve * 7.0, 0.0, 1.0);
    col *= mix(1.0, edge, amt * 0.85);
    col += vec3(0.05) * amt * smoothstep(0.75, 0.0, vUv.y);

    gl_FragColor = vec4(col, alpha);
  }
`

export default function CurvedScreen({ videoSrc, curve = 0, className = '' }) {
  const hostRef = useRef(null)
  const curveRef = useRef(curve)
  curveRef.current = curve
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({
        // antialias off on purpose: it allocates multisample buffers, which makes
        // every resize during the scroll dramatically more expensive. There is
        // no geometry to alias here — the tube edge is feathered in the shader.
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
      })
    } catch {
      setFailed(true)
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%'
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    /**
     * The picture source — CORS-enabled so WebGL can sample it.
     *
     * It is ATTACHED to the document (1px, invisible) rather than left as a
     * detached element. Browsers deprioritise or outright refuse playback for
     * media that is not in the DOM, and since the shader samples this video,
     * a video that never decodes means an empty screen.
     *
     * `muted` is set as an attribute as well as a property: the attribute is
     * what the autoplay policy checks.
     */
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.muted = true
    video.setAttribute('muted', '')
    video.loop = true
    video.playsInline = true
    video.setAttribute('playsinline', '')
    video.autoplay = true
    video.preload = 'auto'
    video.style.cssText =
      'position:absolute;left:0;top:0;width:1px;height:1px;opacity:0;pointer-events:none'
    host.appendChild(video)
    if (videoSrc) video.src = videoSrc

    const texture = new THREE.VideoTexture(video)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter

    const uniforms = {
      uTex: { value: texture },
      uCurve: { value: typeof curve === 'number' ? curve : 0.16 },
      uCover: { value: new THREE.Vector2(1, 1) },
      uHasTex: { value: 0 },
    }

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms,
        transparent: true,
      })
    )
    scene.add(mesh)

    video.addEventListener('loadeddata', () => {
      uniforms.uHasTex.value = 1
      video.play().catch(() => {})
      fit()
    })
    video.addEventListener('error', () => setFailed(true))

    // cover-fit: sample a narrower window on whichever axis is over-long
    function fit() {
      const w = host.clientWidth
      const h = host.clientHeight
      if (!w || !h) return
      const texW = video.videoWidth || 16
      const texH = video.videoHeight || 9
      const texAspect = texW / texH
      const planeAspect = w / h
      if (planeAspect > texAspect) uniforms.uCover.value.set(1, texAspect / planeAspect)
      else uniforms.uCover.value.set(planeAspect / texAspect, 1)
    }

    /**
     * The hero panel animates its width and height every frame while you
     * scroll, so this fires continuously — and resizing a WebGL drawing buffer
     * CLEARS it. Left alone the browser composites that empty buffer before
     * the next animation frame paints, which shows as the picture flashing
     * black for the whole scroll and only returning once you stop.
     *
     * Two things fix it: snap to coarse steps so the buffer is reallocated a
     * fraction as often, and repaint synchronously so a freshly cleared buffer
     * is never the thing that gets composited.
     */
    const STEP = 32
    let lastW = 0
    let lastH = 0
    const resize = () => {
      const w = Math.round(host.clientWidth / STEP) * STEP
      const h = Math.round(host.clientHeight / STEP) * STEP
      if (!w || !h || (w === lastW && h === lastH)) return
      lastW = w
      lastH = h
      renderer.setSize(w, h, false)
      fit()
      renderer.render(scene, camera)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    // Keep the hero source decoding while the sticky panel changes size. The
    // section itself remains visible during the scroll, but its WebGL host can
    // briefly report as non-intersecting while the layout is being repainted.
    // Pausing there makes the texture flash black on the next frame.
    const resume = () => {
      if (document.visibilityState === 'visible') video.play().catch(() => {})
    }
    video.addEventListener('canplay', resume)
    document.addEventListener('visibilitychange', resume)

    let raf = 0
    const frame = () => {
      raf = requestAnimationFrame(frame)
      const c = curveRef.current
      uniforms.uCurve.value = typeof c === 'number' ? c : (c?.get?.() ?? 0)
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        texture.needsUpdate = true
      }
      renderer.render(scene, camera)
    }
    frame()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      video.removeEventListener('canplay', resume)
      document.removeEventListener('visibilitychange', resume)
      video.pause()
      video.removeAttribute('src')
      video.load()
      if (video.parentNode === host) host.removeChild(video)
      mesh.geometry.dispose()
      mesh.material.dispose()
      texture.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement)
    }
  }, [videoSrc])

  // WebGL unavailable: plain flat video rather than nothing
  if (failed) {
    return (
      <div className={className}>
        <video
          className="h-full w-full object-cover"
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    )
  }

  return <div ref={hostRef} className={className} aria-hidden="true" />
}
