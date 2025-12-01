import { DefaultComponent } from '../../ecs/DefaultComponent'

export const OrthographicCamera = new DefaultComponent<{
  nearPlane: number
  farPlane: number
  width: number
  aspectRatio: number
}>('ORTHOGRAPHIC_CAMERA', {
  nearPlane: 0,
  farPlane: 10,
  width: 10,
  aspectRatio: 1,
})
