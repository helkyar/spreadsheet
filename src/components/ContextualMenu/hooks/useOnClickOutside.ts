import { useEffect } from 'react'

export function useOnClickOutside(handler: () => void) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).parentElement
        ?.parentElement as HTMLElement
      if (target.className.includes('contextual-menu')) return
      handler()
    }
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  })
}
