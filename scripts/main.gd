extends Control
## Ostium combat slice controller: UI 1 "Round Timeline + Active Hand" layout.

var party: Array = ["bulwark", "duelist", "elementalist"]
const FEET_Y := 466.0
const HERO_X := {1: [690.0], 2: [690.0, 450.0], 3: [690.0, 455.0, 222.0], 4: [705.0, 530.0, 355.0, 180.0]}
const ENEMY_X := {1: {1: 1110.0}, 2: {1: 1010.0, 2: 1300.0}, 3: {1: 972.0, 2: 1196.0, 3: 1414.0}}

var s: Dictionary = {}
var plan: Array = []
var preview: Dictionary = {}
var active_hero := -1
var targeting: Dictionary = {}
var valid_targets: Array = []
var resolving := false
var encounter_idx := 0
var gauntlet := false
var practice_world := "drowned"
var run_mode := false
var run_ui: RunUI
var hub: Hub
var run_seed := 0
var attempt := 0
var carry := {}

var field: Control
var room_far: TextureRect
var room_mid: TextureRect
var room_fore: TextureRect
var gauntlet_pos := 0
var motes: CPUParticles2D
var fx_layer: Control
var unit_views := {}
var timeline_plan: HBoxContainer
var timeline_enemy: HBoxContainer
var party_box: VBoxContainer
var kit_box: HBoxContainer
var hand_layer: Control
var energy_view: Control
var commit_btn: Button
var undo_btn: Button
var leave_btn: Button
var hint_l: Label
var title_l: Label
var round_l: Label
var log_panel: PanelContainer
var log_r: RichTextLabel
var overlay: Control
var deck_l: Label

func _ready() -> void:
	UiStyle.load_settings()
	theme = UiStyle.make_theme()
	set_anchors_preset(Control.PRESET_FULL_RECT)
	_build_static()
	hub = Hub.new()
	hub.main = self
	add_child(hub)
	_ensure_run_ui()
	run_ui.visible = false
	hub.show_title()

# ================================================================== static layout
func _build_static() -> void:
	var bg := TextureRect.new()
	bg.texture = load("res://assets/art/paper.png")
	bg.self_modulate = UiStyle.PAGE_TINT
	bg.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	bg.size = Vector2(1600, 1000)
	bg.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(bg)
	field = Control.new()
	field.size = Vector2(1600, 600)
	field.mouse_filter = Control.MOUSE_FILTER_IGNORE
	room_far = _room_layer()
	room_mid = _room_layer()
	add_child(field)
	motes = CPUParticles2D.new()
	motes.position = Vector2(800, 560)
	motes.amount = 70
	motes.lifetime = 9.0
	motes.preprocess = 9.0
	motes.emission_shape = CPUParticles2D.EMISSION_SHAPE_RECTANGLE
	motes.emission_rect_extents = Vector2(740, 20)
	motes.direction = Vector2(0.15, -1)
	motes.spread = 12.0
	motes.gravity = Vector2.ZERO
	motes.initial_velocity_min = 8.0
	motes.initial_velocity_max = 22.0
	motes.scale_amount_min = 1.0
	motes.scale_amount_max = 3.0
	motes.color = Color(0.85, 0.92, 0.88, 0.35)
	add_child(motes)
	room_fore = _room_layer()
	var frame := Panel.new()
	var fsb := StyleBoxFlat.new()
	fsb.draw_center = false
	fsb.border_color = UiStyle.GOLD_D
	fsb.set_border_width_all(5)
	frame.add_theme_stylebox_override("panel", fsb)
	frame.position = Vector2(57, 93)
	frame.size = Vector2(1486, 476)
	frame.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(frame)
	var frame2 := Panel.new()
	var fsb2 := StyleBoxFlat.new()
	fsb2.draw_center = false
	fsb2.border_color = UiStyle.INK
	fsb2.set_border_width_all(2)
	frame2.add_theme_stylebox_override("panel", fsb2)
	frame2.position = Vector2(54, 90)
	frame2.size = Vector2(1492, 482)
	frame2.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(frame2)
	# top bar
	title_l = UiStyle.label("Of the Drowned Kingdom", 30, UiStyle.font_sc)
	title_l.position = Vector2(104, 18)
	add_child(title_l)
	round_l = UiStyle.label("", 17, UiStyle.font_it, UiStyle.BROWN)
	round_l.position = Vector2(106, 56)
	add_child(round_l)
	var log_btn := _button("Chronicle (L)", Vector2(1300, 26), Vector2(140, 40))
	log_btn.pressed.connect(_toggle_log)
	leave_btn = _button("Leave", Vector2(1450, 26), Vector2(90, 40))
	leave_btn.tooltip_text = "Return to the abbey. On a descent the fight is kept exactly as it stands: continue it from the church."
	leave_btn.pressed.connect(_leave)
	# timeline
	var tl := Panel.new()
	var tsb := UiStyle.box(UiStyle.PARCH_L, UiStyle.INK, 3)
	tsb.shadow_color = UiStyle.INK
	tsb.shadow_offset = Vector2(4, 5)
	tsb.shadow_size = 1
	tl.add_theme_stylebox_override("panel", tsb)
	tl.position = Vector2(60, 598)
	tl.size = Vector2(1480, 82)
	tl.mouse_filter = Control.MOUSE_FILTER_PASS
	add_child(tl)
	var ordo := UiStyle.label("Ordo", 28, UiStyle.font_bl, UiStyle.RED_D)
	ordo.position = Vector2(16, 6)
	tl.add_child(ordo)
	var ordo2 := UiStyle.label("your plan", 14, UiStyle.font_it, UiStyle.BLUE)
	ordo2.position = Vector2(16, 48)
	tl.add_child(ordo2)
	var scroll := ScrollContainer.new()
	scroll.position = Vector2(104, 10)
	scroll.size = Vector2(756, 62)
	scroll.vertical_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	tl.add_child(scroll)
	timeline_plan = HBoxContainer.new()
	timeline_plan.add_theme_constant_override("separation", 8)
	scroll.add_child(timeline_plan)
	var div := UiStyle.label("then\nthe foe", 14, UiStyle.font_it, UiStyle.BROWN)
	div.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	div.position = Vector2(866, 16)
	div.size = Vector2(60, 50)
	tl.add_child(div)
	timeline_enemy = HBoxContainer.new()
	timeline_enemy.position = Vector2(930, 10)
	timeline_enemy.add_theme_constant_override("separation", 8)
	tl.add_child(timeline_enemy)
	# party column
	var pl := UiStyle.label("the company · keys 1-4", 15, UiStyle.font_sc, UiStyle.BROWN)
	pl.position = Vector2(60, 694)
	add_child(pl)
	party_box = VBoxContainer.new()
	party_box.position = Vector2(60, 718)
	party_box.size = Vector2(240, 260)
	party_box.add_theme_constant_override("separation", 8)
	add_child(party_box)
	# kit row + hint
	kit_box = HBoxContainer.new()
	kit_box.position = Vector2(330, 694)
	kit_box.add_theme_constant_override("separation", 8)
	add_child(kit_box)
	hint_l = UiStyle.label("", 15, UiStyle.font_it, UiStyle.RED_D)
	hint_l.position = Vector2(760, 700)
	hint_l.size = Vector2(600, 24)
	hint_l.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	add_child(hint_l)
	hand_layer = Control.new()
	hand_layer.position = Vector2(0, 0)
	hand_layer.size = Vector2(1600, 1000)
	hand_layer.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(hand_layer)
	# energy + commit
	energy_view = Control.new()
	energy_view.position = Vector2(1386, 700)
	energy_view.size = Vector2(130, 130)
	energy_view.mouse_filter = Control.MOUSE_FILTER_IGNORE
	energy_view.draw.connect(_draw_energy)
	add_child(energy_view)
	deck_l = UiStyle.label("", 14, UiStyle.font_it, UiStyle.BROWN)
	deck_l.position = Vector2(1150, 880)
	deck_l.size = Vector2(200, 80)
	add_child(deck_l)
	commit_btn = _button("Let it be done", Vector2(1362, 858), Vector2(178, 60))
	commit_btn.add_theme_font_size_override("font_size", 22)
	var csb := UiStyle.box(UiStyle.RED, UiStyle.INK, 3)
	csb.shadow_color = UiStyle.INK
	csb.shadow_offset = Vector2(4, 5)
	csb.shadow_size = 1
	commit_btn.add_theme_stylebox_override("normal", csb)
	var csh := csb.duplicate()
	csh.bg_color = Color("d4664c")
	commit_btn.add_theme_stylebox_override("hover", csh)
	commit_btn.add_theme_color_override("font_color", UiStyle.CREAM)
	commit_btn.add_theme_color_override("font_hover_color", UiStyle.CREAM)
	commit_btn.pressed.connect(_commit)
	undo_btn = _button("strike the last", Vector2(1362, 926), Vector2(178, 36))
	undo_btn.add_theme_font_override("font", UiStyle.font_it)
	undo_btn.pressed.connect(func(): if plan.size() > 0: remove_slot(plan.size() - 1))
	fx_layer = Control.new()
	fx_layer.size = Vector2(1600, 1000)
	fx_layer.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(fx_layer)
	# log panel
	log_panel = PanelContainer.new()
	log_panel.add_theme_stylebox_override("panel", UiStyle.box(UiStyle.PARCH_L, UiStyle.INK, 3))
	log_panel.position = Vector2(1060, 80)
	log_panel.size = Vector2(480, 500)
	log_panel.visible = false
	add_child(log_panel)
	log_r = UiStyle.rich(15)
	log_r.fit_content = false
	log_r.scroll_active = true
	log_r.scroll_following = true
	log_r.custom_minimum_size = Vector2(460, 480)
	log_panel.add_child(log_r)

func _room_layer() -> TextureRect:
	var r := TextureRect.new()
	r.position = Vector2(60, 96)
	r.size = Vector2(1480, 470)
	r.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	r.stretch_mode = TextureRect.STRETCH_SCALE
	r.mouse_filter = Control.MOUSE_FILTER_IGNORE
	r.pivot_offset = r.size / 2
	add_child(r)
	return r

func _set_room(room: String) -> void:
	room_far.texture = load("res://assets/art/rooms/%s_far.png" % room)
	room_mid.texture = load("res://assets/art/rooms/%s_mid.png" % room)
	room_fore.texture = load("res://assets/art/rooms/%s_fore.png" % room)
	# slow ambient sway: midground and foreground drift at different rates for depth
	for pair in [[room_mid, 3.0, 7.0], [room_fore, 6.0, 5.0]]:
		var r: TextureRect = pair[0]
		r.position = Vector2(60, 96)
		var tw := r.create_tween().set_loops()
		tw.tween_property(r, "position:x", 60.0 + pair[1], pair[2]).set_trans(Tween.TRANS_SINE)
		tw.tween_property(r, "position:x", 60.0 - pair[1], pair[2] * 2).set_trans(Tween.TRANS_SINE)
		tw.tween_property(r, "position:x", 60.0, pair[2]).set_trans(Tween.TRANS_SINE)

func _button(text: String, pos: Vector2, sz: Vector2, parent: Node = null) -> Button:
	var b := Button.new()
	b.text = text
	b.position = pos
	b.size = sz
	b.focus_mode = Control.FOCUS_NONE
	(parent if parent != null else self).add_child(b)
	return b

# ================================================================== menu / encounters
func _ensure_run_ui() -> void:
	if run_ui == null:
		run_ui = RunUI.new()
		run_ui.main = self
		add_child(run_ui)
		move_child(hub, get_child_count() - 1)

## The Leave button. Never mid-round: the round in play must finish first.
func _leave() -> void:
	if resolving:
		return
	_show_menu()

## Back to the abbey: the garth, with the company at the cross.
func _show_menu() -> void:
	resolving = false
	_clear_overlay()
	run_mode = false
	_ensure_run_ui()
	run_ui.visible = false
	hub.enter()

## The church: the fifteen doors, then the purpose and the descent.
func open_church() -> void:
	_ensure_run_ui()
	hub.visible = false
	run_ui.visible = true
	run_ui.show_hub()

func continue_run() -> void:
	_ensure_run_ui()
	hub.visible = false
	run_ui.visible = true
	run_ui._continue_run()

## Single rooms and the gauntlet, for development only: release builds never show it.
func _show_practice() -> void:
	if not OS.is_debug_build():
		return
	resolving = false
	_clear_overlay()
	overlay = Control.new()
	overlay.size = Vector2(1600, 1000)
	add_child(overlay)
	var dim := ColorRect.new()
	dim.color = UiStyle.DIM
	dim.size = overlay.size
	overlay.add_child(dim)
	var t := UiStyle.label("Ostium", 92, UiStyle.font_bl, UiStyle.RED_D)
	t.position = Vector2(0, 110)
	t.size = Vector2(1600, 110)
	t.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	overlay.add_child(t)
	var st := UiStyle.label("v0.3 · the fifteen doors", 22, UiStyle.font_it, UiStyle.BROWN)
	st.position = Vector2(0, 212)
	st.size = Vector2(1600, 30)
	st.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	overlay.add_child(st)
	# party: pick 2-4 of the six
	var pl := UiStyle.label("the company · choose two to four", 18, UiStyle.font_sc, UiStyle.BROWN)
	pl.position = Vector2(0, 262)
	pl.size = Vector2(1600, 24)
	pl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	overlay.add_child(pl)
	for i in Data.CLASS_ORDER.size():
		var key: String = Data.CLASS_ORDER[i]
		var hd: Dictionary = Data.HEROES[key]
		var b := Button.new()
		b.toggle_mode = true
		b.button_pressed = party.has(key)
		b.position = Vector2(230 + i * 192, 292)
		b.size = Vector2(180, 150)
		b.focus_mode = Control.FOCUS_NONE
		b.tooltip_text = "%s · %d HP\n%s" % [hd.name, hd.hp, hd.blurb]
		var on := UiStyle.box(UiStyle.HI, UiStyle.RED, 3)
		b.add_theme_stylebox_override("pressed", on)
		b.add_theme_stylebox_override("hover_pressed", on)
		var at := AtlasTexture.new()
		var tex: Texture2D = load(hd.art)
		at.atlas = tex
		var fr: Array = hd.face
		at.region = Rect2(tex.get_width() * max(0.0, fr[0] - fr[2] * 0.5), tex.get_height() * fr[1], tex.get_width() * fr[2] * 2.0, tex.get_height() * fr[3] * 1.4)
		var tr := TextureRect.new()
		tr.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		tr.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		tr.texture = at
		tr.position = Vector2(8, 6)
		tr.size = Vector2(164, 112)
		tr.mouse_filter = Control.MOUSE_FILTER_IGNORE
		b.add_child(tr)
		var nl := UiStyle.label(hd.name, 18, UiStyle.font_sc)
		nl.position = Vector2(0, 120)
		nl.size = Vector2(180, 24)
		nl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		b.add_child(nl)
		b.toggled.connect(func(p): _toggle_party(key, p, b))
		overlay.add_child(b)
	for wi in Data.WORLD_ORDER.size():
		var wk: String = Data.WORLD_ORDER[wi]
		var wb := _button(Data.WORLDS[wk].name.replace("The ", ""), Vector2(110 + (wi % 8) * 174, 452 + int(wi / 8) * 40), Vector2(168, 34), overlay)
		wb.add_theme_font_size_override("font_size", 14)
		wb.tooltip_text = "%s · %s" % [" + ".join(Data.WORLDS[wk].pair).capitalize(), Data.WORLDS[wk].conjunction]
		if wk == practice_world:
			wb.add_theme_stylebox_override("normal", UiStyle.box(UiStyle.HI, UiStyle.RED, 3))
		wb.pressed.connect(func(): practice_world = wk; _show_practice())
	var el := UiStyle.label("the rooms of " + Data.WORLDS[practice_world].name, 18, UiStyle.font_sc, UiStyle.BROWN)
	el.position = Vector2(0, 540)
	el.size = Vector2(1600, 24)
	el.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	overlay.add_child(el)
	var cols := 3
	var shown := 0
	for i in Data.ENCOUNTERS.size():
		var e: Dictionary = Data.ENCOUNTERS[i]
		if e.get("world", "drowned") != practice_world:
			continue
		var b := _button(e.name, Vector2(230 + (shown % cols) * 384, 570 + int(shown / cols) * 46), Vector2(370, 40), overlay)
		shown += 1
		b.add_theme_font_size_override("font_size", 19)
		b.tooltip_text = e.desc
		var idx := i
		b.pressed.connect(func(): gauntlet = false; carry = {}; attempt = 0; _start_encounter(idx))
	var gy: float = 570 + ceil(shown / float(cols)) * 46 + 6
	var g := _button("The Gauntlet  ·  every room in turn; wounds, stress and spoils carry over", Vector2(430, gy), Vector2(740, 52), overlay)
	g.add_theme_font_size_override("font_size", 19)
	g.visible = practice_world == "drowned"
	g.pressed.connect(func(): gauntlet = true; carry = {}; attempt = 0; gauntlet_pos = 0; _start_encounter(Data.GAUNTLET[0]))
	var q := _button("Back", Vector2(740, gy + 64), Vector2(120, 40), overlay)
	q.pressed.connect(_show_menu)
	var help := UiStyle.label("Pick a hero (portrait, sprite or 1-3), click cards and then a target to add them to the Ordo. Drag Ordo slots to reorder, right-click to remove.\nEvery number you see is exact: the field previews the whole round, foes included. Enter commits. L opens the chronicle.", 16, UiStyle.font_it, UiStyle.INK)
	help.position = Vector2(300, 900)
	help.size = Vector2(1000, 60)
	help.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	help.autowrap_mode = TextServer.AUTOWRAP_WORD
	overlay.add_child(help)

func _toggle_party(key: String, pressed: bool, b: Button) -> void:
	if pressed and not party.has(key):
		if party.size() >= 4:
			b.set_pressed_no_signal(false)
			return
		party.append(key)
	elif not pressed and party.has(key):
		if party.size() <= 2:
			b.set_pressed_no_signal(true)
			return
		party.erase(key)
	# keep the roster order stable: front-liners first
	var ordered := []
	for k in Data.CLASS_ORDER:
		if party.has(k):
			ordered.append(k)
	party = ordered

func _clear_overlay() -> void:
	if overlay != null and is_instance_valid(overlay):
		overlay.queue_free()
	overlay = null

func _start_encounter(idx: int) -> void:
	_clear_overlay()
	encounter_idx = idx
	var e: Dictionary = Data.ENCOUNTERS[idx]
	run_mode = false
	s = Combat.new_state(party, e.enemies, 1000 + idx * 17 + attempt * 131)
	for h in s.heroes:
		if carry.has(h.key):
			var c: Dictionary = carry[h.key]
			h.hp = c.hp
			h.stress = c.stress
			h.resolve = c.resolve
			h.deaths_door = c.dd
			h.deck = c.deck.duplicate()
			h.draw = c.deck.duplicate()
			Combat._shuffle(s, h.draw)
	_begin_fight(e)

## Run mode: the run supplies heroes, gear, relics and scaling.
func start_run_fight(idx: int, setup: Dictionary, seed: int) -> void:
	_clear_overlay()
	run_mode = true
	encounter_idx = idx
	var e: Dictionary = Data.ENCOUNTERS[idx]
	s = Combat.new_state_run(setup, e.enemies, seed)
	visible = true
	_begin_fight(e)
	Run.save_fight(encounter_idx, s, [])

## Run mode, from the save: the same round, hands and foes. A round that was committed before the game closed
## plays out again with the same Ordo, so leaving mid-round changes nothing.
func resume_run_fight(f: Dictionary) -> void:
	_clear_overlay()
	run_mode = true
	encounter_idx = int(f.idx)
	s = f.s
	visible = true
	_begin_fight(Data.ENCOUNTERS[encounter_idx], false)
	var committed: Array = f.get("plan", [])
	if not committed.is_empty():
		plan = committed
		refresh_all()
		_commit.call_deferred()

func _begin_fight(e: Dictionary, fresh := true) -> void:
	if run_ui != null:
		run_ui.visible = false
	for v in unit_views.values():
		v.queue_free()
	unit_views.clear()
	for u in s.heroes + s.enemies:
		_make_view(u)
	plan = []
	targeting = {}
	if fresh:
		Combat.start_round(s)
	active_hero = s.heroes[0].id
	resolving = false
	title_l.text = "Of %s · %s" % [Data.WORLDS.get(e.get("world", "drowned"), Data.WORLDS.drowned).name.replace("The ", "the "), e.name]
	_set_room(e.get("room", "nave"))
	log_r.text = ""
	_layout_units(false)
	refresh_all()

func _make_view(u: Dictionary) -> void:
	var v := UiUnit.new()
	var sz := Vector2(240, 330 if s.heroes.size() < 4 else 300)
	var feet := 0.966
	if u.side == "enemy":
		var es: Array = Data.ENEMIES[u.key].size
		sz = Vector2(es[0], es[1]) * (1.0 if s.heroes.size() < 4 else 0.92)
		feet = Data.ENEMIES[u.key].feet
	v.setup(self, u, sz, feet)
	field.add_child(v)
	unit_views[u.id] = v

func _layout_units(animate := true) -> void:
	for i in s.heroes.size():
		_place(s.heroes[i], HERO_X[clamp(s.heroes.size(), 1, 4)][i], animate)
	var total := 0
	for e in s.enemies:
		total += int(e.get("span", 1))
	var xs: Array = {1: [1150.0], 2: [1010.0, 1300.0], 3: [972.0, 1196.0, 1414.0], 4: [930.0, 1095.0, 1260.0, 1425.0]}.get(clamp(total, 1, 4))
	var slot := 0
	for e in s.enemies:
		var sp := int(e.get("span", 1))
		var x := 0.0
		for k in sp:
			x += xs[min(slot + k, xs.size() - 1)]
		_place(e, x / sp, animate)
		slot += sp

func _place(u: Dictionary, cx: float, animate: bool) -> void:
	var v: UiUnit = unit_views.get(u.id)
	if v == null:
		return
	var p := Vector2(cx - v.size.x / 2, FEET_Y - v.feet_y())
	if animate:
		var tw := v.create_tween()
		tw.tween_property(v, "position", p, 0.25).set_trans(Tween.TRANS_SINE)
	else:
		v.position = p

# ================================================================== refresh
func energy_left() -> int:
	var used := 0
	for a in plan:
		used += a.cost
	return s.energy - used

func refresh_all() -> void:
	if s.is_empty():
		return
	preview = Combat.simulate(s, plan)
	var pstate: Dictionary = preview.state
	for id in unit_views:
		var u := Combat.find(s, id)
		if u.is_empty():
			continue
		var pu := Combat.find(pstate, id)
		unit_views[id].refresh(u, pu, s)
		unit_views[id].selected = (id == active_hero)
		unit_views[id].target_mode = (1 if valid_targets.has(id) else 0) if not targeting.is_empty() else 0
		unit_views[id].queue_redraw()
	_rebuild_timeline()
	_rebuild_party()
	_rebuild_hand()
	energy_view.queue_redraw()
	var where: String = Data.ENCOUNTERS[encounter_idx].tier
	if run_mode and not Run.r.is_empty():
		where = "doom %d, level %d · %s" % [int(Run.r.doom), Run.doom_level(), where]
	elif gauntlet:
		where = "gauntlet %d of %d" % [gauntlet_pos + 1, Data.GAUNTLET.size()]
	round_l.text = "round %s · %s" % [_roman(s.round), where]
	commit_btn.disabled = resolving
	leave_btn.disabled = resolving
	undo_btn.disabled = resolving or plan.is_empty()
	var log_lines: Array = s.log.slice(max(0, s.log.size() - 160))
	log_r.text = "\n".join(log_lines)
	if targeting.is_empty() and not resolving:
		hint_l.text = ""

func preview_has_died(id: int) -> bool:
	return not preview.is_empty() and Combat.find(preview.state, id).is_empty()

func _roman(n: int) -> String:
	var r := ["", "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii", "xiii", "xiv", "xv"]
	return r[n] if n < r.size() else str(n)

func _rebuild_timeline() -> void:
	_clear(timeline_plan)
	_clear(timeline_enemy)
	var ordered: Array = preview.get("ordered", plan)
	for i in plan.size():
		var a: Dictionary = plan[i]
		var h := Combat.find(s, a.hero)
		var c: Dictionary = Data.CARDS[a.card]
		var t := Combat.find(s, a.get("target", -1))
		var sub: String = h.get("name", "?")
		if c.target == "self":
			sub += " · self"
		elif c.target == "all_enemies":
			sub += " · all foes"
		elif c.target == "all_allies":
			sub += " · all heroes"
		elif not t.is_empty():
			sub += " → " + (t.name if t.side == "hero" else t.name.split(" ")[-1])
		var oi: int = ordered.find(a)
		var why := ""
		if oi >= 0 and oi < preview.reasons.size():
			why = preview.reasons[oi]
		var slot := UiSlot.new()
		var nm: String = c.name + ((" (X=%d)" % a.x) if c.cost < 0 else "")
		slot.setup(self, i, true, nm, sub, _roman(i + 1), Color(h.get("color", "ecdfc2")), UiStyle.INK, why)
		timeline_plan.add_child(slot)
	if plan.is_empty():
		var e := UiStyle.label("click a card, then its target, to begin the Ordo", 15, UiStyle.font_it, UiStyle.BROWN)
		e.custom_minimum_size = Vector2(400, 56)
		e.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		timeline_plan.add_child(e)
	for i in s.enemy_queue.size():
		var en := Combat.find(s, s.enemy_queue[i])
		if en.is_empty():
			continue
		var it := Combat.intent_of(en)
		var tgt := Combat.find(s, en.intent_target)
		var sub: String = en.name.split(" ")[-1]
		if it.target in ["front", "back"] and not tgt.is_empty():
			sub += " → " + tgt.name
		elif it.target == "all_heroes":
			sub += " · all heroes"
		elif it.target == "ally_lowest" and not tgt.is_empty():
			sub += " → " + tgt.name.split(" ")[-1]
		var kind_col := {"attack": UiStyle.RED, "heal": UiStyle.GREEN, "debuff": UiStyle.VIOLET, "defend": UiStyle.BLUE}
		var slot := UiSlot.new()
		slot.setup(self, i, false, it.name, sub, _roman(i + 1), kind_col.get(it.kind, UiStyle.RED), UiStyle.RED_D, "")
		slot.tooltip_text = "%s: %s" % [it.name, it.text]
		timeline_enemy.add_child(slot)

func _rebuild_party() -> void:
	_clear(party_box)
	for i in s.heroes.size():
		var h: Dictionary = s.heroes[i]
		var b := Button.new()
		b.custom_minimum_size = Vector2(236, 76 if s.heroes.size() < 4 else 56)
		b.focus_mode = Control.FOCUS_NONE
		var active: bool = h.id == active_hero
		if active:
			var sb := UiStyle.box(UiStyle.HI, UiStyle.RED, 3)
			sb.shadow_color = UiStyle.INK
			sb.shadow_offset = Vector2(4, 4)
			sb.shadow_size = 1
			b.add_theme_stylebox_override("normal", sb)
			b.add_theme_stylebox_override("hover", sb)
		var hb := HBoxContainer.new()
		hb.position = Vector2(8, 8)
		hb.size = Vector2(220, 60)
		hb.mouse_filter = Control.MOUSE_FILTER_IGNORE
		b.add_child(hb)
		var at := AtlasTexture.new()
		var tex: Texture2D = load(h.art)
		at.atlas = tex
		var fr: Array = Data.HEROES[h.key].face
		at.region = Rect2(tex.get_width() * fr[0], tex.get_height() * fr[1], tex.get_width() * fr[2], tex.get_height() * fr[3])
		var tr := TextureRect.new()
		tr.texture = at
		tr.custom_minimum_size = Vector2(50, 58)
		tr.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		tr.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
		tr.mouse_filter = Control.MOUSE_FILTER_IGNORE
		hb.add_child(tr)
		var v := VBoxContainer.new()
		v.add_theme_constant_override("separation", 0)
		v.mouse_filter = Control.MOUSE_FILTER_IGNORE
		v.add_child(UiStyle.label("%s · %s" % [_roman(i + 1), h.name], 17, UiStyle.font_sc))
		var q := 0
		for a in plan:
			if a.hero == h.id:
				q += 1
		var line := "%d cards · %d queued" % [h.hand.size(), q]
		if h.st.freeze > 0:
			line = "frozen: kit only"
		v.add_child(UiStyle.label(line, 14, UiStyle.font_it, UiStyle.RED_D if h.st.freeze > 0 else UiStyle.BROWN))
		hb.add_child(v)
		var hid: int = h.id
		b.pressed.connect(func(): set_active(hid))
		party_box.add_child(b)

func set_active(hid: int) -> void:
	if resolving:
		return
	active_hero = hid
	cancel_targeting()
	refresh_all()

func _rebuild_hand() -> void:
	_clear(kit_box)
	_clear(hand_layer)
	var h := Combat.find(s, active_hero)
	if h.is_empty():
		if s.heroes.size() > 0:
			active_hero = s.heroes[0].id
			h = s.heroes[0]
		else:
			return
	kit_box.add_child(UiStyle.label("kit", 15, UiStyle.font_sc, UiStyle.BROWN))
	for kid in h.kit + ["swap"]:
		var c: Dictionary = Data.CARDS[kid]
		var b := Button.new()
		b.text = "%s · %d" % [c.name, c.cost]
		b.custom_minimum_size = Vector2(0, 36)
		b.focus_mode = Control.FOCUS_NONE
		b.tooltip_text = UiStyle.keyword_tip(c) + "\nKit: once per round."
		var used: bool = _kit_queued(h.id, kid) or h.kit_used.get(kid, false)
		b.disabled = resolving or used or c.cost > energy_left()
		var k: String = kid
		var hid: int = h.id
		b.pressed.connect(func(): on_kit_clicked(hid, k))
		kit_box.add_child(b)
	for bi in s.get("belt", []).size():
		var fid: String = s.belt[bi]
		var fc: Dictionary = Data.CARDS[fid]
		var bb := Button.new()
		bb.text = "belt: %s" % fc.name
		bb.custom_minimum_size = Vector2(0, 36)
		bb.focus_mode = Control.FOCUS_NONE
		bb.tooltip_text = UiStyle.keyword_tip(fc) + "\nBelt: used up when played. Costs no vigour."
		var queued_belt := 0
		for a in plan:
			if a.source == "belt" and a.card == fid:
				queued_belt += 1
		bb.disabled = resolving or queued_belt >= s.belt.count(fid)
		var hid2: int = h.id
		bb.pressed.connect(func(): if not resolving: _begin_action({"hero": hid2, "card": fid, "source": "belt", "hand_index": -1, "target": -1, "x": 0, "cost": 0}))
		kit_box.add_child(bb)
	var n: int = h.hand.size()
	var spacing: float = min(198.0, 790.0 / max(1, n))
	for i in n:
		var cv := UiCard.new()
		cv.setup(self, h.id, i, h.hand[i])
		cv.position = Vector2(330 + i * spacing, 740)
		cv.base_y = 740
		var q := -1
		for j in plan.size():
			if plan[j].hero == h.id and plan[j].source == "hand" and plan[j].hand_index == i:
				q = j
		var c: Dictionary = Data.CARDS[h.hand[i]]
		var cost: int = c.cost if c.cost >= 0 else 1
		cv.set_state(q, q >= 0 or (cost <= energy_left() and c.target != "none" and h.st.freeze == 0))
		hand_layer.add_child(cv)
	var dl := "%s's deck\ndraw %d · discard %d" % [h.name, h.draw.size(), h.discard.size()]
	if h.exhaust.size() > 0:
		dl += " · exhaust %d" % h.exhaust.size()
	deck_l.text = dl

func _clear(n: Node) -> void:
	for c in n.get_children():
		n.remove_child(c)
		c.queue_free()

func _kit_queued(hid: int, kid: String) -> bool:
	for a in plan:
		if a.hero == hid and a.source == "kit" and a.card == kid:
			return true
	return false

func _draw_energy() -> void:
	if s.is_empty():
		return
	var c := Vector2(65, 62)
	var pts := PackedVector2Array()
	for i in 17:
		var a := TAU * i / 16.0
		var r := 60.0 if i % 2 == 0 else 52.0
		pts.append(c + Vector2(cos(a), sin(a)) * r)
	energy_view.draw_colored_polygon(pts, UiStyle.GOLD)
	energy_view.draw_polyline(pts, UiStyle.INK, 2.5)
	energy_view.draw_circle(c, 44, Color("7f9cc6"))
	energy_view.draw_arc(c, 44, 0, TAU, 48, UiStyle.INK, 2.5)
	var txt := "%d/%d" % [energy_left(), s.energy]
	energy_view.draw_string(UiStyle.font_sc, c + Vector2(-60, 12), txt, HORIZONTAL_ALIGNMENT_CENTER, 120, 32, UiStyle.CREAM)
	energy_view.draw_string(UiStyle.font_sc, c + Vector2(-60, 80), "vigour", HORIZONTAL_ALIGNMENT_CENTER, 120, 17, UiStyle.BLUE)

# ================================================================== planning input
func on_card_clicked(hid: int, idx: int) -> void:
	if resolving:
		return
	for j in plan.size():
		if plan[j].hero == hid and plan[j].source == "hand" and plan[j].hand_index == idx:
			remove_slot(j)
			return
	var h := Combat.find(s, hid)
	var cid: String = h.hand[idx]
	var c: Dictionary = Data.CARDS[cid]
	if c.target == "none":
		_hint("%s cannot be played." % c.name)
		return
	if h.st.freeze > 0:
		_hint("%s is frozen and may only use kit skills this round." % h.name)
		return
	var cost: int = c.cost
	var x := 0
	if c.cost < 0:
		x = energy_left()
		cost = x
		if x < 1:
			_hint("Not enough vigour.")
			return
	if cost > energy_left():
		_hint("Not enough vigour.")
		return
	_begin_action({"hero": hid, "card": cid, "source": "hand", "hand_index": idx, "target": -1, "x": x, "cost": cost})

func on_kit_clicked(hid: int, kid: String) -> void:
	if resolving:
		return
	var c: Dictionary = Data.CARDS[kid]
	if c.cost > energy_left():
		_hint("Not enough vigour.")
		return
	_begin_action({"hero": hid, "card": kid, "source": "kit", "hand_index": -1, "target": -1, "x": 0, "cost": c.cost})

func _begin_action(a: Dictionary) -> void:
	var c: Dictionary = Data.CARDS[a.card]
	if c.target in ["self", "all_enemies", "all_allies"]:
		var why := Combat.check_action(Combat.simulate(s, plan, false).state, a)
		if why != "":
			_hint("%s cannot be played: %s." % [c.name, why])
			return
		_queue(a)
		return
	var st: Dictionary = Combat.simulate(s, plan, false).state
	valid_targets = []
	var pool: Array = st.enemies if c.target == "enemy" else st.heroes
	for u in pool:
		var a2 := a.duplicate()
		a2.target = u.id
		if Combat.check_action(st, a2) == "":
			valid_targets.append(u.id)
	if valid_targets.is_empty():
		var a2 := a.duplicate()
		if pool.size() > 0:
			a2.target = pool[0].id
		_hint("No legal target for %s right now: %s." % [c.name, Combat.check_action(st, a2)])
		return
	targeting = a
	_hint("Choose a target for %s · right-click or Esc to cancel." % c.name)
	refresh_all()
	hint_l.text = "Choose a target for %s · right-click or Esc to cancel." % c.name

func on_unit_clicked(id: int) -> void:
	if resolving:
		return
	if not targeting.is_empty():
		if valid_targets.has(id):
			var a := targeting
			a.target = id
			targeting = {}
			valid_targets = []
			_queue(a)
		else:
			_hint("Not a legal target.")
		return
	var u := Combat.find(s, id)
	if not u.is_empty() and u.side == "hero":
		set_active(id)

func on_unit_hover(_id: int, _on: bool) -> void:
	pass

func cancel_targeting() -> void:
	if targeting.is_empty():
		return
	targeting = {}
	valid_targets = []
	refresh_all()

func _queue(a: Dictionary) -> void:
	plan.append(a)
	refresh_all()

func remove_slot(i: int) -> void:
	if resolving or i < 0 or i >= plan.size():
		return
	plan.remove_at(i)
	# X cards spend what is left, so recompute their X after removals
	_recompute_x()
	refresh_all()

func move_slot(from: int, to: int) -> void:
	if resolving or from == to or from < 0 or from >= plan.size():
		return
	var a = plan.pop_at(from)
	plan.insert(clamp(to, 0, plan.size()), a)
	refresh_all()

func _recompute_x() -> void:
	var spent := 0
	for a in plan:
		if Data.CARDS[a.card].cost >= 0:
			spent += a.cost
	for a in plan:
		if Data.CARDS[a.card].cost < 0:
			a.x = max(1, min(a.x, s.energy - spent))
			a.cost = a.x
			spent += a.cost

func highlight_slot(i: int, on: bool) -> void:
	for id in unit_views:
		unit_views[id].hovered = false
	if on:
		if i >= 0 and i < plan.size():
			var a: Dictionary = plan[i]
			for id in [a.hero, a.get("target", -1)]:
				if unit_views.has(id):
					unit_views[id].hovered = true
		elif i <= -100:
			var qi := -100 - i
			if qi < s.enemy_queue.size():
				var e := Combat.find(s, s.enemy_queue[qi])
				for id in [e.get("id", -1), e.get("intent_target", -1)]:
					if unit_views.has(id):
						unit_views[id].hovered = true
	for id in unit_views:
		unit_views[id].queue_redraw()

func _hint(t: String) -> void:
	hint_l.text = t

func _toggle_log() -> void:
	log_panel.visible = not log_panel.visible

func _unhandled_input(ev: InputEvent) -> void:
	if ev is InputEventKey and ev.pressed and not ev.echo and not s.is_empty() and overlay == null:
		match ev.keycode:
			KEY_1, KEY_2, KEY_3, KEY_4:
				var r: int = ev.keycode - KEY_1
				if r < s.heroes.size():
					set_active(s.heroes[r].id)
			KEY_ENTER, KEY_KP_ENTER, KEY_SPACE:
				_commit()
			KEY_BACKSPACE:
				if plan.size() > 0:
					remove_slot(plan.size() - 1)
			KEY_ESCAPE:
				cancel_targeting()
			KEY_L:
				_toggle_log()

# ================================================================== resolution
func _commit() -> void:
	if resolving or s.is_empty() or s.outcome != "":
		return
	cancel_targeting()
	if run_mode:
		Run.save_fight(encounter_idx, s.duplicate(true), plan.duplicate(true))
	resolving = true
	commit_btn.disabled = true
	undo_btn.disabled = true
	leave_btn.disabled = true
	hint_l.text = "The Ordo unfolds..."
	Combat.commit_cards(s, plan)
	var ordered := Combat.order_plan(s, plan)
	var slots := timeline_plan.get_children()
	for i in ordered.size():
		var pi: int = plan.find(ordered[i])
		if pi >= 0 and pi < slots.size():
			_mark_slot(slots[pi])
		s.events = []
		Combat.resolve_player_action(s, ordered[i])
		await _play_events()
		if s.outcome != "":
			break
	if s.outcome == "":
		s.events = []
		Combat.resolve_echoes(s)
		await _play_events()
	var eslots := timeline_enemy.get_children()
	var ei := 0
	for id in s.enemy_queue.duplicate():
		if s.outcome != "":
			break
		if ei < eslots.size():
			_mark_slot(eslots[ei])
		ei += 1
		s.events = []
		Combat.resolve_enemy_action(s, id)
		await _play_events()
	if s.outcome == "":
		s.events = []
		Combat.end_round(s)
		await _play_events()
	plan = []
	if s.outcome != "":
		_sync_views()
		await get_tree().create_timer(0.5).timeout
		if run_mode:
			resolving = false
			run_ui.after_fight(s)
		else:
			_show_result()
		return
	Combat.start_round(s)
	if run_mode:
		Run.save_fight(encounter_idx, s, [])
	if Combat.find(s, active_hero).is_empty() and s.heroes.size() > 0:
		active_hero = s.heroes[0].id
	resolving = false
	_layout_units()
	refresh_all()

func _mark_slot(n: Node) -> void:
	if is_instance_valid(n) and n is Panel:
		var sb := UiStyle.box(UiStyle.HI, UiStyle.GOLD_D, 4)
		n.add_theme_stylebox_override("panel", sb)

func _sync_views() -> void:
	for id in unit_views.keys():
		var u := Combat.find(s, id)
		if u.is_empty():
			continue
		unit_views[id].refresh(u, {}, s)
		unit_views[id].selected = false
		unit_views[id].target_mode = 0
	_layout_units()
	log_r.text = "\n".join(s.log.slice(max(0, s.log.size() - 160)))

func _play_events() -> void:
	var evs: Array = s.events.duplicate()
	s.events = []
	for ev in evs:
		var v: UiUnit = unit_views.get(ev.get("unit", -1))
		match ev.t:
			"act":
				if v != null:
					await _act_anim(ev, v)
			"dmg":
				if v != null:
					if ev.n > 0:
						_float(v, "-%d" % ev.n, UiStyle.RED_D, 30, 40)
						v.play_hit()
						Vfx.blood(fx_layer, v.position + v.body_point(), clamp(8 + ev.n, 10, 40))
						if ev.n >= 15:
							Vfx.shake(field, 7.0, 0.25)
					elif ev.blocked > 0:
						_float(v, "blocked %d" % ev.blocked, UiStyle.BLUE, 20, 40)
					else:
						_float(v, "0", UiStyle.BROWN, 20, 40)
				_sync_views()
				await get_tree().create_timer(0.22).timeout
			"block":
				if v != null:
					Vfx.shield(fx_layer, v.position + v.body_point())
					_float(v, "+%d block" % ev.n, UiStyle.BLUE, 20, 60)
				_sync_views()
				await get_tree().create_timer(0.14).timeout
			"heal":
				if v != null:
					Vfx.heal(fx_layer, v.position + v.body_point())
					_float(v, "+%d" % ev.n, UiStyle.GREEN, 26, 50)
				_sync_views()
				await get_tree().create_timer(0.2).timeout
			"element":
				if v != null:
					Vfx.element(fx_layer, v.position + v.body_point(), ev.e)
					_float(v, "+%d %s" % [ev.n, Data.ELEMENT_STATUS[ev.e]], Data.ELEMENT_COLOR[ev.e], 20, 80)
				_sync_views()
				await get_tree().create_timer(0.14).timeout
			"reaction":
				if v != null:
					Vfx.ring(fx_layer, v.position + v.body_point(), UiStyle.GOLD, 10, 110, 0.5, 6)
					Vfx.burst(fx_layer, v.position + v.body_point(), Color("f6d27a"), {"amount": 40, "vmax": 320.0, "gravity": Vector2(0, 120)})
					Vfx.shake(field, 9.0, 0.3)
					_float(v, ev.text + "!", UiStyle.GOLD_D, 34, 10, true)
					var tw := v.create_tween()
					tw.tween_property(v.sprite, "modulate", Color(1.4, 1.2, 0.8), 0.08)
					tw.tween_property(v.sprite, "modulate", Color(1, 1, 1), 0.3)
				await get_tree().create_timer(0.45).timeout
			"stress":
				if v != null and ev.n > 0:
					Vfx.stress(fx_layer, v.position + v.body_point())
				if v != null:
					_float(v, "+%d stress" % ev.n, UiStyle.VIOLET, 18, 100)
				_sync_views()
				await get_tree().create_timer(0.1).timeout
			"dd":
				if v != null:
					_float(v, "DEATH'S DOOR", UiStyle.RED_D, 30, 0, true)
				_sync_views()
				await get_tree().create_timer(0.5).timeout
			"death":
				if v != null:
					Vfx.blood(fx_layer, v.position + v.body_point(), 50)
					unit_views.erase(ev.unit)
					var tw := v.create_tween()
					tw.tween_property(v, "modulate", Color(1, 1, 1, 0), 0.5)
					tw.tween_callback(v.queue_free)
				await get_tree().create_timer(0.4).timeout
				_layout_units()
			"move":
				_layout_units()
				await get_tree().create_timer(0.25).timeout
			"status", "fizzle":
				if v != null:
					_float(v, ev.text, UiStyle.BROWN if ev.t == "status" else UiStyle.DISABLED_INK, 17, 120)
				_sync_views()
				await get_tree().create_timer(0.12).timeout
	_sync_views()

## The acting unit's animation and the effect that travels to its target(s).
func _act_anim(ev: Dictionary, v: UiUnit) -> void:
	_float(v, ev.text, UiStyle.INK, 20, -40)
	var targets: Array = []
	if ev.has("targets"):
		for id in ev.targets:
			if unit_views.has(id):
				targets.append(unit_views[id])
	elif unit_views.has(ev.get("target", -1)):
		targets.append(unit_views[ev.target])
	var kind := ""
	var elem := ""
	var effect := "hit"
	if ev.has("card"):
		var c: Dictionary = Data.CARDS[ev.card]
		var types := []
		for f in c.fx:
			types.append(f.t)
		elem = c.cat if Data.ELEMENTS.has(c.cat) else ""
		if c.cat == "attuned":
			var hu := Combat.find(s, ev.unit)
			elem = Data.ELEMENTS[hu.get("attuned", 3)]
		if c.target == "all_enemies":
			targets = []
			for e in s.enemies:
				if unit_views.has(e.id):
					targets.append(unit_views[e.id])
		elif c.target in ["self", "all_allies"]:
			targets = [v] if c.target == "self" else s.heroes.map(func(h): return unit_views.get(h.id)).filter(func(x): return x != null)
		if types.has("dmg") or types.has("coup") or types.has("dmg_per_element"):
			kind = v.default_attack()
			effect = "spell" if elem != "" and v.default_attack() in ["cast", "throw"] else "hit"
		elif types.has("block") or types.has("self_block") or types.has("guard") or types.has("armor"):
			kind = "block" if v.parts.has("shield") else "cast"
			effect = "shield"
		elif types.has("heal") or (types.has("stress") and c.target != "enemy"):
			kind = "cast"
			effect = "heal"
		else:
			kind = "cast"
			effect = "spell" if elem != "" or c.target in ["enemy", "all_enemies"] else "buff"
	else:
		var it: Dictionary = ev.get("intent", {})
		match it.get("kind", "attack"):
			"attack":
				kind = v.default_attack()
				effect = "hit"
			"heal":
				kind = "cast"
				effect = "heal"
			"defend":
				kind = "cast"
				effect = "shield"
			_:
				kind = "cast"
				effect = "dread"
		for f in it.get("fx", []):
			if f.t == "apply":
				elem = f.e
	var strike := v.play_action(kind)
	await get_tree().create_timer(strike * 0.8).timeout
	var from := v.position + v.hand_point()
	for tv in targets:
		var to: Vector2 = tv.position + tv.body_point()
		match effect:
			"hit":
				Vfx.slash(fx_layer, to, UiStyle.CREAM if elem == "" else Vfx.EL[elem], v.facing, kind in ["cleave", "slam", "swing"])
				if elem != "":
					Vfx.element(fx_layer, to, elem)
			"spell":
				if tv == targets[0]:
					if elem == "lightning":
						Vfx.bolt(fx_layer, from, to, Vfx.EL.lightning)
					else:
						await Vfx.projectile(fx_layer, from, to, Vfx.EL.get(elem, Color("c8b8e8")))
				Vfx.element(fx_layer, to, elem if elem != "" else "void")
			"shield":
				Vfx.shield(fx_layer, to)
			"heal":
				Vfx.heal(fx_layer, to)
			"buff":
				Vfx.buff(fx_layer, to, UiStyle.GOLD)
			"dread":
				Vfx.stress(fx_layer, to)
				if elem != "":
					Vfx.element(fx_layer, to, elem)
	await get_tree().create_timer(0.22).timeout

func _float(v: UiUnit, text: String, col: Color, size: int, dy: float, big := false) -> void:
	var l := UiStyle.label(text, size, UiStyle.font_sc, col)
	l.add_theme_color_override("font_outline_color", UiStyle.HI)
	l.add_theme_constant_override("outline_size", 6)
	l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	l.size = Vector2(320, 40)
	l.position = v.position + Vector2(v.size.x / 2 - 160, v.feet_y() * 0.35 + dy * 0.6)
	fx_layer.add_child(l)
	var tw := l.create_tween()
	tw.set_parallel(true)
	tw.tween_property(l, "position:y", l.position.y - (60 if big else 40), 0.9 if big else 0.7)
	tw.tween_property(l, "modulate:a", 0.0, 0.9 if big else 0.7).set_delay(0.35)
	tw.chain().tween_callback(l.queue_free)

func _shake(v: UiUnit) -> void:
	var p := v.sprite.position
	var tw := v.create_tween()
	for i in 4:
		tw.tween_property(v.sprite, "position:x", p.x + (6 if i % 2 == 0 else -6), 0.03)
	tw.tween_property(v.sprite, "position:x", p.x, 0.03)

# ================================================================== results
func _show_result() -> void:
	resolving = false
	_clear_overlay()
	overlay = Control.new()
	overlay.size = Vector2(1600, 1000)
	add_child(overlay)
	var dim := ColorRect.new()
	dim.color = UiStyle.DIM
	dim.size = overlay.size
	overlay.add_child(dim)
	var win: bool = s.outcome == "victory"
	var t := UiStyle.label("Victory" if win else "The company is lost", 72, UiStyle.font_bl, UiStyle.RED_D)
	t.position = Vector2(0, 260)
	t.size = Vector2(1600, 100)
	t.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	overlay.add_child(t)
	var sub := "in %d rounds" % s.round
	if win:
		var lines := []
		for h in s.heroes:
			lines.append("%s %d/%d HP · stress %d%s" % [h.name, h.hp, h.max_hp, h.stress, " · at Death's Door" if h.deaths_door else ""])
		sub += "\n" + "\n".join(lines)
	var sl := UiStyle.label(sub, 20, UiStyle.font_it, UiStyle.BROWN)
	sl.position = Vector2(0, 370)
	sl.size = Vector2(1600, 120)
	sl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	overlay.add_child(sl)
	var y := 520
	if win and gauntlet and gauntlet_pos < Data.GAUNTLET.size() - 1:
		_show_spoils()
		y = 870
		var nb := _button("Onward: " + Data.ENCOUNTERS[Data.GAUNTLET[gauntlet_pos + 1]].name, Vector2(560, y), Vector2(480, 56), overlay)
		nb.pressed.connect(_gauntlet_next)
		y += 70
	elif win and gauntlet:
		var done := UiStyle.label("The Drowned King is dead. The gauntlet is won.", 22, UiStyle.font_sc, UiStyle.GREEN)
		done.position = Vector2(0, y)
		done.size = Vector2(1600, 40)
		done.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		overlay.add_child(done)
		y += 60
	if not win or not gauntlet:
		var rb := _button("Try again", Vector2(660, y), Vector2(280, 50), overlay)
		rb.pressed.connect(func(): attempt += 1; carry = carry if gauntlet else {}; _start_encounter(encounter_idx))
		y += 64
	var mb := _button("To the title", Vector2(660, y), Vector2(280, 50), overlay)
	mb.pressed.connect(_show_menu)

var spoils := {}

## One of three class cards per hero (C/U/R weighted by depth). Deterministic per room.
func _show_spoils() -> void:
	spoils = {}
	var lab := UiStyle.label("Spoils of the room · each hero may take one card (or none)", 20, UiStyle.font_sc, UiStyle.BROWN)
	lab.position = Vector2(0, 486)
	lab.size = Vector2(1600, 26)
	lab.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	overlay.add_child(lab)
	var col_w: float = 1500.0 / s.heroes.size()
	for hi in s.heroes.size():
		var h: Dictionary = s.heroes[hi]
		var x0: float = 50 + hi * col_w
		var nl := UiStyle.label(h.name, 18, UiStyle.font_sc)
		nl.position = Vector2(x0, 516)
		nl.size = Vector2(col_w, 24)
		nl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		overlay.add_child(nl)
		var picks := _reward_picks(h.key, encounter_idx * 31 + hi * 7 + attempt)
		for ci in picks.size():
			var cv := UiCard.new()
			cv.setup(self, h.id, -1, picks[ci])
			cv.scale = Vector2(0.62, 0.62)
			cv.position = Vector2(x0 + col_w / 2 - 3 * 122 / 2.0 + ci * 122, 546)
			cv.base_y = 546
			var key: String = h.key
			var cid: String = picks[ci]
			cv.reward_cb = func(): _take_spoil(key, cid)
			overlay.add_child(cv)
			if not spoils.has(key + "_views"):
				spoils[key + "_views"] = []
			spoils[key + "_views"].append(cv)

func _reward_picks(cls: String, seed: int) -> Array:
	var pool := Data.pool(cls)
	var by := {"C": [], "U": [], "R": []}
	for id in pool:
		by[Data.CARDS[id].rarity].append(id)
	var rng := RandomNumberGenerator.new()
	rng.seed = 7919 + seed
	var out := []
	var guard := 0
	while out.size() < 3 and guard < 50:
		guard += 1
		var roll := rng.randf()
		var rar := "R" if roll < 0.08 + 0.04 * encounter_idx else ("U" if roll < 0.40 else "C")
		var arr: Array = by[rar]
		if arr.is_empty():
			continue
		var id: String = arr[rng.randi() % arr.size()]
		if not out.has(id):
			out.append(id)
	return out

func _take_spoil(key: String, cid: String) -> void:
	spoils[key] = cid
	for v in spoils.get(key + "_views", []):
		v.badge = "taken"
		v.set_state(0 if v.card_id == cid else -1, true)
		v.modulate = Color(1, 1, 1, 1) if v.card_id == cid else Color(1, 1, 1, 0.45)

func _gauntlet_next() -> void:
	carry = {}
	for h in s.heroes:
		var deck: Array = h.deck.duplicate()
		var dreads := 0
		for c in h.discard + h.draw + h.hand + h.exhaust:
			if c == "dread":
				dreads += 1
		for i in max(0, dreads - deck.count("dread")):
			deck.append("dread")
		if spoils.has(h.key):
			deck.append(spoils[h.key])
		carry[h.key] = {"hp": max(1, h.hp), "stress": h.stress, "resolve": h.resolve, "dd": h.deaths_door, "deck": deck}
	attempt = 0
	gauntlet_pos += 1
	_start_encounter(Data.GAUNTLET[gauntlet_pos])

