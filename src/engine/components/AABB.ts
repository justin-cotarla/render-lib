import { DefaultComponent } from '../../ecs/DefaultComponent'
import { Vec3 } from '../../math/Vec3'

export const AABB = new DefaultComponent<{ minPoint: Vec3; maxPoint: Vec3 }>(
  'AABB',
  {
    maxPoint: new Vec3([Infinity, Infinity, Infinity]),
    minPoint: new Vec3([-Infinity, -Infinity, -Infinity]),
  }
)
