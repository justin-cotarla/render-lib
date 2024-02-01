import { Mesh3d } from './nodes/Mesh3d'
import { PerspectiveCamera } from './nodes/PerpectiveCamera'
import { RigidNode } from './nodes/RigidNode'
import { phongFragDescriptor } from './shaders/phong.frag'
import { perspectiveVertDescriptor } from './shaders/perspective.vert'

export class Renderer {
  private context: GPUCanvasContext | null = null

  private meshMap = new Map<
    string,
    {
      mesh: Mesh3d
      renderPipeline: GPURenderPipeline
      bindGroup: GPUBindGroup
      vertexBuffer: GPUBuffer
      vsBuffer: GPUBuffer
      fsBuffer: GPUBuffer
      data: Float32Array
    }
  >()

  private light: RigidNode | null = null

  private constructor(
    readonly device: GPUDevice,
    readonly canvas: HTMLCanvasElement
  ) {
    this.context = this.getRenderContext()
  }

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

    return pass
  }

  public loadMesh = (mesh: Mesh3d) => {
    if (!this.device) {
      throw new Error('Device not loaded')
    }

    const vertexBuffer = this.device.createBuffer({
      label: 'vs_input',
      size: mesh.data.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    })

    const vsBuffer = this.device.createBuffer({
      label: 'vs_uni',
      size: Float32Array.BYTES_PER_ELEMENT * 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })

    const fsBuffer = this.device.createBuffer({
      label: 'fs_uni',
      size: Float32Array.BYTES_PER_ELEMENT * 8,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })

    const renderPipeline = this.getRenderPipeline()

    const bindGroup = this.device.createBindGroup({
      layout: renderPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: vsBuffer } },
        { binding: 1, resource: { buffer: fsBuffer } },
      ],
    })

    const data = new Float32Array(mesh.data.length + 16 + 8)
    data.set(mesh.data)

    this.meshMap.set(mesh.ID, {
      mesh,
      vertexBuffer,
      bindGroup,
      renderPipeline,
      vsBuffer,
      fsBuffer,
      data,
    })
  }

  public setLight = (lightNode: RigidNode): void => {
    if (!this.device) {
      throw new Error('Device not loaded')
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

    const commandEncoder = this.device.createCommandEncoder()
    const pass = this.getRenderPass(commandEncoder)

    for (const {
      mesh,
      vertexBuffer,
      renderPipeline,
      bindGroup,
      vsBuffer,
      fsBuffer,
      data,
    } of this.meshMap.values()) {
      pass.setPipeline(renderPipeline)

      let offset = 0

      this.device.queue.writeBuffer(vertexBuffer, 0, data, 0, mesh.data.length)
      offset += mesh.data.length

      // Mesh clip transform
      const meshClipTransformData = mesh
        .getRootNodeTransform()
        .multiply(camera.getNodeRootTransform().multiply(camera.clipTransform))
        .transpose()
        .toArray()

      data.set(meshClipTransformData, offset)
      this.device.queue.writeBuffer(
        vsBuffer,
        0,
        data,
        offset,
        meshClipTransformData.length
      )
      offset += meshClipTransformData.length

      const worldModelTransform = mesh.getNodeRootTransform()

      // Camera Position
      const cameraPosModelData = camera.position
        .upgrade(1)
        .applyMatrix(worldModelTransform)
        .toArray()

      data.set(cameraPosModelData, offset)
      this.device.queue.writeBuffer(
        fsBuffer,
        0,
        data,
        offset,
        cameraPosModelData.length
      )
      offset += cameraPosModelData.length

      // Light Position
      const lightPosModelData = this.light.position
        .upgrade(1)
        .applyMatrix(worldModelTransform)
        .toArray()

      data.set(lightPosModelData, offset)
      this.device.queue.writeBuffer(
        fsBuffer,
        cameraPosModelData.length * Float32Array.BYTES_PER_ELEMENT,
        data,
        offset,
        lightPosModelData.length
      )
      offset += lightPosModelData.length

      pass.setVertexBuffer(0, vertexBuffer)
      pass.setBindGroup(0, bindGroup)
      pass.draw(mesh.vertexCount())
    }

    pass.end()
    this.device.queue.submit([commandEncoder.finish()])
  }
}
