extends SceneTree
# Renders one abbey interior through the Ostium lighting shader, with its keeper and any resting roster heroes, and saves
# a screenshot for the parity check against the reference render (grim/light/interior_lit.py).
# Usage: godot --path . --rendering-driver opengl3 --script res://tests/interior_demo.gd -- <room> /tmp/out.png [hover_id]

func _initialize() -> void:
	var args := OS.get_cmdline_user_args()
	var room: String = args[0] if args.size() > 0 else "smithy"
	var out: String = args[1] if args.size() > 1 else "/tmp/%s_godot.png" % room
	var hover: String = args[2] if args.size() > 2 else ""
	var dir := "res://assets/art/hub/int/%s/" % room
	root.size = Vector2i(1600, 1000)
	Lighting.load_scene(dir + room + ".light.json")
	var R: Dictionary = Lighting._json(dir + "room.json")
	var scene := Node2D.new()
	root.add_child(scene)
	var sprites: Array = R.sprites.duplicate()
	sprites.sort_custom(func(a, b): return a.z > b.z)
	_layer(scene, dir, "bg")
	var keeper: Dictionary = {}
	for s in sprites:
		if s.id == "keeper":
			keeper = s
		else:
			_sprite(scene, dir, s, -1)
	_sprite(scene, dir, keeper, -1)
	if "mid" in R.layers:
		_layer(scene, dir, "mid")
		if keeper.get("over_cut") != null:
			_sprite(scene, dir, keeper, int(keeper.over_cut))   # hands resting on the counter come back over it
	_layer(scene, dir, "fg")
	if hover != "":
		var h := Sprite2D.new()
		h.centered = false
		h.texture = Lighting.tex_at(dir + "hover/%s_outline.png" % hover)
		scene.add_child(h)
	for i in 4:
		await process_frame
	root.get_texture().get_image().save_png(out)
	print("saved ", out)
	quit()

func _layer(parent: Node, dir: String, name: String) -> void:
	var s := Sprite2D.new()
	s.centered = false
	s.texture = Lighting.tex_at(dir + name + ".png")
	Lighting.light_layer(s, dir + name)
	parent.add_child(s)

func _sprite(parent: Node, dir: String, p: Dictionary, cut: int) -> void:
	var s := Sprite2D.new()
	s.centered = false
	s.texture = Lighting.tex_at(dir + p.png)
	s.position = Vector2(p.pos[0], p.pos[1])
	if cut >= 0:
		s.region_enabled = true
		s.region_rect = Rect2(0, 0, s.texture.get_width(), max(0, cut - p.pos[1]))
	Lighting.light_sprite(s, Lighting.tex_at(dir + p.png.replace(".png", "_n.png")), p.z, false)
	parent.add_child(s)

