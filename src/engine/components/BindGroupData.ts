import { Component } from '../../ecs/Component'

export interface BindGroupData {
  gpuBuffers: GPUBuffer[]
  bindGroup: GPUBindGroup
  uniformBuffer: Float32Array
}

export const BindGroupData = new Component<BindGroupData>('BIND_GROUP_DATA')
