import { AbstractMat } from './AbstractMat'
import { Vec2ElementTuple } from './Vec2'

export type Mat2ElementTuple = [...Vec2ElementTuple, ...Vec2ElementTuple]

class _Mat2 extends AbstractMat<Mat2ElementTuple> {
  constructor() {
    super(2)
  }

  minor(m: Mat2ElementTuple, x: number, y: number) {
    return m[((x + 1) % 2) + ((y + 1) % 2) * 2]
  }

  determinant(m: Mat2ElementTuple) {
    return m[0] * m[3] - m[1] * m[2]
  }
}

export const Mat2 = new _Mat2()
