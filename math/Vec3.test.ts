import { Vec3 } from './Vec3'

describe('Vec3', () => {
  describe('fromArray', () => {
    it('returns a Vec2', () => {
      const vector = Vec3.fromArray([1, 2, 3])
      expect(vector.toArray()).toEqual([1, 2, 3])
    })
  })

  describe('toString', () => {
    it('prints its value', () => {
      const vector = new Vec3(1, 0, 0).cross(new Vec3(0, 1, 0))
      expect(vector.toArray()).toEqual([0, 0, 1])
    })
  })
})
