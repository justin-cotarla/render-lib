import { DefaultComponent } from '../../ecs/DefaultComponent'
import { Vec3 } from '../../math/Vec3'

export const LinearImpulse = new DefaultComponent<Vec3>(
  'LINEAR_IMPULSE',
  new Vec3()
)
