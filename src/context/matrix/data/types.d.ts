import ComputedMatrix from '@/context/matrix/ComputedMatrix'
import { DownloadOptions } from '@/components/Spreadsheet/data/types'

export type Matrix = Cell[][]

export type Cell = {
  inputValue: string
  computedValue: string
  update: (value: string, id: number) => void
  id: number
}
export type MatrixContext = {
  matrixIdx: number
  download: (options: Omit<DownloadOptions, 'id'>) => void
  viewMatrix: (index: number) => void
  matrixArray: { id: string; spreadsheet: ComputedMatrix }[]
  currentMatrix: { id: string; matrix: Matrix }
  createNewMatrix: (matrix?: Matrix) => void
  removeMatrix: (index: number) => void
  addColumn: (y: number) => void
  addRow: (x: number) => void
  removeColumn: (y: number) => void
  removeRow: (x: number) => void
  save: () => void
}

export type ConstructorParams =
  | { rows: number; cols: number; matrix?: undefined }
  | { matrix: Matrix; rows?: undefined; cols?: undefined }

export type MatrixParams = {
  rows: number
  cols: number
}

export type Coordinates = {
  x: number
  y: number
}

export type CellObject = {
  computedValue?: string
  inputValue?: string
}

export type PartialCell = {
  id: number
  inputValue: string
}

export type CellWithExpression = PartialCell & {
  expression: string
}

export type CreateRefValues = CellWithExpression & {
  refArray: string[]
}
export type UpdateRef =
  | { hasRef: boolean; id: number; computedValue: string; inputValue: string }
  | {
      hasRef: boolean
      id: number
      computedValue?: undefined
      inputValue?: undefined
    }
export type Reference = PartialCell & {
  computedValue: string
}

export type RefIndexArray = Coordinates & {
  ref: string
}

export type ReturnedProcessInput =
  | { expression: string; hasRef: null }
  | { expression: string; hasRef: string[] }
