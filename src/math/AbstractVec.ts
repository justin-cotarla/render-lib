import { Vector } from './Vector'

export abstract class AbstractVec<V extends number[], M extends number[]>
  implements Vector<V, M>
{
  constructor(protected readonly ARITY: number) {}

  zero() {
    const v = new Array(this.ARITY) as V

    for (let i = 0; i < this.ARITY; i++) {
      v[i] = 0
    }

    return v
  }

  clone(v: V) {
    return [...v] as V
  }

  toString(v: V) {
    return `[${v.join(', ')}]`
  }

  magnitude(v: V) {
    const squareSum = v.reduce((prev, curr) => prev + curr ** 2, 0)

    return Math.sqrt(squareSum)
  }

  normalize(v: V) {
    const magnitude = this.magnitude(v)

    v.forEach((_, index) => {
      v[index] /= magnitude
    })

    return v
  }

  add(v: V, w: V) {
    for (let i = 0; i < this.ARITY; i++) {
      v[i] += w[i]
    }

    return v
  }

  subtract(v: V, w: V) {
    for (let i = 0; i < this.ARITY; i++) {
      v[i] -= w[i]
    }

    return v
  }

  scale(v: V, k: number) {
    for (let i = 0; i < this.ARITY; i++) {
      v[i] *= k
    }

    return v
  }

  dot(v: V, w: V) {
    let value = 0
    for (let i = 0; i < this.ARITY; i++) {
      value += v[i] * w[i]
    }

    return value
  }

  mul(v: V, w: V) {
    for (let i = 0; i < this.ARITY; i++) {
      v[i] *= w[i]
    }

    return v
  }

  angle(v: V, w: V) {
    return Math.acos(this.dot(v, w) / (this.magnitude(v) * this.magnitude(w)))
  }

  toApplyMatrix(v: V, m: M) {
    const result = this.zero()

    for (let i = 0; i < this.ARITY; i++) {
      for (let k = 0; k < this.ARITY; k++) {
        result[i] += v[k] * m[i + k * this.ARITY]
      }
    }

    return result
  }

  isZero(v: V): boolean {
    return v.every((value) => value === 0)
  }
}
