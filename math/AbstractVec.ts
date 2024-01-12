abstract class AbstractVec<V extends AbstractVec<V>> {
  constructor(readonly ARITY: number) {}

  [index: number]: number

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

  public angle = (v: V): number => {
    return Math.acos(this.dot(v) / (this.magnitude() * v.magnitude()))
  }
}

export { AbstractVec }
