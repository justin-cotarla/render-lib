import { AbstractMat } from './AbstractMat'
import { Vec2 } from './Vec2'

export type Mat2ElementTuple = [[number, number], [number, number]]

export class Mat2 extends AbstractMat<Mat2, Vec2> {
  static ARITY = 2

  constructor(private readonly elements: Mat2ElementTuple) {
    super(Mat2.ARITY, Vec2.fromArray as (elements: number[]) => Vec2)
  }

  public static fromRows = (rows: [Vec2, Vec2]): Mat2 => {
    return new Mat2([rows[0].toArray(), rows[1].toArray()])
  }

  public static fromCols = (cols: [Vec2, Vec2]): Mat2 => {
    return Mat2.fromRows(cols).transpose()
  }

  public static identity = (): Mat2 => {
    return new Mat2(this.identityElements(Mat2.ARITY) as Mat2ElementTuple)
  }

  public clone = (): Mat2 => {
    return new Mat2([
      [this[0][0], this[0][1]],
      [this[1][0], this[1][1]],
    ])
  }

  get 0(): number[] {
    return this.elements[0]
  }

  get 1(): number[] {
    return this.elements[1]
  }

  set 0(value: Mat2ElementTuple[0]) {
    this.elements[0] = value
  }

  set 1(value: Mat2ElementTuple[0]) {
    this.elements[1] = value
  }

  public determinant = (): number => {
    return this[0][0] * this[1][1] - this[0][1] * this[1][0]
  }

  protected minor = (x: number, y: number): number => {
    return this.minorElements(x, y)[0][0]
  }

  protected classicalAdjoint = (): Mat2 => {
    return new Mat2(this.classicalAdjointElements() as Mat2ElementTuple)
  }
}
