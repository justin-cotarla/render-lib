import { Component } from '../../ecs/Component'

export type EntityBuffer = {
  gpuBuffer: GPUBuffer
  buffer: Float32Array
}

export const EntityBuffer = new Component<EntityBuffer>('ENTITY_BUFFER')
