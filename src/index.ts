import { cubestring } from './cube'
import { parseObj } from './loaders/parseObj'
import { Vec4 } from './math/Vec4'
import { Mesh3d } from './nodes/Mesh3d'
import { RigidNode } from './nodes/RigidNode'
import { redFragDescriptor } from './shaders/red.frag'
import { scaleVertDescriptor } from './shaders/scale.vert'

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

const getRenderPipeline = (device: GPUDevice): GPURenderPipeline => {
  return device.createRenderPipeline({
    vertex: scaleVertDescriptor(device),
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
}

const getRenderPass = (
  device: GPUDevice,
  context: GPUCanvasContext,
  pipeline: GPURenderPipeline,
  commandEncoder: GPUCommandEncoder
): GPURenderPassEncoder => {
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

  const pass = commandEncoder.beginRenderPass(renderPassDescriptor)
  pass.setPipeline(pipeline)

  return pass
}

const loadMesh = (
  device: GPUDevice,
  pipeline: GPURenderPipeline,
  mesh: Mesh3d
): {
  vertexBuffer: GPUBuffer
  uniformBuffer: GPUBuffer
  bindGroup: GPUBindGroup
} => {
  const vertexData = mesh.toFloat32Array()

  const vertexBuffer = device.createBuffer({
    size: vertexData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  })

  const uniformBuffer = device.createBuffer({
    size: Float32Array.BYTES_PER_ELEMENT * 16,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  })

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
  })

  return {
    vertexBuffer,
    uniformBuffer,
    bindGroup,
  }
}

const setupPipeline = async () => {
  const device = await getDevice()
  const context = getRenderContext(device)
  const pipeline = getRenderPipeline(device)

  return {
    device,
    context,
    pipeline,
  }
}

const render = async (
  device: GPUDevice,
  context: GPUCanvasContext,
  pipeline: GPURenderPipeline,
  mesh: Mesh3d,
  vertexBuffer: GPUBuffer,
  bindGroup: GPUBindGroup
) => {
  const commandEncoder = device.createCommandEncoder()
  const pass = getRenderPass(device, context, pipeline, commandEncoder)

  pass.setVertexBuffer(0, vertexBuffer)
  pass.setBindGroup(0, bindGroup)

  pass.draw(mesh.vertexCount())

  pass.end()
  device.queue.submit([commandEncoder.finish()])
}

const start = async (mesh: Mesh3d) => {
  const rootNode = new RigidNode()

  const camera = new RigidNode()
  camera.move(new Vec4(0, 0, -40, 1))

  rootNode.addChild(mesh)
  rootNode.addChild(camera)

  const { context, device, pipeline } = await setupPipeline()

  const { bindGroup, vertexBuffer, uniformBuffer } = loadMesh(
    device,
    pipeline,
    mesh
  )

  const vertexData = mesh.toFloat32Array()
  device.queue.writeBuffer(vertexBuffer, 0, vertexData, 0, vertexData.length)

  let direction = 'right'

  const moveMesh = () => {
    if (direction === 'right') {
      if (mesh.position.x < 10) {
        mesh.move(new Vec4(0.5, 0, 0, 0))
      } else if (mesh.position.x >= 10) {
        direction = 'left'
      }
    } else if (direction === 'left') {
      if (mesh.position.x > -10) {
        mesh.move(new Vec4(-0.5, 0, 0, 0))
      } else if (mesh.position.x <= -10) {
        direction = 'right'
      }
    }

    const transform = mesh
      .getRootTransform()
      .multiply(camera.getRootTransform().inverse())

    const transformData = new Float32Array(transform.transpose().toArray())

    device.queue.writeBuffer(uniformBuffer, 0, transformData)
    render(device, context, pipeline, mesh, vertexBuffer, bindGroup)
    requestAnimationFrame(moveMesh)
  }

  moveMesh()
}

const fileInput = document.querySelector('#obj') as HTMLInputElement
fileInput.addEventListener('change', async (event) => {
  const target = event.target as HTMLInputElement

  const meshFile = target.files?.[0]

  if (!meshFile) {
    return
  }

  const mesh = parseObj(await meshFile.text())

  start(mesh)
})
