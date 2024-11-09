export const getColumnsHeaderLabels = (length: number) => [
  '',
  ...Array.from({ length: length }, (_, i) => getAlphabeticalCode(i)),
]

export const getAlphabeticalCode = (colum: number) => {
  let label = ''
  while (colum >= 0) {
    const remanent = colum % 26
    label = String.fromCharCode(65 + remanent) + label
    colum = colum / 26 - 1
  }
  return label
}
