import { Vec3 } from '../../math/Vec3'
import { AABB } from '../physics/AABB'
import { PipelineData } from '../pipelines/Pipeline'
import { RigidNode } from './RigidNode'

export interface Triangle {
  vertexIndices: [number, number, number]
  normalIndices: [number, number, number]
}

export class Mesh extends RigidNode {
  public aabb: AABB

  public pipelineData?: PipelineData

  public vertexBuffer?: GPUBuffer
  public vertexData: Float32Array
  public normals: Vec3[]

  constructor(
    readonly triangles: Triangle[],
    readonly vertices: Vec3[],
    normals: Vec3[]
  ) {
    super()
    this.normals = normals
    this.vertexData = this.computeVertexData()

    this.aabb = this.computeAABB()
  }

  protected computeVertexData = (): Float32Array => {
    return new Float32Array(
      this.triangles.flatMap(({ vertexIndices, normalIndices }) =>
        Array.from({ length: 3 }).flatMap((_, index) => [
          ...this.vertices[vertexIndices[index]].toArray(),
          1,
          ...this.normals[normalIndices[index]].toArray(),
          0,
        ])
      )
    )
  }

  public renormalize = (): Mesh => {
    this.triangles.forEach(({ normalIndices }) =>
      normalIndices.forEach((index) => this.normals[index].set([0, 0, 0]))
    )

    this.triangles.forEach(({ vertexIndices, normalIndices }) => {
      const v0 = this.vertices[vertexIndices[0]]
      const v1 = this.vertices[vertexIndices[1]]
      const v2 = this.vertices[vertexIndices[2]]

      const triangleNormal = v1
        .clone()
        .subtract(v0)
        .cross(v2.clone().subtract(v1))
        .normalize()

      for (let i = 0; i < 3; i++) {
        this.normals[normalIndices[i]].add(triangleNormal)
      }
    })

    this.triangles.forEach(({ normalIndices }) =>
      normalIndices.forEach((index) => this.normals[index].normalize())
    )

    this.vertexData = this.computeVertexData()

    return this
  }

  public vertexCount = (): number => this.triangles.length * 3

  private computeAABB = (): AABB => {
    const aabb = new AABB()
    this.vertices.forEach(aabb.addPoint)

    return aabb
  }
}
