import { Renderer } from '../engine/Renderer'
import { KeyboardObserver, DirectionKey } from '../input/KeyboardObserver'
import { MouseObserver } from '../input/MouseObserver'
import { parseObj } from '../loaders/parseObj'
import { Vec3 } from '../math/Vec3'
import { Vec4 } from '../math/Vec4'
import { MonoMesh } from '../engine/nodes/MonoMesh'
import { PerspectiveCamera } from '../engine/nodes/PerpectiveCamera'
import { Body } from '../engine/physics/Body'
import { PhysicsEngine } from '../engine/physics/PhysicsEngine'
import { setupResizeObserver } from '../util/window'

import flatCubeModel from '../../models/flat_cube.obj?raw'
import planeModel from '../../models/plane.obj?raw'
import { Light } from '../engine/nodes/LightNode'
import { Scene } from '../engine/Scene'

const canvas = document.querySelector('#canvas') as HTMLCanvasElement

export const start = async () => {
  const renderer = await Renderer.create(canvas)

  const scene = new Scene()

  const camera = new PerspectiveCamera()
  camera.position = new Vec3(0, 3, -20)

  const light = new Light()
  light.position = new Vec3(20, 20, -10)

  const plane = new MonoMesh('MONO_PHONG', ...parseObj(planeModel), {
    diffuse: new Vec4(1, 1, 0, 1),
    specular: new Vec4(1, 1, 1, 1),
    ambient: new Vec4(1, 1, 0, 1),
    gloss: 10,
  })

  const c1 = new MonoMesh('MONO_PHONG', ...parseObj(flatCubeModel), {
    diffuse: new Vec4(0, 1, 0, 1),
    specular: new Vec4(0, 0, 0, 0),
    ambient: new Vec4(0, 1, 0, 1),
    gloss: 16,
  })

  c1.position.y = 1
  c1.position.x = -5

  const c2 = new MonoMesh('MONO_PHONG', ...parseObj(flatCubeModel), {
    diffuse: new Vec4(1, 0, 1, 1),
    specular: new Vec4(0, 0, 0, 0),
    ambient: new Vec4(1, 0, 1, 1),
    gloss: 16,
  })

  c2.position.y = 1
  c2.position.x = 5

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
