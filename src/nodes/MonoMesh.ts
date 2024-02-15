import { Vec3 } from '../math/Vec3'
import { Vec4 } from '../math/Vec4'
import { Mesh, Triangle } from './Mesh'

interface Material {
  diffuse: Vec4
  specular: Vec4
  ambient: Vec4
  gloss: number
}

export class MonoMesh extends Mesh {
  public static DEFAULT_MATERIAL: Material = {
    diffuse: new Vec4(1, 0, 0, 1),
    specular: new Vec4(1, 1, 1, 1),
    ambient: new Vec4(1, 0, 0, 1),
    gloss: 16,
  }

  private _material: Material
  private _materialData: Float32Array

  constructor(
    triangles: Triangle[],
    vertices: Vec3[],
    normals: Vec3[],
    material?: Material
  ) {
    super(triangles, vertices, normals)

    this._material = material ?? MonoMesh.DEFAULT_MATERIAL

    this._materialData = this.computeMaterialData()
  }

  private computeMaterialData = (): Float32Array => {
    return new Float32Array([
      ...this._material.diffuse.toArray(),
      ...this._material.specular.toArray(),
      ...this._material.ambient.toArray(),
      this._material.gloss,
    ])
  }

  public get material(): Material {
    return this._material
  }

  public set material(material: Material) {
    this._material = material
    this._materialData = this.computeMaterialData()
  }

  public get materialData(): Float32Array {
    return this._materialData
  }
}
