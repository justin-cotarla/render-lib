struct GlobalUni {
  root_cam_transform: mat4x4f
}

struct EntityUni {
  entity_root_transform: mat4x4f,
  flat_color: vec4f
}

@group(0) @binding(0) var<uniform> global_uni: GlobalUni;
@group(0) @binding(1) var<uniform> entity_uni: EntityUni;

@vertex
fn vert(@location(0) vertex_pos: vec2f) -> @builtin(position) vec4f
{
  return vec4f(vertex_pos, 1.0, 1.0) * entity_uni.entity_root_transform * global_uni.root_cam_transform;
}

@fragment
fn frag() -> @location(0) vec4f
{
  return entity_uni.flat_color;
}
