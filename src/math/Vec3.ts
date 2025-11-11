import { AbstractVec } from './AbstractVec.ts'
import { Mat3Elements } from './Mat3.ts'

export type Vec3Elements = [number, number, number]

export class Vec3 extends AbstractVec<Vec3Elements, Mat3Elements> {
  constructor(data?: Vec3Elements) {
    super(3, data ?? [0, 0, 0])
  }

  clone() {
    const v = new Vec3()
    v.set(this.data)

    return v
  }

  cross(v: Vec3): Vec3 {
    return this.set([
      this.data[1] * v.data[2] - this.data[2] * v.data[1],
      this.data[2] * v.data[0] - this.data[0] * v.data[2],
      this.data[0] * v.data[1] - this.data[1] * v.data[0],
    ])
  }
}
