import { className } from '@/components/ContextualMenu/data/constants'
import { useEffect } from 'react'

export function useOnClickOutside(handler: () => void) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      event.stopPropagation()
      const target = event.target as HTMLElement
      const parent = target.parentElement as HTMLElement
      const menu = parent.parentElement as HTMLElement
      if (
        target?.className.includes(className) ||
        parent?.className.includes(className) ||
        menu?.className.includes(className)
      ) {
        return
      }
      handler()
    }
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  })
}
