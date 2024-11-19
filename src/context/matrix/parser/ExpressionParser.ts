import {
  AbstractParser,
  MatrixData,
} from '@/context/matrix/parser/AbstractParser'

export class ExpressionParser extends AbstractParser {
  parse(matrixData: MatrixData) {
    const { expression } = matrixData
    const referencePattern = /([A-Z]{1,3}\d{1,7})/g
    const referenceFound = expression.match(referencePattern)

    if (!referenceFound) {
      return { computedValue: this.evaluateInput(expression), hasRef: false }
    }

    return super.parse({ ...matrixData })
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
