// Validações do formulário de contato: permissivas o bastante para dados reais
// (e-mails com "+", nomes com "Jr.", telefones com +55), estritas o bastante para pegar erro de digitação.

export function isEmailValid(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  return emailRegex.test(email.trim())
}

export function isNameValid(name) {
  // Letras (com acento), espaços, apóstrofo, hífen e ponto; ao menos 2 letras
  const trimmed = name.trim()
  const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ][a-zA-ZÀ-ÖØ-öø-ÿ'.\- ]*$/
  return nameRegex.test(trimmed) && trimmed.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ]/g, '').length >= 2
}

export function isPhoneValid(phone) {
  // Aceita +55, DDD com ou sem parênteses, espaços e hífens: 10 a 13 dígitos no total
  const trimmed = phone.trim()
  if (!/^\+?[\d\s().-]+$/.test(trimmed)) return false
  const digits = trimmed.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 13
}
