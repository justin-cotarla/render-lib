import { Vec3, Vec3Tuple } from '../math/Vec3'
import { Face, Mesh3d, Vertex } from '../mesh/Mesh3d'

const KEYWORDS = ['v', 'vn', 'f'] as const

const parseVec3Data = (data: string): Vec3 => {
  const components = data.split(' ').map((value) => parseFloat(value))

  if (components.length !== 3) {
    throw new Error('Does not contain 3 components')
  }

  return Vec3.fromArray(
    data.split(' ').map((value) => parseFloat(value)) as Vec3Tuple
  )
}

export const loadObj = async (file: File): Promise<Mesh3d> => {
  const meshData = await file.text()

  const vertices: Vec3[] = []
  const normals: Vec3[] = []
  const faces: Face[] = []

  let currentKeyword

  for (const line of meshData.split('\n')) {
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
      case 'vn': {
        try {
          normals.push(parseVec3Data(data))
        } catch (err) {
          console.log('Could not parse normal, skipping', err)
        }
        break
      }
      case 'f': {
        const faceVertices = data.split(' ')

        if (faceVertices.length !== 3) {
          console.log('Could not parse normal, skipping')
          break
        }

        faces.push({
          vertices: faceVertices.map((vertexData): Vertex => {
            const [vertexIndex, , normalIndex] = vertexData.split('/')

            return {
              position: vertices[parseInt(vertexIndex, 10) - 1],
              normal: normals[parseInt(normalIndex, 10) - 1],
            }
          }) as [Vertex, Vertex, Vertex],
        })

        break
      }
      default:
        console.log(`Skipping unknown keyword ${keyword}`)
        break
    }
  }

  return new Mesh3d(faces)
}
