import { Mat3 } from './Mat3'

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
})
