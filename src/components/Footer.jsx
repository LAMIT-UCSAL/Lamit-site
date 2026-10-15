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

function Footer() {
  const onDark = useOverDarkZone()

  return (
    <div id="downElements" className={onDark ? 'is-on-dark' : undefined}>
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
