import { loadObj } from '../loaders/objLoader.ts'
import { Vec3 } from '../math/Vec3.ts'
import { Vec4 } from '../math/Vec4.ts'

import sphereModel from '../../models/sphere.obj' with { type: 'text' }
import { World } from '../ecs/World.ts'
import { PerspectiveCamera } from '../engine/components/PerspectiveCamera.ts'
import { Position } from '../engine/components/Position.ts'
import { Material } from '../engine/components/Material.ts'
import { Mesh } from '../engine/components/Mesh.ts'
import { Renderer } from '../engine/Renderer.ts'
import { Orientation } from '../engine/components/Orientation.ts'
import { TransformTarget } from '../engine/components/TransformTarget.ts'
import { Light } from '../engine/components/Light.ts'
// import { CanvasResizer } from '../../engine/systems/CanvasResizer.ts'
// import { CameraMover } from '../../engine/systems/CameraMover.ts'
// import { MouseControl } from '../../engine/components/MouseControl.ts'
import { Mass } from '../engine/components/Mass.ts'
import { Force } from '../engine/components/Force.ts'
import { LinearImpulse } from '../engine/components/LinearImpulse.ts'
import { Velocity } from '../engine/components/Velocity.ts'
import { ForceIntegrator } from '../engine/systems/ForceIntegrator.ts'
// import { KeyboardControl } from '../../engine/components/KeyboardControl.ts'
// import { KeyboardMover } from '../../engine/systems/KeyboardMover.ts'
import { averageFps } from '../util/fps.ts'
// import { getDevice } from '../../util/window.ts'
import { MonoPhongPipeline } from '../engine/pipelines/monoPhong/MonoPhongPipeline.ts'
import { mainloop } from '@gfx/dwm'
import { createWindowGPU } from '@gfx/dwm/ext/webgpu'
import { Scene } from '../engine/Scene.ts'

const start = async () => {
  const window = await createWindowGPU({
    title: 'Deno Window Manager',
    width: 1024,
    height: 1024,
    resizable: true,
  })

  const device = window.device

  const renderer = Renderer.create(device, window)

  const monoPhongPipeline = new MonoPhongPipeline(device)
  renderer.registerPipeline(monoPhongPipeline)

  const forceIntegrator = new ForceIntegrator()

  // const _canvasResizer = new CanvasResizer(
  //   window,
  //   device.limits.maxTextureDimension2D,
  // )
  // const _cameraMover = new CameraMover(0.001)
  // const _keyboardMover = new KeyboardMover()

  // Scene
  const world = new World()
  const scene = new Scene(world)

  const player = world.createEntity()
  player.addComponent(PerspectiveCamera)
  player.addComponent(Position, new Vec3([0, 0, -30]))
  player.addComponent(Orientation)
  player.addComponent(TransformTarget)
  // player.addComponent(MouseControl)
  player.addComponent(Mass, 1)
  player.addComponent(Force)
  player.addComponent(LinearImpulse)
  player.addComponent(Velocity)
  // player.addComponent(KeyboardControl)

  const lightEntity = world.createEntity()
  lightEntity.addComponent(Position, new Vec3([0, 10, 0]))
  lightEntity.addComponent(Orientation)
  lightEntity.addComponent(Light)

  const meshCount = Deno.args[0] ? parseInt(Deno.args[0], 10) : 100

  const meshEntities = Array.from({ length: meshCount }).map(() =>
    world.createEntity()
  )

  meshEntities.forEach((entity) => {
    const rgb = new Vec4([Math.random(), Math.random(), Math.random(), 1])

    entity.addComponent(
      Position,
      new Vec3([
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20,
      ]),
    )
    entity.addComponent(Orientation)
    entity.addComponent(Material, {
      diffuse: rgb,
      specular: new Vec4([1, 1, 1, 1]),
      ambient: rgb,
      gloss: 16,
    })
    entity.addComponent(Mesh, loadObj(sphereModel))
    monoPhongPipeline.registerEntity(entity)
  })

  scene.addNodes([
    player,
    lightEntity,
    ...meshEntities,
  ])

  renderer.loadStaticMeshBuffers()

  addEventListener('keydown', () => {
    Deno.exit(0)
  })

  let previousTime: number

  mainloop((time) => {
    const deltaMs = previousTime ? time - previousTime : 0
    previousTime = time

    const fps = Math.floor(averageFps((1 / deltaMs) * 1000))

    console.log(`${fps.toString()} FPS`)

    forceIntegrator.integrate(deltaMs)
    scene.calculateTransforms()
    renderer.render()

    window.surface.present()
  })
}

start()
