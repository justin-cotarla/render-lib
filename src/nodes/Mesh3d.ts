import { Vec3 } from '../math/Vec3'
import { RigidNode } from './RigidNode'

export interface Vertex {
  position: Vec3
  normal: Vec3
}

export interface Face {
  vertices: [Vertex, Vertex, Vertex]
}

export class Mesh3d extends RigidNode {
  constructor(readonly faces: Face[]) {
    super()
  }

  public toFloat32Array = (): Float32Array => {
    return new Float32Array(
      this.faces.flatMap(({ vertices }) =>
        vertices.flatMap(({ normal, position }) => [
          ...position.toArray(),
          1,
          ...normal.toArray(),
          0,
        ])
      )
    )
  }

  public vertexCount = (): number => this.faces.length * 3
}
