import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AboutSection from '../components/home/AboutSection'
import HackathonCarousel from '../components/home/HackathonCarousel'
import EventsSection from '../components/home/EventsSection'
import CommunityCTA from '../components/home/CommunityCTA'
import HeroVideos from '../components/home/HeroVideos'
import PartnersSection from '../components/home/PartnersSection'
import ImpactSection from '../components/home/ImpactSection'
import PitchSection from '../components/home/PitchSection'
import { usePageMeta } from '../utils/usePageMeta'

function Home() {
  usePageMeta(
    null,
    'A LAMIT é a Liga Acadêmica de Maratonas, Inovação e Tecnologia da UCSal: hackathons, eventos e comunidade de tecnologia em Salvador.',
  )

  return (
    <>
      <Navbar currentPage="HOME" />

      <div className="banner1">
        <HeroVideos />

      </div>

      <a href="https://linktr.ee/lamit.ucsal" target="_blank" rel="noopener noreferrer" className="btn-primary">
        Acesse Nossos Links
      </a>

      <div className="home-narrative">
        <div className="home-narrative__bg" aria-hidden="true" />
        <AboutSection />
        <PitchSection />
        <ImpactSection />
        <HackathonCarousel />
        <EventsSection />
        <PartnersSection />
        <CommunityCTA />
      </div>

      <Footer />
    </>
  )
}

export default Home
