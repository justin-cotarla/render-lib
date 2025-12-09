import { Entity } from 'reactive-ecs'
import { FlatColor } from '../../components/FlatColor'
import { MeshBuffer } from '../../components/MeshBuffer'
import { Position } from '../../components/Position'
import { RootClipTransform } from '../../components/RootClipTransform'
import { RootTransform } from '../../components/RootTransform'
import { Collector } from '../../systems/Collector'
import { Pipeline } from '../../systems/Pipeline'

import shader from './shader.wgsl?raw'

export class FlatPipeline extends Pipeline {
  private cameraCollector = new Collector([Position, RootClipTransform])

  private globalBuffer: GPUBuffer
  private entityBuffer?: GPUBuffer

  private bindGroup?: GPUBindGroup

  readonly GLOBAL_BUFFER_SIZE_BYTES = Float32Array.BYTES_PER_ELEMENT * 16
  readonly ENTITY_BUFFER_SIZE_BYTES = Float32Array.BYTES_PER_ELEMENT * 20

  readonly OFFSET_ENTITY_BUFFER_SIZE_BYTES: number

  constructor(readonly device: GPUDevice) {
    const name = 'flat'

    const renderPipeline = device.createRenderPipeline({
      label: `${name}_pipeline`,
      vertex: {
        module: device.createShaderModule({
          code: shader,
        }),
        buffers: [
          {
            attributes: [
              {
                shaderLocation: 0,
                offset: 0,
                format: 'float32x2',
              },
            ],
            arrayStride: Float32Array.BYTES_PER_ELEMENT * 2,
            stepMode: 'vertex',
          },
        ],
      },
      fragment: {
        module: device.createShaderModule({
          code: shader,
        }),
        targets: [
          {
            format: navigator.gpu.getPreferredCanvasFormat(),
          },
        ],
      },
      layout: device.createPipelineLayout({
        bindGroupLayouts: [
          device.createBindGroupLayout({
            entries: [
              {
                binding: 0,
                buffer: {},
                visibility: GPUShaderStage.VERTEX,
              },
              {
                binding: 1,
                buffer: {
                  hasDynamicOffset: true,
                },
                visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX,
              },
            ],
          }),
        ],
      }),
      primitive: {
        topology: 'triangle-list',
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: 'less',
        format: 'depth24plus',
      },
    })

    super(renderPipeline, name, [FlatColor, MeshBuffer])

    this.OFFSET_ENTITY_BUFFER_SIZE_BYTES =
      Math.ceil(
        this.ENTITY_BUFFER_SIZE_BYTES /
          device.limits.minUniformBufferOffsetAlignment
      ) * device.limits.minUniformBufferOffsetAlignment

    this.globalBuffer = this.createGlobalBuffer()
  }

  private createGlobalBuffer(): GPUBuffer {
    return this.device.createBuffer({
      label: `${this.name}_global_uni`,
      size: this.GLOBAL_BUFFER_SIZE_BYTES,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })
  }

  private createEntityBuffer(entityCount: number): GPUBuffer {
    return this.device.createBuffer({
      label: `${this.name}_entity_uni`,
      size: this.OFFSET_ENTITY_BUFFER_SIZE_BYTES * entityCount,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })
  }

  private createBindGroup(
    pipelineBuffer: GPUBuffer,
    entityBuffer: GPUBuffer
  ): GPUBindGroup {
    return this.device.createBindGroup({
      label: `${this.name}_bindgroup`,
      layout: this.renderPipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: pipelineBuffer,
            offset: 0,
            size: this.GLOBAL_BUFFER_SIZE_BYTES,
          },
        },
        {
          binding: 1,
          resource: {
            buffer: entityBuffer,
            size: this.OFFSET_ENTITY_BUFFER_SIZE_BYTES,
          },
        },
      ],
    })
  }

  private loadEntityBuffer(entity: Entity, renderIndex: number) {
    const color = FlatColor.getEntityData(entity)
    const rootTransform = RootTransform.getEntityData(entity)

    const entityBuffer = new Float32Array(
      this.buffer,
      this.GLOBAL_BUFFER_SIZE_BYTES +
        renderIndex * this.OFFSET_ENTITY_BUFFER_SIZE_BYTES,
      this.OFFSET_ENTITY_BUFFER_SIZE_BYTES / Float32Array.BYTES_PER_ELEMENT
    )

    const meshRootTransformBuffer = entityBuffer.subarray(0, 16)
    const colorBuffer = entityBuffer.subarray(16, 20)

    meshRootTransformBuffer.set(rootTransform.transpose().data)

    colorBuffer.set(color.data)
  }

  protected loadGlobalBuffer(): void {
    const pipelineBuffer = new Float32Array(
      this.buffer,
      0,
      this.GLOBAL_BUFFER_SIZE_BYTES / Float32Array.BYTES_PER_ELEMENT
    )

    const rootClipTransformBuffer = pipelineBuffer.subarray(0, 16)

    const camera = this.cameraCollector.collect()[0]

    rootClipTransformBuffer.set(RootClipTransform.getEntityData(camera).data)

    this.device.queue.writeBuffer(
      this.globalBuffer,
      0,
      this.buffer,
      0,
      this.GLOBAL_BUFFER_SIZE_BYTES
    )
  }

  protected override prerender(
    prevEntityCount: number,
    entityCount: number
  ): void {
    if (entityCount > prevEntityCount) {
      this.growBuffer(
        0,
        this.GLOBAL_BUFFER_SIZE_BYTES +
          this.OFFSET_ENTITY_BUFFER_SIZE_BYTES * entityCount
      )

      this.entityBuffer = this.createEntityBuffer(entityCount)
      this.bindGroup = this.createBindGroup(
        this.globalBuffer,
        this.entityBuffer
      )
    }

    this.loadGlobalBuffer()

    this.device.queue.writeBuffer(
      this.entityBuffer!,
      0,
      this.buffer,
      this.GLOBAL_BUFFER_SIZE_BYTES,
      this.OFFSET_ENTITY_BUFFER_SIZE_BYTES * entityCount
    )
  }

  override renderEntity(
    renderPass: GPURenderPassEncoder,
    entity: Entity,
    renderIndex: number
  ) {
    if (!this.bindGroup) {
      return
    }

    this.loadEntityBuffer(entity, renderIndex)

    const meshBuffer = MeshBuffer.getEntityData(entity)

    renderPass.setBindGroup(0, this.bindGroup, [
      this.OFFSET_ENTITY_BUFFER_SIZE_BYTES * renderIndex,
    ])
    renderPass.setVertexBuffer(0, meshBuffer)

    renderPass.draw(6)
  }
}
