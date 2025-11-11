import { Component } from '../../ecs/Component.ts'
import { Entity } from '../../ecs/Entity.ts'

export const ParentEntity = new Component<Entity>('PARENT_ENTITY')
