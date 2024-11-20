import { CellHeader } from '@/components/Spreadsheet/components/CellHeader'
import { getColumnsHeaderLabels } from '@/components/Spreadsheet/utils/columnLabel'

type PropTypes = {
  readonly length: number
}

export function TableHead({ length }: PropTypes) {
  return (
    <thead>
      <tr>
        {getColumnsHeaderLabels(length).map((columnLabel, y) => (
          <CellHeader key={columnLabel} label={columnLabel} y={y} x={-1} />
        ))}
      </tr>
    </thead>
  )
}
