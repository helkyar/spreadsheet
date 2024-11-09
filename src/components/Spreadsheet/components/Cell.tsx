import { type Cell } from '@/components/Spreadsheet/logic/types'

type CellProps = {
  cellValues: Cell
  selected: boolean
}
export default function Cell({ cellValues, selected }: CellProps) {
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value
    cellValues.update(value)
  }
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const eventKeyBlur = ['Enter', 'Escape']
    if (eventKeyBlur.includes(event.key)) event.currentTarget.blur()
    // Arrow keys -> focus next input
    // Shift + Arrow keys -> select
    // Enter -> focus underneath input
  }

  return (
    <td
      className={selected ? 'selected' : ''}
      data-x={cellValues.x}
      data-y={cellValues.y}
    >
      <span>{cellValues.computedValue}</span>
      <input
        type='text'
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        defaultValue={cellValues.inputValue}
      />
    </td>
  )
}
