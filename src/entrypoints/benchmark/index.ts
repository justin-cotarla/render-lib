import { loadObj } from '../../loaders/objLoader'
import { Vec3 } from '../../math/Vec3'
import { Vec4 } from '../../math/Vec4'

import sphereModel from '../../../models/sphere.obj?raw'
import { World } from '../../ecs/World'
import { PerspectiveCamera } from '../../engine/components/PerspectiveCamera'
import { Position } from '../../engine/components/Position'
import { Material } from '../../engine/components/Material'
import { Mesh } from '../../engine/components/Mesh'
import { ChildrenEntities } from '../../engine/components/ChildrenEntities'
import { Renderer } from '../../engine/systems/Renderer'
import { ParentNormalizer } from '../../engine/systems/ParentNormalizer'
import { Orientation } from '../../engine/components/Orientation'
import { TransformTarget } from '../../engine/components/TransformTarget'
import { PipelineIdentifier } from '../../engine/components/PipelineIdentifier'
import { Light } from '../../engine/components/Light'
import { CanvasResizer } from '../../engine/systems/CanvasResizer'
import { CameraMover } from '../../engine/systems/CameraMover'
import { MouseControl } from '../../engine/components/MouseControl'
import { Mass } from '../../engine/components/Mass'
import { Force } from '../../engine/components/Force'
import { LinearImpulse } from '../../engine/components/LinearImpulse'
import { Velocity } from '../../engine/components/Velocity'
import { ForceIntegrator } from '../../engine/systems/ForceIntegrator'
import { KeyboardControl } from '../../engine/components/KeyboardControl'
import { KeyboardMover } from '../../engine/systems/KeyboardMover'

const canvas = document.querySelector('#canvas') as HTMLCanvasElement

const start = async () => {
  const renderer = await Renderer.create(canvas)
  const forceIntegrator = new ForceIntegrator()

  const _canvasResizer = new CanvasResizer(
    canvas,
    renderer.getDeviceLimits().maxTextureDimension2D
  )
  const _cameraMover = new CameraMover(0.001)
  const _keyboardMover = new KeyboardMover()

  const parentNormalizer = new ParentNormalizer()

  // Scene
  const world = new World()

  const player = world.createEntity()
  player.addComponent(PerspectiveCamera)
  player.addComponent(Position, new Vec3(20, 70, 20))
  player.addComponent(Orientation, {
    bank: 0,
    heading: 0,
    pitch: (Math.PI / 180) * 90,
  })
  player.addComponent(TransformTarget)
  player.addComponent(MouseControl)
  player.addComponent(Mass, 1)
  player.addComponent(Force)
  player.addComponent(LinearImpulse)
  player.addComponent(Velocity)
  player.addComponent(KeyboardControl)

  const lightEntity = world.createEntity()
  lightEntity.addComponent(Position, new Vec3(0, 10, 0))
  lightEntity.addComponent(Orientation)
  lightEntity.addComponent(Light)

  const meshEntities = Array.from({ length: 100 }).map(() =>
    world.createEntity()
  )

  meshEntities.forEach((entity, index) => {
    const rgb = new Vec4(Math.random(), Math.random(), Math.random(), 1)

    entity.addComponent(
      Position,
      new Vec3(Math.floor(index / 10) * 3, 0, (index % 10) * 3)
    )
    entity.addComponent(Orientation)
    entity.addComponent(Material, {
      diffuse: rgb,
      specular: new Vec4(1, 1, 1, 1),
      ambient: rgb,
      gloss: 16,
    })
    entity.addComponent(Mesh, loadObj(sphereModel))
    entity.addComponent(TransformTarget)
    entity.addComponent(PipelineIdentifier, 'MONO_PHONG')
  })

  // Build scene
  const sceneEntity = world.createEntity()

  sceneEntity.addComponent(ChildrenEntities, [
    player,
    lightEntity,
    ...meshEntities,
  ])

  parentNormalizer.normalizeParents()

  renderer.allocateBuffers()
  renderer.loadStaticMeshBuffers()

  renderer.render()

  let previousTime: number

  const cycle: FrameRequestCallback = async (time) => {
    const deltaMs = previousTime ? time - previousTime : 0
    previousTime = time

    forceIntegrator.integrate(deltaMs)
    renderer.render()
    requestAnimationFrame(cycle)
  }

  requestAnimationFrame(cycle)
}

start()
