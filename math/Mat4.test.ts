import { Mat4 } from './Mat4'
import { Vec4 } from './Vec4'

describe('Mat4', () => {
  describe('clone', () => {
    it('clones the matrix', () => {
      const matrix = new Mat4([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ])

      const clone = matrix.clone()

      expect(matrix).not.toBe(clone)
      expect(matrix.toArray()).toEqual(clone.toArray())
    })
  })

  describe('fromRows', () => {
    it('returns a Mat4', () => {
      const matrix = Mat4.fromRows([
        new Vec4(1, 2, 3, 4),
        new Vec4(5, 6, 7, 8),
        new Vec4(9, 10, 11, 12),
        new Vec4(13, 14, 15, 16),
      ])
      expect(matrix.toArray()).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      ])
    })
  })

  describe('fromCols', () => {
    it('returns a Mat4', () => {
      const matrix = Mat4.fromCols([
        new Vec4(1, 2, 3, 4),
        new Vec4(5, 6, 7, 8),
        new Vec4(9, 10, 11, 12),
        new Vec4(13, 14, 15, 16),
      ])
      expect(matrix.toArray()).toEqual([
        1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16,
      ])
    })
  })

  describe('accessors', () => {
    let matrix: Mat4
    beforeEach(() => {
      matrix = new Mat4([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ])
    })

    it('sets using indices', () => {
      matrix[0] = [10, 20, 30, 40]
      matrix[1] = [50, 60, 70, 80]
      matrix[2] = [90, 100, 110, 120]
      matrix[3] = [130, 140, 150, 160]

      expect(matrix.toArray()).toEqual([
        10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
      ])
    })

    it('gets using indices', () => {
      expect(matrix[0]).toEqual([1, 2, 3, 4])
      expect(matrix[1]).toEqual([5, 6, 7, 8])
      expect(matrix[2]).toEqual([9, 10, 11, 12])
      expect(matrix[3]).toEqual([13, 14, 15, 16])
    })
  })

  describe('toString', () => {
    it('prints its value', () => {
      const matrix = new Mat4([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ])
      expect(matrix.toString()).toMatchSnapshot()
    })
  })

  describe('add', () => {
    it('computes the addition of two matrices', () => {
      const matrix = new Mat4([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ]).add(
        new Mat4([
          [10, 20, 30, 40],
          [50, 60, 70, 80],
          [80, 90, 100, 110],
          [120, 130, 140, 150],
        ])
      )
      expect(matrix.toArray()).toEqual([
        11, 22, 33, 44, 55, 66, 77, 88, 89, 100, 111, 122, 133, 144, 155, 166,
      ])
    })
  })

  describe('subtract', () => {
    it('computes the subtraction of two matrices', () => {
      const matrix = new Mat4([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ]).subtract(
        new Mat4([
          [10, 20, 30, 40],
          [50, 60, 70, 80],
          [80, 90, 100, 110],
          [120, 130, 140, 150],
        ])
      )
      expect(matrix.toArray()).toEqual([
        -9, -18, -27, -36, -45, -54, -63, -72, -71, -80, -89, -98, -107, -116,
        -125, -134,
      ])
    })
  })

  describe('scale', () => {
    it('computes the multiplication of a matrix by a scalar', () => {
      const matrix = new Mat4([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ]).scale(10)
      expect(matrix.toArray()).toEqual([
        10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
      ])
    })
  })

  describe('multiply', () => {
    it('computes the multiplication of two matrices', () => {
      const matrix = new Mat4([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ]).multiply(
        new Mat4([
          [10, 20, 30, 40],
          [50, 60, 70, 80],
          [80, 90, 100, 110],
          [120, 130, 140, 150],
        ])
      )
      expect(matrix.toArray()).toEqual([
        830, 930, 1030, 1130, 1870, 2130, 2390, 2650, 2910, 3330, 3750, 4170,
        3950, 4530, 5110, 5690,
      ])
    })
  })

  describe('determinant', () => {
    it('computes the determinant', () => {
      const matrix = new Mat4([
        [5, 6, 6, 8],
        [2, 2, 2, 8],
        [6, 6, 2, 8],
        [2, 3, 6, 7],
      ])

      expect(matrix.determinant()).toBe(-8)
    })
  })

  describe('inverse', () => {
    it('computes the inverse', () => {
      const matrix = new Mat4([
        [5, 6, 6, 8],
        [2, 2, 2, 8],
        [6, 6, 2, 8],
        [2, 3, 6, 7],
      ])

      expect(matrix.inverse().toArray()).toEqual([
        -17, -9, 12, 16, 17, 8.75, -11.75, -16, -4, -2.25, 2.75, 4, 1, 0.75,
        -0.75, -1,
      ])
    })

    it('throws an error if the matrix is not invertible', () => {
      const matrix = new Mat4([
        [4, 3, 1, 3],
        [4, 3, 1, 5],
        [4, 3, 1, 5],
        [0, 0, 0, 0],
      ])

      expect(() => matrix.inverse()).toThrow()
    })
  })
})
