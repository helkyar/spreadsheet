import { MenuButton } from '@/components/ContextualMenu/components/MenuButton'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DeleteIcon,
} from '@/components/ContextualMenu/components/ui'
import { useMatrix } from '@/context/matrix/useMatrix'

export function RowHeaderButtons({ row }: { readonly row: number }) {
  const { addRow, removeRow } = useMatrix()
  return (
    <section>
      <MenuButton
        label='delete'
        onClick={() => removeRow(row)}
        Icon={<DeleteIcon />}
      />
      <MenuButton
        label='add above'
        onClick={() => addRow(row)}
        Icon={<ArrowLeftIcon />}
      />
      <MenuButton
        label='add below'
        onClick={() => addRow(row + 1)}
        Icon={<ArrowRightIcon />}
      />

      {/* <section>
              <button>order desc</button>
              <button>order asc</button>
            </section> */}
    </section>
  )
}
