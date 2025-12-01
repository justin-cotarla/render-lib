import { ComponentData } from '../ecs/Component'
import { Orientation } from '../engine/components/Orientation'
import { OrthographicCamera } from '../engine/components/OrthographicCamera'
import { PerspectiveCamera } from '../engine/components/PerspectiveCamera'
import { Mat4 } from '../math/Mat4'

export const eulerOrientationToMatrix = (orientation: Orientation): Mat4 => {
  if (
    orientation.heading === 0 &&
    orientation.pitch === 0 &&
    orientation.bank === 0
  ) {
    return new Mat4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  }

  const ch = Math.cos(orientation.heading)
  const cp = Math.cos(orientation.pitch)
  const cb = Math.cos(orientation.bank)
  const sh = Math.sin(orientation.heading)
  const sp = Math.sin(orientation.pitch)
  const sb = Math.sin(orientation.bank)

  return new Mat4([
    ch * cb + sh * sp * sb,
    sb * cp,
    -sh * cb + ch * sp * sb,
    0,
    -ch * sb + sh * sp * cb,
    cb * cp,
    sb * sh + ch * sp * cb,
    0,
    sh * cp,
    -sp,
    ch * cp,
    0,
    0,
    0,
    0,
    1,
  ])
}

export const reverseEulerOrientationToMatrix = (
  orientation: Orientation
): Mat4 => {
  if (
    orientation.heading === 0 &&
    orientation.pitch === 0 &&
    orientation.bank === 0
  ) {
    return new Mat4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  }

  const ch = Math.cos(orientation.heading)
  const cp = Math.cos(orientation.pitch)
  const cb = Math.cos(orientation.bank)
  const sh = Math.sin(orientation.heading)
  const sp = Math.sin(orientation.pitch)
  const sb = Math.sin(orientation.bank)

  return new Mat4([
    ch * cb + sh * sp * sb,
    -ch * sb + sh * sp * cb,
    sh * cp,
    0,
    sb * cp,
    cb * cp,
    -sp,
    0,
    -sh * cb + ch * sp * sb,
    sb * sh + ch * sp * cb,
    ch * cp,
    0,
    0,
    0,
    0,
    1,
  ])
}

export const orthographicCameraToClipMatrix = ({
  aspectRatio,
  farPlane,
  nearPlane,
  width,
}: ComponentData<typeof OrthographicCamera>): Mat4 => {
  const zoomX = 2 / width
  const zoomY = zoomX / aspectRatio

  return new Mat4([
    zoomX,
    0,
    0,
    0,
    0,
    zoomY,
    0,
    0,
    0,
    0,
    1 / (farPlane - nearPlane),
    0,
    0,
    0,
    nearPlane / (nearPlane - farPlane),
    1,
  ])
}

export const perspectiveCameraToClipMatrix = ({
  nearPlane,
  farPlane,
  fov,
  aspectRatio,
}: PerspectiveCamera): Mat4 => {
  const zoomX = 1 / Math.tan((fov * Math.PI) / 360)
  const zoomY = zoomX / aspectRatio

  return new Mat4([
    zoomX,
    0,
    0,
    0,
    0,
    zoomY,
    0,
    0,
    0,
    0,
    farPlane / (farPlane - nearPlane),
    1,
    0,
    0,
    (-nearPlane * farPlane) / (farPlane - nearPlane),
    0,
  ])
}
