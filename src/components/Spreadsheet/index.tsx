import { useMatrix } from '@/context/matrix/useMatrix'
import { Tabs } from '@/components/Spreadsheet/components/Tabs'
import { Table } from '@/components/Spreadsheet/components/Table'
import { TableHead } from '@/components/Spreadsheet/components/TableHead'
import { TableBody } from '@/components/Spreadsheet/components/TableBody'

export function SpreadSheet() {
  const { currentMatrix } = useMatrix()

  const { id, matrix } = currentMatrix

  return (
    <>
      <Table key={id}>
        <TableHead length={matrix[0].length} />
        <TableBody matrix={matrix} />
      </Table>
      <Tabs />
    </>
  )
}
