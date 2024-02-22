type keyMode = 'arrows' | 'wasd'

export const enum DirectionKey {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

type KeyAction = 'press' | 'release'

const DIRECTION_KEY_MAP: Record<keyMode, Record<string, DirectionKey>> = {
  arrows: {
    ArrowUp: DirectionKey.UP,
    ArrowDown: DirectionKey.DOWN,
    ArrowLeft: DirectionKey.LEFT,
    ArrowRight: DirectionKey.RIGHT,
  },
  wasd: {
    w: DirectionKey.UP,
    s: DirectionKey.DOWN,
    a: DirectionKey.LEFT,
    d: DirectionKey.RIGHT,
  },
}

export class KeyboardObserver {
  private _cleanup: () => void

  public get cleanup() {
    return this._cleanup
  }

  constructor(
    readonly keyActions: Record<
      KeyAction,
      Record<DirectionKey, () => void> & Record<string, () => void>
    >,
    readonly keyMode: 'arrows' | 'wasd' = 'wasd'
  ) {
    const onPress = this.onKey('press')
    const onRelease = this.onKey('release')

    window.addEventListener('keydown', onPress)
    window.addEventListener('keyup', onRelease)

    this._cleanup = () => {
      window.removeEventListener('keydown', onPress)
      window.removeEventListener('keyup', onRelease)
    }
  }

  private onKey =
    (keyAction: KeyAction) =>
    ({ key, repeat }: KeyboardEvent) => {
      if (repeat) {
        return
      }
      this.keyActions[keyAction][DIRECTION_KEY_MAP[this.keyMode][key] ?? key]()
    }
}
