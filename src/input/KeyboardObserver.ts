type keyMode = 'arrows' | 'wasd'

export const enum Key {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

type KeyAction = 'press' | 'release'

const KEY_MAP: Record<keyMode, Record<string, Key>> = {
  arrows: {
    ArrowUp: Key.UP,
    ArrowDown: Key.DOWN,
    ArrowLeft: Key.LEFT,
    ArrowRight: Key.RIGHT,
  },
  wasd: { w: Key.UP, s: Key.DOWN, a: Key.LEFT, d: Key.RIGHT },
}

export class KeyboardObserver {
  private _cleanup: () => void

  public get cleanup() {
    return this._cleanup
  }

  constructor(
    readonly keyActions: Record<KeyAction, Record<Key, () => void>>,
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
      this.keyActions[keyAction][KEY_MAP[this.keyMode][key]]()
    }
}
