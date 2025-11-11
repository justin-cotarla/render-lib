import { DefaultComponent } from '../../ecs/DefaultComponent.ts'
import { Vec3 } from '../../math/Vec3.ts'

export const Force = new DefaultComponent<Vec3>('FORCE', new Vec3())
