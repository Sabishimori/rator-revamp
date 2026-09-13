import { useEffect, useRef } from 'react'

/**
 * An image that drifts inside its frame as the page scrolls.
 *
 * The frame clips; the image is oversized (`scale`) so the vertical drift
 * never exposes an edge. Progress is read from the frame's own rect on a rAF
 * loop gated by an IntersectionObserver, so offscreen frames cost nothing and
 * it stays correct under programmatic scrolling too.
 *
 * Transform is written straight to the node — this never re-renders React.
 */
export default function ParallaxImage({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  strength = 46,
  scale = 1.18,
}) {
  const frameRef = useRef(null)
  const imgRef = useRef(null)

  useEffect(() => {
    const frame = frameRef.current
    const img = imgRef.current
    if (!frame || !img) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      img.style.transform = `scale(${scale})`
      return
    }

    let raf = 0
    let onScreen = true

    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting), { threshold: 0 })
    io.observe(frame)

    const update = () => {
      const r = frame.getBoundingClientRect()
      const vh = window.innerHeight
      if (!vh) return
      // -1 when the frame is entering at the bottom, +1 when leaving at the top
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
      img.style.transform = `translate3d(0, ${(p * strength).toFixed(2)}px, 0) scale(${scale})`
    }

    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (onScreen) update()
    }
    loop()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [strength, scale])

  return (
    <div ref={frameRef} className={`overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        style={{ transform: `scale(${scale})` }}
        className={`h-full w-full object-cover will-change-transform ${imgClassName}`}
      />
    </div>
  )
}
