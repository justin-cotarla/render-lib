import { AbstractVec } from './AbstractVec'
import { Mat2ElementTuple } from './Mat2'

export type Vec2ElementTuple = [number, number]

class _Vec2 extends AbstractVec<Vec2ElementTuple, Mat2ElementTuple> {
  constructor() {
    super(2)
  }
}

export const Vec2 = new _Vec2()
