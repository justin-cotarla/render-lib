import { AbstractVec } from './AbstractVec'
import { Mat3ElementTuple } from './Mat3'

export type Vec3ElementTuple = [number, number, number]

class _Vec3 extends AbstractVec<Vec3ElementTuple, Mat3ElementTuple> {
  constructor() {
    super(3)
  }

  toCross(v: Vec3ElementTuple): Vec3ElementTuple {
    return [
      v[1] * v[2] - v[2] * v[1],
      v[2] * v[0] - v[0] * v[2],
      v[0] * v[1] - v[1] * v[0],
    ]
  }
}

export const Vec3 = new _Vec3()
