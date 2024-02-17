import { Vec3 } from '../math/Vec3'

export class AABB {
  public minPoint: Vec3
  public maxPoint: Vec3

  constructor() {
    this.minPoint = new Vec3(Infinity, Infinity, Infinity)
    this.maxPoint = new Vec3(-Infinity, -Infinity, -Infinity)
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

  public intersects = (target: AABB): boolean => {
    for (let i = 0; i < 3; i++) {
      if (target.minPoint[i] >= this.maxPoint[i]) {
        return false
      }
      if (target.maxPoint[i] <= this.minPoint[i]) {
        return false
      }
    }
    return true
  }
}
