class_name UiCard
extends Panel
## A hand card. Emits through the main controller on click; lifts on hover.

const W := 186
const H := 252

var main: Node
var hero_id := -1
var hand_index := -1
var card_id := ""
var queued_at := -1
var playable := true
var base_y := 0.0
var _hover := false
var reward_cb: Callable
var badge := ""
const RARITY_COL := {"S": Color("6f5036"), "K": Color("6f5036"), "C": Color("2b1d12"), "U": Color("3f6fa0"), "R": Color("a9822f"), "X": Color("6d5a8a"), "F": Color("62804f"), "Curse": Color("9c3d2b")}

static var _art_cache := {}

func setup(m: Node, hid: int, idx: int, cid: String) -> void:
	main = m
	hero_id = hid
	hand_index = idx
	card_id = cid
	custom_minimum_size = Vector2(W, H)
	size = Vector2(W, H)
	var c: Dictionary = Data.CARDS[cid]
	var col := UiStyle.cat_color(c.cat)
	var sb := UiStyle.box(UiStyle.PARCH_L, UiStyle.rarity_col(c.get("rarity", "C")), 3 if c.get("rarity", "C") in ["S", "K", "C"] else 4)
	sb.shadow_color = Color(UiStyle.INK, 1.0)
	sb.shadow_offset = Vector2(4, 5)
	sb.shadow_size = 1
	add_theme_stylebox_override("panel", sb)
	mouse_filter = Control.MOUSE_FILTER_STOP
	tooltip_text = UiStyle.keyword_tip(c)
	# inner colour rule
	var rule := Panel.new()
	var rsb := StyleBoxFlat.new()
	rsb.draw_center = false
	rsb.border_color = col
	rsb.set_border_width_all(2)
	rule.add_theme_stylebox_override("panel", rsb)
	rule.position = Vector2(4, 4)
	rule.size = Vector2(W - 8, H - 8)
	rule.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(rule)
	var v := VBoxContainer.new()
	v.position = Vector2(9, 8)
	v.size = Vector2(W - 18, H - 16)
	v.add_theme_constant_override("separation", 3)
	v.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(v)
	var top := HBoxContainer.new()
	top.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var init := UiStyle.label(c.name.substr(0, 1), 24, UiStyle.font_bl, UiStyle.CREAM)
	var init_bg := PanelContainer.new()
	init_bg.add_theme_stylebox_override("panel", UiStyle.box(col, UiStyle.INK, 2))
	init_bg.custom_minimum_size = Vector2(30, 30)
	init.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	init_bg.add_child(init)
	init_bg.mouse_filter = Control.MOUSE_FILTER_IGNORE
	top.add_child(init_bg)
	var nm := UiStyle.label(c.name.substr(1), 18, UiStyle.font_sc)
	nm.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	nm.clip_text = true
	top.add_child(nm)
	var cost := UiStyle.label("X" if c.cost < 0 else str(c.cost), 18, UiStyle.font_sc)
	var cost_bg := PanelContainer.new()
	var csb := UiStyle.box(UiStyle.GOLD, UiStyle.INK, 2)
	csb.set_corner_radius_all(14)
	cost_bg.add_theme_stylebox_override("panel", csb)
	cost_bg.custom_minimum_size = Vector2(28, 28)
	cost.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	cost_bg.add_child(cost)
	cost_bg.mouse_filter = Control.MOUSE_FILTER_IGNORE
	top.add_child(cost_bg)
	v.add_child(top)
	var art := TextureRect.new()
	art.texture = _art(c.art, c.cat)
	art.custom_minimum_size = Vector2(W - 18, 92)
	art.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	art.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	art.mouse_filter = Control.MOUSE_FILTER_IGNORE
	v.add_child(art)
	var attr: String = c.get("attr", "")
	var cat_name: String = "Physical" if c.cat == "physical" else ("Attuned" if c.cat == "attuned" else c.cat.capitalize())
	var line := cat_name + ((" · " + ("steadfast" if attr == "stable" else "volatile")) if attr != "" else "")
	if c.has("sub"):
		line = c.sub.capitalize().replace("_", " ") + " · " + line
	if c.has("use"):
		line += "  ·  " + UiStyle._r(c.use) + (" ▸ " + UiStyle._r(c.hit) if c.has("hit") else "")
	var tl := UiStyle.label(line, 13, UiStyle.font_it, UiStyle.BROWN)
	tl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	v.add_child(tl)
	var rules := UiStyle.rich(15)
	rules.text = "[center]" + UiStyle.rules_bbcode(c.text) + "[/center]"
	rules.size_flags_vertical = Control.SIZE_EXPAND_FILL
	rules.mouse_filter = Control.MOUSE_FILTER_IGNORE
	v.add_child(rules)

static func _art(key: String, cat := "physical") -> Texture2D:
	if not _art_cache.has(key):
		var p := "res://assets/art/cards/%s.jpg" % key
		if not ResourceLoader.exists(p):
			var fb: String = {"physical": "blade", "attuned": "void"}.get(cat, cat)
			p = "res://assets/art/card_%s.png" % fb
		_art_cache[key] = load(p) if ResourceLoader.exists(p) else null
	return _art_cache[key]

func set_state(q: int, can_play: bool) -> void:
	queued_at = q
	playable = can_play
	modulate = Color(1, 1, 1, 0.45) if q >= 0 else (Color(1, 1, 1, 1) if can_play else Color(0.8, 0.78, 0.74, 1))
	queue_redraw()

func _draw() -> void:
	if queued_at >= 0:
		var f := UiStyle.font_sc
		var r := Rect2(W - 104, 104, 112, 30)
		draw_rect(r, UiStyle.PARCH_L)
		draw_rect(r, UiStyle.RED, false, 3)
		draw_string(f, Vector2(r.position.x + 10, r.position.y + 22), (badge if badge != "" else "queued · %d" % (queued_at + 1)), HORIZONTAL_ALIGNMENT_LEFT, -1, 18, UiStyle.RED)

func _gui_input(ev: InputEvent) -> void:
	if ev is InputEventMouseButton and ev.pressed:
		if ev.button_index == MOUSE_BUTTON_LEFT:
			if reward_cb.is_valid():
				reward_cb.call()
				return
			main.on_card_clicked(hero_id, hand_index)
		elif ev.button_index == MOUSE_BUTTON_RIGHT and queued_at >= 0:
			main.remove_slot(queued_at)

func _notification(what: int) -> void:
	if what == NOTIFICATION_MOUSE_ENTER:
		_hover = true
		var tw := create_tween()
		tw.tween_property(self, "position:y", base_y - 18, 0.08)
		z_index = 5
	elif what == NOTIFICATION_MOUSE_EXIT:
		_hover = false
		var tw := create_tween()
		tw.tween_property(self, "position:y", base_y, 0.08)
		z_index = 0

