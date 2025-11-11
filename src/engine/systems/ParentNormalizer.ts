import { System } from '../../ecs/System.ts'
import { ChildrenEntities } from '../components/ChildrenEntities.ts'
import { ParentEntity } from '../components/ParentEntity.ts'

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
