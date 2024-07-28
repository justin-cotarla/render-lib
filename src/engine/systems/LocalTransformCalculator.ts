import { Entity } from '../../ecs/Entity'
import { System } from '../../ecs/System'
import { Mat4 } from '../../math/Mat4'
import { LocalTransform } from '../components/LocalTransform'
import { ParentEntity } from '../components/ParentEntity'
import { ParentTransform } from '../components/ParentTransform'
import { TransformTarget } from '../components/TransformTarget'

export class LocalTranformCalculator extends System {
  constructor() {
    super()

    this.registerComponent(TransformTarget)
    this.registerComponent(ParentEntity)
    this.registerComponent(ParentTransform)
  }

  private getLocalTransform(entity: Entity): Mat4 {
    try {
      const parentEntity = ParentEntity.getEntityData(entity.id)

      const { parentToLocalTransform } = ParentTransform.getEntityData(
        entity.id
      )

      return this.getLocalTransform(parentEntity)
        .clone()
        .multiply(parentToLocalTransform)
    } catch {
      return Mat4.identity()
    }
  }

  public calculateLocalTransforms() {
    for (const entity of this.getMatchedEntities()) {
      const localTransform = this.getLocalTransform(entity)
      entity.addComponent(LocalTransform, localTransform)
    }
  }
}
