import { parseObj } from './loaders/parseObj'
import { Mesh3d } from './mesh/Mesh3d'
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
  context: GPUCanvasContext,
  pipeline: GPURenderPipeline,
  buffer: GPUBuffer,
  vertexCount: number
): void => {
  const canvasTexture = context.getCurrentTexture()

  const depthTexture = device.createTexture({
    size: [canvasTexture.width, canvasTexture.height],
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  })

  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments: [
      {
        clearValue: { r: 1.0, b: 1.0, g: 1.0, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store',
        view: canvasTexture.createView(),
      },
    ],
    depthStencilAttachment: {
      view: depthTexture.createView(),
      depthClearValue: 1.0,
      depthLoadOp: 'clear',
      depthStoreOp: 'store',
    },
  }

  const commandEncoder = device.createCommandEncoder()
  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)
  passEncoder.setPipeline(pipeline)

  passEncoder.setVertexBuffer(0, buffer)

  passEncoder.draw(vertexCount)

  passEncoder.end()
  device.queue.submit([commandEncoder.finish()])
}

const renderMesh = async (mesh: Mesh3d) => {
  const device = await getDevice()
  const context = getRenderContext(device)

  const renderPipeline = device.createRenderPipeline({
    vertex: passthroughVertDescriptor(device),
    fragment: redFragDescriptor(device),
    layout: 'auto',
    primitive: {
      topology: 'triangle-list',
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: 'less',
      format: 'depth24plus',
    },
  })

  const vertexData = mesh.toFloat32Array()

  const vertexBuffer = device.createBuffer({
    size: vertexData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  })

  device.queue.writeBuffer(vertexBuffer, 0, vertexData, 0, vertexData.length)

  render(device, context, renderPipeline, vertexBuffer, mesh.vertexCount())
}

const fileInput = document.querySelector('#obj') as HTMLInputElement
fileInput.addEventListener('change', async (event) => {
  const target = event.target as HTMLInputElement

  const meshFile = target.files?.[0]

  if (!meshFile) {
    return
  }

  const mesh = parseObj(await meshFile.text())

  renderMesh(mesh)
})
