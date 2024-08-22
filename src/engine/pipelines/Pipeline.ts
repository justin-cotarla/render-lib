import { EntityBuffer } from '../components/EntityBuffer'
import { GlobalBuffer } from '../components/GlobalBuffer'
import { System } from '../../ecs/System'
import { Entity } from '../../ecs/Entity'
import { Component } from '../../ecs/Component'
import { Mesh } from '../components/Mesh'
import { MeshBuffer } from '../components/MeshBuffer'

export abstract class Pipeline extends System {
  constructor(
    readonly device: GPUDevice,
    readonly renderPipeline: GPURenderPipeline,
    readonly BindGroup: Component<GPUBindGroup>
  ) {
    super()

    this.registerComponent(this.BindGroup)
    this.registerComponent(Mesh)
    this.registerComponent(EntityBuffer)
    this.registerComponent(MeshBuffer)
  }

  public registerEntity(entity: Entity): void {
    const entityBuffer = this.createEntityBuffer()

    entity.addComponent(
      this.BindGroup,
      this.createBindGroup(entityBuffer.gpuBuffer)
    )
    entity.addComponent(EntityBuffer, entityBuffer)
  }

  public render(renderPass: GPURenderPassEncoder) {
    renderPass.setPipeline(this.renderPipeline)

    this.loadGlobalBuffer?.()
    this.renderEntities(renderPass)
  }

  private _globalBuffer: GlobalBuffer | null = null
  protected get globalBuffer(): GlobalBuffer | null {
    this._globalBuffer ??= this.createGlobalBuffer?.() ?? null

    return this._globalBuffer
  }

  public abstract createBindGroup(gpuBuffer: GPUBuffer): GPUBindGroup
  public abstract createEntityBuffer(): EntityBuffer
  protected createGlobalBuffer?(): GlobalBuffer

  protected abstract renderEntities(renderPass: GPURenderPassEncoder): void
  protected loadGlobalBuffer?(): void
}
