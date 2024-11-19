// import { createPortal } from 'react-dom'

type PropTypes = {
  row?: boolean
  col?: boolean
}

export function ContextualMenu({ row }: PropTypes) {
  // const root = document.getElementById('root-modal')
  return (
    // createPortal(
    <section className={`contextual-menu ${row ? 'row' : ''}`}>
      <button>delete</button>
      <button>add left</button>
      <button>add right</button>
      <button>copy</button>
      <button>cut</button>
      <button>paste</button>
      <button>order desc</button>
      <button>order asc</button>
    </section>
    //   , root!
    // )
  )
}
