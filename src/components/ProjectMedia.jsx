import { useEffect, useRef, useState } from 'react'

/**
 * A looping video sample filling a project card.
 *
 * Three things make this safe to put on every card at once:
 *
 *  - it only plays while on screen (IntersectionObserver drives play/pause),
 *    so seven cards don't decode seven streams simultaneously
 *  - `preload="metadata"` keeps the initial page weight down; the poster still
 *    carries the card until the first frame is ready
 *  - if the source fails or the viewer prefers reduced motion, it falls back
 *    to the poster image rather than showing a broken element
 */
export default function ProjectMedia({ src, poster, alt = '', className = '' }) {
  const hostRef = useRef(null)
  const videoRef = useRef(null)
  const [failed, setFailed] = useState(!src)

  useEffect(() => {
    const host = hostRef.current
    const video = videoRef.current
    if (!host || !video || failed) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFailed(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play?.().catch(() => {})
        else video.pause?.()
      },
      { threshold: 0.15 }
    )
    io.observe(host)
    return () => io.disconnect()
  }, [failed])

  return (
    <div ref={hostRef} className={`relative overflow-hidden ${className}`}>
      {/* poster sits underneath: covers the first paint and any failure */}
      {poster && (
        <img
          src={poster}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {!failed && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
