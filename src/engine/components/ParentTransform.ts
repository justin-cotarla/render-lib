import { Component } from 'reactive-ecs'
import { Mat4 } from '../../math/Mat4'

/**
 * Matrix to transform from an entity's coordinate space to that of its parent
 */
export const ParentTransform = new Component<{
  localToParentTransform: Mat4
  parentToLocalTransform: Mat4
}>('PARENT_TRANSFORMS')
