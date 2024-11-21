import { ContextualMenu } from '@/components/ContextualMenu'
import { MenuButton } from '@/components/ContextualMenu/components/MenuButton'
import { ArrowLeftIcon } from '@/components/ContextualMenu/components/ui/ArrowLeft'
import { ArrowRightIcon } from '@/components/ContextualMenu/components/ui/ArrowRight'
import { DeleteIcon } from '@/components/ContextualMenu/components/ui/Delete'
import { selector } from '@/components/ContextualMenu/data/constants'
import { useHeaderEvents } from '@/components/Spreadsheet/hooks/useHeaderEvents'
import useMountTransition from '@/logic/useMountTransition'

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
  const isMounted = useMountTransition(openMenu)

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
        className={`${col && 'col'} ${
          row && 'row'
        } flex-center header-${selector}`}
      >
        {label}
      </button>

      {(openMenu || isMounted) && (
        <ContextualMenu
          onClose={() => setOpenMenu(false)}
          className={`${isMounted && 'in'} ${openMenu && 'visible'}`}
          coords={coords.current}
          row={row}
          col={col}
        >
          <section>
            <MenuButton
              label='delete'
              onClick={handleRemove(index - indexCorrection)}
              Icon={<DeleteIcon />}
            />

            {col && (
              <>
                <MenuButton
                  label='add left'
                  onClick={addColumn(y - 1)}
                  Icon={<ArrowLeftIcon />}
                />
                <MenuButton
                  label='add right'
                  onClick={addColumn(y)}
                  Icon={<ArrowRightIcon />}
                />
              </>
            )}
            {row && (
              <>
                <MenuButton
                  label='add above'
                  onClick={addRow(x)}
                  Icon={<ArrowLeftIcon />}
                />
                <MenuButton
                  label='add below'
                  onClick={addRow(x + 1)}
                  Icon={<ArrowRightIcon />}
                />
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
