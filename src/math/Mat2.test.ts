import { describe, it } from '@std/testing/bdd'
import { assertSnapshot } from '@std/testing/snapshot'
import { expect } from '@std/expect'

import { Mat2 } from './Mat2.ts'

describe('Mat2', () => {
  describe('clone', () => {
    it('clones the matrix', () => {
      const matrix = new Mat2([1, 2, 3, 4])

      const clone = matrix.clone()

      expect(matrix.data).not.toBe(clone.data)
      expect(matrix.data).toEqual(clone.data)
    })
  })

  describe('identity', () => {
    it('returns the identity matrix', () => {
      const matrix = new Mat2().identity()
      expect(matrix.data).toEqual([1, 0, 0, 1])
    })
  })

  describe('toString', () => {
    it('prints its value', async (t) => {
      const matrix = new Mat2([1, 2, 3, 4])

      console.log(matrix.toString())
      await assertSnapshot(t, matrix.toString())
    })
  })

  describe('add', () => {
    it('computes the addition of two matrices', () => {
      const matrix = new Mat2([1, 2, 3, 4]).add(new Mat2([10, 20, 30, 40]))
      expect(matrix.data).toEqual([11, 22, 33, 44])
    })
  })

  describe('subtract', () => {
    it('computes the subtraction of two matrices', () => {
      const matrix = new Mat2([1, 2, 3, 4]).subtract(new Mat2([10, 20, 30, 40]))
      expect(matrix.data).toEqual([-9, -18, -27, -36])
    })
  })

  describe('scale', () => {
    it('computes the multiplication of a matrix by a scalar', () => {
      const matrix = new Mat2([1, 2, 3, 4]).scale(10)
      expect(matrix.data).toEqual([10, 20, 30, 40])
    })
  })

  describe('multiply', () => {
    it('computes the multiplication of two matrices', () => {
      const matrix = new Mat2([1, 2, 3, 4]).multiply(new Mat2([10, 20, 30, 40]))
      expect(matrix.data).toEqual([70, 100, 150, 220])
    })
  })

  describe('determinant', () => {
    it('computes the determinant', () => {
      const matrix = new Mat2([1, 2, 3, 4])

      expect(matrix.determinant()).toBe(-2)
    })
  })

  describe('inverse', () => {
    it('computes the inverse', () => {
      const matrix = new Mat2([4, 3, 3, 2])

      expect(matrix.inverse().data).toEqual([-2, 3, 3, -4])
    })

    it('throws an error if the matrix is not invertible', () => {
      const matrix = new Mat2([4, 3, 0, 0])

      expect(() => matrix.inverse()).toThrow()
    })
  })
})
