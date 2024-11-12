import { Cell } from '@/context/matrix/data/types'

const mockCell = (x: number, y: number): Cell => ({
  x,
  y,
  inputValue: '',
  computedValue: '',
  update: () => {},
})
export const mockMatrix: Cell[][] = [
  [{ ...mockCell(0, 0) }, { ...mockCell(0, 1) }],
  [{ ...mockCell(1, 0) }, { ...mockCell(1, 1) }],
]
