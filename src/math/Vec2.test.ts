import { Mat2 } from './Mat2'
import { Vec2 } from './Vec2'

describe('Vec2', () => {
  describe('fromArray', () => {
    it('returns a Vec2', () => {
      const vector = Vec2.fromArray([1, 2])
      expect(vector.toArray()).toEqual([1, 2])
    })
  })

  describe('clone', () => {
    it('returns a copy of the vector', () => {
      const vector = new Vec2(1, 2)
      const copy = vector.clone()

      expect(vector.toArray()).toEqual(copy.toArray())
      expect(vector).not.toBe(copy)
    })
  })

  describe('accessors', () => {
    let vector: Vec2
    beforeEach(() => {
      vector = new Vec2(1, 2)
    })

    it('sets using indices', () => {
      vector[0] = 10
      vector[1] = 20

      expect(vector.toArray()).toEqual([10, 20])
    })

    it('sets using component names', () => {
      vector.x = 10
      vector.y = 20

      expect(vector.toArray()).toEqual([10, 20])
    })

    it('gets using indices', () => {
      expect(vector[0]).toEqual(1)
      expect(vector[1]).toEqual(2)
    })

    it('gets using component names', () => {
      expect(vector.x).toEqual(1)
      expect(vector.y).toEqual(2)
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

  describe('normalize', () => {
    it('normalizes the vector', () => {
      const vector = new Vec2(2, 3)
      vector.normalize()

      expect(vector.x).toBeCloseTo(0.555)
      expect(vector.y).toBeCloseTo(0.832)
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

  describe('mul', () => {
    it('computes the component-wise multiplication between two vectors', () => {
      const v1 = new Vec2(1, 2)
      const v2 = new Vec2(3, 4)
      expect(v1.mul(v2).toArray()).toEqual([3, 8])
    })
  })

  describe('angle', () => {
    it('computes the angle between two vectors', () => {
      const v1 = new Vec2(0, 1)
      const v2 = new Vec2(1, 0)
      expect((v1.angle(v2) * 180) / Math.PI).toBe(90)
    })
  })

  describe('applyMatrix', () => {
    it('multiplies by a given matrix', () => {
      const vector = new Vec2(1, 2)
      const matrix = new Mat2([
        [1, 2],
        [3, 4],
      ])

      expect(vector.applyMatrix(matrix).toArray()).toEqual([7, 10])
    })
  })
})
