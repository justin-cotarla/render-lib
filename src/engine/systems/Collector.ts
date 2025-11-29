import { Component } from '../../ecs/Component'
import { Entity } from '../../ecs/Entity'
import { System } from '../../ecs/System'

export class Collector extends System {
  constructor(components: Component<unknown>[]) {
    super()

    components.forEach((component) => {
      this.registerComponent(component)
    })
  }

  collect(): Entity[] {
    return [...this.getMatchedEntities()]
  }
}
