const SAMPLE_SIZE = 60

const lastFpsValues: number[] = []

export const averageFps = (currentFps: number): number => {
  if (currentFps === Infinity) {
    return 0
  }

  lastFpsValues.unshift(currentFps)

  if (lastFpsValues.length > SAMPLE_SIZE) {
    lastFpsValues.pop()
  }

  return (
    lastFpsValues.reduce((current, acc) => acc + current) / lastFpsValues.length
  )
}
