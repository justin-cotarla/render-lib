export const setupResizeObserver = (
  onChange: (width: number, height: number) => void
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
