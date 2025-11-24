import { Mat3 } from './Mat3'

describe('Mat3', () => {
  describe('clone', () => {
    it('clones the matrix', () => {
      const matrix = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9])

      const clone = matrix.clone()

      expect(matrix).not.toBe(clone)
      expect(matrix.data).toEqual(clone.data)
    })
  })

  describe('identity', () => {
    it('returns the identity matrix', () => {
      const matrix = new Mat3().identity()
      expect(matrix.data).toEqual([1, 0, 0, 0, 1, 0, 0, 0, 1])
    })
  })

  describe('toString', () => {
    it('prints its value', () => {
      const matrix = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(matrix.toString()).toMatchSnapshot()
    })
  })

  describe('add', () => {
    it('computes the addition of two matrices', () => {
      const matrix = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9]).add(
        new Mat3([10, 20, 30, 40, 50, 60, 70, 80, 90])
      )
      expect(matrix.data).toEqual([11, 22, 33, 44, 55, 66, 77, 88, 99])
    })
  })

  describe('subtract', () => {
    it('computes the subtraction of two matrices', () => {
      const matrix = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9]).subtract(
        new Mat3([10, 20, 30, 40, 50, 60, 70, 80, 90])
      )
      expect(matrix.data).toEqual([-9, -18, -27, -36, -45, -54, -63, -72, -81])
    })
  })

  describe('scale', () => {
    it('computes the multiplication of a matrix by a scalar', () => {
      const matrix = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9]).scale(10)
      expect(matrix.data).toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90])
    })
  })

  describe('multiply', () => {
    it('computes the multiplication of two matrices', () => {
      const matrix = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9]).multiply(
        new Mat3([10, 20, 30, 40, 50, 60, 70, 80, 90])
      )
      expect(matrix.data).toEqual([
        300, 360, 420, 660, 810, 960, 1020, 1260, 1500,
      ])
    })
  })

  describe('determinant', () => {
    it('computes the determinant', () => {
      const matrix = new Mat3([-7, 1, 6, 2, -5, 0, 8, -7, 8])

      expect(matrix.determinant()).toBe(420)
    })
  })

  describe('inverse', () => {
    it('computes the inverse', () => {
      const matrix = new Mat3([1, 2, -1, -2, 0, 1, 1, -1, 0])

      expect(matrix.inverse().data).toEqual([1, 1, 2, 1, 1, 1, 2, 3, 4])
    })

    it('throws an error if the matrix is not invertible', () => {
      const matrix = new Mat3([4, 3, 1, 4, 3, 1, 0, 0, 0])

      expect(() => matrix.inverse()).toThrow()
    })
  })
})
