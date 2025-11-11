import { Entity } from '../../ecs/Entity.ts'
import { System } from '../../ecs/System.ts'
import { Mat4 } from '../../math/Mat4.ts'
import { ChildrenEntities } from '../components/ChildrenEntities.ts'
import { ParentTransform } from '../components/ParentTransform.ts'
import { RootTransform } from '../components/RootTransform.ts'
import { SceneRoot } from '../components/SceneRoot.ts'

export class RootTranformCalculator extends System {
  constructor() {
    super()

    this.registerComponent(SceneRoot)
    this.registerComponent(ChildrenEntities)
  }

  private setChildrenTransforms(entity: Entity, parentMatrix?: Mat4): void {
    try {
      for (const childEntity of ChildrenEntities.getEntityData(entity)) {
        const { localToParentTransform } = ParentTransform.getEntityData(
          childEntity,
        )
        const rootTransformMatrix = this.getRootTransformMatrix(childEntity)

        rootTransformMatrix.set(localToParentTransform.data)

        if (parentMatrix) {
          rootTransformMatrix.multiply(parentMatrix)
        }

        this.setChildrenTransforms(childEntity, rootTransformMatrix)
      }
    } catch {
      return
    }
  }

  private getRootTransformMatrix(entity: Entity): Mat4 {
    try {
      return RootTransform.getEntityData(entity)
    } catch {
      const rootTransform = new Mat4().identity()

      entity.addComponent(RootTransform, rootTransform)

      return rootTransform
    }
  }

  public calculateRootTransforms() {
    for (const entity of this.getMatchedEntities()) {
      this.setChildrenTransforms(entity)
    }
  }
}
