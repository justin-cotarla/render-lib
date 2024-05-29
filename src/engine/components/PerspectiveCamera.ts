import { DefaultComponent } from '../../ecs/DefaultComponent'

export const PerspectiveCamera = new DefaultComponent<{
  nearPlane: number
  farPlane: number
  fov: number
  aspectRatio: number
}>('PERSPECTIVE_CAMERA', {
  nearPlane: 1,
  farPlane: 100,
  fov: 60,
  aspectRatio: 1,
})
