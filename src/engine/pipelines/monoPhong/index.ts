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

    super(device, renderPipeline, 16 + 24)
  }

  public createGpuBuffers() {
    const vsBuffer = this.device.createBuffer({
      label: 'vs_uni',
      size: Float32Array.BYTES_PER_ELEMENT * 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })

    const fsBuffer = this.device.createBuffer({
      label: 'fs_uni',
      size: Float32Array.BYTES_PER_ELEMENT * 24,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })

    return [vsBuffer, fsBuffer]
  }

  public loadMeshBuffers(
    ...[{ bindGroupData, mesh, scene }]: Parameters<Pipeline['loadMeshBuffers']>
  ) {
    const {
      gpuBuffers: [vsBuffer, fsBuffer],
      uniformBuffer,
    } = bindGroupData

    const meshClipTransformBuffer = uniformBuffer.subarray(0, 16)
    const cameraPosModelBuffer = uniformBuffer.subarray(16, 20)
    const lightPosModelBuffer = uniformBuffer.subarray(20, 24)
    const materialBuffer = uniformBuffer.subarray(24, 40)

    // VSUni
    meshClipTransformBuffer.set(
      mesh.rootTransform
        .clone()
        .multiply(scene.camera.localTransform)
        .multiply(computeClipTransform(scene.camera.perspectiveCamera))
        .transpose()
        .toArray()
    )

    cameraPosModelBuffer.set(
      new Vec4(0, 0, 0, 1)
        .applyMatrix(scene.camera.rootTransform)
        .applyMatrix(mesh.localTransform)
        .toArray()
    )

    lightPosModelBuffer.set(
      new Vec4(0, 0, 0, 1)
        .applyMatrix(scene.lights[0].rootTransform)
        .applyMatrix(mesh.localTransform)
        .toArray()
    )

    materialBuffer.set(computeMaterialBuffer(mesh.material))

    this.device.queue.writeBuffer(vsBuffer, 0, uniformBuffer, 0, 16)
    this.device.queue.writeBuffer(fsBuffer, 0, uniformBuffer, 16, 24)
  }
}
