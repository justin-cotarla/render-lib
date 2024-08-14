import { AbstractMat } from './AbstractMat'
import { Mat3, Mat3Elements } from './Mat3'
import { Vec4Elements } from './Vec4'

export type Mat4Elements = [
  ...Vec4Elements,
  ...Vec4Elements,
  ...Vec4Elements,
  ...Vec4Elements,
]

export class Mat4 extends AbstractMat<Mat4Elements, Mat3Elements> {
  constructor(data?: Mat4Elements) {
    super(
      4,
      data ?? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      () => new Mat3()
    )
  }

  clone() {
    const m = new Mat4()
    m.set(this.data)

    return m
  }
}
