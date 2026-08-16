import { useState, useRef } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GrainientBackground from '../components/GrainientBackground'
import { copiarTexto } from '../utils/swal'
import { showError, showSuccess } from '../utils/swal'
import { isEmailValid, isNameValid, isPhoneValid } from '../utils/validation'

function Contato() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const formRef = useRef(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (formData.name === '') { showError('Por favor insira seu nome'); return }
    if (!isNameValid(formData.name)) { showError('Por favor insira um nome válido'); return }
    if (formData.email === '') { showError('Por favor insira seu email'); return }
    if (!isEmailValid(formData.email)) { showError('Por favor insira um email válido'); return }
    if (formData.phone === '') { showError('Por favor insira seu telefone'); return }
    if (!isPhoneValid(formData.phone)) { showError('Por favor insira um telefone válido'); return }
    if (formData.message === '') { showError('Por favor deixe uma mensagem'); return }

    showSuccess('Sua mensagem foi enviada com sucesso').then(() => {
      formRef.current.submit()
    })
  }

  return (
    <div className="page-bg" style={{ background: 'none' }}>
      <GrainientBackground />
      <Navbar currentPage="CONTATO" />
      <Footer />

      <div id="contact_content">
        <div id="titleContainer">
          <h1>Deixe uma mensagem</h1>
        </div>

        <form
          id="form"
          ref={formRef}
          action="https://formsubmit.co/contato.lamit@gmail.com"
          method="POST"
          onSubmit={handleSubmit}
        >
          <label htmlFor="name">Nome</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />

          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />

          <label htmlFor="phone">Telefone</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />

          <label htmlFor="message">Mensagem</label>
          <textarea id="message" name="message" value={formData.message} onChange={handleChange}></textarea>

          <div className="sendContainer">
            <button type="submit" id="sendBtn">ENVIAR</button>
            <input type="hidden" name="_subject" value="Nova Mensagem!" />
            <input type="text" name="_honey" style={{ display: 'none' }} />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_next" value="#" />
          </div>
        </form>

        <div className="contact_msg">
          <h3>
            Ou entre em contato diretamente
            <br />
            pelo nosso email
          </h3>
          <div id="contacts">
            <p><button onClick={() => copiarTexto('contato.lamit@gmail.com')}>contato.lamit@gmail.com</button></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contato
