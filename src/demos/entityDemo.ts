import { loadObj } from '../loaders/objLoader'
import { Vec3 } from '../math/Vec3'
import { Vec4 } from '../math/Vec4'

import flatCubeModel from '../../models/flat_cube.obj?raw'
import sphereModel from '../../models/sphere.obj?raw'
import { World } from '../ecs/World'
import { PerspectiveCamera } from '../engine/components/PerspectiveCamera'
import { Position } from '../engine/components/Position'
import { Material } from '../engine/components/Material'
import { Mesh } from '../engine/components/Mesh'
import { ChildrenEntities } from '../engine/components/ChildrenEntities'
import { Renderer } from '../engine/renderer/Renderer'
import { ParentNormalizer } from '../engine/systems/ParentNormalizer'
import { Orientation } from '../engine/components/Orientation'
import { TransformTarget } from '../engine/components/TransformTarget'
import { PipelineIdentifier } from '../engine/components/PipelineIdentifier'
import { Light } from '../engine/components/Light'
import { CanvasResizer } from '../engine/systems/CanvasResizer'
import { CameraMover } from '../engine/systems/CameraMover'
import { PlayerCamera } from '../engine/components/PlayerCamera'

const canvas = document.querySelector('#canvas') as HTMLCanvasElement

export const start = async () => {
  const renderer = await Renderer.create(canvas)
  const { maxTextureDimension2D } = renderer.getDeviceLimits()

  const _canvasResizer = new CanvasResizer(canvas, maxTextureDimension2D)
  const _cameraMover = new CameraMover(0.001)

  const parentNormalizer = new ParentNormalizer()

  // Scene
  const world = new World()

  const cameraEntity = world.createEntity()
  cameraEntity.addComponent(PerspectiveCamera)
  cameraEntity.addComponent(Position, new Vec3(0, 3, -20))
  cameraEntity.addComponent(Orientation)
  // cameraEntity.addComponent(Orientation, { bank: 0, heading: (Math.PI / 180) * 270, pitch: 0 })
  cameraEntity.addComponent(TransformTarget)
  cameraEntity.addComponent(PlayerCamera)

  const lightEntity = world.createEntity()
  lightEntity.addComponent(Position, new Vec3(0, 10, 0))
  lightEntity.addComponent(Orientation)
  lightEntity.addComponent(Light)

  const phongSphere = world.createEntity()
  phongSphere.addComponent(Position, new Vec3(5, 1, 0))
  phongSphere.addComponent(Orientation)
  phongSphere.addComponent(Material, {
    diffuse: new Vec4(1, 1, 0, 1),
    specular: new Vec4(1, 1, 1, 1),
    ambient: new Vec4(1, 1, 0, 1),
    gloss: 16,
  })
  phongSphere.addComponent(Mesh, loadObj(sphereModel))
  phongSphere.addComponent(TransformTarget)
  phongSphere.addComponent(PipelineIdentifier, 'MONO_PHONG')

  const toonSphere = world.createEntity()
  toonSphere.addComponent(Position, new Vec3(-5, 1, 0))
  toonSphere.addComponent(Orientation)
  toonSphere.addComponent(Material, {
    diffuse: new Vec4(1, 1, 0, 1),
    specular: new Vec4(1, 1, 1, 1),
    ambient: new Vec4(1, 1, 0, 1),
    gloss: 10,
  })
  toonSphere.addComponent(Mesh, loadObj(sphereModel))
  toonSphere.addComponent(TransformTarget)
  toonSphere.addComponent(PipelineIdentifier, 'MONO_TOON')

  const phongCube = world.createEntity()
  phongCube.addComponent(Position, new Vec3(-3, 0, 5))
  phongCube.addComponent(Orientation)
  phongCube.addComponent(Material, {
    diffuse: new Vec4(1, 0, 0, 1),
    specular: new Vec4(1, 1, 1, 1),
    ambient: new Vec4(1, 0, 0, 1),
    gloss: 10,
  })
  phongCube.addComponent(Mesh, loadObj(flatCubeModel))
  phongCube.addComponent(TransformTarget)
  phongCube.addComponent(PipelineIdentifier, 'MONO_PHONG')

  // Build scene
  const sceneEntity = world.createEntity()

  sceneEntity.addComponent(ChildrenEntities, [
    cameraEntity,
    lightEntity,
    toonSphere,
    phongSphere,
  ])

  toonSphere.addComponent(ChildrenEntities, [phongCube])

  parentNormalizer.normalizeParents()

  renderer.allocateBuffers()
  renderer.loadStaticMeshBuffers()

  // const engine = new PhysicsEngine()
  // const cameraBody = new Body(camera, 1)
  // engine.registerBody(cameraBody)

  // new KeyboardObserver({
  //   press: {
  //     [DirectionKey.UP]: () => {
  //       cameraBody.linearImpulse.z += 0.01
  //     },
  //     [DirectionKey.DOWN]: () => {
  //       cameraBody.linearImpulse.z -= 0.01
  //     },
  //     [DirectionKey.LEFT]: () => {
  //       cameraBody.linearImpulse.x -= 0.01
  //     },
  //     [DirectionKey.RIGHT]: () => {
  //       cameraBody.linearImpulse.x += 0.01
  //     },
  //   },
  //   release: {
  //     [DirectionKey.UP]: () => {
  //       cameraBody.linearImpulse.z -= 0.01
  //     },
  //     [DirectionKey.DOWN]: () => {
  //       cameraBody.linearImpulse.z += 0.01
  //     },
  //     [DirectionKey.LEFT]: () => {
  //       cameraBody.linearImpulse.x += 0.01
  //     },
  //     [DirectionKey.RIGHT]: () => {
  //       cameraBody.linearImpulse.x -= 0.01
  //     },
  //   },
  // })

  renderer.render()

  let previousTime: number

  const cycle: FrameRequestCallback = async (time) => {
    const _deltaMs = previousTime ? time - previousTime : 0
    previousTime = time

    // engine.update(deltaMs)
    renderer.render()
    requestAnimationFrame(cycle)
  }

  requestAnimationFrame(cycle)
}
