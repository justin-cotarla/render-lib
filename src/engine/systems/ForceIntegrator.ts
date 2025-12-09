import { System } from 'reactive-ecs'
import { Mat3 } from '../../math/Mat3'
import { eulerOrientationToMatrix } from '../../util/matrixTransformations'
import { Force } from '../components/Force'
import { LinearImpulse } from '../components/LinearImpulse'
import { Mass } from '../components/Mass'
import { Orientation } from '../components/Orientation'
import { Position } from '../components/Position'
import { Velocity } from '../components/Velocity'

export class ForceIntegrator extends System {
  constructor() {
    super([Force, LinearImpulse, Mass, Velocity, Position, Orientation])
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

      const orientationMatrix = eulerOrientationToMatrix(orientation)

      position.add(
        velocity
          .clone()
          .scale(dt)
          .applyMatrix(
            new Mat3([
              orientationMatrix.data[0],
              orientationMatrix.data[1],
              orientationMatrix.data[2],
              orientationMatrix.data[4],
              orientationMatrix.data[5],
              orientationMatrix.data[6],
              orientationMatrix.data[8],
              orientationMatrix.data[9],
              orientationMatrix.data[10],
            ])
          )
      )

      force.zero()
      linearImpulse.zero()
    }
  }
}
