import { Mat4 } from '../math/Mat4'
import { Vec3 } from '../math/Vec3'
import { AABB } from '../physics/AABB'

interface Orientation {
  bank: number
  pitch: number
  heading: number
}

export class RigidNode {
  private _ID = crypto.randomUUID()

  private _parent: RigidNode | null = null
  private children: RigidNode[] = []

  public position: Vec3 = new Vec3(0, 0, 0)
  public velocity: Vec3 = new Vec3(0, 0, 0)
  public orientation: Orientation = {
    bank: 0,
    pitch: 0,
    heading: 0,
  }

  public aabb?: AABB

  get ID() {
    return this._ID
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

  public move(displacement: Vec3): RigidNode {
    this.position.add(displacement)
    return this
  }

  public addChild(node: RigidNode): RigidNode {
    this.children = [...this.children, node]
    node.parent = this
    return this
  }

  public removeChild(node: RigidNode): RigidNode {
    this.children = this.children.filter((child) => child === node)
    node.parent = null
    return this
  }

  private getNodeParentTranslation = (): Mat4 => {
    return new Mat4([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [...this.position.clone().scale(-1).toArray(), 1],
    ])
  }

  private getParentNodeTranslation = (): Mat4 => {
    return new Mat4([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [...this.position.toArray(), 1],
    ])
  }

  private getParentNodeRotation = (): Mat4 => {
    if (
      this.orientation.heading === 0 &&
      this.orientation.pitch === 0 &&
      this.orientation.bank === 0
    ) {
      return Mat4.identity()
    }

    const ch = Math.cos(this.orientation.heading)
    const cp = Math.cos(this.orientation.pitch)
    const cb = Math.cos(this.orientation.bank)
    const sh = Math.sin(this.orientation.heading)
    const sp = Math.sin(this.orientation.pitch)
    const sb = Math.sin(this.orientation.bank)

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
