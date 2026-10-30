import { useEffect, useState } from 'react'
import { showCredits } from '../utils/swal'

// Rodapé fixo. Quando uma faixa escura (.footer-dark-zone, ex.: o convite final da home) passa por baixo
// dele, ganha a classe is-on-dark e fica branco — no tema claro, senão, sumiria sobre o azul.
function useOverDarkZone() {
  const [onDark, setOnDark] = useState(false)

  useEffect(() => {
    const zones = document.querySelectorAll('.footer-dark-zone')
    if (zones.length === 0 || !('IntersectionObserver' in window)) return undefined

    const visible = new Set()
    // Só a faixa de baixo da tela (onde o rodapé fica) conta
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target)
        else visible.delete(entry.target)
      })
      setOnDark(visible.size > 0)
    }, { rootMargin: '-92% 0px 0px 0px' })

    zones.forEach((zone) => observer.observe(zone))
    return () => observer.disconnect()
  }, [])

  return onDark
}

// O rodapé só aparece depois de rolar um pouco: no primeiro quadro ele cobria botões do hero.
// Em páginas curtas, que não têm o que rolar, ele aparece direto.
const REVEAL_SCROLL_PX = 120

function useRevealOnScroll() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => {
      const root = document.documentElement
      const canScroll = root.scrollHeight - window.innerHeight > REVEAL_SCROLL_PX
      setVisible(!canScroll || window.scrollY > REVEAL_SCROLL_PX)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    // A altura da página muda quando imagens e seções carregam
    const observer = new ResizeObserver(update)
    observer.observe(document.body)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      observer.disconnect()
    }
  }, [])

  return visible
}

function Footer() {
  const onDark = useOverDarkZone()
  const visible = useRevealOnScroll()
  const className = [onDark && 'is-on-dark', !visible && 'is-hidden'].filter(Boolean).join(' ')

  return (
    <div id="downElements" className={className || undefined}>
      <div> 2026 LAMIT </div>
      <button onClick={showCredits} id="creditsbtn">CREDITS</button>
      <nav className="socialMedias">
        <a href="https://linktr.ee/lamit.ucsal" target="_blank" rel="noopener noreferrer">
          <img src="/media/icons/link.png" alt="Linktree da LAMIT" />
        </a>
        <a href="https://www.instagram.com/lamit.ucsal" target="_blank" rel="noopener noreferrer">
          <img src="/media/icons/instagram.png" alt="Instagram da LAMIT" />
        </a>
        <a href="https://www.tiktok.com/@lamit.ucsal" target="_blank" rel="noopener noreferrer">
          <img src="/media/icons/tiktokicon.png" alt="TikTok da LAMIT" />
        </a>
        <a href="https://www.linkedin.com/company/lamit-ucsal/" target="_blank" rel="noopener noreferrer">
          <img src="/media/icons/linkedin.png" alt="LinkedIn da LAMIT" />
        </a>
      </nav>
    </div>
  )
}

export default Footer
