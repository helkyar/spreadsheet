import { MouseEvent } from 'react'

type PropTypes = {
  label: string
  Icon: JSX.Element
  onClick: (event: MouseEvent) => void
}

export function MenuButton({ label, onClick, Icon, ...props }: PropTypes) {
  return (
    <button onClick={onClick} {...props}>
      {label}
      {Icon}
    </button>
  )
}
