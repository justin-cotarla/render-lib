import { loadObj } from '../loaders/objLoader.ts'
import { Vec3 } from '../math/Vec3.ts'
import { Vec4 } from '../math/Vec4.ts'

import flatCubeModel from '../../models/flat_cube.obj' with { type: 'text' }
import sphereModel from '../../models/sphere.obj' with { type: 'text' }
import { World } from '../ecs/World.ts'
import { PerspectiveCamera } from '../engine/components/PerspectiveCamera.ts'
import { Position } from '../engine/components/Position.ts'
import { Material } from '../engine/components/Material.ts'
import { Mesh } from '../engine/components/Mesh.ts'
import { ChildrenEntities } from '../engine/components/ChildrenEntities.ts'
import { Renderer } from '../engine/Renderer.ts'
import { ParentNormalizer } from '../engine/systems/ParentNormalizer.ts'
import { Orientation } from '../engine/components/Orientation.ts'
import { TransformTarget } from '../engine/components/TransformTarget.ts'
import { Light } from '../engine/components/Light.ts'
// import { MouseControl } from '../../engine/components/MouseControl.ts'
import { Mass } from '../engine/components/Mass.ts'
import { Force } from '../engine/components/Force.ts'
import { LinearImpulse } from '../engine/components/LinearImpulse.ts'
import { Velocity } from '../engine/components/Velocity.ts'
import { ForceIntegrator } from '../engine/systems/ForceIntegrator.ts'
import { KeyboardControl } from '../engine/components/KeyboardControl.ts'
import { KeyboardMover } from '../engine/systems/KeyboardMover.ts'
import { MonoToonPipeline } from '../engine/pipelines/monoToon/MonoToonPipeline.ts'
import { MonoPhongPipeline } from '../engine/pipelines/monoPhong/MonoPhongPipeline.ts'
import { SceneRoot } from '../engine/components/SceneRoot.ts'
import { createWindowGPU, mainloop } from '@gfx/dwm/ext/webgpu'

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
  const monoToonPipeline = new MonoToonPipeline(device)
  renderer.registerPipeline(monoPhongPipeline)
  renderer.registerPipeline(monoToonPipeline)

  const forceIntegrator = new ForceIntegrator()

  // const _canvasResizer = new CanvasResizer(
  //   window,
  //   device.limits.maxTextureDimension2D
  // )
  // const _cameraMover = new CameraMover(0.001)
  // const _keyboardMover = new KeyboardMover()

  const parentNormalizer = new ParentNormalizer()

  // Scene
  const world = new World()

  const player = world.createEntity()
  player.addComponent(PerspectiveCamera)
  player.addComponent(Position, new Vec3([0, 3, -20]))
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

  const phongSphere = world.createEntity()
  phongSphere.addComponent(Position, new Vec3([5, 1, 0]))
  phongSphere.addComponent(Orientation)
  phongSphere.addComponent(Material, {
    diffuse: new Vec4([1, 1, 0, 1]),
    specular: new Vec4([1, 1, 1, 1]),
    ambient: new Vec4([1, 1, 0, 1]),
    gloss: 16,
  })
  phongSphere.addComponent(Mesh, loadObj(sphereModel))
  monoPhongPipeline.registerEntity(phongSphere)

  const toonSphere = world.createEntity()
  toonSphere.addComponent(Position, new Vec3([-5, 1, 0]))
  toonSphere.addComponent(Orientation)
  toonSphere.addComponent(Material, {
    diffuse: new Vec4([1, 1, 0, 1]),
    specular: new Vec4([1, 1, 1, 1]),
    ambient: new Vec4([1, 1, 0, 1]),
    gloss: 10,
  })
  toonSphere.addComponent(Mesh, loadObj(sphereModel))
  monoToonPipeline.registerEntity(toonSphere)

  const phongCube = world.createEntity()
  phongCube.addComponent(Position, new Vec3([-3, 0, 5]))
  phongCube.addComponent(Orientation)
  phongCube.addComponent(Material, {
    diffuse: new Vec4([1, 0, 0, 1]),
    specular: new Vec4([1, 1, 1, 1]),
    ambient: new Vec4([1, 0, 0, 1]),
    gloss: 10,
  })
  phongCube.addComponent(Mesh, loadObj(flatCubeModel))
  monoPhongPipeline.registerEntity(phongCube)

  // Build scene
  const sceneEntity = world.createEntity()
  sceneEntity.addComponent(SceneRoot)

  sceneEntity.addComponent(ChildrenEntities, [
    player,
    lightEntity,
    toonSphere,
    phongSphere,
    phongCube,
  ])

  toonSphere.addComponent(ChildrenEntities, [phongCube])

  parentNormalizer.normalizeParents()

  renderer.loadStaticMeshBuffers()

  let previousTime: number

  addEventListener('keydown', () => {
    Deno.exit(0)
  })

  mainloop((time) => {
    const deltaMs = previousTime ? time - previousTime : 0
    previousTime = time

    forceIntegrator.integrate(deltaMs)
    renderer.render()

    window.surface.present()
  })
}

start()
