import shader from './perspective.vert.wgsl?raw'

export const perspectiveVertDescriptor = (
  device: GPUDevice
): GPUVertexState => ({
  module: device.createShaderModule({
    code: shader,
  }),
  entryPoint: 'main',
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
})
