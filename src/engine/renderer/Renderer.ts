import { System } from '../../ecs/System'
import { BindGroupData } from '../components/BindGroupData'
import { Mesh } from '../components/Mesh'
import { MeshBuffer } from '../components/MeshBuffer'
import { PipelineIdentifier } from '../components/PipelineIdentifier'
import { createPipelines } from '../pipelines/createPipelines'
import { Pipeline } from '../pipelines/Pipeline'
import { PerspectiveCameraCollector } from '../systems/CameraCollector'
import { LightCollector } from '../systems/LightCollector'
import { LocalTranformCalculator } from '../systems/LocalTransformCalculator'
import { MeshBufferLoader } from '../systems/MeshBufferLoader'
import { ParentTranformCalculator } from '../systems/ParentTransformCalculator'
import { PipelineBufferAllocator } from '../systems/PipelineBufferAllocator'
import { PipelineBufferLoader } from '../systems/PipelineBufferLoader'
import { RootTranformCalculator } from '../systems/RootTransformCalculator'

export class Renderer extends System {
  private parentTransformCalculator = new ParentTranformCalculator()
  private rootTransformCalculator = new RootTranformCalculator()
  private localTransformCalculator = new LocalTranformCalculator()

  private lightCollector = new LightCollector()
  private perspectiveCameraCollector = new PerspectiveCameraCollector()
  private pipelineBufferLoader: PipelineBufferLoader
  private pipelineBufferAllocator: PipelineBufferAllocator
  private meshBufferLoader: MeshBufferLoader
  pipelineMap: Record<string, Pipeline>

  private constructor(
    private readonly device: GPUDevice,
    private readonly context: GPUCanvasContext
  ) {
    super()
    this.pipelineMap = createPipelines(this.device)

    this.pipelineBufferAllocator = new PipelineBufferAllocator(
      this.device,
      this.pipelineMap
    )

    this.meshBufferLoader = new MeshBufferLoader(this.device)

    this.pipelineBufferLoader = new PipelineBufferLoader(
      this.device,
      this.pipelineMap
    )

    this.registerComponent(BindGroupData)
    this.registerComponent(MeshBuffer)
    this.registerComponent(Mesh)
    this.registerComponent(PipelineIdentifier)
  }

  public static create = async (
    canvas: HTMLCanvasElement
  ): Promise<Renderer> => {
    const device = await this.getDevice()
    const context = this.getRenderContext(device, canvas)

    return new Renderer(device, context)
  }

  public getDeviceLimits = (): GPUSupportedLimits => this.device.limits

  private static getDevice = async (): Promise<GPUDevice> => {
    if (!navigator.gpu) {
      throw new Error('WebGPU not supported')
    }

    const adapter = await navigator.gpu.requestAdapter()

    if (!adapter) {
      throw Error("Couldn't request WebGPU adapter.")
    }

    return adapter.requestDevice()
  }

  public allocateBuffers() {
    this.pipelineBufferAllocator.allocateBuffers()
  }

  public loadStaticMeshBuffers() {
    this.meshBufferLoader.loadBuffers()
  }

  private static getRenderContext = (
    device: GPUDevice,
    canvas: HTMLCanvasElement
  ): GPUCanvasContext => {
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

  private getRenderPassDescriptor = (): GPURenderPassDescriptor => {
    const canvasTexture = this.context.getCurrentTexture()

    const depthTexture = this.device.createTexture({
      size: [canvasTexture.width, canvasTexture.height],
      format: 'depth24plus',
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    })

    return {
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
  }

  public render = async () => {
    if (!this.device) {
      throw new Error('Device not loaded')
    }

    this.parentTransformCalculator.calculateParentTransforms()
    this.rootTransformCalculator.calculateRootTransforms()
    this.localTransformCalculator.calculateLocalTransforms()

    const camera = this.perspectiveCameraCollector.collect()[0]
    const lights = this.lightCollector.collect()

    this.pipelineBufferLoader.loadBuffers({
      camera,
      lights,
    })

    const commandEncoder = this.device.createCommandEncoder()
    const renderPass = commandEncoder.beginRenderPass(
      this.getRenderPassDescriptor()
    )

    for (const entity of this.getMatchedEntities()) {
      const pipeline =
        this.pipelineMap[PipelineIdentifier.getEntityData(entity.id)]

      const vertexCount = Mesh.getEntityData(entity.id).triangles.length * 3
      const { bindGroup } = BindGroupData.getEntityData(entity.id)
      const meshBuffer = MeshBuffer.getEntityData(entity.id)

      renderPass.setPipeline(pipeline.renderPipeline)

      renderPass.setBindGroup(0, bindGroup)
      renderPass.setVertexBuffer(0, meshBuffer)

      renderPass.draw(vertexCount)
    }
    renderPass.end()

    this.device.queue.submit([commandEncoder.finish()])
  }
}
