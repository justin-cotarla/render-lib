import { Renderer } from './Renderer'
import { parseObj } from './loaders/parseObj'
import { Vec3 } from './math/Vec3'
import { PerspectiveCamera } from './nodes/PerpectiveCamera'
import { RigidNode } from './nodes/RigidNode'
import flatCubeModel from '../models/flat_cube.obj?raw'
import { setupResizeObserver } from './util/window'
import { Key, KeyboardObserver } from './input/KeyboardObserver'

const canvas = document.querySelector('#canvas') as HTMLCanvasElement

const start = async () => {
  const renderer = await Renderer.create(canvas)
  await renderer.init()

  const rootNode = new RigidNode()

  const camera = new PerspectiveCamera()
  camera.position = new Vec3(0, 3, -12)

  const light = new RigidNode()
  light.position = new Vec3(20, 20, -10)

  const cubeMesh = parseObj(flatCubeModel)

  rootNode.addChild(cubeMesh)
  rootNode.addChild(camera)
  rootNode.addChild(light)

  renderer.loadMesh(cubeMesh)
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

    camera.tick(deltaMs)
    cubeMesh.tick(deltaMs)

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
