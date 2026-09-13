import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { TESTIMONIALS } from '../data/content.js'

const INTERVAL = 6000

/**
 * Each part enters on its own, rising from below in sequence: the portrait
 * first, then the name, then the role, then the quote. The stagger is what
 * makes a slide change read as something being assembled rather than a block
 * of text swapping out.
 *
 * `key={i}` on the group restarts the whole sequence on every slide change.
 */
const ORDER = { photo: 0, name: 0.09, role: 0.18, quote: 0.28 }

function Rise({ delay = 0, className = '', children }) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 0.8, 0.24, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function Testimonials() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = useCallback((next) => {
    setPaused(true) // any manual move stops it advancing on its own
    setI((prev) => (next + TESTIMONIALS.length) % TESTIMONIALS.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setI((p) => (p + 1) % TESTIMONIALS.length), INTERVAL)
    return () => clearInterval(id)
  }, [paused])

  const t = TESTIMONIALS[i]

  return (
    <section data-nav="dark" className="bg-black py-24 text-white sm:py-32">
      <div className="shell">
        <p className="mb-10 text-[13px] uppercase tracking-[0.18em] text-white/40">Testimonials</p>

        <div className="min-h-[360px] sm:min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.figure key={i} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}>
              {/* portrait, then name, then role — each rising in turn */}
              <figcaption className="mb-8 flex items-center gap-4">
                <Rise delay={ORDER.photo}>
                  <img
                    src={t.photo}
                    alt=""
                    loading="lazy"
                    className="h-14 w-14 rounded-full object-cover ring-1 ring-white/15"
                  />
                </Rise>
                <span className="flex flex-col text-[14px]">
                  <Rise delay={ORDER.name}>
                    <b className="font-medium">{t.name}</b>
                  </Rise>
                  <Rise delay={ORDER.role}>
                    <span className="text-white/45">
                      {t.role}, {t.company} — {t.location}
                    </span>
                  </Rise>
                </span>
              </figcaption>

              <Rise delay={ORDER.quote}>
                <blockquote className="max-w-[30ch] text-[clamp(22px,3vw,40px)] font-normal leading-[1.22] tracking-tightest">
                  “{t.quote}”
                </blockquote>
              </Rise>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-between gap-6">
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, n) => (
              <span
                key={n}
                className={`h-[3px] w-8 rounded-full transition-colors duration-500 ${
                  n === i ? 'bg-rator-accent' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-6 text-[14px]">
            <button
              type="button"
              onClick={() => go(i - 1)}
              className="text-white/50 transition-colors hover:text-white"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => go(i + 1)}
              className="text-white/50 transition-colors hover:text-white"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
