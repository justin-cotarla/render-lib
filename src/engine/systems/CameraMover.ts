import { System } from '../../ecs/System'
import { MouseObserver } from '../../input/MouseObserver'
import { Orientation } from '../components/Orientation'
import { PerspectiveCamera } from '../components/PerspectiveCamera'
import { MouseControl } from '../components/MouseControl'

export class CameraMover extends System {
  private setupMouseObserver() {
    new MouseObserver((movementX, movementY) => {
      for (const entity of this.getMatchedEntities()) {
        const orientation = Orientation.getEntityData(entity.id)

        entity.addComponent(Orientation, {
          ...orientation,
          heading: orientation.heading + movementX * this.sensitivity,
          pitch: orientation.pitch + movementY * this.sensitivity,
        })
      }
    })
  }

  constructor(private readonly sensitivity: number) {
    super()

    this.registerComponent(PerspectiveCamera)
    this.registerComponent(Orientation)
    this.registerComponent(MouseControl)

    this.setupMouseObserver()
  }
}
