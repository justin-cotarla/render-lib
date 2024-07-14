import { TypedEventTarget } from '../types/TypedEventTarget'

export class ComponentAddEvent extends Event {
  static readonly type = 'componentadd'

  constructor(
    readonly componentName: string,
    readonly entityId: number
  ) {
    super(ComponentAddEvent.type)
  }
}

export class ComponentRemoveEvent extends Event {
  static readonly type = 'componentremove'

  constructor(
    readonly componentName: string,
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
    if (this.entityData[entityId]) {
      throw new Error(`Entity ${entityId} already has a ${this.name} component`)
    }

    this.entityData[entityId] = value
  }

  updateEntityData(entityId: number, value: T): void {
    if (!this.entityData[entityId]) {
      throw new Error(
        `Entity ${entityId} does not have a ${this.name} component`
      )
    }

    this.entityData[entityId] = value
  }

  removeFromEntity(entityId: number): void {
    if (!this.entityData[entityId]) {
      throw new Error(
        `Entity ${entityId} does not have a ${this.name} component`
      )
    }

    delete this.entityData[entityId]
  }

  getEntityData(entityId: number): T {
    if (!this.entityData[entityId]) {
      throw new Error(
        `Entity ${entityId} does not have a ${this.name} component`
      )
    }

    return this.entityData[entityId]
  }
}
