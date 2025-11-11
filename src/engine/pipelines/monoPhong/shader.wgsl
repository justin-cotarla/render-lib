struct Material {
  m_diff: vec4f,
  m_spec: vec4f,
  m_amb: vec4f,
  m_gls: f32
}

struct VSInput {
  @location(0) mesh_pos: vec4f,
  @location(1) normal: vec4f
}

struct FSInput {
  @builtin(position) pos : vec4f,
  @location(0) mesh_pos: vec4f,
  @location(1) normal: vec4f
}

struct VSOutput {
  @builtin(position) clip_pos : vec4f,
  @location(0) mesh_pos: vec4f,
  @location(1) normal: vec4f
}


struct GlobalUni {
  root_clip_transform: mat4x4f,
  camera_pos_root: vec4f,
  light_pos_root: vec4f
}

struct EntityUni {
  mesh_root_transform: mat4x4f,
  material: Material
}

@group(0) @binding(0) var<uniform> global_uni: GlobalUni;
@group(0) @binding(1) var<uniform> entity_uni: EntityUni;

@vertex
fn vert(input: VSInput) -> VSOutput
{
  var output : VSOutput;

  output.clip_pos = input.mesh_pos * entity_uni.mesh_root_transform * global_uni.root_clip_transform;
  output.mesh_pos = input.mesh_pos;
  output.normal = input.normal;

  return output;
}

@fragment
fn frag(input: FSInput) -> @location(0) vec4f
{
  let mesh_pos_root = input.mesh_pos * entity_uni.mesh_root_transform;

  let n = normalize(input.normal);
  let l = normalize(global_uni.light_pos_root - mesh_pos_root);
  let v = normalize(global_uni.camera_pos_root - mesh_pos_root);
  let r = -normalize(reflect(l, n));

  let g_amb = vec4(0.1, 0.1, 0.1, 1.0);

  let s_spec = vec4(0.8, 0.8, 0.8, 0.8);
  let s_diff = s_spec;

  let c_spec = (s_spec * entity_uni.material.m_spec) * pow(max(dot(v, r), 0.0), entity_uni.material.m_gls);
  let c_diff = (s_diff * entity_uni.material.m_diff) * max(dot(n, l), 0.0);
  let c_amb = g_amb * entity_uni.material.m_amb;

  var color = vec4(0.0, 0.0, 0.0, 1.0);
  color += c_amb;
  color += c_diff;
  color += c_spec;

  return color;
}
