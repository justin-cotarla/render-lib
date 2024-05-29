import {
  ComponentAddEvent,
  ComponentRemoveEvent,
  Component,
} from './Component'

export class System {
  collectedEntities = new Map<number, number>()
  componentListeners = new Map<
    Component<unknown>,
    {
      onComponentAdd: (event: ComponentAddEvent) => void,
      onComponentRemove: (event: ComponentAddEvent) => void
    }
  >()

  addComponentListener(component: Component<unknown>) {
    if (this.componentListeners.has(component)) {
      throw new Error(`${component} store already registered`)
    }

    const onComponentAdd = (event: ComponentAddEvent) => {
      const entityComponentCount = this.collectedEntities.get(event.entityId)

      if (entityComponentCount === undefined) {
        this.collectedEntities.set(event.entityId, 1)
        return
      }

      this.collectedEntities.set(event.entityId, entityComponentCount + 1)
    }

    const onComponentRemove = (event: ComponentRemoveEvent) => {
      const entityComponentCount = this.collectedEntities.get(event.entityId)

      if (entityComponentCount === undefined) {
        return
      }

      this.collectedEntities.set(event.entityId, entityComponentCount - 1)
    }

    this.componentListeners.set(component, {
      onComponentAdd,
      onComponentRemove,
    })

    component.addEventListener('componentadd', onComponentAdd)
    component.addEventListener('componentremove', onComponentRemove)
  }

  removeComponentListener(store: Component<unknown>) {
    const callbacks = this.componentListeners.get(store)

    if (!callbacks) {
      throw new Error(`${store} store not registered`)
    }

    store.removeEventListener('componentadd', callbacks.onComponentAdd)
    store.removeEventListener('componentremove', callbacks.onComponentRemove)

    this.componentListeners.delete(store)
  }

  *getMatchedEntities() {
    const targetComponentCount = this.componentListeners.values.length

    for (const [entity, count] of this.collectedEntities) {
      if (count === targetComponentCount) {
        yield entity
      }
    }
  }
}
