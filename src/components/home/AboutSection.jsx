const pillars = [
  {
    label: 'Competição',
    text: 'Maratonas de inovação e hackathons que desafiam estudantes a criar, colaborar e transformar ideias em soluções.',
  },
  {
    label: 'Conexões',
    text: 'Aproximamos estudantes, profissionais, empresas e comunidades através de eventos, parcerias, mentorias e networking.',
  },
  {
    label: 'Inovação',
    text: 'Criamos espaço para experimentar, desenvolver projetos e tirar ideias do papel, conectando tecnologia a desafios reais.',
  },
]

function AboutSection() {
  return (
    <section className="home-about" aria-labelledby="home-about-title">
      <div className="home-about__intro">
        <p className="home-about__kicker">Sobre nós</p>
        <h1 id="home-about-title" className="home-about__title">
          INOVAÇÃO, TECNOLOGIA E COMUNIDADE.
        </h1>
        <p className="home-about__body">
          A LAMIT é um ecossistema acadêmico de inovação e tecnologia da UCSAL. Conectamos estudantes, ideias e oportunidades para transformar conhecimento em experiências, projetos e impacto real.
        </p>
      </div>

      <div className="home-about__content">
        <ul className="home-about__pillars">
          {pillars.map((pillar) => (
            <li key={pillar.label} className="home-about__pillar">
              <span className="home-about__pillar-label">{pillar.label}</span>
              <p className="home-about__pillar-text">{pillar.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default AboutSection
