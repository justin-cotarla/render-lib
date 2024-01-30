struct VertexInput {
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

struct VSInput {
  model_clip_transform: mat4x4f
}

struct FSInput {
  camera_pos: vec4f,
  light_pos: vec4f
}

@group(0) @binding(0) var<uniform> vs_uni: VSInput;
@group(0) @binding(1) var<uniform> fs_uni: FSInput;

@vertex
fn main(input: VertexInput) -> Output
{
  var output : Output;

  output.clip_pos = input.model_pos * vs_uni.model_clip_transform;
  output.model_pos = input.model_pos;
  output.normal = input.normal;
  output.light_pos = fs_uni.light_pos;
  output.camera_pos = fs_uni.camera_pos;
  return output;
}
