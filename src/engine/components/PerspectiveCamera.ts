import { DefaultComponent } from '../../ecs/DefaultComponent.ts'

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
  },
)
