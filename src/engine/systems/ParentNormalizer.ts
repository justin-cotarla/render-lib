import { System } from '../../ecs/System'
import { ChildrenEntities } from '../components/ChildrenEntities'
import { ParentEntity } from '../components/ParentEntity'

export class ParentNormalizer extends System {
  constructor() {
    super()

    this.registerComponent(ChildrenEntities)
  }

  public normalizeParents() {
    for (const parent of this.getMatchedEntities()) {
      ChildrenEntities.getEntityData(parent.id).forEach((childEntity) => {
        childEntity.addComponent(ParentEntity, parent)
      })
    }
  }
}
