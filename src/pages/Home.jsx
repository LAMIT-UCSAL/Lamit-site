import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AboutSection from '../components/home/AboutSection'
import HackathonCarousel from '../components/home/HackathonCarousel'
import EventsSection from '../components/home/EventsSection'
import CommunityCTA from '../components/home/CommunityCTA'

function Home() {
  return (
    <>
      <div className="banner1">
        <Navbar currentPage="HOME" />

        <div className="banner-videos">
          <video autoPlay muted loop playsInline className="banner-video">
            <source src="/media/videos/onboarding.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="banner-video">
            <source src="/media/videos/gdg-salvador.MOV" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="banner-video">
            <source src="/media/videos/lamit-redbull.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="banner-video">
            <source src="/media/videos/podcast.MOV" type="video/mp4" />
          </video>
        </div>

        <Footer />
      </div>

      <a href="https://linktr.ee/lamit.ucsal" target="_blank" rel="noopener noreferrer" className="btn-primary">
        Acesse Nossos Links
      </a>

      <div className="home-narrative">
        <div className="home-narrative__bg" aria-hidden="true" />
        <AboutSection />
        <HackathonCarousel />
        <EventsSection />
        <CommunityCTA />
      </div>
    </>
  )
}

export default Home
