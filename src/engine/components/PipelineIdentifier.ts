import { Component } from '../../ecs/Component'
import { createPipelines } from '../pipelines/createPipelines'

export const PipelineIdentifier = new Component<
  keyof ReturnType<typeof createPipelines>
>('PIPELINE_IDENTIFIER')
