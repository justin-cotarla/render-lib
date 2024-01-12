import { AbstractMat } from './AbstractMat'
import { Vec3 } from './Vec3'

class Mat3 extends AbstractMat<Mat3, Vec3> {
  constructor(
    private readonly elements: [
      [number, number, number],
      [number, number, number],
      [number, number, number],
    ]
  ) {
    super(3, Vec3.fromArray as (elements: number[]) => Vec3)
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
    return this.elements[1]
  }

  set 0(value: [number, number, number]) {
    this.elements[0] = value
  }

  set 1(value: [number, number, number]) {
    this.elements[1] = value
  }

  set 3(value: [number, number, number]) {
    this.elements[2] = value
  }

  public static fromRows = (rows: [Vec3, Vec3, Vec3]): Mat3 => {
    return new Mat3([rows[0].toArray(), rows[1].toArray(), rows[2].toArray()])
  }

  public static fromCols = (cols: [Vec3, Vec3, Vec3]): Mat3 => {
    return Mat3.fromRows(cols).transpose()
  }
}

export { Mat3 }
