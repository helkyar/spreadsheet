import { keyGroups } from '@/context/table/data/constants'
import { useEffect } from 'react'

export function useOnClickOutside(handler: (event?: MouseEvent) => void) {
  useEffect(() => {
    const eventHandler = (event: MouseEvent) => {
      event.stopPropagation()
      const target = event.target as HTMLElement
      if (target.className.includes('modal-wrapper')) {
        handler(event)
      }
    }
    const keyHandler = (event: KeyboardEvent) => {
      if (keyGroups.escape.includes(event.key)) {
        handler()
      }
    }
    document.addEventListener('keydown', keyHandler)
    document.addEventListener('mousedown', eventHandler)
    return () => {
      document.removeEventListener('keydown', keyHandler)
      document.removeEventListener('mousedown', eventHandler)
    }
  }, [handler])
}
