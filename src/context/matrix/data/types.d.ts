export type Cell = {
  x: number
  y: number
  inputValue: string
  computedValue: string
  update: (value: string) => void
  id: string
  references: string[]
}
export type MatrixContext = {
  matrix: Cell[][]
  save: () => void
}
