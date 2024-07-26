import { System } from '../../ecs/System'
import { Mesh } from '../components/Mesh'
import { BindGroupData } from '../components/BindGroupData'
import { PipelineIdentifier } from '../components/PipelineIdentifier'
import { Pipeline } from '../pipelines/Pipeline'

export class PipelineBufferAllocator extends System {
  constructor(
    readonly device: GPUDevice,
    readonly pipelineMap: Record<string, Pipeline>
  ) {
    super()
    this.registerComponent(Mesh)
    this.registerComponent(PipelineIdentifier)
  }

  public allocateBuffers() {
    for (const entity of this.getMatchedEntities()) {
      const pipeline =
        this.pipelineMap[PipelineIdentifier.getEntityData(entity.id)]

      const gpuBuffers = pipeline.createGpuBuffers()

      entity.addComponent(BindGroupData, {
        gpuBuffers,
        bindGroup: pipeline.createBindGroup(gpuBuffers),
        uniformBuffer: pipeline.createUniformBuffer(),
      })
    }
  }
}
