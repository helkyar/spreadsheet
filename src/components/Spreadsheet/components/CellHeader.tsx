import { ContextualMenu } from '@/components/ContextualMenu'
import { useHeaderEvents } from '@/components/Spreadsheet/hooks/useHeaderEvents'

type PropTypes = {
  readonly label: string | number
  readonly x: number
  readonly y: number
}

export function CellHeader({ label, x, y }: PropTypes) {
  const {
    index,
    row,
    col,
    indexCorrection,
    openMenu,
    coords,
    selectColumn,
    handleMouseUp,
    handleKeyDown,
    handleRemove,
    addColumn,
    addRow,
    setOpenMenu,
  } = useHeaderEvents({ x, y })

  if (!y) {
    return (
      <th
        onMouseUp={selectColumn(y)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        data-x={x}
        data-y={y}
      />
    )
  }

  let headerType = ''
  if (col) headerType = 'col'
  else if (row) headerType = 'row'
  const className = `${headerType} flex-center header-contextmenu`

  return (
    <th
      onMouseUp={handleMouseUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      data-x={x}
      data-y={y}
    >
      <button
        onClick={() => setOpenMenu(true)}
        onKeyDown={handleKeyDown}
        className={className}
      >
        {label}
      </button>

      {openMenu && (
        <ContextualMenu
          onClose={() => setOpenMenu(false)}
          row={row}
          coords={coords.current}
          isSelected
        >
          <section>
            <button onClick={handleRemove(index - indexCorrection)}>
              delete
            </button>
            {col && (
              <>
                <button onClick={addColumn(y - 1)}>add left</button>
                <button onClick={addColumn(y)}>add right</button>
              </>
            )}
            {row && (
              <>
                <button onClick={addRow(x)}>add above</button>
                <button onClick={addRow(x + 1)}>add below</button>
              </>
            )}
          </section>
          {/* <section>
            <button>order desc</button>
            <button>order asc</button>
          </section> */}
        </ContextualMenu>
      )}
    </th>
  )
}
