import { System } from '../../ecs/System'
import { Mat4 } from '../../math/Mat4'
import { Vec3 } from '../../math/Vec3'
import { Light } from '../components/Light'
import { Position } from '../components/Position'
import { RootTransform } from '../components/RootTransform'

export class LightCollector extends System {
  constructor() {
    super()

    this.registerComponent(Light)
    this.registerComponent(Position)
    this.registerComponent(RootTransform)
  }

  public collect(): { light: Light; position: Vec3; rootTransform: Mat4 }[] {
    return [...this.getMatchedEntities()].map((entity) => ({
      light: Light.getEntityData(entity.id),
      position: Position.getEntityData(entity.id),
      rootTransform: RootTransform.getEntityData(entity.id),
    }))
  }
}
