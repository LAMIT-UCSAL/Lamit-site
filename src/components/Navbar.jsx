import { useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar({ currentPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const links = [
    { to: '/', label: 'HOME' },
    { to: '/diretoria', label: 'DIRETORIA' },
    { to: '/shop', label: 'SHOP' },
    { to: '/contato', label: 'CONTATO' },
  ]

  const filteredLinks = links.filter(link => link.label !== currentPage)

  return (
    <>
      <Link to="/"><img src="/media/brand/logo-horizontal.svg" alt="LAMIT" className="nav-logo" /></Link>

      <button
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

      <div id="nav-menu" className={`nav_home${isMenuOpen ? ' is-open' : ''}`}>
        {filteredLinks.map(link => (
          <Link key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)}>
            {link.label}
          </Link>
        ))}
      </div>
    </>
  )
}

export default Navbar
