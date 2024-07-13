import { Component, ComponentAddEvent, ComponentRemoveEvent } from './Component'

export class System {
  collectedEntitySignalCounts = new Map<number, number>()
  registeredComponents = new Map<
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
        event.entityId
      )

      if (entitySignalCount === undefined) {
        this.collectedEntitySignalCounts.set(event.entityId, 1)
        return
      }

      this.collectedEntitySignalCounts.set(
        event.entityId,
        entitySignalCount + 1
      )
    }

    const onComponentRemove = (event: ComponentRemoveEvent) => {
      const entitySignalCount = this.collectedEntitySignalCounts.get(
        event.entityId
      )

      if (entitySignalCount === undefined) {
        return
      }

      this.collectedEntitySignalCounts.set(
        event.entityId,
        entitySignalCount - 1
      )
    }

    this.registeredComponents.set(component, {
      onComponentAdd,
      onComponentRemove,
    })

    component.addEventListener('componentadd', onComponentAdd)
    component.addEventListener('componentremove', onComponentRemove)
  }

  removeComponentListener(component: Component<unknown>) {
    const callbacks = this.registeredComponents.get(component)

    if (!callbacks) {
      throw new Error(`${component} store not registered`)
    }

    component.removeEventListener('componentadd', callbacks.onComponentAdd)
    component.removeEventListener(
      'componentremove',
      callbacks.onComponentRemove
    )

    this.registeredComponents.delete(component)
  }

  /**
   * Returns a list of entities that have all the components registered in the system
   */
  *getMatchedEntities() {
    const registeredComponentCount = this.registeredComponents.values.length

    for (const [entity, collectedSignals] of this.collectedEntitySignalCounts) {
      if (collectedSignals === registeredComponentCount) {
        yield entity
      }
    }
  }
}
