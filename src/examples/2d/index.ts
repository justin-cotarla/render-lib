import { WorldInstance } from '../../engine/World'
import { Force } from '../../engine/components/Force'
import { KeyboardControl } from '../../engine/components/KeyboardControl'
import { LinearImpulse } from '../../engine/components/LinearImpulse'
import { Mass } from '../../engine/components/Mass'
import { Position } from '../../engine/components/Position'
import { TransformTarget } from '../../engine/components/TransformTarget'
import { Velocity } from '../../engine/components/Velocity'
import { FlatRectangle } from '../../engine/elements/FlatRectangle'
import { FlatPipeline } from '../../engine/pipelines/flat/FlatPipeline'
import { CanvasResizer } from '../../engine/systems/CanvasResizer'
import { ForceIntegrator } from '../../engine/systems/ForceIntegrator'
import { KeyboardMover } from '../../engine/systems/KeyboardMover'
import { Renderer } from '../../engine/systems/Renderer'
import { loadFlatRectangle } from '../../loaders/loadFlatRectangle'
import { Vec3 } from '../../math/Vec3'
import { getDevice } from '../../util/window'
import { OrthographicCamera } from '../../engine/components/OrthographicCamera'
import { Orientation } from '../../engine/components/Orientation'
import { Scene } from '../../engine/Scene'

const canvas = document.querySelector('#canvas') as HTMLCanvasElement

const start = async () => {
  const device = await getDevice()

  const renderer = Renderer.create(device, canvas)

  const flatPipeline = new FlatPipeline(device)

  const forceIntegrator = new ForceIntegrator()

  const _canvasResizer = new CanvasResizer(
    canvas,
    device.limits.maxTextureDimension2D
  )
  const _keyboardMover = new KeyboardMover()

  // Scene
  const scene = new Scene('orthographic')
  const camera = WorldInstance.createEntity()
  camera.addComponent(OrthographicCamera, {
    aspectRatio: 1,
    farPlane: 2,
    nearPlane: 1,
    width: 10,
  })
  camera.addComponent(Position, new Vec3([0, 0, 0]))
  camera.addComponent(Orientation, {
    bank: 0,
    heading: 0,
    pitch: 0,
  })
  camera.addComponent(TransformTarget)

  const red: FlatRectangle = {
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    color: {
      r: 255,
      b: 0,
      g: 0,
    },
  }

  const green: FlatRectangle = {
    x: 3,
    y: 0,
    width: 1,
    height: 1,
    color: {
      r: 0,
      b: 0,
      g: 255,
    },
  }

  const blue: FlatRectangle = {
    x: 2,
    y: 0,
    width: 1,
    height: 1,
    color: {
      r: 0,
      b: 255,
      g: 0,
    },
  }

  const blueEntity = loadFlatRectangle(blue, device)
  const greenEntity = loadFlatRectangle(green, device)
  const redEntity = loadFlatRectangle(red, device)

  redEntity.addComponent(flatPipeline.component)
  greenEntity.addComponent(flatPipeline.component)
  blueEntity.addComponent(flatPipeline.component)

  redEntity.addComponent(LinearImpulse, new Vec3())
  redEntity.addComponent(KeyboardControl)
  redEntity.addComponent(Mass, 1)
  redEntity.addComponent(Force, new Vec3())
  redEntity.addComponent(Velocity, new Vec3())

  scene.addNodes([camera, [redEntity, [greenEntity]], blueEntity])

  renderer.render()

  let previousTime: number

  const cycle: FrameRequestCallback = async (time) => {
    const deltaMs = previousTime ? time - previousTime : 0
    previousTime = time

    forceIntegrator.integrate(deltaMs)
    scene.calculateSceneTransforms()

    renderer.render()
    requestAnimationFrame(cycle)
  }

  requestAnimationFrame(cycle)
}

start()
