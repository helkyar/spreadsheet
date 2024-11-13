import ComputedMatrix from '@/context/matrix/ComputedMatrix'
import { mockMatrix } from '@/context/matrix/__tests__/mock/matrixMock'
import { describe, expect, it, vi } from 'vitest'

const getMatrixInstance = () => new ComputedMatrix({ matrix: mockMatrix })
const getMockMatrix = () => getMatrixInstance().matrix
const references = (computedMatrix: ComputedMatrix) => computedMatrix['refList']

describe('ComputedMatrix class', () => {
  it('should create matrix based on values', () => {
    const computedMatrix = new ComputedMatrix({ cols: 10, rows: 10 })
    const { matrix } = computedMatrix
    expect(matrix.length).toBe(10)
    expect(matrix[0].length).toBe(10)
  })

  it('should create matrix based on pre-existent matrix', () => {
    const matrix = getMockMatrix()

    expect(matrix.length).toBe(2)
    expect(matrix[0].length).toBe(2)
  })

  it('should compute values followed by "="', async () => {
    const matrix = getMockMatrix()

    const cell = matrix[0][0]
    cell.update('=3+2', { x: 0, y: 0 })
    expect(cell.computedValue).toBe(5)

    const cell2 = matrix[0][1]
    cell2.update('=A1+2', { x: 0, y: 1 })
    expect(cell2.computedValue).toBe(7)

    cell.update('=3+8', { x: 0, y: 0 })
    await new Promise((r) => setTimeout(r, 10))
    expect(cell2.computedValue).toBe(13)
  })

  it('should NOT compute plain values', () => {
    const matrix = getMockMatrix()

    const cell = matrix[0][0]
    cell.update('3+2', { x: 0, y: 0 })
    expect(cell.computedValue).toBe('3+2')
  })

  it('should avoid un-existent references p.e. A5 in matrix of 4 rows', () => {
    // TO_DO implement this feature first
  })

  it('should avoid cyclic reference', () => {
    const matrix = getMockMatrix()

    const firstCell = matrix[0][0]
    const secondCell = matrix[1][0]

    firstCell.update('=A1', { x: 0, y: 0 })
    expect(firstCell.computedValue).toContain('##Error: cyclic reference')

    firstCell.update('=A2', { x: 0, y: 0 })
    secondCell.update('=A1', { x: 1, y: 0 })
    expect(secondCell.computedValue).toContain('##Error: cyclic reference')
  })

  it('should update dependency array', () => {
    const computedMatrix = getMatrixInstance()
    const cell = computedMatrix.matrix[0][0]

    expect(references(computedMatrix).length).toBe(0)

    cell.update('=A2', { x: 0, y: 0 })
    expect(references(computedMatrix).length).toBe(1)
    expect(references(computedMatrix)[0].refIndexArray.length).toBe(1)
    expect(references(computedMatrix)[0].refIndexArray[0].ref).toBe('A2')

    cell.update('=A2+A2', { x: 0, y: 0 })
    expect(references(computedMatrix).length).toBe(1)
    expect(references(computedMatrix)[0].refIndexArray.length).toBe(1)
    expect(references(computedMatrix)[0].refIndexArray[0].ref).toBe('A2')

    cell.update('=A2+B2', { x: 0, y: 0 })
    expect(references(computedMatrix).length).toBe(1)
    expect(references(computedMatrix)[0].refIndexArray.length).toBe(2)
    expect(references(computedMatrix)[0].refIndexArray[0].ref).toBe('A2')
    expect(references(computedMatrix)[0].refIndexArray[1].ref).toBe('B2')

    cell.update('', { x: 0, y: 0 })
    expect(references(computedMatrix).length).toBe(0)
  })

  it('should call update all cells only once', async () => {
    const computedMatrix = getMatrixInstance()
    const cell = computedMatrix.matrix[0][0]

    // @ts-expect-error updateAll is private
    vi.spyOn(computedMatrix, 'updateAll')

    cell.update('a', { x: 0, y: 0 })
    cell.update('b', { x: 0, y: 0 })
    cell.update('c', { x: 0, y: 0 })
    cell.update('d', { x: 0, y: 0 })
    cell.update('e', { x: 0, y: 0 })
    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(computedMatrix['updateAll']).toHaveBeenCalledOnce()
    expect(cell.computedValue).toBe('e')
  })

  it('should remove references list if deleted and maintain relative reference when REMOVING row', async () => {
    const computedMatrix = getMatrixInstance()
    const cell = () => computedMatrix.matrix[0][0]
    const cell2 = () => computedMatrix.matrix[1][0]
    const cell3 = () => computedMatrix.matrix[0][1]
    const cell4 = () => computedMatrix.matrix[1][1]

    cell().update('=A2', { x: 0, y: 0 }) // A1
    cell2().update('=B1', { x: 1, y: 0 }) // A2 -> A1
    cell3().update('=3+2', { x: 0, y: 1 }) // B1
    cell4().update('=5+5', { x: 1, y: 1 }) // B2 -> B1
    expect(references(computedMatrix).length).toBe(2)
    await new Promise((r) => setTimeout(r, 10))
    expect(cell2().computedValue).toBe(5)
    expect(cell2().id).toBe(2)

    computedMatrix.removeRow(0)
    await new Promise((r) => setTimeout(r, 10))
    // expect(references(computedMatrix).length).toBe(1)
    expect(cell().inputValue).toBe('=B1')
    // expect(cell().computedValue).toBe(10)
    expect(cell().id).toBe(2)
  })
  it('should remove references list if deleted and maintain relative reference when REMOVING col', async () => {
    const computedMatrix = getMatrixInstance()
    const cell = () => computedMatrix.matrix[0][0]
    const cell2 = () => computedMatrix.matrix[1][0]
    const cell3 = () => computedMatrix.matrix[0][1]
    const cell4 = () => computedMatrix.matrix[1][1]

    cell().update('=3+2', { x: 0, y: 0 }) // A1
    cell2().update('=A1', { x: 1, y: 0 }) // A2
    cell3().update('=5+5', { x: 0, y: 1 }) // B1 -> A1
    cell4().update('=A1', { x: 1, y: 1 }) // B2 -> A2
    expect(references(computedMatrix).length).toBe(2)
    await new Promise((r) => setTimeout(r, 10))
    expect(cell4().computedValue).toBe(5)
    expect(cell4().id).toBe(3)

    computedMatrix.removeColumn(0)
    await new Promise((r) => setTimeout(r, 10))
    // expect(references(computedMatrix).length).toBe(1)
    expect(cell2().inputValue).toBe('=A1')
    // expect(cell2().computedValue).toBe(10)
    expect(cell2().id).toBe(3)
  })
  it('should maintain references list with relative reference when ADDING row', async () => {
    const computedMatrix = getMatrixInstance()
    const cell = () => computedMatrix.matrix[0][0]
    const cell2 = () => computedMatrix.matrix[1][0]
    const cell3 = () => computedMatrix.matrix[0][1]
    const cell4 = () => computedMatrix.matrix[1][1]
    const cell5 = () => computedMatrix.matrix[2][0]

    cell().update('=B1', { x: 0, y: 0 }) // A1 -> A2
    cell2().update('=B2', { x: 1, y: 0 }) // A2 -> A3
    cell3().update('=3+2', { x: 0, y: 1 }) // B1 -> B2
    cell4().update('=5+5', { x: 1, y: 1 }) // B2 -> B3
    expect(references(computedMatrix).length).toBe(2)
    await new Promise((r) => setTimeout(r, 10))
    expect(cell().computedValue).toBe(5)
    expect(cell().id).toBe(0)
    expect(cell2().computedValue).toBe(10)
    expect(cell2().id).toBe(2)

    computedMatrix.addRow(0)
    await new Promise((r) => setTimeout(r, 10))
    expect(references(computedMatrix).length).toBe(2)
    expect(cell().computedValue).toBe('')
    expect(cell().id).toBe(4)
    expect(cell2().computedValue).toBe('')
    expect(cell2().id).toBe(0)
    expect(cell5().computedValue).toBe(5)
    expect(cell5().id).toBe(2)
  })
  it('should maintain references list with relative reference when ADDING col', async () => {
    const computedMatrix = getMatrixInstance()
    const cell = () => computedMatrix.matrix[0][0]
    const cell2 = () => computedMatrix.matrix[1][0]
    const cell3 = () => computedMatrix.matrix[0][1]
    const cell4 = () => computedMatrix.matrix[1][1]
    const cell5 = () => computedMatrix.matrix[1][2]

    cell().update('=3+2', { x: 0, y: 0 }) // A1 -> B1
    cell2().update('=A1', { x: 1, y: 0 }) // A2 -> B2
    cell3().update('=5+5', { x: 0, y: 1 }) // B1 -> C1
    cell4().update('=B1', { x: 1, y: 1 }) // B2 -> C2
    expect(references(computedMatrix).length).toBe(2)
    await new Promise((r) => setTimeout(r, 10))
    expect(cell2().computedValue).toBe(5)
    expect(cell2().id).toBe(2)
    expect(cell4().computedValue).toBe(10)
    expect(cell4().id).toBe(3)

    computedMatrix.addColumn(0)
    await new Promise((r) => setTimeout(r, 10))
    expect(references(computedMatrix).length).toBe(2)
    expect(cell2().computedValue).toBe('')
    expect(cell2().id).toBe(5)
    expect(cell4().computedValue).toBe('')
    expect(cell4().id).toBe(2)
    expect(cell5().computedValue).toBe(5)
    expect(cell5().id).toBe(3)
  })
})
