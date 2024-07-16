import { Component } from './Component'
import { DefaultComponent } from './DefaultComponent'

export class Entity {
  components = new Set<Component<unknown>>()

  constructor(readonly id: number) {}

  addComponent<T extends never>(component: Component<T>): void
  addComponent<T, V extends T>(component: Component<T>, value: V): void
  addComponent<T, V extends T>(component: DefaultComponent<T>, value?: V): void
  addComponent<T, V extends T, C extends DefaultComponent<T> | Component<T>>(
    component: C,
    ...[value]: C extends Component<T> ? [value: V] : [value?: V]
  ): void {
    component.addToEntity(this.id, value)

    this.components.add(component)
  }

  updateComponent<T>(component: Component<T>, value: T) {
    component.updateEntityData(this.id, value)
  }

  removeComponent(component: Component<unknown>) {
    component.removeFromEntity(this.id)

    this.components.delete(component)
  }
}
