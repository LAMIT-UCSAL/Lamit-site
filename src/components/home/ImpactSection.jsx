import { impactStats } from '../../data/home'

function ImpactSection() {
  return (
    <section className="home-impact" aria-labelledby="home-impact-title">
      <div className="home-impact__header">
        <p className="home-impact__kicker">Em números</p>
        <h2 id="home-impact-title" className="home-impact__title">
          Resultados em competição.
        </h2>
      </div>

      <ul className="home-impact__grid">
        {impactStats.map((stat) => (
          <li key={stat.label} className={`home-impact__card${stat.highlight ? ' home-impact__card--text' : ''}`}>
            <span className="home-impact__value">{stat.value}</span>
            <span className="home-impact__label">{stat.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ImpactSection
