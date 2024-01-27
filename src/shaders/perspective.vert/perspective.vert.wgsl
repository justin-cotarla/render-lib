struct Vertex {
  @builtin(vertex_index) index : u32,
  @location(0) model_pos: vec4f,
  @location(1) normal: vec4f
}

struct Output {
  @builtin(position) clip_pos : vec4f,
  @location(0) model_pos: vec4f,
  @location(1) normal: vec4f,
  @location(2) camera_pos: vec4f,
  @location(3) light_pos: vec4f
}

@group(0) @binding(0) var<uniform> modelClipTransform: mat4x4f;
@group(0) @binding(1) var<uniform> camera_pos: vec4f;
@group(0) @binding(2) var<uniform> light_pos: vec4f;

@vertex
fn main(vertex: Vertex) -> Output
{
  var output : Output;

  output.clip_pos = vertex.model_pos * modelClipTransform;
  output.model_pos = vertex.model_pos;
  output.normal = vertex.normal;
  output.light_pos = light_pos;
  output.camera_pos = camera_pos;
  return output;
}
