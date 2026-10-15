import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GrainientBackground from '../components/GrainientBackground'
import { usePageMeta } from '../utils/usePageMeta'

// Página provisória: quando o LamiTrack estiver publicado, o link do menu passa a apontar para ele
function Lamitrack() {
  usePageMeta('LamiTrack', 'LamiTrack: a vitrine de eventos da LAMIT está chegando.')

  return (
    <div className="page-bg" style={{ background: 'none' }}>
      <GrainientBackground />
      <Navbar currentPage="LAMITRACK" />
      <Footer />

      <section className="not-found" aria-labelledby="lamitrack-title">
        <p className="home-cta__kicker">LamiTrack</p>
        <h1 id="lamitrack-title">Coming Soon</h1>
        <p className="not-found__body">A vitrine de eventos da LAMIT está chegando.</p>
      </section>
    </div>
  )
}

export default Lamitrack
