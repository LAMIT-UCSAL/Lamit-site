import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Diretoria from './pages/Diretoria'
import Contato from './pages/Contato'
import Shop from './pages/Shop'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/diretoria" element={<Diretoria />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/shop" element={<Shop />} />
      </Routes>
    </>
  )
}

export default App
