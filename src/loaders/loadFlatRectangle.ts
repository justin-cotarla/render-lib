import { Entity } from '../ecs/Entity'
import { WorldInstance } from '../ecs/World'
import { FlatColor } from '../engine/components/FlatColor'
import { MeshBuffer } from '../engine/components/MeshBuffer'
import { Orientation } from '../engine/components/Orientation'
import { Position } from '../engine/components/Position'
import { FlatRectangle } from '../engine/elements/FlatRectangle'
import { Vec3 } from '../math/Vec3'
import { Vec4 } from '../math/Vec4'

export const loadFlatRectangle = (
  { x, y, width, height, color }: FlatRectangle,
  device: GPUDevice
): Entity => {
  const entity = WorldInstance.createEntity()

  const vertexBuffer = device.createBuffer({
    label: `vertex_buffer_${entity.id}`,
    size: 12 * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  })

  /**
   *   4   3
   *
   *   1   2
   */

  const p1 = [0, 0]
  const p2 = [0 + width, 0]
  const p3 = [0 + width, 0 + height]
  const p4 = [0, 0 + height]

  const buffer = new Float32Array(vertexBuffer.getMappedRange())
  buffer.set([...p1, ...p3, ...p4, ...p1, ...p2, ...p3])
  vertexBuffer.unmap()

  entity.addComponent(Position, new Vec3([x, y, 0]))
  entity.addComponent(Orientation)
  entity.addComponent(
    FlatColor,
    new Vec4([color.r / 255, color.g / 255, color.b / 255, 1])
  )
  entity.addComponent(MeshBuffer, vertexBuffer)
  return entity
}
