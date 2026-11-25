class_name Hub
extends Control
## The abbey, played by clicking: the cloister garth with its doors, each building's interior with its keeper,
## the shop panel on each keeper's object, the company at the cross and the church that leads to the doors.
## Also the title screen: the sky above the abbey, and on Play the view sinks slowly into the garth.

var main: Node
var cam: Node2D            # holds the lit scene; slides for the title pan
var world: Node2D
var sky: Sprite2D
var ui: Control
var hud: Control
var caption: Label
var fade: ColorRect
var spots: Array = []      # [{id, poly: PackedVector2Array, label, outline: Node}] in hit priority order
var place := ""            # "garth" or a room id
var hover_id := ""
var panel: Control = null
var input_on := false
var guests: Array = []     # roster heroes resting in the Guesthouse, by rest slot

const GARTH := "res://assets/art/hub/garth/"
const INT := "res://assets/art/hub/int/"
const SKY_H := 1400.0
const ROOM_OF := {"undercroft": "smithy", "infirmarium": "infirmarium", "almonry": "almonry", "cellarium": "cellarium",
	"sacristy": "sacristy", "scriptorium": "scriptorium", "chapter": "chapter", "guesthouse": "guesthouse"}

func _ready() -> void:
	size = Vector2(1600, 1000)
	mouse_filter = Control.MOUSE_FILTER_STOP
	clip_contents = true
	cam = Node2D.new()
	add_child(cam)
	ui = Control.new()
	ui.size = size
	ui.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(ui)
	hud = Control.new()
	hud.size = size
	hud.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(hud)
	caption = Label.new()
	caption.add_theme_font_override("font", UiStyle.font_sc)
	caption.add_theme_font_size_override("font_size", 22)
	caption.add_theme_color_override("font_color", Color("f3e3c0"))
	caption.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.9))
	caption.add_theme_constant_override("shadow_offset_x", 2)
	caption.add_theme_constant_override("shadow_offset_y", 2)
	caption.add_theme_constant_override("shadow_outline_size", 6)
	caption.mouse_filter = Control.MOUSE_FILTER_IGNORE
	caption.visible = false
	add_child(caption)
	fade = ColorRect.new()
	fade.color = Color(0, 0, 0, 0)
	fade.size = size
	fade.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(fade)

# ================================================================== the garth
func show_garth() -> void:
	Run.meta_load()
	_clear_scene()
	place = "garth"
	Lighting.load_scene(GARTH + "garth.light.json")
	var party: Dictionary = Lighting._json(GARTH + "party.json")
	var mz: float = party.monument_z
	var n: int = Abbey.party_heroes().size()
	var slots: Array = party.party.filter(func(p): return int(p.slot) < n)
	slots.sort_custom(func(a, b): return a.z > b.z)
	_layer(GARTH, "bg")
	for p in slots:
		if p.z > mz:
			_garth_hero(p)
	_layer(GARTH, "monument")
	for p in slots:
		if p.z <= mz:
			_garth_hero(p)
	_layer(GARTH, "fg")
	var J: Dictionary = Lighting._json(GARTH + "garth_hotspots.json")
	var hs: Dictionary = J.get("hotspots", {})
	var order := []
	for k in hs:
		if str(k).begins_with("company"):
			if k == "company_cross" or int(hs[k].get("slot", 0)) < n:
				order.push_front(k)
		else:
			order.append(k)
	for k in order:
		var h: Dictionary = hs[k]
		var ol: Node = null
		var op := GARTH + "hover/%s_outline.png" % k
		if Lighting.tex_at(op) != null:
			ol = _outline(op)
		spots.append({"id": k, "poly": _poly(h.poly), "label": h.label if not str(k).begins_with("company") else "The company", "outline": ol})
	_hud()

func _garth_hero(p: Dictionary) -> void:
	var s := Sprite2D.new()
	s.centered = false
	s.texture = Lighting.tex_at(GARTH + p.png)
	s.position = Vector2(p.feet[0] - p.w / 2.0, p.feet[1] - p.h + 6)
	Lighting.light_sprite(s, Lighting.tex_at(GARTH + p.png.replace(".png", "_n.png")), p.z, false)
	world.add_child(s)

# ================================================================== an interior
func show_room(room: String) -> void:
	Run.meta_load()
	_clear_scene()
	place = room
	var dir := INT + room + "/"
	Lighting.load_scene(dir + room + ".light.json")
	var R: Dictionary = Lighting._json(dir + "room.json")
	var sprites: Array = R.sprites.duplicate()
	sprites.sort_custom(func(a, b): return a.z > b.z)
	guests = []
	if room == "guesthouse":
		for h in Run.meta.roster:
			if not Run.meta.party.has(h.id):
				guests.append(h)
	var keeper: Dictionary = {}
	_layer(dir, "bg")
	for s in sprites:
		if s.id == "keeper":
			keeper = s
		elif str(s.id).begins_with("hero_"):
			if int(str(s.id).trim_prefix("hero_")) < guests.size():
				_room_sprite(dir, s, -1)
		else:
			_room_sprite(dir, s, -1)
	_room_sprite(dir, keeper, -1)
	if "mid" in R.layers:
		_layer(dir, "mid")
		if keeper.get("over_cut") != null:
			_room_sprite(dir, keeper, int(keeper.over_cut))
	if "fg" in R.layers:
		_layer(dir, "fg")
	var hs: Dictionary = R.hotspots
	var order := ["keeper"]
	for k in hs:
		if str(k).begins_with("hero_") and int(str(k).trim_prefix("hero_")) < guests.size():
			order.append(k)
	order += [R.panel, "exit"]
	for k in order:
		if not hs.has(k):
			continue
		var lab: String = hs[k].label
		if str(k).begins_with("hero_"):
			var g: Dictionary = guests[int(str(k).trim_prefix("hero_"))]
			lab = "%s, %s" % [g.name, Data.HEROES[g.key].name]
		spots.append({"id": k, "poly": _poly(hs[k].poly), "label": lab, "outline": _outline(dir + "hover/%s_outline.png" % k)})
	_hud()

func _room_sprite(dir: String, p: Dictionary, cut: int) -> void:
	if p.is_empty():
		return
	var s := Sprite2D.new()
	s.centered = false
	s.texture = Lighting.tex_at(dir + p.png)
	s.position = Vector2(p.pos[0], p.pos[1])
	if cut >= 0:
		s.region_enabled = true
		s.region_rect = Rect2(0, 0, s.texture.get_width(), max(0, cut - p.pos[1]))
	Lighting.light_sprite(s, Lighting.tex_at(dir + p.png.replace(".png", "_n.png")), p.z, false)
	world.add_child(s)

# ================================================================== shared scene bits
func _clear_scene() -> void:
	if world:
		world.queue_free()
	world = Node2D.new()
	cam.add_child(world)
	if sky:
		cam.move_child(sky, 0)
	spots = []
	hover_id = ""
	caption.visible = false
	for c in hud.get_children():
		c.queue_free()
	Lighting.mats = []

func _layer(dir: String, name: String) -> void:
	var s := Sprite2D.new()
	s.centered = false
	s.texture = Lighting.tex_at(dir + name + ".png")
	Lighting.light_layer(s, dir + name)
	world.add_child(s)

func _outline(path: String) -> Node:
	var t := Lighting.tex_at(path)
	if t == null:
		return null
	var s := Sprite2D.new()
	s.centered = false
	s.texture = t
	s.visible = false
	world.add_child(s)
	return s

func _poly(pts: Array) -> PackedVector2Array:
	var o := PackedVector2Array()
	for p in pts:
		o.append(Vector2(p[0], p[1]))
	return o

## The only HUD: the ostia dish, top right, and in a room a quiet reminder that the door leads back out.
func _hud() -> void:
	var dish := TextureRect.new()
	dish.texture = load("res://assets/art/icons/ostia.png")
	dish.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	dish.size = Vector2(54, 54)
	dish.position = Vector2(1460, 16)
	dish.mouse_filter = Control.MOUSE_FILTER_IGNORE
	hud.add_child(dish)
	var l := _shadow_label("%d" % int(Run.meta.ostia), 26)
	l.position = Vector2(1516, 24)
	l.size = Vector2(80, 40)
	hud.add_child(l)
	dish.tooltip_text = "Ostia: lead badges of the order"

func _shadow_label(t: String, fs: int, font: FontFile = null) -> Label:
	var l := Label.new()
	l.text = t
	l.add_theme_font_override("font", font if font else UiStyle.font_sc)
	l.add_theme_font_size_override("font_size", fs)
	l.add_theme_color_override("font_color", Color("f3e3c0"))
	l.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.9))
	l.add_theme_constant_override("shadow_offset_x", 2)
	l.add_theme_constant_override("shadow_offset_y", 2)
	l.add_theme_constant_override("shadow_outline_size", 6)
	l.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return l

# ================================================================== input
func _gui_input(ev: InputEvent) -> void:
	if not input_on or panel != null:
		return
	if ev is InputEventMouseMotion:
		_hover(ev.position)
	elif ev is InputEventMouseButton and ev.pressed and ev.button_index == MOUSE_BUTTON_LEFT:
		_hover(ev.position)
		if hover_id != "":
			_click(hover_id)

func _unhandled_key_input(ev: InputEvent) -> void:
	if not visible or not input_on:
		return
	if ev is InputEventKey and ev.pressed and ev.keycode == KEY_ESCAPE:
		if panel != null:
			close_panel()
		elif place != "garth":
			_go(show_garth)

func _hover(p: Vector2) -> void:
	var hit := ""
	var lab := ""
	for s in spots:
		if Geometry2D.is_point_in_polygon(p, s.poly):
			hit = s.id
			lab = s.label
			break
	if hit != hover_id:
		for s in spots:
			if s.outline:
				s.outline.visible = s.id == hit
		hover_id = hit
		mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND if hit != "" else Control.CURSOR_ARROW
	caption.visible = hit != ""
	if hit != "":
		caption.text = lab
		caption.reset_size()
		caption.position = (p + Vector2(18, 14)).clamp(Vector2(8, 8), size - caption.size - Vector2(8, 8))

func _click(id: String) -> void:
	caption.visible = false
	if place == "garth":
		if ROOM_OF.has(id):
			var room: String = ROOM_OF[id]
			_go(func(): show_room(room))
		elif id == "church":
			_go(func(): main.open_church())
		elif id.begins_with("company"):
			open_panel("company")
		return
	if id == "exit":
		_go(show_garth)
	elif id == "keeper":
		_speak()
	elif id.begins_with("hero_"):
		open_panel("company", int(guests[int(id.trim_prefix("hero_"))].id))
	else:
		open_panel(place)

## A keeper's line, in a little scroll beside them.
func _speak() -> void:
	var k: Dictionary = Abbey.A.keepers.get(place, {})
	if k.is_empty():
		return
	var poly: PackedVector2Array = spots.filter(func(s): return s.id == "keeper")[0].poly
	var top := Vector2(INF, INF)
	for v in poly:
		if v.y < top.y:
			top = v
	var box := PanelContainer.new()
	box.add_theme_stylebox_override("panel", ShopPanel.sbox("btn", 18))
	var l := Label.new()
	l.text = "%s:  \"%s\"" % [k.name, Abbey.pick(k.hello)]
	l.add_theme_font_override("font", UiStyle.font_it)
	l.add_theme_font_size_override("font_size", 19)
	l.add_theme_color_override("font_color", Color("2b1d12"))
	l.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	l.custom_minimum_size = Vector2(360, 0)
	box.add_child(l)
	box.mouse_filter = Control.MOUSE_FILTER_IGNORE
	hud.add_child(box)
	box.reset_size()
	box.position = (top + Vector2(-190, -box.size.y - 20)).clamp(Vector2(10, 70), size - box.size - Vector2(10, 10))
	var tw := box.create_tween()
	tw.tween_interval(3.5)
	tw.tween_property(box, "modulate:a", 0.0, 0.8)
	tw.tween_callback(box.queue_free)

# ================================================================== panels
func open_panel(shop: String, focus := -1) -> void:
	if panel != null:
		panel.queue_free()
	caption.visible = false
	for s in spots:
		if s.outline:
			s.outline.visible = false
	hover_id = ""
	hud.visible = false
	panel = ShopPanel.new()
	panel.hub = self
	panel.shop = shop
	panel.focus = focus
	ui.add_child(panel)
	panel.modulate.a = 0.0
	panel.create_tween().tween_property(panel, "modulate:a", 1.0, 0.22)

func close_panel() -> void:
	if panel == null:
		return
	var p := panel
	panel = null
	hud.visible = true
	var tw := p.create_tween()
	tw.tween_property(p, "modulate:a", 0.0, 0.18)
	tw.tween_callback(p.queue_free)
	# the room may have changed: a new guest in the beds, a hero gone into the company
	if place == "guesthouse" or place == "garth":
		if place == "garth":
			show_garth()
		else:
			show_room(place)
	else:
		for c in hud.get_children():
			c.queue_free()
		_hud()

func go_church() -> void:
	main.open_church()

# ================================================================== transitions
func _go(then: Callable) -> void:
	if not input_on:
		return
	input_on = false
	var tw := create_tween()
	tw.tween_property(fade, "color:a", 1.0, 0.28)
	tw.tween_callback(then)
	tw.tween_property(fade, "color:a", 0.0, 0.32)
	tw.tween_callback(func(): input_on = true)

func enter() -> void:
	visible = true
	input_on = true
	show_garth()

# ================================================================== title
var title_ui: Control

func show_title() -> void:
	visible = true
	input_on = false
	show_garth()
	if sky == null:
		sky = Sprite2D.new()
		sky.centered = false
		sky.texture = load("res://assets/art/hub/title_sky.png")
		sky.position = Vector2(0, -SKY_H)
		cam.add_child(sky)
		cam.move_child(sky, 0)
	_set_pan(SKY_H)
	hud.visible = false
	title_ui = Control.new()
	title_ui.size = size
	add_child(title_ui)
	move_child(title_ui, get_child_count() - 2)
	# a soft dusk shadow behind the words so they hold against the bright cloud rims
	var shade := TextureRect.new()
	shade.texture = load("res://assets/art/hub/title_shade.png")
	shade.position = Vector2(300, 90)
	shade.size = Vector2(1000, 560)
	shade.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	shade.mouse_filter = Control.MOUSE_FILTER_IGNORE
	title_ui.add_child(shade)
	var t := _shadow_label("Ostium", 132, UiStyle.font_bl)
	t.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	t.position = Vector2(0, 150)
	t.size = Vector2(1600, 170)
	t.add_theme_color_override("font_color", Color("e8dcc0"))
	title_ui.add_child(t)
	var st := _shadow_label("The Abbey of the Threshold", 30, UiStyle.font_it)
	st.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	st.position = Vector2(0, 320)
	st.size = Vector2(1600, 44)
	title_ui.add_child(st)
	var y := 470.0
	var items := [["Enter the abbey", _play]]
	if Run.has_save():
		items.push_front(["Continue the descent", _continue])
	items.append(["Leave", func(): get_tree().quit()])
	for it in items:
		var b := ShopPanel.make_button(it[0], Vector2(620, y), Vector2(360, 64), it[1], 26)
		title_ui.add_child(b)
		y += 82
	for c in title_ui.get_children():
		c.modulate.a = 0.0
		c.create_tween().tween_property(c, "modulate:a", 1.0, 1.4)

func _set_pan(v: float) -> void:
	cam.position.y = v
	Lighting.set_shift(Vector2(0, v))

func _play() -> void:
	if title_ui == null:
		return
	var tu := title_ui
	title_ui = null
	var tw := create_tween()
	tw.tween_property(tu, "modulate:a", 0.0, 0.6)
	tw.tween_callback(tu.queue_free)
	var pan := create_tween()
	pan.tween_method(_set_pan, SKY_H, 0.0, 5.2).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)
	pan.tween_callback(func(): hud.visible = true; input_on = true)

func _continue() -> void:
	if title_ui:
		title_ui.queue_free()
		title_ui = null
	_set_pan(0.0)
	hud.visible = true
	main.continue_run()

