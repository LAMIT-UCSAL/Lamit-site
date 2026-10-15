import { useEffect, useRef, useState } from 'react'

// Vídeos do hero em qualidade original. Nada é baixado antes da hora (preload="none" + poster)
// e eles só tocam enquanto o banner está visível na tela.
const VIDEOS = [
  { src: '/media/videos/onboarding.mp4', poster: '/media/videos/posters/onboarding.jpg' },
  { src: '/media/videos/gdg-salvador.MOV', poster: '/media/videos/posters/gdg-salvador.jpg' },
  { src: '/media/videos/lamit-redbull.mp4', poster: '/media/videos/posters/lamit-redbull.jpg' },
  { src: '/media/videos/podcast.MOV', poster: '/media/videos/posters/podcast.jpg' },
]

const MOBILE_QUERY = '(max-width: 920px)'
const CLIP_DURATION_MS = 6000

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = (event) => setMatches(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])

  return matches
}

// Visível = dentro da viewport e com a aba em primeiro plano
function useIsVisible(ref) {
  const [inView, setInView] = useState(false)
  const [pageVisible, setPageVisible] = useState(() => !document.hidden)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 })
    observer.observe(element)

    const onVisibility = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [ref])

  return inView && pageVisible
}

function playSafely(video) {
  if (!video) return
  const promise = video.play()
  // Autoplay bloqueado pelo navegador: fica o poster, sem erro no console
  if (promise) promise.catch(() => {})
}

function HeroVideos() {
  const containerRef = useRef(null)
  const videoRefs = useRef([])
  const isMobile = useMediaQuery(MOBILE_QUERY)
  const isVisible = useIsVisible(containerRef)
  const [active, setActive] = useState(0)

  // Tocar/pausar conforme a visibilidade (no mobile, só o vídeo ativo toca)
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return
      const shouldPlay = isVisible && (!isMobile || index === active)
      if (shouldPlay) playSafely(video)
      else video.pause()
    })
  }, [isVisible, isMobile, active])

  // Mobile: troca de vídeo a cada CLIP_DURATION_MS enquanto o banner está visível
  useEffect(() => {
    if (!isMobile || !isVisible) return undefined
    const timer = setTimeout(() => setActive((current) => (current + 1) % VIDEOS.length), CLIP_DURATION_MS)
    return () => clearTimeout(timer)
  }, [isMobile, isVisible, active])

  const next = (active + 1) % VIDEOS.length

  return (
    <div
      ref={containerRef}
      className={`banner-videos${isMobile ? ' banner-videos--stage' : ''}`}
      aria-hidden="true"
    >
      {VIDEOS.map((video, index) => {
        const isActive = index === active
        // No mobile, só o vídeo atual e o próximo começam a carregar
        const preload = isMobile && (isActive || index === next) ? 'auto' : 'none'
        return (
          <video
            key={video.src}
            ref={(element) => { videoRefs.current[index] = element }}
            className={`banner-video${isMobile && isActive ? ' is-active' : ''}`}
            src={video.src}
            poster={video.poster}
            preload={preload}
            muted
            loop
            playsInline
          />
        )
      })}

      {isMobile && (
        <div className="banner-ticks">
          {VIDEOS.map((video, index) => (
            <span
              key={video.src}
              className={`banner-tick${index === active ? ' is-active' : ''}${index === active && isVisible ? ' is-running' : ''}`}
              style={{ '--clip-duration': `${CLIP_DURATION_MS}ms` }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default HeroVideos
