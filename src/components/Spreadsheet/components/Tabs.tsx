import { useMatrix } from '@/context/matrix/useMatrix'
import { MouseEvent } from 'react'

export function Tabs() {
  const { matrixArray, matrixIdx, viewMatrix, createNewMatrix, removeMatrix } =
    useMatrix()

  const handleRemoveTab = (index: number) => (event: MouseEvent) => {
    event.stopPropagation()
    removeMatrix(index)
  }

  return (
    <section className='tabs-wrapper'>
      <button className='create-tab' onClick={() => createNewMatrix()}>
        +
      </button>
      {matrixArray.map((matrix, i) => (
        <div
          key={matrix.id}
          onClick={() => viewMatrix(i)}
          className={`tab flex-center ${matrixIdx === i ? 'selected-tab' : ''}`}
        >
          {`Sheet ${i + 1}`}
          <button
            className='remove-tab flex-center'
            onClick={handleRemoveTab(i)}
          >
            x
          </button>
        </div>
      ))}
    </section>
  )
}
