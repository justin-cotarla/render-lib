import { Orientation } from '../engine/components/Orientation'
import { Mat3ElementTuple } from '../math/Mat3'

export const eulerOrientationToMatrix = (
  orientation: Orientation
): Mat3ElementTuple => {
  if (
    orientation.heading === 0 &&
    orientation.pitch === 0 &&
    orientation.bank === 0
  ) {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]
  }

  const ch = Math.cos(orientation.heading)
  const cp = Math.cos(orientation.pitch)
  const cb = Math.cos(orientation.bank)
  const sh = Math.sin(orientation.heading)
  const sp = Math.sin(orientation.pitch)
  const sb = Math.sin(orientation.bank)

  return [
    [ch * cb + sh * sp * sb, sb * cp, -sh * cb + ch * sp * sb],
    [-ch * sb + sh * sp * cb, cb * cp, sb * sh + ch * sp * cb],
    [sh * cp, -sp, ch * cp],
  ]
}
