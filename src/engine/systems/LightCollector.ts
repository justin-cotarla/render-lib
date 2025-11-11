import { System } from '../../ecs/System.ts'
import { Mat4 } from '../../math/Mat4.ts'
import { Vec3 } from '../../math/Vec3.ts'
import { Light } from '../components/Light.ts'
import { Position } from '../components/Position.ts'
import { RootTransform } from '../components/RootTransform.ts'

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
