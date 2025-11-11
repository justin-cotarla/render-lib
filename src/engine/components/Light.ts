import { Vec4 } from '../../math/Vec4.ts'
import { DefaultComponent } from '../../ecs/DefaultComponent.ts'

export interface Light {
  diffuse: Vec4
  specular: Vec4
}

export const Light = new DefaultComponent<Light>('LIGHT', {
  diffuse: new Vec4([1, 0, 0, 1]),
  specular: new Vec4([1, 1, 1, 1]),
})
