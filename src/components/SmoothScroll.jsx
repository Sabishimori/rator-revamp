import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

/**
 * Inertial scrolling, via GSAP ScrollSmoother.
 *
 * This replaced Lenis rather than joining it — both libraries take over the
 * wheel and drive scroll position themselves, so running the two together
 * makes them fight over every frame.
 *
 * ScrollSmoother works by translating `#smooth-content` inside
 * `#smooth-wrapper`. Two consequences the rest of the app is built around:
 *
 *  - Anything `position: fixed` must live OUTSIDE the wrapper. A transformed
 *    ancestor becomes the containing block for fixed children, so the header,
 *    cursor and grain would scroll away with the page if they were inside.
 *  - Pinning is ScrollTrigger's job, not CSS `position: sticky`. The hero pins
 *    through ScrollTrigger for exactly this reason.
 *
 * `effects: true` is what enables the `data-speed` and `data-lag` attributes
 * used for the parallax around the page.
 */
const SMOOTH = 1.2 // seconds it takes to catch up to the real scroll position

export default function SmoothScroll() {
  useEffect(() => {
    // Honour reduced motion: native scrolling, no interception at all.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: SMOOTH,
      effects: true,
      // Takes over the browser's own scrolling to keep it in step with the
      // transform; also stops mobile address-bar resizes jolting the page.
      normalizeScroll: true,
      ignoreMobileResize: true,
    })

    /**
     * Published so other components can move the page through the smoother
     * instead of calling window.scrollTo, which fights the transform.
     */
    window.__smoother = smoother

    // In-page anchors have to go through the smoother, or they jump instantly.
    const onClick = (e) => {
      const link = e.target.closest?.('a[href^="#"]')
      if (!link) return
      const id = link.getAttribute('href')
      if (!id || id === '#') return
      const target = document.querySelector(id)
      if (!target) return
      e.preventDefault()
      smoother.scrollTo(target, true, 'top 70px')
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      if (window.__smoother === smoother) delete window.__smoother
      smoother.kill()
    }
  }, [])

  return null
}
