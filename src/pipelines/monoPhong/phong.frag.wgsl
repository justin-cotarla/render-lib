struct Material {
  m_diff: vec4f,
  m_spec: vec4f,
  m_amb: vec4f,
  m_gls: f32
}

struct Input {
  @builtin(position) pos : vec4f,
  @location(0) model_pos: vec4f,
  @location(1) normal: vec4f,
}

struct FSInput {
  camera_pos: vec4f,
  light_pos: vec4f,
  material: Material
}

@group(0) @binding(1) var<uniform> fs_uni: FSInput;

@fragment
fn main(input: Input) -> @location(0) vec4f
{
  let n = normalize(input.normal);
  let l = normalize(fs_uni.light_pos - input.model_pos);
  let v = normalize(fs_uni.camera_pos - input.model_pos);
  let r = normalize((2 * dot(n, l) * n) - l);

  let g_amb = vec4(0.1, 0.1, 0.1, 1.0);

  let s_spec = vec4(0.8, 0.8, 0.8, 0.8);
  let s_diff = s_spec;

  let c_spec = (s_spec * fs_uni.material.m_spec) * pow(max(dot(v, r), 0), fs_uni.material.m_gls);
  let c_diff = (s_diff * fs_uni.material.m_diff) * max(dot(n, l), 0);
  let c_amb = g_amb * fs_uni.material.m_amb;

  var color = vec4(0.0, 0.0, 0.0, 1.0);
  color += c_amb;
  color += c_diff;
  color += c_spec;

  return color;
}