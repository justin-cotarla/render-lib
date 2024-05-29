export class Renderer {
  private context: GPUCanvasContext | null = null

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

  public loadScene = () => {
    if (!this.device) {
      throw new Error('Device not loaded')
    }

    for (const entity of this.getMatchedEntities()) {
      const mesh = this.getComponent(com)
      const { pipeline, meshes: objects } = this.

      const vertexBuffer = this.device.createBuffer({
        label: `vertex_buffer_${mesh.ID}`,
        size: mesh.vertexData.byteLength,
        usage: GPUBufferUsage.VERTEX,
        mappedAtCreation: true,
      })

      const bufferData = new Float32Array(vertexBuffer.getMappedRange())
      bufferData.set(mesh.vertexData)
      vertexBuffer.unmap()

      mesh.pipelineData = pipeline.createPipelineData()
      mesh.vertexBuffer = vertexBuffer

      objects.push(mesh as Parameters<(typeof pipeline)['loadBuffers']>[0])
    }

    const lights = scene.filterNodes(Light)
    this.light = lights[0]
  }

  public renderAll = async (camera: PerspectiveCamera) => {
    if (!this.device) {
      throw new Error('Device not loaded')
    }

    const commandEncoder = this.device.createCommandEncoder()

    const pass = this.getRenderPass(commandEncoder)
    Object.entries(this.pipelines).forEach(
      ([pipelineId, { meshes: objects, pipeline }]) => {
        pass.setPipeline(pipeline.renderPipeline)

        for (const mesh of objects) {
          if (!mesh.pipelineData) {
            throw new Error(`Mesh ${mesh.ID} does not have pipeline data`)
          }

          if (!mesh.vertexBuffer) {
            throw new Error(`Mesh ${mesh.ID} vertexBuffer not set`)
          }

          pass.setBindGroup(0, mesh.pipelineData.bindGroup)
          pass.setVertexBuffer(0, mesh.vertexBuffer)

          switch (pipelineId) {
            case 'MONO_PHONG': {
              if (!this.light) {
                throw new Error('Light not set')
              }
              pipeline.loadBuffers(mesh, camera, this.light)
              break
            }
            case 'MONO_TOON': {
              if (!this.light) {
                throw new Error('Light not set')
              }
              pipeline.loadBuffers(mesh, camera, this.light)
              break
            }
          }

          pass.draw(mesh.vertexCount())
        }
      }
    )
    pass.end()

    this.device.queue.submit([commandEncoder.finish()])
  }
}
