import { Vec3, Vec3ElementTuple } from '../math/Vec3'
import { Mesh, Triangle } from '../engine/nodes/Mesh'

const KEYWORDS = ['v', 'vn', 'f', '#'] as const

const parseVec3Data = (data: string): Vec3 => {
  const components = data.split(' ').map((value) => parseFloat(value))

  if (components.length !== 3) {
    throw new Error('Does not contain 3 components')
  }

  return Vec3.fromArray(
    data.split(' ').map((value) => parseFloat(value)) as Vec3ElementTuple
  )
}

export const parseObj = (
  rawMesh: string
): ConstructorParameters<typeof Mesh> => {
  const vertices: Vec3[] = []
  const normals: Vec3[] = []
  const triangles: Triangle[] = []

  let currentKeyword

  for (const line of rawMesh.split('\n')) {
    if (!line.length) {
      continue
    }

    const firstSpaceIndex = line.indexOf(' ')
    const [keyword, data] = [
      line.slice(0, firstSpaceIndex),
      line.slice(firstSpaceIndex + 1),
    ]

    if (keyword !== currentKeyword) {
      currentKeyword = keyword
    }

    switch (keyword as (typeof KEYWORDS)[number]) {
      case 'v': {
        try {
          vertices.push(parseVec3Data(data))
        } catch (err) {
          console.log('Could not parse vertex, skipping', err)
        }
        break
      }
      case 'f': {
        const triangleVertices = data.split(' ')

        if (triangleVertices.length !== 3) {
          console.log('Could not parse normal, skipping')
          break
        }

        const vertexIndices: number[] = []
        const normalIndices: number[] = []

        triangleVertices.forEach((vertexData) => {
          const [vertexIndex, , normalIndex] = vertexData.split('/')

          vertexIndices.push(parseInt(vertexIndex, 10) - 1)
          normalIndices.push(parseInt(normalIndex, 10) - 1)
        })

        triangles.push({
          vertexIndices: vertexIndices as [number, number, number],
          normalIndices: normalIndices as [number, number, number],
        })

        break
      }
      case 'vn': {
        try {
          normals.push(parseVec3Data(data))
        } catch (err) {
          console.log('Could not parse vertex, skipping', err)
        }
        break
      }
      case '#': {
        break
      }
      default:
        console.log(`Skipping unknown keyword ${keyword}`)
        break
    }
  }

  return [triangles, vertices, normals]
}
