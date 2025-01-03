import { type Cell } from '@/context/matrix/data/types'

type CellProps = {
  readonly cellValues: Cell
  readonly x: number
  readonly y: number
}
export function Cell({ cellValues, x, y }: CellProps) {
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value
    cellValues.update(value, cellValues.id)
  }

  return (
    <td data-x={x} data-y={y} tabIndex={0} role='cell'>
      <span className='cell-text flex-center'>{cellValues.computedValue}</span>
      <input
        aria-hidden='true'
        className='cell-input'
        tabIndex={-1}
        type='text'
        onBlur={handleBlur}
        defaultValue={cellValues.inputValue}
      />
    </td>
  )
}
