import { HTMLAttributes, MouseEvent } from 'react'

type PropTypes = HTMLAttributes<HTMLButtonElement> & {
  label: string
  Icon: JSX.Element
  onClick: (event: MouseEvent) => void
  name?: string
  disabled?: boolean
}

export function MenuButton({ label, onClick, Icon, ...props }: PropTypes) {
  return (
    <button onClick={onClick} {...props}>
      {label}
      {Icon}
    </button>
  )
}
