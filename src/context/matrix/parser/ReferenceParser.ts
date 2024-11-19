import { getIndexFromLabel } from '@/components/Spreadsheet/utils/columnLabel'
import { Cell, Matrix, ReturnedProcessInput } from '@/context/matrix/data/types'
import {
  AbstractParser,
  MatrixData,
} from '@/context/matrix/parser/AbstractParser'
import { EVAL_CODE } from '@/context/matrix/parser/constants'

export class ReferenceParser extends AbstractParser {
  parse({ id, expression, matrix }: MatrixData) {
    const referencePattern = /([A-Z]{1,3}\d{1,7})/g
    const referenceFound = expression.match(referencePattern)
    const refArray = referenceFound!.filter(
      (ref, i, self) => i === self.findIndex((r) => r === ref)
    )

    const cyclicError = this.findCyclicReferences({ id, refArray, matrix })
    if (cyclicError) return { computedValue: cyclicError, hasRef: true }

    const formula = this.generateFormula({ expression, refArray, matrix })
    return { computedValue: this.evaluateInput(formula), hasRef: true }
  }

  private generateFormula({
    matrix,
    expression,
    refArray,
  }: {
    matrix: Matrix
    expression: string
    refArray: string[]
  }) {
    let error = ''
    const refIndexArray = this.generateCoordinatesFromReferences(refArray)
    const formula = `(function(){
            ${refIndexArray
              ?.map((cell) => {
                const computedValue = matrix[cell.x]?.[cell.y]?.computedValue
                if (!computedValue) return `const ${cell.ref} = ''`
                if (computedValue.toString().startsWith('##Error')) {
                  error = computedValue
                }
                return `const ${cell.ref} = ${JSON.stringify(computedValue)}`
              })
              .join('\n')}
            return %{expression}%
          })()`

    return formula.replace('%{expression}%', error ?? expression)
  }

  private findCyclicReferences({
    id,
    refArray,
    matrix,
  }: {
    refArray: string[]
    matrix: Matrix
    id: number
  }) {
    const cell = matrix.flat().find((currentCell) => currentCell.id === id)

    if (!cell) return '##Error: cell not found'
    const isCyclic = this.checkIfCyclic(refArray, matrix, cell)
    if (isCyclic) return '##Error: cyclic reference'
  }

  private checkIfCyclic(
    refArray: string[],
    matrix: Matrix,
    original: Cell
  ): boolean {
    const refIndexArray = this.generateCoordinatesFromReferences(refArray)

    return refIndexArray.some((ref) => {
      const cell = matrix[ref.x]?.[ref.y]
      if (!cell) return false
      if (original.id === cell.id) return true
      const { hasRef } = this.processInputValue(cell.inputValue)
      if (!hasRef) return false

      return this.checkIfCyclic(hasRef, matrix, original)
    })
  }

  readonly processInputValue = (input: string): ReturnedProcessInput => {
    if (!input.startsWith(EVAL_CODE)) {
      return { expression: input, hasRef: null }
    }
    const expression = input.slice(1)
    const referencePattern = /([A-Z]{1,3}\d{1,7})/g
    const referenceFound = expression.match(referencePattern)
    if (!referenceFound) {
      const evalExpression = this.evaluateInput(expression)
      return { expression: evalExpression, hasRef: null }
    }

    const hasRef = referenceFound.filter(
      (ref, i, self) => i === self.findIndex((r) => r === ref)
    )
    return { expression, hasRef }
  }

  private generateCoordinatesFromReferences(refArray: string[]) {
    return refArray.map((ref) => {
      const yIndex = ref.match(/([A-Z]{1,3})/g)
      const xIndex = ref.match(/(\d{1,7})/g)
      return {
        y: getIndexFromLabel(yIndex?.toString() ?? ''),
        x: Number(xIndex) - 1,
        ref,
      }
    })
  }

  private evaluateInput(expression: string) {
    if (expression.startsWith('##Error')) return expression
    try {
      return eval(expression)
    } catch (error) {
      return `##Error: ${error}`
    }
  }
}
