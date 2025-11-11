import { System } from '../../ecs/System.ts'
import { Mat4 } from '../../math/Mat4.ts'
import { Vec3 } from '../../math/Vec3.ts'
import { PerspectiveCamera } from '../components/PerspectiveCamera.ts'
import { Position } from '../components/Position.ts'
import { RootClipTransform } from '../components/RootClipTransform.ts'
import { RootTransform } from '../components/RootTransform.ts'

export class PerspectiveCameraCollector extends System {
  constructor() {
    super()

    this.registerComponent(RootClipTransform)
    this.registerComponent(Position)
    this.registerComponent(RootTransform)
  }

  public collect(): {
    position: Vec3
    rootTransform: Mat4
    rootClipTransform: Mat4
    perspectiveCamera: PerspectiveCamera
  }[] {
    return [...this.getMatchedEntities()].map((entity) => ({
      position: Position.getEntityData(entity),
      rootTransform: RootTransform.getEntityData(entity),
      rootClipTransform: RootClipTransform.getEntityData(entity),
      perspectiveCamera: PerspectiveCamera.getEntityData(entity),
    }))
  }
}
