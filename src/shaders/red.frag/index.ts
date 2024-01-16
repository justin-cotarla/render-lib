import shader from './red.frag.wgsl?raw'

export const redFragDescriptor = (device: GPUDevice): GPUFragmentState => ({
  module: device.createShaderModule({
    code: shader,
  }),
  entryPoint: 'main',
  targets: [
    {
      format: navigator.gpu.getPreferredCanvasFormat(),
    },
  ],
})
