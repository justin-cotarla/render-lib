import { Renderer } from './Renderer'
import { parseObj } from './loaders/parseObj'
import { Vec4 } from './math/Vec4'
import { Mesh3d } from './nodes/Mesh3d'
import { RigidNode } from './nodes/RigidNode'

let direction = 'right'

const update = (mesh: Mesh3d) => {
  if (direction === 'right') {
    if (mesh.position.x < 10) {
      mesh.move(new Vec4(0.3, 0, 0, 0))
    } else if (mesh.position.x >= 10) {
      direction = 'left'
    }
  } else if (direction === 'left') {
    if (mesh.position.x > -10) {
      mesh.move(new Vec4(-0.3, 0, 0, 0))
    } else if (mesh.position.x <= -10) {
      direction = 'right'
    }
  }
}

const start = async (mesh: Mesh3d) => {
  const renderer = new Renderer()
  await renderer.init()

  const rootNode = new RigidNode()

  const camera = new RigidNode()
  camera.move(new Vec4(0, 0, -30, 1))

  rootNode.addChild(mesh)
  rootNode.addChild(camera)

  renderer.loadMesh(mesh)

  const cycle = () => {
    update(mesh)

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
