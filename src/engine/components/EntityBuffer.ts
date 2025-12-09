import { Component } from 'reactive-ecs'

export type EntityBuffer = {
  gpuBuffer: GPUBuffer
  buffer: Float32Array
}

export const EntityBuffer = new Component<EntityBuffer>('ENTITY_BUFFER')
