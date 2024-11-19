import { useMatrix } from '@/context/matrix/useMatrix'
import { Tabs } from '@/components/Spreadsheet/components/Tabs'
import { Table } from '@/components/Spreadsheet/components/Table'
import { TableHead } from '@/components/Spreadsheet/components/TableHead'
import { TableBody } from '@/components/Spreadsheet/components/TableBody'
import { useTableEvents } from '@/context/table/useTableEvents'

export function SpreadSheet() {
  const { selectColumn, selectRow } = useTableEvents()
  const { currentMatrix } = useMatrix()

  const { id, matrix } = currentMatrix

  return (
    <>
      <Table key={id}>
        <TableHead onClick={selectColumn} length={matrix[0].length} />
        <TableBody onClick={selectRow} matrix={matrix} />
      </Table>
      <Tabs />
    </>
  )
}
