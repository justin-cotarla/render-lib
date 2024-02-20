import { Renderer } from '../Renderer'
import { parseObj } from '../loaders/parseObj'
import { Vec3 } from '../math/Vec3'
import { PerspectiveCamera } from '../nodes/PerpectiveCamera'
import { RigidNode } from '../nodes/RigidNode'
import flatCubeModel from '../../models/flat_cube.obj?raw'
import sphereModel from '../../models/sphere.obj?raw'
import { setupResizeObserver } from '../util/window'
import { Key, KeyboardObserver } from '../input/KeyboardObserver'
import { Vec4 } from '../math/Vec4'
import { MonoMesh } from '../nodes/MonoMesh'
import { PhysicsEngine } from '../physics/PhysicsEngine'
import { Body } from '../physics/Body'

const canvas = document.querySelector('#canvas') as HTMLCanvasElement

export const start = async () => {
  const renderer = await Renderer.create(canvas)

  const rootNode = new RigidNode()

  const camera = new PerspectiveCamera()
  camera.position = new Vec3(0, 10, -25)
  camera.orientation.pitch = (Math.PI / 180) * 20

  const light = new RigidNode()
  light.position = new Vec3(20, 20, -10)

  const c1 = new MonoMesh(...parseObj(flatCubeModel), {
    diffuse: new Vec4(0, 1, 0, 1),
    specular: new Vec4(0, 0, 0, 0),
    ambient: new Vec4(0, 1, 0, 1),
    gloss: 16,
  })

  const c2 = new MonoMesh(...parseObj(flatCubeModel), {
    diffuse: new Vec4(1, 0, 1, 1),
    specular: new Vec4(0, 0, 0, 0),
    ambient: new Vec4(1, 0, 1, 1),
    gloss: 16,
  })

  const s1 = new MonoMesh(...parseObj(sphereModel))

  s1.position.x = -5
  c1.position.x = 5
  c2.position.x = 2

  rootNode.addChild(c1)
  rootNode.addChild(c2)
  rootNode.addChild(s1)
  rootNode.addChild(camera)
  rootNode.addChild(light)

  renderer.loadMesh(c1, 'MONO_PHONG')
  renderer.loadMesh(c2, 'MONO_PHONG')
  renderer.loadMesh(s1, 'MONO_TOON')
  renderer.setLight(light)

  const engine = new PhysicsEngine()
  engine.registerBody(new Body(c1, 1))
  engine.registerBody(new Body(c2, 1))
  engine.registerBody(new Body(s1, 1))

  new KeyboardObserver({
    press: {
      [Key.UP]: () => {
        c1.velocity.z += 0.01
      },
      [Key.DOWN]: () => {
        c1.velocity.z -= 0.01
      },
      [Key.LEFT]: () => {
        c1.velocity.x -= 0.01
      },
      [Key.RIGHT]: () => {
        c1.velocity.x += 0.01
      },
    },
    release: {
      [Key.UP]: () => {
        c1.velocity.z -= 0.01
      },
      [Key.DOWN]: () => {
        c1.velocity.z += 0.01
      },
      [Key.LEFT]: () => {
        c1.velocity.x += 0.01
      },
      [Key.RIGHT]: () => {
        c1.velocity.x -= 0.01
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

  const cycle: FrameRequestCallback = async (time) => {
    const deltaMs = previousTime ? time - previousTime : 0
    previousTime = time

    // engine.update(deltaMs)

    c1.tick(deltaMs)
    renderer.renderAll(camera)
    requestAnimationFrame(cycle)
  }

  requestAnimationFrame(cycle)
}
