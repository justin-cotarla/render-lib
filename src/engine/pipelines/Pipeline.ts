import { Mesh } from '../nodes/Mesh'
import { System } from '../../ecs/System'

export interface PipelineData {
  buffers: GPUBuffer[]
  bindGroup: GPUBindGroup
  uniformData: Float32Array
}

export abstract class Pipeline extends System {
  constructor(
    readonly device: GPUDevice,
    readonly renderPipeline: GPURenderPipeline,
    readonly uniformDataSize: number
  ) {
    super()
  }

  public abstract loadBuffers(mesh: Mesh, ...scene: never[]): void

  protected abstract createGpuBuffers(): GPUBuffer[]

  private createUniformData = (): Float32Array => {
    return new Float32Array(this.uniformDataSize)
  }

  private createBindGroup = (buffers: GPUBuffer[]): GPUBindGroup => {
    return this.device.createBindGroup({
      layout: this.renderPipeline.getBindGroupLayout(0),
      entries: buffers.map((buffer, index) => ({
        binding: index,
        resource: { buffer },
      })),
    })
  }

  public createPipelineData(): PipelineData {
    const buffers = this.createGpuBuffers()

    return {
      buffers,
      bindGroup: this.createBindGroup(buffers),
      uniformData: this.createUniformData(),
    }
  }
}
