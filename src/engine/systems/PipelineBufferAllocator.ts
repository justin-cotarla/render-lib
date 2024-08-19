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
      const pipelineIdentifier = PipelineIdentifier.getEntityData(entity.id)

      const pipeline = this.pipelineMap[pipelineIdentifier]

      if (!pipeline) {
        throw new Error(
          `Pipeline ${pipelineIdentifier} on entity ${entity.id} does not exist`
        )
      }
      const gpuBuffers = pipeline.createGpuBuffers()

      entity.addComponent(BindGroupData, {
        gpuBuffers,
        bindGroup: pipeline.createBindGroup(gpuBuffers),
        uniformBuffer: pipeline.createUniformBuffer(),
      })
    }
  }
}
