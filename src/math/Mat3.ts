import { AbstractMat } from './AbstractMat.ts'
import { Mat2, Mat2Elements } from './Mat2.ts'
import { Vec3Elements } from './Vec3.ts'

export type Mat3Elements = [...Vec3Elements, ...Vec3Elements, ...Vec3Elements]

export class Mat3 extends AbstractMat<Mat3Elements, Mat2Elements> {
  constructor(data?: Mat3Elements) {
    super(3, data ?? [0, 0, 0, 0, 0, 0, 0, 0, 0], () => new Mat2())
  }

  clone() {
    const m = new Mat3()
    m.set(this.data)

    return m
  }
}
