import { Entity } from '../../ecs/Entity'
import { WorldInstance } from '../../ecs/World'
import { ChildrenEntities } from '../components/ChildrenEntities'
import { ParentEntity } from '../components/ParentEntity'
import { SceneRoot } from '../components/SceneRoot'

type SceneNode = Entity | [Entity, SceneNode[]]

export abstract class Scene {
  private sceneRoot: Entity

  constructor() {
    this.sceneRoot = WorldInstance.createEntity()
    this.sceneRoot.addComponent(SceneRoot)
  }

  public addNodes(nodes: SceneNode[]) {
    this.attachNode([this.sceneRoot, nodes])
  }

  private attachNode(node: SceneNode, parentNode?: Entity): Entity {
    const [entity, childNodes] = Array.isArray(node)
      ? [node[0], node[1]]
      : [node]

    if (parentNode) {
      entity.addComponent(ParentEntity, parentNode)
    }

    const children = childNodes?.map((element) =>
      this.attachNode(element, entity)
    )

    if (children?.length) {
      entity.addComponent(ChildrenEntities, children)
    }

    return entity
  }

  public abstract calculateTransforms(): void
}
