class_name BoneRig
extends Control
## Draws a Living Ink bone rig (data/rigs_li/<key>.json + assets/art/rigs_li/<key>/*.webp).
## Every layer is bound to a bone; a bone turns about its pivot and carries its children, like Skeleton2D. Layers draw
## in the rig's own z order, not in bone order, so a far arm can sit behind the torso while its hand sits in front.
## Pose: set `angles` (bone -> degrees), `offset` (whole figure, in display px) and `lean` (degrees about the feet).

var rig: Dictionary = {}
var key := ""
var tex := {}            # layer name -> Texture2D
var layer_tex := {}      # layer name -> [texture, pos] after variant swaps
var order: Array = []    # layers sorted by z
var angles := {}
var offset := Vector2.ZERO
var base_offset := Vector2.ZERO   # shifts the canvas so the ink sits at the view's top-left
var lean := 0.0
var squash := 1.0        # vertical scale about the feet (breathing, landing)
var ds := 1.0            # display px per stored rig px
var variant := ""

static func path_for(k: String) -> String:
	return "res://data/rigs_li/%s.json" % k

static func has_rig(k: String) -> bool:
	return FileAccess.file_exists(path_for(k))

func setup(k: String, display_size: Vector2) -> void:
	key = k
	rig = Data._load_json(path_for(k))
	size = display_size
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	ds = display_size.y / float(rig.canvas[1])
	order = rig.layers.duplicate()
	order.sort_custom(func(a, b): return a.z < b.z)
	for l in rig.layers:
		var t: Texture2D = load("res://assets/art/rigs_li/%s/%s.webp" % [k, l.name])
		layer_tex[l.name] = [t, Vector2(l.pos[0], l.pos[1])]

## Swaps the layers a variant replaces (the Elementalist's book and sign per element); "" restores the base.
func set_variant(v: String) -> void:
	if v == variant or not rig.has("variants"):
		return
	variant = v
	for l in rig.layers:
		layer_tex[l.name] = [load("res://assets/art/rigs_li/%s/%s.webp" % [key, l.name]), Vector2(l.pos[0], l.pos[1])]
	var vs: Dictionary = rig.variants.get(v, {})
	for ln in vs:
		var x: Dictionary = vs[ln]
		layer_tex[ln] = [load("res://assets/art/rigs_li/%s/%s.webp" % [key, x.file]), Vector2(x.pos[0], x.pos[1])]
	queue_redraw()

func bones() -> Dictionary:
	return rig.get("bones", {})

func ground() -> float:
	return float(rig.ground)

## The transform of a bone in stored rig space (parents first, each turning about its own pivot).
func bone_xform(b: String, cache: Dictionary) -> Transform2D:
	if cache.has(b):
		return cache[b]
	var B: Dictionary = rig.bones
	var t := Transform2D.IDENTITY
	if B.has(b):
		var bd: Dictionary = B[b]
		var parent: Variant = bd.parent
		var pt := Transform2D.IDENTITY if parent == null else bone_xform(String(parent), cache)
		var a := deg_to_rad(float(angles.get(b, 0.0)))
		var p := Vector2(bd.pivot[0], bd.pivot[1])
		t = pt * Transform2D(0.0, p) * Transform2D(a, Vector2.ZERO) * Transform2D(0.0, -p)
	cache[b] = t
	return t

## A point of a bone in display space (e.g. a hand, for projectiles).
func bone_point(b: String) -> Vector2:
	var B: Dictionary = rig.bones
	if not B.has(b):
		return _root() * Vector2(rig.canvas[0] * 0.5, rig.canvas[1] * 0.5)
	var p := Vector2(B[b].pivot[0], B[b].pivot[1])
	return _root() * (bone_xform(b, {}) * p)

func _root() -> Transform2D:
	var foot := Vector2(rig.canvas[0] * 0.5, float(rig.ground))
	var t := Transform2D(0.0, offset) * Transform2D(0.0, Vector2(ds, ds), 0.0, Vector2.ZERO)
	return t * Transform2D(0.0, foot) * Transform2D(deg_to_rad(lean), Vector2.ZERO) * Transform2D(0.0, Vector2(1.0, squash), 0.0, Vector2.ZERO) * Transform2D(0.0, -foot)

func _draw() -> void:
	if rig.is_empty():
		return
	var root := _root()
	var cache := {}
	for l in order:
		var lt: Array = layer_tex.get(l.name, [])
		if lt.is_empty() or lt[0] == null:
			continue
		draw_set_transform_matrix(root * bone_xform(String(l.bone), cache))
		draw_texture(lt[0], lt[1])
	draw_set_transform_matrix(Transform2D.IDENTITY)
