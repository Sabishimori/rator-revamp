import { createContext, useCallback, useContext, useMemo, useState } from 'react'

/**
 * Drives the contextual hover cursor (Addon A).
 *
 * Any card can call `hoverCursor('View project')` on mouse enter and
 * `resetCursor()` on leave. The cursor element itself lives once, at the
 * top of the layout, so nothing re-renders as the pointer moves.
 */
const CursorContext = createContext({
  variant: 'default',
  label: '',
  hoverCursor: () => {},
  resetCursor: () => {},
})

export function CursorProvider({ children }) {
  const [state, setState] = useState({ variant: 'default', label: '' })

  const hoverCursor = useCallback((label) => {
    setState({ variant: 'hover', label })
  }, [])

  const resetCursor = useCallback(() => {
    setState({ variant: 'default', label: '' })
  }, [])

  const value = useMemo(
    () => ({ ...state, hoverCursor, resetCursor }),
    [state, hoverCursor, resetCursor]
  )

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>
}

export function useCursor() {
  return useContext(CursorContext)
}

/**
 * Spread onto any hoverable card to get the pill cursor plus `cursor: none`
 * scoped to that element only — the native cursor is untouched elsewhere.
 */
export function useHoverLabel(label) {
  const { hoverCursor, resetCursor } = useCursor()
  return {
    onMouseEnter: () => hoverCursor(label),
    onMouseLeave: resetCursor,
    style: { cursor: 'none' },
  }
}
