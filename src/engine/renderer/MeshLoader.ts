import { Light } from '../components/Light'
import { Mesh } from '../components/Mesh'
import { PerspectiveCamera } from '../components/PerspectiveCamera'
import { PipelineData } from '../components/PipelineData'
import { System } from './System'

export class MeshLoader extends System {
  private pipelines: RenderPipelines

  private constructor(
    readonly device: GPUDevice,
    readonly canvas: HTMLCanvasElement
  ) {
    super()

    this.addComponentListener(Light)
    this.addComponentListener(Mesh)
    this.addComponentListener(PerspectiveCamera)
    this.addComponentListener(PipelineData)

    this.context = this.getRenderContext()

    this.pipelines = {
      MONO_PHONG: {
        pipeline: new MonoPhongPipeline(this.device),
        meshes: [],
      },
      MONO_TOON: {
        pipeline: new MonoToonPipeline(this.device),
        meshes: [],
      },
    }
  }

  public unloadScene() {
    Object.values(this.pipelines).forEach((pipeline) => {
      pipeline.meshes = []
    })

    this.scene = undefined
  }

  public loadScene = () => {
    if (!this.device) {
      throw new Error('Device not loaded')
    }

    for (const entity of this.getMatchedEntities()) {
      const mesh = Mesh.
      const { pipeline, meshes: objects } = this.

      const vertexBuffer = this.device.createBuffer({
        label: `vertex_buffer_${mesh.ID}`,
        size: mesh.vertexData.byteLength,
        usage: GPUBufferUsage.VERTEX,
        mappedAtCreation: true,
      })

      const bufferData = new Float32Array(vertexBuffer.getMappedRange())
      bufferData.set(mesh.vertexData)
      vertexBuffer.unmap()

      mesh.pipelineData = pipeline.createPipelineData()
      mesh.vertexBuffer = vertexBuffer

      objects.push(mesh as Parameters<(typeof pipeline)['loadBuffers']>[0])
    }

    const lights = scene.filterNodes(Light)
    this.light = lights[0]
  }
}
