import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DirectorBanner from '../components/DirectorBanner'
import GrainientBackground from '../components/GrainientBackground'

const directors = [
  {
    index: '01',
    label: 'Presidente',
    name: 'Fernanda Velame',
    description: 'Responsável pela presidência da LAMIT e pela condução institucional da diretoria.',
    experience: 'Engenharia de Software, Product Analyst at Ford.',
    image: '/media/directors/nanda-velame.png',
    reverse: false,
  },
  {
    index: '02',
    label: 'Vice-Presidente',
    name: 'Guilherme Mota',
    description: 'Atua na vice-presidência, apoiando a gestão e a organização das principais iniciativas da liga.',
    experience: 'Engenharia de Software, System Engineer at Ford.',
    image: '/media/directors/gui-mota.png',
    reverse: true,
  },
  {
    index: '03',
    label: 'Diretor de Projetos',
    name: 'Marcelo Vinicius',
    description: 'Coordena a diretoria de projetos e a execução das entregas estratégicas desenvolvidas pela equipe.',
    experience: 'Engenharia de Software, Engenheiro de IA.',
    image: '/media/directors/marcelo-vinicius.png',
    reverse: false,
  },
  {
    index: '04',
    label: 'Diretor de Comunicação',
    name: 'Gabriel Maia',
    description: 'Lidera a diretoria de comunicação, fortalecendo a identidade da liga e sua presença nos canais digitais.',
    experience: 'Graduado em ADS, Cursando Engenharia de Software e Desenvolvedor Full Stack.',
    image: '/media/directors/gab-maia.png',
    reverse: true,
  },
  {
    index: '05',
    label: 'Diretora de Eventos',
    name: 'Kézia Carneiro',
    description: 'Lidera a diretoria de eventos, organizando atividades que promovem o engajamento e a comunicação dentro da liga.',
    experience: 'Engenharia de Software e Desenvolvedora Frontend.',
    image: '/media/directors/kezia-carneiro.png',
    reverse: false,
  },
  {
    index: '06',
    label: 'Professor Orientador',
    name: 'Luan Galvão',
    description: 'Responsável pela orientação técnica e pelo acompanhamento do desenvolvimento das atividades da diretoria.',
    experience: 'Bacharel em Administração e ADS, MBA em Gestão de Projetos, Servidor Público no TJBA e Professor Universitário na UCSal.',
    image: '/media/directors/luan-galvao.png',
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
