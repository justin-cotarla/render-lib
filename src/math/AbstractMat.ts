import { Matrix } from './Matrix'

export abstract class AbstractMat<M extends number[], N extends number[] = []>
  implements Matrix<M>
{
  constructor(
    readonly ARITY: number,
    readonly data: M,
    private readonly getSubmatrix?: () => Matrix<N>
  ) {}

  abstract clone(): AbstractMat<M, N>

  set(data: M): this {
    for (let i = 0; i < data.length; i++) {
      this.data[i] = data[i]
    }

    return this
  }

  public toString() {
    let output = ''

    for (let j = 0; j < this.ARITY; j++) {
      output += '  '
      for (let i = 0; i < this.ARITY; i++) {
        output = `${output}${this.data[i + j * this.ARITY]} `
      }
      output = `${output}\n`
    }
    return `[\n${output}]`
  }

  public transpose() {
    let swap

    for (let j = 0; j < this.ARITY; j++) {
      for (let i = j + 1; i < this.ARITY; i++) {
        swap = this.data[i + j * this.ARITY]
        this.data[i + j * this.ARITY] = this.data[j + i * this.ARITY]
        this.data[j + i * this.ARITY] = swap
      }
    }

    return this
  }

  public add(m: Matrix<M>) {
    for (let j = 0; j < this.ARITY; j++) {
      for (let i = 0; i < this.ARITY; i++) {
        this.data[i + j * this.ARITY] += m.data[i + j * this.ARITY]
      }
    }
    return this
  }

  public subtract(m: Matrix<M>) {
    for (let j = 0; j < this.ARITY; j++) {
      for (let i = 0; i < this.ARITY; i++) {
        this.data[i + j * this.ARITY] -= m.data[i + j * this.ARITY]
      }
    }
    return this
  }

  public scale(k: number) {
    for (let j = 0; j < this.ARITY; j++) {
      for (let i = 0; i < this.ARITY; i++) {
        this.data[i + j * this.ARITY] *= k
      }
    }
    return this
  }

  public multiply(m: Matrix<M>) {
    const result = new Array(this.ARITY ** 2) as M

    for (let i = 0; i < result.length; i++) {
      result[i] = 0
    }

    for (let j = 0; j < this.ARITY; j++) {
      for (let i = 0; i < this.ARITY; i++) {
        for (let k = 0; k < this.ARITY; k++) {
          result[i + j * this.ARITY] +=
            this.data[k + j * this.ARITY] * m.data[i + k * this.ARITY]
        }
      }
    }

    this.set(result)

    return this
  }

  public determinant(): number {
    let determinant = 0

    for (let i = 0; i < this.ARITY; i++) {
      determinant += this.data[i] * this.cofactor(i, 0)
    }

    return determinant
  }

  public inverse() {
    const det = this.determinant()

    if (det === 0) {
      throw new Error('Matrix is not invertible')
    }

    return this.set(
      this.toClassicalAdjoint().scale(1 / this.determinant()).data
    )
  }

  identity() {
    for (let j = 0; j < this.ARITY; j++) {
      for (let i = 0; i < this.ARITY; i++) {
        this.data[i + j * this.ARITY] = i === j ? 1 : 0
      }
    }

    return this
  }

  protected minor(x: number, y: number): number {
    if (!this.getSubmatrix) {
      throw new Error(`Could not compute minor`)
    }

    const submatrix = this.getSubmatrix()

    let currentIndex = 0

    for (let j = 0; j < this.ARITY; j++) {
      if (j === y) {
        continue
      }
      for (let i = 0; i < this.ARITY; i++) {
        if (i === x) {
          continue
        }
        submatrix.data[currentIndex++] = this.data[i + j * this.ARITY]
      }
    }

    return submatrix.determinant()
  }

  protected cofactor(x: number, y: number): number {
    const multiplier = (x + y) % 2 === 0 ? 1 : -1

    return multiplier * this.minor(x, y)
  }

  protected toClassicalAdjoint() {
    const ajoint = this.clone()

    for (let j = 0; j < this.ARITY; j++) {
      for (let i = 0; i < this.ARITY; i++) {
        ajoint.data[j + i * this.ARITY] = this.cofactor(i, j)
      }
    }

    return ajoint
  }
}
