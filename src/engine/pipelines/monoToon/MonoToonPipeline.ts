import { Component } from '../../../ecs/Component'
import { Entity } from '../../../ecs/Entity'
import { Vec4 } from '../../../math/Vec4'
import { EntityBuffer } from '../../components/EntityBuffer'
import { GlobalBuffer } from '../../components/GlobalBuffer'
import { computeMaterialBuffer, Material } from '../../components/Material'
import { RootTransform } from '../../components/RootTransform'
import { PerspectiveCameraCollector } from '../../systems/CameraCollector'
import { LightCollector } from '../../systems/LightCollector'
import { Pipeline } from '../../systems/Pipeline'

import shader from './shader.wgsl?raw'

export class MonoToonPipeline extends Pipeline {
  private lightCollector = new LightCollector()
  private perspectiveCameraCollector = new PerspectiveCameraCollector()

  constructor(device: GPUDevice) {
    const vertexDescriptor: GPUVertexState = {
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
    }

    const fragmentDescriptor: GPUFragmentState = {
      module: device.createShaderModule({
        code: shader,
      }),
      targets: [
        {
          format: navigator.gpu.getPreferredCanvasFormat(),
        },
      ],
    }

    const renderPipeline = device.createRenderPipeline({
      label: 'mono_toon_pipeline',
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
      new Component<GPUBindGroup>('MONO_TOON_PIPELINE')
    )

    this.registerComponent(Material)
  }

  protected get globalBuffer(): GlobalBuffer {
    return super.globalBuffer!
  }

  public createBindGroup(gpuBuffer: GPUBuffer): GPUBindGroup {
    return this.device.createBindGroup({
      label: 'mono_toon_bindgroup',
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

  public createGlobalBuffer(): GlobalBuffer {
    return {
      gpuBuffer: this.device.createBuffer({
        label: 'global_uni',
        size: Float32Array.BYTES_PER_ELEMENT * 24,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      }),
      buffer: new Float32Array(24),
    }
  }

  public createEntityBuffer() {
    return {
      gpuBuffer: this.device.createBuffer({
        label: 'entity_uni',
        size: Float32Array.BYTES_PER_ELEMENT * 32,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      }),
      buffer: new Float32Array(32),
    } satisfies EntityBuffer
  }

  protected loadEntityBuffer(entity: Entity) {
    const { buffer, gpuBuffer } = EntityBuffer.getEntityData(entity)
    const material = Material.getEntityData(entity)
    const rootTransform = RootTransform.getEntityData(entity)

    const meshRootTransformBuffer = buffer.subarray(0, 16)
    const materialBuffer = buffer.subarray(16, 32)

    meshRootTransformBuffer.set(rootTransform.transpose().data)

    materialBuffer.set(computeMaterialBuffer(material))

    this.device.queue.writeBuffer(gpuBuffer, 0, buffer, 0, 32)
  }

  protected loadGlobalBuffer(): void {
    const rootClipTransformBuffer = this.globalBuffer.buffer.subarray(0, 16)
    const cameraPosRootBuffer = this.globalBuffer.buffer.subarray(16, 20)
    const lightPosRootBuffer = this.globalBuffer.buffer.subarray(20, 24)

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
      this.globalBuffer.gpuBuffer,
      0,
      this.globalBuffer.buffer,
      0,
      24
    )
  }
}
