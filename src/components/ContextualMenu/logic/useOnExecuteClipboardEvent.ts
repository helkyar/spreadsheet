import { selector } from '@/components/ContextualMenu/data/constants'
import { keyGroups } from '@/components/Spreadsheet/data/constants'
import { debounce } from '@/components/Spreadsheet/utils/debounce'

export function useOnExecuteClipboardEvent(onClose: () => void) {
  const getMenuElement = (event: React.MouseEvent | React.KeyboardEvent) => {
    const target = event.target as HTMLElement
    const isButton = target.tagName === 'BUTTON'
    const menu = target.closest(`.${selector}`)
    return isButton ? menu : null
  }

  const handleKey = (event: React.KeyboardEvent) => {
    const menu = getMenuElement(event)
    if (keyGroups.execute.includes(event.key) && menu) {
      debounce(() => onClose()) // avoid closing before executing
    }
  }

  const handleClick = (event: React.MouseEvent) => {
    const menu = getMenuElement(event)
    if (menu) onClose()
  }

  return { handleClick, handleKey }
}
