import { useEffect } from 'react'

export function useOnClickOutside(handler: (event?: MouseEvent) => void) {
  useEffect(() => {
    const eventHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target.className.includes('modal-wrapper')) {
        handler(event)
      }
    }
    document.addEventListener('mousedown', eventHandler)
    return () => {
      document.removeEventListener('mousedown', eventHandler)
    }
  }, [handler])
}
