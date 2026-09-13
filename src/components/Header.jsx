import { motion } from 'framer-motion'
import { NAV_LINKS } from '../data/content.js'
import useSectionTheme from '../hooks/useSectionTheme.js'

/**
 * Shape taken from the reference, measured at a 1440 viewport:
 *
 *   .navbar            fixed, padding 12px 0
 *   .navbar-component  inset 30px from each edge, 39px tall, space-between
 *   .navbar-actions    radius 4px, rgba(255,255,255,.16), blur(12px),
 *                      padding 10.5px 12px  <- a rounded RECTANGLE, not a pill
 *   right side         two separate boxes of the same treatment:
 *                      the locale switch (64px) and "Get in touch" (77px)
 *
 * Font is ~12px, regular weight, sentence case, no tracking.
 */
export default function Header() {
  const theme = useSectionTheme(44)
  const light = theme === 'light'

  /**
   * One frosted treatment, reused by all three boxes.
   *
   * The tint inverts hard against whatever sits behind it: over a light
   * section the bar goes near-black, over a dark one it lifts to a bright
   * frost. A subtle tint in both directions was not enough to keep the nav
   * readable over photography and white sections alike.
   */
  const box = `rounded-[5px] backdrop-blur-[14px] transition-colors duration-500 ${
    light
      ? 'bg-black/80 text-white ring-1 ring-black/10'
      : 'bg-white/[0.22] text-white ring-1 ring-white/15'
  }`
  const muted = light ? 'text-white/65' : 'text-white/65'
  const hover = 'hover:text-white'

  return (
    <motion.header
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 0.8, 0.24, 1] }}
      className="fixed inset-x-0 top-0 z-[80] py-4"
    >
      <div className="mx-auto flex w-full items-center justify-between px-5 sm:px-6 lg:px-[30px]">
        {/* left box — wordmark plus links */}
        <nav className={`flex h-[46px] items-center gap-5 px-4 text-[13.5px] ${box}`}>
          <a href="#hero" className="text-[14px] font-medium tracking-[0.15em]" aria-label="Rator Studios, top">
            RATOR
          </a>
          <ul className="hidden items-center gap-4 md:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} className={`transition-colors duration-300 ${muted} ${hover}`}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* right — two separate boxes, same treatment */}
        <div className="flex items-center gap-2.5">
          <div className={`hidden h-[46px] items-center px-4 text-[13.5px] sm:flex ${box}`}>
            <span>EN</span>
            <span className={muted}>&nbsp;PT&nbsp;/</span>
          </div>
          <a
            href="#contact"
            className={`flex h-[46px] items-center px-4 text-[13.5px] ${box}`}
          >
            Get in touch
          </a>
        </div>
      </div>
    </motion.header>
  )
}
