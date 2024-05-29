import { Vec4 } from '../../math/Vec4'
import { DefaultComponent } from '../../ecs/DefaultComponent'

export const Material = new DefaultComponent<{
  diffuse: Vec4
  specular: Vec4
  ambient: Vec4
  gloss: number
}>('MATERIAL', {
  diffuse: new Vec4(1, 0, 0, 1),
  specular: new Vec4(1, 1, 1, 1),
  ambient: new Vec4(1, 0, 0, 1),
  gloss: 16,
})
