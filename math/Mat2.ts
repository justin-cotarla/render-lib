import { AbstractMat } from './AbstractMat'
import { Vec2 } from './Vec2'

class Mat2 extends AbstractMat<Mat2, Vec2> {
  constructor(private readonly elements: [[number, number], [number, number]]) {
    super(2, Vec2.fromArray as (elements: number[]) => Vec2)
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

  set 0(value: [number, number]) {
    this.elements[0] = value
  }

  set 1(value: [number, number]) {
    this.elements[1] = value
  }

  public static fromRows = (rows: [Vec2, Vec2]): Mat2 => {
    return new Mat2([rows[0].toArray(), rows[1].toArray()])
  }

  public static fromCols = (cols: [Vec2, Vec2]): Mat2 => {
    return Mat2.fromRows(cols).transpose()
  }

  protected minor = (x: number, y: number): number => {
    return this[x][y]
  }

  public determinant = (): number => {
    return this[0][0] * this[1][1] - this[0][1] * this[1][0]
  }
}

export { Mat2 }
