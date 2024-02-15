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
import { MonoMesh } from './nodes/MonoMesh'

const canvas = document.querySelector('#canvas') as HTMLCanvasElement

const start = async () => {
  const renderer = await Renderer.create(canvas)

  const rootNode = new RigidNode()

  const camera = new PerspectiveCamera()
  camera.position = new Vec3(0, 3, -20)

  const light = new RigidNode()
  light.position = new Vec3(20, 20, -10)

  const c1 = new MonoMesh(...parseObj(flatCubeModel), {
    diffuse: new Vec4(0, 1, 0, 1),
    specular: new Vec4(0, 0, 0, 0),
    ambient: new Vec4(0, 1, 0, 1),
    gloss: 16,
  })

  const s1 = new MonoMesh(...parseObj(sphereModel))

  const s2 = new MonoMesh(...parseObj(sphereModel), {
    diffuse: new Vec4(0, 0, 1, 1),
    specular: new Vec4(1, 1, 1, 1),
    ambient: new Vec4(0, 0, 1, 1),
    gloss: 15,
  })

  const planeMesh = new MonoMesh(...parseObj(planeModel), {
    diffuse: new Vec4(0.6, 0.6, 0, 1),
    specular: new Vec4(0, 0, 0, 0),
    ambient: new Vec4(0.6, 0.6, 0, 1),
    gloss: 1,
  })
  planeMesh.position.y = -10

  s1.position.x = 5
  c1.position.x = -5
  c1.orientation.heading = Math.PI / 4

  s2.position.z = 5

  rootNode.addChild(c1)
  rootNode.addChild(s1)
  rootNode.addChild(camera)
  rootNode.addChild(light)
  rootNode.addChild(planeMesh)

  renderer.loadMesh(c1, 'MONO_PHONG')
  renderer.loadMesh(s2, 'MONO_PHONG')
  renderer.loadMesh(s1, 'MONO_TOON')
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
