import { Component } from 'reactive-ecs'
import { Vec3 } from '../../math/Vec3'

export const AABB = new Component<{ minPoint: Vec3; maxPoint: Vec3 }>('AABB')
