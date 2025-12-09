import { Component } from 'reactive-ecs'
import { Mat4 } from '../../math/Mat4'

export const LocalTransform = new Component<Mat4>('LOCAL_TRANSFORM')
