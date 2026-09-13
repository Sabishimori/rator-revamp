/**
 * Every string, number and colour the site renders lives here.
 *
 * Client and project names are Rator Studios' real ones. Everything
 * quantitative — stats, outcome metrics, testimonials, news — is
 * placeholder and marked as such in `PLACEHOLDER_NOTE`. Swap these
 * objects for real data and no component needs to change.
 */

/**
 * Stock imagery. Lorem Picsum is a placeholder image service — seeded URLs so
 * each card keeps the same photo between reloads. Swap these for real stills
 * and nothing else has to change.
 */
export const stock = (seed, w = 1200, h = 800) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

export const PLACEHOLDER_NOTE =
  'Stats, outcome metrics, testimonials and news entries are placeholders.'

export const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Approach', href: '#capabilities' },
  { label: 'About', href: '#about' },
  { label: 'Careers', href: '#careers' },
]

export const HERO = {
  headline: ['Strategy, Design & Film.', 'One connected process.'],
  kicker: 'Rator Studios — Bengaluru',

  /**
   * The hero plays a normal video — drop the showreel at `public/reel.mp4`
   * and it is picked up automatically. Until that file exists the hero falls
   * back to a graded plate so the layout still reads correctly.
   *
   * Use a short, silent, muted loop: it autoplays, and browsers block
   * autoplay on anything with audio.
   */
  // Must send Access-Control-Allow-Origin: the hero warps this through a
  // WebGL shader, and a cross-origin source without CORS taints the texture.
  // Swap for a local file at `public/reel.mp4` (same-origin, so always fine).
  video: 'https://mdn.github.io/shared-assets/videos/flower.mp4',
  poster: 'https://picsum.photos/seed/rator-reel/1600/1000',
}

export const WORK_INTRO = [
  'We partner with companies',
  'that need to be understood,',
  'not just seen.',
]

/**
 * The statement above the project grid. Split into runs so one phrase can be
 * set bold inside an otherwise regular-weight sentence.
 */
export const WORK_STATEMENT = [
  { t: 'We’re building a ' },
  { t: 'brand film studio', bold: true },
  { t: ' to make the work people actually remember' },
]

export const WORK_FILTERS = ['Branding', 'Website', 'Films', 'Campaign']

/**
 * `accent` drives each card's background. One vivid colour per project —
 * the only place on the site that uses colour other than the red accent.
 *
 * `image` is the real project still, taken from ratorstudios.com. The cards
 * crop it to their own aspect with `object-fit: cover`.
 *
 * `video` is null on purpose. It used to hold open test footage, which then
 * autoplayed on top of these stills and hid them. Put a real cut back in — a
 * short, silent loop, ideally served locally from `public/work/` — and the
 * card starts playing it over the still automatically.
 */
export const PROJECTS = [
  {
    id: 'schneider',
    tagline: 'Making complex energy systems legible',
    video: null,
    image: 'https://framerusercontent.com/images/SPqmVOL0GMLqQlwvP7EmcE3gZc.png',
    name: 'Schneider Electric',
    tags: ['Films', 'Strategy'],
    accent: '#2B5CE6',
    runtime: '04:12',
    year: '2025',
    description:
      'Explainer and internal communication films for a global energy business — turning systems a boardroom and a factory floor both depend on into four minutes either can follow.',
    featured: true,
  },
  {
    id: 'nxtmeal',
    tagline: 'A food brand built to scale with its menu',
    video: null,
    image: 'https://framerusercontent.com/images/GSpzDzYUB9iJiMsfpQMoypordrs.png',
    name: 'Nxtmeal',
    tags: ['Branding', 'Strategy'],
    accent: '#E8541F',
    runtime: '01:47',
    year: '2025',
    description:
      'Positioning, messaging framework and an identity system built to hold together as the menu, the market and the team all grew at once.',
  },
  {
    id: 'blubeez',
    tagline: 'A character that carries a young brand',
    video: null,
    image: 'https://framerusercontent.com/images/iFdeX5NTrQcjw5N35F8CYx9MvRI.png',
    name: 'Blubeez',
    tags: ['Branding', 'Social'],
    accent: '#0FA3A3',
    runtime: '00:58',
    year: '2024',
    description:
      'Mascot design and brand strategy giving a young brand a character that carries its own weight across social, without a media budget behind it.',
  },
  {
    id: 'cookease',
    tagline: 'One launch idea across film, print and retail',
    video: null,
    image: 'https://framerusercontent.com/images/8eyK4aONW2KamYuB8wNtyiZMnOU.png',
    name: 'Cook Ease',
    tags: ['Campaign', 'Design'],
    accent: '#7C3AED',
    runtime: '02:05',
    year: '2024',
    description:
      'Launch campaign and communication design — one idea stretched across film, print and retail so the launch read as a single thing everywhere it landed.',
  },
  {
    id: 'flekt',
    tagline: 'A running narrative, not a content calendar',
    video: null,
    image: 'https://framerusercontent.com/images/sXxmkWIeAdMCBLwRnwhRzly3tkM.jpeg',
    name: 'Flekt',
    tags: ['Campaign', 'Strategy'],
    accent: '#0EA5E9',
    runtime: '01:20',
    year: '2024',
    description:
      'Campaign design and content strategy built around one running narrative instead of a content calendar. Fewer posts, a story that accumulates.',
  },
  {
    id: 'sajja',
    tagline: 'A quiet system that lets the product talk',
    video: null,
    image: 'https://framerusercontent.com/images/pdf0QSNpuyYwKVTUZL6sDIWu7s.png',
    name: 'Sajja',
    tags: ['Branding'],
    accent: '#CA8A04',
    runtime: '01:36',
    year: '2023',
    description:
      'A visual identity deliberately quiet enough to let the product talk, and structured enough to survive being handed to someone else.',
  },
]

/**
 * Capabilities render as plain multi-column lists on a light ground —
 * a small group heading with its services beneath it.
 */
export const CAPABILITY_GROUPS = [
  {
    title: 'Brand Strategy',
    items: [
      'Brand audit & diagnosis',
      'Market & competitive read',
      'Positioning strategy',
      'Messaging framework',
      'Narrative frameworks',
      'Verbal identity',
      'Brand architecture',
      'Naming',
      'Go-to-market',
    ],
  },
  {
    title: 'Brand & Visual System',
    items: [
      'Logo & identity systems',
      'Visual identity development',
      'Brand design systems',
      'Art direction',
      'Print design',
      'Packaging design',
      'Motion & dynamic branding',
      'Brand applications',
      'Creative direction',
    ],
  },
  {
    title: 'Films',
    items: [
      'Brand films',
      'Culture stories',
      'Founder films',
      'Explainer films',
      'Internal communication',
      'Testimonial films',
      'Digital ads',
      'Promotional videos',
      'Launch films',
    ],
  },
  {
    title: 'Production & Post',
    items: [
      'Creative direction',
      'Scripting & storyboarding',
      'Direction',
      'Cinematography',
      'Editorial',
      'Sound design',
      'Colour grading',
      'Motion graphics',
      'Subtitling & localisation',
    ],
  },
  {
    title: 'Campaign & Comms',
    items: [
      'Campaign design',
      'Launch communication',
      'Visual communication',
      'Social systems',
      'Presentation & pitch design',
      'Internal comms',
      'Editorial design',
      'Rollout & asset kits',
    ],
  },
]

/**
 * The dark word wall. A few entries are `lit` — rendered bright against the
 * dimmed rest, so the block reads as a texture with highlights rather than a
 * flat paragraph.
 *
 * These are disciplines rather than cities: a list of places would imply a
 * geographic footprint the studio has not claimed.
 */
export const REACH_WORDS = [
  { w: 'Brand films' },
  { w: 'Positioning', lit: true },
  { w: 'Messaging frameworks' },
  { w: 'Culture stories' },
  { w: 'Identity systems', lit: true },
  { w: 'Explainer films' },
  { w: 'Campaign design' },
  { w: 'Naming' },
  { w: 'Art direction', lit: true },
  { w: 'Motion' },
  { w: 'Internal communication' },
  { w: 'Launch films' },
  { w: 'Founder films', lit: true },
  { w: 'Colour grading' },
  { w: 'Sound design' },
  { w: 'Verbal identity' },
  { w: 'Storyboarding' },
  { w: 'Cinematography', lit: true },
  { w: 'Content strategy' },
  { w: 'Brand architecture' },
]

export const STATS = [
  { label: 'Since', value: 2020, suffix: '', raw: true },
  { label: 'Projects', value: 300, suffix: '+' },
  { label: 'Countries', value: 9, suffix: '' },
  { label: 'Recognitions', value: 40, suffix: '+' },
]

export const ABOUT = {
  headline: ['Nothing here', 'happened', 'overnight.'],
  body: 'Rator Studios is an independent studio in Bengaluru working across sectors and borders. Each number is a step forward, shaped by real briefs, real constraints, and a standing refusal to start a film before the strategy is settled.',
  cta: 'Know us better',
}

export const OUTCOMES_INTRO = {
  headline: ['What happens after', 'the film goes live.'],
  body: 'Beyond delivery, the work is built to perform. These reflect how it behaves in practice — across markets, launches and stages of growth.',
}

export const OUTCOMES = [
  { client: 'Northwind Foods', figure: '+40%', caption: 'Conversion up 40% in the quarter following the site and identity redesign.' },
  { client: 'Kestrel Labs', figure: '+5k', caption: '5,000 signups in the first month after the launch film went out.' },
  { client: 'Meridian Health', figure: '92%', caption: 'Internal comms film watched to completion by 92% of a 4,000-person workforce.' },
  { client: 'Anvil & Co.', figure: '3×', caption: 'Average project value tripled after repositioning from content to brand film.' },
  { client: 'Saffron Grid', figure: '+250k', caption: 'Launch film crossed 250,000 views across paid and organic in six weeks.' },
  { client: 'Orbit Freight', figure: '−40%', caption: 'Onboarding time down 40% once the explainer series replaced the slide deck.' },
]

export const TESTIMONIALS = [
  {
    quote:
      'They refused to start shooting until we could say what we actually stood for. That was uncomfortable for about a week, and then it was the most useful thing anyone had done for us.',
    photo: 'https://picsum.photos/seed/rator-p1/200/200',
    name: 'Aarav Menon',
    role: 'Head of Brand',
    company: 'Northwind Foods',
    location: 'Mumbai, India',
  },
  {
    quote:
      'We came for a launch video and left with a positioning we still use in every sales conversation. The film was the part everyone saw. The thinking underneath it is what changed the business.',
    photo: 'https://picsum.photos/seed/rator-p2/200/200',
    name: 'Divya Raghunathan',
    role: 'Co-founder',
    company: 'Kestrel Labs',
    location: 'Bengaluru, India',
  },
  {
    quote:
      'Four thousand people watched a corporate internal film to the end. I have worked in comms for eleven years and I have never seen that number before.',
    photo: 'https://picsum.photos/seed/rator-p3/200/200',
    name: 'Thomas Beckett',
    role: 'Director of Communications',
    company: 'Meridian Health',
    location: 'Singapore',
  },
]

export const CLIENTS = [
  'Schneider Electric',
  'Nxtmeal',
  'Blubeez',
  'Cook Ease',
  'Flekt',
  'Sajja',
  'Northwind Foods',
  'Kestrel Labs',
  'Meridian Health',
  'Orbit Freight',
]

export const NEWS = [
  {
    title: 'Rator at the Bengaluru Brand Summit',
    image: `https://picsum.photos/seed/rator-news-1/900/700`,
    blurb: 'Two sessions on why strategy has to come before the camera.',
    accent: '#2B5CE6',
  },
  {
    title: 'Behind the Schneider Electric films',
    image: `https://picsum.photos/seed/rator-news-2/900/700`,
    blurb: 'A process note on shooting a factory floor without a shutdown.',
    accent: '#E8541F',
  },
  {
    title: 'We are hiring — Editor, Bengaluru',
    image: `https://picsum.photos/seed/rator-news-3/900/700`,
    blurb: 'Full-time, in studio. Brand films and long-form internal work.',
    accent: '#0FA3A3',
  },
  {
    title: 'Notes on writing a brand film',
    image: `https://picsum.photos/seed/rator-news-4/900/700`,
    blurb: 'Why the first ninety seconds decide everything that follows.',
    accent: '#7C3AED',
  },
  {
    title: 'Rator joins the Design Forward collective',
    image: `https://picsum.photos/seed/rator-news-5/900/700`,
    blurb: 'A working group on craft standards for Indian studios.',
    accent: '#0EA5E9',
  },
]

/**
 * The studio. Portraits are placeholder faces from pravatar — swap for the
 * real team, ideally shot against a plain wall so the duotone treatment reads.
 *
 * `roleHover` is the hover reaction: the line changes when you point at a
 * card, so each person gets a second, more candid answer to "what do you do
 * here".
 */
export const FOUNDERS = [
  {
    name: 'Arjun Rao',
    role: 'Founder & Creative Director',
    roleHover: 'Rewrites the ending',
    accent: '#5C6CC4',
    photo: 'https://i.pravatar.cc/600?img=12',
  },
  {
    name: 'Meera Iyer',
    role: 'Head of Strategy',
    roleHover: 'Asks the hard question',
    accent: '#9B8CD6',
    photo: 'https://i.pravatar.cc/600?img=45',
  },
  {
    name: 'Dev Prakash',
    role: 'Director of Photography',
    roleHover: 'Chases the light',
    accent: '#C98A5B',
    photo: 'https://i.pravatar.cc/600?img=33',
  },
  {
    name: 'Sana Qureshi',
    role: 'Design Lead',
    roleHover: 'Moves it 2px left',
    accent: '#6FA8A0',
    photo: 'https://i.pravatar.cc/600?img=47',
  },
]

export const CONTACT = {
  photo: 'https://picsum.photos/seed/rator-founder/300/300',
  name: 'Arjun Rao',
  title: 'Founder & Creative Director',
  prompt: 'From concept to launch, we are here to build it with you.',
  cta: "Let's talk",
  email: 'team@ratorstudios.com',
  phone: '+91 81051 12659',
  address: ['RR Nagar, Bengaluru', 'Karnataka, India'],
}

export const FOOTER_LINKS = [
  { label: 'Get a quote', href: 'mailto:team@ratorstudios.com?subject=Project%20enquiry' },
  { label: 'Join our team', href: 'mailto:team@ratorstudios.com?subject=Joining%20Rator' },
  { label: 'Just say hello', href: 'mailto:team@ratorstudios.com?subject=Hello' },
]

export const SOCIALS = ['Instagram', 'LinkedIn', 'Behance', 'Vimeo']
