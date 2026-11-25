class_name Lighting
extends RefCounted
## Lighting (static, like Data and Run): the one lighting model for every screen. Holds the look (data/lighting.json), the current scene's camera and
## lights (from the scene's .light.json, exported by the art pipeline), and builds the lit material for any CanvasItem.
## Usage:
##   Lighting.load_scene("res://assets/art/hub/garth/garth.light.json")
##   Lighting.light_layer(sprite, "res://assets/art/hub/garth/bg")       # background or prop layer with its maps
##   Lighting.light_sprite(node, normal_tex, feet_depth_m, flipped)       # a hero or foe standing at a depth
## Every lit material is remembered, so a light added or moved later updates them all (refresh()).

const SHADER := preload("res://shaders/ostium_lit.gdshader")
const MAX_LIGHTS := 64
static var look: Dictionary = {}
static var cam := Vector4(3.0, 760.0, 300.0, 800.0)
static var lights: Array = []   # [{pos:[x,y,z], range, I, col:[r,g,b]}]
static var mats: Array = []     # weakrefs to every lit material

static func load_scene(path: String) -> void:
	if look.is_empty():
		look = _json("res://data/lighting.json")
	var m := _json(path)
	var c: Dictionary = m.get("camera", {})
	cam = Vector4(c.get("eye_m", 3.0), c.get("focal_px", 760.0), c.get("horizon", 300.0), c.get("cx", 800.0))
	lights = m.get("lights", [])
	refresh()

static func add_light(pos: Vector3, intensity: float, range_m: float, col := Color(1.0, 0.6, 0.28)) -> int:
	lights.append({"pos": [pos.x, pos.y, pos.z], "I": intensity, "range": range_m, "col": [col.r, col.g, col.b]})
	refresh()
	return lights.size() - 1

static func material() -> ShaderMaterial:
	var mat := ShaderMaterial.new()
	mat.shader = SHADER
	if look.is_empty():
		look = _json("res://data/lighting.json")
	_push(mat)
	mats.append(weakref(mat))
	return mat

static func light_layer(node: CanvasItem, base: String) -> void:
	var mat := material()
	_albedo(mat, node)
	for pair in [["normal_map", "_n"], ["emissive_map", "_e"], ["depth_map", "_d"], ["pillow_map", "_p"]]:
		var tex := tex_at(base + pair[1] + ".png")
		if tex:
			mat.set_shader_parameter(pair[0], tex)
			mat.set_shader_parameter("has_" + str(pair[0]).trim_suffix("_map"), true)
	node.material = mat

static func light_sprite(node: CanvasItem, normal_tex: Texture2D, depth_m: float, flipped := false) -> void:
	var mat := material()
	_albedo(mat, node)
	mat.set_shader_parameter("is_sprite", true)
	mat.set_shader_parameter("sprite_z", depth_m)
	mat.set_shader_parameter("flip_h", flipped)
	if normal_tex:
		mat.set_shader_parameter("normal_map", normal_tex)
		mat.set_shader_parameter("has_normal", true)
	node.material = mat

static func _albedo(mat: ShaderMaterial, node: CanvasItem) -> void:
	var t = node.get("texture")
	if t is Texture2D and not (t is AtlasTexture):
		mat.set_shader_parameter("albedo_map", t)
		mat.set_shader_parameter("has_albedo", true)

static func refresh() -> void:
	var keep: Array = []
	for w in mats:
		var m = w.get_ref()
		if m:
			_push(m)
			keep.append(w)
	mats = keep

static func _push(mat: ShaderMaterial) -> void:
	mat.set_shader_parameter("cam", cam)
	var pos := PackedVector4Array()
	var col := PackedVector4Array()
	for l in lights.slice(0, MAX_LIGHTS):
		pos.append(Vector4(l.pos[0], l.pos[1], l.pos[2], l.range))
		col.append(Vector4(l.col[0], l.col[1], l.col[2], l.I))
	while pos.size() < MAX_LIGHTS:
		pos.append(Vector4.ZERO)
		col.append(Vector4.ZERO)
	mat.set_shader_parameter("light_pos", pos)
	mat.set_shader_parameter("light_col", col)
	mat.set_shader_parameter("light_count", min(lights.size(), MAX_LIGHTS))
	for k in look.keys():
		var v = look[k]
		if v is Array:
			mat.set_shader_parameter(k, Vector3(v[0], v[1], v[2]))
		elif k != "pillow_radius" and k != "pillow_strength":
			mat.set_shader_parameter(k, float(v))

## Shifts every lit node's scene coordinates, so a parent can slide the whole scene (the title pan) and the light stays put.
static func set_shift(v: Vector2) -> void:
	for w in mats:
		var m = w.get_ref()
		if m:
			m.set_shader_parameter("scene_shift", v)

## a texture from an imported resource, or straight from a PNG on disk (tools, tests, freshly exported art)
static func tex_at(path: String) -> Texture2D:
	if ResourceLoader.exists(path):
		return load(path)
	if FileAccess.file_exists(path):
		var img := Image.load_from_file(ProjectSettings.globalize_path(path) if path.begins_with("res://") else path)
		if img:
			return ImageTexture.create_from_image(img)
	return null

static func _json(path: String) -> Dictionary:
	if not FileAccess.file_exists(path):
		return {}
	var d = JSON.parse_string(FileAccess.get_file_as_string(path))
	return d if d is Dictionary else {}

