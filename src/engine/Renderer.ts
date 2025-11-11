import { WindowGPU } from '@gfx/dwm/ext/webgpu'

import { Pipeline } from './systems/Pipeline.ts'
import { LocalTranformCalculator } from './systems/LocalTransformCalculator.ts'
import { MeshBufferLoader } from './systems/MeshBufferLoader.ts'
import { ParentTranformCalculator } from './systems/ParentTransformCalculator.ts'
import { RootTranformCalculator } from './systems/RootTransformCalculator.ts'
import { RootClipTransformCalculator } from './systems/RootClipTransformCalculator.ts'

export class Renderer {
  private parentTransformCalculator = new ParentTranformCalculator()
  private rootTransformCalculator = new RootTranformCalculator()
  private localTransformCalculator = new LocalTranformCalculator()
  private rootClipTransformCalculator = new RootClipTransformCalculator()

  private meshBufferLoader: MeshBufferLoader
  private registeredPipelines: Pipeline[] = []

  private constructor(
    private readonly device: GPUDevice,
    private readonly context: GPUCanvasContext,
  ) {
    this.meshBufferLoader = new MeshBufferLoader(this.device)
  }

  public static create = (
    device: GPUDevice,
    window: WindowGPU,
  ): Renderer => {
    const context = this.getRenderContext(device, window)

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
    window: WindowGPU,
  ): GPUCanvasContext => {
    const context = window.getContext('webgpu')

    if (!context) {
      throw new Error('Could not load canvas context')
    }

    context.configure({
      device,
      format: navigator.gpu.getPreferredCanvasFormat(),
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

  public render = () => {
    this.parentTransformCalculator.calculateParentTransforms()
    this.rootTransformCalculator.calculateRootTransforms()
    this.localTransformCalculator.calculateLocalTransforms()
    this.rootClipTransformCalculator.calculateRootClipTransforms()

    const commandEncoder = this.device.createCommandEncoder()
    const renderPass = commandEncoder.beginRenderPass(
      this.getRenderPassDescriptor(),
    )

    for (const pipeline of this.registeredPipelines) {
      pipeline.render(renderPass)
    }

    renderPass.end()

    this.device.queue.submit([commandEncoder.finish()])
  }
}
