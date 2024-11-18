import {
  AbstractParser,
  MatrixData,
} from '@/context/matrix/parser/AbstractParser'
import { EVAL_CODE } from '@/context/matrix/parser/constants'

export class SimpleParser extends AbstractParser {
  parse(matrixData: MatrixData) {
    const { expression } = matrixData
    if (!expression.startsWith(EVAL_CODE)) {
      return { computedValue: expression, hasRef: false }
    }
    return super.parse({ ...matrixData, expression: expression.slice(1) })
  }
}
