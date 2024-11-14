import { useMatrix } from '@/context/matrix/useMatrix'

export default function Tabs() {
  const { viewMatrix, matrixArray, createNewMatrix, removeMatrix } = useMatrix()
  return (
    <section className='tabs-wrapper'>
      {matrixArray.map((matrix, index) => (
        <div key={matrix.id} className='tab'>
          <button onClick={() => viewMatrix(index)}>TAB</button>
          <button onClick={() => removeMatrix(index)}>Delete</button>
        </div>
      ))}
      <button onClick={createNewMatrix}>Create</button>
    </section>
  )
}
