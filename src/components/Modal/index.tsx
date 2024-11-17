import { createPortal } from 'react-dom'

type PropTypes = {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

export function Modal({ children, isOpen, onClose }: PropTypes) {
  if (!isOpen) return null

  const modalRoot = document.getElementById('root-modal') as HTMLElement

  return createPortal(
    <section className='modal-wrapper flex-center' onClick={onClose}>
      <div className='modal-content flex-center'>{children}</div>
    </section>,
    modalRoot
  )
}
