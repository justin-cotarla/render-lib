import { AbstractVec } from './AbstractVec'
import { Vec4 } from './Vec4'

export type Vec3ElementTuple = [number, number, number]

export class Vec3 extends AbstractVec<Vec3> {
  private _x: number
  private _y: number
  private _z: number

  constructor(x: number, y: number, z: number) {
    super(3)

    this._x = x
    this._y = y
    this._z = z
  }

  public clone = (): Vec3 => {
    return new Vec3(this[0], this[1], this[2])
  }

  static fromArray = (elements: [x: number, y: number, x: number]): Vec3 => {
    return new Vec3(...elements)
  }

  public toArray(): Vec3ElementTuple {
    return super.toArray() as Vec3ElementTuple
  }

  get x(): number {
    return this._x
  }

  get y(): number {
    return this._y
  }
  get z(): number {
    return this._z
  }

  get 0(): number {
    return this._x
  }

  get 1(): number {
    return this._y
  }
  get 2(): number {
    return this._z
  }

  set 0(value: number) {
    this._x = value
  }

  set 1(value: number) {
    this._y = value
  }

  set 2(value: number) {
    this._z = value
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
