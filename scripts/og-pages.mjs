// Prévias de compartilhamento por página (WhatsApp, Instagram, LinkedIn…).
// O site é uma SPA e os robôs dessas redes não rodam JavaScript: eles só leem o HTML inicial.
// Depois do `vite build`, este script copia dist/index.html para dist/<rota>.html trocando título,
// descrição e capa. No Cloudflare (assets com html_handling padrão) /diretoria serve diretoria.html,
// e o React Router assume a partir daí como sempre.

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Endereço público do site (trocar quando houver domínio próprio)
export const SITE_URL = 'https://lamit-site.monjogui.workers.dev'

const PAGES = {
  diretoria: {
    title: 'Diretoria | LAMIT',
    description: 'Conheça quem lidera as frentes da LAMIT, a Liga Acadêmica de Maratonas, Inovação e Tecnologia da UCSal.',
    image: '/og/diretoria.jpg',
  },
  contato: {
    title: 'Contato | LAMIT',
    description: 'Fale com a LAMIT: envie uma mensagem pelo formulário ou escreva para contato.lamit@gmail.com.',
    image: '/og/contato.jpg',
  },
  shop: {
    title: 'Shop | LAMIT',
    description: 'A loja oficial da LAMIT está chegando.',
    image: '/og/shop.jpg',
  },
  lamitrack: {
    title: 'LamiTrack | LAMIT',
    description: 'LamiTrack: a vitrine de eventos da LAMIT está chegando.',
    image: '/og/lamitrack.jpg',
  },
}

const escapeAttr = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function setMeta(html, attr, key, value) {
  const pattern = new RegExp(`(<meta ${attr}="${key.replace(/[:.]/g, '\\$&')}" content=")[^"]*(")`)
  if (!pattern.test(html)) throw new Error(`meta ${attr}="${key}" não encontrada no index.html`)
  return html.replace(pattern, `$1${escapeAttr(value)}$2`)
}

const dist = fileURLToPath(new URL('../dist', import.meta.url))

try {
  const base = readFileSync(join(dist, 'index.html'), 'utf8')

  for (const [route, page] of Object.entries(PAGES)) {
    const url = `${SITE_URL}/${route}`
    let html = base.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(page.title)}</title>`)
    html = setMeta(html, 'name', 'description', page.description)
    html = setMeta(html, 'property', 'og:title', page.title)
    html = setMeta(html, 'property', 'og:description', page.description)
    html = setMeta(html, 'property', 'og:image', `${SITE_URL}${page.image}`)
    html = setMeta(html, 'property', 'og:url', url)
    html = setMeta(html, 'name', 'twitter:title', page.title)
    html = setMeta(html, 'name', 'twitter:description', page.description)
    html = setMeta(html, 'name', 'twitter:image', `${SITE_URL}${page.image}`)
    html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    writeFileSync(join(dist, `${route}.html`), html)
  }

  console.log(`prévias geradas: ${Object.keys(PAGES).map((r) => `${r}.html`).join(', ')}`)
} catch (error) {
  console.error('Error in og-pages:', error)
  throw new Error(`Failed to generate page previews: ${error.message}`)
}
