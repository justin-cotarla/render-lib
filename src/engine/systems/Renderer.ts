import { WindowGPU } from '@gfx/dwm/ext/webgpu'

import { MeshBufferLoader } from './MeshBufferLoader.ts'
import { System } from '../../ecs/System.ts'
import { ActivePipeline } from '../components/ActivePipeline.ts'

export class Renderer extends System {
  private meshBufferLoader: MeshBufferLoader

  private constructor(
    private readonly device: GPUDevice,
    private readonly context: GPUCanvasContext,
  ) {
    super()

    this.registerComponent(ActivePipeline)

    this.meshBufferLoader = new MeshBufferLoader(this.device)
  }

  public static create = (
    device: GPUDevice,
    window: WindowGPU,
  ): Renderer => {
    const context = this.getRenderContext(device, window)

    return new Renderer(device, context)
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
    const commandEncoder = this.device.createCommandEncoder()
    const renderPass = commandEncoder.beginRenderPass(
      this.getRenderPassDescriptor(),
    )

    for (const pipelineId of this.getMatchedEntities()) {
      ActivePipeline.getEntityData(pipelineId).render(renderPass)
    }

    renderPass.end()

    this.device.queue.submit([commandEncoder.finish()])
  }
}
