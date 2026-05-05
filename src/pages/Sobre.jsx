import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GrainientBackground from '../components/GrainientBackground'

function Sobre() {
  return (
    <div className="page-bg" style={{ background: 'none' }}>
      <GrainientBackground />
      <Navbar currentPage="SOBRE" />
      <Footer />

      <section id="diretoria_gallery">
        <div id="card_diretoria">
          <img src="/media/diretoria.jpeg" alt="Diretoria" />
          <div id="sobre_card">
            <h1 id="sobre_title">SOBRE</h1>
            <p id="sobre_text">
              A Liga Acadêmica de Maratonas, Inovação e Tecnologia (LAMIT) é uma organização estudantil
              dedicada a promover a excelência acadêmica, a inovação e a tecnologia por meio de maratonas
              de programação, workshops e eventos relacionados. A LAMIT tem como objetivo proporcionar aos
              estudantes uma plataforma para desenvolver suas habilidades técnicas, colaborar com outros
              entusiastas da tecnologia e participar de competições desafiadoras.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Sobre
