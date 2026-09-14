import { CursorProvider } from './context/CursorContext.jsx'
import { CLIENTS } from './data/content.js'
import CustomCursor from './components/CustomCursor.jsx'
import SmoothScroll from './components/SmoothScroll.jsx'
import GrainOverlay from './components/GrainOverlay.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import WorkGrid from './components/WorkGrid.jsx'
import Marquee from './components/Marquee.jsx'
import Capabilities from './components/Capabilities.jsx'
import Reach from './components/Reach.jsx'
import Stats from './components/Stats.jsx'
import Outcomes from './components/Outcomes.jsx'
import Founders from './components/Founders.jsx'
import Testimonials from './components/Testimonials.jsx'
import ClientGrid from './components/ClientGrid.jsx'
import News from './components/News.jsx'
import ContactCTA from './components/ContactCTA.jsx'
import Footer from './components/Footer.jsx'

/**
 * Section order and ground tone, both taken from the reference's own section
 * list rather than guessed:
 *
 *   1  Hero           dark
 *   2  Work           light   <- editorial project grid
 *   3  Capabilities   light
 *   4  Reach          dark    <- word wall + cursor image trail
 *   5  Stats/About    light
 *   6  Outcomes       light
 *   7  Studio         dark    <- founder / team cards
 *   8  Testimonials   dark
 *   9  Clients        dark
 *   10 News           dark
 *   11 Contact        dark
 *   12 Footer         dark
 *
 * So the page runs dark → light → dark → light → dark, and everything from
 * the testimonials down stays dark.
 */
export default function App() {
  return (
    <CursorProvider>
      {/*
        Everything position:fixed stays OUTSIDE #smooth-wrapper. ScrollSmoother
        translates the content, and a transformed ancestor becomes the
        containing block for fixed children — inside the wrapper the header,
        cursor and grain would scroll away with the page.
      */}
      <SmoothScroll />
      <GrainOverlay />
      <CustomCursor />
      <Header />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <Hero />
            <WorkGrid />
            <div className="bg-black">
              <Marquee items={CLIENTS} duration={52} />
            </div>
            <Capabilities />
            <Reach />
            <Stats />
            <Outcomes />
            <Founders />
            <Testimonials />
            <ClientGrid />
            <News />
            <ContactCTA />
          </main>

          <Footer />
        </div>
      </div>
    </CursorProvider>
  )
}
