import { Entity } from '../../ecs/Entity'
import { System } from '../../ecs/System'
import { Mat4 } from '../../math/Mat4'
import { Vec3 } from '../../math/Vec3'
import {
  eulerOrientationToMatrix,
  reverseEulerOrientationToMatrix,
} from '../../util/matrixTransformations'
import { Orientation } from '../components/Orientation'
import { ParentEntity } from '../components/ParentEntity'
import { ParentTransform } from '../components/ParentTransform'
import { Position } from '../components/Position'

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
    entity: Entity
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

      const { localToParentTransform, parentToLocalTransform } =
        this.getParentTransformMatrices(entity)

      localToParentTransform
        .set(eulerOrientationToMatrix(orientation).data)
        .multiply(this.getLocalToParentTranslation(position))

      parentToLocalTransform
        .set(this.getParentToLocalTranslation(position).data)
        .multiply(reverseEulerOrientationToMatrix(orientation))
    }
  }
}
