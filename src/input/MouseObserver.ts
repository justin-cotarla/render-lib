export class MouseObserver {
  private locked: boolean = false

  private _cleanup: () => void

  public get cleanup() {
    return this._cleanup
  }

  constructor(
    readonly mouseAction: (movementX: number, movementY: number) => void
  ) {
    document.addEventListener('mousemove', this.onMouseMove)

    document.addEventListener('click', async () => {
      document.body.requestPointerLock()
    })

    document.addEventListener('pointerlockchange', () => {
      if (document.pointerLockElement === document.body) {
        this.locked = true
        return
      }

      this.locked = false
    })

    this._cleanup = () => {
      document.removeEventListener('mousemove', this.onMouseMove)
    }
  }

  private onMouseMove = (ev: MouseEvent): void => {
    if (!this.locked) {
      return
    }
    this.mouseAction(ev.movementX, ev.movementY)
  }
}
