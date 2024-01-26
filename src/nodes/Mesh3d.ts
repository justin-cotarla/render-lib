import { Vec3 } from '../math/Vec3'
import { RigidNode } from './RigidNode'

export interface Vertex {
  position: Vec3
  normal: Vec3
}

export interface Triangle {
  vertexIndices: [number, number, number]
}

export class Mesh3d extends RigidNode {
  constructor(
    readonly triangles: Triangle[],
    readonly vertices: Vertex[]
  ) {
    super()
    this.renormalize()
  }

  public toFloat32Array = (): Float32Array => {
    return new Float32Array(
      this.triangles.flatMap(({ vertexIndices }) =>
        vertexIndices.flatMap((index) => [
          ...this.vertices[index].position.toArray(),
          1,
          ...this.vertices[index].normal.toArray(),
          0,
        ])
      )
    )
  }

  public renormalize = (): this => {
    this.triangles.forEach(({ vertexIndices }) =>
      vertexIndices.forEach((index) =>
        this.vertices[index].normal.set([0, 0, 0])
      )
    )

    this.triangles.forEach(({ vertexIndices }) => {
      const v0 = this.vertices[vertexIndices[0]].position
      const v1 = this.vertices[vertexIndices[1]].position
      const v2 = this.vertices[vertexIndices[2]].position

      const triangleNormal = v1
        .clone()
        .subtract(v0)
        .cross(v2.clone().subtract(v1))
        .normalize()

      for (let i = 0; i < 3; i++) {
        this.vertices[vertexIndices[i]].normal.add(triangleNormal)
      }
    })

    this.triangles.forEach(({ vertexIndices }) =>
      vertexIndices.forEach((index) => this.vertices[index].normal.normalize())
    )

    return this
  }

  public vertexCount = (): number => this.triangles.length * 3
}
