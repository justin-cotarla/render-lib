import { Matrix } from './Matrix'
import { Vector } from './Vector'

export abstract class AbstractVec<V extends number[], M extends number[]>
  implements Vector<V, M>
{
  constructor(
    protected readonly ARITY: number,
    readonly data: V
  ) {}

  abstract clone(): AbstractVec<V, M>

  protected set(data: V): this {
    for (let i = 0; i < data.length; i++) {
      this.data[i] = data[i]
    }

    return this
  }

  zero() {
    for (let i = 0; i < this.ARITY; i++) {
      this.data[i] = 0
    }

    return this
  }

  toString() {
    return `[${this.data.join(', ')}]`
  }

  magnitude() {
    const squareSum = this.data.reduce((prev, curr) => prev + curr ** 2, 0)

    return Math.sqrt(squareSum)
  }

  normalize() {
    const magnitude = this.magnitude()

    this.data.forEach((_, index) => {
      this.data[index] /= magnitude
    })

    return this
  }

  add(v: Vector<V, M>) {
    for (let i = 0; i < this.ARITY; i++) {
      this.data[i] += v.data[i]
    }

    return this
  }

  subtract(v: Vector<V, M>) {
    for (let i = 0; i < this.ARITY; i++) {
      this.data[i] -= v.data[i]
    }

    return this
  }

  scale(k: number) {
    for (let i = 0; i < this.ARITY; i++) {
      this.data[i] *= k
    }

    return this
  }

  dot(v: Vector<V, M>) {
    let value = 0
    for (let i = 0; i < this.ARITY; i++) {
      value += this.data[i] * v.data[i]
    }

    return value
  }

  mul(v: Vector<V, M>) {
    for (let i = 0; i < this.ARITY; i++) {
      this.data[i] *= v.data[i]
    }

    return this
  }

  angle(v: Vector<V, M>) {
    return Math.acos(this.dot(v) / this.magnitude() ** 2)
  }

  applyMatrix(m: Matrix<M>) {
    const result = new Array(this.ARITY) as V

    for (let i = 0; i < result.length; i++) {
      result[i] = 0
    }
    for (let i = 0; i < this.ARITY; i++) {
      for (let k = 0; k < this.ARITY; k++) {
        result[i] += this.data[k] * m.data[i + k * this.ARITY]
      }
    }

    return this.set(result)
  }

  isZero(): boolean {
    return this.data.every((value) => value === 0)
  }
}
