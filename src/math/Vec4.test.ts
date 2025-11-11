import { describe, it } from '@std/testing/bdd'
import { assertSnapshot } from '@std/testing/snapshot'
import { expect } from '@std/expect'

import { Mat4 } from './Mat4.ts'
import { Vec4 } from './Vec4.ts'

describe('Vec4', () => {
  describe('clone', () => {
    it('returns a copy of the vector', () => {
      const vector = new Vec4([1, 2, 3, 4])
      const copy = vector.clone()

      expect(vector.data).toEqual(copy.data)
      expect(vector).not.toBe(copy)
    })
  })

  describe('toString', () => {
    it('prints its value', async (t) => {
      const vector = new Vec4([1, 2, 3, 4])
      await assertSnapshot(t, vector.toString())
    })
  })

  describe('magnitude', () => {
    it('computes the vector magnitude', () => {
      const vector = new Vec4([1, 2, 3, 4])
      expect(vector.magnitude()).toBeCloseTo(5.477)
    })
  })

  describe('normalize', () => {
    it('normalizes the vector', () => {
      const vector = new Vec4([2, 3, 4, 5])
      vector.normalize()

      expect(vector.data[0]).toBeCloseTo(0.272)
      expect(vector.data[1]).toBeCloseTo(0.408)
      expect(vector.data[2]).toBeCloseTo(0.544)
      expect(vector.data[3]).toBeCloseTo(0.68)
    })
  })

  describe('add', () => {
    it('computes the addition of two vectors', () => {
      const vector = new Vec4([1, 2, 3, 4]).add(new Vec4([-1, 10, 0, 15]))
      expect(vector.data).toEqual([0, 12, 3, 19])
    })
  })

  describe('subtract', () => {
    it('computes the subtraction of two vectors', () => {
      const vector = new Vec4([1, 2, 3, 4]).subtract(new Vec4([-1, 10, 0, 15]))
      expect(vector.data).toEqual([2, -8, 3, -11])
    })
  })

  describe('scale', () => {
    it('computes the multiplication by a factor', () => {
      const vector = new Vec4([1, 2, 3, 4]).scale(10)
      expect(vector.data).toEqual([10, 20, 30, 40])
    })
  })

  describe('dot', () => {
    it('computes the dot product between two vectors', () => {
      const v1 = new Vec4([0, 1, 0, 0])
      const v2 = new Vec4([0, -1, 0, 0])
      expect(v1.dot(v2)).toBe(-1)
    })
  })

  describe('mul', () => {
    it('computes the component-wise multiplication between two vectors', () => {
      const v1 = new Vec4([1, 2, 3, 4])
      const v2 = new Vec4([5, 6, 7, 8])
      expect(v1.mul(v2).data).toEqual([5, 12, 21, 32])
    })
  })

  describe('angle', () => {
    it('computes the angle between two vectors', () => {
      const v1 = new Vec4([0, 1, 0, 0])
      const v2 = new Vec4([0, 0, 1, 0])
      expect((v1.angle(v2) * 180) / Math.PI).toBe(90)
    })
  })

  describe('applyMatrix', () => {
    it('multiplies by a given matrix', () => {
      const vector = new Vec4([1, 2, 3, 4])
      const matrix = new Mat4([
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
      ])

      expect(vector.applyMatrix(matrix).data).toEqual([90, 100, 110, 120])
    })
  })

  describe('isZero', () => {
    it('detects a zero vector', () => {
      const v1 = new Vec4([0, 0, 0, 0])
      expect(v1.isZero()).toBe(true)
    })

    it('detects a non-zero vector', () => {
      const v1 = new Vec4([1, 0, 3, 1])
      expect(v1.isZero()).toBe(false)
    })
  })

  describe('zero', () => {
    it('sets the vector to zero', () => {
      expect(new Vec4([1, 2, 3, 4]).zero().data).toEqual([0, 0, 0, 0])
    })
  })
})
