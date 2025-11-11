import { Entity } from '../../ecs/Entity.ts'
import { System } from '../../ecs/System.ts'
import { Mat4 } from '../../math/Mat4.ts'
import { Vec3 } from '../../math/Vec3.ts'
import {
  eulerOrientationToMatrix,
  reverseEulerOrientationToMatrix,
} from '../../util/matrixTransformations.ts'
import { Orientation } from '../components/Orientation.ts'
import { ParentEntity } from '../components/ParentEntity.ts'
import { ParentTransform } from '../components/ParentTransform.ts'
import { Position } from '../components/Position.ts'

/**
 * Creates transform matrices for transforming
 *  - from local space --> parent space
 *  - from parent space --> local space
 *
 * The matrices are set in a ParentTransform component.
 */
export class ParentTranformCalculator extends System {
  constructor() {
    super()

    this.registerComponent(ParentEntity)
    this.registerComponent(Position)
    this.registerComponent(Orientation)
  }

  private getLocalToParentTranslation = (position: Vec3): Mat4 => {
    return new Mat4([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      position.data[0],
      position.data[1],
      position.data[2],
      1,
    ])
  }

  private getParentToLocalTranslation = (position: Vec3): Mat4 => {
    return new Mat4([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      -position.data[0],
      -position.data[1],
      -position.data[2],
      1,
    ])
  }

  private getParentTransformMatrices = (
    entity: Entity,
  ): {
    localToParentTransform: Mat4
    parentToLocalTransform: Mat4
  } => {
    try {
      return ParentTransform.getEntityData(entity)
    } catch {
      const localToParentTransform = new Mat4().identity()
      const parentToLocalTransform = new Mat4().identity()

      entity.addComponent(ParentTransform, {
        localToParentTransform,
        parentToLocalTransform,
      })

      return {
        localToParentTransform,
        parentToLocalTransform,
      }
    }
  }

  public calculateParentTransforms() {
    for (const entity of this.getMatchedEntities()) {
      const position = Position.getEntityData(entity.id)
      const orientation = Orientation.getEntityData(entity.id)

      const { localToParentTransform, parentToLocalTransform } = this
        .getParentTransformMatrices(entity)

      localToParentTransform
        .set(eulerOrientationToMatrix(orientation).data)
        .multiply(this.getLocalToParentTranslation(position))

      parentToLocalTransform
        .set(this.getParentToLocalTranslation(position).data)
        .multiply(reverseEulerOrientationToMatrix(orientation))
    }
  }
}
