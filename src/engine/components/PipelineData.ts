import { Component } from '../../ecs/Component'

export const PipelineData = new Component<{
  buffers: GPUBuffer[]
  bindGroup: GPUBindGroup
  uniformData: Float32Array
}>('PIPELINE_DATA')
