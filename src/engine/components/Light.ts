import { Vec4 } from '../../math/Vec4'
import { DefaultComponent } from '../../ecs/DefaultComponent'

export const Light = new DefaultComponent<{
  diffuse: Vec4
  specular: Vec4
}>('LIGHT', {
  diffuse: new Vec4(1, 0, 0, 1),
  specular: new Vec4(1, 1, 1, 1),
})
