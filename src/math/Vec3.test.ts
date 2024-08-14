import { Mat3 } from './Mat3'
import { Vec3 } from './Vec3'

describe('Vec3', () => {
  describe('cross', () => {
    it('computes the cross product with another vector', () => {
      const vector = new Vec3([1, 0, 0]).cross(new Vec3([0, 1, 0]))
      expect(vector.data).toEqual([0, 0, 1])
    })
  })

  describe('clone', () => {
    it('returns a copy of the vector', () => {
      const vector = new Vec3([1, 2, 3])
      const copy = vector.clone()

      expect(vector.data).toEqual(copy.data)
      expect(vector).not.toBe(copy)
    })
  })

  describe('toString', () => {
    it('prints its value', () => {
      const vector = new Vec3([1, 2, 3])
      expect(vector.toString()).toMatchInlineSnapshot(`"[1, 2, 3]"`)
    })
  })

  describe('magnitude', () => {
    it('computes the vector magnitude', () => {
      const vector = new Vec3([1, 2, 3])
      expect(vector.magnitude()).toBeCloseTo(3.742)
    })
  })

  describe('normalize', () => {
    it('normalizes the vector', () => {
      const vector = new Vec3([2, 3, 4])
      vector.normalize()

      expect(vector.data[0]).toBeCloseTo(0.371)
      expect(vector.data[1]).toBeCloseTo(0.557)
      expect(vector.data[2]).toBeCloseTo(0.743)
    })
  })

  describe('add', () => {
    it('computes the addition of two vectors', () => {
      const vector = new Vec3([1, 2, 3]).add(new Vec3([-1, 10, 0]))
      expect(vector.data).toEqual([0, 12, 3])
    })
  })

  describe('subtract', () => {
    it('computes the subtraction of two vectors', () => {
      const vector = new Vec3([1, 2, 3]).subtract(new Vec3([-1, 10, 0]))
      expect(vector.data).toEqual([2, -8, 3])
    })
  })

  describe('scale', () => {
    it('computes the multiplication by a factor', () => {
      const vector = new Vec3([1, 2, 3]).scale(10)
      expect(vector.data).toEqual([10, 20, 30])
    })
  })

  describe('dot', () => {
    it('computes the dot product between two vectors', () => {
      const v1 = new Vec3([0, 1, 0])
      const v2 = new Vec3([0, -1, 0])
      expect(v1.dot(v2)).toBe(-1)
    })
  })

  describe('mul', () => {
    it('computes the component-wise multiplication between two vectors', () => {
      const v1 = new Vec3([1, 2, 3])
      const v2 = new Vec3([4, 5, 6])
      expect(v1.mul(v2).data).toEqual([4, 10, 18])
    })
  })

  describe('angle', () => {
    it('computes the angle between two vectors', () => {
      const v1 = new Vec3([0, 1, 0])
      const v2 = new Vec3([0, 0, 1])
      expect((v1.angle(v2) * 180) / Math.PI).toBe(90)
    })
  })

  describe('applyMatrix', () => {
    it('multiplies by a given matrix', () => {
      const vector = new Vec3([1, 2, 3])
      const matrix = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9])

      expect(vector.applyMatrix(matrix).data).toEqual([30, 36, 42])
    })
  })

  describe('isZero', () => {
    it('detects a zero vector', () => {
      const v1 = new Vec3([0, 0, 0])
      expect(v1.isZero()).toBe(true)
    })

    it('detects a non-zero vector', () => {
      const v1 = new Vec3([1, 0, 3])
      expect(v1.isZero()).toBe(false)
    })
  })

  describe('zero', () => {
    it('sets the vector to zero', () => {
      expect(new Vec3([1, 2, 3]).zero().data).toEqual([0, 0, 0])
    })
  })
})
