import { Matrix } from './Matrix.ts'

export interface Vector<V extends number[], M extends number[]> {
  data: V
  toString(): string
  magnitude(): number
  normalize(): this
  add(v: Vector<V, M>): this
  subtract(v: Vector<V, M>): this
  scale(k: number): this
  dot(v: Vector<V, M>): number
  mul(v: Vector<V, M>): this
  angle(v: Vector<V, M>): number
  applyMatrix(m: Matrix<M>): this
  zero(): this
  isZero(): boolean
}
