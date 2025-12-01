import { loadObj } from '../../loaders/objLoader'
import { Vec3 } from '../../math/Vec3'
import { Vec4 } from '../../math/Vec4'

import sphereModel from '../../../models/sphere.obj?raw'
import { Force } from '../../engine/components/Force'
import { KeyboardControl } from '../../engine/components/KeyboardControl'
import { Light } from '../../engine/components/Light'
import { LinearImpulse } from '../../engine/components/LinearImpulse'
import { Mass } from '../../engine/components/Mass'
import { Material } from '../../engine/components/Material'
import { Mesh } from '../../engine/components/Mesh'
import { MouseControl } from '../../engine/components/MouseControl'
import { Orientation } from '../../engine/components/Orientation'
import { PerspectiveCamera } from '../../engine/components/PerspectiveCamera'
import { Position } from '../../engine/components/Position'
import { SceneRoot } from '../../engine/components/SceneRoot'
import { TransformTarget } from '../../engine/components/TransformTarget'
import { Velocity } from '../../engine/components/Velocity'
import { MonoPhongPipeline } from '../../engine/pipelines/monoPhong/MonoPhongPipeline'
import { CameraMover } from '../../engine/systems/CameraMover'
import { CanvasResizer } from '../../engine/systems/CanvasResizer'
import { ForceIntegrator } from '../../engine/systems/ForceIntegrator'
import { KeyboardMover } from '../../engine/systems/KeyboardMover'
import { Renderer } from '../../engine/systems/Renderer'
import { averageFps } from '../../util/fps'
import { getDevice } from '../../util/window'
import { WorldInstance } from '../../ecs/World'
import { Scene } from '../../engine/Scene'

const canvas = document.querySelector('#canvas') as HTMLCanvasElement
const statsDiv = document.querySelector('#stats') as HTMLDivElement

const start = async () => {
  const device = await getDevice()

  const renderer = await Renderer.create(device, canvas)

  const monoPhongPipeline = new MonoPhongPipeline(device)

  const forceIntegrator = new ForceIntegrator()

  const _canvasResizer = new CanvasResizer(
    canvas,
    device.limits.maxTextureDimension2D
  )
  const _cameraMover = new CameraMover(0.001)
  const _keyboardMover = new KeyboardMover()

  // Scene
  const scene = new Scene()

  const player = WorldInstance.createEntity()
  player.addComponent(PerspectiveCamera)
  player.addComponent(Position, new Vec3([0, 0, -30]))
  player.addComponent(Orientation)
  player.addComponent(TransformTarget)
  player.addComponent(MouseControl)
  player.addComponent(Mass, 1)
  player.addComponent(Force)
  player.addComponent(LinearImpulse)
  player.addComponent(Velocity)
  player.addComponent(KeyboardControl)

  const lightEntity = WorldInstance.createEntity()
  lightEntity.addComponent(Position, new Vec3([0, 10, 0]))
  lightEntity.addComponent(Orientation)
  lightEntity.addComponent(Light)

  const meshCount = import.meta.env.VITE_BENCHMARK_COUNT
    ? parseInt(import.meta.env.VITE_BENCHMARK_COUNT, 10)
    : 100

  const meshEntities = Array.from({ length: meshCount }).map(() =>
    WorldInstance.createEntity()
  )

  meshEntities.forEach((entity) => {
    const rgb = new Vec4([Math.random(), Math.random(), Math.random(), 1])

    entity.addComponent(
      Position,
      new Vec3([
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20,
      ])
    )
    entity.addComponent(Orientation)
    entity.addComponent(Material, {
      diffuse: rgb,
      specular: new Vec4([1, 1, 1, 1]),
      ambient: rgb,
      gloss: 16,
    })
    entity.addComponent(Mesh, loadObj(sphereModel))
    entity.addComponent(monoPhongPipeline.component)
  })

  // Build scene
  const sceneEntity = WorldInstance.createEntity()
  sceneEntity.addComponent(SceneRoot)

  scene.addNodes([player, lightEntity, ...meshEntities])

  renderer.loadStaticMeshBuffers()

  renderer.render()

  let previousTime: number

  const cycle: FrameRequestCallback = async (time) => {
    const deltaMs = previousTime ? time - previousTime : 0
    previousTime = time

    const fps = Math.floor(averageFps((1 / deltaMs) * 1000))

    statsDiv.textContent = `${fps.toString()} FPS`

    forceIntegrator.integrate(deltaMs)
    scene.calculateSceneTransforms()
    renderer.render()
    requestAnimationFrame(cycle)
  }

  requestAnimationFrame(cycle)
}

start()
