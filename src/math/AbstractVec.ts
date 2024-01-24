import { AbstractMat } from './AbstractMat'

export abstract class AbstractVec<V extends AbstractVec<V>> {
  constructor(protected readonly ARITY: number) {}

  [index: number]: number

  public set = (elements: number[]): this => {
    elements.forEach((element, index) => {
      this[index] = element
    })

    return this
  }

  public abstract clone: () => V

  public toArray(): number[] {
    return Array.from({ length: this.ARITY }).map((_, index) => this[index])
  }

  public toString = (): string => {
    return `[${this.toArray().join(', ')}]`
  }

  public magnitude = (): number => {
    const squareSum = this.toArray().reduce((prev, curr) => prev + curr ** 2, 0)

    return Math.sqrt(squareSum)
  }

  public normalize = (): this => {
    const magnitude = this.magnitude()

    this.toArray().forEach((_, index) => {
      this[index] /= magnitude
    })
    return this
  }

  public add = (v: V): this => {
    this.toArray().forEach((_, index) => {
      this[index] += v[index]
    })
    return this
  }

  public subtract = (v: V): this => {
    this.toArray().forEach((_, index) => {
      this[index] -= v[index]
    })
    return this
  }

  public scale = (k: number) => {
    this.toArray().forEach((_, index) => {
      this[index] *= k
    })
    return this
  }

  public dot = (v: V): number => {
    return this.toArray().reduce(
      (prev, curr, index) => prev + curr * v[index],
      0
    )
  }

  public mul = (v: V): this => {
    this.toArray().forEach((_, index) => {
      this[index] *= v[index]
    })
    return this
  }

  public angle = (v: V): number => {
    return Math.acos(this.dot(v) / (this.magnitude() * v.magnitude()))
  }

  public applyMatrix = <M extends AbstractMat<M, V>>(m: M): this => {
    const elements = m.toColVectors().map((col) => this.dot(col))

    return this.set(elements)
  }
}
