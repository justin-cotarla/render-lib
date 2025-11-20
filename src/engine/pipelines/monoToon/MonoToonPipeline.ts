import { Entity } from '../../../ecs/Entity.ts'
import { Vec4 } from '../../../math/Vec4.ts'
import { computeMaterialBuffer, Material } from '../../components/Material.ts'
import { Mesh } from '../../components/Mesh.ts'
import { MeshBuffer } from '../../components/MeshBuffer.ts'
import { RootTransform } from '../../components/RootTransform.ts'
import { PerspectiveCameraCollector } from '../../systems/CameraCollector.ts'
import { LightCollector } from '../../systems/LightCollector.ts'
import { Pipeline } from '../../systems/Pipeline.ts'

import shader from './shader.wgsl' with { type: 'text' }

export class MonoToonPipeline extends Pipeline {
  private lightCollector = new LightCollector()
  private perspectiveCameraCollector = new PerspectiveCameraCollector()

  private pipelineBuffer: GPUBuffer
  private entityBuffer?: GPUBuffer

  private bindGroup?: GPUBindGroup

  readonly PIPELINE_BUFFER_SIZE_BYTES = Float32Array.BYTES_PER_ELEMENT * 24
  readonly ENTITY_BUFFER_SIZE_PER_ENTITY_BYTES =
    Float32Array.BYTES_PER_ELEMENT * 32

  constructor(readonly device: GPUDevice) {
    const renderPipeline = device.createRenderPipeline({
      label: 'mono_toon_pipeline',
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
      layout: 'auto',
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

    super(
      renderPipeline,
      'MONO_TOON_PIPELINE',
    )

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
      size: this.ENTITY_BUFFER_SIZE_PER_ENTITY_BYTES * entityCount,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })
  }

  private createBindGroup(
    pipelineBuffer: GPUBuffer,
    entityBuffer: GPUBuffer,
  ): GPUBindGroup {
    return this.device.createBindGroup({
      label: `${this.name}_bindgroup`,
      layout: this.renderPipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: { buffer: pipelineBuffer },
        },
        {
          binding: 1,
          resource: { buffer: entityBuffer },
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
        renderIndex * this.ENTITY_BUFFER_SIZE_PER_ENTITY_BYTES,
    )

    const meshRootTransformBuffer = entityBuffer.subarray(0, 16)
    const materialBuffer = entityBuffer.subarray(16, 32)

    meshRootTransformBuffer.set(rootTransform.transpose().data)

    materialBuffer.set(computeMaterialBuffer(material))
  }

  protected loadGlobalBuffer(): void {
    const rootClipTransformBuffer = new Float32Array(this.buffer).subarray(
      0,
      16,
    )
    const cameraPosRootBuffer = new Float32Array(this.buffer).subarray(16, 20)
    const lightPosRootBuffer = new Float32Array(this.buffer).subarray(20, 24)

    const camera = this.perspectiveCameraCollector.collect()[0]
    const lights = this.lightCollector.collect()

    rootClipTransformBuffer.set(camera.rootClipTransform.data)

    cameraPosRootBuffer.set(
      new Vec4([0, 0, 0, 1]).applyMatrix(camera.rootTransform).data,
    )

    lightPosRootBuffer.set(
      new Vec4([0, 0, 0, 1]).applyMatrix(lights[0].rootTransform).data,
    )
  }

  protected override prerender(
    entityCount: number,
    prevEntityCount: number,
  ): void {
    if (entityCount > prevEntityCount) {
      this.growBuffer(
        0,
        this.PIPELINE_BUFFER_SIZE_BYTES +
          this.ENTITY_BUFFER_SIZE_PER_ENTITY_BYTES * entityCount,
      )

      this.entityBuffer = this.createEntityBuffer(entityCount)
      this.bindGroup = this.createBindGroup(
        this.pipelineBuffer,
        this.entityBuffer,
      )
    }
  }

  override renderEntity(
    renderPass: GPURenderPassEncoder,
    entity: Entity,
    renderIndex: number,
  ) {
    if (!this.bindGroup) {
      return
    }

    this.loadEntityBuffer(entity, renderIndex)

    const vertexCount = Mesh.getEntityData(entity).triangles.length * 3
    const meshBuffer = MeshBuffer.getEntityData(entity)

    renderPass.setBindGroup(0, this.bindGroup)
    renderPass.setVertexBuffer(0, meshBuffer)

    renderPass.draw(vertexCount)
  }
}
