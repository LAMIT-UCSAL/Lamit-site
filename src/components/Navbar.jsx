import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

// Por enquanto a aba SHOP leva à Lamit Store publicada no Netlify (trocar quando houver domínio próprio)
const STORE_URL = 'https://lamitstore.netlify.app/'

function Navbar({ currentPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const toggleRef = useRef(null)
  const menuRef = useRef(null)

  const links = [
    { to: '/', label: 'HOME' },
    { to: '/diretoria', label: 'DIRETORIA' },
    { href: STORE_URL, label: 'SHOP' },
    { to: '/lamitrack', label: 'LAMITRACK' },
    { to: '/contato', label: 'CONTATO' },
  ]

  // Menu mobile aberto: Esc fecha (devolvendo o foco ao botão) e o Tab circula só entre o botão e os links
  useEffect(() => {
    if (!isMenuOpen) return undefined

    const focusables = () => [toggleRef.current, ...menuRef.current.querySelectorAll('a')]
    menuRef.current.querySelector('a')?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false)
        toggleRef.current?.focus()
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      const index = items.indexOf(document.activeElement)
      const nextIndex = e.shiftKey
        ? (index <= 0 ? items.length - 1 : index - 1)
        : (index === items.length - 1 ? 0 : index + 1)
      e.preventDefault()
      items[nextIndex]?.focus()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isMenuOpen])

  return (
    <header className="site-header">
      <Link to="/" className="site-header__brand" aria-label="LAMIT — início">
        <img src="/media/brand/escudo-branco.webp" alt="" className="nav-logo nav-logo--dark" width="159" height="192" />
        <img src="/media/brand/escudo.webp" alt="" className="nav-logo nav-logo--light" width="158" height="192" />
        <span className="site-header__wordmark">LAMIT</span>
      </Link>

      <div className="site-header__actions">
        <ThemeToggle />

        <button
          ref={toggleRef}
          type="button"
          className={`nav-toggle${isMenuOpen ? ' is-open' : ''}`}
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="nav-menu"
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <nav
        id="nav-menu"
        ref={menuRef}
        className={`nav_home${isMenuOpen ? ' is-open' : ''}`}
        aria-label="Principal"
      >
        {links.map(link => (link.href ? (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${link.label} (abre a Lamit Store em nova aba)`}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.label} <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <Link
            key={link.to}
            to={link.to}
            aria-current={link.label === currentPage ? 'page' : undefined}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.label}
          </Link>
        )))}
      </nav>
    </header>
  )
}

export default Navbar
