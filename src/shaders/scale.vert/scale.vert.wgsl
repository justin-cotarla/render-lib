@group(0) @binding(0) var<uniform> transform: mat4x4f;

struct Vertex {
  @builtin(vertex_index) index : u32,
  @location(0) position: vec4f,
  @location(1) normal: vec4f
}

struct vOutput {
  @builtin(position) position : vec4f,
  @location(0) normal: vec4f,
}

@vertex
fn main(vertex: Vertex) -> vOutput
{
  var output : vOutput;

  let nearPlane = 10.0;
  let farPlane = 50.0;

  let zoom = 1.0;

  let pMatrix: mat4x4f = mat4x4f(
    zoom, 0.0, 0.0, 0.0,
    0.0, zoom, 0.0, 0.0,
    0.0, 0.0, farPlane / (farPlane - nearPlane), -nearPlane * farPlane / (farPlane - nearPlane),
    0.0, 0.0, 1.0, 0.0
  );


  let oMatrix: mat4x4f = mat4x4f(
    zoom, 0.0, 0.0, 0.0,
    0.0, zoom, 0.0, 0.0,
    0.0, 0.0, 1 / (farPlane - nearPlane), nearPlane / (nearPlane - farPlane),
    0.0, 0.0, 0.0, 1.0
  );

  output.position = vertex.position * transform * pMatrix;
  // output.position = vertex.position * oMatrix;
  output.normal = vertex.normal;
  return output;
}
