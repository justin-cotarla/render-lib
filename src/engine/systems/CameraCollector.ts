import { System } from '../../ecs/System'
import { Mat4 } from '../../math/Mat4'
import { Vec3 } from '../../math/Vec3'
import { LocalTransform } from '../components/LocalTransform'
import { PerspectiveCamera } from '../components/PerspectiveCamera'
import { Position } from '../components/Position'
import { RootTransform } from '../components/RootTransform'

export class PerspectiveCameraCollector extends System {
  constructor() {
    super()

    this.registerComponent(PerspectiveCamera)
    this.registerComponent(Position)
    this.registerComponent(RootTransform)
    this.registerComponent(LocalTransform)
  }

  public collect(): {
    position: Vec3
    localTransform: Mat4
    rootTransform: Mat4
    perspectiveCamera: PerspectiveCamera
  }[] {
    return [...this.getMatchedEntities()].map((entity) => ({
      position: Position.getEntityData(entity.id),
      localTransform: LocalTransform.getEntityData(entity.id),
      rootTransform: RootTransform.getEntityData(entity.id),
      perspectiveCamera: PerspectiveCamera.getEntityData(entity.id),
    }))
  }
}
