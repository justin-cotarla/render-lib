import { DefaultComponent } from '../../ecs/DefaultComponent'
import { Vec3 } from '../../math/Vec3'

export const Force = new DefaultComponent<Vec3>('FORCE', new Vec3())
