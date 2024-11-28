import { useMatrix } from '@/context/matrix/useMatrix'
import { Tabs } from '@/components/Spreadsheet/components/Tabs'
import { Table } from '@/components/Spreadsheet/components/Table'
import { TableHead } from '@/components/Spreadsheet/components/TableHead'
import { TableBody } from '@/components/Spreadsheet/components/TableBody'
import { ContextualMenu } from '@/components/ContextualMenu'
import { useContextMenu } from '@/components/ContextualMenu/logic/useContextMenu'
import useMountTransition from '@/logic/useMountTransition'
import { useTableEvents } from '@/components/Spreadsheet/logic/useTableEvents'
import { useState } from 'react'

export function SpreadSheet() {
  const { currentMatrix } = useMatrix()
  const { id, matrix } = currentMatrix

  const [openMenu, setOpenMenu] = useState(false)
  const open = () => setOpenMenu(true)
  const close = () => setOpenMenu(false)

  const isMounted = useMountTransition(openMenu)

  const { selectedElements } = useTableEvents()
  const { setMenuPosition, coords, cellType } = useContextMenu({ open })

  return (
    <>
      <Table key={id} onClick={setMenuPosition}>
        <TableHead length={matrix[0].length} />
        <TableBody matrix={matrix} />
      </Table>

      {(openMenu || isMounted) && (
        <ContextualMenu
          className={`${isMounted && 'in'} ${openMenu && 'visible'}`}
          onClose={close}
          coords={coords}
          cellType={cellType.current}
          selectedItems={selectedElements}
        />
      )}

      <Tabs />
    </>
  )
}
