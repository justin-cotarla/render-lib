import { Vec3 } from '../math/Vec3'
import { AABB } from './AABB'
import { Body } from './Body'

interface Collision {
  referenceBody: Body
  collidingBody: Body
  collisionNormal: Vec3
  collisionPos: Vec3
}

export class PhysicsEngine {
  protected bodies: Body[] = []

  public registerBody = (body: Body) => {
    this.bodies.push(body)
  }

  public update(dt: number) {
    this.bodies.forEach((body) => {
      body.eulerIntegrate(dt)
    })
    // const collisions = this.computeCollisions()
  }

  private computeCollisions = () => {
    const collisions: Collision[] = []
    let referenceAabb: AABB | undefined
    let collidingAabb: AABB | undefined

    for (let i = 0; i < Math.floor(this.bodies.length / 2) + 1; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        referenceAabb = this.bodies[i].node.aabb?.translate(
          this.bodies[i].node.position
        )
        collidingAabb = this.bodies[j].node.aabb?.translate(
          this.bodies[j].node.position
        )

        if (!referenceAabb || !collidingAabb) {
          continue
        }

        if (!referenceAabb.intersects(collidingAabb)) {
          continue
        }

        collisions.push({
          referenceBody: this.bodies[i],
          collidingBody: this.bodies[j],
          collisionNormal: referenceAabb.computeCollisionNormal(collidingAabb),
          collisionPos: this.bodies[i].node.position,
        })
      }
    }

    return collisions
  }
}
