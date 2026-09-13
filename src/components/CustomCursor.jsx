import { useEffect } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useCursor } from '../context/CursorContext.jsx'

/**
 * Sizes measured off the reference rather than guessed:
 *
 *   hover badge   74 x 24, radius 3px, rgba(29,29,29,.6), 10.5px text,
 *                 9px horizontal padding
 *   idle dot      12 x 12, white, fully round
 *
 * The badge is much smaller and lighter than a typical pill — it reads as a
 * label riding the pointer, not a button.
 *
 * Position is written straight to motion values, so moving the mouse never
 * triggers a React render.
 */
export default function CustomCursor() {
  const { variant, label } = useCursor()
  const reduced = useReducedMotion()

  const x = useMotionValue(-200)
  const y = useMotionValue(-200)

  // trails a touch behind the real pointer — that lag is what reads as elastic
  const spring = { stiffness: 380, damping: 34, mass: 0.6 }
  const sx = useSpring(x, spring)
  const sy = useSpring(y, spring)

  useEffect(() => {
    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [x, y])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  const hovering = variant === 'hover'

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[95] hidden md:block"
      style={{ x: reduced ? x : sx, y: reduced ? y : sy }}
    >
      <div className="relative">
        {/* No mode="wait": that holds the incoming badge until the outgoing
            dot has finished its exit animation, which makes the cursor feel
            laggy and stalls entirely if animations are throttled. */}
        <AnimatePresence initial={false}>
          {hovering ? (
            <motion.div
              key="badge"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 520, damping: 30 }}
              style={{ x: '-50%', y: '-50%' }}
              className="absolute left-0 top-0 flex h-6 items-center whitespace-nowrap rounded-[3px] bg-rator-accent px-[9px] text-[10.5px] leading-none text-white backdrop-blur-[6px]"
            >
              {label}
            </motion.div>
          ) : (
            <motion.div
              key="dot"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 520, damping: 30 }}
              style={{ x: '-50%', y: '-50%' }}
              className="absolute left-0 top-0 h-3 w-3 rounded-full bg-white mix-blend-difference"
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
