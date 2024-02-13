import { Mat4 } from '../math/Mat4'
import { Vec3 } from '../math/Vec3'

interface Orientation {
  bank: number
  pitch: number
  heading: number
}

export class RigidNode {
  private _ID = crypto.randomUUID()

  private _parent: RigidNode | null = null
  private _children: RigidNode[] = []
  private _position: Vec3 = new Vec3(0, 0, 0)

  private _velocity: Vec3 = new Vec3(0, 0, 0)
  private _orientation: Orientation = {
    bank: 0,
    pitch: 0,
    heading: 0,
  }

  get ID() {
    return this._ID
  }

  public get velocity(): Vec3 {
    return this._velocity
  }

  public get orientation(): Orientation {
    return this._orientation
  }

  public set orientation(value: Orientation) {
    this._orientation = value
  }

  public set parent(node: RigidNode | null) {
    if (this._parent) {
      this._parent.removeChild(this)
    }
    this._parent = node
  }

  public get parent(): RigidNode | null {
    return this._parent
  }

  public get position(): Vec3 {
    return this._position
  }

  public set position(value: Vec3) {
    this._position = value
  }

  public move(displacement: Vec3): RigidNode {
    this._position.add(displacement)
    return this
  }

  public addChild(node: RigidNode): RigidNode {
    this._children = [...this._children, node]
    node.parent = this
    return this
  }

  public removeChild(node: RigidNode): RigidNode {
    this._children = this._children.filter((child) => child === node)
    node.parent = null
    return this
  }

  private getNodeParentTranslation = (): Mat4 => {
    return new Mat4([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [...this._position.clone().scale(-1).toArray(), 1],
    ])
  }

  private getParentNodeTranslation = (): Mat4 => {
    return new Mat4([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [...this._position.toArray(), 1],
    ])
  }

  private getParentNodeRotation = (): Mat4 => {
    if (
      this._orientation.heading === 0 &&
      this._orientation.pitch === 0 &&
      this._orientation.bank === 0
    ) {
      return Mat4.identity()
    }

    const ch = Math.cos(this._orientation.heading)
    const cp = Math.cos(this._orientation.pitch)
    const cb = Math.cos(this._orientation.bank)
    const sh = Math.sin(this._orientation.heading)
    const sp = Math.sin(this._orientation.pitch)
    const sb = Math.sin(this._orientation.bank)

    return new Mat4([
      [ch * cb + sh * sp * sb, sb * cp, -sh * cb + ch * sp * sb, 0],
      [-ch * sb + sh * sp * cb, cb * cp, sb * sh + ch * sp * cb, 0],
      [sh * cp, -sp, ch * cp, 0],
      [0, 0, 0, 1],
    ])
  }

  public getParentNodeTransform = (): Mat4 => {
    return this.getParentNodeRotation().multiply(
      this.getParentNodeTranslation()
    )
  }

  public getNodeParentTransform = (): Mat4 => {
    return this.getNodeParentTranslation().multiply(
      this.getParentNodeRotation().transpose()
    )
  }

  public getRootNodeTransform = (): Mat4 => {
    if (!this._parent) {
      return this.getParentNodeTransform()
    }

    return this.getParentNodeTransform().multiply(
      this._parent.getRootNodeTransform()
    )
  }

  public getNodeRootTransform = (): Mat4 => {
    if (!this._parent) {
      return this.getNodeParentTransform()
    }

    return this._parent
      .getNodeRootTransform()
      .multiply(this.getNodeParentTransform())
  }

  public tick = (timeDelta: number) => {
    if (this.velocity.isZero()) {
      return
    }

    this.position.add(
      this.velocity
        .clone()
        .scale(timeDelta)
        .upgrade(1)
        .applyMatrix(this.getParentNodeRotation())
        .downgrade()
    )
  }
}
