import { AbstractVec } from './AbstractVec'
import { Mat4Elements } from './Mat4'

export type Vec4Elements = [number, number, number, number]

export class Vec4 extends AbstractVec<Vec4Elements, Mat4Elements> {
  constructor(data?: Vec4Elements) {
    super(4, data ?? [0, 0, 0, 0])
  }

  clone() {
    const v = new Vec4()
    v.set(this.data)

    return v
  }
}
