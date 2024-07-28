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

import sphereModel from '../../models/sphere.obj?raw'
import { Light } from '../engine/nodes/LightNode'
import { Scene } from '../engine/Scene'

const canvas = document.querySelector('#canvas') as HTMLCanvasElement

export const start = async () => {
  const renderer = await Renderer.create(canvas)

  const scene = new Scene()

  const camera = new PerspectiveCamera()
  camera.position = new Vec3(20, 70, 20)
  camera.orientation = {
    bank: 0,
    heading: 0,
    pitch: (Math.PI / 180) * 90,
  }

  const light = new Light()
  light.position = new Vec3(20, 20, -10)

  Array.from({ length: 500 }).forEach((_, index) => {
    const rgb = new Vec4(Math.random(), Math.random(), Math.random(), 1)

    const entity = new MonoMesh('MONO_PHONG', ...parseObj(sphereModel), {
      diffuse: rgb,
      specular: new Vec4(1, 1, 1, 1),
      ambient: rgb,
      gloss: 10,
    })

    entity.position = new Vec3(Math.floor(index / 10) * 3, 0, (index % 10) * 3)

    scene.rootNode.addChild(entity)
  })

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
