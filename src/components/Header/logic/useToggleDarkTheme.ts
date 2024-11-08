import { useCallback, useEffect } from 'react'
import { useLocalStorage } from '@/logic/useLocalStorage'

const THEME_KEY = '_dark_theme_'

export function useToggleDarkTheme() {
  const [isDark, setIsDark] = useLocalStorage<boolean>({ key: THEME_KEY })

  const setIsDarkStyle = useCallback((isDark: boolean) => {
    document.body.classList.toggle('dark', isDark)
  }, [])

  useEffect(() => {
    if (typeof isDark === 'boolean') {
      setIsDarkStyle(isDark)
    } else {
      const systemTheme = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
      setIsDark(systemTheme)
    }
  }, [isDark, setIsDarkStyle, setIsDark])

  const toggleDarkTheme = useCallback(() => {
    setIsDark((prevIsDark) => !prevIsDark)
  }, [setIsDark])

  return { toggleDarkTheme, isDark }
}
