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
# fan mode (combat hand): rest pose in the fan, lifted pose on hover
var fanned := false
var rest_pos := Vector2.ZERO
var rest_rot := 0.0
var rest_scale := 1.0
var lift_pos := Vector2.ZERO
var _tw: Tween
var badge := ""
var cost_label: Label = null
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
	# Card layout (Cole, 2026-11-25): name, art, description with underlined keywords that explain themselves on
	# hover, then flavour text.
	var top := HBoxContainer.new()
	top.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var cost := UiStyle.label("X" if c.cost < 0 else str(c.cost), 18, UiStyle.font_sc)
	cost_label = cost
	var cost_bg := PanelContainer.new()
	var csb := UiStyle.box(UiStyle.GOLD, UiStyle.INK, 2)
	csb.set_corner_radius_all(14)
	cost_bg.add_theme_stylebox_override("panel", csb)
	cost_bg.custom_minimum_size = Vector2(28, 28)
	cost.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	cost_bg.add_child(cost)
	cost_bg.mouse_filter = Control.MOUSE_FILTER_IGNORE
	top.add_child(cost_bg)
	var nm := UiStyle.label(c.name, _fit_size(UiStyle.font_sc, c.name, W - 18 - 28 - 22 - 14, 17, 11), UiStyle.font_sc)
	nm.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	nm.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	nm.clip_text = true
	top.add_child(nm)
	var pad := Control.new()
	pad.custom_minimum_size = Vector2(22, 0)
	pad.mouse_filter = Control.MOUSE_FILTER_IGNORE
	top.add_child(pad)
	v.add_child(top)
	var art := TextureRect.new()
	# Attuned cards show the element their hero is attuned to now: art "<art>_<element>.jpg" when it exists,
	# else the plain art (drawn in the Elementalist's starting element).
	var elem := _attuned_elem(m, hid) if c.cat == "attuned" else ""
	var art_key: String = c.art
	if elem != "" and ResourceLoader.exists("res://assets/art/cards/%s_%s.jpg" % [c.art, elem]):
		art_key = "%s_%s" % [c.art, elem]
	art.texture = _art(art_key, c.cat)
	art.custom_minimum_size = Vector2(W - 18, 86)
	art.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	art.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	art.mouse_filter = Control.MOUSE_FILTER_IGNORE
	v.add_child(art)
	var attr: String = c.get("attr", "")
	var cat_name: String = "Physical" if c.cat == "physical" else (("Attuned" + (" (" + elem.capitalize() + ")" if elem != "" else "")) if c.cat == "attuned" else c.cat.capitalize())
	var line := cat_name + ((" · " + ("steadfast" if attr == "stable" else "volatile")) if attr != "" else "")
	if c.has("sub"):
		line = c.sub.capitalize().replace("_", " ") + " · " + line
	if c.has("use"):
		line += "  ·  " + UiStyle._r(c.use) + (" ▸ " + UiStyle._r(c.hit) if c.has("hit") else "")
	var tl := UiStyle.label(line, 12, UiStyle.font_it, UiStyle.BROWN)
	tl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	tl.clip_text = true
	v.add_child(tl)
	# Fit the rules (and the flavour, which goes first) into the space under the art: shrink the rules text down to
	# 10 rather than let it run off the card.
	var fl: String = c.get("flavour", "")
	var rules_fs := 15
	var room := float(H - 16) - 28.0 - 86.0 - 16.0 - 9.0
	var flav_h := 0.0
	if fl != "" and UiStyle.font_it != null:
		flav_h = UiStyle.font_it.get_multiline_string_size(fl, HORIZONTAL_ALIGNMENT_CENTER, W - 22, 12).y + 3.0
	var plain: String = c.text
	if UiStyle.font_rm != null:
		while rules_fs > 10:
			var need := UiStyle.font_rm.get_multiline_string_size(plain, HORIZONTAL_ALIGNMENT_CENTER, W - 22, rules_fs).y * 1.15
			if need <= room - flav_h:
				break
			if flav_h > 0.0 and rules_fs <= 13:
				flav_h = 0.0
				fl = ""
				continue
			rules_fs -= 1
	var rules := UiStyle.rich(rules_fs)
	rules.text = "[center]" + UiStyle.rules_links(c.text) + "[/center]"
	rules.size_flags_vertical = Control.SIZE_EXPAND_FILL
	rules.mouse_filter = Control.MOUSE_FILTER_PASS
	rules.meta_underlined = true
	rules.meta_hover_started.connect(_kw_on)
	rules.meta_hover_ended.connect(_kw_off)
	v.add_child(rules)
	if fl != "":
		var fr := UiStyle.label(fl, 12, UiStyle.font_it, UiStyle.BROWN)
		fr.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		fr.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		fr.custom_minimum_size = Vector2(W - 22, 0)
		v.add_child(fr)

## The largest font size from hi down to lo at which text fits in width on one line.
static func _fit_size(font: Font, text: String, width: float, hi: int, lo: int) -> int:
	if font == null:
		return hi
	for fs in range(hi, lo - 1, -1):
		if font.get_string_size(text, HORIZONTAL_ALIGNMENT_LEFT, -1, fs).x <= width:
			return fs
	return lo

var _kw_tip: PanelContainer = null

## Hovering an underlined keyword shows its definition beside the card.
func _kw_on(meta: Variant) -> void:
	_kw_off(meta)
	var k := String(meta)
	var d: String = Data.KEYWORDS.get(k, "")
	if d == "":
		return
	_kw_tip = PanelContainer.new()
	_kw_tip.add_theme_stylebox_override("panel", UiStyle.box(UiStyle.PARCH_L, UiStyle.INK, 2))
	_kw_tip.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var r := UiStyle.rich(14)
	r.text = "[b]%s[/b]: %s" % [k, d]
	r.fit_content = true
	r.custom_minimum_size = Vector2(240, 0)
	r.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_kw_tip.add_child(r)
	_kw_tip.top_level = true
	_kw_tip.z_index = 100
	add_child(_kw_tip)
	var gp := get_global_rect()
	_kw_tip.global_position = Vector2(clamp(gp.end.x + 6, 4, 1600 - 254), clamp(gp.position.y + 40, 4, 900))
	if gp.end.x + 260 > 1600:
		_kw_tip.global_position.x = gp.position.x - 256

func _kw_off(_meta: Variant) -> void:
	if _kw_tip != null and is_instance_valid(_kw_tip):
		_kw_tip.queue_free()
	_kw_tip = null

## The element a hero is attuned to in the current fight ("" outside a fight or for no hero).
static func _attuned_elem(m: Node, hid: int) -> String:
	if m == null or hid < 0 or not ("s" in m):
		return ""
	var st: Dictionary = m.s
	if st.is_empty():
		return ""
	var u := Combat.find(st, hid)
	if u.is_empty():
		return ""
	return Data.ELEMENTS[int(u.get("attuned", 0)) % Data.ELEMENTS.size()]

static func _art(key: String, cat := "physical") -> Texture2D:
	if not _art_cache.has(key):
		var p := "res://assets/art/cards/%s.jpg" % key
		if not ResourceLoader.exists(p):
			var fb: String = {"physical": "blade", "attuned": "void"}.get(cat, cat)
			p = "res://assets/art/card_%s.png" % fb
		_art_cache[key] = load(p) if ResourceLoader.exists(p) else null
	return _art_cache[key]

## Places the card in a hand fan: rest pose (position, rotation, scale) and where it rises to when hovered.
func fan(pos: Vector2, rot: float, sc: float, lift: Vector2) -> void:
	fanned = true
	rest_pos = pos
	rest_rot = rot
	rest_scale = sc
	lift_pos = lift
	position = pos
	rotation = rot
	scale = Vector2(sc, sc)

func _go(pos: Vector2, rot: float, sc: float) -> void:
	if _tw != null and _tw.is_valid():
		_tw.kill()
	_tw = create_tween().set_parallel(true)
	_tw.tween_property(self, "position", pos, 0.09)
	_tw.tween_property(self, "rotation", rot, 0.09)
	_tw.tween_property(self, "scale", Vector2(sc, sc), 0.09)

func unlift() -> void:
	_hover = false
	z_index = 0
	_go(rest_pos, rest_rot, rest_scale)

## Shows a cost other than the printed one (Thrift); green when cheaper.
func set_cost(n: int) -> void:
	var c: Dictionary = Data.CARDS.get(card_id, {})
	if cost_label == null or c.is_empty() or c.cost < 0 or n == int(c.cost):
		return
	cost_label.text = str(n)
	cost_label.add_theme_color_override("font_color", Color("3d6b35"))

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
	if fanned:
		if what == NOTIFICATION_MOUSE_ENTER:
			_hover = true
			z_index = 40
			if main.has_method("card_hovered"):
				main.card_hovered(self, true)
			_go(lift_pos, 0.0, 1.0)
		elif what == NOTIFICATION_MOUSE_EXIT:
			if main.has_method("card_hovered"):
				main.card_hovered(self, false)
			unlift()
		return
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

