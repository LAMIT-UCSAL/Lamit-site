import { createContext, useContext, useEffect, useState } from 'react'

// Tema claro/escuro: segue o sistema até o visitante escolher no botão do menu; a escolha fica salva.
const STORAGE_KEY = 'lamit-theme'
const LIGHT_QUERY = '(prefers-color-scheme: light)'

function readStoredTheme() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

const systemTheme = () => (window.matchMedia(LIGHT_QUERY).matches ? 'light' : 'dark')

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} })

export function ThemeProvider({ children }) {
  const [choice, setChoice] = useState(readStoredTheme)
  const [system, setSystem] = useState(systemTheme)

  useEffect(() => {
    const media = window.matchMedia(LIGHT_QUERY)
    const onChange = (event) => setSystem(event.matches ? 'light' : 'dark')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const theme = choice || system

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setChoice(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Sem localStorage (aba anônima restrita): a escolha vale só nesta visita
    }
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
