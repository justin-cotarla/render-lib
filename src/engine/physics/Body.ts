import { Vec3 } from '../../math/Vec3'
import { RigidNode } from '../nodes/RigidNode'

export class Body<N extends RigidNode = RigidNode> {
  gravity = true

  private inverseMass: number

  linearVelocity = Vec3.zero()

  force = Vec3.zero()
  linearImpulse = Vec3.zero()

  constructor(
    readonly node: N,
    readonly mass = 1
  ) {
    this.inverseMass = 1 / mass
  }

  public eulerIntegrate = (dt: number): void => {
    const acceleration = this.force.scale(this.inverseMass)
    this.linearVelocity.add(acceleration.scale(dt))

    this.linearVelocity.add(this.linearImpulse.scale(this.inverseMass))

    this.node.position.add(
      this.linearVelocity
        .clone()
        .scale(dt)
        .upgrade(1)
        .applyMatrix(this.node.getParentNodeRotation())
        .downgrade()
    )

    this.force.zero()
    this.linearImpulse.zero()
  }
}
