import { DefaultComponent } from '../../ecs/DefaultComponent'
import { Vec3 } from '../../math/Vec3'

export const Velocity = new DefaultComponent<Vec3>('VELOCITY', new Vec3())
