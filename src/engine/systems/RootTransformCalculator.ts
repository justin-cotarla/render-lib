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

  private computeRootTransform(entity: Entity, matrix: Mat4): void {
    try {
      const parentEntity = ParentEntity.getEntityData(entity)

      const { localToParentTransform } =
        ParentTransform.getEntityData(parentEntity)

      this.computeRootTransform(
        parentEntity,
        matrix.multiply(localToParentTransform)
      )
    } catch {
      return
    }
  }

  private getRootTransformMatrix(entity: Entity): Mat4 {
    try {
      return RootTransform.getEntityData(entity)
    } catch {
      const rootTransform = Mat4.identity()

      entity.addComponent(RootTransform, rootTransform)

      return rootTransform
    }
  }

  public calculateRootTransforms() {
    for (const entity of this.getMatchedEntities()) {
      const rootTransformMatrix = this.getRootTransformMatrix(entity)

      const { localToParentTransform } = ParentTransform.getEntityData(
        entity.id
      )

      rootTransformMatrix.set(localToParentTransform.rows)

      this.computeRootTransform(entity, rootTransformMatrix)
    }
  }
}
