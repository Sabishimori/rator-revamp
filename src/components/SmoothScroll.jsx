import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Inertial scrolling, the same library the reference site uses (its <html>
 * carries `lenis lenis-smooth`).
 *
 * Lenis intercepts the wheel and eases the *real* scroll position toward the
 * target, which is why everything else on the page keeps working untouched:
 * `scrollY` and every `getBoundingClientRect()` still report the truth, so the
 * hero zoom, the parallax frames and the nav tint need no changes.
 *
 * `lerp` is the weight dial. Lower = heavier and longer to settle:
 *   0.10  Lenis default, fairly quick
 *   0.075 what this uses — noticeable glide without feeling slippery
 *   0.05  very heavy, starts to feel disconnected from the wheel
 */
const LERP = 0.075

export default function SmoothScroll() {
  useEffect(() => {
    // Honour reduced motion: native scrolling, no interception at all.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      lerp: LERP,
      wheelMultiplier: 0.9,
      smoothWheel: true,
      // Leave touch alone — native momentum on a phone already feels right,
      // and overriding it fights the platform.
      syncTouch: false,
    })

    /**
     * Published so scroll-driven components can move the page THROUGH Lenis
     * instead of calling window.scrollTo, which Lenis would immediately undo
     * by easing back to its own internal target.
     */
    window.__lenis = lenis

    let raf = 0
    const frame = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    // In-page anchors have to go through Lenis, or they jump instantly.
    const onClick = (e) => {
      const link = e.target.closest?.('a[href^="#"]')
      if (!link) return
      const id = link.getAttribute('href')
      if (!id || id === '#') return
      const target = document.querySelector(id)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: -70, duration: 1.4 })
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('click', onClick)
      if (window.__lenis === lenis) delete window.__lenis
      lenis.destroy()
    }
  }, [])

  return null
}
