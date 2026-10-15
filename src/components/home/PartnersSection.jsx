import { partners, partnershipCta } from '../../data/home'

function PartnersSection() {
  return (
    <section className="home-partners" aria-labelledby="home-partners-title">
      <div className="home-partners__header">
        <p className="home-partners__kicker">Parceiros</p>
        <h2 id="home-partners-title" className="home-partners__title">
          Quem constrói com a gente.
        </h2>
        <p className="home-partners__body">
          Comunidades e empresas que apoiam os eventos, maratonas e projetos da LAMIT.
        </p>
      </div>

      <ul className="home-partners__grid">
        {partners.map((partner) => (
          <li
            key={partner.name}
            className={`home-partners__card${partner.tall ? ' home-partners__card--tall' : ''}`}
          >
            <img src={partner.logo} alt={partner.name} loading="lazy" decoding="async" />
          </li>
        ))}
      </ul>

      <div className="home-partners__cta">
        <div>
          <h3 className="home-partners__cta-title">Seja parceiro da LAMIT</h3>
          <p className="home-partners__cta-body">
            Apoie hackathons, maratonas e eventos de inovação e se aproxime dos novos talentos da
            tecnologia em Salvador.
          </p>
        </div>
        <a
          href={partnershipCta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary home-partners__cta-button"
        >
          Quero ser parceiro
        </a>
      </div>
    </section>
  )
}

export default PartnersSection
