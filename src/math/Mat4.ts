import { AbstractMat } from './AbstractMat'
import { Mat3, Mat3ElementTuple } from './Mat3'
import { Vec4ElementTuple } from './Vec4'

export type Mat4ElementTuple = [
  ...Vec4ElementTuple,
  ...Vec4ElementTuple,
  ...Vec4ElementTuple,
  ...Vec4ElementTuple,
]

class _Mat4 extends AbstractMat<Mat4ElementTuple, Mat3ElementTuple> {
  constructor() {
    super(4, Mat3)
  }
}

export const Mat4 = new _Mat4()
