import { type Cell } from '@/context/matrix/data/types'

type CellProps = {
  cellValues: Cell
  selected: boolean
}
export default function Cell({ cellValues, selected }: CellProps) {
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value
    cellValues.update(value, { x: cellValues.x, y: cellValues.y })
  }

  return (
    <td
      className={selected ? 'selected' : ''}
      data-x={cellValues.x}
      data-y={cellValues.y}
      tabIndex={0}
    >
      <span>{cellValues.computedValue}</span>
      <input
        tabIndex={-1}
        type='text'
        onBlur={handleBlur}
        defaultValue={cellValues.inputValue}
      />
    </td>
  )
}
