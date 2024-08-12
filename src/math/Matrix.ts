export interface Matrix<M extends number[]> {
  create(): M
  clone(m: M): M
  toString(m: M): string
  transpose(m: M): M
  add(m: M, n: M): M
  subtract(m: M, n: M): M
  scale(m: M, k: number): M
  toMultiply(m: M, n: M): M
  determinant(m: M): number
  toInverse(m: M): M
  minor(n: M, x: number, y: number): number
  toClassicalAdjoint(m: M): M
  cofactor(m: M, x: number, y: number): number
  identity(): M
}
