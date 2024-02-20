import { Vec3 } from '../math/Vec3'
import { RigidNode } from '../nodes/RigidNode'

export class Body {
  gravity = true

  linearVelocity = Vec3.zero()

  force = Vec3.zero()

  constructor(
    readonly node: RigidNode,
    readonly mass: number
  ) {}
}
