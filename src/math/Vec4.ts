import { AbstractVec } from './AbstractVec'
import { Mat4ElementTuple } from './Mat4'

export type Vec4ElementTuple = [number, number, number, number]

class _Vec4 extends AbstractVec<Vec4ElementTuple, Mat4ElementTuple> {
  constructor() {
    super(4)
  }
}

export const Vec4 = new _Vec4()
