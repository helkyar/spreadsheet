import { createPortal } from 'react-dom'

type PropTypes = {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

export function Modal({ children, isOpen, onClose }: PropTypes) {
  if (!isOpen) return null

  const modalRoot = document.getElementById('root-modal')
  return createPortal(
    <section
      className='modal-wrapper flex-center'
      role='none'
      onClick={onClose}
    >
      <div className='modal-content flex-center'>
        <button className='close-modal' onClick={onClose}>
          x
        </button>
        {children}
      </div>
    </section>,
    modalRoot!
  )
}
