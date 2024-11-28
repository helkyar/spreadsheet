import { ColumnHeaderButtons } from '@/components/ContextualMenu/components/ColumnHeaderButtons'
import { MenuButton } from '@/components/ContextualMenu/components/MenuButton'
import { RowHeaderButtons } from '@/components/ContextualMenu/components/RowHeaderButtons'
import {
  CopyIcon,
  CutIcon,
  PasteIcon,
} from '@/components/ContextualMenu/components/ui'
import { selector } from '@/components/ContextualMenu/data/constants'
import { Coords } from '@/components/ContextualMenu/data/types'
import { useClipboardContextMenu } from '@/components/ContextualMenu/logic/useClipboardContextMenu'
import { useOnClickOutside } from '@/components/ContextualMenu/logic/useOnClickOutside'
import { useOnExecuteClipboardEvent } from '@/components/ContextualMenu/logic/useOnExecuteClipboardEvent'
import { keyGroups } from '@/components/Spreadsheet/data/constants'
import { Selected } from '@/components/Spreadsheet/data/types'
import { getCellData } from '@/components/Spreadsheet/utils/cell'

type PropTypes = {
  readonly cellType: HTMLElement | null
  readonly children?: React.ReactNode
  readonly coords?: Coords
  readonly onClose: () => void
  readonly selectedItems: Selected
  readonly className: string | boolean
}

export function ContextualMenu({
  children,
  coords,
  cellType,
  className,
  selectedItems,
  onClose,
}: PropTypes) {
  useOnClickOutside(onClose)
  const clipboard = useClipboardContextMenu(selectedItems)
  const { handleClick, handleKey } = useOnExecuteClipboardEvent(onClose)

  const { col, row, index } = getCellData(cellType)

  const closeOnEscape = (event: React.KeyboardEvent) => {
    event.stopPropagation() // avoid remove selection
    const closeKeys = [...keyGroups.escape, ...keyGroups.navigation]
    if (closeKeys.includes(event.key)) onClose()
  }

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      onKeyDown={closeOnEscape}
      style={coords}
      className={`${selector} ${className} ${col && 'col'} ${row && 'row'}`}
      role='none'
    >
      <section onClick={handleClick} onKeyDown={handleKey} role='none'>
        <MenuButton
          name='copy'
          label='copy expression'
          onClick={clipboard.copyExpression}
          Icon={<CopyIcon />}
        />
        <MenuButton
          label='copy value'
          onClick={clipboard.copyValue}
          Icon={<CopyIcon />}
        />
        <MenuButton
          label='cut expression'
          onClick={clipboard.cutExpression}
          Icon={<CutIcon />}
        />
        <MenuButton
          label='cut value'
          onClick={clipboard.cutValue}
          Icon={<CutIcon />}
        />
        <MenuButton
          label='paste'
          onClick={clipboard.paste}
          Icon={<PasteIcon />}
        />
      </section>

      {col && <ColumnHeaderButtons col={index} />}

      {row && <RowHeaderButtons row={index} />}

      {children}
    </div>
  )
}
