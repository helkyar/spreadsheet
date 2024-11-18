import { Matrix } from '@/context/matrix/data/types'

type ValueType = { computedValue: string; hasRef: boolean }
export type MatrixData = {
  id: number
  matrix: Matrix
  expression: string
  refArray?: string[]
}
interface Parser<Expression = MatrixData | string[], Value = ValueType> {
  setNext(parser: Parser<Expression, Value>): Parser<Expression, Value>

  parse(expression: Expression): Value
}

abstract class AbstractParser implements Parser {
  private nextParser: Parser | null = null

  setNext(parser: Parser): Parser {
    this.nextParser = parser
    //to link the next parser
    return parser
  }

  parse(expression: MatrixData): ValueType {
    if (this.nextParser) {
      return this.nextParser.parse(expression)
    }

    return { computedValue: '', hasRef: false }
  }
}
export { AbstractParser }
