export function Legend() {
  return (
    <section className='legend'>
      <h3>Key bindings</h3>
      <p>
        <span>Tab</span> : Move between cells and buttons
      </p>

      <p>
        <span>←</span> <span>↑</span> <span>↓</span> <span>→</span> : Move
        between cells
      </p>

      <p>
        <span>Ctrl</span> + <span>←</span> <span>↑</span> <span>↓</span>{' '}
        <span>→</span> : Move between sections
      </p>

      <p>
        <span>Shift</span> + <span>←</span> <span>↑</span> <span>↓</span>{' '}
        <span>→</span> : Select cells
      </p>

      <p>
        <span className='space'>Space</span> or <span>Enter</span> : Interact
      </p>

      <p>
        <span>Escape</span> : Remove selection and close contextual menu / modal
      </p>
    </section>
  )
}
