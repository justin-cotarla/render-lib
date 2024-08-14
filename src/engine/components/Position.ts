import { Vec3 } from '../../math/Vec3'
import { DefaultComponent } from '../../ecs/DefaultComponent'

export const Position = new DefaultComponent<Vec3>('POSITION', new Vec3())
