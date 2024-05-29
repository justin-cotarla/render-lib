import { Vec3 } from '../../math/Vec3'
import { DefaultComponent } from '../../ecs/DefaultComponent'

export interface Triangle {
  vertexIndices: [number, number, number]
  normalIndices: [number, number, number]
}

export const Mesh = new DefaultComponent<{
  vertices: Vec3[]
  normals: Vec3[]
  triangles: Triangle[]
}>('MESH', {
  vertices: [],
  normals: [],
  triangles: [],
})
