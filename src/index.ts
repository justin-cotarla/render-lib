import { Renderer } from './Renderer'
import { parseObj } from './loaders/parseObj'
import { Vec3 } from './math/Vec3'
import { Mesh3d } from './nodes/Mesh3d'
import { PerspectiveCamera } from './nodes/PerpectiveCamera'
import { RigidNode } from './nodes/RigidNode'
import flatCubeModel from '../models/flat_cube.obj?raw'
import { setupResizeObserver } from './util/window'

let direction = 'right'
const bounds = 5

const canvas = document.querySelector('#canvas') as HTMLCanvasElement

const update = (node: RigidNode) => {
  if (direction === 'right') {
    if (node.position.x < bounds) {
      node.position.x += 0.07
    } else if (node.position.x >= bounds) {
      direction = 'left'
    }
  } else if (direction === 'left') {
    if (node.position.x > -bounds) {
      node.position.x -= 0.07
    } else if (node.position.x <= -bounds) {
      direction = 'right'
    }
  }
}

const start = async (mesh: Mesh3d) => {
  const renderer = await Renderer.create(canvas)
  await renderer.init()

  const rootNode = new RigidNode()

  const camera = new PerspectiveCamera()
  camera.position = new Vec3(0, 3, -12)

  const light = new RigidNode()
  light.position = new Vec3(20, 20, -10)

  rootNode.addChild(mesh)
  rootNode.addChild(camera)
  rootNode.addChild(light)

  renderer.loadMesh(mesh)
  renderer.setLight(light)

  const { maxTextureDimension2D } = renderer.getDeviceLimits()

  const resizeObserver = setupResizeObserver((width, height) => {
    canvas.width = Math.max(1, Math.min(width, maxTextureDimension2D))
    canvas.height = Math.max(1, Math.min(height, maxTextureDimension2D))
    camera.aspectRatio = width / height
  })

  resizeObserver.observe(canvas)

  const cycle = () => {
    update(mesh)

    renderer.renderAll(camera)
    requestAnimationFrame(cycle)
  }

  cycle()
}

start(parseObj(flatCubeModel))

// const fileInput = document.querySelector('#obj') as HTMLInputElement

// fileInput.addEventListener('change', async (event) => {
//   const target = event.target as HTMLInputElement

//   const meshFile = target.files?.[0]

//   if (!meshFile) {
//     return
//   }

//   const mesh = parseObj(await meshFile.text())
// })
