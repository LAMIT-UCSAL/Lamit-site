import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // O site rola dentro do <body> (html/body com height: 100% e overflow-x: hidden),
    // então window.scrollTo sozinho não volta ao topo
    window.scrollTo(0, 0)
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  }, [pathname])

  return null
}

export default ScrollToTop
