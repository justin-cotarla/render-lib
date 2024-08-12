import { Matrix } from './Matrix'

export abstract class AbstractMat<M extends number[], N extends number[] = []>
  implements Matrix<M>
{
  constructor(
    readonly ARITY: number,
    private readonly submatrix?: Matrix<N>
  ) {}

  create() {
    const elementCount = this.ARITY ** 2
    const m = new Array(elementCount) as M

    for (let i = 0; i < elementCount; i++) {
      m[i] = 0
    }

    return m
  }

  clone(m: M) {
    return [...m] as M
  }

  toString(m: M) {
    let output = ''

    for (let j = 0; j < this.ARITY; j++) {
      output += '  '
      for (let i = 0; i < this.ARITY; i++) {
        output = `${output}${m[i + j * this.ARITY]} `
      }
      output = `${output}\n`
    }
    return `[\n${output}]`
  }

  transpose(m: M) {
    let swap

    for (let j = 0; j < this.ARITY; j++) {
      for (let i = j + 1; i < this.ARITY; i++) {
        swap = m[i + j * this.ARITY]
        m[i + j * this.ARITY] = m[j + i * this.ARITY]
        m[j + i * this.ARITY] = swap
      }
    }

    return m
  }

  add(m: M, n: M) {
    for (let j = 0; j < this.ARITY; j++) {
      for (let i = 0; i < this.ARITY; i++) {
        m[i + j * this.ARITY] += n[i + j * this.ARITY]
      }
    }
    return m
  }

  subtract(m: M, n: M) {
    for (let j = 0; j < this.ARITY; j++) {
      for (let i = 0; i < this.ARITY; i++) {
        m[i + j * this.ARITY] -= n[i + j * this.ARITY]
      }
    }
    return m
  }

  scale(m: M, k: number) {
    for (let j = 0; j < this.ARITY; j++) {
      for (let i = 0; i < this.ARITY; i++) {
        m[i + j * this.ARITY] *= k
      }
    }
    return m
  }

  toMultiply(m: M, n: M) {
    const result = this.create()

    for (let j = 0; j < this.ARITY; j++) {
      for (let i = 0; i < this.ARITY; i++) {
        for (let k = 0; k < this.ARITY; k++) {
          result[i + j * this.ARITY] +=
            m[k + j * this.ARITY] * n[i + k * this.ARITY]
        }
      }
    }

    m = result

    return result
  }

  determinant(m: M): number {
    let determinant = 0

    for (let i = 0; i < this.ARITY; i++) {
      determinant += m[i] * this.cofactor(m, i, 0)
    }

    return determinant
  }

  toInverse(m: M): M {
    const det = this.determinant(m)

    if (det === 0) {
      throw new Error('Matrix is not invertible')
    }

    return this.scale(this.toClassicalAdjoint(m), 1 / det)
  }

  minor(m: M, x: number, y: number): number {
    if (!this.submatrix) {
      throw new Error(`Could not compute minor on ${m.toString()}`)
    }

    const submatrix = this.submatrix.create()

    let currentIndex = 0

    for (let j = 0; j < this.ARITY; j++) {
      if (j === y) {
        continue
      }
      for (let i = 0; i < this.ARITY; i++) {
        if (i === x) {
          continue
        }
        submatrix[currentIndex++] = m[i + j * this.ARITY]
      }
    }

    return this.submatrix.determinant(submatrix)
  }

  cofactor(m: M, x: number, y: number): number {
    const multiplier = (x + y) % 2 === 0 ? 1 : -1

    return multiplier * this.minor(m, x, y)
  }

  toClassicalAdjoint(m: M) {
    const ajoint = this.create()

    for (let j = 0; j < this.ARITY; j++) {
      for (let i = 0; i < this.ARITY; i++) {
        ajoint[j + i * this.ARITY] = this.cofactor(m, i, j)
      }
    }

    return ajoint
  }

  identity() {
    const m = this.create()

    for (let j = 0; j < this.ARITY; j++) {
      for (let i = 0; i < this.ARITY; i++) {
        if (i === j) {
          m[i + j * this.ARITY] = 1
          continue
        }
      }
    }

    return m
  }
}
