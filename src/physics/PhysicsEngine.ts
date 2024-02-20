import { AABB } from './AABB'
import { Body } from './Body'
import { Collision } from './Collision'

export class PhysicsEngine {
  protected bodies: Body[] = []

  public registerBody = (body: Body) => {
    this.bodies.push(body)
  }

  public update(dt: number) {
    const collisions = this.computeCollisions()

    collisions.forEach(
      ({ referenceBody, collidingBody, collisionNormal, penetrationDepth }) => {
        referenceBody.node.position.add(
          collisionNormal.clone().scale(-penetrationDepth)
        )
        collidingBody.node.position.add(
          collisionNormal.clone().scale(penetrationDepth)
        )
      }
    )

    this.bodies.forEach((body) => {
      body.eulerIntegrate(dt)
    })
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

        const collisionData = referenceAabb.computeCollision(collidingAabb)

        if (!collisionData) {
          continue
        }

        collisions.push({
          referenceBody: this.bodies[i],
          collidingBody: this.bodies[j],
          collisionPos: this.bodies[i].node.position,
          ...collisionData,
        })
      }
    }

    return collisions
  }
}
