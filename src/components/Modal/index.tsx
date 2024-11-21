import { useOnClickOutside } from '@/components/Modal/hooks/useOnClickOutside'
import { createPortal } from 'react-dom'

type PropTypes = {
  readonly children: React.ReactNode
  readonly onClose: () => void
  readonly className: string | boolean
}

export function Modal({ children, onClose, className }: PropTypes) {
  useOnClickOutside(onClose)
  const modalRoot = document.getElementById('root-modal')
  return createPortal(
    <section className={`modal-wrapper flex-center ${className}`} role='none'>
      <div className={`${className} modal-content flex-center`}>
        <button className='close-modal' onClick={() => onClose()}>
          x
        </button>
        {children}
      </div>
    </section>,
    modalRoot!
  )
}
