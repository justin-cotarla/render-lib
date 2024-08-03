import { AbstractVec } from './AbstractVec'
import { Vec3 } from './Vec3'

export type Vec4ElementTuple = [number, number, number, number]

export class Vec4 extends AbstractVec<Vec4, Vec4ElementTuple> {
  constructor(x: number, y: number, z: number, w: number) {
    super(4)

    this.data[0] = x
    this.data[1] = y
    this.data[2] = z
    this.data[3] = w
  }

  public clone = (): Vec4 => {
    return new Vec4(this[0], this[1], this[2], this[3])
  }

  public static fromArray = (elements: Vec4ElementTuple): Vec4 => {
    return new Vec4(...elements)
  }

  public static zero = (): Vec4 => {
    return new Vec4(0, 0, 0, 0)
  }

  public toArray(): Vec4ElementTuple {
    return super.toArray() as Vec4ElementTuple
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

  get w(): number {
    return this.data[3]
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

  set w(value: number) {
    this.data[3] = value
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

  get 3(): number {
    return this.data[3]
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

  set 3(value: number) {
    this.data[3] = value
  }

  public downgrade = (): Vec3 => {
    return new Vec3(this.x, this.y, this.z)
  }
}
