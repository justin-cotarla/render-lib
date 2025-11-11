import { Entity } from '../ecs/Entity.ts'
import { World } from '../ecs/World.ts'
import { ChildrenEntities } from './components/ChildrenEntities.ts'
import { ParentEntity } from './components/ParentEntity.ts'
import { SceneRoot } from './components/SceneRoot.ts'
import { LocalTranformCalculator } from './systems/LocalTransformCalculator.ts'
import { ParentTranformCalculator } from './systems/ParentTransformCalculator.ts'
import { RootClipTransformCalculator } from './systems/RootClipTransformCalculator.ts'
import { RootTranformCalculator } from './systems/RootTransformCalculator.ts'

type SceneNode = Entity | [Entity, SceneNode[]]

export class Scene {
  private parentTransformCalculator = new ParentTranformCalculator()
  private rootTransformCalculator = new RootTranformCalculator()
  private localTransformCalculator = new LocalTranformCalculator()
  private rootClipTransformCalculator = new RootClipTransformCalculator()

  private sceneRoot: Entity

  constructor(world: World) {
    this.sceneRoot = world.createEntity()
    this.sceneRoot.addComponent(SceneRoot)
  }

  public addNodes(nodes: SceneNode[]) {
    this.attachNode(
      [this.sceneRoot, nodes],
    )
  }

  private attachNode(
    node: SceneNode,
    parentNode?: Entity,
  ): Entity {
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
