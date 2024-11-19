import { Cell } from '@/context/matrix/data/types'

const mockCell = (id: number): Cell => ({
  id,
  inputValue: '',
  computedValue: '',
  update: () => {},
})
export const mockMatrix: Cell[][] = [
  [{ ...mockCell(0) }, { ...mockCell(1) }],
  [{ ...mockCell(2) }, { ...mockCell(3) }],
]
