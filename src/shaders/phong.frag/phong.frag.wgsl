struct Input {
  @builtin(position) pos : vec4f,
  @location(0) model_pos: vec4f,
  @location(1) normal: vec4f,
  @location(2) camera_pos: vec4f,
  @location(3) light_pos: vec4f
}

@fragment
fn main(input: Input) -> @location(0) vec4f
{
  let n = normalize(input.normal);
  let l = normalize(input.light_pos - input.model_pos);
  let v = normalize(input.camera_pos - input.model_pos);
  let r = normalize((2 * dot(n, l) * n) - l);

  let g_amb = vec4(0.1, 0.1, 0.1, 1.0);

  let m_diff = vec4(1.0, 0.0, 0.0, 1.0);
  let m_spec = vec4(1.0, 1.0, 1.0, 1.0);
  let m_amb = m_diff;
  let m_gls = 16.0;

  let s_spec = vec4(0.8, 0.8, 0.8, 0.8);
  let s_diff = s_spec;

  let c_spec = (s_spec * m_spec) * pow(max(dot(v, r), 0), m_gls);
  let c_diff = (s_diff * m_diff) * max(dot(n, l), 0);
  let c_amb = g_amb * m_amb;

  var color = vec4(0.0, 0.0, 0.0, 1.0);
  color += c_amb;
  color += c_diff;
  color += c_spec;

  return color;
}