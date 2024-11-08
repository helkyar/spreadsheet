import { type Cell } from '@/components/Spreadsheet/logic/types'

type CellProps = {
  cellValues: Cell
}
export default function Cell({ cellValues }: CellProps) {
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value
    cellValues.update(value)
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
