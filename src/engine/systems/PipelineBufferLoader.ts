import { System } from '../../ecs/System'
import { Mesh } from '../components/Mesh'
import { BindGroupData } from '../components/BindGroupData'
import { PipelineIdentifier } from '../components/PipelineIdentifier'
import { Pipeline } from '../pipelines/Pipeline'
import { Material } from '../components/Material'
import { LocalTransform } from '../components/LocalTransform'
import { RootTransform } from '../components/RootTransform'

export class PipelineBufferLoader extends System {
  constructor(
    readonly device: GPUDevice,
    readonly pipelineMap: Record<string, Pipeline>
  ) {
    super()
    this.registerComponent(Mesh)
    this.registerComponent(Material)
    this.registerComponent(LocalTransform)
    this.registerComponent(PipelineIdentifier)
    this.registerComponent(BindGroupData)
  }

  public loadBuffers(
    scene: Parameters<Pipeline['loadMeshBuffers']>[0]['scene']
  ) {
    for (const entity of this.getMatchedEntities()) {
      const pipeline =
        this.pipelineMap[PipelineIdentifier.getEntityData(entity.id)]

      pipeline.loadMeshBuffers({
        bindGroupData: BindGroupData.getEntityData(entity.id),
        mesh: {
          material: Material.getEntityData(entity.id),
          localTransform: LocalTransform.getEntityData(entity.id),
          rootTransform: RootTransform.getEntityData(entity.id),
        },
        scene,
      })
    }
  }
}
