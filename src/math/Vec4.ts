import { AbstractVec } from './AbstractVec'

export type Vec4ElementTuple = [number, number, number, number]

export class Vec4 extends AbstractVec<Vec4> {
  private _x: number
  private _y: number
  private _z: number
  private _w: number

  constructor(x: number, y: number, z: number, w: number) {
    super(4)

    this._x = x
    this._y = y
    this._z = z
    this._w = w
  }

  public clone = (): Vec4 => {
    return new Vec4(this[0], this[1], this[2], this[3])
  }

  static fromArray = (elements: Vec4ElementTuple): Vec4 => {
    return new Vec4(...elements)
  }

  public toArray(): Vec4ElementTuple {
    return super.toArray() as Vec4ElementTuple
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

  get w(): number {
    return this._w
  }

  set x(value: number) {
    this._x = value
  }

  set y(value: number) {
    this._y = value
  }

  set z(value: number) {
    this._z = value
  }

  set w(value: number) {
    this._w = value
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

  get 3(): number {
    return this._w
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

  set 3(value: number) {
    this._w = value
  }
}
