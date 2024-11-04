export default function Cell({ x, y }: { x: number; y: number }) {
  const calculatedValue = x
  const inputValue = y
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    console.log('🚀 ~ handleBlur ~ e:', event.target.value)
    // store data in matrix as inputValue
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
      <span>{calculatedValue}</span>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='cellInput'
          onBlur={handleBlur}
          defaultValue={inputValue}
        />
      </form>
    </td>
  )
}
