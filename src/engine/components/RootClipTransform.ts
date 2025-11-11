import { Component } from '../../ecs/Component.ts'
import { Mat4 } from '../../math/Mat4.ts'

export const RootClipTransform = new Component<Mat4>('ROOT_CLIP_TRANSFORM')
