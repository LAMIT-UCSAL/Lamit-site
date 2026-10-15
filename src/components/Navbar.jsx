import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar({ currentPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const toggleRef = useRef(null)
  const menuRef = useRef(null)

  const links = [
    { to: '/', label: 'HOME' },
    { to: '/diretoria', label: 'DIRETORIA' },
    { to: '/shop', label: 'SHOP' },
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
    <>
      <Link to="/"><img src="/media/brand/logo-horizontal.svg" alt="LAMIT" className="nav-logo" /></Link>

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

      <nav
        id="nav-menu"
        ref={menuRef}
        className={`nav_home${isMenuOpen ? ' is-open' : ''}`}
        aria-label="Principal"
      >
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            aria-current={link.label === currentPage ? 'page' : undefined}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  )
}

export default Navbar
