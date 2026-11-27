class_name UiUnit
extends Control
const BAR_TRACK := preload("res://assets/art/ui/tex/bar_track.png")
const BAR_RED := preload("res://assets/art/ui/tex/bar_red.png")
const BAR_GREEN := preload("res://assets/art/ui/tex/bar_green.png")
const BAR_VIOLET := preload("res://assets/art/ui/tex/bar_violet.png")
const BAR_BLUE := preload("res://assets/art/ui/tex/bar_blue.png")
static var TAB_BOX: StyleBoxTexture
var plate: Control
## One hero or enemy on the field: sprite, intent banner (enemies), name, HP bar with preview, statuses.

var FEET := 0.966
var main: Node
var unit_id := -1
var side := ""
var sprite: Control
var rig: Dictionary = {}
var parts := {}          # group -> Array[TextureRect]
var rig_scale := 1.0
var facing := 1.0        # +1 faces right (heroes), -1 faces left (foes)
var t_idle := 0.0
var act := {}            # current action animation: {kind, t, dur}
var hit_t := -1.0
var seed_phase := 0.0
var sprite_size := Vector2(240, 288)
var bone: BoneRig = null   # Living Ink bone rig, when the unit has one
## Display px per stored Living Ink rig px: the rooms' camera draws figures at 0.2971 of rig px, stored at 0.6.
const LI_DISPLAY := 0.2971 / 0.6 * 1.18
const MAX_RISE := 400.0   # display px a figure may stand above its feet
var info: VBoxContainer
var name_l: Label
var status_r: RichTextLabel
var intent_panel: PanelContainer
var intent_r: RichTextLabel
var hp := 0
var max_hp := 1
var pred_hp := -1
var block := 0
var stress := 0
var dd := false
var grit := 0
var target_mode := 0   # 0 none, 1 valid, 2 invalid
var selected := false
var hovered := false

func setup(m: Node, u: Dictionary, sz: Vector2, feet := 0.966) -> void:
	main = m
	FEET = feet
	unit_id = u.id
	side = u.side
	facing = 1.0 if side == "hero" else -1.0
	seed_phase = float(unit_id) * 1.37
	var li_key := _li_key(u)
	if li_key != "":
		_setup_bone(u, li_key)
		return
	var rig_path := "res://data/rigs/%s.json" % u.key
	var tex: Texture2D = null
	if FileAccess.file_exists(rig_path):
		rig = Data._load_json(rig_path)
		tex = load("res://assets/art/rigs/%s/full.png" % u.key)
	else:
		tex = load(u.art)
	var aspect := float(tex.get_width()) / tex.get_height()
	sprite_size = Vector2(sz.y * aspect, sz.y)
	size = Vector2(max(sprite_size.x, 220), sprite_size.y + 110)
	mouse_filter = Control.MOUSE_FILTER_STOP
	sprite = Control.new()
	sprite.size = sprite_size
	sprite.position = Vector2((size.x - sprite_size.x) / 2, 0)
	sprite.pivot_offset = sprite_size * Vector2(0.5, 1)
	sprite.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(sprite)
	if rig.is_empty():
		var tr := TextureRect.new()
		tr.texture = tex
		tr.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		tr.size = sprite_size
		tr.mouse_filter = Control.MOUSE_FILTER_IGNORE
		sprite.add_child(tr)
	else:
		rig_scale = sprite_size.y / float(rig.h)
		for l in rig.layers:
			if l.get("empty", false):
				continue
			var tr := TextureRect.new()
			tr.texture = load("res://assets/art/rigs/%s/%s.png" % [u.key, l.name])
			tr.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
			tr.size = sprite_size
			tr.mouse_filter = Control.MOUSE_FILTER_IGNORE
			var pv: Array = l.get("pivot", [rig.w / 2, rig.h])
			if pv == null or pv.is_empty():
				pv = [rig.w / 2, rig.h]
			tr.pivot_offset = Vector2(pv[0], pv[1]) * rig_scale
			var g: String = l.name.split(".")[0]
			if not parts.has(g):
				parts[g] = []
			parts[g].append(tr)
			sprite.add_child(tr)
	_setup_info(u)

## Which Living Ink rig draws this unit: a hero on a path uses that path's rig when one exists.
func _li_key(u: Dictionary) -> String:
	if u.side == "hero" and String(u.get("sub", "")) != "" and BoneRig.has_rig("%s__%s" % [u.key, u.sub]):
		return "%s__%s" % [u.key, u.sub]
	return u.key if BoneRig.has_rig(u.key) else ""

func _setup_bone(u: Dictionary, key: String) -> void:
	var j: Dictionary = Data._load_json(BoneRig.path_for(key))
	var k := LI_DISPLAY * (0.92 if main.s.get("heroes", []).size() >= 4 else 1.0)
	var ink: Array = j.get("ink", [0, 0, j.canvas[0], j.canvas[1]])
	var gy := float(j.ground)
	var x0 := float(ink[0]) - 6.0
	var y0 := float(ink[1]) - 6.0
	var x1 := float(ink[2]) + 6.0
	var y1: float = max(float(ink[3]), gy) + 6.0
	# the tallest rulers would break the frame: cap the figure's height above its feet
	if (gy - y0) * k > MAX_RISE:
		k = MAX_RISE / (gy - y0)
	sprite_size = Vector2(x1 - x0, y1 - y0) * k
	FEET = (gy - y0) / (y1 - y0)
	size = Vector2(max(sprite_size.x, 220), sprite_size.y + 110)
	mouse_filter = Control.MOUSE_FILTER_STOP
	sprite = Control.new()
	sprite.size = sprite_size
	sprite.position = Vector2((size.x - sprite_size.x) / 2, 0)
	sprite.pivot_offset = sprite_size * Vector2(0.5, FEET)
	sprite.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(sprite)
	bone = BoneRig.new()
	bone.setup(key, Vector2(j.canvas[0], j.canvas[1]) * k)
	bone.base_offset = Vector2(-x0, -y0) * k
	sprite.add_child(bone)
	if j.has("variants"):
		bone.set_variant(Data.ELEMENTS[int(u.get("attuned", 0))])
	_setup_info(u)

func _setup_info(u: Dictionary) -> void:
	set_process(true)
	# the plate and its text sit above the room's foreground layer, which otherwise cuts across them
	plate = Control.new()
	plate.size = size
	plate.mouse_filter = Control.MOUSE_FILTER_IGNORE
	plate.z_index = 10
	plate.draw.connect(_draw_plate)
	add_child(plate)
	info = VBoxContainer.new()
	info.position = Vector2(0, sprite_size.y * FEET + 8)
	info.size = Vector2(size.x, 100)
	info.add_theme_constant_override("separation", 1)
	info.scale = Vector2(0.84, 0.84)   # the board is drawn at 1.2: keep the plates compact over the floor
	info.pivot_offset = Vector2(info.size.x / 2, 0)
	info.mouse_filter = Control.MOUSE_FILTER_IGNORE
	info.z_index = 11
	add_child(info)
	name_l = UiStyle.label(u.name, 17, UiStyle.font_sc)
	name_l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	info.add_child(name_l)
	var bar_space := Control.new()
	bar_space.custom_minimum_size = Vector2(size.x, 54)   # clears the HP bar, its numbers and the stress strip drawn in _draw
	bar_space.mouse_filter = Control.MOUSE_FILTER_IGNORE
	info.add_child(bar_space)
	status_r = UiStyle.rich(14)
	status_r.custom_minimum_size = Vector2(size.x, 20)
	status_r.mouse_filter = Control.MOUSE_FILTER_IGNORE
	info.add_child(status_r)
	if side == "enemy":
		intent_panel = PanelContainer.new()
		var sb := UiStyle.box(UiStyle.PARCH_L, UiStyle.INK, 2)
		sb.shadow_color = UiStyle.INK
		sb.shadow_offset = Vector2(3, 3)
		sb.shadow_size = 1
		intent_panel.add_theme_stylebox_override("panel", sb)
		intent_r = UiStyle.rich(14)
		intent_r.custom_minimum_size = Vector2(196, 0)
		intent_r.autowrap_mode = TextServer.AUTOWRAP_OFF
		intent_r.mouse_filter = Control.MOUSE_FILTER_IGNORE
		intent_panel.add_child(intent_r)
		intent_panel.mouse_filter = Control.MOUSE_FILTER_IGNORE
		intent_panel.position = Vector2((size.x - 208) / 2, -42)
		add_child(intent_panel)

func feet_y() -> float:
	return sprite_size.y * FEET

func refresh(u: Dictionary, pred: Dictionary, s: Dictionary) -> void:
	if bone != null and u.side == "hero":
		bone.set_variant(Data.ELEMENTS[int(u.get("attuned", 0))])
	hp = u.hp
	max_hp = u.max_hp
	block = u.block
	dd = u.get("deaths_door", false)
	grit = u.get("grit", 0)
	stress = u.get("stress", 0)
	pred_hp = -1
	if not pred.is_empty():
		pred_hp = pred.hp if not pred.dead else 0
	elif main.preview_has_died(unit_id):
		pred_hp = 0
	status_r.text = "[center]" + _status_text(u) + "[/center]"
	if side == "enemy" and intent_r != null:
		var it := Combat.intent_of(u)
		var order: int = s.enemy_queue.find(u.id) + 1
		if it.is_empty() or order == 0:
			intent_panel.visible = false
		else:
			intent_panel.visible = true
			var tgt := Combat.find(s, u.intent_target)
			var tname: String = tgt.name if not tgt.is_empty() and it.target in ["front", "back"] else ""
			var kind_col := {"attack": UiStyle.RED_D, "heal": UiStyle.GREEN, "debuff": UiStyle.VIOLET, "defend": UiStyle.BLUE}
			var tail := ""
			if tname != "":
				tail = "→ " + tname
			elif it.target == "all_heroes":
				tail = "· all heroes"
			elif it.target == "self":
				tail = "· self"
			elif not tgt.is_empty():
				tail = "→ " + tgt.name.split(" ")[-1]
			intent_r.text = "[font_size=14]%s[color=#%s][b]%s[/b][/color]  [b]%s[/b] [i]%s[/i][/font_size]" % [UiStyle.icon_tag("i_" + str(it.kind), 20), kind_col.get(it.kind, UiStyle.INK).to_html(false), ["i", "ii", "iii", "iv"][min(order - 1, 3)], it.name, tail]
			tooltip_text = "%s intends %s: %s" % [u.name, it.name, it.text]
	if intent_panel != null:
		intent_panel.position.y = max(-42.0, 100.0 - position.y)
	queue_redraw()

func _status_text(u: Dictionary) -> String:
	var parts := []
	if u.block > 0:
		parts.append(UiStyle.icon_tag("s_block", 18) + "[color=#3f6fa0]Block %d[/color]" % u.block)
	if u.armor > 0:
		parts.append(UiStyle.icon_tag("s_armor", 18) + "Armor %d" % u.armor)
	if u.ward > 0:
		parts.append(UiStyle.icon_tag("s_ward", 18) + "[color=#6d5a8a]Ward %d[/color]" % u.ward)
	for e in Data.ELEMENTS:
		if u.elements[e] > 0:
			parts.append(UiStyle.icon_tag("e_" + e, 18) + "[color=#%s]%s %d[/color]" % [Data.ELEMENT_COLOR[e].to_html(false), Data.ELEMENT_STATUS[e], u.elements[e]])
	var st: Dictionary = u.st
	for k in ["bleed", "stun", "mark", "vulnerable", "might", "focus", "momentum", "riposte", "thorns", "dodge", "regen", "hex", "doom", "taunt", "fortify", "anchor", "freeze", "neuro", "silence", "blight", "lockdown"]:
		if st.get(k, 0) > 0:
			var nm: String = {"neuro": "Neurotoxin", "freeze": "Frozen", "silence": "Drowned", "anchor": "Anchored"}.get(k, k.capitalize())
			var col: String = {"hex": "#6d5a8a", "doom": "#4a3a5a", "bleed": "#9c3d2b", "regen": "#62804f", "thorns": "#6f5036"}.get(k, "")
			var txt := nm + ("" if k in ["stun", "taunt", "freeze", "neuro", "silence", "lockdown", "anchor", "fortify"] else " %d" % st[k])
			parts.append(UiStyle.icon_tag("s_" + k, 18) + (("[color=%s]%s[/color]" % [col, txt]) if col != "" else txt))
	if u.get("omen", 0) > 0:
		parts.append("Omen %d" % u.omen)
	if u.get("postponed", false):
		parts.append("[color=#6d5a8a]Postponed[/color]")
	if u.guarded_by != -1:
		parts.append("Guarded")
	if u.get("hollow", false):
		parts.append("[color=#6d5a8a]Hollow[/color]")
	var rs: Dictionary = u.get("resist", {})
	if not rs.is_empty():
		var groups := {"immune": [], "resist": [], "weak": []}
		for k in rs:
			groups[rs[k]].append("phys" if k == "physical" else (UiStyle.icon_tag("e_" + k, 16) if UiStyle.icon("e_" + k) != null else k))
		var bits := []
		for g in ["immune", "resist", "weak"]:
			if not groups[g].is_empty():
				bits.append("[color=%s]%s %s[/color]" % ["#62804f" if g == "weak" else "#9c3d2b", {"immune": "imm", "resist": "res", "weak": "weak"}[g], "".join(groups[g])])
		parts.append(" ".join(bits))
	if u.side == "hero" and u.key in ["elementalist"]:
		var e: String = Data.ELEMENTS[u.attuned]
		parts.append("[color=#%s]attuned: %s[/color]" % [Data.ELEMENT_COLOR[e].to_html(false), e])
	return " · ".join(parts)

func _draw() -> void:
	var fy := feet_y()
	var cx := size.x / 2
	# feet ring: selection / targeting
	if target_mode == 1 or selected or hovered:
		var col := UiStyle.RED if target_mode == 1 else (UiStyle.GOLD_D if selected else UiStyle.BROWN)
		var pts := PackedVector2Array()
		for i in 49:
			var a := TAU * i / 48.0
			pts.append(Vector2(cx + cos(a) * sprite_size.x * 0.38, fy + sin(a) * 12))
		draw_polyline(pts, col, 3.0 if target_mode == 1 else 2.5)
	# the plate (HP, block, stress) draws on its own child above the room's foreground layer
	if plate != null:
		plate.queue_redraw()

func _draw_plate() -> void:
	var fy := feet_y()
	var cx := size.x / 2
	# hp bar on a parchment tablet so it reads over the floor
	var w := size.x * 0.78
	var tab := Rect2(cx - w / 2 - 18, fy + 2, w + 36, 106)
	if TAB_BOX == null:
		TAB_BOX = UiStyle.tex_box("btn_parch")
	plate.draw_style_box(TAB_BOX, tab)
	var r := Rect2(cx - w / 2, fy + 30, w, 14)
	plate.draw_texture_rect(BAR_TRACK, r, false)
	var frac: float = clamp(float(hp) / max(1, max_hp), 0.0, 1.0)
	var fill: Texture2D = BAR_RED if side == "hero" else BAR_GREEN
	if frac > 0.0:
		plate.draw_texture_rect_region(fill, Rect2(r.position, Vector2(r.size.x * frac, r.size.y)), Rect2(0, 0, fill.get_width() * frac, fill.get_height()))
	if pred_hp >= 0 and pred_hp < hp:
		var pf: float = clamp(float(pred_hp) / max(1, max_hp), 0.0, 1.0)
		var lost := Rect2(r.position + Vector2(r.size.x * pf, 0), Vector2(r.size.x * (frac - pf), r.size.y))
		plate.draw_rect(lost, Color(0.17, 0.11, 0.07, 0.55))
		for x in range(int(lost.position.x), int(lost.end.x), 5):
			plate.draw_line(Vector2(x, lost.position.y), Vector2(x + 6, lost.end.y), UiStyle.HI, 1.0)
	plate.draw_rect(r, UiStyle.INK, false, 2.0)
	var f := UiStyle.font_sc
	var txt := "%d / %d" % [hp, max_hp]
	if dd:
		txt = "DEATH'S DOOR · grit %d" % grit
	if pred_hp >= 0 and pred_hp != hp:
		txt += "  →  %s" % (str(pred_hp) if pred_hp > 0 else "✝")
	plate.draw_string(f, Vector2(r.position.x, r.position.y - 2 - 0), "", HORIZONTAL_ALIGNMENT_LEFT, -1, 14)
	plate.draw_string(f, Vector2(cx - 120, r.end.y + 15), txt, HORIZONTAL_ALIGNMENT_CENTER, 240, 15, UiStyle.RED_D if (pred_hp >= 0 and pred_hp < hp) or dd else UiStyle.INK)
	if block > 0:
		var b := Rect2(r.position.x - 30, r.position.y - 6, 26, 26)
		plate.draw_texture_rect(BAR_BLUE, b, false)
		plate.draw_rect(b, UiStyle.INK, false, 2.0)
		plate.draw_string(f, Vector2(b.position.x, b.position.y + 19), str(block), HORIZONTAL_ALIGNMENT_CENTER, 26, 15, UiStyle.INK)
	if side == "hero":
		var sr := Rect2(cx - w / 2, r.end.y + 20, w, 5)
		plate.draw_texture_rect(BAR_TRACK, sr, false)
		var sf: float = clamp(stress / 100.0, 0.0, 1.0)
		if sf > 0.0:
			plate.draw_texture_rect_region(BAR_VIOLET, Rect2(sr.position, Vector2(sr.size.x * sf, 5)), Rect2(0, 0, BAR_VIOLET.get_width() * sf, BAR_VIOLET.get_height()))
		plate.draw_rect(sr, UiStyle.INK, false, 1.0)

func _gui_input(ev: InputEvent) -> void:
	if ev is InputEventMouseButton and ev.pressed and ev.button_index == MOUSE_BUTTON_LEFT:
		main.on_unit_clicked(unit_id)
	elif ev is InputEventMouseButton and ev.pressed and ev.button_index == MOUSE_BUTTON_RIGHT:
		main.cancel_targeting()

func _notification(what: int) -> void:
	if what == NOTIFICATION_MOUSE_ENTER:
		hovered = true
		queue_redraw()
		main.on_unit_hover(unit_id, true)
	elif what == NOTIFICATION_MOUSE_EXIT:
		hovered = false
		queue_redraw()
		main.on_unit_hover(unit_id, false)

# ================================================================== animation
## Idle styles and action profiles are procedural: each layer group is rotated or offset about its pivot.
func _process(delta: float) -> void:
	t_idle += delta
	if not act.is_empty():
		act.t += delta
		if act.t >= act.dur:
			act = {}
	if hit_t >= 0.0:
		hit_t += delta
		if hit_t > 0.35:
			hit_t = -1.0
	_pose()

func _pose() -> void:
	if bone != null:
		_pose_bones()
		return
	if parts.is_empty():
		return
	var tt := t_idle + seed_phase
	var style: String = rig.get("anim", {}).get("idle", "sway")
	var pose := {}   # group -> [rot_deg, dx, dy, sx, sy]
	match style:
		"heavy":
			_w(pose, "body", 0.0, 0.0, 0.0, 1.0, 1.0 + 0.008 * sin(tt * 1.6))
			_w(pose, "head", 1.2 * sin(tt * 1.1), 0.0, 1.2 * sin(tt * 1.6))
			_w(pose, "arm", 1.5 * sin(tt * 1.3 + 1.0))
			_w(pose, "back", 2.0 * sin(tt * 0.8))
			_w(pose, "shield", 0.8 * sin(tt * 1.6 + 0.5))
		"stance":
			_w(pose, "body", 0.0, 0.0, 2.0 * sin(tt * 2.2))
			_w(pose, "head", 1.0 * sin(tt * 1.4), 0.0, 2.0 * sin(tt * 2.2))
			_w(pose, "arm", 2.2 * sin(tt * 1.9), 0.0, 2.0 * sin(tt * 2.2))
			_w(pose, "farm", 3.0 * sin(tt * 1.5 + 1.0), 0.0, 2.0 * sin(tt * 2.2))
			_w(pose, "back", 3.5 * sin(tt * 1.2))
		"float":
			for g in parts:
				_w(pose, g, 0.0, 0.0, -6.0 * sin(tt * 1.4))
			_w(pose, "back", 3.0 * sin(tt * 1.0))
			_w(pose, "arm", 3.0 * sin(tt * 1.2 + 1.0))
			_w(pose, "near", 2.5 * sin(tt * 1.1 + 2.0))
			_w(pose, "head", 1.5 * sin(tt * 0.9))
		"wobble":
			_w(pose, "body", 0.0, 0.0, 0.0, 1.0 + 0.015 * sin(tt * 2.0), 1.0 - 0.012 * sin(tt * 2.0))
			_w(pose, "head", 2.0 * sin(tt * 1.3), 0.0, 2.0 * sin(tt * 2.0))
			_w(pose, "arm", 3.0 * sin(tt * 1.5))
			_w(pose, "back", 3.0 * sin(tt * 1.5 + 1.0))
		"coil", "writhe", "tentacle":
			_w(pose, "arm", 4.0 * sin(tt * 1.6))
			_w(pose, "legs", 1.2 * sin(tt * 1.1))
			_w(pose, "body", 0.8 * sin(tt * 1.3))
			_w(pose, "head", 2.5 * sin(tt * 1.7 + 0.5))
			_w(pose, "back", 3.0 * sin(tt * 1.4 + 1.0))
		"crouch":
			_w(pose, "body", 0.0, 0.0, 2.0 * sin(tt * 1.8))
			_w(pose, "head", 2.5 * sin(tt * 1.2), 0.0, 2.0 * sin(tt * 1.8))
			_w(pose, "arm", 3.0 * sin(tt * 2.0))
			_w(pose, "back", 2.0 * sin(tt * 1.6))
		"scuttle":
			_w(pose, "legs", 2.0 * sin(tt * 4.0))
			_w(pose, "body", 0.0, 0.0, 1.5 * sin(tt * 4.0))
			_w(pose, "arm", 3.0 * sin(tt * 1.5), 0.0, 1.5 * sin(tt * 4.0))
		"bell":
			_w(pose, "arm", 2.5 * sin(tt * 1.1))
		_:
			_w(pose, "body", 0.6 * sin(tt * 1.1), 0.0, 0.0, 1.0, 1.0 + 0.006 * sin(tt * 1.6))
			_w(pose, "head", 1.5 * sin(tt * 1.3 + 0.5))
			_w(pose, "arm", 2.0 * sin(tt * 1.2 + 1.0))
			_w(pose, "near", 1.5 * sin(tt * 1.25 + 2.0))
			_w(pose, "farm", 2.0 * sin(tt * 1.3 + 2.5))
			_w(pose, "back", 2.5 * sin(tt * 0.9))
	_w(pose, "fx", fmod(tt * 25.0, 360.0))
	# action overlay
	if not act.is_empty():
		var p: float = clamp(act.t / act.dur, 0.0, 1.0)
		var f := facing
		var kind: String = act.kind
		var wind := 0.0
		var strike := 0.0
		if p < 0.42:
			wind = p / 0.42
		elif p < 0.58:
			wind = 1.0 - (p - 0.42) / 0.16
			strike = (p - 0.42) / 0.16
		else:
			strike = 1.0 - (p - 0.58) / 0.42
		var lunge: float = 34.0 * strike * f
		match kind:
			"swing", "cleave", "slam":
				_w(pose, "arm", f * (-38.0 * wind + 95.0 * strike) * (-1.0 if kind == "swing" and side == "hero" else 1.0))
				for g in parts:
					_w(pose, g, 0.0, lunge, (10.0 * strike) if kind == "slam" else 0.0)
				_w(pose, "head", f * 5.0 * strike)
			"thrust", "stab":
				_w(pose, "arm", f * -6.0 * wind, f * (-14.0 * wind + 58.0 * strike))
				_w(pose, "farm", f * 8.0 * strike)
				for g in parts:
					_w(pose, g, 0.0, lunge * 1.3)
			"cast", "raise", "ring", "wail":
				_w(pose, "arm", f * -48.0 * min(1.0, p * 2.5) * (1.0 - max(0.0, (p - 0.7) / 0.3)))
				_w(pose, "near", f * -12.0 * strike)
				_w(pose, "head", f * -4.0 * strike)
				for g in parts:
					_w(pose, g, 0.0, 0.0, -8.0 * strike)
				_w(pose, "fx", 120.0 * p)
			"throw", "reel":
				_w(pose, "arm", f * (-55.0 * wind + 120.0 * strike) * -1.0)
				for g in parts:
					_w(pose, g, 0.0, lunge * 0.6)
			"claw", "pinch", "grab", "bite", "lash":
				_w(pose, "arm", f * 30.0 * strike - f * 12.0 * wind, f * 30.0 * strike)
				_w(pose, "head", f * 8.0 * strike, f * 18.0 * strike)
				for g in parts:
					_w(pose, g, 0.0, lunge)
			"block":
				_w(pose, "shield", 0.0, f * 16.0 * strike)
				_w(pose, "arm", f * -10.0 * strike)
				for g in parts:
					_w(pose, g, 0.0, -f * 4.0 * strike)
			_:
				for g in parts:
					_w(pose, g, 0.0, lunge)
	if hit_t >= 0.0:
		var k: float = 1.0 - hit_t / 0.35
		for g in parts:
			_w(pose, g, -facing * 3.0 * k, -facing * 14.0 * k)
	for g in parts:
		var p: Array = pose.get(g, [0.0, 0.0, 0.0, 1.0, 1.0])
		for tr in parts[g]:
			tr.rotation_degrees = p[0]
			tr.position = Vector2(p[1], p[2])
			tr.scale = Vector2(p[3], p[4])

func _w(pose: Dictionary, g: String, rot := 0.0, dx := 0.0, dy := 0.0, sx := 1.0, sy := 1.0) -> void:
	var p: Array = pose.get(g, [0.0, 0.0, 0.0, 1.0, 1.0])
	pose[g] = [p[0] + rot, p[1] + dx, p[2] + dy, p[3] * sx, p[4] * sy]

## Plays an action; returns the seconds until the blow lands so callers can sync effects.
func play_action(kind: String, dur := 0.62) -> float:
	if kind == "":
		kind = rig.get("anim", {}).get("attack", "swing")
	act = {"kind": kind, "t": 0.0, "dur": dur}
	return dur * 0.5

func default_attack() -> String:
	return rig.get("anim", {}).get("attack", "swing")

func play_hit() -> void:
	hit_t = 0.0
	var tw := sprite.create_tween()
	tw.tween_property(sprite, "modulate", Color(1.6, 1.3, 1.3), 0.05)
	tw.tween_property(sprite, "modulate", Color(1, 1, 1), 0.25)

## Hand point in this view's local coordinates (projectile origin).
func hand_point() -> Vector2:
	if bone != null:
		for b in ["hand_f", "forearm_f", "hand_n", "head"]:
			if bone.bones().has(b):
				return sprite.position + bone.bone_point(b)
		return sprite.position + sprite_size * Vector2(0.5 + 0.25 * facing, 0.35)
	var hp: Array = rig.get("anim", {}).get("hand", [])
	if hp.is_empty():
		return sprite.position + sprite_size * Vector2(0.5 + 0.25 * facing, 0.35)
	return sprite.position + Vector2(hp[0], hp[1]) * rig_scale

func body_point() -> Vector2:
	return sprite.position + Vector2(sprite_size.x * 0.5, sprite_size.y * FEET * 0.55)


# ================================================================== Living Ink bone rigs
const ARM_F := ["upperarm_f", "forearm_f", "hand_f"]
const ARM_N := ["upperarm_n", "forearm_n", "hand_n"]
const REACH := ["arm", "claw", "jaw", "tail", "tentacle", "wing", "neck", "head", "pincer", "hand", "fist", "weapon", "sword", "axe",
	"spear", "hook", "mace", "staff", "blade", "scythe", "hammer", "censer", "lantern", "trunk", "tusk", "stinger", "tongue"]

## Idle breathing, the current action and the hit recoil, as bone angles. Humanoid bones get named motions; any other
## bone (tentacles, wings, tails) sways a little on its own phase, so every creature lives without hand-made tracks.
func _pose_bones() -> void:
	var B: Dictionary = bone.bones()
	var tt := t_idle + seed_phase
	var ang := {}
	var i := 0
	for b in B:
		i += 1
		var amp := 1.2 if B[b].parent != null else 0.0
		for r in REACH:
			if String(b).contains(r):
				amp = 2.2
				break
		ang[b] = amp * sin(tt * (0.9 + 0.13 * (i % 5)) + i * 0.7)
	ang["torso"] = ang.get("torso", 0.0) + 0.8 * sin(tt * 1.1)
	ang["head"] = ang.get("head", 0.0) + 1.4 * sin(tt * 1.3 + 0.5)
	var off := Vector2.ZERO
	var lean := 0.0
	var squash := 1.0 + 0.006 * sin(tt * 1.6)
	if not act.is_empty():
		var p: float = clamp(act.t / act.dur, 0.0, 1.0)
		var f := facing
		var wind := 0.0
		var strike := 0.0
		if p < 0.42:
			wind = p / 0.42
		elif p < 0.58:
			wind = 1.0 - (p - 0.42) / 0.16
			strike = (p - 0.42) / 0.16
		else:
			strike = 1.0 - (p - 0.58) / 0.42
		var kind: String = act.kind
		match kind:
			"cast", "raise", "ring", "wail":
				for b in ARM_F:
					if B.has(b):
						ang[b] = ang.get(b, 0.0) - f * 55.0 * min(1.0, p * 2.5) * (1.0 - max(0.0, (p - 0.7) / 0.3)) / (1 + ARM_F.find(b))
				ang["head"] = ang.get("head", 0.0) - f * 6.0 * strike
				off.y -= 8.0 * strike
			"block":
				for b in ARM_N + ARM_F:
					if B.has(b):
						ang[b] = ang.get(b, 0.0) - f * 18.0 * strike
				off.x -= f * 4.0 * strike
			_:
				var swing := f * (-40.0 * wind + 95.0 * strike)
				var any_arm := false
				for b in ARM_F:
					if B.has(b):
						any_arm = true
						ang[b] = ang.get(b, 0.0) + swing * [1.0, 0.45, 0.2][ARM_F.find(b)]
				if not any_arm:
					for b in B:
						for r in REACH:
							if String(b).contains(r):
								ang[b] = ang.get(b, 0.0) + swing * 0.35
								break
				ang["torso"] = ang.get("torso", 0.0) + f * (-6.0 * wind + 9.0 * strike)
				lean = f * (-3.0 * wind + 5.0 * strike)
				off.x += f * 30.0 * strike
	if hit_t >= 0.0:
		var k: float = 1.0 - hit_t / 0.35
		lean -= facing * 4.0 * k
		off.x -= facing * 12.0 * k
		ang["torso"] = ang.get("torso", 0.0) - facing * 6.0 * k
		ang["head"] = ang.get("head", 0.0) - facing * 8.0 * k
	bone.angles = ang
	bone.offset = bone.base_offset + off
	bone.lean = lean
	bone.squash = squash
	bone.queue_redraw()
