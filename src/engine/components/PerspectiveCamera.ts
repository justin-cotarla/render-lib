import { Component } from 'reactive-ecs'

export interface PerspectiveCamera {
  nearPlane: number
  farPlane: number
  fov: number
  aspectRatio: number
}

export const PerspectiveCamera = new Component<PerspectiveCamera>(
  'PERSPECTIVE_CAMERA'
)
