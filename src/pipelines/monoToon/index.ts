import { Mesh } from '../../nodes/Mesh'
import { PerspectiveCamera } from '../../nodes/PerpectiveCamera'
import { RigidNode } from '../../nodes/RigidNode'
import { Pipeline } from '../Pipeline'

import vertexShader from './perspective.vert.wgsl?raw'
import fragmentShader from './toon.frag.wgsl?raw'

interface MeshShape extends Mesh {
  materialData: Float32Array
}

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

  protected createGpuBuffers(): GPUBuffer[] {
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

  public loadBuffers(
    mesh: MeshShape,
    camera: PerspectiveCamera,
    light: RigidNode
  ) {
    if (!mesh.pipelineData) {
      throw new Error(`Mesh ${mesh.ID} does not have pipeline data`)
    }

    const {
      buffers: [vsBuffer, fsBuffer],
      uniformData,
    } = mesh.pipelineData

    let dataOffset = 0
    let currentBufferOffset = 0

    // VSInput
    // Mesh clip transform
    const meshClipTransformData = mesh
      .getRootNodeTransform()
      .multiply(camera.getNodeRootTransform().multiply(camera.clipTransform))
      .transpose()
      .toArray()

    uniformData.set(meshClipTransformData, dataOffset)
    this.device.queue.writeBuffer(
      vsBuffer,
      currentBufferOffset,
      uniformData,
      dataOffset,
      meshClipTransformData.length
    )
    dataOffset += meshClipTransformData.length

    // FSInput
    currentBufferOffset = 0
    const worldModelTransform = mesh.getNodeRootTransform()

    // Camera Position
    const cameraPosModelData = camera.position
      .upgrade(1)
      .applyMatrix(worldModelTransform)
      .toArray()

    uniformData.set(cameraPosModelData, dataOffset)
    this.device.queue.writeBuffer(
      fsBuffer,
      currentBufferOffset,
      uniformData,
      dataOffset,
      cameraPosModelData.length
    )
    dataOffset += cameraPosModelData.length
    currentBufferOffset +=
      cameraPosModelData.length * Float32Array.BYTES_PER_ELEMENT

    // Light Position
    const lightPosModelData = light.position
      .upgrade(1)
      .applyMatrix(worldModelTransform)
      .toArray()

    uniformData.set(lightPosModelData, dataOffset)
    this.device.queue.writeBuffer(
      fsBuffer,
      currentBufferOffset,
      uniformData,
      dataOffset,
      lightPosModelData.length
    )
    dataOffset += lightPosModelData.length
    currentBufferOffset +=
      lightPosModelData.length * Float32Array.BYTES_PER_ELEMENT

    // Material
    uniformData.set(mesh.materialData, dataOffset)
    this.device.queue.writeBuffer(
      fsBuffer,
      currentBufferOffset,
      uniformData,
      dataOffset,
      mesh.materialData.length
    )
  }
}
