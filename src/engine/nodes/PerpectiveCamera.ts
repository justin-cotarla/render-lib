import { Mat4 } from '../../math/Mat4'
import { RigidNode } from './RigidNode'

export class PerspectiveCamera extends RigidNode {
  private _nearPlane = 1
  private _farPlane = 100
  private _fov = 60
  private _aspectRatio = 1

  public get nearPlane(): number {
    return this._nearPlane
  }
  public get farPlane(): number {
    return this._farPlane
  }
  public get fov(): number {
    return this._fov
  }
  public get aspectRatio(): number {
    return this._aspectRatio
  }

  public set nearPlane(value: number) {
    this._nearPlane = value
    this.computeRootClipTransform()
  }

  public set farPlane(value: number) {
    this._farPlane = value
    this.computeRootClipTransform()
  }

  public set fov(value: number) {
    this._fov = value
    this.computeRootClipTransform()
  }

  public set aspectRatio(value: number) {
    this._aspectRatio = value
    this.computeRootClipTransform()
  }

  private _clipTransform = Mat4.identity()

  public get clipTransform(): Mat4 {
    return this._clipTransform
  }

  private computeRootClipTransform = () => {
    const zoomX = 1 / Math.tan((this.fov * Math.PI) / 360)
    const zoomY = zoomX / this.aspectRatio

    this._clipTransform = new Mat4([
      [zoomX, 0, 0, 0],
      [0, zoomY, 0, 0],
      [0, 0, this.farPlane / (this.farPlane - this.nearPlane), 1],
      [
        0,
        0,
        (-this.nearPlane * this.farPlane) / (this.farPlane - this.nearPlane),
        0,
      ],
    ])
  }
}
