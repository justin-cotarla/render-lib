import { AbstractVec } from './AbstractVec'

export class Vec2 extends AbstractVec<Vec2> {
  private _x: number
  private _y: number

  constructor(x: number, y: number) {
    super(2)

    this._x = x
    this._y = y
  }

  public clone = (): Vec2 => {
    return new Vec2(this[0], this[1])
  }

  static fromArray = (elements: [x: number, y: number]): Vec2 => {
    return new Vec2(...elements)
  }

  public toArray(): [number, number] {
    return super.toArray() as [number, number]
  }

  get x(): number {
    return this._x
  }

  get y(): number {
    return this._y
  }

  get 0(): number {
    return this._x
  }

  get 1(): number {
    return this._y
  }

  set 0(value: number) {
    this._x = value
  }

  set 1(value: number) {
    this._y = value
  }
}
