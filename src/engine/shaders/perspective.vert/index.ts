import code from './perspective.vert.wgsl?raw'

export const getDescriptor = (device: GPUDevice): GPUVertexState => ({
  module: device.createShaderModule({
    code,
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

export const createGpuBuffers = (device: GPUDevice): GPUBuffer => {
  return device.createBuffer({
    label: 'vs_perspective',
    size: Float32Array.BYTES_PER_ELEMENT * 16,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  })
}
