import { Entity } from '../../../ecs/Entity'
import { Vec4 } from '../../../math/Vec4'
import { computeMaterialBuffer, Material } from '../../components/Material'
import { Mesh } from '../../components/Mesh'
import { MeshBuffer } from '../../components/MeshBuffer'
import { RootTransform } from '../../components/RootTransform'
import { PerspectiveCameraCollector } from '../../systems/CameraCollector'
import { LightCollector } from '../../systems/LightCollector'
import { Pipeline } from '../../systems/Pipeline'

import shader from './shader.wgsl?raw'

export class MonoToonPipeline extends Pipeline {
  private lightCollector = new LightCollector()
  private perspectiveCameraCollector = new PerspectiveCameraCollector()

  private pipelineBuffer: GPUBuffer
  private entityBuffer?: GPUBuffer

  private bindGroup?: GPUBindGroup

  readonly PIPELINE_BUFFER_SIZE_BYTES = Float32Array.BYTES_PER_ELEMENT * 24
  readonly ENTITY_BUFFER_SIZE_BYTES = Float32Array.BYTES_PER_ELEMENT * 32

  readonly OFFSET_ENTITY_BUFFER_SIZE_BYTES: number

  constructor(readonly device: GPUDevice) {
    const name = 'mono_toon'

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
                format: 'float32x4',
              },
              {
                shaderLocation: 1,
                offset: Float32Array.BYTES_PER_ELEMENT * 4,
                format: 'float32x4',
              },
            ],
            arrayStride: Float32Array.BYTES_PER_ELEMENT * 8,
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
                visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX,
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
        cullMode: 'front',
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: 'less',
        format: 'depth24plus',
      },
    })

    super(renderPipeline, name)

    this.OFFSET_ENTITY_BUFFER_SIZE_BYTES =
      Math.ceil(
        this.ENTITY_BUFFER_SIZE_BYTES /
          device.limits.minUniformBufferOffsetAlignment
      ) * device.limits.minUniformBufferOffsetAlignment

    this.registerComponent(Material)
    this.registerComponent(Mesh)
    this.registerComponent(MeshBuffer)

    this.pipelineBuffer = this.createPipelineBuffer()
  }

  private createPipelineBuffer(): GPUBuffer {
    return this.device.createBuffer({
      label: `${this.name}_pipeline_uni`,
      size: this.PIPELINE_BUFFER_SIZE_BYTES,
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
            size: this.PIPELINE_BUFFER_SIZE_BYTES,
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
    const material = Material.getEntityData(entity)
    const rootTransform = RootTransform.getEntityData(entity)

    const entityBuffer = new Float32Array(
      this.buffer,
      this.PIPELINE_BUFFER_SIZE_BYTES +
        renderIndex * this.OFFSET_ENTITY_BUFFER_SIZE_BYTES,
      this.OFFSET_ENTITY_BUFFER_SIZE_BYTES / Float32Array.BYTES_PER_ELEMENT
    )

    const meshRootTransformBuffer = entityBuffer.subarray(0, 16)
    const materialBuffer = entityBuffer.subarray(16, 32)

    meshRootTransformBuffer.set(rootTransform.transpose().data)

    materialBuffer.set(computeMaterialBuffer(material))
  }

  protected loadPipelineBuffer(): void {
    const pipelineBuffer = new Float32Array(
      this.buffer,
      0,
      this.PIPELINE_BUFFER_SIZE_BYTES / Float32Array.BYTES_PER_ELEMENT
    )

    const rootClipTransformBuffer = pipelineBuffer.subarray(0, 16)
    const cameraPosRootBuffer = pipelineBuffer.subarray(16, 20)
    const lightPosRootBuffer = pipelineBuffer.subarray(20, 24)

    const camera = this.perspectiveCameraCollector.collect()[0]
    const lights = this.lightCollector.collect()

    rootClipTransformBuffer.set(camera.rootClipTransform.data)

    cameraPosRootBuffer.set(
      new Vec4([0, 0, 0, 1]).applyMatrix(camera.rootTransform).data
    )

    lightPosRootBuffer.set(
      new Vec4([0, 0, 0, 1]).applyMatrix(lights[0].rootTransform).data
    )

    this.device.queue.writeBuffer(
      this.pipelineBuffer,
      0,
      this.buffer,
      0,
      this.PIPELINE_BUFFER_SIZE_BYTES
    )
  }

  protected override prerender(
    prevEntityCount: number,
    entityCount: number
  ): void {
    if (entityCount > prevEntityCount) {
      this.growBuffer(
        0,
        this.PIPELINE_BUFFER_SIZE_BYTES +
          this.OFFSET_ENTITY_BUFFER_SIZE_BYTES * entityCount
      )

      this.entityBuffer = this.createEntityBuffer(entityCount)
      this.bindGroup = this.createBindGroup(
        this.pipelineBuffer,
        this.entityBuffer
      )
    }

    this.loadPipelineBuffer()

    this.device.queue.writeBuffer(
      this.entityBuffer!,
      0,
      this.buffer,
      this.PIPELINE_BUFFER_SIZE_BYTES,
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

    const vertexCount = Mesh.getEntityData(entity).triangles.length * 3
    const meshBuffer = MeshBuffer.getEntityData(entity)

    renderPass.setBindGroup(0, this.bindGroup, [
      this.OFFSET_ENTITY_BUFFER_SIZE_BYTES * renderIndex,
    ])
    renderPass.setVertexBuffer(0, meshBuffer)

    renderPass.draw(vertexCount)
  }
}
