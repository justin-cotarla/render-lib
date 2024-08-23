import { loadObj } from '../../loaders/objLoader'
import { Vec3 } from '../../math/Vec3'
import { Vec4 } from '../../math/Vec4'

import flatCubeModel from '../../../models/flat_cube.obj?raw'
import sphereModel from '../../../models/sphere.obj?raw'
import { World } from '../../ecs/World'
import { PerspectiveCamera } from '../../engine/components/PerspectiveCamera'
import { Position } from '../../engine/components/Position'
import { Material } from '../../engine/components/Material'
import { Mesh } from '../../engine/components/Mesh'
import { ChildrenEntities } from '../../engine/components/ChildrenEntities'
import { Renderer } from '../../engine/Renderer'
import { ParentNormalizer } from '../../engine/systems/ParentNormalizer'
import { Orientation } from '../../engine/components/Orientation'
import { TransformTarget } from '../../engine/components/TransformTarget'
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
import { getDevice } from '../../util/window'
import { MonoToonPipeline } from '../../engine/pipelines/monoToon/MonoToonPipeline'
import { MonoPhongPipeline } from '../../engine/pipelines/monoPhong/MonoPhongPipeline'

const canvas = document.querySelector('#canvas') as HTMLCanvasElement

const start = async () => {
  const device = await getDevice()

  const renderer = await Renderer.create(device, canvas)

  const monoPhongPipeline = new MonoPhongPipeline(device)
  const monoToonPipeline = new MonoToonPipeline(device)
  renderer.registerPipeline(monoPhongPipeline)
  renderer.registerPipeline(monoToonPipeline)

  const forceIntegrator = new ForceIntegrator()

  const _canvasResizer = new CanvasResizer(
    canvas,
    device.limits.maxTextureDimension2D
  )
  const _cameraMover = new CameraMover(0.001)
  const _keyboardMover = new KeyboardMover()

  const parentNormalizer = new ParentNormalizer()

  // Scene
  const world = new World()

  const player = world.createEntity()
  player.addComponent(PerspectiveCamera)
  player.addComponent(Position, new Vec3([0, 3, -20]))
  player.addComponent(Orientation)
  player.addComponent(TransformTarget)
  player.addComponent(MouseControl)
  player.addComponent(Mass, 1)
  player.addComponent(Force)
  player.addComponent(LinearImpulse)
  player.addComponent(Velocity)
  player.addComponent(KeyboardControl)

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
  phongSphere.addComponent(TransformTarget)
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
  toonSphere.addComponent(TransformTarget)
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
  phongCube.addComponent(TransformTarget)
  monoPhongPipeline.registerEntity(phongCube)

  // Build scene
  const sceneEntity = world.createEntity()

  sceneEntity.addComponent(ChildrenEntities, [
    player,
    lightEntity,
    toonSphere,
    phongSphere,
  ])

  toonSphere.addComponent(ChildrenEntities, [phongCube])

  parentNormalizer.normalizeParents()

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
