import { Component } from './Component.ts'

export class DefaultComponent<T> extends Component<T> {
  constructor(
    readonly name: string,
    readonly defaultValue: T,
  ) {
    super(name)
  }

  addToEntity(entityId: number, value?: T): void {
    super.addToEntity(entityId, value ?? this.defaultValue)
  }
}
