import { System } from '../../ecs/System'
import { Mat4 } from '../../math/Mat4'
import { Vec3 } from '../../math/Vec3'
import { Orientation } from '../components/Orientation'
import { ParentEntity } from '../components/ParentEntity'
import { ParentTransform } from '../components/ParentTransform'
import { Position } from '../components/Position'

export class ParentTranformCalculator extends System {
  constructor() {
    super()

    this.registerComponent(ParentEntity)
    this.registerComponent(Position)
    this.registerComponent(Orientation)
  }

  private getParentTranslation = (position: Vec3): Mat4 => {
    return new Mat4([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [...position.clone().toArray(), 1],
    ])
  }

  private getParentRotation = (orientation: Orientation): Mat4 => {
    if (
      orientation.heading === 0 &&
      orientation.pitch === 0 &&
      orientation.bank === 0
    ) {
      return Mat4.identity()
    }

    const ch = Math.cos(orientation.heading)
    const cp = Math.cos(orientation.pitch)
    const cb = Math.cos(orientation.bank)
    const sh = Math.sin(orientation.heading)
    const sp = Math.sin(orientation.pitch)
    const sb = Math.sin(orientation.bank)

    return new Mat4([
      [ch * cb + sh * sp * sb, sb * cp, -sh * cb + ch * sp * sb, 0],
      [-ch * sb + sh * sp * cb, cb * cp, sb * sh + ch * sp * cb, 0],
      [sh * cp, -sp, ch * cp, 0],
      [0, 0, 0, 1],
    ])

    // return new Mat4([
    //   [ch * cb + sh * sp * sb, -ch * sb + sh * sp * cb, sh * cp, 0],
    //   [sb * cp, cb * cp, -sp, 0],
    //   [-sh * cb + ch * sp * sb, sb * sh + ch * sp * cb, ch * cp, 0],
    //   [0, 0, 0, 1],
    // ])
  }

  public calculateParentTransforms() {
    for (const entity of this.getMatchedEntities()) {
      const position = Position.getEntityData(entity.id)
      const orientation = Orientation.getEntityData(entity.id)

      entity.addComponent(
        ParentTransform,
        this.getParentRotation(orientation).multiply(
          this.getParentTranslation(position)
        )
      )
    }
  }
}
