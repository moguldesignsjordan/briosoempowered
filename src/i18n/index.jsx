import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import en from './en'
import es from './es'

const DICTS = { en, es }
const STORAGE_KEY = 'brioso-lang'

const LangContext = createContext({ lang: 'en', t: en, setLang: () => {} })

/* Order of preference: an explicit ?lang=, what the visitor chose last time,
   then the browser's own language. Spanish speakers land on Spanish. */
function initialLang() {
  if (typeof window === 'undefined') return 'en'

  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (DICTS[fromUrl]) return fromUrl

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (DICTS[saved]) return saved
  } catch {
    // Private mode or blocked storage. Fall through to the browser language.
  }

  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(initialLang)

  useEffect(() => {
    document.documentElement.lang = DICTS[lang].htmlLang
  }, [lang])

  const setLang = useCallback((next) => {
    if (!DICTS[next]) return
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Not being able to remember the choice is survivable.
    }
  }, [])

  const value = useMemo(() => ({ lang, t: DICTS[lang], setLang }), [lang, setLang])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}

/* Two-state switch. Both labels stay visible so a visitor who cannot read the
   current language can still find their own. */
export function LangToggle({ className = '' }) {
  const { lang, t, setLang } = useLang()
  const next = lang === 'en' ? 'es' : 'en'

  return (
    <button
      type="button"
      className={`lang-toggle ${className}`.trim()}
      onClick={() => setLang(next)}
      aria-label={t.switchTo}
      title={t.switchTo}
    >
      <span className={lang === 'en' ? 'on' : ''}>EN</span>
      <span aria-hidden="true" className="lang-sep" />
      <span className={lang === 'es' ? 'on' : ''}>ES</span>
    </button>
  )
}
