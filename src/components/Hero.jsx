import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
import CurvedScreen from './CurvedScreen.jsx'
import { HERO } from '../data/content.js'

/**
 * Section 1 — the hero, shaped like a CRT set.
 *
 * At rest it is a wide rectangle whose picture is bowed outward like the face
 * of a tube, corners pulled in. As you scroll it FLATTENS progressively — the
 * bend relaxes, the edge falloff and sheen lift — while the panel grows to
 * cover the whole viewport. By the time it is full bleed it is a plain flat
 * screen.
 *
 * The curve is a real geometric barrel warp done in a fragment shader
 * (`CurvedScreen`), so the picture itself bends and the corners pull in. The
 * `curve` value eases to 0 as you scroll, flattening the tube into a plain
 * flat screen exactly as it reaches full bleed.
 *
 * The panel grows by animating width/height rather than `transform: scale`, so
 * the element re-lays-out and `object-fit: cover` re-crops — the footage stays
 * sharp instead of being magnified.
 */
export default function Hero() {
  const ref = useRef(null)
  const [vp, setVp] = useState({ w: 1440, h: 900 })

  useEffect(() => {
    // clientWidth, not innerWidth: innerWidth includes the scrollbar, and a
    // full-bleed panel sized to it overflows and adds a horizontal scrollbar.
    //
    // Watched with a ResizeObserver, not just a `resize` listener: a component
    // that mounts while the viewport still reports 0 would otherwise latch
    // that 0 forever, because no `resize` event follows when the size arrives.
    const measure = () => {
      const w = document.documentElement.clientWidth
      const h = document.documentElement.clientHeight
      if (!w || !h) return
      setVp((prev) => (prev.w === w && prev.h === h ? prev : { w, h }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.documentElement)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  /** Scroll progress through the pinned hero: 0 at the top, 1 when it releases. */
  const scrollYProgress = useMotionValue(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    /**
     * ScrollTrigger does the pinning, not CSS `position: sticky`.
     *
     * ScrollSmoother translates the whole content block, and sticky resolves
     * against the scrollport rather than that transform — so a sticky hero
     * drifts instead of holding. ScrollTrigger's pin is built to work with the
     * smoother, and it also creates the spacer, which is why the section is
     * one viewport tall here rather than 300vh of manual runway.
     *
     * It also replaces the per-frame rAF loop this used to run: `scrub` hands
     * back a progress value, which feeds the same Framer motion values the
     * panel and the shader were already reading.
     */
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: '+=300%',
      pin: true,
      pinSpacing: true,
      // a touch of catch-up, so the zoom trails the wheel rather than snapping
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: (self) => scrollYProgress.set(self.progress),
    })

    return () => st.kill()
  }, [scrollYProgress])

  // a wide, rectangular set — not the squarer 16:10 it used to be
  const baseW = Math.min(vp.w * 0.66, 1040)
  const baseH = baseW / 2.05

  const FLAT = 0.62 // progress at which it is fully flat and full bleed

  const width = useTransform(scrollYProgress, [0, FLAT], [baseW, vp.w])
  const height = useTransform(scrollYProgress, [0, FLAT], [baseH, vp.h])
  const panelTop = useTransform(scrollYProgress, [0, FLAT], ['46%', '50%'])

  /**
   * The bend. 0.16 is a pronounced CRT bulge; it eases to 0 so the tube
   * flattens into a plain screen exactly as the panel reaches full bleed.
   */
  const curve = useTransform(scrollYProgress, [0, FLAT], [0.16, 0])

  // the wordmark rises from beneath the set to the centre — and stays
  const copyTop = useTransform(scrollYProgress, [0, FLAT], ['88%', '50%'])
  const copyScale = useTransform(scrollYProgress, [0, FLAT], [1, 1.16])
  const kickerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  return (
    <section id="hero" ref={ref} data-nav="dark" className="relative h-screen overflow-hidden bg-black">
      <div className="relative h-full w-full">
        <motion.div
          // x/y here, not Tailwind's -translate-*: Framer owns `transform` on
          // a motion element and would overwrite the utility classes.
          style={{
            width,
            height,
            top: panelTop,
            left: '50%',
            x: '-50%',
            y: '-50%',
          }}
          className="absolute overflow-hidden"
        >
          <CurvedScreen videoSrc={HERO.video} curve={curve} className="absolute inset-0" />
        </motion.div>

        {/* centred wordmark, blended into whatever sits behind it */}
        <motion.div
          style={{ top: copyTop, y: '-50%', scale: copyScale }}
          className="pointer-events-none absolute inset-x-0 z-10 px-6 text-center mix-blend-difference"
        >
          <motion.p
            style={{ opacity: kickerOpacity }}
            className="mb-4 text-[13px] uppercase tracking-[0.18em] text-white/50"
          >
            {HERO.kicker}
          </motion.p>
          <h1 className="mx-auto max-w-[22ch] text-[clamp(26px,4.2vw,58px)] font-medium leading-[1.06] tracking-tightest text-white">
            {HERO.headline[0]}
            <br />
            {HERO.headline[1]}
          </h1>
        </motion.div>
      </div>
    </section>
  )
}
