import { motion, useReducedMotion } from 'framer-motion'

/**
 * The one scroll-entry animation used site-wide: fade plus a short rise,
 * fired once when the element first reaches the viewport.
 */
export default function Reveal({ children, delay = 0, y = 28, className = '', as = 'div' }) {
  const reduced = useReducedMotion()
  const MotionTag = motion[as] || motion.div

  if (reduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 0.8, 0.24, 1] }}
    >
      {children}
    </MotionTag>
  )
}
