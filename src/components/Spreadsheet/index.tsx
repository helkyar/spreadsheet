import { useMatrix } from '@/context/matrix/useMatrix'
import { Tabs } from '@/components/Spreadsheet/components/Tabs'
import { TableWithMenu } from '@/components/Spreadsheet/components/Table'
import { TableHead } from '@/components/Spreadsheet/components/TableHead'
import { TableBody } from '@/components/Spreadsheet/components/TableBody'

export function SpreadSheet() {
  const { currentMatrix } = useMatrix()
  const { id, matrix } = currentMatrix

  return (
    <>
      <TableWithMenu key={id}>
        <TableHead length={matrix[0].length} />
        <TableBody matrix={matrix} />
      </TableWithMenu>

      <Tabs />
    </>
  )
}
