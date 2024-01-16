import { passthroughVertDescriptor } from './shaders/passthrough.vert'
import { redFragDescriptor } from './shaders/red.frag'

const getDevice = async (): Promise<GPUDevice> => {
  if (!navigator.gpu) {
    throw new Error('WebGPU not supports')
  }

  const adapter = await navigator.gpu.requestAdapter()

  if (!adapter) {
    throw Error("Couldn't request WebGPU adapter.")
  }

  return adapter.requestDevice()
}

const getRenderContext = (device: GPUDevice): GPUCanvasContext => {
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement

  const context = canvas.getContext('webgpu')

  if (!context) {
    throw new Error('Could not load canvas context')
  }

  context.configure({
    device,
    format: navigator.gpu.getPreferredCanvasFormat(),
    alphaMode: 'premultiplied',
  })

  return context
}

const render = (
  device: GPUDevice,
  view: GPUTextureView,
  pipeline: GPURenderPipeline,
  buffer: GPUBuffer
): void => {
  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments: [
      {
        clearValue: { r: 1.0, b: 1.0, g: 1.0, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store',
        view,
      },
    ],
  }

  const commandEncoder = device.createCommandEncoder()
  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)
  passEncoder.setPipeline(pipeline)

  passEncoder.setVertexBuffer(0, buffer)

  passEncoder.draw(3)

  passEncoder.end()
  device.queue.submit([commandEncoder.finish()])
}

const start = async () => {
  const device = await getDevice()
  const context = getRenderContext(device)

  const renderPipeline = device.createRenderPipeline({
    vertex: passthroughVertDescriptor(device),
    fragment: redFragDescriptor(device),
    layout: 'auto',
    primitive: {
      topology: 'triangle-list',
    },
  })

  const vertices = new Float32Array([
    -0.7, -0.7, 0.0, 1.0, 0.7, -0.7, 0.0, 1.0, 0, 0.7, 0.0, 1.0,
  ])
  const vertexBuffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  })

  device.queue.writeBuffer(vertexBuffer, 0, vertices, 0, vertices.length)

  render(
    device,
    context.getCurrentTexture().createView(),
    renderPipeline,
    vertexBuffer
  )
}

void start()
