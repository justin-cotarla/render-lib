import { loadObj } from '../loaders/objLoader'
import { Vec3 } from '../math/Vec3'
import { Vec4 } from '../math/Vec4'

import flatCubeModel from '../../models/flat_cube.obj?raw'
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
  lightEntity.addComponent(Position, new Vec3(20, 20, -10))
  lightEntity.addComponent(Orientation)
  lightEntity.addComponent(Light)

  const cubeEntity = world.createEntity()
  cubeEntity.addComponent(Position, new Vec3(-5, 1, 0))
  cubeEntity.addComponent(Orientation)
  cubeEntity.addComponent(Material, {
    diffuse: new Vec4(1, 1, 0, 1),
    specular: new Vec4(0, 0, 0, 0),
    ambient: new Vec4(0, 1, 0, 1),
    gloss: 16,
  })
  cubeEntity.addComponent(Mesh, loadObj(flatCubeModel))
  cubeEntity.addComponent(TransformTarget)
  cubeEntity.addComponent(PipelineIdentifier, 'MONO_PHONG')

  // Build scene
  const sceneEntity = world.createEntity()

  sceneEntity.addComponent(ChildrenEntities, [
    cameraEntity,
    lightEntity,
    cubeEntity,
  ])

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
