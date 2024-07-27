import { Orientation } from '../engine/components/Orientation'
import { Mat3 } from '../math/Mat3'

export const eulerOrientationToMatrix = (orientation: Orientation): Mat3 => {
  if (
    orientation.heading === 0 &&
    orientation.pitch === 0 &&
    orientation.bank === 0
  ) {
    return Mat3.identity()
  }

  const ch = Math.cos(orientation.heading)
  const cp = Math.cos(orientation.pitch)
  const cb = Math.cos(orientation.bank)
  const sh = Math.sin(orientation.heading)
  const sp = Math.sin(orientation.pitch)
  const sb = Math.sin(orientation.bank)

  return new Mat3([
    [ch * cb + sh * sp * sb, sb * cp, -sh * cb + ch * sp * sb],
    [-ch * sb + sh * sp * cb, cb * cp, sb * sh + ch * sp * cb],
    [sh * cp, -sp, ch * cp],
  ])
}
