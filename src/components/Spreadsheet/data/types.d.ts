export type Cell = {
  x: number
  y: number
  inputValue: string
  computedValue: string
  update: (value: string) => void
  id: string
  references: string[]
}

export type HTMLCell = HTMLTableCellElement
export type HTMLInput = HTMLInputElement

export const parentTag = 'TD'
export const inputTag = 'INPUT'
export const selected = 'selected'
