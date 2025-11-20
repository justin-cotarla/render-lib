import { System } from '../../ecs/System.ts'
import { Entity } from '../../ecs/Entity.ts'
import { ActivePipeline } from '../components/ActivePipeline.ts'
import { WorldInstance } from '../../ecs/World.ts'
import { Component } from '../../ecs/Component.ts'

export abstract class Pipeline extends System {
  static DEFAULT_BUFFER_SIZE_BYTES = 4
  static GROWTH_FACTOR = 1.5

  private preEntityCount = 0

  private pipelineEntity: Entity
  private _tag: Component
  protected buffer: ArrayBuffer = new ArrayBuffer(
    Pipeline.DEFAULT_BUFFER_SIZE_BYTES,
  )

  constructor(
    readonly renderPipeline: GPURenderPipeline,
    readonly name: string,
  ) {
    super()
    this._tag = new Component(`PIPELINE_TAG_${name.toLocaleUpperCase()}`)

    this.pipelineEntity = WorldInstance.createEntity()
    this.activate()
  }

  public activate() {
    this.pipelineEntity.addComponent(ActivePipeline, this)
  }

  public deactivate() {
    this.pipelineEntity.removeComponent(ActivePipeline)
  }

  public render(renderPass: GPURenderPassEncoder) {
    renderPass.setPipeline(this.renderPipeline)

    this.prerender?.(this.preEntityCount, this.matchedEntityCount)
    this.preEntityCount = this.matchedEntityCount

    let renderIndex = 0
    for (const entity of this.getMatchedEntities()) {
      this.renderEntity(renderPass, entity, renderIndex)
      renderIndex++
    }
  }

  public get tag(): Component {
    return this._tag
  }

  protected growBuffer(byteOffset: number, byteSize: number): void {
    if (this.buffer.byteLength < byteSize + byteOffset) {
      const newSizeBytes = Math.ceil(
        this.buffer.byteLength * Pipeline.GROWTH_FACTOR,
      )
      this.buffer = this.buffer.transfer(
        newSizeBytes,
      )
    }
  }

  protected prerender?(entityCount: number, prevEntityCount: number): void

  protected abstract renderEntity(
    renderPass: GPURenderPassEncoder,
    entity: Entity,
    renderIndex: number,
  ): void
}
