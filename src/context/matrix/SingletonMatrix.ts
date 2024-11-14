import ComputedMatrix from '@/context/matrix/ComputedMatrix'
import { ConstructorParams } from '@/context/matrix/data/types'

export class SingletonMatrix {
  private static instance: ComputedMatrix | null = null
  private static instances: Record<string, ComputedMatrix> = {}

  static getInstance({ cols, rows, matrix }: ConstructorParams) {
    if (!SingletonMatrix.instance) {
      if (matrix) SingletonMatrix.instance = new ComputedMatrix({ matrix })
      else SingletonMatrix.instance = new ComputedMatrix({ cols, rows })
    }
    return SingletonMatrix.instance
  }
  static getSpecificInstance(
    { cols, rows, matrix }: ConstructorParams,
    key: string
  ) {
    if (!SingletonMatrix.instances[key]) {
      if (matrix)
        SingletonMatrix.instances[key] = new ComputedMatrix({ matrix })
      else SingletonMatrix.instances[key] = new ComputedMatrix({ cols, rows })
    }
    return SingletonMatrix.instances[key]
  }
}
