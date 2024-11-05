export type Cell = {
  x: number
  y: number
  inputValue: string
  computedValue: string
  update: (value: string) => void
}
