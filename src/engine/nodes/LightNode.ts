import { Vec4 } from '../../math/Vec4'
import { RigidNode } from './RigidNode'

interface LightColor {
  diffuse: Vec4
  specular: Vec4
}

export class Light extends RigidNode {
  public static DEFAULT_LIGHT_COLOR: LightColor = {
    diffuse: new Vec4(1, 0, 0, 1),
    specular: new Vec4(1, 1, 1, 1),
  }

  public lightColor: LightColor

  constructor(lightColor?: LightColor) {
    super()
    this.lightColor = lightColor ?? Light.DEFAULT_LIGHT_COLOR
  }
}
