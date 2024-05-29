import { Component } from './Component'

export class DefaultComponent<T> extends Component<T> {
  constructor(
    readonly name: string,
    readonly defaultValue: T
  ) {
    super(name)
  }

  addToEntity(entityId: number, value?: T): void {
    super.addToEntity(entityId, value ?? this.defaultValue)
  }
}
