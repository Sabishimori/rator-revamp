/**
 * An image that drifts inside its frame as the page scrolls.
 *
 * The movement is ScrollSmoother's, declared rather than animated: `data-speed`
 * tells the smoother to move this element at a different rate from the page,
 * and it drives that from the same loop it already runs for everything else.
 * This component used to keep its own requestAnimationFrame loop reading
 * `getBoundingClientRect()` every frame — six instances meant six loops all
 * forcing layout. That is all gone.
 *
 * `clamp()` is what makes it safe. A bare `data-speed="1.15"` keeps moving the
 * image past the ends of its scroll range, which shows as the frame emptying
 * out at the top and bottom of the page. Wrapping it — `clamp(1.15)` — tells
 * ScrollSmoother to constrain the effect to the element's natural range, so it
 * drifts in the middle and sits flush at the extremes.
 *
 * The frame clips and the image is oversized (`scale`), so even the clamped
 * drift never exposes an edge.
 *
 * `effects: true` on the smoother is what activates these attributes; without
 * it they are inert and the image simply sits still.
 */
export default function ParallaxImage({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  speed = 1.15,
  scale = 1.18,
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        data-speed={`clamp(${speed})`}
        style={{ transform: `scale(${scale})` }}
        className={`h-full w-full object-cover will-change-transform ${imgClassName}`}
      />
    </div>
  )
}
