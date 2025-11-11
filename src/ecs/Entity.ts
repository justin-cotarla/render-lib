import { Component } from './Component.ts'
import { DefaultComponent } from './DefaultComponent.ts'

export class Entity {
  constructor(readonly id: number) {}

  addComponent<T extends never>(component: Component<T>): void
  addComponent<T, V extends T>(component: Component<T>, value: V): void
  addComponent<T, V extends T>(component: DefaultComponent<T>, value?: V): void
  addComponent<T, V extends T, C extends DefaultComponent<T> | Component<T>>(
    component: C,
    ...[value]: C extends Component<T> ? [value: V] : [value?: V]
  ): void {
    component.addToEntity(this.id, value)
  }

  updateComponent<T>(component: Component<T>, value: T) {
    component.updateEntityData(this.id, value)
  }

  removeComponent(component: Component<unknown>) {
    component.removeFromEntity(this.id)
  }
}
