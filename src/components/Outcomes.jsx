import Reveal from './Reveal.jsx'
import DragRail from './DragRail.jsx'
import { OUTCOMES, OUTCOMES_INTRO } from '../data/content.js'

export default function Outcomes() {
  return (
    <section data-nav="light" className="bg-white pb-28 text-black sm:pb-36">
      <div className="shell">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <h2 className="max-w-[18ch] text-[clamp(24px,3.2vw,44px)] font-medium leading-[1.1] tracking-tightest">
              {OUTCOMES_INTRO.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-[46ch] text-[15px] leading-relaxed text-black/55">
              {OUTCOMES_INTRO.body}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-12">
          {/* Items rendered twice so the ticker can wrap seamlessly; the
              second pass is hidden from assistive tech as a duplicate. */}
          <DragRail cursorLabel="Drag" autoScroll speed={0.45}>
            {[...OUTCOMES, ...OUTCOMES].map((o, i) => (
              <article
                key={`${o.client}-${i}`}
                aria-hidden={i >= OUTCOMES.length ? 'true' : undefined}
                className="flex w-[264px] flex-col gap-5 rounded-2xl border border-black/10 bg-black/[0.02] p-6 sm:w-[300px]"
              >
                {/* wordmark stands in for the client logo */}
                <span className="text-[13px] font-medium uppercase tracking-[0.12em] text-black/45">
                  {o.client}
                </span>
                <span className="text-[clamp(30px,3vw,42px)] font-medium leading-none tracking-tightest">
                  {o.figure}
                </span>
                <p className="mt-auto text-[14px] leading-relaxed text-black/55">{o.caption}</p>
              </article>
            ))}
          </DragRail>
        </Reveal>
      </div>
    </section>
  )
}
