import { System } from '../../ecs/System.ts'
import { MouseObserver } from '../../input/MouseObserver.ts'
import { Orientation } from '../components/Orientation.ts'
import { PerspectiveCamera } from '../components/PerspectiveCamera.ts'
import { MouseControl } from '../components/MouseControl.ts'

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
