import { Entity } from './Entity'

export class World {
  entityList: Entity[] = []

  createEntity(): Entity {
    const entity = new Entity(this.entityList.length)
    this.entityList.push(entity)

    return entity
  }

  deleteEntity(entity: Entity): void {
    entity.components.forEach(entity.removeComponent)
    delete this.entityList[entity.id]
  }
}
