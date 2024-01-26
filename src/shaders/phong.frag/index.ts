import shader from './phong.frag.wgsl?raw'

export const phongFragDescriptor = (device: GPUDevice): GPUFragmentState => ({
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
