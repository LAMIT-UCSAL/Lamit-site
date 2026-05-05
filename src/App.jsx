import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Sobre from './pages/Sobre'
import Diretoria from './pages/Diretoria'
import Contato from './pages/Contato'
import Shop from './pages/Shop'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/diretoria" element={<Diretoria />} />
      <Route path="/contato" element={<Contato />} />
      <Route path="/shop" element={<Shop />} />
    </Routes>
  )
}

export default App
