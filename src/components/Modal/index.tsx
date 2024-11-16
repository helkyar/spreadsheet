import { createPortal } from 'react-dom'

type PropTypes = {
  children: React.ReactNode
}

export function Modal({ children }: PropTypes) {
  const modalRoot = document.getElementById('root-modal') as HTMLElement
  return createPortal(
    <section className='modal-wrapper flex-center'>
      <div className='modal-content flex-center'>{children}</div>
    </section>,
    modalRoot
  )
}
