import { useEffect, useState } from 'react'
import { onCookieBannerOpen, readConsent, saveConsent } from '../utils/consent'

// Aviso de cookies: aparece até o visitante aceitar ou recusar; pode ser reaberto pelos créditos.
function CookieBanner() {
  const [open, setOpen] = useState(() => readConsent() === null)

  useEffect(() => onCookieBannerOpen(() => setOpen(true)), [])

  if (!open) return null

  const choose = (value) => {
    saveConsent(value)
    setOpen(false)
  }

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Aviso de cookies">
      <p className="cookie-banner__text">
        Usamos cookies do Google Analytics para entender como o site é visitado e melhorá-lo.
        Nada é coletado sem o seu aceite.
      </p>
      <div className="cookie-banner__actions">
        <button type="button" className="cookie-banner__btn" onClick={() => choose('rejected')}>
          Recusar
        </button>
        <button type="button" className="cookie-banner__btn cookie-banner__btn--accept" onClick={() => choose('accepted')}>
          Aceitar
        </button>
      </div>
    </div>
  )
}

export default CookieBanner
