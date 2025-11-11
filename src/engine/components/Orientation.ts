import { DefaultComponent } from '../../ecs/DefaultComponent.ts'

export interface Orientation {
  bank: number
  pitch: number
  heading: number
}

export const Orientation = new DefaultComponent<Orientation>('ORIENTATION', {
  bank: 0,
  heading: 0,
  pitch: 0,
})
