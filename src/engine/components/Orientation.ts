import { DefaultComponent } from '../../ecs/DefaultComponent'

export const Orientation = new DefaultComponent<{
  bank: number
  pitch: number
  heading: number
}>('ORIENTATION', {
  bank: 0,
  heading: 0,
  pitch: 0,
})
