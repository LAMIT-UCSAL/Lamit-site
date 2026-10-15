import { useEffect, useRef, useState } from 'react'
import { impactStats } from '../../data/home'

const COUNT_DURATION_MS = 1400

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Fica true uma única vez, quando a seção entra na tela
function useRevealOnce(ref) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined
    if (!('IntersectionObserver' in window)) {
      setRevealed(true)
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRevealed(true)
        observer.disconnect()
      }
    }, { threshold: 0.3 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  return revealed
}

// Conta de 0 até o valor com desaceleração no final; com reduced-motion mostra o valor direto
function CountUp({ stat, start }) {
  const [current, setCurrent] = useState(() => (prefersReducedMotion() ? stat.count : 0))

  useEffect(() => {
    if (!start) return undefined
    if (prefersReducedMotion()) {
      setCurrent(stat.count)
      return undefined
    }

    let frame
    const startTime = performance.now()
    const tick = (now) => {
      const progress = Math.min(1, (now - startTime) / COUNT_DURATION_MS)
      const eased = 1 - (1 - progress) ** 3
      setCurrent(Math.round(eased * stat.count))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [start, stat.count])

  return `${stat.prefix || ''}${current}${stat.suffix || ''}`
}

function ImpactSection() {
  const gridRef = useRef(null)
  const revealed = useRevealOnce(gridRef)

  return (
    <section className="home-impact" aria-labelledby="home-impact-title">
      <img
        src="/media/mascot/pitch-foguete.webp"
        alt=""
        aria-hidden="true"
        width="520"
        height="547"
        loading="lazy"
        decoding="async"
        className="home-impact__mascot"
      />
      <div className="home-impact__header">
        <p className="home-impact__kicker">Em números</p>
        <h2 id="home-impact-title" className="home-impact__title">
          Resultados em competição.
        </h2>
      </div>

      <ul ref={gridRef} className={`home-impact__grid${revealed ? ' is-revealed' : ''}`}>
        {impactStats.map((stat, index) => (
          <li
            key={stat.label}
            className={`home-impact__card${stat.highlight ? ' home-impact__card--text' : ''}`}
            style={{ '--i': index }}
          >
            {typeof stat.count === 'number' ? (
              <>
                {/* Leitor de tela lê o valor final, não a contagem */}
                <span className="sr-only">{stat.value}</span>
                <span className="home-impact__value" aria-hidden="true">
                  <CountUp stat={stat} start={revealed} />
                </span>
              </>
            ) : (
              <span className="home-impact__value">{stat.value}</span>
            )}
            <span className="home-impact__label">{stat.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ImpactSection
