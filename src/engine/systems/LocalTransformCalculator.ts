import { Entity, System } from 'reactive-ecs'
import { Mat4 } from '../../math/Mat4'
import { LocalTransform } from '../components/LocalTransform'
import { ParentEntity } from '../components/ParentEntity'
import { ParentTransform } from '../components/ParentTransform'
import { TransformTarget } from '../components/TransformTarget'

/**
 * Computes transform matrices for tranforming entities tagged with TransformTarget
 * from scene space --> entity space.
 *
 * The matrices are set in a LocalTransform component.
 */
export class LocalTranformCalculator extends System {
  constructor() {
    super([TransformTarget, ParentEntity, ParentTransform])
  }

  private chainLocalTransform(entity: Entity, matrix: Mat4): void {
    if (!ParentEntity.hasEntity(entity)) {
      return
    }

    const parentEntity = ParentEntity.getEntityData(entity)

    if (!ParentTransform.hasEntity(parentEntity)) {
      return
    }

    const { parentToLocalTransform } =
      ParentTransform.getEntityData(parentEntity)

    this.chainLocalTransform(
      parentEntity,
      matrix.multiply(parentToLocalTransform)
    )
  }

  private getLocalTransformMatrix(entity: Entity): Mat4 {
    if (LocalTransform.hasEntity(entity)) {
      return LocalTransform.getEntityData(entity)
    }

    const localTransform = new Mat4().identity()

    entity.addComponent(LocalTransform, localTransform)

    return localTransform
  }

  public calculateLocalTransforms() {
    for (const entity of this.getMatchedEntities()) {
      const localTransformMatrix = this.getLocalTransformMatrix(entity)

      const { parentToLocalTransform } = ParentTransform.getEntityData(
        entity.id
      )

      localTransformMatrix.set(parentToLocalTransform.data)

      this.chainLocalTransform(entity, localTransformMatrix)
    }
  }
}
