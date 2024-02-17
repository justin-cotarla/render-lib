import { Vec3 } from '../math/Vec3'

export class AABB {
  public minPoint: Vec3
  public maxPoint: Vec3

  constructor(minPoint?: Vec3, maxPoint?: Vec3) {
    this.minPoint = minPoint ?? new Vec3(Infinity, Infinity, Infinity)
    this.maxPoint = maxPoint ?? new Vec3(-Infinity, -Infinity, -Infinity)
  }

  public addPoint = (point: Vec3) => {
    for (let i = 0; i < 3; i++) {
      if (point[i] <= this.minPoint[i]) {
        this.minPoint[i] = point[i]
      }
      if (point[i] >= this.maxPoint[i]) {
        this.maxPoint[i] = point[i]
      }
    }
  }

  public intersects = (incoming: AABB): boolean => {
    for (let i = 0; i < 3; i++) {
      if (incoming.minPoint[i] >= this.maxPoint[i]) {
        return false
      }
      if (incoming.maxPoint[i] <= this.minPoint[i]) {
        return false
      }
    }
    return true
  }

  public computeCollisionNormal = (incoming: AABB): Vec3 => {
    if (!this.intersects(incoming)) {
      return Vec3.zero()
    }

    let minPenetration = Infinity
    let penetrationAxis = 0

    let currentPenetration = 0

    const collisonNormal = Vec3.zero()

    for (let i = 0; i < 3; i++) {
      currentPenetration = this.maxPoint[i] - incoming.minPoint[i]

      if (currentPenetration > 0 && currentPenetration < minPenetration) {
        minPenetration = currentPenetration
        penetrationAxis = i
      }

      currentPenetration = incoming.maxPoint[i] - this.minPoint[i]

      if (currentPenetration > 0 && currentPenetration < minPenetration) {
        minPenetration = currentPenetration
        penetrationAxis = i
      }
    }

    if (minPenetration === Infinity) {
      return collisonNormal
    }

    collisonNormal[penetrationAxis] = minPenetration

    return collisonNormal
  }

  public translate = (value: Vec3): AABB => {
    const translatedAabb = new AABB(
      this.minPoint.clone(),
      this.maxPoint.clone()
    )
    translatedAabb.maxPoint.add(value)
    translatedAabb.minPoint.add(value)

    return translatedAabb
  }

  public toString = (): string => {
    return `min: ${this.minPoint.toString()}; max: ${this.maxPoint.toString()}`
  }
}
