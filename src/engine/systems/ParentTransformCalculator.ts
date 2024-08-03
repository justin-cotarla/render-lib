import { System } from '../../ecs/System'
import { Mat4 } from '../../math/Mat4'
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

  private getLocalToParentTranslation = (position: Vec3): Mat4 => {
    return new Mat4([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [position[0], position[1], position[2], 1],
    ])
  }

  private getLocalToParentRotation = (orientation: Orientation): Mat4 => {
    const rotationMatrix = eulerOrientationToMatrix(orientation)

    return new Mat4([
      [...rotationMatrix[0], 0],
      [...rotationMatrix[1], 0],
      [...rotationMatrix[2], 0],
      [0, 0, 0, 1],
    ])
  }

  private getParentToLocalTranslation = (position: Vec3): Mat4 => {
    return new Mat4([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [-position[0], -position[1], -position[2], 1],
    ])
  }

  private getParentToLocalRotation = (orientation: Orientation): Mat4 => {
    return this.getLocalToParentRotation(orientation).transpose()
  }

  public calculateParentTransforms() {
    for (const entity of this.getMatchedEntities()) {
      const position = Position.getEntityData(entity.id)
      const orientation = Orientation.getEntityData(entity.id)

      const localToParentTransform = this.getLocalToParentRotation(
        orientation
      ).multiply(this.getLocalToParentTranslation(position))

      const parentToLocalTransform = this.getParentToLocalTranslation(
        position
      ).multiply(this.getParentToLocalRotation(orientation))

      entity.addComponent(ParentTransform, {
        localToParentTransform,
        parentToLocalTransform,
      })
    }
  }
}
