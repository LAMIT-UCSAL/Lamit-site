import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DirectorBanner from '../components/DirectorBanner'
import GrainientBackground from '../components/GrainientBackground'

const directors = [
  {
    index: '01',
    label: 'Presidência',
    name: 'Fernanda Velame',
    description: 'Responsável pela presidência da LAMIT e pela condução institucional da diretoria.',
    image: '/media/nanda-velame.png',
    reverse: false,
  },
  {
    index: '02',
    label: 'Vice-Presidência',
    name: 'Guilherme Mota',
    description: 'Atua na vice-presidência, apoiando a gestão e a organização das principais iniciativas da liga.',
    image: '/media/gui-mota.png',
    reverse: true,
  },
  {
    index: '03',
    label: 'Orientação',
    name: 'Luan Galvão',
    description: 'Responsável pela orientação técnica e pelo acompanhamento do desenvolvimento das atividades da diretoria.',
    image: '/media/luan.png',
    reverse: false,
  },
  {
    index: '04',
    label: 'Diretoria de Projetos',
    name: 'Marcelo Vinicius',
    description: 'Coordena a diretoria de projetos e a execução das entregas estratégicas desenvolvidas pela equipe.',
    image: '/media/marcelo.png',
    reverse: true,
  },
  {
    index: '05',
    label: 'Diretoria de Comunicação',
    name: 'Gabriel Maia',
    description: 'Lidera a diretoria de comunicação, fortalecendo a identidade da liga e sua presença nos canais digitais.',
    image: '/media/gab-maia.png',
    reverse: false,
  },
]

function Diretoria() {
  return (
    <div className="page-bg" style={{ background: 'none' }}>
      <GrainientBackground />
      <Navbar currentPage="DIRETORIA" />
      <Footer />

      <main className="diretoria-page-content">
        <section className="diretoria-hero">
          <p className="diretoria-kicker">LAMIT</p>
          <h1>Diretoria</h1>
          <p className="diretoria-intro">Conheça quem lidera as frentes da LAMIT</p>
        </section>

        <section className="diretoria-showcase" aria-label="Integrantes da diretoria">
          {directors.map((d) => (
            <DirectorBanner key={d.index} {...d} />
          ))}
        </section>
      </main>
    </div>
  )
}

export default Diretoria
