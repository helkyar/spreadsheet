import { inputTag } from '@/components/Spreadsheet/data/constants'

type PropTypes = {
  readonly children: React.ReactNode
  readonly onClick: (event: React.MouseEvent | React.KeyboardEvent) => void
}

export function Table({ children, onClick }: PropTypes) {
  const handleContextMenu = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement
    if (target.tagName === inputTag) return
    event.preventDefault()
  }

  return (
    <section
      className='table-wrapper'
      onContextMenu={handleContextMenu}
      onMouseUp={onClick}
      onKeyDown={onClick}
      role='application'
    >
      <table aria-label='spreadsheet'>{children}</table>
    </section>
  )
}
