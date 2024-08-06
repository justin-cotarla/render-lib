import { AbstractMat } from './AbstractMat'
import { Mat3, Mat3ElementTuple } from './Mat3'
import { Vec4, Vec4ElementTuple } from './Vec4'

export type Mat4ElementTuple = [
  Vec4ElementTuple,
  Vec4ElementTuple,
  Vec4ElementTuple,
  Vec4ElementTuple,
]

export class Mat4 extends AbstractMat<Mat4, Vec4, Vec4ElementTuple> {
  static ARITY = 4

  constructor(elements: Mat4ElementTuple) {
    super(Mat4.ARITY, elements, Vec4.fromArray)
  }

  public static fromRows = (rows: [Vec4, Vec4, Vec4, Vec4]): Mat4 => {
    return new Mat4([
      rows[0].toArray(),
      rows[1].toArray(),
      rows[2].toArray(),
      rows[3].toArray(),
    ])
  }

  public static fromCols = (cols: [Vec4, Vec4, Vec4, Vec4]): Mat4 => {
    return Mat4.fromRows(cols).transpose()
  }

  public static identity = (): Mat4 => {
    return new Mat4(this.identityElements(Mat4.ARITY) as Mat4ElementTuple)
  }

  public clone = (): Mat4 => {
    return new Mat4([
      [this[0][0], this[0][1], this[0][2], this[0][3]],
      [this[1][0], this[1][1], this[1][2], this[1][3]],
      [this[2][0], this[2][1], this[2][2], this[2][3]],
      [this[3][0], this[3][1], this[3][2], this[3][3]],
    ])
  }

  get 0(): Mat4ElementTuple[number] {
    return this.rows[0]
  }

  get 1(): Mat4ElementTuple[number] {
    return this.rows[1]
  }

  get 2(): Mat4ElementTuple[number] {
    return this.rows[2]
  }

  get 3(): Mat4ElementTuple[number] {
    return this.rows[3]
  }

  set 0(value: Mat4ElementTuple[number]) {
    this.rows[0] = value
  }

  set 1(value: Mat4ElementTuple[number]) {
    this.rows[1] = value
  }

  set 2(value: Mat4ElementTuple[number]) {
    this.rows[2] = value
  }

  set 3(value: Mat4ElementTuple[number]) {
    this.rows[3] = value
  }

  protected minor = (x: number, y: number): number => {
    return new Mat3(this.minorElements(x, y) as Mat3ElementTuple).determinant()
  }

  protected classicalAdjoint = (): Mat4 => {
    return new Mat4(this.classicalAdjointElements() as Mat4ElementTuple)
  }
}
