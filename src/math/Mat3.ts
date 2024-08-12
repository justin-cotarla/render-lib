import { AbstractMat } from './AbstractMat'
import { Mat2, Mat2ElementTuple } from './Mat2'
import { Vec3ElementTuple } from './Vec3'

export type Mat3ElementTuple = [
  ...Vec3ElementTuple,
  ...Vec3ElementTuple,
  ...Vec3ElementTuple,
]

class _Mat3 extends AbstractMat<Mat3ElementTuple, Mat2ElementTuple> {
  constructor() {
    super(3, Mat2)
  }
}

export const Mat3 = new _Mat3()
