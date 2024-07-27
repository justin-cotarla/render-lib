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

  private getParentTranslation = (position: Vec3): Mat4 => {
    return new Mat4([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [...position.clone().toArray(), 1],
    ])
  }

  private getParentRotation = (orientation: Orientation): Mat4 => {
    const rotationMatrix = eulerOrientationToMatrix(orientation)

    return new Mat4([
      [...rotationMatrix[0], 0],
      [...rotationMatrix[1], 0],
      [...rotationMatrix[2], 0],
      [0, 0, 0, 1],
    ])
  }

  public calculateParentTransforms() {
    for (const entity of this.getMatchedEntities()) {
      const position = Position.getEntityData(entity.id)
      const orientation = Orientation.getEntityData(entity.id)

      entity.addComponent(
        ParentTransform,
        this.getParentRotation(orientation).multiply(
          this.getParentTranslation(position)
        )
      )
    }
  }
}
