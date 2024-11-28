export const cellTag = 'TD'
export const inputTag = 'INPUT'
export const outputTag = 'SPAN'
export const headerTag = 'TH'
export const menuTag = 'BUTTON'

export const menuBtnName = 'context menu button'

export const drag = 'drag'
export const selected = 'selected'
export const selectedT = 'selected-top'
export const selectedB = 'selected-bottom'
export const selectedL = 'selected-left'
export const selectedR = 'selected-right'

export const supportedFileTypes = ['text/plain', 'text/csv']

class KeyGroups {
  skip: string[] = ['Control', 'Alt', 'Shift', 'Escape', 'Tab', 'F10']
  escape: string[] = ['Escape']
  delete: string[] = ['Backspace', 'Delete']
  navigation: string[] = ['ArrowLeft', 'ArrowDown', 'ArrowUp', 'ArrowRight']
  execute: string[] = ['Enter', ' ']
  tab: string[] = ['Tab']
  menu: string[] = ['F10']
  skipOnCellFocus: string[] = [...this.skip, ...this.navigation]
}

export const keyGroups = new KeyGroups()
