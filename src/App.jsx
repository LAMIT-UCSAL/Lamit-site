import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useTheme } from './utils/theme'
import Home from './pages/Home'
import Diretoria from './pages/Diretoria'
import Contato from './pages/Contato'
import Shop from './pages/Shop'
import Lamitrack from './pages/Lamitrack'
import NotFound from './pages/NotFound'
import ScrollToTop from './components/ScrollToTop'

// Aplica o tema escolhido no <html>
function ThemeSync() {
  const { theme } = useTheme()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      <ThemeSync />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/diretoria" element={<Diretoria />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/lamitrack" element={<Lamitrack />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
