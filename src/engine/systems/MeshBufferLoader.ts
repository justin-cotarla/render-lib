import { System } from '../../ecs/System.ts'
import { Mesh } from '../components/Mesh.ts'
import { MeshBuffer } from '../components/MeshBuffer.ts'

export class MeshBufferLoader extends System {
  constructor(readonly device: GPUDevice) {
    super()
    this.registerComponent(Mesh)
  }

  private computeVertexData = (mesh: Mesh): Float32Array<ArrayBuffer> => {
    return new Float32Array(
      mesh.triangles.flatMap(({ vertexIndices, normalIndices }) =>
        Array.from({ length: 3 }).flatMap((_, index) => [
          ...mesh.vertices[vertexIndices[index]].data,
          1,
          ...mesh.normals[normalIndices[index]].data,
          0,
        ])
      ),
    )
  }

  public loadBuffers() {
    for (const entity of this.getMatchedEntities()) {
      const mesh = Mesh.getEntityData(entity.id)
      const vertexData = this.computeVertexData(mesh)

      const vertexBuffer = this.device.createBuffer({
        label: `vertex_buffer_${entity.id}`,
        size: vertexData.byteLength,
        usage: GPUBufferUsage.VERTEX,
        mappedAtCreation: true,
      })

      const buffer = new Float32Array(vertexBuffer.getMappedRange())
      buffer.set(vertexData)
      vertexBuffer.unmap()

      entity.addComponent(MeshBuffer, vertexBuffer)
    }
  }
}
