export const getColumnsHeaderLabels = (length: number) => [
  '',
  ...Array.from({ length: length }, (_, i) => getAlphabeticalCode(i)),
]

export const getAlphabeticalCode = (column: number) => {
  let label = ''
  while (column >= 0) {
    const remanent = column % 26
    label = String.fromCharCode(65 + remanent) + label
    column = column / 26 - 1
  }
  return label
}

export const getIndexFromLabel = (label: string) => {
  let column = 0
  while (label.length > 0) {
    const letter = label.slice(0, 1)

    column = column * 26 + letter.charCodeAt(0) - 65 + 1
    label = label.slice(1)
  }
  // make it 0 index based
  return column - 1
}
