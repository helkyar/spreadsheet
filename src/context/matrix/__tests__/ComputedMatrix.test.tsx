import ComputedMatrix from '@/context/matrix/ComputedMatrix'
import { mockMatrix } from '@/context/matrix/__tests__/mock/matrixMock'
import { describe, expect, it, vi } from 'vitest'

const getMatrixInstance = () => new ComputedMatrix({ matrix: mockMatrix })
const getMockMatrix = () => getMatrixInstance().matrix

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

  it('should compute values followed by "="', () => {
    const matrix = getMockMatrix()

    const cell = matrix[0][0]
    cell.update('=3+2')
    expect(cell.computedValue).toBe(5)
  })

  it('should NOT compute plain values', () => {
    const matrix = getMockMatrix()

    const cell = matrix[0][0]
    cell.update('3+2')
    expect(cell.computedValue).toBe('3+2')
  })

  it('should avoid cyclic reference', () => {
    const matrix = getMockMatrix()

    const firstCell = matrix[0][0]
    const secondCell = matrix[1][0]

    firstCell.update('=A1')
    expect(firstCell.computedValue).toContain('##Error: cyclic reference')

    firstCell.update('=A2')
    secondCell.update('=A1')
    expect(secondCell.computedValue).toContain('##Error: cyclic reference')
  })

  it('should update dependency array', () => {
    const computedMatrix = getMatrixInstance()
    const references = () => computedMatrix['listOfReferences']
    const cell = computedMatrix.matrix[0][0]

    expect(references().length).toBe(0)

    cell.update('=A2')
    expect(references().length).toBe(1)
    expect(references()[0].refIndexArray.length).toBe(1)
    expect(references()[0].refIndexArray[0].ref).toBe('A2')

    cell.update('=A2+A2')
    expect(references().length).toBe(1)
    expect(references()[0].refIndexArray.length).toBe(1)
    expect(references()[0].refIndexArray[0].ref).toBe('A2')

    cell.update('=A2+B2')
    expect(references().length).toBe(1)
    expect(references()[0].refIndexArray.length).toBe(2)
    expect(references()[0].refIndexArray[0].ref).toBe('A2')
    expect(references()[0].refIndexArray[1].ref).toBe('B2')

    cell.update('')
    expect(references().length).toBe(0)
  })

  it('should call update all cells only once', async () => {
    const computedMatrix = getMatrixInstance()
    const cell = computedMatrix.matrix[0][0]

    // @ts-expect-error updateAll is private
    vi.spyOn(computedMatrix, 'updateAll')

    cell.update('a')
    cell.update('b')
    cell.update('c')
    cell.update('d')
    cell.update('e')
    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(computedMatrix['updateAll']).toHaveBeenCalledOnce()
    expect(cell.computedValue).toBe('e')
  })

  it('should avoid un-existent references p.e. A5 in matrix of 4 rows', () => {
    // TO_DO implement this feature first
  })
})
