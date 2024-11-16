import { useMatrix } from '@/context/matrix/useMatrix'
import { MouseEvent } from 'react'

export function Tabs() {
  const { viewMatrix, matrixArray, createNewMatrix, removeMatrix, matrixIdx } =
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
      {matrixArray.map((matrix, index) => (
        <div
          tabIndex={0}
          onClick={() => viewMatrix(index)}
          key={matrix.id}
          className={`tab flex-center ${
            matrixIdx === index ? 'selected-tab' : ''
          }`}
        >
          {`Sheet ${index + 1}`}
          <button
            className='remove-tab flex-center'
            onClick={handleRemoveTab(index)}
          >
            x
          </button>
        </div>
      ))}
    </section>
  )
}
