import { Vec4 } from '../../math/Vec4'
import { DefaultComponent } from '../../ecs/DefaultComponent'

export const FlatColor = new DefaultComponent<Vec4>(
  'FLAT_COLOR',
  new Vec4([0, 0, 0, 0])
)
