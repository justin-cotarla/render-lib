import { Renderer } from './Renderer'
import { parseObj } from './loaders/parseObj'
import { Vec3 } from './math/Vec3'
import { PerspectiveCamera } from './nodes/PerpectiveCamera'
import { RigidNode } from './nodes/RigidNode'
import flatCubeModel from '../models/flat_cube.obj?raw'
import sphereModel from '../models/sphere.obj?raw'
import { setupResizeObserver } from './util/window'
import { Key, KeyboardObserver } from './input/KeyboardObserver'
import { MouseObserver } from './input/MouseObserver'

const canvas = document.querySelector('#canvas') as HTMLCanvasElement

const start = async () => {
  const renderer = await Renderer.create(canvas)

  const rootNode = new RigidNode()

  const camera = new PerspectiveCamera()
  camera.position = new Vec3(0, 3, -20)

  const light = new RigidNode()
  light.position = new Vec3(20, 20, -10)

  const cubeMesh = parseObj(flatCubeModel)
  const sphereMesh = parseObj(sphereModel)

  sphereMesh.position.x = 5
  cubeMesh.position.x = -5

  rootNode.addChild(cubeMesh)
  rootNode.addChild(sphereMesh)
  rootNode.addChild(camera)
  rootNode.addChild(light)

  renderer.loadMesh(cubeMesh)
  renderer.loadMesh(sphereMesh)
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

  const cycle: FrameRequestCallback = (time) => {
    const deltaMs = previousTime ? time - previousTime : 0
    previousTime = time

    cubeMesh.orientation.heading += (deltaMs / 10) * (Math.PI / 180)

    camera.tick(deltaMs)
    cubeMesh.tick(deltaMs)
    sphereMesh.tick(deltaMs)

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
