import { SerializablePipelineDescriptor } from '../../systems/Pipeline.ts'

import shader from './shader.wgsl' with { type: 'text' }

export const MonoToolPipelineDescriptor: SerializablePipelineDescriptor = {
  gpuPipelineDescriptor: {
    label: 'mono_toon_pipeline',
    vertex: {
      module: {
        code: shader,
      },
      buffers: [
        {
          attributes: [
            {
              shaderLocation: 0,
              offset: 0,
              format: 'float32x4',
            },
            {
              shaderLocation: 1,
              offset: Float32Array.BYTES_PER_ELEMENT * 4,
              format: 'float32x4',
            },
          ],
          arrayStride: Float32Array.BYTES_PER_ELEMENT * 8,
          stepMode: 'vertex',
        },
      ],
    },
    fragment: {
      module: {
        code: shader,
      },
      targets: [
        {
          format: navigator.gpu.getPreferredCanvasFormat(),
        },
      ],
    },
    layout: 'auto',
    primitive: {
      topology: 'triangle-list',
      cullMode: 'front',
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: 'less',
      format: 'depth24plus',
    },
  },
  gpuBindGroupDescriptors: [
    {
      label: 'mono_toon_bindgroup',
      entries: [
        {
          binding: 0,
          resource: { buffer: this.globalBuffer.gpuBuffer },
        },
        {
          binding: 1,
          resource: { buffer: gpuBuffer },
        },
      ],
    },
  ],
}
