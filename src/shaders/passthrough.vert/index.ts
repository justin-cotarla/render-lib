import shader from './passthrough.vert.wgsl?raw'

export const passthroughVertDescriptor = (
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
          format: 'float32x3',
        },
        {
          shaderLocation: 1,
          offset: Float32Array.BYTES_PER_ELEMENT * 3,
          format: 'float32x3',
        },
      ],
      arrayStride: Float32Array.BYTES_PER_ELEMENT * 6,
      stepMode: 'vertex',
    },
  ],
})
