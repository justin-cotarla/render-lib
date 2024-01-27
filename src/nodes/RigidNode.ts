import { Mat4 } from '../math/Mat4'
import { Vec3 } from '../math/Vec3'

export class RigidNode {
  private _parent: RigidNode | null = null
  private children: RigidNode[] = []
  private _position: Vec3 = new Vec3(0, 0, 0)

  private _ID = crypto.randomUUID()

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

  public get position(): Vec3 {
    return this._position
  }

  public set position(value: Vec3) {
    this._position = value
  }

  public move = (displacement: Vec3): this => {
    this._position.add(displacement)
    return this
  }

  public addChild = (node: RigidNode): this => {
    this.children = [...this.children, node]
    node.parent = this
    return this
  }

  public removeChild = (node: RigidNode): this => {
    this.children = this.children.filter((child) => child === node)
    node.parent = null
    return this
  }

  public getParentNodeTransform = (): Mat4 => {
    return new Mat4([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [...this._position.toArray(), 1],
    ])
  }

  public getRootNodeTransform = (): Mat4 => {
    if (!this._parent) {
      return this.getParentNodeTransform()
    }

    return this.getParentNodeTransform().multiply(
      this._parent.getRootNodeTransform()
    )
  }
}
