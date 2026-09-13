import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import Reveal from './Reveal.jsx'
import { ABOUT, STATS } from '../data/content.js'

function Counter({ to, suffix, raw }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduced = useReducedMotion()
  const [n, setN] = useState(raw ? to : 0)

  useEffect(() => {
    if (!inView || reduced || raw) {
      setN(to)
      return
    }
    let raf = 0
    const start = performance.now()
    const dur = 1100
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur)
      const eased = 1 - Math.pow(1 - t, 3)
      setN(Math.round(to * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, reduced, raw])

  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <section id="about" data-nav="light" className="bg-white py-24 text-black sm:py-32">
      <div className="shell">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <Reveal>
            <h2 className="max-w-[14ch] text-[clamp(26px,3.6vw,50px)] font-medium leading-[1.1] tracking-tightest">
              {ABOUT.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="max-w-[46ch]">
            <p className="text-[15px] leading-relaxed text-black/55">{ABOUT.body}</p>
            <a
              href="#contact"
              className="group mt-5 inline-flex items-center gap-2 border-b border-black/30 pb-1 text-[15px] transition-colors hover:border-black"
            >
              {ABOUT.cta}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </Reveal>
        </div>

        {/* one horizontal row, thin dividers between */}
        <Reveal delay={0.1} className="mt-16">
          <div className="grid grid-cols-2 gap-y-10 border-t border-black/10 pt-10 lg:grid-cols-4 lg:gap-y-0">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col gap-3 px-0 lg:px-8 ${
                  i > 0 ? 'lg:border-l lg:border-black/10' : ''
                } ${i === 0 ? 'lg:pl-0' : ''}`}
              >
                <span className="text-[13px] uppercase tracking-[0.16em] text-black/40">
                  {s.label}
                </span>
                <span className="text-[clamp(38px,5vw,72px)] font-medium leading-none tracking-tightest">
                  <Counter to={s.value} suffix={s.suffix} raw={s.raw} />
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
