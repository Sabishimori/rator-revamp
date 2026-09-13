import Reveal from './Reveal.jsx'
import ProjectMedia from './ProjectMedia.jsx'
import { useHoverLabel } from '../context/CursorContext.jsx'
import { PROJECTS, WORK_STATEMENT } from '../data/content.js'

/**
 * Selected work, as a calm editorial grid.
 *
 * A centred statement opens the section, then a three-column grid of cards.
 * Each card is a looping sample with the project name, a one-line descriptor
 * and its disciplines as small pills.
 *
 * The ground is a soft wash — white at the top fading into a pale tint of the
 * brand violet behind the grid — so the section lifts away from the black
 * sections either side of it without introducing a second colour.
 */

function ArrowButton({ children, href = '#work', tone = 'dark' }) {
  const dark = tone === 'dark'
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-3 text-[15px] ${
        dark ? 'text-black' : 'text-white'
      }`}
    >
      {children}
      <span
        className={`grid h-8 w-8 place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-1 ${
          dark ? 'bg-black text-white' : 'bg-white text-black'
        }`}
      >
        →
      </span>
    </a>
  )
}

export default function WorkGrid() {
  const hover = useHoverLabel('View project')

  return (
    <section id="work" data-nav="light" className="relative overflow-hidden bg-white text-black">
      {/* soft ground: white above, a pale brand tint behind the grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 34%, #F4F1FF 62%, #EBE6FF 100%)',
        }}
      />

      <div className="shell relative py-24 sm:py-32">
        {/* the section says what it is */}
        <Reveal>
          <p className="text-center text-[13px] uppercase tracking-[0.18em] text-black/40">
            Selected Work — Projects
          </p>
        </Reveal>

        {/* centred statement, one phrase carrying the weight */}
        <Reveal delay={0.05}>
          <h2 className="mx-auto mt-8 max-w-[20ch] text-center text-[clamp(28px,4.4vw,60px)] font-normal leading-[1.14] tracking-tightest">
            {WORK_STATEMENT.map((run, i) => (
              <span key={i} className={run.bold ? 'font-semibold' : undefined}>
                {run.t}
              </span>
            ))}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex justify-center">
            <ArrowButton href="#studio">About us</ArrowButton>
          </div>
        </Reveal>

        {/* the grid */}
        <div className="mt-20 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <Reveal key={project.id} delay={0.05 * (i % 3)}>
              <article className="group">
                <a href="#work" {...hover} className="block">
                  <ProjectMedia
                    src={project.video}
                    poster={project.image}
                    alt={project.name}
                    className="aspect-[16/10] w-full rounded-xl ring-1 ring-black/5 transition-transform duration-[600ms] ease-out group-hover:scale-[1.015]"
                  />
                </a>

                <h3 className="mt-5 text-[19px] font-semibold tracking-tight">{project.name}</h3>
                <p className="mt-1.5 text-[15px] text-black/55">{project.tagline}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-black/[0.06] px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-black/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20">
          <div className="flex justify-center">
            <ArrowButton>View all projects</ArrowButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
