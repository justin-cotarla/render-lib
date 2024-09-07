import {
  FlatGltfAsset,
  GltfAsset,
  Mesh,
  Primitive,
  Scene,
  Node,
  Accessor,
  AccessorComponentTypes,
  GlConstant,
  Material,
  TextureRef,
  VariadicAttributes,
  Attributes,
  Texture,
  PbrMetallicRoughness,
  Sampler,
} from '../types/gltf'

const BUFFER_CONSTRUCTORS: AccessorComponentTypes = {
  [GlConstant.GL_BYTE]: Int8Array,
  [GlConstant.GL_UNSIGNED_BYTE]: Uint8Array,
  [GlConstant.GL_SHORT]: Int16Array,
  [GlConstant.GL_UNSIGNED_SHORT]: Uint16Array,
  [GlConstant.GL_UNSIGNED_INT]: Uint32Array,
  [GlConstant.GL_FLOAT]: Float32Array,
}

const DEFAULT_SAMPLER: Sampler = {
  magFilter: GlConstant.GL_LINEAR,
  minFilter: GlConstant.GL_LINEAR,
  wrapS: GlConstant.GL_REPEAT,
  wrapT: GlConstant.GL_REPEAT,
}

const filePathRegex = /(\/.*\/)/

export class GltfLoader {
  private doc!: FlatGltfAsset
  private path!: string
  private buffers: ArrayBuffer[] = []
  private imageBlobs: Blob[] = []

  private async getBuffer<
    GL_TYPE extends keyof AccessorComponentTypes,
    JS_TYPE extends InstanceType<AccessorComponentTypes[GL_TYPE]>,
  >(
    bufferId: number,
    componentType: keyof AccessorComponentTypes,
    byteOffset?: number,
    byteLength?: number
  ): Promise<JS_TYPE> {
    let buffer = this.buffers[bufferId]

    if (buffer) {
      return new BUFFER_CONSTRUCTORS[componentType](
        buffer,
        byteOffset,
        byteLength
      ) as JS_TYPE
    }

    const result = await fetch(`${this.path}/${this.doc.buffers[bufferId].uri}`)

    const blob = await result.blob()

    buffer = await blob.arrayBuffer()

    this.buffers[bufferId] = buffer

    return new BUFFER_CONSTRUCTORS[componentType](
      await blob.arrayBuffer(),
      byteOffset,
      byteLength
    ) as JS_TYPE
  }

  private async getImageBlob(imageId: number): Promise<Blob> {
    let blob = this.imageBlobs[imageId]

    if (blob) {
      return blob
    }

    const result = await fetch(`${this.path}/${this.doc.images![imageId].uri}`)

    blob = await result.blob()
    this.imageBlobs[imageId] = blob

    return blob
  }

  private async loadAccessor<
    COMPONENT_TYPE extends keyof AccessorComponentTypes,
  >(accessorId: number): Promise<Accessor<false, COMPONENT_TYPE>> {
    const { bufferView: bufferViewId, ...accessor } =
      this.doc.accessors[accessorId]

    const bufferView = this.doc.bufferViews[bufferViewId]

    return {
      bufferView: await this.getBuffer(
        bufferView.buffer,
        accessor.componentType,
        bufferView.byteOffset,
        bufferView.byteLength
      ),
      ...accessor,
    } as Accessor<false, COMPONENT_TYPE>
  }

  private async loadTexture(
    textureRef: TextureRef<true>
  ): Promise<Texture<false>> {
    const { source, sampler } = this.doc['textures'][textureRef.index]

    return {
      sampler:
        sampler !== undefined
          ? this.doc['samplers']![sampler]
          : DEFAULT_SAMPLER,
      source: await this.getImageBlob(source),
    }
  }

  private async loadTexCoord(
    variadicAttributes: Partial<VariadicAttributes<false>>,
    textureRef: TextureRef<true>
  ): Promise<TextureRef<false>> {
    return {
      index: await this.loadTexture(textureRef),
      texCoord:
        textureRef.texCoord !== undefined
          ? variadicAttributes[`TEXCOORD_${textureRef.texCoord}`]
          : undefined,
    }
  }

  private async loadPbrMetallicRoughness(
    variadicAttributes: Partial<VariadicAttributes<false>>,
    materialIndex: number
  ): Promise<PbrMetallicRoughness<false>> {
    const {
      pbrMetallicRoughness: {
        baseColorTexture,
        baseColorFactor,
        metallicRoughnessTexture,
        metallicFactor,
        roughnessFactor,
      },
    } = this.doc.materials[materialIndex]

    if (
      (baseColorTexture === undefined && baseColorFactor === undefined) ||
      (metallicRoughnessTexture === undefined &&
        (metallicFactor === undefined || roughnessFactor === undefined))
    ) {
      throw new Error(
        `Failed to load gltf material with index ${materialIndex}; invalid pbrMetallicRoughness`
      )
    }

    return {
      baseColorTexture:
        baseColorTexture !== undefined
          ? await this.loadTexCoord(variadicAttributes, baseColorTexture)
          : undefined,
      baseColorFactor,
      metallicRoughnessTexture:
        metallicRoughnessTexture !== undefined
          ? await this.loadTexCoord(
              variadicAttributes,
              metallicRoughnessTexture
            )
          : undefined,
      metallicFactor,
      roughnessFactor,
    } as PbrMetallicRoughness<false>
  }

  private async loadMaterial(
    variadicAttributes: Partial<VariadicAttributes<false>>,
    materialIndex: number
  ): Promise<Material<false>> {
    const { name, normalTexture, emissiveTexture, occlusionTexture } =
      this.doc.materials[materialIndex]

    return {
      name: name,
      normalTexture:
        normalTexture !== undefined
          ? {
              ...(await this.loadTexCoord(variadicAttributes, normalTexture)),
              scale: normalTexture.scale,
            }
          : undefined,
      occlusionTexture:
        occlusionTexture !== undefined
          ? {
              ...(await this.loadTexCoord(
                variadicAttributes,
                occlusionTexture
              )),
              strength: occlusionTexture.strength,
            }
          : undefined,
      emissiveTexture:
        emissiveTexture !== undefined
          ? await this.loadTexCoord(variadicAttributes, emissiveTexture)
          : undefined,
      pbrMetallicRoughness: await this.loadPbrMetallicRoughness(
        variadicAttributes,
        materialIndex
      ),
    }
  }

  private async loadVariadicAttribute(
    attributes: Attributes<true>,
    prefix: string
  ): Promise<Partial<VariadicAttributes<false>>> {
    const attributeBufferTuples = await Promise.all(
      Object.entries(attributes)
        .filter((tuple): tuple is [keyof VariadicAttributes<true>, number] =>
          tuple[0].startsWith(prefix)
        )
        .map(async ([key, accessorId]) => [
          key,
          await this.loadAccessor(accessorId),
        ])
    )

    return Object.fromEntries(attributeBufferTuples)
  }

  private async loadPrimitive({
    attributes,
    indices,
    material,
  }: Primitive<true>): Promise<Primitive<false>> {
    const variadicAttributes: Partial<VariadicAttributes<false>> = {
      ...this.loadVariadicAttribute(attributes, 'TEXCOORD'),
      ...this.loadVariadicAttribute(attributes, 'COLOR'),
      ...this.loadVariadicAttribute(attributes, 'JOINTS'),
      ...this.loadVariadicAttribute(attributes, 'WEIGHTS'),
    }

    return {
      indices: await this.loadAccessor(indices),
      attributes: {
        NORMAL:
          attributes.NORMAL !== undefined
            ? await this.loadAccessor(attributes.NORMAL)
            : undefined,
        POSITION:
          attributes.POSITION !== undefined
            ? await this.loadAccessor(attributes.POSITION)
            : undefined,
        TANGENT:
          attributes.TANGENT !== undefined
            ? await this.loadAccessor(attributes.TANGENT)
            : undefined,
      },
      material:
        material !== undefined
          ? await this.loadMaterial(variadicAttributes, material)
          : undefined,
    }
  }

  private async loadMesh(meshId: number): Promise<Mesh<false>> {
    const { name, primitives } = this.doc['meshes'][meshId]

    return {
      name,
      primitives: await Promise.all(
        primitives.map((primitive) => this.loadPrimitive(primitive))
      ),
    }
  }

  private async loadNode(nodeId: number): Promise<Node<false>> {
    const { mesh, children = [], ...data } = this.doc.nodes[nodeId]

    return {
      ...data,
      children: await Promise.all(
        children?.map((childId) => this.loadNode(childId))
      ),
      mesh: mesh !== undefined ? await this.loadMesh(mesh) : undefined,
    }
  }

  private async loadScene(
    scene: FlatGltfAsset['scenes'][number]
  ): Promise<Scene<false>> {
    return {
      name: scene.name,
      nodes: await Promise.all(
        scene.nodes.map((nodeId) => this.loadNode(nodeId))
      ),
    }
  }

  public async load(url: string): Promise<GltfAsset> {
    const result = await fetch(url)

    const [path] = filePathRegex.exec(url) ?? ['/']

    this.buffers = []
    this.imageBlobs = []
    this.path = path
    this.doc = (await result.json()) as FlatGltfAsset

    return {
      scene: this.doc.scene,
      scenes: await Promise.all(
        this.doc.scenes.map((scene) => this.loadScene(scene))
      ),
    }
  }
}
