import { Vec3, Vec3ElementTuple } from '../math/Vec3'
import { Mesh3d, Triangle, Vertex } from '../nodes/Mesh3d'

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

export const parseObj = (rawMesh: string): Mesh3d => {
  const vertexPositions: Vec3[] = []
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
          vertexPositions.push(parseVec3Data(data))
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

        triangles.push({
          vertexIndices: triangleVertices.map((vertexData) => {
            const [vertexIndex] = vertexData.split('/')

            return parseInt(vertexIndex, 10) - 1
          }) as [number, number, number],
        })

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

  const vertices: Vertex[] = vertexPositions.map((position) => ({
    position,
    normal: new Vec3(0, 0, 0),
  }))

  return new Mesh3d(triangles, vertices)
}
