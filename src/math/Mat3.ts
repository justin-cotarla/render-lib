import { AbstractMat } from './AbstractMat'
import { Mat2, Mat2ElementTuple } from './Mat2'
import { Vec3, Vec3ElementTuple } from './Vec3'

export type Mat3ElementTuple = [
  Vec3ElementTuple,
  Vec3ElementTuple,
  Vec3ElementTuple,
]

export class Mat3 extends AbstractMat<Mat3, Vec3, Vec3ElementTuple> {
  static ARITY = 3

  constructor(private readonly elements: Mat3ElementTuple) {
    super(Mat3.ARITY, Vec3.fromArray as (elements: number[]) => Vec3)
  }

  public static fromRows = (rows: [Vec3, Vec3, Vec3]): Mat3 => {
    return new Mat3([rows[0].toArray(), rows[1].toArray(), rows[2].toArray()])
  }

  public static fromCols = (cols: [Vec3, Vec3, Vec3]): Mat3 => {
    return Mat3.fromRows(cols).transpose()
  }

  public static identity = (): Mat3 => {
    return new Mat3(this.identityElements(Mat3.ARITY) as Mat3ElementTuple)
  }

  public clone = (): Mat3 => {
    return new Mat3([
      [this[0][0], this[0][1], this[0][2]],
      [this[1][0], this[1][1], this[1][2]],
      [this[2][0], this[2][1], this[2][2]],
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

  set 0(value: Mat3ElementTuple[0]) {
    this.elements[0] = value
  }

  set 1(value: Mat3ElementTuple[0]) {
    this.elements[1] = value
  }

  set 2(value: Mat3ElementTuple[0]) {
    this.elements[2] = value
  }

  protected minor = (x: number, y: number): number => {
    return new Mat2(this.minorElements(x, y) as Mat2ElementTuple).determinant()
  }

  protected classicalAdjoint = (): Mat3 => {
    return new Mat3(this.classicalAdjointElements() as Mat3ElementTuple)
  }
}
