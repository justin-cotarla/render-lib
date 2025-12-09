import { Component } from 'reactive-ecs'

export const OrthographicCamera = new Component<{
  nearPlane: number
  farPlane: number
  width: number
  aspectRatio: number
}>('ORTHOGRAPHIC_CAMERA')
