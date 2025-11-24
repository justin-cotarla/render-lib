import { AbstractVec } from './AbstractVec'
import { Mat2Elements } from './Mat2'

export type Vec2Elements = [number, number]

export class Vec2 extends AbstractVec<Vec2Elements, Mat2Elements> {
  constructor(data?: Vec2Elements) {
    super(2, data ?? [0, 0])
  }

  clone() {
    const v = new Vec2()
    v.set(this.data)

    return v
  }
}
