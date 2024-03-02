struct VertexInput {
  @builtin(vertex_index) index : u32,
  @location(0) model_pos: vec4f,
  @location(1) normal: vec4f
}

struct Output {
  @builtin(position) clip_pos : vec4f,
  @location(0) model_pos: vec4f,
  @location(1) normal: vec4f,
}

struct VSInput {
  model_clip_transform: mat4x4f
}

@group(0) @binding(0) var<uniform> vs_uni: VSInput;

@vertex
fn main(input: VertexInput) -> Output
{
  var output : Output;

  output.clip_pos = input.model_pos * vs_uni.model_clip_transform;
  output.model_pos = input.model_pos;
  output.normal = input.normal;

  return output;
}
