/**
 * A continuously scrolling strip.
 *
 * The track holds the list twice and slides exactly -50%, so the loop is
 * seamless. This is the page's one piece of motion that runs whether or not
 * anyone is scrolling — without it the page sits perfectly still at rest.
 */
export default function Marquee({ items, duration = 46, className = '' }) {
  const run = [...items, ...items]

  return (
    <div
      aria-hidden="true"
      className={`marquee border-y border-white/10 py-5 ${className}`}
    >
      <div className="marquee-track" style={{ '--marquee-duration': `${duration}s` }}>
        {run.map((item, i) => (
          <span key={`${item}-${i}`} className="marquee-item">
            {item}
            <i className="marquee-dot">•</i>
          </span>
        ))}
      </div>
    </div>
  )
}
