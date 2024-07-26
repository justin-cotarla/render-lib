import { Vec4 } from '../../../math/Vec4'
import { computeMaterialBuffer } from '../../components/Material'
import { computeClipTransform } from '../../components/PerspectiveCamera'
import { Pipeline } from '../Pipeline'

import vertexShader from './perspective.vert.wgsl?raw'
import fragmentShader from './toon.frag.wgsl?raw'

export class MonoToonPipeline extends Pipeline {
  static readonly ID = 'MONO_TOON'

  constructor(device: GPUDevice) {
    const vertexDescriptor: GPUVertexState = {
      module: device.createShaderModule({
        code: vertexShader,
      }),
      entryPoint: 'main',
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
        code: fragmentShader,
      }),
      entryPoint: 'main',
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

  public createGpuBuffers(): GPUBuffer[] {
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

    let dataOffset = 0
    let currentBufferOffset = 0

    // VSInput
    // Mesh clip transform
    const meshClipTransformBuffer = mesh.rootTransform
      .clone()
      .multiply(scene.camera.localTransform)
      .multiply(computeClipTransform(scene.camera.perspectiveCamera))
      .transpose()
      .toArray()

    uniformBuffer.set(meshClipTransformBuffer, dataOffset)
    this.device.queue.writeBuffer(
      vsBuffer,
      currentBufferOffset,
      uniformBuffer,
      dataOffset,
      meshClipTransformBuffer.length
    )
    dataOffset += meshClipTransformBuffer.length

    // FSInput
    currentBufferOffset = 0

    // Camera Position
    const cameraPosModelData = new Vec4(0, 0, 0, 1)
      .applyMatrix(scene.camera.rootTransform)
      .applyMatrix(mesh.localTransform)
      .toArray()

    uniformBuffer.set(cameraPosModelData, dataOffset)
    this.device.queue.writeBuffer(
      fsBuffer,
      currentBufferOffset,
      uniformBuffer,
      dataOffset,
      cameraPosModelData.length
    )
    dataOffset += cameraPosModelData.length
    currentBufferOffset +=
      cameraPosModelData.length * Float32Array.BYTES_PER_ELEMENT

    // Light Position
    const lightPosModelData = new Vec4(0, 0, 0, 1)
      .applyMatrix(scene.lights[0].rootTransform)
      .applyMatrix(mesh.localTransform)
      .toArray()

    uniformBuffer.set(lightPosModelData, dataOffset)
    this.device.queue.writeBuffer(
      fsBuffer,
      currentBufferOffset,
      uniformBuffer,
      dataOffset,
      lightPosModelData.length
    )
    dataOffset += lightPosModelData.length
    currentBufferOffset +=
      lightPosModelData.length * Float32Array.BYTES_PER_ELEMENT

    // Material
    const materialBuffer = computeMaterialBuffer(mesh.material)
    uniformBuffer.set(materialBuffer, dataOffset)
    this.device.queue.writeBuffer(
      fsBuffer,
      currentBufferOffset,
      uniformBuffer,
      dataOffset,
      materialBuffer.length
    )
  }
}
