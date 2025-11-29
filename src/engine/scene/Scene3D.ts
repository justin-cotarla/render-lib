import { LocalTranformCalculator } from '../systems/LocalTransformCalculator'
import { ParentTranformCalculator } from '../systems/ParentTransformCalculator'
import { RootClipTransformCalculator } from '../systems/RootClipTransformCalculator'
import { RootTranformCalculator } from '../systems/RootTransformCalculator'
import { Scene } from './Scene'

export class Scene3D extends Scene {
  private parentTransformCalculator
  private rootTransformCalculator
  private localTransformCalculator
  private rootClipTransformCalculator

  constructor() {
    const parentTransformCalculator = new ParentTranformCalculator()
    const rootTransformCalculator = new RootTranformCalculator()
    const localTransformCalculator = new LocalTranformCalculator()
    const rootClipTransformCalculator = new RootClipTransformCalculator()

    super()

    this.parentTransformCalculator = parentTransformCalculator
    this.rootTransformCalculator = rootTransformCalculator
    this.localTransformCalculator = localTransformCalculator
    this.rootClipTransformCalculator = rootClipTransformCalculator
  }

  public calculateTransforms() {
    this.parentTransformCalculator.calculateParentTransforms() // parent --> local; local --> parent
    this.rootTransformCalculator.calculateRootTransforms() // entity --> scene
    this.localTransformCalculator.calculateLocalTransforms() // scene --> entity
    this.rootClipTransformCalculator.calculateRootClipTransforms() // scene --> camera
  }
}
