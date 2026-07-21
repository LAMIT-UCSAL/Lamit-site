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
    experience: 'Engenharia de Software, Product Analyst @ Ford.',
    image: '/media/nanda-velame.png',
    reverse: false,
  },
  {
    index: '02',
    label: 'Vice-Presidência',
    name: 'Guilherme Mota',
    description: 'Atua na vice-presidência, apoiando a gestão e a organização das principais iniciativas da liga.',
    experience: 'Engenharia de Software, System Engineer @ Ford.',
    image: '/media/gui-mota.png',
    reverse: true,
  },
  {
    index: '03',
    label: 'Orientação',
    name: 'Luan Galvão',
    description: 'Responsável pela orientação técnica e pelo acompanhamento do desenvolvimento das atividades da diretoria.',
    experience: 'Bacharel em Administração e ADS, MBA em Gestão de Projetos, Servidor Público @ TJBA e Professor Universitário @ UCSal.',
    image: '/media/luan-galvao.png',
    reverse: false,
  },
  {
    index: '04',
    label: 'Diretoria de Projetos',
    name: 'Marcelo Vinicius',
    description: 'Coordena a diretoria de projetos e a execução das entregas estratégicas desenvolvidas pela equipe.',
    experience: 'Engenharia de Software, Desenvolvedor Full Stack.',
    image: '/media/marcelo-vinicius.png',
    reverse: true,
  },
  {
    index: '05',
    label: 'Diretoria de Comunicação',
    name: 'Gabriel Maia',
    description: 'Lidera a diretoria de comunicação, fortalecendo a identidade da liga e sua presença nos canais digitais.',
    experience: 'Análise e Desenvolvimento de Sistemas, Desenvolvedor Full Stack.',
    image: '/media/gab-maia.png',
    reverse: false,
  },
  {
    index: '06',
    label: 'Diretoria de Eventos',
    name: 'Kézia Carneiro',
    description: 'Lidera a diretoria de eventos, organizando e promovendo as atividades da liga.',
    experience: 'Análise e Desenvolvimento de Sistemas, Desenvolvedor Full Stack.',
    image: '/media/kezia.png',
    reverse: true,
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
