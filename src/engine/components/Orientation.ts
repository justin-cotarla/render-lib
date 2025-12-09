import { Component } from 'reactive-ecs'

export interface Orientation {
  bank: number
  pitch: number
  heading: number
}

/**
 * Bank: Rotation about Z axis
 * Heading: Rotation about Y axis
 * Pitch: Rotation about X axis
 */
export const Orientation = new Component<Orientation>('ORIENTATION')
