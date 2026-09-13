import { useEffect, useRef, useState } from 'react'
import { PROJECTS, REACH_WORDS } from '../data/content.js'

/**
 * Section 4 — the dark word wall with a cursor image trail.
 *
 * The tiles are meant to feel like real, solid objects rather than uniform
 * stamps appearing in a line:
 *
 *  - every slot has its own size and aspect, mixing portrait and landscape,
 *    so the trail is never two matching tiles in a row
 *  - spacing between drops varies per placement, so the rhythm is uneven
 *  - a tile pops up exactly where the pointer is and shrinks away on that
 *    same spot — it never slides or drifts to somewhere else
 *  - it is 100% opaque for its whole life. It leaves by shrinking, not by
 *    fading, so it never reads as translucent while it sits there
 *  - it sits ON TOP of the word wall. Behind the type the giant grey letters
 *    draw over the picture and make a fully opaque tile look washed out
 *
 * Placement and animation stay on two separate elements:
 *
 *   outer  left / top / rotate, written instantly and NEVER transitioned, so
 *          a recycled tile cannot slide across from its previous position
 *   inner  scale + opacity only, driven by the Web Animations API so each
 *          placement starts a fresh animation with no reflow trick
 */

const POOL = 8
const LIFE = 1200 // ms from pop-in to fully shrunk away

// uneven by design — mixed aspects, no two neighbours alike
const TILES = [
  { w: 540, h: 380 },
  { w: 420, h: 540 },
  { w: 620, h: 350 },
  { w: 380, h: 480 },
  { w: 560, h: 410 },
  { w: 450, h: 360 },
  { w: 490, h: 590 },
  { w: 410, h: 310 },
]

export default function Reach() {
  const hostRef = useRef(null)
  const tileRefs = useRef([])
  const innerRefs = useRef([])

  /**
   * Which words are lit shifts every few seconds. The wall is the largest
   * block on the page; without this it sits perfectly still whenever the
   * pointer is not moving.
   */
  const [litOffset, setLitOffset] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setLitOffset((n) => n + 1), 2600)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let last = null
    let gate = 240 // distance to the next drop, re-rolled each time
    let next = 0
    const running = []

    const onMove = (e) => {
      const rect = host.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (last && Math.hypot(x - last.x, y - last.y) < gate) return
      last = { x, y }
      gate = 190 + Math.random() * 140 // uneven spacing, scaled to tile size

      const slot = next % POOL
      next += 1
      const tile = tileRefs.current[slot]
      const inner = innerRefs.current[slot]
      if (!tile || !inner) return

      // position: instant, untransitioned — the tile just *is* here now
      const rot = (Math.random() * 26 - 13).toFixed(1)
      tile.style.left = `${x}px`
      tile.style.top = `${y}px`
      tile.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`

      // Pops up solid, holds, shrinks away on the same spot. Opacity stays at
      // 1 until the very last frames so it is never a see-through rectangle.
      running[slot]?.cancel()
      running[slot] = inner.animate(
        [
          { transform: 'scale(0.34)', opacity: 1 },
          { transform: 'scale(1)', opacity: 1, offset: 0.18 },
          { transform: 'scale(1)', opacity: 1, offset: 0.72 },
          { transform: 'scale(0.22)', opacity: 1, offset: 0.96 },
          { transform: 'scale(0.12)', opacity: 0 },
        ],
        { duration: LIFE, easing: 'cubic-bezier(.16,.84,.28,1)', fill: 'forwards' }
      )
    }

    host.addEventListener('mousemove', onMove)
    return () => {
      host.removeEventListener('mousemove', onMove)
      running.forEach((a) => a?.cancel())
    }
  }, [])

  return (
    <section data-nav="dark" className="relative overflow-hidden bg-black py-24 text-white sm:py-32">
      <div ref={hostRef} className="relative">
        {/* image trail, behind the type */}
        <div className="pointer-events-none absolute inset-0 z-20">
          {TILES.map((size, i) => {
            const project = PROJECTS[i % PROJECTS.length]
            return (
              <div
                key={i}
                ref={(el) => (tileRefs.current[i] = el)}
                className="absolute left-0 top-0"
                style={{ width: size.w, height: size.h }}
              >
                <div
                  ref={(el) => (innerRefs.current[i] = el)}
                  className="h-full w-full overflow-hidden rounded-lg opacity-0 shadow-2xl"
                  style={{ background: project.accent, willChange: 'transform, opacity' }}
                >
                  <img
                    src={project.image}
                    alt=""
                    /* not lazy: a tile is needed the instant the pointer moves,
                       and a lazy image would pop in blank on first use */
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div className="shell relative z-10">
          <p className="mb-8 text-[13px] uppercase tracking-[0.18em] text-white/40">
            What we make
          </p>
          <p className="max-w-[22ch] text-[clamp(34px,6.2vw,104px)] font-medium leading-[1.03] tracking-tightest sm:max-w-none">
            {REACH_WORDS.map((entry, i) => (
              <span
                key={entry.w}
                className={`transition-colors duration-[1400ms] ${
                  (i + litOffset) % 5 === 0 ? 'text-white' : 'text-white/25'
                }`}
              >
                {entry.w}
                {i < REACH_WORDS.length - 1 ? ', ' : '.'}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}
