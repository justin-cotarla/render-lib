import { Component } from 'reactive-ecs'
import { Vec4 } from '../../math/Vec4'

export interface Light {
  diffuse: Vec4
  specular: Vec4
}

export const Light = new Component<Light>('LIGHT')
