import { describe, it } from '@std/testing/bdd'
import { assertSnapshot } from '@std/testing/snapshot'
import { expect } from '@std/expect'

import { Mat2 } from './Mat2.ts'
import { Vec2 } from './Vec2.ts'

describe('Vec2', () => {
  describe('clone', () => {
    it('returns a copy of the vector', () => {
      const vector = new Vec2([1, 2])
      const copy = vector.clone()

      expect(vector.data).toEqual(copy.data)
      expect(vector).not.toBe(copy)
    })
  })

  describe('toString', () => {
    it('prints its value', async (t) => {
      const vector = new Vec2([1, 2])
      await assertSnapshot(t, vector.toString())
    })
  })

  describe('magnitude', () => {
    it('computes the vector magnitude', () => {
      const vector = new Vec2([2, 3])
      expect(vector.magnitude()).toBeCloseTo(3.605)
    })
  })

  describe('normalize', () => {
    it('normalizes the vector', () => {
      const vector = new Vec2([2, 3])
      vector.normalize()

      expect(vector.data[0]).toBeCloseTo(0.555)
      expect(vector.data[1]).toBeCloseTo(0.832)
    })
  })

  describe('add', () => {
    it('computes the addition of two vectors', () => {
      const vector = new Vec2([1, 3]).add(new Vec2([-1, 10]))
      expect(vector.data).toEqual([0, 13])
    })
  })

  describe('subtract', () => {
    it('computes the subtraction of two vectors', () => {
      const vector = new Vec2([1, 3]).subtract(new Vec2([-1, 10]))
      expect(vector.data).toEqual([2, -7])
    })
  })

  describe('scale', () => {
    it('computes the multiplication by a factor', () => {
      const vector = new Vec2([1, 3]).scale(10)
      expect(vector.data).toEqual([10, 30])
    })
  })

  describe('dot', () => {
    it('computes the dot product between two vectors', () => {
      const v1 = new Vec2([0, 1])
      const v2 = new Vec2([0, -1])
      expect(v1.dot(v2)).toBe(-1)
    })
  })

  describe('mul', () => {
    it('computes the component-wise multiplication between two vectors', () => {
      const v1 = new Vec2([1, 2])
      const v2 = new Vec2([3, 4])
      expect(v1.mul(v2).data).toEqual([3, 8])
    })
  })

  describe('angle', () => {
    it('computes the angle between two vectors', () => {
      const v1 = new Vec2([0, 1])
      const v2 = new Vec2([1, 0])
      expect((v1.angle(v2) * 180) / Math.PI).toBe(90)
    })
  })

  describe('applyMatrix', () => {
    it('multiplies by a given matrix', () => {
      const vector = new Vec2([1, 2])
      const matrix = new Mat2([1, 2, 3, 4])

      expect(vector.applyMatrix(matrix).data).toEqual([7, 10])
    })
  })

  describe('isZero', () => {
    it('detects a zero vector', () => {
      const v1 = new Vec2([0, 0])
      expect(v1.isZero()).toBe(true)
    })

    it('detects a non-zero vector', () => {
      const v1 = new Vec2([1, 0])
      expect(v1.isZero()).toBe(false)
    })
  })

  describe('zero', () => {
    it('sets the vector to zero', () => {
      expect(new Vec2([1, 2]).zero().data).toEqual([0, 0])
    })
  })
})
