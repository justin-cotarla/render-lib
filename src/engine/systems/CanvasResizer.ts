import { PerspectiveCamera } from '../components/PerspectiveCamera'
import { MouseControl } from '../components/MouseControl'
import { System } from 'reactive-ecs'

export class CanvasResizer extends System {
  private resizeObserver: ResizeObserver

  private setupResizeObserver() {
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0]?.borderBoxSize[0]) {
        return
      }

      const {
        contentBoxSize: [{ blockSize: width, inlineSize: height }],
      } = entries[0]

      this.canvas.width = Math.max(
        1,
        Math.min(width, this.maxTextureDimension2D)
      )
      this.canvas.height = Math.max(
        1,
        Math.min(height, this.maxTextureDimension2D)
      )

      for (const entity of this.getMatchedEntities()) {
        const cameraParams = PerspectiveCamera.getEntityData(entity.id)

        entity.addComponent(PerspectiveCamera, {
          ...cameraParams,
          aspectRatio: width / height,
        })
      }
    })

    return resizeObserver
  }

  constructor(
    private readonly canvas: HTMLCanvasElement,
    readonly maxTextureDimension2D: GPUSupportedLimits['maxTextureDimension2D']
  ) {
    super([MouseControl, PerspectiveCamera])

    this.resizeObserver = this.setupResizeObserver()
    this.resizeObserver.observe(this.canvas)
  }
}
