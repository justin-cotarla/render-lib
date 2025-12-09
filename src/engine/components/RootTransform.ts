import { Component } from 'reactive-ecs'
import { Mat4 } from '../../math/Mat4'

/**
 * Matrix to transform from an entity's coordinate space to that of the root
 */
export const RootTransform = new Component<Mat4>('ROOT_TRANSFORM')
