export {}

declare global {
  // interface EventListener {
  //   // (evt: Event & { [key: string]: unknown }): void
  //   (evt: Event & { foo: string }): void
  // }

  // interface EventListenerObject {
  //   handleEvent(evddt: Event): void
  // }

  interface EventTarget {
    addEventListener<T extends Event>(
      type: T['type'],
      callback: { (evt: T): void } | null,
      options?: boolean | AddEventListenerOptions
    ): void
    dispatchEvent(evt: Event): boolean
    removeEventListener(
      type: string,
      listener?: EventListenerOrEventListenerObject | null,
      options?: EventListenerOptions | boolean
    ): void
  }
}
