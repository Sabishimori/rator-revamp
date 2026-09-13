/**
 * Film grain and texture, sitting above the whole page.
 *
 * Two fixed layers, both `pointer-events-none` so nothing below is blocked:
 * a jittering turbulence tile for the grain, and a very soft vignette to take
 * the hard edge off the corners. `mix-blend-mode: overlay` lets one grain
 * layer read correctly over both the dark and the light sections instead of
 * needing a separate treatment for each.
 */
export default function GrainOverlay() {
  return (
    <>
      <div aria-hidden="true" className="grain-layer" />
      <div aria-hidden="true" className="vignette-layer" />
    </>
  )
}
