import flatCubeModel from '../../../models/flat_cube.obj?raw'
import sphereModel from '../../../models/sphere.obj?raw'
import { WorldInstance } from '../../ecs/World'
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
import { TransformTarget } from '../../engine/components/TransformTarget'
import { Velocity } from '../../engine/components/Velocity'
import { MonoPhongPipeline } from '../../engine/pipelines/monoPhong/MonoPhongPipeline'
import { MonoToonPipeline } from '../../engine/pipelines/monoToon/MonoToonPipeline'
import { Scene3D } from '../../engine/scene/Scene3D'
import { CameraMover } from '../../engine/systems/CameraMover'
import { CanvasResizer } from '../../engine/systems/CanvasResizer'
import { ForceIntegrator } from '../../engine/systems/ForceIntegrator'
import { KeyboardMover } from '../../engine/systems/KeyboardMover'
import { Renderer } from '../../engine/systems/Renderer'
import { loadObj } from '../../loaders/objLoader'
import { Vec3 } from '../../math/Vec3'
import { Vec4 } from '../../math/Vec4'
import { getDevice } from '../../util/window'

const canvas = document.querySelector('#canvas') as HTMLCanvasElement

const start = async () => {
  const device = await getDevice()

  const renderer = Renderer.create(device, canvas)

  const monoPhongPipeline = new MonoPhongPipeline(device)
  const monoToonPipeline = new MonoToonPipeline(device)

  const forceIntegrator = new ForceIntegrator()

  const _canvasResizer = new CanvasResizer(
    canvas,
    device.limits.maxTextureDimension2D
  )
  const _cameraMover = new CameraMover(0.001)
  const _keyboardMover = new KeyboardMover()

  // Scene
  const scene = new Scene3D()

  const player = WorldInstance.createEntity()
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

  const lightEntity = WorldInstance.createEntity()
  lightEntity.addComponent(Position, new Vec3([0, 10, 0]))
  lightEntity.addComponent(Orientation)
  lightEntity.addComponent(Light)

  const phongSphere = WorldInstance.createEntity()
  phongSphere.addComponent(Position, new Vec3([5, 1, 0]))
  phongSphere.addComponent(Orientation)
  phongSphere.addComponent(Material, {
    diffuse: new Vec4([1, 0, 1, 1]),
    specular: new Vec4([1, 1, 1, 1]),
    ambient: new Vec4([1, 0, 1, 1]),
    gloss: 16,
  })
  phongSphere.addComponent(Mesh, loadObj(sphereModel))
  phongSphere.addComponent(monoPhongPipeline.component)

  const toonSphere = WorldInstance.createEntity()
  toonSphere.addComponent(Position, new Vec3([0, 1, 0]))
  toonSphere.addComponent(Orientation)
  toonSphere.addComponent(Material, {
    diffuse: new Vec4([1, 1, 0, 1]),
    specular: new Vec4([1, 1, 1, 1]),
    ambient: new Vec4([1, 1, 0, 1]),
    gloss: 10,
  })
  toonSphere.addComponent(Mesh, loadObj(sphereModel))
  toonSphere.addComponent(monoToonPipeline.component)

  const phongCube = WorldInstance.createEntity()
  phongCube.addComponent(Position, new Vec3([-6, 0, 5]))
  phongCube.addComponent(Orientation)
  phongCube.addComponent(Material, {
    diffuse: new Vec4([1, 0, 0, 1]),
    specular: new Vec4([1, 1, 1, 1]),
    ambient: new Vec4([1, 0, 0, 1]),
    gloss: 10,
  })
  phongCube.addComponent(Mesh, loadObj(flatCubeModel))
  phongCube.addComponent(monoPhongPipeline.component)

  scene.addNodes([player, lightEntity, phongSphere, [toonSphere, [phongCube]]])

  renderer.loadStaticMeshBuffers()

  renderer.render()

  let previousTime: number

  const cycle: FrameRequestCallback = async (time) => {
    const deltaMs = previousTime ? time - previousTime : 0
    previousTime = time

    forceIntegrator.integrate(deltaMs)
    scene.calculateTransforms()

    renderer.render()
    requestAnimationFrame(cycle)
  }

  requestAnimationFrame(cycle)
}

start()
