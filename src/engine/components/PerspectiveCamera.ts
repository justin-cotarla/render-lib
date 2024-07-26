import { DefaultComponent } from '../../ecs/DefaultComponent'
import { Mat4 } from '../../math/Mat4'

export interface PerspectiveCamera {
  nearPlane: number
  farPlane: number
  fov: number
  aspectRatio: number
}

export const PerspectiveCamera = new DefaultComponent<PerspectiveCamera>(
  'PERSPECTIVE_CAMERA',
  {
    nearPlane: 1,
    farPlane: 100,
    fov: 60,
    aspectRatio: 1,
  }
)

export const computeClipTransform = ({
  nearPlane,
  farPlane,
  fov,
  aspectRatio,
}: PerspectiveCamera) => {
  const zoomX = 1 / Math.tan((fov * Math.PI) / 360)
  const zoomY = zoomX / aspectRatio

  return new Mat4([
    [zoomX, 0, 0, 0],
    [0, zoomY, 0, 0],
    [0, 0, farPlane / (farPlane - nearPlane), 1],
    [0, 0, (-nearPlane * farPlane) / (farPlane - nearPlane), 0],
  ])
}
