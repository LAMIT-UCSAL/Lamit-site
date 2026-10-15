import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GrainientBackground from '../components/GrainientBackground'
import { usePageMeta } from '../utils/usePageMeta'

function NotFound() {
  usePageMeta('Página não encontrada', 'A página que você procurou não existe ou mudou de endereço.')

  return (
    <div className="page-bg" style={{ background: 'none' }}>
      <GrainientBackground />
      <Navbar currentPage="" />
      <Footer />

      <section className="not-found" aria-labelledby="not-found-title">
        <p className="home-cta__kicker">Erro 404</p>
        <h1 id="not-found-title">Página não encontrada.</h1>
        <p className="not-found__body">O endereço pode ter mudado ou não existir mais.</p>
        <Link to="/" className="btn-primary home-cta__button">
          Voltar para o início
        </Link>
      </section>
    </div>
  )
}

export default NotFound
