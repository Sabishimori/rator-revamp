# Rator Studios — site

React + Vite + Framer Motion + Tailwind.

```bash
npm install
npm run dev
```

> **Note on scope.** This repo was created from scratch. The brief described a
> revamp of an existing Rator Studios codebase, but the project directory
> contained no application code — only two standalone HTML concept documents
> (`rator-caliber-01.html`, `rator-site.html`) from an earlier design pass.
> There was nothing to restructure in place, so the stack in the brief was
> scaffolded new and the full section spec implemented on top of it. The two
> HTML files are untouched and unrelated to this app.

## Structure

```
src/
  App.jsx                     section order + ground rhythm
  data/content.js             every string, number and colour on the site
  context/CursorContext.jsx   contextual hover cursor state
  hooks/useSectionTheme.js    which section sits behind the header
  components/
    Header.jsx                floating frosted pill nav
    CustomCursor.jsx          trailing pill cursor
    Reveal.jsx                the one scroll-entry animation
    ProjectMedia.jsx          looping video sample in a project card
    ParallaxImage.jsx         image that drifts inside its frame on scroll
    Marquee.jsx               the one always-on motion on the page
    Hero.jsx  WorkSection.jsx  Capabilities.jsx  Reach.jsx  Stats.jsx
    Outcomes.jsx  Testimonials.jsx  ClientGrid.jsx  News.jsx
    ContactCTA.jsx  Footer.jsx
```

Section order and ground tone were both read off the reference's own section
list, not guessed:

| # | Section | Tone |
|---|---|---|
| 1 | Hero | dark |
| 2 | Work | light |
| 3 | Capabilities | light |
| 4 | Reach — word wall + cursor image trail | dark |
| 5 | Stats / About | light |
| 6 | Outcomes | light |
| 7–11 | Testimonials, Clients, News, Contact, Footer | dark |

So the page runs **dark → light → dark → light → dark**, and everything from
the testimonials down stays dark.

## Project media

Every project card loops a short video sample (`ProjectMedia.jsx`) rather than
showing stacked collage stills. Three things keep that affordable with seven
cards on one page:

- playback is driven by an IntersectionObserver, so only on-screen cards decode
- `preload="metadata"` keeps initial weight down; the poster carries the card
  until the first frame is ready
- a failed source or `prefers-reduced-motion` falls back to the poster image
  rather than a broken element

The clips currently wired up are open test footage (MDN CC0 assets and
test-videos.co.uk) standing in for Rator's real films. Replace `video` on each
entry in `PROJECTS` — ideally short, silent, ~8 second loops served locally
from `public/work/`.

## Hero zoom

The plate **zooms outward** — mid-size rectangle to full bleed — then holds and
scrolls away. It does not shrink.

That curve was measured directly off the reference, which sizes its own hero
wrapper (a div it calls `.revelatio-tv`) at a 1440x900 viewport:

| scroll | size | position |
|---|---|---|
| 0 | 864 x 540 | centred, 60% of viewport width |
| 600 | 1090 x 681 | |
| 1200 | 1316 x 822 | |
| 1800 | 1440 x 840 | full bleed, then releases |

Its measured `border-radius` is `0px`, so the corners stay square throughout.

`Hero.jsx` reproduces this over a 300vh range, reaching full bleed at 0.62 and
holding until the sticky releases.

Tuning knobs: `h-[300vh]` sets how long the zoom takes; the `0.62` stop in the
`width`/`height` transforms sets how early it reaches full bleed.

## Nav tint

Sections declare `data-nav="dark"` or `data-nav="light"`.
`useSectionTheme` reads bounding rects on scroll and reports whichever section
crosses y = 44px. Rects rather than IntersectionObserver, because what matters
is one specific y — the middle of the header — not how much of a section is
visible.

## Custom cursor

`CursorProvider` holds `{ variant, label }`. Any card opts in with
`useHoverLabel('View project')`, which returns the enter/leave handlers plus
`cursor: none` scoped to that element — the native cursor is untouched
everywhere else. Pointer position is written straight to motion values, so
moving the mouse never re-renders React. Hidden on coarse-pointer devices.

## Capabilities and Reach

These are two separate sections, which is how the reference does it:

**Capabilities** (`Capabilities.jsx`) is deliberately plain — a light ground
with five columns of service lists under small grey headings. The only motion
is a per-line stagger on entry, which is what gives the list its cascade.

**Reach** (`Reach.jsx`) is the dark counterpart: a large wrapping wall of
discipline names, most dimmed with a handful lit bright, over a pool of image
tiles that follow the pointer and fade out behind it. A new tile is only placed
once the pointer has travelled `STEP` pixels from the last one, so the trail
spaces itself instead of smearing, and positions are written straight to the
DOM — moving the mouse never re-renders React.

The wall lists disciplines rather than cities: a list of places would imply a
geographic footprint the studio has not claimed.

## Content

All copy lives in `src/data/content.js`.

Project and client names are Rator Studios' real ones. **Stats, outcome
metrics, testimonials and news entries are invented placeholders** — the
testimonial names and companies are fictional. That is stated on the page
itself in the footer via `PLACEHOLDER_NOTE`. Replace those four exports with
real data before this goes anywhere public; no component needs to change.

## Accessibility / motion

`prefers-reduced-motion` is honoured throughout: `Reveal` renders statically,
the halftone freezes its clock, the parallax and cursor springs go to zero, the
glitch stops, and counters jump to their final value.
