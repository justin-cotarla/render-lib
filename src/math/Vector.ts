export interface Vector<V extends number[], M extends number[]> {
  clone(v: V): V
  toString(v: V): string
  magnitude(v: V): number
  normalize(v: V): V
  add(v: V, w: V): V
  subtract(v: V, w: V): V
  scale(v: V, k: number): V
  dot(v: V, w: V): number
  mul(v: V, w: V): V
  angle(v: V, w: V): number
  toApplyMatrix(v: V, m: M): V
  zero(): V
  isZero(v: V): boolean
}
