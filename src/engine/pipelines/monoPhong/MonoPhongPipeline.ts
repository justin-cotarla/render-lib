import { Component } from '../../../ecs/Component.ts'
import { Entity } from '../../../ecs/Entity.ts'
import { Vec4 } from '../../../math/Vec4.ts'
import { EntityBuffer } from '../../components/EntityBuffer.ts'
import { GlobalBuffer } from '../../components/GlobalBuffer.ts'
import { computeMaterialBuffer, Material } from '../../components/Material.ts'
import { RootTransform } from '../../components/RootTransform.ts'
import { PerspectiveCameraCollector } from '../../systems/CameraCollector.ts'
import { LightCollector } from '../../systems/LightCollector.ts'
import { Pipeline } from '../../systems/Pipeline.ts'

import shader from './shader.wgsl' with { type: 'text' }

export class MonoPhongPipeline extends Pipeline {
  private lightCollector = new LightCollector()
  private perspectiveCameraCollector = new PerspectiveCameraCollector()

  constructor(device: GPUDevice) {
    const vertexDescriptor: GPUVertexState = {
      module: device.createShaderModule({
        code: shader,
      }),
      entryPoint: 'vert',
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
    }

    const fragmentDescriptor: GPUFragmentState = {
      module: device.createShaderModule({
        code: shader,
      }),
      entryPoint: 'frag',
      targets: [
        {
          format: navigator.gpu.getPreferredCanvasFormat(),
        },
      ],
    }

    const renderPipeline = device.createRenderPipeline({
      label: 'mono_phong_pipeline',
      vertex: vertexDescriptor,
      fragment: fragmentDescriptor,
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
      device,
      renderPipeline,
      new Component<GPUBindGroup>('MONO_PHONG_PIPELINE'),
    )

    this.registerComponent(Material)
  }

  protected override get globalBuffer(): GlobalBuffer {
    return super.globalBuffer!
  }

  public override createBindGroup(gpuBuffer: GPUBuffer): GPUBindGroup {
    return this.device.createBindGroup({
      label: 'mono_phong_bindgroup',
      layout: this.renderPipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: { buffer: this.globalBuffer.gpuBuffer },
        },
        {
          binding: 1,
          resource: { buffer: gpuBuffer },
        },
      ],
    })
  }

  public override createGlobalBuffer(): GlobalBuffer {
    return {
      gpuBuffer: this.device.createBuffer({
        label: 'global_uni',
        size: Float32Array.BYTES_PER_ELEMENT * 24,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      }),
      buffer: new Float32Array(24),
    }
  }

  public override createEntityBuffer() {
    return {
      gpuBuffer: this.device.createBuffer({
        label: 'entity_uni',
        size: Float32Array.BYTES_PER_ELEMENT * 32,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      }),
      buffer: new Float32Array(32),
    } satisfies EntityBuffer
  }

  protected override loadEntityBuffer(entity: Entity) {
    const { buffer, gpuBuffer } = EntityBuffer.getEntityData(entity)
    const material = Material.getEntityData(entity)
    const rootTransform = RootTransform.getEntityData(entity)

    const meshRootTransformBuffer = buffer.subarray(0, 16)
    const materialBuffer = buffer.subarray(16, 32)

    meshRootTransformBuffer.set(rootTransform.transpose().data)

    materialBuffer.set(computeMaterialBuffer(material))

    this.device.queue.writeBuffer(gpuBuffer, 0, buffer, 0, buffer.byteLength)
  }

  protected override loadGlobalBuffer(): void {
    const rootClipTransformBuffer = this.globalBuffer.buffer.subarray(0, 16)
    const cameraPosRootBuffer = this.globalBuffer.buffer.subarray(16, 20)
    const lightPosRootBuffer = this.globalBuffer.buffer.subarray(20, 24)

    const camera = this.perspectiveCameraCollector.collect()[0]
    const lights = this.lightCollector.collect()

    rootClipTransformBuffer.set(camera.rootClipTransform.data)

    cameraPosRootBuffer.set(
      new Vec4([0, 0, 0, 1]).applyMatrix(camera.rootTransform).data,
    )

    lightPosRootBuffer.set(
      new Vec4([0, 0, 0, 1]).applyMatrix(lights[0].rootTransform).data,
    )

    this.device.queue.writeBuffer(
      this.globalBuffer.gpuBuffer,
      0,
      this.globalBuffer.buffer,
      0,
      this.globalBuffer.buffer.byteLength,
    )
  }
}
