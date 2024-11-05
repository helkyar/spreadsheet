import { type Cell } from '@/logic/types'

type CellProps = {
  cellValues: Cell
  onChange: ({ x, y, value }: { x: number; y: number; value: string }) => void
}
export default function Cell({ cellValues, onChange }: CellProps) {
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value
    onChange({ x: cellValues.x, y: cellValues.y, value })
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formElements = form.elements as typeof form.elements & {
      cellInput: HTMLInputElement
    }
    formElements.cellInput.blur()
  }

  return (
    <td>
      <span>{cellValues.computedValue}</span>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='cellInput'
          onBlur={handleBlur}
          defaultValue={cellValues.inputValue}
        />
      </form>
    </td>
  )
}
