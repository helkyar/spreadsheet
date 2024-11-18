import { DownloadOptions } from '@/components/Spreadsheet/data/types'
import ComputedMatrix from '@/context/matrix/ComputedMatrix'
import { MouseEvent } from 'react'

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
  spreadsheet: { id: string; matrix: Matrix }
  createNewMatrix: (matrix?: Matrix) => void
  removeMatrix: (index: number) => void
  addColumn: (y: number) => (event?: MouseEvent) => void
  addRow: (x: number) => (event?: MouseEvent) => void
  removeColumn: (y: number) => (event?: MouseEvent) => void
  removeRow: (x: number) => (event?: MouseEvent) => void
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
export type UpdateRef = CellObject & {
  hasRef: boolean
  id: number
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
