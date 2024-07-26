import { BindGroupData } from '../components/BindGroupData'
import { Light } from '../components/Light'
import { Vec3 } from '../../math/Vec3'
import { Mat4 } from '../../math/Mat4'
import { Material } from '../components/Material'
import { PerspectiveCamera } from '../components/PerspectiveCamera'

export abstract class Pipeline {
  constructor(
    readonly device: GPUDevice,
    readonly renderPipeline: GPURenderPipeline,
    readonly uniformDataSize: number
  ) {}

  public abstract loadMeshBuffers(params: {
    bindGroupData: BindGroupData
    mesh: {
      rootTransform: Mat4
      localTransform: Mat4
      material: Material
    }
    scene: {
      camera: {
        position: Vec3
        rootTransform: Mat4
        localTransform: Mat4
        perspectiveCamera: PerspectiveCamera
      }
      lights: {
        position: Vec3
        rootTransform: Mat4
        light: Light
      }[]
    }
  }): void
  public abstract createGpuBuffers(): BindGroupData['gpuBuffers']

  public createUniformBuffer = (): BindGroupData['uniformBuffer'] => {
    return new Float32Array(this.uniformDataSize)
  }

  public createBindGroup = (
    buffers: BindGroupData['gpuBuffers']
  ): BindGroupData['bindGroup'] => {
    return this.device.createBindGroup({
      layout: this.renderPipeline.getBindGroupLayout(0),
      entries: buffers.map((buffer, index) => ({
        binding: index,
        resource: { buffer },
      })),
    })
  }

  public createPipelineData(): BindGroupData {
    const gpuBuffers = this.createGpuBuffers()

    return {
      gpuBuffers,
      bindGroup: this.createBindGroup(gpuBuffers),
      uniformBuffer: this.createUniformBuffer(),
    }
  }
}
