import { TypedEventTarget } from '../types/TypedEventTarget'

export class ComponentAddEvent extends Event {
  static readonly type = 'componentadd'

  constructor(
    readonly name: string,
    readonly entityId: number
  ) {
    super(ComponentAddEvent.type)
  }
}

export class ComponentRemoveEvent extends Event {
  static readonly type = 'componentremove'

  constructor(
    readonly name: string,
    readonly entityId: number
  ) {
    super(ComponentRemoveEvent.type)
  }
}

export class Component<T = never> extends (EventTarget as TypedEventTarget<{
  [ComponentAddEvent.type]: ComponentAddEvent
  [ComponentRemoveEvent.type]: ComponentRemoveEvent
}>) {
  private entityData: T[] = []

  constructor(readonly name: string) {
    super()
  }

  addToEntity(entityId: number, value: T): void {
    if (!this.entityData[entityId]) {
      this.dispatchEvent(new ComponentAddEvent(this.name, entityId))
    }

    this.entityData[entityId] = value
    console.log(`Added ${this.name} component to entity#${entityId}`)
  }

  updateEntityData(entityId: number, value: T): void {
    if (!this.entityData[entityId]) {
      throw new Error(
        `Entity ${entityId} does not have a ${this.name} component`
      )
    }

    this.entityData[entityId] = value
    console.log(`Updated ${this.name} component data in entity#${entityId}`)
  }

  removeFromEntity(entityId: number): void {
    if (!this.entityData[entityId]) {
      throw new Error(
        `Entity ${entityId} does not have a ${this.name} component`
      )
    }

    delete this.entityData[entityId]
    this.dispatchEvent(new ComponentRemoveEvent(this.name, entityId))
    console.log(`Removed ${this.name} component from entity#${entityId}`)
  }

  getEntityData(entityId: number): T {
    if (!this.entityData[entityId]) {
      throw new Error(
        `Entity ${entityId} does not have a ${this.name} component`
      )
    }

    return this.entityData[entityId]
  }

  printAll(): void {
    this.entityData.forEach((data, index) => {
      console.log({ entity: index, data: `${data}` })
    })
  }
}
