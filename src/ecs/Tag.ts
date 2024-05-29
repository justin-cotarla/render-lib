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

interface EventMap {
  [ComponentAddEvent.type]: ComponentAddEvent
  [ComponentRemoveEvent.type]: ComponentRemoveEvent
}

export class Tag extends (EventTarget as TypedEventTarget<EventMap>) {
  constructor(readonly name: string) {
    super()
  }

  addToEntity(entityId: number, ..._args: unknown[]): void {
    this.dispatchEvent(new ComponentAddEvent(this.name, entityId))
  }

  removeFromEntity(entityId: number): void {
    this.dispatchEvent(new ComponentRemoveEvent(this.name, entityId))
  }
}
