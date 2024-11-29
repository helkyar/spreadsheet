import { selector } from '@/components/ContextualMenu/data/constants'
import { debounce } from '@/components/Spreadsheet/utils/debounce'
import { useEffect } from 'react'

export function useOnClickOutside(onClose: () => void) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target.closest(`.${selector}`)) return

      onClose()
    }

    // avoid conflict while setting same event listener on same element
    debounce(() => document.addEventListener('mousedown', handleClick))
    window.addEventListener('resize', () => onClose())
    return () => {
      debounce(() => document.removeEventListener('mousedown', handleClick))
      window.removeEventListener('resize', () => onClose())
    }
  }, [onClose])
}
