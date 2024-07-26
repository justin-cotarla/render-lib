import { DefaultComponent } from '../../ecs/DefaultComponent'
import { Mat4 } from '../../math/Mat4'

/**
 * Matrix to transform from an entity's coordinate space to that of its parent
 */
export const ParentTransform = new DefaultComponent<Mat4>(
  'PARENT_TRANSFORM',
  Mat4.identity()
)
