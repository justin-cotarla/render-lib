import { Component } from '../../ecs/Component.ts'

export type GlobalBuffer = {
  gpuBuffer: GPUBuffer
  buffer: Float32Array<ArrayBuffer>
}

export const GlobalBuffer = new Component<GlobalBuffer>('GLOBAL_BUFFER')
