import { Vec4 } from '../../math/Vec4'
import { DefaultComponent } from '../../ecs/DefaultComponent'

export interface Material {
  diffuse: Vec4
  specular: Vec4
  ambient: Vec4
  gloss: number
}

export const Material = new DefaultComponent<Material>('MATERIAL', {
  diffuse: new Vec4(1, 0, 0, 1),
  specular: new Vec4(1, 1, 1, 1),
  ambient: new Vec4(1, 0, 0, 1),
  gloss: 16,
})

// TODO: Do not compute this buffer on every render, it is static
export const computeMaterialBuffer = (material: Material): Float32Array => {
  return new Float32Array([
    ...material.diffuse.toArray(),
    ...material.specular.toArray(),
    ...material.ambient.toArray(),
    material.gloss,
  ])
}
