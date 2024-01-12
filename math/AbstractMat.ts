import { AbstractVec } from './AbstractVec'

abstract class AbstractMat<
  M extends AbstractMat<M, V>,
  V extends AbstractVec<V>,
> {
  constructor(
    protected readonly ARITY: number,
    private readonly vectorFromArray: (elements: number[]) => V
  ) {}

  [index: number]: number[]

  public abstract clone: () => M
  // public abstract determinant: () => number

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
    return Array.from({ length: this.ARITY }).map((_, index) =>
      this.vectorFromArray(this[index])
    )
  }

  public toColVectors = (): V[] => {
    return this.clone().transpose().toRowVectors()
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

  protected minorElements = (x: number, y: number): number[][] => {
    const elements = []

    let currentRow

    for (let i = 0; i < this.ARITY; i++) {
      if (i === x) {
        continue
      }
      currentRow = []
      for (let j = 0; j < this.ARITY; j++) {
        if (j === y) {
          continue
        }
        currentRow.push(this[i][j])
      }
      elements.push(currentRow)
    }

    return elements
  }
}

export { AbstractMat }
