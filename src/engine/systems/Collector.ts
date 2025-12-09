import { Component, Entity, System } from 'reactive-ecs'

export class Collector extends System {
  constructor(components: Component<unknown>[]) {
    super(components)
  }

  collect(): Entity[] {
    return [...this.getMatchedEntities()]
  }
}
