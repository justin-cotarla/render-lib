import { System } from '../../ecs/System'
import { Vec3 } from '../../math/Vec3'
import { eulerOrientationToMatrix } from '../../util/matrixTransformations'
import { Force } from '../components/Force'
import { LinearImpulse } from '../components/LinearImpulse'
import { Mass } from '../components/Mass'
import { Orientation } from '../components/Orientation'
import { Position } from '../components/Position'
import { Velocity } from '../components/Velocity'

export class ForceIntegrator extends System {
  constructor() {
    super()

    this.registerComponent(Force)
    this.registerComponent(LinearImpulse)
    this.registerComponent(Mass)
    this.registerComponent(Velocity)
    this.registerComponent(Position)
    this.registerComponent(Orientation)
  }

  public integrate(dt: number): void {
    for (const entity of this.getMatchedEntities()) {
      const force = Force.getEntityData(entity)
      const linearImpulse = LinearImpulse.getEntityData(entity)
      const inverseMass = 1 / Mass.getEntityData(entity)
      const velocity = Velocity.getEntityData(entity)
      const position = Position.getEntityData(entity)
      const orientation = Orientation.getEntityData(entity)

      const acceleration = force.scale(inverseMass)

      velocity.add(acceleration.scale(dt))

      velocity.add(linearImpulse.scale(inverseMass))

      position.add(
        velocity
          .clone()
          .scale(dt)
          .applyMatrix(eulerOrientationToMatrix(orientation))
      )

      entity.addComponent(Force, Vec3.zero())
      entity.addComponent(LinearImpulse, Vec3.zero())
      entity.addComponent(Velocity, velocity)
      entity.addComponent(Position, position)
    }
  }
}
