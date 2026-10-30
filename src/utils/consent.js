// Consentimento de cookies (LGPD). O Google Analytics só é carregado depois do aceite;
// a função window.lamitLoadAnalytics e a leitura da escolha salva ficam no <head> do index.html.
const STORAGE_KEY = 'lamit-cookies'
const OPEN_EVENT = 'lamit:cookies-open'

export function readConsent() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'accepted' || value === 'rejected' ? value : null
  } catch {
    return null
  }
}

export function saveConsent(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // Navegação privada sem storage: a escolha vale só para esta visita
  }

  if (value === 'accepted') {
    window.lamitLoadAnalytics?.()
    return
  }

  window.gtag?.('consent', 'update', { analytics_storage: 'denied' })
  // Remove os cookies que o Analytics já tenha criado (_ga, _ga_XXXX)
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim()
    if (!name.startsWith('_ga')) return
    const domain = window.location.hostname.replace(/^www\./, '')
    document.cookie = `${name}=; Max-Age=0; path=/`
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`
  })
}

// Reabre o aviso (link "Preferências de cookies" nos créditos)
export function openCookieBanner() {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

export function onCookieBannerOpen(handler) {
  window.addEventListener(OPEN_EVENT, handler)
  return () => window.removeEventListener(OPEN_EVENT, handler)
}
