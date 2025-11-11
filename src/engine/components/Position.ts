import { Vec3 } from '../../math/Vec3.ts'
import { DefaultComponent } from '../../ecs/DefaultComponent.ts'

export const Position = new DefaultComponent<Vec3>('POSITION', new Vec3())
