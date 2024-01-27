import { Mesh3d } from './nodes/Mesh3d'
import { PerspectiveCamera } from './nodes/PerpectiveCamera'
import { RigidNode } from './nodes/RigidNode'
import { phongFragDescriptor } from './shaders/phong.frag'
import { perspectiveVertDescriptor } from './shaders/perspective.vert'

export class Renderer {
  private context: GPUCanvasContext | null = null
  private pipeline: GPURenderPipeline | null = null

  private meshMap = new Map<
    string,
    {
      mesh: Mesh3d
      vertexBuffer: GPUBuffer
    }
  >()

  private bindGroup: GPUBindGroup | null = null

  private meshCliptransformBuffer: GPUBuffer | null = null
  private cameraBuffer: GPUBuffer | null = null
  private lightBuffer: GPUBuffer | null = null

  private light: RigidNode | null = null

  private constructor(
    readonly device: GPUDevice,
    readonly canvas: HTMLCanvasElement
  ) {}

  public static create = async (
    canvas: HTMLCanvasElement
  ): Promise<Renderer> => {
    const device = await this.getDevice()
    return new Renderer(device, canvas)
  }

  public getDeviceLimits = (): GPUSupportedLimits => this.device.limits

  private static getDevice = async (): Promise<GPUDevice> => {
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
      vertex: perspectiveVertDescriptor(this.device),
      fragment: phongFragDescriptor(this.device),
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
          clearValue: { r: 0.2, b: 0.2, g: 0.2, a: 1.0 },
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

  public init = async () => {
    this.context = this.getRenderContext()
    this.pipeline = this.getRenderPipeline()

    this.meshCliptransformBuffer = this.device.createBuffer({
      size: Float32Array.BYTES_PER_ELEMENT * 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })

    this.cameraBuffer = this.device.createBuffer({
      size: Float32Array.BYTES_PER_ELEMENT * 4,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })

    this.lightBuffer = this.device.createBuffer({
      size: Float32Array.BYTES_PER_ELEMENT * 4,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })

    this.bindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.meshCliptransformBuffer } },
        { binding: 1, resource: { buffer: this.cameraBuffer } },
        { binding: 2, resource: { buffer: this.lightBuffer } },
      ],
    })
  }

  public loadMesh = (mesh: Mesh3d) => {
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
    })
  }

  public setLight = (lightNode: RigidNode): void => {
    if (!this.device) {
      throw new Error('Device not loaded')
    }
    if (!this.pipeline) {
      throw new Error('No pipeline')
    }

    this.light = lightNode
  }

  public renderAll = async (camera: PerspectiveCamera) => {
    if (!this.device) {
      throw new Error('Device not loaded')
    }

    if (!this.light) {
      throw new Error('Light not set')
    }

    if (
      !this.meshCliptransformBuffer ||
      !this.cameraBuffer ||
      !this.lightBuffer
    ) {
      throw new Error('Buffers not set')
    }

    const commandEncoder = this.device.createCommandEncoder()
    const pass = this.getRenderPass(commandEncoder)

    for (const { mesh, vertexBuffer } of this.meshMap.values()) {
      const meshClipTransform = mesh
        .getRootNodeTransform()
        .multiply(camera.rootClipTransform)

      const meshClipTransformData = new Float32Array(
        meshClipTransform.transpose().toArray()
      )
      this.device.queue.writeBuffer(
        this.meshCliptransformBuffer,
        0,
        meshClipTransformData
      )

      const worldModelTransform = mesh.getRootNodeTransform().inverse()

      const cameraPosModel = new Float32Array(
        camera.position.upgrade(1).applyMatrix(worldModelTransform).toArray()
      )
      const lightPosModel = new Float32Array(
        this.light.position
          .upgrade(1)
          .applyMatrix(worldModelTransform)
          .toArray()
      )

      this.device.queue.writeBuffer(this.cameraBuffer, 0, cameraPosModel)
      this.device.queue.writeBuffer(this.lightBuffer, 0, lightPosModel)

      pass.setVertexBuffer(0, vertexBuffer)
      pass.setBindGroup(0, this.bindGroup)

      pass.draw(mesh.vertexCount())
    }

    pass.end()
    this.device.queue.submit([commandEncoder.finish()])
  }
}
