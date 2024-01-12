import { Mat3 } from './Mat3'

describe('Mat3', () => {
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
