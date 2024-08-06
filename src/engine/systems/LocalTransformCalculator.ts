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

  private chainLocalTransform(entity: Entity, matrix: Mat4): void {
    try {
      const parentEntity = ParentEntity.getEntityData(entity)

      const { parentToLocalTransform } =
        ParentTransform.getEntityData(parentEntity)

      this.chainLocalTransform(
        parentEntity,
        matrix.multiply(parentToLocalTransform)
      )
    } catch {
      return
    }
  }

  private getLocalTransformMatrix(entity: Entity): Mat4 {
    try {
      return LocalTransform.getEntityData(entity)
    } catch {
      const localTransform = Mat4.identity()

      entity.addComponent(LocalTransform, localTransform)

      return localTransform
    }
  }

  public calculateLocalTransforms() {
    for (const entity of this.getMatchedEntities()) {
      const localTransformMatrix = this.getLocalTransformMatrix(entity)

      const { parentToLocalTransform } = ParentTransform.getEntityData(
        entity.id
      )

      localTransformMatrix.set(parentToLocalTransform.rows)

      this.chainLocalTransform(entity, localTransformMatrix)
    }
  }
}
