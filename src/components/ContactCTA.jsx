import Reveal from './Reveal.jsx'
import { CONTACT } from '../data/content.js'

/** Section 10 — the CTA. Dark, immediately before the footer. */
export default function ContactCTA() {
  return (
    <section id="contact" data-nav="dark" className="bg-black pb-24 text-white sm:pb-28">
      <div className="shell">
        <Reveal>
          <div className="flex flex-col items-start gap-10 border-t border-white/10 pt-14 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <img
                src={CONTACT.photo}
                alt=""
                loading="lazy"
                className="h-16 w-16 rounded-full object-cover ring-1 ring-white/15"
              />
              <span className="flex flex-col">
                <b className="text-[17px] font-medium">{CONTACT.name}</b>
                <span className="text-[14px] text-white/45">{CONTACT.title}</span>
              </span>
            </div>

            <div className="max-w-[40ch]">
              <h2 className="text-[clamp(22px,2.6vw,34px)] font-medium leading-[1.15] tracking-tightest">
                Want to talk about a project?
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/50">{CONTACT.prompt}</p>
            </div>

            <a
              href={`mailto:${CONTACT.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-rator-accent px-7 py-4 text-[15px] text-white transition-colors duration-300 hover:bg-white hover:text-black"
            >
              {CONTACT.cta}
              <span>→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
