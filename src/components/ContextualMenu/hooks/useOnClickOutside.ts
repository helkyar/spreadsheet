import { selector } from '@/components/ContextualMenu/data/constants'
import { keyGroups, menuTag } from '@/components/Spreadsheet/data/constants'
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
        return
      }

      if (keyGroups.skip.includes(event.key)) return

      const target = event.target as HTMLElement
      const isMenu = target.closest?.(`.${selector}`)
      const isHeader = target.className?.includes(selector)
      const isMenuButton = isHeader && target.tagName === menuTag

      if (!isMenu && !isMenuButton) {
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
