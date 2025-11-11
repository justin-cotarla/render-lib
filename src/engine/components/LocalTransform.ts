import { DefaultComponent } from '../../ecs/DefaultComponent.ts'
import { Mat4 } from '../../math/Mat4.ts'

export const LocalTransform = new DefaultComponent<Mat4>(
  'LOCAL_TRANSFORM',
  new Mat4().identity(),
)
