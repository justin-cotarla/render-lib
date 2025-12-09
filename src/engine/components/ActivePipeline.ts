import { Component } from 'reactive-ecs'
import { Pipeline } from '../systems/Pipeline'

export const ActivePipeline = new Component<Pipeline>('ACTIVE_PIPELINE')
