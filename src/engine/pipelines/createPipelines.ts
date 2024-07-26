import { MonoPhongPipeline } from './monoPhong'
import { MonoToonPipeline } from './monoToon'
import { Pipeline } from './Pipeline'

export const createPipelines = (
  device: GPUDevice
): Record<string, Pipeline> => ({
  MONO_PHONG: new MonoPhongPipeline(device),
  MONO_TOON: new MonoToonPipeline(device),
})
