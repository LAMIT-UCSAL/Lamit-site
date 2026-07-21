import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GrainientBackground from '../components/GrainientBackground'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

function Sobre() {
  const videoRef = useRef(null)
  const progressRef = useRef(0)
  const frameRequestRef = useRef(0)
  const seekingRef = useRef(false)
  const pendingProgressRef = useRef(null)
  const touchStartYRef = useRef(null)
  const [isVideoReady, setIsVideoReady] = useState(false)

  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousBodyOverflow = document.body.style.overflow

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    const syncVideoFrame = (progress) => {
      const video = videoRef.current

      if (!video || !video.duration) {
        return
      }

      if (seekingRef.current) {
        pendingProgressRef.current = progress
        return
      }

      seekingRef.current = true
      video.currentTime = video.duration * progress
    }

    const handleSeeked = () => {
      seekingRef.current = false

      if (pendingProgressRef.current !== null) {
        const next = pendingProgressRef.current
        pendingProgressRef.current = null
        syncVideoFrame(next)
      }
    }

    const video = videoRef.current
    if (video) {
      video.addEventListener('seeked', handleSeeked)
    }

    const scheduleVideoFrame = (progress) => {
      if (frameRequestRef.current) {
        cancelAnimationFrame(frameRequestRef.current)
      }

      frameRequestRef.current = requestAnimationFrame(() => {
        syncVideoFrame(progress)
        frameRequestRef.current = 0
      })
    }

    const updateProgress = (deltaPixels) => {
      const viewportHeight = window.innerHeight || 1
      const nextProgress = clamp(progressRef.current + deltaPixels / (viewportHeight * 2.4), 0, 1)

      if (nextProgress === progressRef.current) {
        return
      }

      progressRef.current = nextProgress
      scheduleVideoFrame(nextProgress)
    }

    const handleWheel = (event) => {
      event.preventDefault()
      updateProgress(event.deltaY)
    }

    const handleTouchStart = (event) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null
    }

    const handleTouchMove = (event) => {
      if (touchStartYRef.current === null) {
        return
      }

      const currentTouchY = event.touches[0]?.clientY

      if (typeof currentTouchY !== 'number') {
        return
      }

      event.preventDefault()
      updateProgress(touchStartYRef.current - currentTouchY)
      touchStartYRef.current = currentTouchY
    }

    const resetTouch = () => {
      touchStartYRef.current = null
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', resetTouch)
    window.addEventListener('touchcancel', resetTouch)

    syncVideoFrame(progressRef.current)

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow

      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', resetTouch)
      window.removeEventListener('touchcancel', resetTouch)

      if (video) {
        video.removeEventListener('seeked', handleSeeked)
      }

      if (frameRequestRef.current) {
        cancelAnimationFrame(frameRequestRef.current)
      }
    }
  }, [])

  const handleVideoReady = () => {
    const video = videoRef.current

    if (!video) {
      return
    }

    video.pause()
    video.currentTime = (video.duration || 0) * progressRef.current
    setIsVideoReady(true)
  }

  return (
    <div className="page-bg sobre-page" style={{ background: 'none' }}>
      <GrainientBackground />
      <Navbar currentPage="SOBRE" />
      <Footer />

      <main className="sobre-scroll-layout">
        <section className="sobre-copy" aria-labelledby="sobre-heading">
          <p className="sobre-eyebrow">Liga Acadêmica de Maratonas, Inovação e Tecnologia</p>
          <h1 id="sobre-heading" className="sobre-heading">LAMIT</h1>
          <div className="sobre-description-wrapper">
            <p className="sobre-description">
              A LAMIT conecta estudantes, tecnologia e execução em um espaço criado para transformar
              curiosidade em prática. A liga promove maratonas de programação, workshops, projetos e
              experiências colaborativas que aproximam a comunidade acadêmica de desafios reais.
            </p>
            <p className="sobre-description">
              A proposta é desenvolver repertório técnico, fortalecer a inovação e estimular uma cultura
              de construção coletiva, onde aprender, experimentar e resolver problemas acontecem lado a
              lado.
            </p>
          </div>
          <p className="sobre-instruction">Role para conduzir a animação</p>
        </section>

        <section className="sobre-video-stage" aria-label="Animação institucional da LAMIT">
          <div className="sobre-video-glow" aria-hidden="true" />
          <video
            ref={videoRef}
            className={`sobre-video${isVideoReady ? ' is-ready' : ''}`}
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={handleVideoReady}
          >
            <source src="/media/saida_final.webm" type="video/webm" />
          </video>
        </section>
      </main>
    </div>
  )
}

export default Sobre
