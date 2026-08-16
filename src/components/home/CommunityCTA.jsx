import { communityCta } from '../../data/home'

function CommunityCTA() {
  return (
    <section className="home-cta" aria-labelledby="home-cta-title">
      <div className="home-cta__content">
        <p className="home-cta__kicker">Junte-se a nós</p>
        <h2 id="home-cta-title" className="home-cta__title">
          Faça parte da nossa comunidade
        </h2>
        <p className="home-cta__body">
          Entre no nosso grupo e acompanhe de perto as próximas maratonas, hackathons e eventos
          da LAMIT.
        </p>

        <a
          href={communityCta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary home-cta__button"
        >
          Entrar na comunidade
        </a>
      </div>
    </section>
  )
}

export default CommunityCTA
