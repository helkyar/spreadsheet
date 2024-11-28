import { selector } from '@/components/ContextualMenu/data/constants'
import { keyGroups } from '@/components/Spreadsheet/data/constants'
import { useEffect } from 'react'

export function useOnClickOutside(onClose: () => void) {
  useEffect(() => {
    const debounce = (fn: () => void) => setTimeout(() => fn(), 0)
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target.closest(`.${selector}`)) return

      onClose()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      const closeKeys = [...keyGroups.escape, ...keyGroups.navigation]
      if (closeKeys.includes(event.key)) {
        onClose()
        return
      }
      const target = event.target as HTMLElement
      if (target.closest(`.${selector}`)) return
      if (keyGroups.tab.includes(event.key)) onClose()
    }

    // FIX_ME: hacky implementation
    // TO_DO: add window resize event to close menu
    debounce(() => document.addEventListener('keydown', handleKeyDown))
    debounce(() => document.addEventListener('mousedown', handleClick))
    return () => {
      debounce(() => document.removeEventListener('keydown', handleKeyDown))
      debounce(() => document.removeEventListener('mousedown', handleClick))
    }
  }, [onClose])
}
