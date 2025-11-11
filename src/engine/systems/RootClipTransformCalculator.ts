import { Entity } from '../../ecs/Entity.ts'
import { System } from '../../ecs/System.ts'
import { Mat4 } from '../../math/Mat4.ts'
import { perspectiveCameraToClipMatrix } from '../../util/matrixTransformations.ts'
import { LocalTransform } from '../components/LocalTransform.ts'
import { PerspectiveCamera } from '../components/PerspectiveCamera.ts'
import { RootClipTransform } from '../components/RootClipTransform.ts'

export class RootClipTransformCalculator extends System {
  constructor() {
    super()

    this.registerComponent(PerspectiveCamera)
    this.registerComponent(LocalTransform)
  }

  private getRootClipTransform(entity: Entity): Mat4 {
    try {
      return RootClipTransform.getEntityData(entity)
    } catch {
      const rootClipTransform = new Mat4().identity()

      entity.addComponent(RootClipTransform, rootClipTransform)

      return rootClipTransform
    }
  }

  public calculateRootClipTransforms() {
    for (const entity of this.getMatchedEntities()) {
      const rootClipTransform = this.getRootClipTransform(entity)

      const localTransform = LocalTransform.getEntityData(entity)
      const perspectiveCamera = PerspectiveCamera.getEntityData(entity)

      rootClipTransform
        .set(localTransform.data)
        .multiply(perspectiveCameraToClipMatrix(perspectiveCamera))
        .transpose()
    }
  }
}
