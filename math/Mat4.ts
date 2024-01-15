import { AbstractMat } from './AbstractMat'
import { Mat3, Mat3ElementTuple } from './Mat3'
import { Vec4 } from './Vec4'

export type Mat4ElementTuple = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
]

export class Mat4 extends AbstractMat<Mat4, Vec4> {
  constructor(private readonly elements: Mat4ElementTuple) {
    super(4, Vec4.fromArray as (elements: number[]) => Vec4)
  }

  public clone = (): Mat4 => {
    return new Mat4([
      [this[0][0], this[0][1], this[0][2], this[0][3]],
      [this[1][0], this[1][1], this[1][2], this[1][3]],
      [this[2][0], this[2][1], this[2][2], this[2][3]],
      [this[3][0], this[3][1], this[3][2], this[3][3]],
    ])
  }

  get 0(): number[] {
    return this.elements[0]
  }

  get 1(): number[] {
    return this.elements[1]
  }

  get 2(): number[] {
    return this.elements[2]
  }

  get 3(): number[] {
    return this.elements[3]
  }

  set 0(value: Mat4ElementTuple[0]) {
    this.elements[0] = value
  }

  set 1(value: Mat4ElementTuple[0]) {
    this.elements[1] = value
  }

  set 2(value: Mat4ElementTuple[0]) {
    this.elements[2] = value
  }

  set 3(value: Mat4ElementTuple[0]) {
    this.elements[3] = value
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

  protected minor = (x: number, y: number): number => {
    return new Mat3(this.minorElements(x, y) as Mat3ElementTuple).determinant()
  }

  protected classicalAdjoint = (): Mat4 => {
    return new Mat4(this.classicalAdjointElements() as Mat4ElementTuple)
  }
}
