import { Renderer } from '../engine/Renderer'
import { KeyboardObserver, DirectionKey } from '../input/KeyboardObserver'
import { MouseObserver } from '../input/MouseObserver'
import { parseObj } from '../loaders/parseObj'
import { Vec3 } from '../math/Vec3'
import { Vec4 } from '../math/Vec4'
import { Body } from '../engine/physics/Body'
import { PhysicsEngine } from '../engine/physics/PhysicsEngine'
import { setupResizeObserver } from '../util/window'

import flatCubeModel from '../../models/flat_cube.obj?raw'
import { Scene } from '../engine/Scene'
import { World } from '../ecs/World'
import { PerspectiveCamera } from '../engine/components/PerspectiveCamera'
import { Position } from '../engine/components/Position'
import { Material } from '../engine/components/Material'
import { Mesh } from '../engine/components/Mesh'
import { MonoPhongTag } from '../engine/tags/MonoPhongFrag'

const canvas = document.querySelector('#canvas') as HTMLCanvasElement

export const start = async () => {
  const renderer = await Renderer.create(canvas)

  const scene = new Scene()

  const world = new World()

  const cameraEntity = world.createEntity()
  cameraEntity.addComponent(PerspectiveCamera)

  const lightEntity = world.createEntity()
  lightEntity.addComponent(Position, new Vec3(20, 20, -10))

  const cubeEntity = world.createEntity()
  cubeEntity.addComponent(Position, new Vec3(-5, 1, 0))
  cubeEntity.addComponent(Material, {
    diffuse: new Vec4(0, 1, 0, 1),
    specular: new Vec4(0, 0, 0, 0),
    ambient: new Vec4(0, 1, 0, 1),
    gloss: 16,
  })
  cubeEntity.addComponent(Mesh, parseObj(flatCubeModel))
  cubeEntity.addComponent(MonoPhongTag)

  scene.rootNode.addChild(plane)
  scene.rootNode.addChild(c1)
  scene.rootNode.addChild(c2)
  scene.rootNode.addChild(camera)
  scene.rootNode.addChild(light)

  renderer.loadScene(scene)

  const engine = new PhysicsEngine()
  const cameraBody = new Body(camera, 1)
  engine.registerBody(cameraBody)

  new KeyboardObserver({
    press: {
      [DirectionKey.UP]: () => {
        cameraBody.linearImpulse.z += 0.01
      },
      [DirectionKey.DOWN]: () => {
        cameraBody.linearImpulse.z -= 0.01
      },
      [DirectionKey.LEFT]: () => {
        cameraBody.linearImpulse.x -= 0.01
      },
      [DirectionKey.RIGHT]: () => {
        cameraBody.linearImpulse.x += 0.01
      },
    },
    release: {
      [DirectionKey.UP]: () => {
        cameraBody.linearImpulse.z -= 0.01
      },
      [DirectionKey.DOWN]: () => {
        cameraBody.linearImpulse.z += 0.01
      },
      [DirectionKey.LEFT]: () => {
        cameraBody.linearImpulse.x += 0.01
      },
      [DirectionKey.RIGHT]: () => {
        cameraBody.linearImpulse.x -= 0.01
      },
    },
  })

  new MouseObserver((movementX, movementY) => {
    camera.orientation.heading += movementX / 1000
    camera.orientation.pitch += movementY / 1000
  })

  const { maxTextureDimension2D } = renderer.getDeviceLimits()

  const resizeObserver = setupResizeObserver((width, height) => {
    canvas.width = Math.max(1, Math.min(width, maxTextureDimension2D))
    canvas.height = Math.max(1, Math.min(height, maxTextureDimension2D))
    camera.aspectRatio = width / height
  })

  resizeObserver.observe(canvas)

  let previousTime: number

  const cycle: FrameRequestCallback = async (time) => {
    const deltaMs = previousTime ? time - previousTime : 0
    previousTime = time

    engine.update(deltaMs)
    renderer.renderAll(camera)
    requestAnimationFrame(cycle)
  }

  requestAnimationFrame(cycle)
}
