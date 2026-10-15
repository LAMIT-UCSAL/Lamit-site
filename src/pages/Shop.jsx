import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GrainientBackground from '../components/GrainientBackground'
import { usePageMeta } from '../utils/usePageMeta'

function Shop() {
  usePageMeta('Shop', 'A loja oficial da LAMIT está chegando.')

  return (
    <div className="page-bg" style={{ background: 'none' }}>
      <GrainientBackground />
      <Navbar currentPage="SHOP" />

      <section id="store" className="not-found" aria-labelledby="store-title">
        <div className="not-found__panel">
          <img
            src="/media/mascot/pitch-pensativo.webp"
            alt=""
            aria-hidden="true"
            width="640"
            height="588"
            className="page-mascot"
          />
          <p className="home-cta__kicker">Lamit Store</p>
          <h1 id="store-title">Coming Soon</h1>
          <p className="not-found__body">A loja oficial da LAMIT está chegando.</p>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default Shop
