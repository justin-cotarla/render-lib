import { Component } from '../../ecs/Component'

export type GlobalBuffer = { gpuBuffer: GPUBuffer; buffer: Float32Array }

export const GlobalBuffer = new Component<GlobalBuffer>('GLOBAL_BUFFER')
