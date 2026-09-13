import Reveal from './Reveal.jsx'
import { FOUNDERS } from '../data/content.js'

/**
 * The studio, as a row of cards divided by hairlines.
 *
 * At rest each portrait is a duotone: a desaturated photo composited over the
 * person's own accent colour with `mix-blend-mode: luminosity`, which gives
 * the flat two-tone look without needing cut-out PNGs — a plain rectangular
 * photograph is enough.
 *
 * Hovering is the reaction: the portrait drops the blend and returns to full
 * colour, and the role line swaps for a more candid one. The two lines are
 * stacked in the same grid cell so the swap never changes the card's height.
 */
export default function Founders() {
  return (
    <section id="studio" data-nav="dark" className="bg-black py-24 text-white sm:py-32">
      <div className="shell">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-4 text-[13px] uppercase tracking-[0.18em] text-white/40">The studio</p>
            <h2 className="max-w-[18ch] text-[clamp(26px,3.6vw,50px)] font-medium leading-[1.1] tracking-tightest">
              A small room, and everyone in it.
            </h2>
          </div>
          <a
            href="#careers"
            className="group inline-flex items-center gap-2 border-b border-white/30 pb-1 text-[15px] transition-colors hover:border-white"
          >
            Join the team
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>

        <div className="grid grid-cols-1 border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {FOUNDERS.map((person, i) => (
            <Reveal key={person.name} delay={0.06 * i}>
              <article className="group h-full border-b border-white/10 px-0 py-8 sm:border-r sm:px-6 lg:first:pl-0 lg:last:border-r-0">
                {/* duotone portrait */}
                <div
                  className="relative aspect-[4/5] w-full overflow-hidden"
                  style={{ background: person.accent }}
                >
                  <img
                    src={person.photo}
                    alt={person.name}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale transition-all duration-500 ease-out [mix-blend-mode:luminosity] group-hover:scale-[1.03] group-hover:grayscale-0 group-hover:[mix-blend-mode:normal]"
                  />
                </div>

                <h3 className="mt-5 text-[clamp(22px,2.2vw,30px)] font-semibold leading-none tracking-tightest">
                  {person.name}
                </h3>

                {/* both lines share one cell, so the card never changes height */}
                <div className="mt-2 grid text-[15px] leading-snug">
                  <span className="col-start-1 row-start-1 text-white/50 transition-all duration-300 group-hover:-translate-y-1 group-hover:opacity-0">
                    {person.role}
                  </span>
                  <span className="col-start-1 row-start-1 translate-y-1 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {person.roleHover}
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-10 flex items-start gap-2 text-[12px] leading-relaxed text-white/30">
          <span className="text-white/20">◆</span>
          Team names and portraits are placeholders.
        </p>
      </div>
    </section>
  )
}
