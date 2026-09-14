import Reveal from './Reveal.jsx'
import DragRail from './DragRail.jsx'
import ParallaxImage from './ParallaxImage.jsx'
import { NEWS } from '../data/content.js'

/** Section 9 — News. Dark, matching the run of dark sections that closes the page. */
export default function News() {
  return (
    <section id="news" data-nav="dark" className="bg-black pb-24 text-white sm:pb-32">
      <div className="shell">
        <div className="mb-10 flex items-end justify-between gap-6">
          <p className="text-[13px] uppercase tracking-[0.18em] text-white/40">News</p>
          <a
            href="#news"
            className="group inline-flex items-center gap-2 border-b border-white/30 pb-1 text-[15px] transition-colors hover:border-white"
          >
            All updates
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>

        <Reveal>
          <DragRail cursorLabel="Drag">
            {NEWS.map((n) => (
              <a
                key={n.title}
                href="#news"
                className="group flex w-[280px] flex-col gap-4 sm:w-[340px]"
              >
                <ParallaxImage
                  src={n.image}
                  speed={1.12}
                  className="aspect-[4/3] w-full ring-1 ring-white/10 transition-transform duration-[600ms] ease-out group-hover:scale-[1.02]"
                />
                <h3 className="text-[18px] font-medium leading-snug tracking-tight">{n.title}</h3>
                <p className="text-[14px] leading-relaxed text-white/50">{n.blurb}</p>
              </a>
            ))}
          </DragRail>
        </Reveal>
      </div>
    </section>
  )
}
