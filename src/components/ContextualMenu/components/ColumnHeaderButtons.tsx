import { MenuButton } from '@/components/ContextualMenu/components/MenuButton'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DeleteIcon,
} from '@/components/ContextualMenu/components/ui'
import { useMatrix } from '@/context/matrix/useMatrix'

export function ColumnHeaderButtons({ col }: { readonly col: number }) {
  const { addColumn, removeColumn } = useMatrix()
  return (
    <section>
      <MenuButton
        label='delete'
        onClick={() => removeColumn(col - 1)}
        Icon={<DeleteIcon />}
      />
      <MenuButton
        label='add left'
        onClick={() => addColumn(col - 1)}
        Icon={<ArrowLeftIcon />}
      />
      <MenuButton
        label='add right'
        onClick={() => addColumn(col)}
        Icon={<ArrowRightIcon />}
      />

      {/* <section>
              <button>order desc</button>
              <button>order asc</button>
            </section> */}
    </section>
  )
}
