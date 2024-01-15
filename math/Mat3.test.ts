import { Mat3 } from './Mat3'
import { Vec3 } from './Vec3'

describe('Mat3', () => {
  describe('clone', () => {
    it('clones the matrix', () => {
      const matrix = new Mat3([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ])

      const clone = matrix.clone()

      expect(matrix).not.toBe(clone)
      expect(matrix.toArray()).toEqual(clone.toArray())
    })
  })

  describe('fromRows', () => {
    it('returns a Mat3', () => {
      const matrix = Mat3.fromRows([
        new Vec3(1, 2, 3),
        new Vec3(4, 5, 6),
        new Vec3(7, 8, 9),
      ])
      expect(matrix.toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
    })
  })

  describe('fromCols', () => {
    it('returns a Mat3', () => {
      const matrix = Mat3.fromCols([
        new Vec3(1, 2, 3),
        new Vec3(4, 5, 6),
        new Vec3(7, 8, 9),
      ])
      expect(matrix.toArray()).toEqual([1, 4, 7, 2, 5, 8, 3, 6, 9])
    })
  })

  describe('accessors', () => {
    let matrix: Mat3
    beforeEach(() => {
      matrix = new Mat3([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ])
    })

    it('sets using indices', () => {
      matrix[0] = [10, 20, 30]
      matrix[1] = [40, 50, 60]
      matrix[2] = [70, 80, 90]

      expect(matrix.toArray()).toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90])
    })

    it('gets using indices', () => {
      expect(matrix[0]).toEqual([1, 2, 3])
      expect(matrix[1]).toEqual([4, 5, 6])
      expect(matrix[2]).toEqual([7, 8, 9])
    })
  })

  describe('toString', () => {
    it('prints its value', () => {
      const matrix = new Mat3([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ])
      expect(matrix.toString()).toMatchSnapshot()
    })
  })

  describe('add', () => {
    it('computes the addition of two matrices', () => {
      const matrix = new Mat3([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]).add(
        new Mat3([
          [10, 20, 30],
          [40, 50, 60],
          [70, 80, 90],
        ])
      )
      expect(matrix.toArray()).toEqual([11, 22, 33, 44, 55, 66, 77, 88, 99])
    })
  })

  describe('subtract', () => {
    it('computes the subtraction of two matrices', () => {
      const matrix = new Mat3([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]).subtract(
        new Mat3([
          [10, 20, 30],
          [40, 50, 60],
          [70, 80, 90],
        ])
      )
      expect(matrix.toArray()).toEqual([
        -9, -18, -27, -36, -45, -54, -63, -72, -81,
      ])
    })
  })

  describe('scale', () => {
    it('computes the multiplication of a matrix by a scalar', () => {
      const matrix = new Mat3([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]).scale(10)
      expect(matrix.toArray()).toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90])
    })
  })

  describe('multiply', () => {
    it('computes the multiplication of two matrices', () => {
      const matrix = new Mat3([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]).multiply(
        new Mat3([
          [10, 20, 30],
          [40, 50, 60],
          [70, 80, 90],
        ])
      )
      expect(matrix.toArray()).toEqual([
        300, 360, 420, 660, 810, 960, 1020, 1260, 1500,
      ])
    })
  })

  describe('determinant', () => {
    it('computes the determinant', () => {
      const matrix = new Mat3([
        [-7, 1, 6],
        [2, -5, 0],
        [8, -7, 8],
      ])

      expect(matrix.determinant()).toBe(420)
    })
  })

  describe('inverse', () => {
    it('computes the inverse', () => {
      const matrix = new Mat3([
        [1, 2, -1],
        [-2, 0, 1],
        [1, -1, 0],
      ])

      expect(matrix.inverse().toArray()).toEqual([1, 1, 2, 1, 1, 1, 2, 3, 4])
    })

    it('throws an error if the matrix is not invertible', () => {
      const matrix = new Mat3([
        [4, 3, 1],
        [4, 3, 1],
        [0, 0, 0],
      ])

      expect(() => matrix.inverse()).toThrow()
    })
  })
})
