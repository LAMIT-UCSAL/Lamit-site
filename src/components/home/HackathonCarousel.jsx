import { useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { hackathonPhotos } from '../../data/home'

const SWIPE_THRESHOLD = 40
const WHEEL_THRESHOLD = 30
const WHEEL_COOLDOWN_MS = 400

const CLONE_COUNT = 5

function HackathonCarousel() {
  const length = hackathonPhotos.length
  const trackRef = useRef(null)
  const dragRef = useRef({ active: false, startX: 0 })
  const wheelCooldownRef = useRef(false)
  const prefersReducedMotion = useReducedMotion()

  const [step, setStep] = useState(0)
  const [instant, setInstant] = useState(false)
  const realIndex = ((step % length) + length) % length

  const strip = useMemo(() => {
    const leading = hackathonPhotos.slice(-CLONE_COUNT).map((p) => ({ ...p, key: `pre-${p.id}`, clone: true }))
    const trailing = hackathonPhotos.slice(0, CLONE_COUNT).map((p) => ({ ...p, key: `post-${p.id}`, clone: true }))
    const real = hackathonPhotos.map((p) => ({ ...p, key: p.id, clone: false }))
    return [...leading, ...real, ...trailing]
  }, [])

  const activeStripIndex = CLONE_COUNT + step

  const goTo = (nextStep) => {
    setInstant(false)
    setStep(nextStep)
  }

  const handleTransitionEnd = () => {
    if (step < 0 || step >= length) {
      setInstant(true)
      setStep(realIndex)
    }
  }

  const handlePointerDown = (e) => {
    dragRef.current = { active: true, startX: e.clientX }
    trackRef.current?.setPointerCapture(e.pointerId)
  }

  const handlePointerUp = (e) => {
    if (!dragRef.current.active) return
    const delta = e.clientX - dragRef.current.startX
    dragRef.current.active = false
    if (delta > SWIPE_THRESHOLD) goTo(step - 1)
    else if (delta < -SWIPE_THRESHOLD) goTo(step + 1)
    if (trackRef.current?.hasPointerCapture?.(e.pointerId)) {
      trackRef.current.releasePointerCapture(e.pointerId)
    }
  }

  const handlePointerCancel = () => {
    dragRef.current.active = false
  }

  const handleWheel = (e) => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
    if (Math.abs(e.deltaY) < WHEEL_THRESHOLD || wheelCooldownRef.current) {
      e.preventDefault()
      return
    }
    e.preventDefault()
    wheelCooldownRef.current = true
    goTo(e.deltaY > 0 ? step + 1 : step - 1)
    setTimeout(() => {
      wheelCooldownRef.current = false
    }, WHEEL_COOLDOWN_MS)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goTo(step - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      goTo(step + 1)
    }
  }

  return (
    <section
      className="home-carousel"
      aria-labelledby="home-carousel-title"
      aria-roledescription="carrossel"
    >
      <div className="home-carousel__header">
        <p className="home-carousel__kicker">Hackathons</p>
        <h2 id="home-carousel-title" className="home-carousel__title">
          Lamit em competição.
        </h2>
      </div>

      <div className="home-carousel__viewport" role="region" aria-label="Fotos de hackathons">
        <div
          className="home-carousel__track"
          style={{
            '--active-index': activeStripIndex,
            transitionDuration: instant || prefersReducedMotion ? '0s' : undefined,
          }}
          ref={trackRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onWheel={handleWheel}
          onTransitionEnd={handleTransitionEnd}
        >
          {strip.map((photo, index) => (
            <div
              key={photo.key}
              aria-hidden={photo.clone || undefined}
              className={`home-carousel__slide${index === activeStripIndex ? ' is-active' : ''}`}
            >
              <picture>
                <source srcSet={`${photo.base}.webp`} type="image/webp" />
                <img
                  src={`${photo.base}.jpg`}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </picture>
            </div>
          ))}
        </div>
      </div>

      <div className="home-carousel__controls">
        <button
          type="button"
          className="home-carousel__arrow"
          onClick={() => goTo(step - 1)}
          aria-label="Foto anterior"
        >
          ◀
        </button>

        <div className="home-carousel__scrubber" aria-hidden="true">
          {hackathonPhotos.map((photo, index) => (
            <span
              key={photo.id}
              className={`home-carousel__tick${index === realIndex ? ' is-active' : ''}`}
            />
          ))}
        </div>

        <span className="home-carousel__counter" aria-live="polite">
          {String(realIndex + 1).padStart(2, '0')} / {String(length).padStart(2, '0')}
        </span>

        <button
          type="button"
          className="home-carousel__arrow"
          onClick={() => goTo(step + 1)}
          aria-label="Próxima foto"
        >
          ▶
        </button>
      </div>
    </section>
  )
}

export default HackathonCarousel
