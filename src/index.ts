import { Renderer } from './Renderer'
import { parseObj } from './loaders/parseObj'
import { Vec3 } from './math/Vec3'
import { Mesh3d } from './nodes/Mesh3d'
import { RigidNode } from './nodes/RigidNode'

let direction = 'right'
const bounds = 10

const update = (node: RigidNode) => {
  if (direction === 'right') {
    if (node.position.x < bounds) {
      node.move(new Vec3(0.3, 0, 0))
    } else if (node.position.x >= bounds) {
      direction = 'left'
    }
  } else if (direction === 'left') {
    if (node.position.x > -bounds) {
      node.move(new Vec3(-0.3, 0, 0))
    } else if (node.position.x <= -bounds) {
      direction = 'right'
    }
  }
}

const start = async (mesh: Mesh3d) => {
  const renderer = await Renderer.create()
  await renderer.init()

  const rootNode = new RigidNode()

  const camera = new RigidNode()
  camera.position = new Vec3(0, 5, -30)

  const light = new RigidNode()
  light.position = new Vec3(20, 20, -10)

  // mesh.position = new Vec4(0, -10, 0, 1)

  rootNode.addChild(mesh)
  rootNode.addChild(camera)
  rootNode.addChild(light)

  renderer.loadMesh(mesh)
  renderer.setLight(light)

  const cycle = () => {
    update(light)

    renderer.renderAll(camera)
    requestAnimationFrame(cycle)
  }

  cycle()
}

const fileInput = document.querySelector('#obj') as HTMLInputElement
fileInput.addEventListener('change', async (event) => {
  const target = event.target as HTMLInputElement

  const meshFile = target.files?.[0]

  if (!meshFile) {
    return
  }

  const mesh = parseObj(await meshFile.text())

  start(mesh)
})
