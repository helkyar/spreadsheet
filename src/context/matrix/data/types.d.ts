export type Cell = {
  x: number
  y: number
  inputValue: string
  computedValue: string
  update: (value: string) => void
}
export type MatrixContext = {
  matrix: Cell[][]
  save: () => void
}

export type ConstructorParams =
  | { rows: number; cols: number; matrix: undefined }
  | { matrix: Cell[][]; rows: undefined; cols: undefined }

export type MatrixParams = {
  rows: number
  cols: number
}

export type Coordinates = {
  x: number
  y: number
}

export type PartialCell = Coordinates & {
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
