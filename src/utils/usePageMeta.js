import { useEffect } from 'react'

const SITE_NAME = 'LAMIT'

// Título e descrição por rota (o site é uma SPA: sem isso, as 4 páginas compartilham o mesmo <title>)
export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Liga Acadêmica de Maratonas, Inovação e Tecnologia`

    if (description) {
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'description')
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', description)
    }
  }, [title, description])
}
