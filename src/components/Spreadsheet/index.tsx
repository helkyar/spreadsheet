import { useTableEvents } from './logic/useTableEvents'
import { useMatrix } from '@/context/matrix/useMatrix'
import { Tabs } from '@/components/Spreadsheet/components/Tabs'
import { Table } from '@/components/Spreadsheet/components/Table'
import { TableHead } from '@/components/Spreadsheet/components/TableHead'
import { TableBody } from '@/components/Spreadsheet/components/TableBody'

export function SpreadSheet() {
  const { selectColumn, selectRow } = useTableEvents()
  const { currentMatrix, addRow, addColumn, removeColumn, removeRow } =
    useMatrix()

  const { id, matrix } = currentMatrix

  return (
    <>
      <Table key={id}>
        <TableHead
          onClick={selectColumn}
          onAdd={addColumn}
          onRemove={removeColumn}
          length={matrix[0].length}
        />
        <TableBody
          onClick={selectRow}
          onAdd={addRow}
          onRemove={removeRow}
          matrix={matrix}
        />
      </Table>
      <Tabs />
    </>
  )
}
