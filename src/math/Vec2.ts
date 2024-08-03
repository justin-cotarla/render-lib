import { AbstractVec } from './AbstractVec'

export type Vec2ElementTuple = [number, number]

export class Vec2 extends AbstractVec<Vec2, Vec2ElementTuple> {
  constructor(x: number, y: number) {
    super(2)

    this.data[0] = x
    this.data[1] = y
  }

  public clone = (): Vec2 => {
    return new Vec2(this[0], this[1])
  }

  public static fromArray = (elements: [x: number, y: number]): Vec2 => {
    return new Vec2(...elements)
  }

  public static zero = (): Vec2 => {
    return new Vec2(0, 0)
  }

  public toArray(): Vec2ElementTuple {
    return super.toArray() as Vec2ElementTuple
  }

  get x(): number {
    return this.data[0]
  }

  get y(): number {
    return this.data[1]
  }

  set x(value: number) {
    this.data[0] = value
  }

  set y(value: number) {
    this.data[1] = value
  }

  get 0(): number {
    return this.data[0]
  }

  get 1(): number {
    return this.data[1]
  }

  set 0(value: number) {
    this.data[0] = value
  }

  set 1(value: number) {
    this.data[1] = value
  }
}
