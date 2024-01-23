import { Vec3 } from '../math/Vec3'

export interface Vertex {
  position: Vec3
  normal: Vec3
}

export interface Face {
  vertices: [Vertex, Vertex, Vertex]
}

export class Mesh3d {
  constructor(readonly faces: Face[]) {}

  public toFloat32Array = (): Float32Array => {
    return new Float32Array(
      this.faces.flatMap(({ vertices }) =>
        vertices.flatMap(({ normal, position }) => [
          ...position.toArray(),
          ...normal.toArray(),
        ])
      )
    )
  }

  public vertexCount = (): number => this.faces.length * 3
}
