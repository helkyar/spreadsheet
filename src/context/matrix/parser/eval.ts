export const safeEval = (expression: string) => {
  try {
    return eval(expression)
  } catch (error) {
    return `##Error: ${error}`
  }
}
