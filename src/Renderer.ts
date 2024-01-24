import { Mesh3d } from './nodes/Mesh3d'
import { RigidNode } from './nodes/RigidNode'
import { redFragDescriptor } from './shaders/red.frag'
import { scaleVertDescriptor } from './shaders/scale.vert'

export class Renderer {
  private device: GPUDevice | null = null
  private context: GPUCanvasContext | null = null
  private pipeline: GPURenderPipeline | null = null

  private meshMap = new Map<
    string,
    {
      mesh: Mesh3d
      vertexBuffer: GPUBuffer
      uniformBuffer: GPUBuffer
      bindGroup: GPUBindGroup
    }
  >()

  private getDevice = async (): Promise<GPUDevice> => {
    if (!navigator.gpu) {
      throw new Error('WebGPU not supports')
    }

    const adapter = await navigator.gpu.requestAdapter()

    if (!adapter) {
      throw Error("Couldn't request WebGPU adapter.")
    }

    return adapter.requestDevice()
  }

  private getRenderContext = (): GPUCanvasContext => {
    if (!this.device) {
      throw new Error('Device not loaded')
    }

    const canvas = document.querySelector('#canvas') as HTMLCanvasElement

    const context = canvas.getContext('webgpu')

    if (!context) {
      throw new Error('Could not load canvas context')
    }

    context.configure({
      device: this.device,
      format: navigator.gpu.getPreferredCanvasFormat(),
      alphaMode: 'premultiplied',
    })

    return context
  }

  private getRenderPipeline = (): GPURenderPipeline => {
    if (!this.device) {
      throw new Error('Device not loaded')
    }

    return this.device.createRenderPipeline({
      vertex: scaleVertDescriptor(this.device),
      fragment: redFragDescriptor(this.device),
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

  init = async () => {
    this.device = await this.getDevice()
    this.context = this.getRenderContext()
    this.pipeline = this.getRenderPipeline()
  }

  private getRenderPass = (
    commandEncoder: GPUCommandEncoder
  ): GPURenderPassEncoder => {
    if (!this.device) {
      throw new Error('Device not loaded')
    }
    if (!this.context) {
      throw new Error('No context')
    }
    if (!this.pipeline) {
      throw new Error('No pipeline')
    }

    const canvasTexture = this.context.getCurrentTexture()

    const depthTexture = this.device.createTexture({
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
    pass.setPipeline(this.pipeline)

    return pass
  }

  loadMesh = (mesh: Mesh3d) => {
    if (!this.device) {
      throw new Error('Device not loaded')
    }
    if (!this.pipeline) {
      throw new Error('No pipeline')
    }

    const vertexData = mesh.toFloat32Array()

    const vertexBuffer = this.device.createBuffer({
      size: vertexData.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    })

    const uniformBuffer = this.device.createBuffer({
      size: Float32Array.BYTES_PER_ELEMENT * 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })

    const bindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    })

    this.device.queue.writeBuffer(
      vertexBuffer,
      0,
      vertexData,
      0,
      vertexData.length
    )

    this.meshMap.set(mesh.ID, {
      mesh,
      vertexBuffer,
      uniformBuffer,
      bindGroup,
    })
  }

  renderAll = async (camera: RigidNode) => {
    if (!this.device) {
      throw new Error('Device not loaded')
    }

    const commandEncoder = this.device.createCommandEncoder()
    const pass = this.getRenderPass(commandEncoder)

    const cameraTransform = camera.getRootTransform().inverse()

    for (const {
      bindGroup,
      mesh,
      vertexBuffer,
      uniformBuffer,
    } of this.meshMap.values()) {
      const transform = mesh.getRootTransform().multiply(cameraTransform)
      const transformData = new Float32Array(transform.transpose().toArray())
      this.device.queue.writeBuffer(uniformBuffer, 0, transformData)

      pass.setVertexBuffer(0, vertexBuffer)
      pass.setBindGroup(0, bindGroup)

      pass.draw(mesh.vertexCount())
    }

    pass.end()
    this.device.queue.submit([commandEncoder.finish()])
  }
}
