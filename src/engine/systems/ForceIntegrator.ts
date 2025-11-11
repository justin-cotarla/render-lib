import { System } from '../../ecs/System.ts'
import { Mat3 } from '../../math/Mat3.ts'
import { eulerOrientationToMatrix } from '../../util/matrixTransformations.ts'
import { Force } from '../components/Force.ts'
import { LinearImpulse } from '../components/LinearImpulse.ts'
import { Mass } from '../components/Mass.ts'
import { Orientation } from '../components/Orientation.ts'
import { Position } from '../components/Position.ts'
import { Velocity } from '../components/Velocity.ts'

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
            ]),
          ),
      )

      force.zero()
      linearImpulse.zero()
    }
  }
}
