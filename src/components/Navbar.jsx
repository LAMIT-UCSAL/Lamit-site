import { Link } from 'react-router-dom'

function Navbar({ currentPage }) {
  const links = [
    { to: '/', label: 'HOME' },
    { to: '/sobre', label: 'SOBRE' },
    { to: '/diretoria', label: 'DIRETORIA' },
    { to: '/shop', label: 'SHOP' },
    { to: '/contato', label: 'CONTATO' },
  ]

  // Filter out the current page from nav
  const filteredLinks = links.filter(link => link.label !== currentPage)

  return (
    <>
      <Link to="/"><img src="/media/logo-horizontal.png" alt="LAMIT" className="nav-logo" /></Link>
      <div className="nav_home">
        {filteredLinks.map(link => (
          <Link key={link.to} to={link.to}>{link.label}</Link>
        ))}
      </div>
    </>
  )
}

export default Navbar
