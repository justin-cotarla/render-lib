import { DefaultComponent } from '../../ecs/DefaultComponent'
import { Mat4 } from '../../math/Mat4'

/**
 * Matrix to transform from an entity's coordinate space to that of its parent
 */
export const ParentTransform = new DefaultComponent<{
  localToParentTransform: Mat4
  parentToLocalTransform: Mat4
}>('PARENT_TRANSFORMS', {
  localToParentTransform: Mat4.identity(),
  parentToLocalTransform: Mat4.identity(),
})
