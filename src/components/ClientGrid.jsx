import Reveal from './Reveal.jsx'
import { CLIENTS } from '../data/content.js'

/**
 * Selected clients.
 *
 * On hover the name peels up as a sticker: a small rotated label that pops in
 * above the cell, slightly overlapping its top edge so it reads as something
 * stuck on rather than a tooltip. The cell name itself dims back at the same
 * time so the two never compete.
 */
export default function ClientGrid() {
  return (
    <section data-nav="dark" className="bg-black pb-24 text-white sm:pb-32">
      <div className="shell">
        <p className="mb-8 text-[13px] uppercase tracking-[0.18em] text-white/40">
          Selected Clients
        </p>
        <Reveal>
          <div className="grid grid-cols-2 border-l border-t border-white/10 sm:grid-cols-3 lg:grid-cols-5">
            {CLIENTS.map((c, i) => (
              <div
                key={c}
                className="group relative grid h-[116px] place-items-center border-b border-r border-white/10 px-4 text-center transition-colors duration-300 hover:bg-white/[0.03]"
              >
                {/* the sticker */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1.5 z-20 origin-bottom -translate-x-1/2 scale-75 rounded-[3px] bg-white px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-black opacity-0 shadow-lg transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:scale-100 group-hover:opacity-100"
                  style={{ rotate: `${i % 2 ? 4 : -4}deg` }}
                >
                  {c}
                </span>

                <span className="text-[14px] text-white/40 transition-colors duration-300 group-hover:text-white/70">
                  {c}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
