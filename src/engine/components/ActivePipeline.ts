import { Component } from '../../ecs/Component.ts'
import { Pipeline } from '../systems/Pipeline.ts'

export const ActivePipeline = new Component<Pipeline>('ACTIVE_PIPELINE')
