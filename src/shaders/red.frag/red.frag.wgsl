struct PosVertex {
  @builtin(position) position : vec4f,
}

@fragment
fn main(fragData: PosVertex) -> @location(0) vec4f
{
  return vec4(1, 0, 0, 1);
}