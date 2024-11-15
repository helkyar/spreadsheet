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
  download: () => void
  viewMatrix: (index: number) => void
  matrixArray: { id: string; spreadsheet: ComputedMatrix }[]
  spreadsheetEntity: { id: string; spreadsheet: ComputedMatrix }
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

export type UpdateCellValues = PartialCell & {
  expression: string
}

export type CreateRefValues = UpdateCellValues & {
  refArray: RegExpMatchArray
}

export type RefIndexArray = Coordinates & {
  ref: string
}

export type ListOfReferences = UpdateCellValues & {
  refIndexArray: RefIndexArray[]
}

export type ReturnedProcessInput =
  | { expression: string; refArray: null }
  | { expression: string; refArray: RegExpMatchArray }
