import { Entity, System } from 'reactive-ecs'
import { Mat4 } from '../../math/Mat4'
import { ChildrenEntities } from '../components/ChildrenEntities'
import { ParentTransform } from '../components/ParentTransform'
import { RootTransform } from '../components/RootTransform'
import { SceneRoot } from '../components/SceneRoot'

/**
 * Recursively computes root transform matrices for all children
 * of a SceneRoot entity: entity space --> scene space
 *
 * The matrices are set in a RootTransform component.
 */
export class RootTranformCalculator extends System {
  constructor() {
    super([SceneRoot, ChildrenEntities])
  }

  private setChildrenTransforms(entity: Entity, parentMatrix?: Mat4): void {
    if (!ChildrenEntities.hasEntity(entity)) {
      return
    }

    for (const childEntity of ChildrenEntities.getEntityData(entity)) {
      const { localToParentTransform } =
        ParentTransform.getEntityData(childEntity)
      const rootTransformMatrix = this.getRootTransformMatrix(childEntity)

      rootTransformMatrix.set(localToParentTransform.data)

      if (parentMatrix) {
        rootTransformMatrix.multiply(parentMatrix)
      }

      this.setChildrenTransforms(childEntity, rootTransformMatrix)
    }
  }

  private getRootTransformMatrix(entity: Entity): Mat4 {
    if (RootTransform.hasEntity(entity)) {
      return RootTransform.getEntityData(entity)
    }

    const rootTransform = new Mat4().identity()

    entity.addComponent(RootTransform, rootTransform)

    return rootTransform
  }

  public calculateRootTransforms() {
    for (const entity of this.getMatchedEntities()) {
      this.setChildrenTransforms(entity)
    }
  }
}
