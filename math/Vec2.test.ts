import { Vec2 } from './Vec2'

describe('Vec2', () => {
  describe('fromArray', () => {
    it('returns a Vec2', () => {
      const vector = Vec2.fromArray([1, 2])
      expect(vector.toArray()).toEqual([1, 2])
    })
  })

  describe('toString', () => {
    it('prints its value', () => {
      const vector = new Vec2(1, 2)
      expect(vector.toString()).toMatchInlineSnapshot(`"[1, 2]"`)
    })
  })

  describe('magnitude', () => {
    it('computes the vector magnitude', () => {
      const vector = new Vec2(2, 3)
      expect(vector.magnitude()).toBeCloseTo(3.605)
    })
  })

  describe('add', () => {
    it('computes the addition of two vectors', () => {
      const vector = new Vec2(1, 3).add(new Vec2(-1, 10))
      expect(vector.toArray()).toEqual([0, 13])
    })
  })

  describe('subtract', () => {
    it('computes the subtraction of two vectors', () => {
      const vector = new Vec2(1, 3).subtract(new Vec2(-1, 10))
      expect(vector.toArray()).toEqual([2, -7])
    })
  })

  describe('scale', () => {
    it('computes the multiplication by a factor', () => {
      const vector = new Vec2(1, 3).scale(10)
      expect(vector.toArray()).toEqual([10, 30])
    })
  })

  describe('dot', () => {
    it('computes the dot product between two vectors', () => {
      const v1 = new Vec2(0, 1)
      const v2 = new Vec2(0, -1)
      expect(v1.dot(v2)).toBe(-1)
    })
  })

  describe('angle', () => {
    it('computes the angle between two vectors', () => {
      const v1 = new Vec2(0, 1)
      const v2 = new Vec2(1, 0)
      expect((v1.angle(v2) * 180) / Math.PI).toBe(90)
    })
  })
})
