struct Vertex {
  @location(0) position: vec4f,
  @location(1) normal: vec4f
}

struct vOutput {
  @builtin(position) position : vec4f,
  @location(0) normal: vec4f
}

@vertex
fn main(vertex: Vertex) -> vOutput
{
  var output : vOutput;
  output.position = vertex.position;
  output.normal = vertex.normal;
  return output;
}
