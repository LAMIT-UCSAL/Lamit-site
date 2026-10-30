import { useEffect, useRef, useState } from 'react'

// Vídeos do hero em qualidade original, sempre rodando em loop (sem pausar ao sair da tela).
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

function playSafely(video) {
  if (!video) return
  const promise = video.play()
  // Autoplay bloqueado pelo navegador: fica o poster, sem erro no console
  if (promise) promise.catch(() => {})
}

function HeroVideos() {
  const videoRefs = useRef([])
  const isMobile = useMediaQuery(MOBILE_QUERY)
  const [active, setActive] = useState(0)

  // Desktop: os 4 vídeos tocam juntos. Mobile: só o vídeo ativo toca (os outros ficam invisíveis)
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return
      if (!isMobile || index === active) playSafely(video)
      else video.pause()
    })
  }, [isMobile, active])

  // Mobile: troca de vídeo a cada CLIP_DURATION_MS
  useEffect(() => {
    if (!isMobile) return undefined
    const timer = setTimeout(() => setActive((current) => (current + 1) % VIDEOS.length), CLIP_DURATION_MS)
    return () => clearTimeout(timer)
  }, [isMobile, active])

  const next = (active + 1) % VIDEOS.length

  return (
    <div
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
            autoPlay={!isMobile || isActive}
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
              className={`banner-tick${index === active ? ' is-active' : ''}${index === active ? ' is-running' : ''}`}
              style={{ '--clip-duration': `${CLIP_DURATION_MS}ms` }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default HeroVideos
