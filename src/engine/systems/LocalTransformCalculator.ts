import { System } from '../../ecs/System'
import { LocalTransform } from '../components/LocalTransform'
import { RootTransform } from '../components/RootTransform'
import { TransformTarget } from '../components/TransformTarget'

export class LocalTranformCalculator extends System {
  constructor() {
    super()

    this.registerComponent(TransformTarget)
    this.registerComponent(RootTransform)
  }

  public calculateLocalTransforms() {
    for (const entity of this.getMatchedEntities()) {
      const rootTransform = RootTransform.getEntityData(entity.id)

      entity.addComponent(LocalTransform, rootTransform.inverse())
    }
  }
}
