import { DefaultComponent } from '../../ecs/DefaultComponent.ts'
import { Vec3 } from '../../math/Vec3.ts'

export const LinearImpulse = new DefaultComponent<Vec3>(
  'LINEAR_IMPULSE',
  new Vec3(),
)
