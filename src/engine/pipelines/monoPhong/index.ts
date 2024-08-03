import { Vec4 } from '../../../math/Vec4'
import { computeMaterialBuffer } from '../../components/Material'
import { computeClipTransform } from '../../components/PerspectiveCamera'
import { Pipeline } from '../Pipeline'

import shader from './shader.wgsl?raw'

export class MonoPhongPipeline extends Pipeline {
  static readonly ID = 'MONO_PHONG'

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
      vertex: vertexDescriptor,
      fragment: fragmentDescriptor,
      layout: 'auto',
      primitive: {
        topology: 'triangle-list',
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: 'less',
        format: 'depth24plus',
      },
    })

    super(device, renderPipeline, 56)
  }

  public createGpuBuffers() {
    const entityBuffer = this.device.createBuffer({
      label: 'entity_uni',
      size: Float32Array.BYTES_PER_ELEMENT * 56,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })

    return [entityBuffer]
  }

  public loadMeshBuffers(
    ...[{ bindGroupData, mesh, scene }]: Parameters<Pipeline['loadMeshBuffers']>
  ) {
    const {
      gpuBuffers: [entityBuffer],
      uniformBuffer,
    } = bindGroupData

    const rootClipTransformBuffer = uniformBuffer.subarray(0, 16)
    const meshRootTransformBuffer = uniformBuffer.subarray(16, 32)
    const cameraPosRootBuffer = uniformBuffer.subarray(32, 36)
    const lightPosRootBuffer = uniformBuffer.subarray(36, 40)
    const materialBuffer = uniformBuffer.subarray(40, 56)

    // VSUni
    rootClipTransformBuffer.set(
      scene.camera.localTransform
        .clone()
        .multiply(computeClipTransform(scene.camera.perspectiveCamera))
        .transpose()
        .toArray()
    )

    meshRootTransformBuffer.set(mesh.rootTransform.transpose().toArray())

    cameraPosRootBuffer.set(
      new Vec4(0, 0, 0, 1).applyMatrix(scene.camera.rootTransform).toArray()
    )

    lightPosRootBuffer.set(
      new Vec4(0, 0, 0, 1).applyMatrix(scene.lights[0].rootTransform).toArray()
    )

    materialBuffer.set(computeMaterialBuffer(mesh.material))

    this.device.queue.writeBuffer(entityBuffer, 0, uniformBuffer, 0, 56)
  }
}
