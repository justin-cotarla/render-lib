import { EntityBuffer } from '../components/EntityBuffer.ts'
import { GlobalBuffer } from '../components/GlobalBuffer.ts'
import { System } from '../../ecs/System.ts'
import { Entity } from '../../ecs/Entity.ts'
import { Component } from '../../ecs/Component.ts'
import { Mesh } from '../components/Mesh.ts'
import { MeshBuffer } from '../components/MeshBuffer.ts'
import { ActivePipeline } from '../components/ActivePipeline.ts'
import { WorldInstance } from '../../ecs/World.ts'

export abstract class Pipeline extends System {
  private activeTag: Entity

  constructor(
    readonly device: GPUDevice,
    readonly renderPipeline: GPURenderPipeline,
    readonly BindGroup: Component<GPUBindGroup>,
  ) {
    super()

    this.activeTag = WorldInstance.createEntity()
    this.activate()

    this.registerComponent(this.BindGroup)
    this.registerComponent(Mesh)
    this.registerComponent(EntityBuffer)
    this.registerComponent(MeshBuffer)
  }

  public activate() {
    this.activeTag.addComponent(ActivePipeline, this)
  }

  public deactivate() {
    this.activeTag.removeComponent(ActivePipeline)
  }

  public registerEntity(entity: Entity): void {
    const entityBuffer = this.createEntityBuffer()

    entity.addComponent(
      this.BindGroup,
      this.createBindGroup(entityBuffer.gpuBuffer),
    )
    entity.addComponent(EntityBuffer, entityBuffer)
  }

  public render(renderPass: GPURenderPassEncoder) {
    renderPass.setPipeline(this.renderPipeline)

    this.loadGlobalBuffer?.()

    for (const entity of this.getMatchedEntities()) {
      this.loadEntityBuffer(entity)

      const vertexCount = Mesh.getEntityData(entity).triangles.length * 3
      const bindGroup = this.BindGroup.getEntityData(entity)
      const meshBuffer = MeshBuffer.getEntityData(entity)

      renderPass.setBindGroup(0, bindGroup)
      renderPass.setVertexBuffer(0, meshBuffer)

      renderPass.draw(vertexCount)
    }
  }

  private _globalBuffer: GlobalBuffer | null = null
  protected get globalBuffer(): GlobalBuffer | null {
    this._globalBuffer ??= this.createGlobalBuffer?.() ?? null

    return this._globalBuffer
  }

  protected abstract createBindGroup(gpuBuffer: GPUBuffer): GPUBindGroup
  protected abstract createEntityBuffer(): EntityBuffer
  protected createGlobalBuffer?(): GlobalBuffer

  protected abstract loadEntityBuffer(entity: Entity): void
  protected loadGlobalBuffer?(): void
}
