import { HTMLAttributes, MouseEvent } from 'react'

type PropTypes = HTMLAttributes<HTMLButtonElement> & {
  label: string
  Icon: JSX.Element
  onClick: (event: MouseEvent) => void
  name?: string //FIX_ME: should't be necessary
}

export function MenuButton({ label, onClick, Icon, ...props }: PropTypes) {
  return (
    <button onClick={onClick} {...props}>
      {label}
      {Icon}
    </button>
  )
}
