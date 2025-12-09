import { Vec4 } from '../../math/Vec4'
import { Component } from 'reactive-ecs'

export interface Material {
  diffuse: Vec4
  specular: Vec4
  ambient: Vec4
  gloss: number
}

export const Material = new Component<Material>('MATERIAL')

// TODO: Do not compute this buffer on every render, it is static
export const computeMaterialBuffer = (material: Material): Float32Array => {
  const buffer = new Float32Array(13)
  buffer.set(material.diffuse.data, 0)
  buffer.set(material.specular.data, 4)
  buffer.set(material.ambient.data, 8)
  buffer.set([material.gloss], 12)

  return buffer
}
