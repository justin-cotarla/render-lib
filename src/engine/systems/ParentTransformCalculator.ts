import { Entity } from '../../ecs/Entity'
import { System } from '../../ecs/System'
import { Mat4, Mat4ElementTuple } from '../../math/Mat4'
import { Vec3 } from '../../math/Vec3'
import { eulerOrientationToMatrix } from '../../util/matrixTransformations'
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

  private getLocalToParentTranslation = (position: Vec3): Mat4ElementTuple => {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [position[0], position[1], position[2], 1],
    ]
  }

  private getLocalToParentRotation = (
    orientation: Orientation
  ): Mat4ElementTuple => {
    const rotationMatrix = eulerOrientationToMatrix(orientation)

    return [
      [...rotationMatrix[0], 0],
      [...rotationMatrix[1], 0],
      [...rotationMatrix[2], 0],
      [0, 0, 0, 1],
    ]
  }

  private getParentToLocalTranslation = (position: Vec3): Mat4ElementTuple => {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [-position[0], -position[1], -position[2], 1],
    ]
  }

  private getParentToLocalRotation = (
    orientation: Orientation
  ): Mat4ElementTuple => {
    const rotationMatrix = eulerOrientationToMatrix(orientation)

    return [
      [rotationMatrix[0][0], rotationMatrix[1][0], rotationMatrix[2][0], 0],
      [rotationMatrix[0][1], rotationMatrix[1][1], rotationMatrix[2][1], 0],
      [rotationMatrix[0][2], rotationMatrix[1][2], rotationMatrix[2][2], 0],
      [0, 0, 0, 1],
    ]
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
      const localToParentTransform = Mat4.identity()
      const parentToLocalTransform = Mat4.identity()

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
        .set(this.getLocalToParentRotation(orientation))
        .multiply(this.getLocalToParentTranslation(position))

      parentToLocalTransform
        .set(this.getParentToLocalTranslation(position))
        .multiply(this.getParentToLocalRotation(orientation))
    }
  }
}
