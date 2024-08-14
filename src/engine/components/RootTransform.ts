import { DefaultComponent } from '../../ecs/DefaultComponent'
import { Mat4 } from '../../math/Mat4'

/**
 * Matrix to transform from an entity's coordinate space to that of the root
 */
export const RootTransform = new DefaultComponent<Mat4>(
  'ROOT_TRANSFORM',
  new Mat4().identity()
)
