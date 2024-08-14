export interface Matrix<M extends number[]> {
  data: M
  set(data: M): this
  toString(): string
  add(m: Matrix<M>): this
  subtract(m: Matrix<M>): this
  multiply(m: Matrix<M>): this
  scale(k: number): this
  transpose(): this
  inverse(): Matrix<M>
  determinant(): number
  identity(): this
}
