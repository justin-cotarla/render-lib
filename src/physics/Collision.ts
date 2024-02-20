import { Vec3 } from '../math/Vec3'
import { Body } from './Body'

export interface Collision {
  referenceBody: Body
  collidingBody: Body
  collisionPos: Vec3
  collisionNormal: Vec3
  penetrationDepth: number
}
