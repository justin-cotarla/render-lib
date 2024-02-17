import { Mat3 } from './Mat3'
import { Vec3 } from './Vec3'

describe('Vec3', () => {
  describe('fromArray', () => {
    it('returns a Vec3', () => {
      const vector = Vec3.fromArray([1, 2, 3])
      expect(vector.toArray()).toEqual([1, 2, 3])
    })
  })

  describe('cross', () => {
    it('computes the cross product with another vector', () => {
      const vector = new Vec3(1, 0, 0).cross(new Vec3(0, 1, 0))
      expect(vector.toArray()).toEqual([0, 0, 1])
    })
  })

  describe('clone', () => {
    it('returns a copy of the vector', () => {
      const vector = new Vec3(1, 2, 3)
      const copy = vector.clone()

      expect(vector.toArray()).toEqual(copy.toArray())
      expect(vector).not.toBe(copy)
    })
  })

  describe('accessors', () => {
    let vector: Vec3
    beforeEach(() => {
      vector = new Vec3(1, 2, 3)
    })

    it('sets using indices', () => {
      vector[0] = 10
      vector[1] = 20
      vector[2] = 30

      expect(vector.toArray()).toEqual([10, 20, 30])
    })

    it('sets using component names', () => {
      vector.x = 10
      vector.y = 20
      vector.z = 30

      expect(vector.toArray()).toEqual([10, 20, 30])
    })

    it('gets using indices', () => {
      expect(vector[0]).toEqual(1)
      expect(vector[1]).toEqual(2)
      expect(vector[2]).toEqual(3)
    })

    it('gets using component names', () => {
      expect(vector.x).toEqual(1)
      expect(vector.y).toEqual(2)
      expect(vector.z).toEqual(3)
    })
  })

  describe('toString', () => {
    it('prints its value', () => {
      const vector = new Vec3(1, 2, 3)
      expect(vector.toString()).toMatchInlineSnapshot(`"[1, 2, 3]"`)
    })
  })

  describe('magnitude', () => {
    it('computes the vector magnitude', () => {
      const vector = new Vec3(1, 2, 3)
      expect(vector.magnitude()).toBeCloseTo(3.742)
    })
  })

  describe('normalize', () => {
    it('normalizes the vector', () => {
      const vector = new Vec3(2, 3, 4)
      vector.normalize()

      expect(vector.x).toBeCloseTo(0.371)
      expect(vector.y).toBeCloseTo(0.557)
      expect(vector.z).toBeCloseTo(0.743)
    })
  })

  describe('add', () => {
    it('computes the addition of two vectors', () => {
      const vector = new Vec3(1, 2, 3).add(new Vec3(-1, 10, 0))
      expect(vector.toArray()).toEqual([0, 12, 3])
    })
  })

  describe('subtract', () => {
    it('computes the subtraction of two vectors', () => {
      const vector = new Vec3(1, 2, 3).subtract(new Vec3(-1, 10, 0))
      expect(vector.toArray()).toEqual([2, -8, 3])
    })
  })

  describe('scale', () => {
    it('computes the multiplication by a factor', () => {
      const vector = new Vec3(1, 2, 3).scale(10)
      expect(vector.toArray()).toEqual([10, 20, 30])
    })
  })

  describe('dot', () => {
    it('computes the dot product between two vectors', () => {
      const v1 = new Vec3(0, 1, 0)
      const v2 = new Vec3(0, -1, 0)
      expect(v1.dot(v2)).toBe(-1)
    })
  })

  describe('mul', () => {
    it('computes the component-wise multiplication between two vectors', () => {
      const v1 = new Vec3(1, 2, 3)
      const v2 = new Vec3(4, 5, 6)
      expect(v1.mul(v2).toArray()).toEqual([4, 10, 18])
    })
  })

  describe('angle', () => {
    it('computes the angle between two vectors', () => {
      const v1 = new Vec3(0, 1, 0)
      const v2 = new Vec3(0, 0, 1)
      expect((v1.angle(v2) * 180) / Math.PI).toBe(90)
    })
  })

  describe('applyMatrix', () => {
    it('multiplies by a given matrix', () => {
      const vector = new Vec3(1, 2, 3)
      const matrix = new Mat3([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ])

      expect(vector.applyMatrix(matrix).toArray()).toEqual([30, 36, 42])
    })
  })

  describe('upgrade', () => {
    it('ugrades to a Vec4 with the given w value', () => {
      const vector = new Vec3(0, 1, 2)
      expect(vector.upgrade(3).toArray()).toEqual([0, 1, 2, 3])
    })
  })

  describe('isZero', () => {
    it('detects a zero vector', () => {
      const v1 = new Vec3(0, 0, 0)
      expect(v1.isZero()).toBe(true)
    })

    it('detects a non-zero vector', () => {
      const v1 = new Vec3(1, 0, 3)
      expect(v1.isZero()).toBe(false)
    })
  })

  describe('zero', () => {
    it('returns a zero vector', () => {
      expect(Vec3.zero().toArray()).toEqual([0, 0, 0])
    })
  })
})
