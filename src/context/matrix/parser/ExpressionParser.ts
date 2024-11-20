import {
  AbstractParser,
  MatrixData,
} from '@/context/matrix/parser/AbstractParser'
import { safeEval } from '@/context/matrix/parser/eval'

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
    const referencePattern = /(^([-+/*]\d+(\.\d+)?)*)|^Math/g
    const safeMatch = expression.match(referencePattern)
    if (!safeMatch) return '##Error: invalid expression'
    return safeEval(expression)
  }
}
