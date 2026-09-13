import { motion, useReducedMotion } from 'framer-motion'
import { CAPABILITY_GROUPS } from '../data/content.js'

/**
 * Section 3 — Capabilities. Light ground, plain multi-column lists.
 *
 * The reference does nothing clever here on purpose: a small grey group
 * heading with its services listed beneath, five groups wrapping across the
 * grid. The only motion is a per-line fade as the block enters — each item
 * staggered a few milliseconds behind the one above it, which is what gives
 * the list its cascade.
 */
export default function Capabilities() {
  const reduced = useReducedMotion()

  return (
    <section id="capabilities" data-nav="light" className="bg-white pb-24 pt-6 text-black sm:pb-32">
      <div className="shell">
        <p className="mb-10 text-[13px] uppercase tracking-[0.18em] text-black/40">Capabilities</p>

        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {CAPABILITY_GROUPS.map((group, gi) => (
            <div key={group.title} className="flex flex-col gap-5">
              <h3 className="text-[13px] uppercase tracking-[0.12em] text-black/40">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {group.items.map((item, i) =>
                  reduced ? (
                    <li key={item} className="text-[15px] leading-snug tracking-tight">
                      {item}
                    </li>
                  ) : (
                    <motion.li
                      key={item}
                      className="text-[15px] leading-snug tracking-tight"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{
                        duration: 0.5,
                        // the cascade: each line trails the one above it
                        delay: gi * 0.06 + i * 0.035,
                        ease: [0.22, 0.8, 0.24, 1],
                      }}
                    >
                      {item}
                    </motion.li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
