import { RigidNode } from './nodes/RigidNode'

type Constructor<T> = abstract new (...args: never[]) => T

export class Scene {
  public rootNode = new RigidNode()

  public filterNodes = <T>(
    filter: Constructor<T>,
    node = this.rootNode
  ): T[] => {
    if (!node.children.length) {
      return node instanceof filter ? [node] : []
    }
    return node.children.map((node) => this.filterNodes(filter, node)).flat()
  }
}
