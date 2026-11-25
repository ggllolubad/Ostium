extends SceneTree
# Renders the cloister garth through the Ostium lighting shader with the company in place, and saves a screenshot.
# Usage: godot --path . --rendering-driver opengl3 --script res://tests/lighting_demo.gd -- /tmp/garth_godot.png
const DIR := "res://assets/art/hub/garth/"

func _initialize() -> void:
	var out: String = OS.get_cmdline_user_args()[0] if OS.get_cmdline_user_args().size() > 0 else "/tmp/garth_godot.png"
	root.size = Vector2i(1600, 1000)
	Lighting.load_scene(DIR + "garth.light.json")
	var scene := Node2D.new()
	root.add_child(scene)
	var party: Dictionary = Lighting._json(DIR + "party.json")
	var mz: float = party.monument_z
	var slots: Array = party.party.duplicate()
	slots.sort_custom(func(a, b): return a.z > b.z)
	_layer(scene, "bg")
	for p in slots:
		if p.z > mz:
			_hero(scene, p)
	_layer(scene, "monument")
	for p in slots:
		if p.z <= mz:
			_hero(scene, p)
	_layer(scene, "fg")
	var dbg := int(OS.get_environment("LIGHT_DEBUG")) if OS.get_environment("LIGHT_DEBUG") != "" else 0
	if dbg > 0:
		for w in Lighting.mats:
			if w.get_ref():
				w.get_ref().set_shader_parameter("debug_view", dbg)
	for i in 4:
		await process_frame
	var img := root.get_texture().get_image()
	img.save_png(out)
	print("saved ", out)
	quit()

func _layer(parent: Node, name: String) -> void:
	var s := Sprite2D.new()
	s.centered = false
	s.texture = Lighting.tex_at(DIR + name + ".png")
	Lighting.light_layer(s, DIR + name)
	parent.add_child(s)

func _hero(parent: Node, p: Dictionary) -> void:
	var s := Sprite2D.new()
	s.centered = false
	s.texture = Lighting.tex_at(DIR + p.png)
	s.flip_h = false   # sprites are exported already facing their slot
	s.position = Vector2(p.feet[0] - p.w / 2.0, p.feet[1] - p.h + 6)
	Lighting.light_sprite(s, Lighting.tex_at(DIR + p.png.replace(".png", "_n.png")), p.z, false)
	parent.add_child(s)

