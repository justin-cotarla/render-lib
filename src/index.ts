import { Renderer } from './Renderer'
import { parseObj } from './loaders/parseObj'
import { Vec3 } from './math/Vec3'
import { PerspectiveCamera } from './nodes/PerpectiveCamera'
import { RigidNode } from './nodes/RigidNode'
import flatCubeModel from '../models/flat_cube.obj?raw'
import sphereModel from '../models/sphere.obj?raw'
import planeModel from '../models/plane.obj?raw'
import { setupResizeObserver } from './util/window'
import { Key, KeyboardObserver } from './input/KeyboardObserver'
import { MouseObserver } from './input/MouseObserver'
import { Vec4 } from './math/Vec4'

const canvas = document.querySelector('#canvas') as HTMLCanvasElement

const start = async () => {
  const renderer = await Renderer.create(canvas)

  const rootNode = new RigidNode()

  const camera = new PerspectiveCamera()
  camera.position = new Vec3(0, 3, -20)

  const light = new RigidNode()
  light.position = new Vec3(20, 20, -10)

  const cubeMesh = parseObj(flatCubeModel)
  cubeMesh.material = {
    diffuse: new Vec4(0, 1, 0, 1),
    specular: new Vec4(0, 0, 0, 0),
    ambient: new Vec4(0, 1, 0, 1),
    gloss: 16,
  }

  const c2 = parseObj(flatCubeModel)
  c2.material = {
    diffuse: new Vec4(0, 0, 1, 1),
    specular: new Vec4(0, 0, 0, 0),
    ambient: new Vec4(0, 0, 1, 1),
    gloss: 16,
  }

  const sphereMesh = parseObj(sphereModel)

  const planeMesh = parseObj(planeModel)
  planeMesh.material = {
    diffuse: new Vec4(0.6, 0.6, 0, 1),
    specular: new Vec4(0, 0, 0, 0),
    ambient: new Vec4(0.6, 0.6, 0, 1),
    gloss: 1,
  }
  planeMesh.position.y = -10

  sphereMesh.position.x = 5
  cubeMesh.position.x = -5
  cubeMesh.orientation.heading = Math.PI / 4

  cubeMesh.addChild(c2)
  c2.position.z = 5

  rootNode.addChild(cubeMesh)
  rootNode.addChild(sphereMesh)
  rootNode.addChild(camera)
  rootNode.addChild(light)
  rootNode.addChild(planeMesh)

  renderer.loadMesh(cubeMesh)
  renderer.loadMesh(c2)
  renderer.loadMesh(sphereMesh)
  // renderer.loadMesh(planeMesh)
  renderer.setLight(light)

  new KeyboardObserver({
    press: {
      [Key.UP]: () => {
        camera.velocity.z += 0.01
      },
      [Key.DOWN]: () => {
        camera.velocity.z -= 0.01
      },
      [Key.LEFT]: () => {
        camera.velocity.x -= 0.01
      },
      [Key.RIGHT]: () => {
        camera.velocity.x += 0.01
      },
    },
    release: {
      [Key.UP]: () => {
        camera.velocity.z -= 0.01
      },
      [Key.DOWN]: () => {
        camera.velocity.z += 0.01
      },
      [Key.LEFT]: () => {
        camera.velocity.x += 0.01
      },
      [Key.RIGHT]: () => {
        camera.velocity.x -= 0.01
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

    camera.tick(deltaMs)

    renderer.renderAll(camera)
    requestAnimationFrame(cycle)
  }

  requestAnimationFrame(cycle)
}

start()

// const fileInput = document.querySelector('#obj') as HTMLInputElement

// fileInput.addEventListener('change', async (event) => {
//   const target = event.target as HTMLInputElement

//   const meshFile = target.files?.[0]

//   if (!meshFile) {
//     return
//   }

//   const mesh = parseObj(await meshFile.text())
// })
