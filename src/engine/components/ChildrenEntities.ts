import { DefaultComponent } from '../../ecs/DefaultComponent'
import { Entity } from '../../ecs/Entity'

export const ChildrenEntities = new DefaultComponent<Entity[]>(
  'CHILDREN_ENTITIES',
  []
)
