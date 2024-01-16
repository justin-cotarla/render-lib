struct PosVertex {
  @builtin(position) position : vec4f
}

@vertex
fn main(@location(0) position: vec4f) -> PosVertex
{
  var output : PosVertex;
  output.position = position;
  return output;
}
