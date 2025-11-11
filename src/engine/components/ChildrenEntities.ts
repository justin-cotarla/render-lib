import { DefaultComponent } from '../../ecs/DefaultComponent.ts'
import { Entity } from '../../ecs/Entity.ts'

export const ChildrenEntities = new DefaultComponent<Entity[]>(
  'CHILDREN_ENTITIES',
  [],
)
