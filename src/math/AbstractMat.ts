import { AbstractVec } from './AbstractVec'

export abstract class AbstractMat<
  M extends AbstractMat<M, V, T>,
  V extends AbstractVec<V, T>,
  T extends number[],
> {
  constructor(
    protected readonly ARITY: number,
    private readonly vectorFromArray: (elements: number[]) => V
  ) {}

  [index: number]: number[]

  public abstract clone: () => M

  public toArray = (): number[] => {
    return this.toRowVectors().flatMap((row) => row.toArray())
  }

  public toString = (): string => {
    let output = ''

    for (let i = 0; i < this.ARITY; i++) {
      output = `${output} ${this[i].join(', ')}\n`
    }
    return `[\n${output}]`
  }

  public toRowVectors = (): V[] => {
    const vectors: number[][] = new Array(this.ARITY)

    for (let i = 0; i < this.ARITY; i++) {
      vectors[i] = this[i]
    }

    return vectors.map(this.vectorFromArray)
  }

  public toColVectors = (): V[] => {
    const vectors: number[][] = new Array(this.ARITY)

    for (let i = 0; i < this.ARITY; i++) {
      vectors[i] = new Array(this.ARITY)
    }

    for (let j = 0; j < this.ARITY; j++) {
      for (let i = 0; i < this.ARITY; i++) {
        vectors[i][j] = this[j][i]
      }
    }

    return vectors.map(this.vectorFromArray)
  }

  public transpose = (): this => {
    let swap

    for (let i = 0; i < this.ARITY; i++) {
      for (let j = i + 1; j < this.ARITY; j++) {
        swap = this[i][j]
        this[i][j] = this[j][i]
        this[j][i] = swap
      }
    }

    return this
  }

  public add = (m: M): this => {
    for (let i = 0; i < this.ARITY; i++) {
      for (let j = 0; j < this.ARITY; j++) {
        this[i][j] += m[i][j]
      }
    }
    return this
  }

  public subtract = (m: M): this => {
    for (let i = 0; i < this.ARITY; i++) {
      for (let j = 0; j < this.ARITY; j++) {
        this[i][j] -= m[i][j]
      }
    }
    return this
  }

  public scale = (k: number): this => {
    for (let i = 0; i < this.ARITY; i++) {
      for (let j = 0; j < this.ARITY; j++) {
        this[i][j] *= k
      }
    }
    return this
  }

  public multiply = (m: M): this => {
    const rows = this.toRowVectors()
    const cols = m.toColVectors()

    for (let i = 0; i < this.ARITY; i++) {
      for (let j = 0; j < this.ARITY; j++) {
        this[i][j] = rows[i].dot(cols[j])
      }
    }

    return this
  }

  public determinant = (): number => {
    let determinant = 0

    for (let i = 0; i < this.ARITY; i++) {
      const element = this[0][i]

      determinant += element * this.cofactor(i, 0)
    }

    return determinant
  }

  public inverse = (): M => {
    const det = this.determinant()

    if (det === 0) {
      throw new Error('Matrix is not invertible')
    }

    return this.classicalAdjoint().scale(1 / this.determinant())
  }

  protected abstract minor: (x: number, y: number) => number
  protected abstract classicalAdjoint: () => M

  protected minorElements = (x: number, y: number): number[][] => {
    const elements = []

    let currentRow

    for (let i = 0; i < this.ARITY; i++) {
      if (i === y) {
        continue
      }
      currentRow = []
      for (let j = 0; j < this.ARITY; j++) {
        if (j === x) {
          continue
        }
        currentRow.push(this[i][j])
      }
      elements.push(currentRow as T)
    }

    return elements
  }

  protected cofactor = (x: number, y: number): number => {
    const multiplier = (x + y) % 2 === 0 ? 1 : -1

    return multiplier * this.minor(x, y)
  }

  protected classicalAdjointElements = (): T[] => {
    const elements: T[] = []

    let currentRow

    for (let i = 0; i < this.ARITY; i++) {
      currentRow = []
      for (let j = 0; j < this.ARITY; j++) {
        currentRow.push(this.cofactor(i, j))
      }
      elements.push(currentRow as T)
    }

    return elements
  }

  protected static identityElements = (arity: number): number[][] => {
    const elements = []

    let currentRow

    for (let i = 0; i < arity; i++) {
      currentRow = []
      for (let j = 0; j < arity; j++) {
        if (i === j) {
          currentRow.push(1)
          continue
        }
        currentRow.push(0)
      }
      elements.push(currentRow)
    }

    return elements
  }
}
