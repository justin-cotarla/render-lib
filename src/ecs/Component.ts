import { Tag } from './Tag'

export class Component<T> extends Tag {
  private data: T[] = []
  private entityDataIndexMap: Map<number, number> = new Map()

  addToEntity(entityId: number, value: T): void {
    if (this.entityDataIndexMap.has(entityId)) {
      throw new Error(`Entity ${entityId} already has a ${this.name} component`)
    }

    const index = this.data.push(value) - 1
    this.entityDataIndexMap.set(entityId, index)

    super.addToEntity(entityId)
  }

  updateEntityData(entityId: number, value: T): void {
    const componentIndex = this.entityDataIndexMap.get(entityId)
    if (!componentIndex) {
      throw new Error(
        `Entity ${entityId} does not have a ${this.name} component`
      )
    }

    this.data[componentIndex] = value
  }

  removeFromEntity(entityId: number): void {
    const instanceIndex = this.entityDataIndexMap.get(entityId)

    if (!instanceIndex) {
      throw new Error(
        `Entity ${entityId} does not have a ${this.name} component`
      )
    }

    delete this.data[instanceIndex]
    this.entityDataIndexMap.delete(entityId)
  }

  getEntityData(entityId: number): T {
    const componentIndex = this.entityDataIndexMap.get(entityId)
    if (!componentIndex) {
      throw new Error(
        `Entity ${entityId} does not have a ${this.name} component`
      )
    }

    return this.data[componentIndex]
  }
}
