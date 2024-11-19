import { CellHeader } from '@/components/Spreadsheet/components/CellHeader'
import { getColumnsHeaderLabels } from '@/components/Spreadsheet/utils/columnLabel'

type PropTypes = {
  length: number
}

export function TableHead({ length }: PropTypes) {
  return (
    <thead>
      <tr>
        {getColumnsHeaderLabels(length).map((columLabel, y) => (
          <CellHeader key={columLabel} label={columLabel} index={y} col />
        ))}
      </tr>
    </thead>
  )
}
