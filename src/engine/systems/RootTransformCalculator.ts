import { Entity } from '../../ecs/Entity'
import { System } from '../../ecs/System'
import { Mat4 } from '../../math/Mat4'
import { ParentEntity } from '../components/ParentEntity'
import { ParentTransform } from '../components/ParentTransform'
import { RootTransform } from '../components/RootTransform'

export class RootTranformCalculator extends System {
  constructor() {
    super()

    this.registerComponent(ParentEntity)
    this.registerComponent(ParentTransform)
  }

  private getRootTransform(entity: Entity): Mat4 {
    try {
      const parentEntity = ParentEntity.getEntityData(entity.id)

      const { localToParentTransform } = ParentTransform.getEntityData(
        entity.id
      )

      return localToParentTransform
        .clone()
        .multiply(this.getRootTransform(parentEntity))
    } catch {
      return Mat4.identity()
    }
  }

  public calculateRootTransforms() {
    for (const entity of this.getMatchedEntities()) {
      const rootTransform = this.getRootTransform(entity)
      entity.addComponent(RootTransform, rootTransform)
    }
  }
}
