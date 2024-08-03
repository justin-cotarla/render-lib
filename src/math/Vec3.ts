import { AbstractVec } from './AbstractVec'
import { Vec4 } from './Vec4'

export type Vec3ElementTuple = [number, number, number]

export class Vec3 extends AbstractVec<Vec3, Vec3ElementTuple> {
  constructor(x: number, y: number, z: number) {
    super(3)

    this.data[0] = x
    this.data[1] = y
    this.data[2] = z
  }

  public clone = (): Vec3 => {
    return new Vec3(this[0], this[1], this[2])
  }

  public static fromArray = (
    elements: [x: number, y: number, x: number]
  ): Vec3 => {
    return new Vec3(...elements)
  }

  public static zero = (): Vec3 => {
    return new Vec3(0, 0, 0)
  }

  public toArray(): Vec3ElementTuple {
    return super.toArray() as Vec3ElementTuple
  }

  get x(): number {
    return this.data[0]
  }

  get y(): number {
    return this.data[1]
  }
  get z(): number {
    return this.data[2]
  }

  set x(value: number) {
    this.data[0] = value
  }

  set y(value: number) {
    this.data[1] = value
  }

  set z(value: number) {
    this.data[2] = value
  }

  get 0(): number {
    return this.data[0]
  }

  get 1(): number {
    return this.data[1]
  }
  get 2(): number {
    return this.data[2]
  }

  set 0(value: number) {
    this.data[0] = value
  }

  set 1(value: number) {
    this.data[1] = value
  }

  set 2(value: number) {
    this.data[2] = value
  }

  public cross = (v: Vec3): Vec3 => {
    return new Vec3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    )
  }

  public upgrade = (w: number): Vec4 => {
    return new Vec4(this.x, this.y, this.z, w)
  }
}
