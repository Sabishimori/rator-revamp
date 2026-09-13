import { useEffect, useState } from 'react'

/**
 * Reports whether the section currently sitting *behind the header* is dark
 * or light, so the frosted nav pills can flip their tint.
 *
 * Sections opt in with `data-nav="dark"` or `data-nav="light"`. Reading the
 * rects on scroll is more accurate here than IntersectionObserver, because
 * what matters is one specific y — the middle of the header — not how much
 * of a section happens to be visible.
 */
export default function useSectionTheme(probeY = 44) {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    let queued = false

    const measure = () => {
      queued = false
      const sections = document.querySelectorAll('[data-nav]')
      let found = 'dark'
      for (const el of sections) {
        const r = el.getBoundingClientRect()
        if (r.top <= probeY && r.bottom > probeY) {
          found = el.getAttribute('data-nav') === 'light' ? 'light' : 'dark'
        }
      }
      setTheme((prev) => (prev === found ? prev : found))
    }

    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [probeY])

  return theme
}
