import { type Cell } from '@/context/matrix/data/types'

type CellProps = {
  cellValues: Cell
  x: number
  y: number
}
export function Cell({ cellValues, x, y }: CellProps) {
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value
    cellValues.update(value, cellValues.id)
  }

  return (
    <td data-x={x} data-y={y} tabIndex={0}>
      <span className='cell-text flex-center'>{cellValues.computedValue}</span>
      <input
        className='cell-input'
        tabIndex={-1}
        type='text'
        onBlur={handleBlur}
        defaultValue={cellValues.inputValue}
      />
    </td>
  )
}
