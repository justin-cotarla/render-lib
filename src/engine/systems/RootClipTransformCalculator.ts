import { ComponentData, Entity, System } from 'reactive-ecs'
import { Mat4 } from '../../math/Mat4'
import {
  orthographicCameraToClipMatrix,
  perspectiveCameraToClipMatrix,
} from '../../util/matrixTransformations'
import { LocalTransform } from '../components/LocalTransform'
import { OrthographicCamera } from '../components/OrthographicCamera'
import { PerspectiveCamera } from '../components/PerspectiveCamera'
import { RootClipTransform } from '../components/RootClipTransform'

/**
 * Computes matrices for tranforming from scene space --> clip space
 * in the local space of a camera.
 *
 * The matrices are set in a RootClipTransform component.
 */
export class RootClipTransformCalculator extends System {
  private cameraComponent: typeof PerspectiveCamera | typeof OrthographicCamera

  constructor(
    readonly projectionType: 'perspective' | 'orthographic' = 'perspective'
  ) {
    const cameraComponent =
      projectionType === 'perspective' ? PerspectiveCamera : OrthographicCamera

    super([cameraComponent, LocalTransform])

    this.cameraComponent = cameraComponent
  }

  private getRootClipTransform(entity: Entity): Mat4 {
    if (RootClipTransform.hasEntity(entity)) {
      return RootClipTransform.getEntityData(entity)
    }

    const rootClipTransform = new Mat4().identity()

    entity.addComponent(RootClipTransform, rootClipTransform)

    return rootClipTransform
  }

  public calculateRootClipTransforms() {
    for (const entity of this.getMatchedEntities()) {
      const rootClipTransform = this.getRootClipTransform(entity)

      const localTransform = LocalTransform.getEntityData(entity)
      const camera = this.cameraComponent.getEntityData(entity)

      rootClipTransform.set(localTransform.data)

      rootClipTransform.multiply(
        this.projectionType === 'perspective'
          ? perspectiveCameraToClipMatrix(
              camera as ComponentData<typeof PerspectiveCamera>
            )
          : orthographicCameraToClipMatrix(
              camera as ComponentData<typeof OrthographicCamera>
            )
      )

      rootClipTransform.transpose()
    }
  }
}
