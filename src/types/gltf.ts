import { Mat4Elements } from '../math/Mat4'
import { Vec3Elements } from '../math/Vec3'
import { Vec4Elements } from '../math/Vec4'

export enum GlConstant {
  GL_BYTE = 5120,
  GL_UNSIGNED_BYTE = 5121,
  GL_SHORT = 5122,
  GL_UNSIGNED_SHORT = 5123,
  GL_UNSIGNED_INT = 5125,
  GL_FLOAT = 5126,
  GL_LINEAR = 9729,
  GL_NEAREST = 9728,
  GL_LINEAR_MIPMAP_LINEAR = 9987,
  GL_LINEAR_MIPMAP_NEAREST = 9985,
  GL_NEAREST_MIPMAP_LINEAR = 9986,
  GL_NEAREST_MIPMAP_NEAREST = 9984,
  GL_REPEAT = 10497,
  GL_MIRRORED_REPEAT = 33648,
  GL_CLAMP_TO_EDGE = 33071,
}

export interface AccessorComponentTypes {
  [GlConstant.GL_BYTE]: Int8ArrayConstructor
  [GlConstant.GL_UNSIGNED_BYTE]: Uint8ArrayConstructor
  [GlConstant.GL_SHORT]: Int16ArrayConstructor
  [GlConstant.GL_UNSIGNED_SHORT]: Uint16ArrayConstructor
  [GlConstant.GL_UNSIGNED_INT]: Uint32ArrayConstructor
  [GlConstant.GL_FLOAT]: Float32ArrayConstructor
}

export interface PrimitiveComponentTypes {
  INDICES: keyof AccessorComponentTypes
  POSITION: GlConstant.GL_FLOAT
  NORMAL: GlConstant.GL_FLOAT
  TANGENT: GlConstant.GL_FLOAT
  TEXCOORD:
    | GlConstant.GL_FLOAT
    | GlConstant.GL_UNSIGNED_BYTE
    | GlConstant.GL_UNSIGNED_SHORT
  COLOR:
    | GlConstant.GL_FLOAT
    | GlConstant.GL_UNSIGNED_BYTE
    | GlConstant.GL_UNSIGNED_SHORT
  JOINTS: GlConstant.GL_UNSIGNED_BYTE | GlConstant.GL_UNSIGNED_SHORT
  WEIGHTS: GlConstant.GL_UNSIGNED_BYTE | GlConstant.GL_UNSIGNED_SHORT
}

export interface GltfAsset {
  scene: number
  scenes: Scene<false>[]
}

export interface FlatGltfAsset {
  asset: Asset
  extensionsUsed?: string[]
  scene: number
  scenes: Scene<true>[]
  nodes: Node<true>[]
  materials: Material<true>[]
  meshes: Mesh<true>[]
  textures: Texture<true>[]
  images?: ImageRef[]
  accessors: Accessor<true>[]
  bufferViews: BufferView[]
  samplers?: Sampler[]
  buffers: Buffer[]
}

export interface Scene<FLAT extends boolean> {
  name?: string
  nodes: (FLAT extends true ? number : Node<FLAT>)[]
}

export interface Node<FLAT extends boolean> {
  mesh?: FLAT extends true ? number : Mesh<FLAT>
  name?: string
  translation?: Vec3Elements
  children?: (FLAT extends true ? number : Node<FLAT>)[]
  rotation?: Vec4Elements
  matrix?: Mat4Elements
}

export interface Mesh<FLAT extends boolean> {
  name?: string
  primitives: Primitive<FLAT>[]
}

export interface Primitive<FLAT extends boolean> {
  attributes: Attributes<FLAT>
  indices: FLAT extends true
    ? number
    : Accessor<FLAT, PrimitiveComponentTypes['INDICES']>
  material?: FLAT extends true ? number : Material<FLAT>
}

export type VariadicAttributes<FLAT extends boolean> = {
  [key: `TEXCOORD_${number}`]: FLAT extends true
    ? number
    : Accessor<FLAT, PrimitiveComponentTypes['TEXCOORD']>
  [key: `COLOR_${number}`]: FLAT extends true
    ? number
    : Accessor<FLAT, PrimitiveComponentTypes['COLOR']>
  [key: `JOINTS_${number}`]: FLAT extends true
    ? number
    : Accessor<FLAT, PrimitiveComponentTypes['JOINTS']>
  [key: `WEIGHTS_${number}`]: FLAT extends true
    ? number
    : Accessor<FLAT, PrimitiveComponentTypes['WEIGHTS']>
}

export type Attributes<FLAT extends boolean> = {
  POSITION?: FLAT extends true
    ? number
    : Accessor<FLAT, PrimitiveComponentTypes['POSITION']>
  NORMAL?: FLAT extends true
    ? number
    : Accessor<FLAT, PrimitiveComponentTypes['NORMAL']>
  TANGENT?: FLAT extends true
    ? number
    : Accessor<FLAT, PrimitiveComponentTypes['TANGENT']>
} & (FLAT extends true ? Partial<VariadicAttributes<true>> : unknown)

export interface Material<FLAT extends boolean> {
  name?: string
  normalTexture?: TextureRef<FLAT> & { scale?: number }
  occlusionTexture?: TextureRef<FLAT> & { strength?: number }
  emissiveTexture?: TextureRef<FLAT>
  pbrMetallicRoughness: PbrMetallicRoughness<FLAT>
  extensions?: unknown
}

export interface TextureRef<FLAT extends boolean> {
  index: FLAT extends true ? number : Texture<FLAT>
  texCoord?: FLAT extends true
    ? number
    : Accessor<FLAT, PrimitiveComponentTypes['TEXCOORD']>
}

export type PbrMetallicRoughness<FLAT extends boolean> = (
  | {
      baseColorTexture: TextureRef<FLAT>
      baseColorFactor?: Vec4Elements
    }
  | {
      baseColorTexture?: TextureRef<FLAT>
      baseColorFactor: Vec4Elements
    }
) &
  (
    | {
        metallicRoughnessTexture: TextureRef<FLAT>
        metallicFactor?: number
        roughnessFactor?: number
      }
    | {
        metallicRoughnessTexture?: TextureRef<FLAT>
        metallicFactor: number
        roughnessFactor: number
      }
  )

export interface Texture<FLAT extends boolean> {
  sampler?: FLAT extends true ? number : Sampler
  source: FLAT extends true ? number : Blob
}

export interface Sampler {
  magFilter: GlConstant.GL_LINEAR | GlConstant.GL_NEAREST
  minFilter:
    | GlConstant.GL_LINEAR
    | GlConstant.GL_NEAREST
    | GlConstant.GL_LINEAR_MIPMAP_LINEAR
    | GlConstant.GL_LINEAR_MIPMAP_NEAREST
    | GlConstant.GL_NEAREST_MIPMAP_LINEAR
    | GlConstant.GL_NEAREST_MIPMAP_NEAREST
  wrapS:
    | GlConstant.GL_REPEAT
    | GlConstant.GL_MIRRORED_REPEAT
    | GlConstant.GL_CLAMP_TO_EDGE
  wrapT:
    | GlConstant.GL_REPEAT
    | GlConstant.GL_MIRRORED_REPEAT
    | GlConstant.GL_CLAMP_TO_EDGE
}

export interface Accessor<
  FLAT extends boolean,
  COMPONENT_TYPE extends
    keyof AccessorComponentTypes = keyof AccessorComponentTypes,
> {
  bufferView: FLAT extends true
    ? number
    : InstanceType<AccessorComponentTypes[COMPONENT_TYPE]>
  componentType: COMPONENT_TYPE
  count: number
  max?: number[]
  min?: number[]
  type: AccessorType
}

export enum AccessorType {
  Scalar = 'SCALAR',
  Vec2 = 'VEC2',
  Vec3 = 'VEC3',
  Vec4 = 'VEC4',
  Mat2 = 'MAT2',
  Mat3 = 'MAT3',
  Mat4 = 'MAT4',
}

interface Asset {
  copyright: string
  generator: string
  version: string
}

interface BufferView {
  buffer: number
  byteLength: number
  byteOffset: number
}

interface Buffer {
  byteLength: number
  uri: string
}

export interface ImageRef {
  mimeType: 'image/jpeg'
  name?: string
  uri: string
}
