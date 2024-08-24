import { Pipeline } from './systems/Pipeline'
import { LocalTranformCalculator } from './systems/LocalTransformCalculator'
import { MeshBufferLoader } from './systems/MeshBufferLoader'
import { ParentTranformCalculator } from './systems/ParentTransformCalculator'
import { RootTranformCalculator } from './systems/RootTransformCalculator'
import { RootClipTransformCalculator } from './systems/RootClipTransformCalculator'

export class Renderer {
  private parentTransformCalculator = new ParentTranformCalculator()
  private rootTransformCalculator = new RootTranformCalculator()
  private localTransformCalculator = new LocalTranformCalculator()
  private rootClipTransformCalculator = new RootClipTransformCalculator()

  private meshBufferLoader: MeshBufferLoader
  private registeredPipelines: Pipeline[] = []

  private constructor(
    private readonly device: GPUDevice,
    private readonly context: GPUCanvasContext
  ) {
    this.meshBufferLoader = new MeshBufferLoader(this.device)
  }

  public static create = async (
    device: GPUDevice,
    canvas: HTMLCanvasElement
  ): Promise<Renderer> => {
    const context = this.getRenderContext(device, canvas)

    return new Renderer(device, context)
  }

  public registerPipeline(pipeline: Pipeline): void {
    this.registeredPipelines.push(pipeline)
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
    this.parentTransformCalculator.calculateParentTransforms()
    this.rootTransformCalculator.calculateRootTransforms()
    this.localTransformCalculator.calculateLocalTransforms()
    this.rootClipTransformCalculator.calculateRootClipTransforms()

    const commandEncoder = this.device.createCommandEncoder()
    const renderPass = commandEncoder.beginRenderPass(
      this.getRenderPassDescriptor()
    )

    for (const pipeline of this.registeredPipelines) {
      pipeline.render(renderPass)
    }

    renderPass.end()

    this.device.queue.submit([commandEncoder.finish()])
  }
}
