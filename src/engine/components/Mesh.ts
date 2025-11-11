import { Component } from '../../ecs/Component.ts'
import { Vec3 } from '../../math/Vec3.ts'

export interface Triangle {
  vertexIndices: [number, number, number]
  normalIndices: [number, number, number]
}

export interface Mesh {
  vertices: Vec3[]
  normals: Vec3[]
  triangles: Triangle[]
}

export const Mesh = new Component<Mesh>('MESH')
