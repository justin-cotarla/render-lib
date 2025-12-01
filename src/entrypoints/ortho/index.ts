import sphereModel from '../../../models/sphere.obj?raw'
import { WorldInstance } from '../../ecs/World'
import { Light } from '../../engine/components/Light'
import { Material } from '../../engine/components/Material'
import { Mesh } from '../../engine/components/Mesh'
import { Orientation } from '../../engine/components/Orientation'
import { OrthographicCamera } from '../../engine/components/OrthographicCamera'
import { Position } from '../../engine/components/Position'
import { TransformTarget } from '../../engine/components/TransformTarget'
import { MonoPhongPipeline } from '../../engine/pipelines/monoPhong/MonoPhongPipeline'
import { Scene } from '../../engine/Scene'
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

  const forceIntegrator = new ForceIntegrator()

  const _canvasResizer = new CanvasResizer(
    canvas,
    device.limits.maxTextureDimension2D
  )
  const _cameraMover = new CameraMover(0.001)
  const _keyboardMover = new KeyboardMover()

  // Scene
  const scene = new Scene('orthographic')

  const camera = WorldInstance.createEntity()
  camera.addComponent(OrthographicCamera)
  camera.addComponent(Position, new Vec3([0, 0, -10]))
  camera.addComponent(Orientation)
  camera.addComponent(TransformTarget)

  const lightEntity = WorldInstance.createEntity()
  lightEntity.addComponent(Position, new Vec3([1, 10, -10]))
  lightEntity.addComponent(Orientation)
  lightEntity.addComponent(Light)

  const phongSphere = WorldInstance.createEntity()
  phongSphere.addComponent(Position, new Vec3([0, 0, 0]))
  phongSphere.addComponent(Orientation)
  phongSphere.addComponent(Material, {
    diffuse: new Vec4([1, 0, 1, 1]),
    specular: new Vec4([1, 1, 1, 1]),
    ambient: new Vec4([1, 0, 1, 1]),
    gloss: 16,
  })
  phongSphere.addComponent(Mesh, loadObj(sphereModel))
  phongSphere.addComponent(monoPhongPipeline.component)

  scene.addNodes([camera, lightEntity, phongSphere])

  renderer.loadStaticMeshBuffers()

  renderer.render()

  let previousTime: number

  const cycle: FrameRequestCallback = async (time) => {
    const deltaMs = previousTime ? time - previousTime : 0
    previousTime = time

    forceIntegrator.integrate(deltaMs)
    scene.calculateSceneTransforms()

    renderer.render()
    requestAnimationFrame(cycle)
  }

  requestAnimationFrame(cycle)
}

start()
