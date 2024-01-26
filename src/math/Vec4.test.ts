import { Mat4 } from './Mat4'
import { Vec4 } from './Vec4'

describe('Vec4', () => {
  describe('fromArray', () => {
    it('returns a Vec4', () => {
      const vector = Vec4.fromArray([1, 2, 3, 4])
      expect(vector.toArray()).toEqual([1, 2, 3, 4])
    })
  })

  describe('clone', () => {
    it('returns a copy of the vector', () => {
      const vector = new Vec4(1, 2, 3, 4)
      const copy = vector.clone()

      expect(vector.toArray()).toEqual(copy.toArray())
      expect(vector).not.toBe(copy)
    })
  })

  describe('accessors', () => {
    let vector: Vec4
    beforeEach(() => {
      vector = new Vec4(1, 2, 3, 4)
    })

    it('sets using indices', () => {
      vector[0] = 10
      vector[1] = 20
      vector[2] = 30
      vector[3] = 40

      expect(vector.toArray()).toEqual([10, 20, 30, 40])
    })

    it('sets using component names', () => {
      vector.x = 10
      vector.y = 20
      vector.z = 30
      vector.w = 40

      expect(vector.toArray()).toEqual([10, 20, 30, 40])
    })

    it('gets using indices', () => {
      expect(vector[0]).toEqual(1)
      expect(vector[1]).toEqual(2)
      expect(vector[2]).toEqual(3)
      expect(vector[3]).toEqual(4)
    })

    it('gets using component names', () => {
      expect(vector.x).toEqual(1)
      expect(vector.y).toEqual(2)
      expect(vector.z).toEqual(3)
      expect(vector.w).toEqual(4)
    })
  })

  describe('toString', () => {
    it('prints its value', () => {
      const vector = new Vec4(1, 2, 3, 4)
      expect(vector.toString()).toMatchInlineSnapshot(`"[1, 2, 3, 4]"`)
    })
  })

  describe('magnitude', () => {
    it('computes the vector magnitude', () => {
      const vector = new Vec4(1, 2, 3, 4)
      expect(vector.magnitude()).toBeCloseTo(5.477)
    })
  })

  describe('normalize', () => {
    it('normalizes the vector', () => {
      const vector = new Vec4(2, 3, 4, 5)
      vector.normalize()

      expect(vector.x).toBeCloseTo(0.272)
      expect(vector.y).toBeCloseTo(0.408)
      expect(vector.z).toBeCloseTo(0.544)
      expect(vector.w).toBeCloseTo(0.68)
    })
  })

  describe('add', () => {
    it('computes the addition of two vectors', () => {
      const vector = new Vec4(1, 2, 3, 4).add(new Vec4(-1, 10, 0, 15))
      expect(vector.toArray()).toEqual([0, 12, 3, 19])
    })
  })

  describe('subtract', () => {
    it('computes the subtraction of two vectors', () => {
      const vector = new Vec4(1, 2, 3, 4).subtract(new Vec4(-1, 10, 0, 15))
      expect(vector.toArray()).toEqual([2, -8, 3, -11])
    })
  })

  describe('scale', () => {
    it('computes the multiplication by a factor', () => {
      const vector = new Vec4(1, 2, 3, 4).scale(10)
      expect(vector.toArray()).toEqual([10, 20, 30, 40])
    })
  })

  describe('dot', () => {
    it('computes the dot product between two vectors', () => {
      const v1 = new Vec4(0, 1, 0, 0)
      const v2 = new Vec4(0, -1, 0, 0)
      expect(v1.dot(v2)).toBe(-1)
    })
  })

  describe('mul', () => {
    it('computes the component-wise multiplication between two vectors', () => {
      const v1 = new Vec4(1, 2, 3, 4)
      const v2 = new Vec4(5, 6, 7, 8)
      expect(v1.mul(v2).toArray()).toEqual([5, 12, 21, 32])
    })
  })

  describe('angle', () => {
    it('computes the angle between two vectors', () => {
      const v1 = new Vec4(0, 1, 0, 0)
      const v2 = new Vec4(0, 0, 1, 0)
      expect((v1.angle(v2) * 180) / Math.PI).toBe(90)
    })
  })

  describe('applyMatrix', () => {
    it('multiplies by a given matrix', () => {
      const vector = new Vec4(1, 2, 3, 4)
      const matrix = new Mat4([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ])

      expect(vector.applyMatrix(matrix).toArray()).toEqual([90, 100, 110, 120])
    })
  })
})
