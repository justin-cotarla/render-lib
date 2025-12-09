import { Component } from 'reactive-ecs'

export type GlobalBuffer = {
  gpuBuffer: GPUBuffer
  buffer: Float32Array
}

export const GlobalBuffer = new Component<GlobalBuffer>('GLOBAL_BUFFER')
