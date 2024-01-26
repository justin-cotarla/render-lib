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

@group(0) @binding(0) var<uniform> transform: mat4x4f;
@group(0) @binding(1) var<uniform> camera_pos: vec4f;
@group(0) @binding(2) var<uniform> light_pos: vec4f;

@vertex
fn main(vertex: Vertex) -> Output
{
  var output : Output;

  let nearPlane = 10.0;
  let farPlane = 100.0;

  let zoom = 1.0;

  let pMatrix: mat4x4f = mat4x4f(
    zoom, 0.0, 0.0, 0.0,
    0.0, zoom, 0.0, 0.0,
    0.0, 0.0, farPlane / (farPlane - nearPlane), -nearPlane * farPlane / (farPlane - nearPlane),
    0.0, 0.0, 1.0, 0.0
  );

  output.clip_pos = vertex.model_pos * transform * pMatrix;
  output.model_pos = vertex.model_pos;
  output.normal = vertex.normal;
  output.light_pos = light_pos;
  output.camera_pos = camera_pos;
  return output;
}
