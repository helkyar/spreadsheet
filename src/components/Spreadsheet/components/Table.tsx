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
      role='none'
      className='table-wrapper'
      // listeners to determine contextual menu behavior
      onContextMenu={handleContextMenu}
      onMouseUp={onClick}
      onKeyDown={onClick}
    >
      <table aria-label='spreadsheet'>{children}</table>
    </section>
  )
}
