import { useState, useRef } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GrainientBackground from '../components/GrainientBackground'
import { copiarTexto } from '../utils/swal'
import { showError, showSuccess } from '../utils/swal'
import { isEmailValid, isNameValid, isPhoneValid } from '../utils/validation'
import { usePageMeta } from '../utils/usePageMeta'

function Contato() {
  usePageMeta('Contato', 'Fale com a LAMIT: envie uma mensagem pelo formulário ou escreva para contato.lamit@gmail.com.')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [isSending, setIsSending] = useState(false)
  const formRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // O erro do campo some assim que a pessoa começa a corrigir
    if (errors[name]) setErrors({ ...errors, [name]: undefined })
  }

  // Todos os erros de uma vez, abaixo de cada campo (telefone é opcional)
  const validate = () => {
    const next = {}
    if (!formData.name.trim()) next.name = 'Informe seu nome.'
    else if (!isNameValid(formData.name)) next.name = 'Use apenas letras no nome.'
    if (!formData.email.trim()) next.email = 'Informe seu e-mail.'
    else if (!isEmailValid(formData.email)) next.email = 'Confira o e-mail: ele parece incompleto.'
    if (formData.phone.trim() && !isPhoneValid(formData.phone)) next.phone = 'Use DDD e número, por exemplo (71) 99999-9999.'
    if (!formData.message.trim()) next.message = 'Escreva sua mensagem.'
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSending) return

    const nextErrors = validate()
    setErrors(nextErrors)
    const firstInvalid = Object.keys(nextErrors)[0]
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus()
      return
    }

    setIsSending(true)
    try {
      const response = await fetch('https://formsubmit.co/ajax/contato.lamit@gmail.com', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(formRef.current),
      })

      if (!response.ok) throw new Error('FormSubmit request failed')

      showSuccess('Sua mensagem foi enviada com sucesso')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch {
      showError('Não foi possível enviar sua mensagem. Tente novamente mais tarde.')
    } finally {
      setIsSending(false)
    }
  }

  const fieldProps = (name) => ({
    id: name,
    name,
    value: formData[name],
    onChange: handleChange,
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  })

  const fieldError = (name) => (errors[name]
    ? <span id={`${name}-error`} className="field-error" role="alert">{errors[name]}</span>
    : null)

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
          noValidate
        >
          <label htmlFor="name">Nome</label>
          <input type="text" autoComplete="name" {...fieldProps('name')} />
          {fieldError('name')}

          <label htmlFor="email">E-mail</label>
          <input type="email" autoComplete="email" {...fieldProps('email')} />
          {fieldError('email')}

          <label htmlFor="phone">Telefone <span className="field-optional">(opcional)</span></label>
          <input type="tel" autoComplete="tel" {...fieldProps('phone')} />
          {fieldError('phone')}

          <label htmlFor="message">Mensagem</label>
          <textarea {...fieldProps('message')}></textarea>
          {fieldError('message')}

          <p className="form-privacy">
            Seus dados são usados só para responder sua mensagem e chegam até nós por e-mail, via FormSubmit.
          </p>

          <div className="sendContainer">
            <button type="submit" id="sendBtn" disabled={isSending} aria-busy={isSending}>
              {isSending ? 'Enviando…' : 'Enviar'}
            </button>
            <input type="hidden" name="_subject" value="Nova Mensagem!" />
            <input type="text" name="_honey" style={{ display: 'none' }} />
            <input type="hidden" name="_captcha" value="false" />
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
