import { useMatrix } from '@/context/matrix/useMatrix'
import { Tabs } from '@/components/Spreadsheet/components/Tabs'
import { Table } from '@/components/Spreadsheet/components/Table'
import { TableHead } from '@/components/Spreadsheet/components/TableHead'
import { TableBody } from '@/components/Spreadsheet/components/TableBody'
import ErrorBoundary from '@/components/ErrorBoundary'
import { useState } from 'react'
import { useMountTransition } from '@/logic/useMountTransition'
import { useTableEvents } from '@/components/Spreadsheet/logic/useTableEvents'
import { useMenu } from '@/components/ContextualMenu/logic/useContextMenu'
import { inputTag } from '@/components/Spreadsheet/data/constants'
import { ContextualMenu } from '@/components/ContextualMenu'

export function SpreadSheet() {
  const { currentMatrix } = useMatrix()
  const { id, matrix } = currentMatrix

  return (
    <>
      <ErrorBoundary main>
        <WrapperWithMenu>
          <Table key={id}>
            <TableHead length={matrix[0].length} />
            <TableBody matrix={matrix} />
          </Table>
        </WrapperWithMenu>
      </ErrorBoundary>
      <ErrorBoundary>
        <Tabs />
      </ErrorBoundary>
    </>
  )
}

const WrapperWithMenu = ({
  children,
}: {
  readonly children: React.ReactNode
}) => {
  const { selectedElements } = useTableEvents()

  const [openMenu, setOpenMenu] = useState(false)
  const isMounted = useMountTransition(openMenu)
  const { setPosition, coords, origin } = useMenu(() => setOpenMenu(true))

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
      onMouseUp={setPosition}
      onKeyDown={setPosition}
    >
      {children}
      {(openMenu || isMounted) && (
        <ContextualMenu
          className={`${isMounted && 'in'} ${openMenu && 'visible'}`}
          onClose={() => setOpenMenu(false)}
          coords={coords}
          origin={origin}
          selectedItems={selectedElements}
        />
      )}
    </section>
  )
}
