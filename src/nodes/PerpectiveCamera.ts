import { Mat4 } from '../math/Mat4'
import { RigidNode } from './RigidNode'

export class PerspectiveCamera extends RigidNode {
  private _nearPlane = 10
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

  private _rootClipTransform = Mat4.identity()

  public get rootClipTransform(): Mat4 {
    return this._rootClipTransform
  }

  private computeRootClipTransform = () => {
    const rootCameraTransform = this.getRootNodeTransform().inverse()

    const zoomX = 1 / Math.tan((this.fov * Math.PI) / 360)
    const zoomY = zoomX / this.aspectRatio

    const cameraClipTransfrom = new Mat4([
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

    this._rootClipTransform = rootCameraTransform.multiply(cameraClipTransfrom)
  }
}
