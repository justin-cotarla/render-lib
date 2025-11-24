import { System } from '../../ecs/System'
import { Entity } from '../../ecs/Entity'
import { ActivePipeline } from '../components/ActivePipeline'
import { WorldInstance } from '../../ecs/World'
import { Component } from '../../ecs/Component'
import { RootTransform } from '../components/RootTransform'

export abstract class Pipeline extends System {
  static DEFAULT_BUFFER_SIZE_BYTES = 4
  static GROWTH_FACTOR = 1.5

  private prevEntityCount = 0

  private pipelineEntity: Entity
  private _component: Component
  protected buffer: ArrayBuffer = new ArrayBuffer(
    Pipeline.DEFAULT_BUFFER_SIZE_BYTES
  )

  constructor(
    readonly renderPipeline: GPURenderPipeline,
    readonly name: string
  ) {
    super()

    this.registerComponent(RootTransform)

    this._component = new Component(`PIPELINE_TAG_${name.toLocaleUpperCase()}`)

    this.registerComponent(this._component)

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
    if (!this.matchedEntityCount) {
      return
    }

    renderPass.setPipeline(this.renderPipeline)

    this.prerender?.(this.prevEntityCount, this.matchedEntityCount)
    this.prevEntityCount = this.matchedEntityCount

    let renderIndex = 0
    for (const entity of this.getMatchedEntities()) {
      this.renderEntity(renderPass, entity, renderIndex)
      renderIndex++
    }
  }

  public get component(): Component {
    return this._component
  }

  protected growBuffer(byteOffset: number, byteSize: number): void {
    let newSizeBytes = this.buffer.byteLength

    while (newSizeBytes < byteSize + byteOffset) {
      newSizeBytes = Math.ceil(newSizeBytes * Pipeline.GROWTH_FACTOR)
    }

    this.buffer = this.buffer.transfer(newSizeBytes)
  }

  protected prerender?(entityCount: number, prevEntityCount: number): void

  protected abstract renderEntity(
    renderPass: GPURenderPassEncoder,
    entity: Entity,
    renderIndex: number
  ): void
}
