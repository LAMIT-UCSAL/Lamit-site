// Apresentação do Pitch, a coruja maratonista mascote da LAMIT (textos dos posts de lançamento no Instagram)
function PitchSection() {
  return (
    <section className="home-pitch" aria-labelledby="home-pitch-title">
      <div className="home-pitch__media">
        <span className="home-pitch__glow" aria-hidden="true" />
        <img
          src="/media/mascot/pitch-feliz.webp"
          alt="Pitch, a coruja mascote da LAMIT, de óculos, comemorando em frente a um notebook"
          width="900"
          height="758"
          loading="lazy"
          decoding="async"
          className="home-pitch__image"
        />
      </div>

      <div className="home-pitch__content">
        <p className="home-pitch__kicker">Mascote oficial</p>
        <h2 id="home-pitch-title" className="home-pitch__title">Olá! Eu sou o Pitch.</h2>
        <p className="home-pitch__body">
          O novo maratonista oficial da LAMIT, movido a curiosidade, café e madrugadas de aprendizado.
        </p>
        <p className="home-pitch__tagline">Agora eu faço parte dessa comunidade. Bora inovar juntos?</p>
      </div>
    </section>
  )
}

export default PitchSection
