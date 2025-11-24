import { DefaultComponent } from '../../ecs/DefaultComponent'
import { Mat4 } from '../../math/Mat4'

export const LocalTransform = new DefaultComponent<Mat4>(
  'LOCAL_TRANSFORM',
  new Mat4().identity()
)
