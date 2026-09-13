import { useEffect, useState } from 'react'
import { CONTACT, FOOTER_LINKS, NAV_LINKS, PLACEHOLDER_NOTE, SOCIALS } from '../data/content.js'

function useClock(timeZone) {
  const [t, setT] = useState('--:--:--')
  useEffect(() => {
    const fmt = () => {
      try {
        return new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone,
        }).format(new Date())
      } catch {
        return '--:--:--'
      }
    }
    setT(fmt())
    const id = setInterval(() => setT(fmt()), 1000)
    return () => clearInterval(id)
  }, [timeZone])
  return t
}

function localLabel() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    return tz.split('/').pop().replace(/_/g, ' ') || 'Local'
  } catch {
    return 'Local'
  }
}

export default function Footer() {
  const local = useClock(undefined)
  const ist = useClock('Asia/Kolkata')

  return (
    <footer id="footer" data-nav="dark" className="bg-black pb-14 pt-20 text-white">
      {/* RGB-split glitch, scoped to this component */}
      <style>{`
        @keyframes ratorSplit {
          0%,100% { text-shadow: 0.02em 0 0 rgba(91,43,255,.9), -0.02em 0 0 rgba(0,209,255,.7); }
          22%     { text-shadow: -0.05em 0 0 rgba(91,43,255,.9), 0.045em 0 0 rgba(0,209,255,.7); }
          46%     { text-shadow: 0.045em -0.01em 0 rgba(91,43,255,.9), -0.05em 0.01em 0 rgba(0,209,255,.7); }
          68%     { text-shadow: -0.02em 0.01em 0 rgba(91,43,255,.9), 0.03em -0.01em 0 rgba(0,209,255,.7); }
        }
        .glitch { animation: ratorSplit 4.2s steps(1, end) infinite; }
        @media (prefers-reduced-motion: reduce) { .glitch { animation: none; } }
      `}</style>

      <div className="shell">
        {/* live clocks */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 text-[13px] text-white/50">
          <span>
            Your timezone ({localLabel()}) <b className="font-normal text-white">{local}</b>
          </span>
          <span>
            Rator Studios timezone (IN) <b className="font-normal text-white">{ist}</b>
          </span>
        </div>

        <h2 className="glitch mt-14 max-w-[12ch] text-[clamp(38px,7.4vw,104px)] font-medium leading-[0.98] tracking-tightest">
          Let&rsquo;s build something together
        </h2>

        {/* three link rows */}
        <div className="mt-14 border-t border-white/10">
          {FOOTER_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="group flex items-center justify-between gap-6 border-b border-white/10 py-6 transition-colors duration-300 hover:bg-white/[0.03]"
            >
              <span className="text-[clamp(19px,2.2vw,28px)] tracking-tight group-hover:underline">
                {l.label}
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-full border border-white/20 transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black">
                →
              </span>
            </a>
          ))}
        </div>

        {/* bottom */}
        <div className="mt-14 flex flex-wrap justify-between gap-10 text-[14px]">
          <div className="flex flex-col gap-1.5">
            <span className="mb-1 text-[12px] uppercase tracking-[0.14em] text-white/35">
              Location
            </span>
            {CONTACT.address.map((a) => (
              <span key={a} className="text-white/55">
                {a}
              </span>
            ))}
            <a href={`mailto:${CONTACT.email}`} className="text-white/55 hover:text-white">
              {CONTACT.email}
            </a>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="mb-1 text-[12px] uppercase tracking-[0.14em] text-white/35">
              Sitemap
            </span>
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="text-white/55 hover:text-white">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="mb-1 text-[12px] uppercase tracking-[0.14em] text-white/35">
              Social
            </span>
            {SOCIALS.map((s) => (
              <a key={s} href="#footer" className="text-white/55 hover:text-white">
                {s}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-1.5 text-white/40">
            <span className="mb-1 text-[12px] uppercase tracking-[0.14em] text-white/35">
              &nbsp;
            </span>
            <span>© Rator Studios {new Date().getFullYear()}</span>
            <a href="#footer" className="hover:text-white">
              Privacy notice
            </a>
          </div>
        </div>

        <p className="mt-12 flex items-start gap-2 text-[12px] leading-relaxed text-white/30">
          <span className="text-white/20">◆</span>
          {PLACEHOLDER_NOTE}
        </p>
      </div>
    </footer>
  )
}
