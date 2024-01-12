import { Mat2 } from './Mat2'
import { Vec2 } from './Vec2'

describe('Mat2', () => {
  describe('clone', () => {
    it('clones the matrix', () => {
      const matrix = new Mat2([
        [1, 2],
        [3, 4],
      ])

      const clone = matrix.clone()

      expect(matrix).not.toBe(clone)
      expect(matrix.toArray()).toEqual(clone.toArray())
    })
  })

  describe('fromRows', () => {
    it('returns a Mat2', () => {
      const matrix = Mat2.fromRows([new Vec2(1, 2), new Vec2(3, 4)])
      expect(matrix.toArray()).toEqual([1, 2, 3, 4])
    })
  })

  describe('fromCols', () => {
    it('returns a Mat2', () => {
      const matrix = Mat2.fromCols([new Vec2(1, 2), new Vec2(3, 4)])
      expect(matrix.toArray()).toEqual([1, 3, 2, 4])
    })
  })

  describe('toString', () => {
    it('prints its value', () => {
      const matrix = new Mat2([
        [1, 2],
        [3, 4],
      ])
      expect(matrix.toString()).toMatchSnapshot()
    })
  })

  describe('add', () => {
    it('computes the addition of two matrices', () => {
      const matrix = new Mat2([
        [1, 2],
        [3, 4],
      ]).add(
        new Mat2([
          [10, 20],
          [30, 40],
        ])
      )
      expect(matrix.toArray()).toEqual([11, 22, 33, 44])
    })
  })

  describe('subtract', () => {
    it('computes the subtraction of two matrices', () => {
      const matrix = new Mat2([
        [1, 2],
        [3, 4],
      ]).subtract(
        new Mat2([
          [10, 20],
          [30, 40],
        ])
      )
      expect(matrix.toArray()).toEqual([-9, -18, -27, -36])
    })
  })

  describe('scale', () => {
    it('computes the multiplication of a matrix by a scalar', () => {
      const matrix = new Mat2([
        [1, 2],
        [3, 4],
      ]).scale(10)
      expect(matrix.toArray()).toEqual([10, 20, 30, 40])
    })
  })

  describe('multiply', () => {
    it('computes the multiplication of two matrices', () => {
      const matrix = new Mat2([
        [1, 2],
        [3, 4],
      ]).multiply(
        new Mat2([
          [10, 20],
          [30, 40],
        ])
      )
      expect(matrix.toArray()).toEqual([70, 100, 150, 220])
    })
  })

  describe('determinant', () => {
    it('computes the determinant', () => {
      const matrix = new Mat2([
        [1, 2],
        [3, 4],
      ])

      expect(matrix.determinant()).toBe(-2)
    })
  })
})
