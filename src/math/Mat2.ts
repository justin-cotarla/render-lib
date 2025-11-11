import { AbstractMat } from './AbstractMat.ts'
import { Vec2Elements } from './Vec2.ts'

export type Mat2Elements = [...Vec2Elements, ...Vec2Elements]

export class Mat2 extends AbstractMat<Mat2Elements> {
  constructor(data?: Mat2Elements) {
    super(2, data ?? [0, 0, 0, 0])
  }

  clone() {
    const m = new Mat2()
    m.set(this.data)

    return m
  }

  override minor(x: number, y: number) {
    return this.data[((x + 1) % 2) + ((y + 1) % 2) * 2]
  }

  override determinant() {
    return this.data[0] * this.data[3] - this.data[1] * this.data[2]
  }
}
