import { DefaultComponent } from '../../ecs/DefaultComponent.ts'
import { Mat4 } from '../../math/Mat4.ts'

/**
 * Matrix to transform from an entity's coordinate space to that of its parent
 */
export const ParentTransform = new DefaultComponent<{
  localToParentTransform: Mat4
  parentToLocalTransform: Mat4
}>('PARENT_TRANSFORMS', {
  localToParentTransform: new Mat4().identity(),
  parentToLocalTransform: new Mat4().identity(),
})
