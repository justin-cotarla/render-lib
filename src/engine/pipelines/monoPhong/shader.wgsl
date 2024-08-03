struct Material {
  m_diff: vec4f,
  m_spec: vec4f,
  m_amb: vec4f,
  m_gls: f32
}

struct VSInput {
  @builtin(vertex_index) index : u32,
  @location(0) model_pos: vec4f,
  @location(1) normal: vec4f
}

struct FSInput {
  @builtin(position) pos : vec4f,
  @location(0) model_pos: vec4f,
  @location(1) normal: vec4f,
}

struct VSOutput {
  @builtin(position) clip_pos : vec4f,
  @location(0) model_pos: vec4f,
  @location(1) normal: vec4f,
}

struct VSUni {
  model_clip_transform: mat4x4f
}

struct FSUni {
  camera_pos: vec4f,
  light_pos: vec4f,
  material: Material
}

@group(0) @binding(0) var<uniform> vs_uni: VSUni;
@group(0) @binding(1) var<uniform> fs_uni: FSUni;

@vertex
fn vert(input: VSInput) -> VSOutput
{
  var output : VSOutput;

  output.clip_pos = input.model_pos * vs_uni.model_clip_transform;
  output.model_pos = input.model_pos;
  output.normal = input.normal;

  return output;
}

@fragment
fn frag(input: FSInput) -> @location(0) vec4f
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
