declare module '*.wgsl?raw' {
  const shader: string
  export default shader
}

declare module '*.obj?raw' {
  const model: string
  export default model
}
