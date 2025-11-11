import { Component } from '../../ecs/Component.ts'

export type EntityBuffer = {
  gpuBuffer: GPUBuffer
  buffer: Float32Array<ArrayBuffer>
}

export const EntityBuffer = new Component<EntityBuffer>('ENTITY_BUFFER')
