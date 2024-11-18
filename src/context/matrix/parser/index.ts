import { ExpressionParser } from '@/context/matrix/parser/ExpressionParser'
import { ReferenceParser } from '@/context/matrix/parser/ReferenceParser'
import { SimpleParser } from '@/context/matrix/parser/SimpleParser'

const simpleParser = new SimpleParser()
const expressionParser = new ExpressionParser()
const referenceParser = new ReferenceParser()

simpleParser.setNext(expressionParser).setNext(referenceParser)
const parser = simpleParser

export { parser }
