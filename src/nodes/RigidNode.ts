import { Mat4 } from '../math/Mat4'
import { Vec4 } from '../math/Vec4'

export class RigidNode {
  private _parent: RigidNode | null = null
  private children: RigidNode[] = []
  private _position: Vec4 = new Vec4(0, 0, 0, 1)

  public set parent(node: RigidNode | null) {
    if (this._parent) {
      this._parent.removeChild(this)
    }
    this._parent = node
  }

  public get parent(): RigidNode | null {
    return this._parent
  }

  public get position(): Vec4 {
    return this._position
  }

  public move = (displacement: Vec4): this => {
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

  public getTransform = (): Mat4 => {
    return new Mat4([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      this._position.toArray(),
    ])
  }

  public getRootTransform = (): Mat4 => {
    if (!this._parent) {
      return this.getTransform()
    }

    return this.getTransform().multiply(this._parent.getRootTransform())
  }
}
