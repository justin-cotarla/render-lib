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
          format: 'float32x4',
        },
      ],
      arrayStride: Float32Array.BYTES_PER_ELEMENT * 4,
      stepMode: 'vertex',
    },
  ],
})
