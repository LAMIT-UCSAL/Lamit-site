import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GrainientBackground from '../components/GrainientBackground'
import { usePageMeta } from '../utils/usePageMeta'

function Shop() {
  usePageMeta('Shop', 'A loja da LAMIT está chegando.')

  return (
    <div className="page-bg" style={{ background: 'none' }}>
      <GrainientBackground />
      <Navbar currentPage="SHOP" />
      <Footer />

      <section id="store">
        <h1 id="storeTitle">Coming Soon</h1>
      </section>
    </div>
  )
}

export default Shop
