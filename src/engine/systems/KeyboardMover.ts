import { System } from '../../ecs/System.ts'
import { DirectionKey, KeyboardObserver } from '../../input/KeyboardObserver.ts'
import { Vec3 } from '../../math/Vec3.ts'
import { KeyboardControl } from '../components/KeyboardControl.ts'
import { LinearImpulse } from '../components/LinearImpulse.ts'

export class KeyboardMover extends System {
  constructor() {
    super()

    this.registerComponent(KeyboardControl)
    this.registerComponent(LinearImpulse)

    this.setupKeyboardObserver()
  }

  private setLinearImpulse(linearImpulse: Vec3): void {
    for (const entity of this.getMatchedEntities()) {
      LinearImpulse.getEntityData(entity).add(linearImpulse)
    }
  }

  private setupKeyboardObserver() {
    new KeyboardObserver({
      press: {
        [DirectionKey.UP]: () => {
          this.setLinearImpulse(new Vec3([0, 0, 0.01]))
        },
        [DirectionKey.DOWN]: () => {
          this.setLinearImpulse(new Vec3([0, 0, -0.01]))
        },
        [DirectionKey.LEFT]: () => {
          this.setLinearImpulse(new Vec3([-0.01, 0, 0]))
        },
        [DirectionKey.RIGHT]: () => {
          this.setLinearImpulse(new Vec3([0.01, 0, 0]))
        },
      },
      release: {
        [DirectionKey.UP]: () => {
          this.setLinearImpulse(new Vec3([0, 0, -0.01]))
        },
        [DirectionKey.DOWN]: () => {
          this.setLinearImpulse(new Vec3([0, 0, 0.01]))
        },
        [DirectionKey.LEFT]: () => {
          this.setLinearImpulse(new Vec3([0.01, 0, 0]))
        },
        [DirectionKey.RIGHT]: () => {
          this.setLinearImpulse(new Vec3([-0.01, 0, 0]))
        },
      },
    })
  }
}
