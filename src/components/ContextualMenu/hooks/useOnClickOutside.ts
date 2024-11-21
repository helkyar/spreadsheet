import { selector } from '@/components/ContextualMenu/data/constants'
import { keyGroups } from '@/context/table/data/constants'
import { useEffect } from 'react'

export function useOnClickOutside(handler: () => void) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(`.${selector}`)) {
        handler()
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (keyGroups.escape.includes(event.key)) {
        handler()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    setTimeout(() => document.addEventListener('mousedown', handleClick), 0)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      setTimeout(
        () => document.removeEventListener('mousedown', handleClick),
        0
      )
    }
  }, [handler])
}
