import { Component } from '../../ecs/Component'
import { Pipeline } from '../systems/Pipeline'

export const ActivePipeline = new Component<Pipeline>('ACTIVE_PIPELINE')
