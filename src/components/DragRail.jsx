import { useEffect, useRef } from 'react'
import { useCursor } from '../context/CursorContext.jsx'

/**
 * A horizontal card row you can grab and throw, and optionally one that runs
 * on its own as a ticker.
 *
 * Wheel and trackpad scrolling still work; this adds pointer dragging on top.
 * Details that make it feel right rather than fighting the browser:
 *
 *  - scroll snapping is switched off for the duration of a drag. With
 *    `scroll-snap-type: x mandatory` left on, every scrollLeft write snaps back
 *    to a card and the row judders instead of following the pointer.
 *  - releasing applies the pointer's own velocity as momentum, so a flick
 *    coasts and decays rather than stopping dead.
 *  - a drag that moved more than a few pixels swallows the click that follows,
 *    so dragging across a card never opens it.
 *  - pointer capture means leaving the rail mid-drag doesn't drop the gesture.
 *
 * ## Ticker mode (`autoScroll`)
 *
 * The row creeps continuously and wraps seamlessly, and it **stops the moment
 * the pointer is over it** so anything being read stays still — then resumes
 * on leave. Dragging works throughout and takes priority.
 *
 * The caller must render its items TWICE for this. The loop distance is then
 * measured as the offset of the first duplicate, which is exact — deriving it
 * from `scrollWidth / 2` is off by half a flex gap and shows as a small jump
 * on every wrap.
 */
export default function DragRail({
  cursorLabel = 'Drag',
  autoScroll = false,
  speed = 0.45, // px per frame
  className = '',
  children,
}) {
  const railRef = useRef(null)
  const { hoverCursor, resetCursor } = useCursor()
  const labelRef = useRef(cursorLabel)
  labelRef.current = cursorLabel

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ticking = autoScroll && !reduced

    let dragging = false
    let hovering = false
    let gliding = false
    let startX = 0
    let startScroll = 0
    let lastX = 0
    let lastT = 0
    let velocity = 0
    let moved = 0
    let raf = 0
    let tickRaf = 0

    // A ticker must never snap — snapping would drag it back every frame.
    if (ticking) rail.style.scrollSnapType = 'none'

    /** Exact loop distance: where the duplicated first item starts. */
    const loopWidth = () => {
      const kids = rail.children
      const half = Math.floor(kids.length / 2)
      if (!half || !kids[half]) return rail.scrollWidth / 2
      return kids[half].offsetLeft - kids[0].offsetLeft
    }

    // Native mouseenter/mouseleave rather than React's synthetic props: these
    // fire on the rail itself and are not re-triggered by moving across the
    // cards inside it, so the badge stays put for the whole row.
    const onEnter = () => {
      hovering = true
      if (labelRef.current) hoverCursor(labelRef.current)
    }
    const onLeave = () => {
      hovering = false
      resetCursor()
    }
    rail.addEventListener('mouseenter', onEnter)
    rail.addEventListener('mouseleave', onLeave)

    const onDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return
      dragging = true
      gliding = false
      moved = 0
      velocity = 0
      startX = e.clientX
      lastX = e.clientX
      lastT = performance.now()
      startScroll = rail.scrollLeft
      cancelAnimationFrame(raf)
      rail.style.scrollSnapType = 'none'
      rail.style.userSelect = 'none'
      rail.setPointerCapture?.(e.pointerId)
    }

    const onMove = (e) => {
      if (!dragging) return
      const dx = e.clientX - startX
      moved = Math.max(moved, Math.abs(dx))
      rail.scrollLeft = startScroll - dx

      const now = performance.now()
      const dt = Math.max(8, now - lastT)
      velocity = (e.clientX - lastX) / dt
      lastX = e.clientX
      lastT = now
    }

    const glide = () => {
      velocity *= 0.94
      rail.scrollLeft -= velocity * 16
      if (Math.abs(velocity) > 0.02) {
        raf = requestAnimationFrame(glide)
      } else {
        gliding = false
        if (!ticking) rail.style.scrollSnapType = ''
      }
    }

    const onUp = (e) => {
      if (!dragging) return
      dragging = false
      rail.style.userSelect = ''
      try {
        rail.releasePointerCapture?.(e.pointerId)
      } catch {}
      if (Math.abs(velocity) > 0.05) {
        gliding = true
        raf = requestAnimationFrame(glide)
      } else if (!ticking) {
        rail.style.scrollSnapType = ''
      }
    }

    const onClick = (e) => {
      if (moved > 6) {
        e.preventDefault()
        e.stopPropagation()
        moved = 0
      }
    }

    const onDragStart = (e) => e.preventDefault()

    rail.addEventListener('pointerdown', onDown)
    rail.addEventListener('pointermove', onMove)
    rail.addEventListener('pointerup', onUp)
    rail.addEventListener('pointercancel', onUp)
    rail.addEventListener('click', onClick, true)
    rail.addEventListener('dragstart', onDragStart)

    // ── the ticker ────────────────────────────────────────────────
    if (ticking) {
      const tick = () => {
        tickRaf = requestAnimationFrame(tick)
        const loop = loopWidth()
        if (loop > 0) {
          // wrap in both directions so a backwards drag stays seamless too
          if (rail.scrollLeft >= loop) rail.scrollLeft -= loop
          else if (rail.scrollLeft < 0) rail.scrollLeft += loop
        }
        // hovering, dragging or coasting all hold the ticker still
        if (hovering || dragging || gliding) return
        rail.scrollLeft += speed
      }
      tickRaf = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(tickRaf)
      rail.removeEventListener('mouseenter', onEnter)
      rail.removeEventListener('mouseleave', onLeave)
      rail.removeEventListener('pointerdown', onDown)
      rail.removeEventListener('pointermove', onMove)
      rail.removeEventListener('pointerup', onUp)
      rail.removeEventListener('pointercancel', onUp)
      rail.removeEventListener('click', onClick, true)
      rail.removeEventListener('dragstart', onDragStart)
    }
  }, [autoScroll, speed, hoverCursor, resetCursor])

  return (
    <div
      ref={railRef}
      className={`rail ${className}`}
      style={cursorLabel ? { cursor: 'none' } : undefined}
    >
      {children}
    </div>
  )
}
