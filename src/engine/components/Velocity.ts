import { DefaultComponent } from '../../ecs/DefaultComponent.ts'
import { Vec3 } from '../../math/Vec3.ts'

export const Velocity = new DefaultComponent<Vec3>('VELOCITY', new Vec3())
