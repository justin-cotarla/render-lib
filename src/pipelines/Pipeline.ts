import { Mesh } from '../nodes/Mesh'

export interface PipelineMesh extends Mesh {
  readonly pipelineId: string
  bindGroup: GPUBindGroup
  vertexBuffer: GPUBuffer
  uniformBuffers: GPUBuffer[]
  uniformData: Float32Array
}

export abstract class Pipeline {
  constructor(
    readonly device: GPUDevice,
    readonly renderPipeline: GPURenderPipeline,
    readonly uniformDataSize: number
  ) {}

  public abstract loadBuffers(mesh: PipelineMesh, ...scene: never[]): void

  public abstract createGpuBuffers(): GPUBuffer[]

  public createUniformData = (): Float32Array => {
    return new Float32Array(this.uniformDataSize)
  }

  public createBindGroup = (buffers: GPUBuffer[]): GPUBindGroup => {
    return this.device.createBindGroup({
      layout: this.renderPipeline.getBindGroupLayout(0),
      entries: buffers.map((buffer, index) => ({
        binding: index,
        resource: { buffer },
      })),
    })
  }
}
