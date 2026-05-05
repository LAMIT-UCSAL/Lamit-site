import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Home() {
  return (
    <>
      <div className="banner1">
        <Navbar currentPage="HOME" />

        <div className="banner-videos">
          <video autoPlay muted loop playsInline className="banner-video">
            <source src="/media/onboarding.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="banner-video">
            <source src="/media/produtos-lamit.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="banner-video">
            <source src="/media/lamit dic.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="banner-video">
            <source src="/media/backstage.mp4" type="video/mp4" />
          </video>
        </div>

        <Footer />
      </div>

      <a href="https://linktr.ee/lamit.ucsal" target="_blank" rel="noopener noreferrer">
        <button id="liveButton">Acesse Nossos Links</button>
      </a>

      <section className="photo_gallery">
        <img src="/media/Banner Sympla.jpg" alt="Banner Sympla" />
        <img src="/media/comunidade.jpeg" alt="Comunidade" />
        <img src="/media/hackathons.png" alt="Hackathons" />
        <img src="/media/mesa-diretora.jpeg" alt="Mesa Diretora" />
      </section>
    </>
  )
}

export default Home
