import { Entity } from '../ecs/Entity'
import { WorldInstance } from '../ecs/World'
import { ChildrenEntities } from './components/ChildrenEntities'
import { ParentEntity } from './components/ParentEntity'
import { SceneRoot } from './components/SceneRoot'
import { LocalTranformCalculator } from './systems/LocalTransformCalculator'
import { ParentTranformCalculator } from './systems/ParentTransformCalculator'
import { RootClipTransformCalculator } from './systems/RootClipTransformCalculator'
import { RootTranformCalculator } from './systems/RootTransformCalculator'

type SceneNode = Entity | [Entity, SceneNode[]]

export class Scene {
  private parentTransformCalculator = new ParentTranformCalculator()
  private rootTransformCalculator = new RootTranformCalculator()
  private localTransformCalculator = new LocalTranformCalculator()
  private rootClipTransformCalculator = new RootClipTransformCalculator()

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

  public calculateTransforms() {
    this.parentTransformCalculator.calculateParentTransforms() // parent --> local; local --> parent
    this.rootTransformCalculator.calculateRootTransforms() // entity --> scene
    this.localTransformCalculator.calculateLocalTransforms() // scene --> entity
    this.rootClipTransformCalculator.calculateRootClipTransforms() // scene --> camera
  }
}
