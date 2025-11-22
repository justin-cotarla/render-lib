import {
  Component,
  ComponentAddEvent,
  ComponentRemoveEvent,
} from './Component.ts'
import { Entity } from './Entity.ts'

export class System {
  private _matchedEntityCount = 0
  private collectedEntitySignalCounts = new Map<number, number>()
  private registeredComponents = new Map<
    Component<unknown>,
    {
      onComponentAdd: (event: ComponentAddEvent) => void
      onComponentRemove: (event: ComponentAddEvent) => void
    }
  >()

  registerComponent(component: Component<unknown>) {
    if (this.registeredComponents.has(component)) {
      throw new Error(`${component} component already registered`)
    }

    const onComponentAdd = (event: ComponentAddEvent) => {
      const entitySignalCount = this.collectedEntitySignalCounts.get(
        event.entityId,
      )

      const newSignalCount = (entitySignalCount ?? 0) + 1

      this.collectedEntitySignalCounts.set(
        event.entityId,
        newSignalCount,
      )

      if (newSignalCount === this.registeredComponents.size) {
        this._matchedEntityCount += 1
      }
    }

    const onComponentRemove = (event: ComponentRemoveEvent) => {
      const entitySignalCount = this.collectedEntitySignalCounts.get(
        event.entityId,
      )

      if (entitySignalCount === undefined) {
        return
      }

      this.collectedEntitySignalCounts.set(
        event.entityId,
        entitySignalCount - 1,
      )

      this._matchedEntityCount -= 1
    }

    this.registeredComponents.set(component, {
      onComponentAdd,
      onComponentRemove,
    })

    component.addEventListener('componentadd', onComponentAdd)
    component.addEventListener('componentremove', onComponentRemove)
  }

  unregisterComponentListener(component: Component<unknown>) {
    const callbacks = this.registeredComponents.get(component)

    if (!callbacks) {
      throw new Error(`${component} store not registered`)
    }

    component.removeEventListener('componentadd', callbacks.onComponentAdd)
    component.removeEventListener(
      'componentremove',
      callbacks.onComponentRemove,
    )

    this.registeredComponents.delete(component)
  }

  /**
   * Returns a list of entities that have all the components registered in the system
   */
  *getMatchedEntities(): Generator<Entity, void, unknown> {
    const registeredComponentCount = this.registeredComponents.size

    for (
      const [entityId, collectedSignals] of this
        .collectedEntitySignalCounts
    ) {
      if (collectedSignals === registeredComponentCount) {
        yield new Entity(entityId)
      }
    }
  }

  protected get matchedEntityCount(): number {
    return this._matchedEntityCount
  }
}
