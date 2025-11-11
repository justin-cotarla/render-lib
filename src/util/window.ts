export const setupResizeObserver = (
  onChange: (width: number, height: number) => void,
): ResizeObserver => {
  const resizeObserver = new ResizeObserver((entries) => {
    if (!entries[0]?.borderBoxSize[0]) {
      return
    }

    const {
      contentBoxSize: [{ blockSize, inlineSize }],
    } = entries[0]

    onChange(blockSize, inlineSize)
  })

  return resizeObserver
}

export const getDevice = async (): Promise<GPUDevice> => {
  if (!navigator.gpu) {
    throw new Error('WebGPU not supported')
  }

  const adapter = await navigator.gpu.requestAdapter()

  if (!adapter) {
    throw Error("Couldn't request WebGPU adapter.")
  }

  return adapter.requestDevice()
}
