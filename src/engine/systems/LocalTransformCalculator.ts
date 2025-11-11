import { Entity } from '../../ecs/Entity.ts'
import { System } from '../../ecs/System.ts'
import { Mat4 } from '../../math/Mat4.ts'
import { LocalTransform } from '../components/LocalTransform.ts'
import { ParentEntity } from '../components/ParentEntity.ts'
import { ParentTransform } from '../components/ParentTransform.ts'
import { TransformTarget } from '../components/TransformTarget.ts'

/**
 * Computes transform matrices for tranforming entities tagged with TransformTarget
 * from scene space --> entity space.
 *
 * The matrices are set in a LocalTransform component.
 */
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

      const { parentToLocalTransform } = ParentTransform.getEntityData(
        parentEntity,
      )

      this.chainLocalTransform(
        parentEntity,
        matrix.multiply(parentToLocalTransform),
      )
    } catch {
      return
    }
  }

  private getLocalTransformMatrix(entity: Entity): Mat4 {
    try {
      return LocalTransform.getEntityData(entity)
    } catch {
      const localTransform = new Mat4().identity()

      entity.addComponent(LocalTransform, localTransform)

      return localTransform
    }
  }

  public calculateLocalTransforms() {
    for (const entity of this.getMatchedEntities()) {
      const localTransformMatrix = this.getLocalTransformMatrix(entity)

      const { parentToLocalTransform } = ParentTransform.getEntityData(
        entity.id,
      )

      localTransformMatrix.set(parentToLocalTransform.data)

      this.chainLocalTransform(entity, localTransformMatrix)
    }
  }
}
