class_name RunUI
extends Control
## Every screen outside combat: the Ostium hub (objective, party, ascension, unlocks), the kingdom map,
## events, merchant, shrine, camps, spoils, level-ups, the company roster and the end of the run.

var main: Node
var screen: Control
var msg := ""

const TYPE_INFO := {
	"start": ["Threshold", "O", "6f5036"], "combat": ["Fight", "F", "9c3d2b"], "elite": ["Elite", "E", "5e1a14"], "event": ["Event", "?", "3f6fa0"],
	"merchant": ["Merchant", "M", "a9822f"], "shrine": ["Shrine", "S", "6d5a8a"], "camp": ["Field camp", "C", "62804f"], "hidden": ["Hidden cache", "H", "6a6a5e"],
	"waypoint": ["Waypoint: a guardian, then the camp (legendary cards)", "W", "3f6a52"], "boss": ["The ruler", "B", "2b1d12"],
}

func _ready() -> void:
	size = Vector2(1600, 1000)
	mouse_filter = Control.MOUSE_FILTER_STOP
	Run.meta_load()

# ================================================================== helpers
func _screen(title := "", sub := "", bgp := "", bare := false) -> Control:
	if main != null and main.board != null:
		main.board.visible = false   # the fight's HP plates draw on a high layer; never let them show through a screen
	if bgp == "" and not Run.r.is_empty():
		# inside a run no screen is bare parchment: titled ones are writs, the rest sit on the sheet over the world
		if title != "":
			_writ(title, sub)
			return screen
		_writ("", "")
		return screen
	if bgp == "":
		# inside a run, the screens sit on the current world's backdrop
		bgp = "res://assets/art/hub/hub_bg.png"
		if not Run.r.is_empty():
			bgp = "res://assets/art/rooms/%s_far.png" % Data.WORLDS[Run.r.get("world", "drowned")].rooms[1]
	if screen != null and is_instance_valid(screen):
		screen.queue_free()
	visible = true
	main.visible = true
	screen = Control.new()
	screen.size = size
	add_child(screen)
	var hub := bgp.find("/hub/") != -1 and title == "Ostium"
	var bg := TextureRect.new()
	bg.texture = load(bgp)
	bg.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	bg.self_modulate = Color.WHITE if hub else UiStyle.PAGE_TINT
	bg.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	bg.size = size
	screen.add_child(bg)
	var veil := ColorRect.new()
	veil.color = Color(0, 0, 0, 0.18) if hub or bare else UiStyle.DIM
	veil.size = size
	screen.add_child(veil)
	if title != "":
		var t := _lbl(title, Vector2(0, 26), Vector2(1600, 60), 44, UiStyle.font_bl, UiStyle.GOLD if hub else UiStyle.RED_D)
		t.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	if sub != "":
		var s := _lbl(sub, Vector2(200, 86), Vector2(1200, 28), 19, UiStyle.font_it, UiStyle.CREAM if hub else UiStyle.BROWN)
		s.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		s.autowrap_mode = TextServer.AUTOWRAP_WORD
	return screen

func _lbl(text: String, pos: Vector2, sz: Vector2, fs := 17, font: FontFile = null, col := UiStyle.INK, parent: Node = null) -> Label:
	var l := UiStyle.label(text, fs, font, col)
	# wrap first: a label sized while unwrapped grows to its one-line width and keeps it
	l.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	l.position = pos
	l.size = sz
	(parent if parent != null else screen).add_child(l)
	return l

func _ibtn(icon_id: String, text: String, pos: Vector2, sz: Vector2, cb: Callable, parent: Node = null, tip := "") -> Button:
	var b := _btn(text, pos, sz, cb, parent, tip)
	b.icon = UiStyle.icon(icon_id)
	b.add_theme_constant_override("icon_max_width", int(min(sz.y - 6, 44)))
	b.alignment = HORIZONTAL_ALIGNMENT_LEFT
	return b

func _btn(text: String, pos: Vector2, sz: Vector2, cb: Callable, parent: Node = null, tip := "") -> Button:
	var b := Button.new()
	b.text = text
	b.position = pos
	b.size = sz
	b.focus_mode = Control.FOCUS_NONE
	b.tooltip_text = tip
	b.pressed.connect(cb)
	(parent if parent != null else screen).add_child(b)
	return b

func _panel(pos: Vector2, sz: Vector2, parent: Node = null) -> Panel:
	var p := Panel.new()
	p.add_theme_stylebox_override("panel", UiStyle.tex_box("btn_parch", 14))
	p.mouse_filter = Control.MOUSE_FILTER_IGNORE
	p.position = pos
	p.size = sz
	(parent if parent != null else screen).add_child(p)
	return p

func _rich(text: String, pos: Vector2, sz: Vector2, fs := 16, parent: Node = null) -> RichTextLabel:
	var r := UiStyle.rich(fs)
	r.fit_content = false
	r.position = pos
	r.size = sz
	r.text = text
	(parent if parent != null else screen).add_child(r)
	return r

func _card(cid: String, pos: Vector2, sc := 0.7, cb := Callable(), parent: Node = null) -> UiCard:
	var cv := UiCard.new()
	cv.setup(main, -1, -1, cid)
	cv.scale = Vector2(sc, sc)
	cv.position = pos
	cv.base_y = pos.y
	if cb.is_valid():
		cv.reward_cb = cb
	else:
		cv.reward_cb = func(): pass
	(parent if parent != null else screen).add_child(cv)
	return cv

func _portrait(key: String, pos: Vector2, sz: Vector2, parent: Node = null) -> TextureRect:
	var at: Texture2D = load("res://assets/art/ui/portraits/%s.png" % key)
	var tr := TextureRect.new()
	tr.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	tr.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	tr.texture = at
	tr.position = pos
	tr.size = sz
	tr.mouse_filter = Control.MOUSE_FILTER_IGNORE
	(parent if parent != null else screen).add_child(tr)
	return tr

func _toast(t: String) -> void:
	if t == "":
		return
	var l := _lbl(t, Vector2(300, 946), Vector2(1000, 40), 18, UiStyle.font_it, UiStyle.RED_D)
	l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	var tw := l.create_tween()
	tw.tween_interval(3.0)
	tw.tween_property(l, "modulate:a", 0.0, 1.0)

# ================================================================== hub
var hub_party: Array = ["bulwark", "duelist", "elementalist"]
var hub_obj := "boss"
var hub_commission := ""
var hub_asc: Array = []
var hub_world := "drowned"

const ROMAN := ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"]

## The Ostium: fifteen doors laid out along the road (data/story.json), five acts of three.
func show_hub() -> void:
	Abbey.sync_debug_roster()
	Run.meta_load()
	if not Run.door_open(hub_world):
		hub_world = "drowned"
	var road_open := Run.all_cleared()
	_screen("Ostium", "The chamber of doors. The road runs through them in order; each world points to the next." if not road_open else "The road is walked. Every door stands open; cast lots or choose.", "res://assets/art/hub/hub_bg.png")
	var x0 := 112.0
	var order: Array = Data.STORY.order
	for i in order.size():
		var wk: String = order[i]
		var row := 0 if i < 8 else 1
		var col := i if i < 8 else i - 8
		var pos := Vector2(x0 + col * 172 + (86 if row == 1 else 0), 128 + row * 262)
		var open := Run.door_open(wk)
		if wk == hub_world:
			var hl := _panel(pos - Vector2(6, 6), Vector2(162, 240))
			hl.add_theme_stylebox_override("panel", UiStyle.box(Color(0, 0, 0, 0), UiStyle.GOLD, 4))
		var tr := TextureRect.new()
		tr.texture = load("res://assets/art/hub/door_%s.png" % wk)
		tr.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		tr.position = pos
		tr.size = Vector2(150, 225)
		tr.mouse_filter = Control.MOUSE_FILTER_IGNORE
		screen.add_child(tr)
		if not open:
			tr.modulate = Color(0.55, 0.52, 0.5)
			var ch := TextureRect.new()
			ch.texture = load("res://assets/art/hub/door_chains.png")
			ch.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
			ch.position = pos
			ch.size = Vector2(150, 225)
			ch.mouse_filter = Control.MOUSE_FILTER_IGNORE
			screen.add_child(ch)
		var w: Dictionary = Data.WORLDS[wk]
		var nm := _lbl("%s · %s" % [ROMAN[i], w.name.replace("The ", "")], pos + Vector2(-10, 226), Vector2(170, 22), 14, UiStyle.font_sc, UiStyle.GOLD if Run.meta.cleared.has(wk) else UiStyle.CREAM)
		nm.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		var prev := Run.prev_on_road(wk)
		var tip := "%s\nAct %s · %s\n%s + %s · %s" % [w.name, ROMAN[int(w.act) - 1], w.act_name, w.pair[0].capitalize(), w.pair[1].capitalize(), w.conjunction]
		if not open:
			tip += "\nSealed. Clear %s to open it." % Data.WORLDS[prev].name
		var hit := _btn("", pos, Vector2(150, 225), func(): _pick_door(wk), null, tip)
		hit.flat = true
	# the chosen door
	var w: Dictionary = Data.WORLDS[hub_world]
	var info := _panel(Vector2(112, 668), Vector2(860, 300))
	_lbl(w.name, Vector2(136, 680), Vector2(800, 40), 32, UiStyle.font_bl, UiStyle.RED_D)
	_lbl("Door %s · Act %s, %s · %s + %s · %s%s" % [ROMAN[int(w.story)], ROMAN[int(w.act) - 1], w.act_name, w.pair[0].capitalize(), w.pair[1].capitalize(), w.conjunction, "  ·  cleared" if Run.meta.cleared.has(hub_world) else ""], Vector2(136, 722), Vector2(812, 26), 16, UiStyle.font_sc, UiStyle.BROWN)
	_lbl(w.blurb, Vector2(136, 750), Vector2(812, 48), 17, UiStyle.font_it)
	_rich("[color=#7a2a1a]The road: [/color][i]%s[/i]" % w.lead, Vector2(136, 798), Vector2(812, 48), 15)
	var names := []
	for k in w.foes + w.elites:
		names.append(Data.ENEMIES[k].name)
	var bosses := []
	for k in w.bosses:
		bosses.append(Data.ENEMIES[k].name)
	_rich("[i]Within: " + ", ".join(names) + ".[/i]", Vector2(136, 848), Vector2(812, 50), 14)
	_lbl(("Rulers: " if bosses.size() > 1 else "Ruler: ") + ", ".join(bosses) + ".", Vector2(136, 900), Vector2(812, 30), 16, UiStyle.font_sc, UiStyle.RED_D)
	_lbl("Ostia %d  ·  doors open %d of 15  ·  worlds cleared %d" % [Run.meta.ostia, 15 if road_open else Run.meta.doors.size(), Run.meta.cleared.size()], Vector2(136, 934), Vector2(812, 26), 16, UiStyle.font_sc, UiStyle.GOLD_D)
	var go := _btn("Prepare the expedition", Vector2(1010, 668), Vector2(310, 70), show_prepare)
	go.add_theme_font_size_override("font_size", 24)
	var lots := _btn("Cast lots", Vector2(1330, 668), Vector2(160, 70), _cast_lots, null,
		"Choose a random door." if road_open else "Clear all fifteen worlds to cast lots for a random door.")
	lots.disabled = not road_open
	var cont := _btn("Continue the descent", Vector2(1010, 748), Vector2(480, 50), _continue_run)
	cont.disabled = not Run.has_save()
	if OS.is_debug_build():
		_btn("Practice a single room", Vector2(1010, 808), Vector2(235, 46), _practice, null, "Development builds only.")
		_btn("Settings", Vector2(1255, 808), Vector2(235, 46), func(): SettingsPanel.open(screen))
	else:
		_btn("Settings", Vector2(1010, 808), Vector2(480, 46), func(): SettingsPanel.open(screen))
	_btn("Back to the garth", Vector2(1010, 864), Vector2(480, 44), func(): main._show_menu())
	_btn("Debug: unlock all %s" % ("on" if Run.playtest_all() else "off"), Vector2(1010, 916), Vector2(480, 40), _toggle_playtest, null,
		"Debug mode: every calling unlocked and every world's door open. Saved with your settings; turn it off to play the unlocks normally. Your real progress is untouched.")
	_toast(msg)
	msg = ""

func _practice() -> void:
	visible = false
	main._show_practice()

func _pick_door(wk: String) -> void:
	if not Run.door_open(wk):
		_toast("Sealed. Clear %s to open it." % Data.WORLDS[Run.prev_on_road(wk)].name)
		return
	hub_world = wk
	show_hub()

## Cast Lots: once the road is walked, a random door (never the last world played), straight to preparation.
func _cast_lots() -> void:
	if not Run.all_cleared():
		return
	hub_world = Run.cast_lots()
	msg = "The lots fall on %s." % Data.WORLDS[hub_world].name
	show_prepare()

func show_prepare() -> void:
	Run.meta_load()
	var w: Dictionary = Data.WORLDS[hub_world]
	var room: String = w.rooms[1]
	var bgp := "res://assets/art/rooms/%s_far.webp" % room
	if not ResourceLoader.exists(bgp):
		bgp = "res://assets/art/rooms/%s_far.png" % room
	_screen("", "", bgp)
	# the writ: one sheet of parchment laid over the world's own backdrop
	var shade := ColorRect.new()
	shade.color = Color(0.08, 0.05, 0.03, 0.55)
	shade.size = size
	screen.add_child(shade)
	_tex("res://assets/art/map/sheet.png", Vector2(46, 22), Vector2(1508, 940))
	# header cartouche: the world, its door and its two courses
	_tex("res://assets/art/map/cartouche.png", Vector2(470, 40), Vector2(660, 94))
	var t := _lbl(w.name, Vector2(470, 50), Vector2(660, 70), 40, UiStyle.font_bl, UiStyle.RED_D)
	t.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	t.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	var sub := _lbl("Door %s  ·  %s  ·  %s and %s, the %s" % [ROMAN[int(w.story)], w.act_name, String(w.pair[0]).capitalize(), String(w.pair[1]).capitalize(), w.conjunction],
		Vector2(300, 136), Vector2(1000, 26), 17, UiStyle.font_it, UiStyle.BROWN)
	sub.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	var cols := [[110, 440, "The Prior's Commission"], [596, 452, "The Company"], [1094, 400, "Vows and Provisions"]]
	for c in cols:
		_lbl(c[2], Vector2(c[0], 178), Vector2(c[1], 30), 22, UiStyle.font_sc, UiStyle.INK)
		_rule(Vector2(c[0], 210), c[1], 1)
	_rule(Vector2(573, 186), 690, 1, true)
	_rule(Vector2(1071, 186), 690, 1, true)
	# --- the commission: which ruler the Prior sends the company after
	var coms: Array = Data.COMMISSIONS.get(hub_world, [])
	if not coms.is_empty():
		var known := false
		for c in coms:
			if c.ruler == hub_commission:
				known = true
		if not known:
			hub_commission = coms[0].ruler
		var chosen: Dictionary = coms[0]
		for ci in coms.size():
			var c: Dictionary = coms[ci]
			var on: bool = c.ruler == hub_commission
			if on:
				chosen = c
			var y := 226 + ci * 98
			var b := _btn("", Vector2(110, y), Vector2(440, 88), func(): hub_commission = c.ruler; show_prepare(), null, c.text)
			if on:
				b.add_theme_stylebox_override("normal", UiStyle.tex_box("slip_sel"))
				b.add_theme_stylebox_override("hover", UiStyle.tex_box("slip_sel"))
			_ruler_thumb(c.ruler, Vector2(118, y + 6), Vector2(84, 76))
			_lbl(c.name, Vector2(212, y + 14), Vector2(260, 30), 21, UiStyle.font_sc, UiStyle.RED_D if on else UiStyle.INK)
			_lbl("Rank %s of the world's rulers" % ROMAN[ci], Vector2(212, y + 46), Vector2(260, 24), 15, UiStyle.font_it, UiStyle.BROWN)
			if on:
				_tex("res://assets/art/ui/seal.png", Vector2(480, y + 12), Vector2(62, 62))
		# the writ itself, quoted under the choices
		var qy := 226 + coms.size() * 98 + 14
		var q := _panel(Vector2(110, qy), Vector2(440, 860 - qy))
		q.add_theme_stylebox_override("panel", UiStyle.box(UiStyle.PARCH_L, UiStyle.INK, 1))
		var fig := "res://assets/art/rigs_li/%s/full.webp" % chosen.ruler
		if ResourceLoader.exists(fig) and 860 - qy > 220:
			var ft := _tex(fig, Vector2(260, qy + 96), Vector2(286, 860 - qy - 100))
			ft.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
			ft.modulate = Color(1, 1, 1, 0.42)
		_lbl("The writ", Vector2(128, qy + 12), Vector2(400, 24), 16, UiStyle.font_sc, UiStyle.BROWN)
		_lbl("\u201c%s\u201d" % chosen.text, Vector2(128, qy + 42), Vector2(404, 860 - qy - 54), 18, UiStyle.font_it, UiStyle.INK)
		hub_obj = "boss"
	else:
		var i := 0
		for k in Run.C.objectives:
			var o: Dictionary = Run.C.objectives[k]
			var b := _btn(o.name, Vector2(110, 226 + i * 62), Vector2(440, 52), func(): hub_obj = k; show_prepare(), null, o.text)
			if k == hub_obj:
				b.add_theme_stylebox_override("normal", UiStyle.box(UiStyle.HI, UiStyle.RED, 3))
			i += 1
		_lbl(Run.C.objectives[hub_obj].text, Vector2(110, 240 + i * 62), Vector2(440, 120), 17, UiStyle.font_it)
	# --- the company: oval portraits, name, calling, the reason they walk, stress and wounds
	var party := Abbey.party_heroes()
	_lbl("%d of %d" % [party.size(), int(Abbey.A.party_max)], Vector2(900, 182), Vector2(148, 26), 17, UiStyle.font_it, UiStyle.BROWN).horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	for j in int(Abbey.A.party_max):
		var x := 596 + (j % 2) * 230
		var y := 226 + int(j / 2) * 322
		if j >= party.size():
			var e := _panel(Vector2(x, y), Vector2(222, 310))
			e.add_theme_stylebox_override("panel", UiStyle.box(Color(0, 0, 0, 0), UiStyle.PARCH_D, 1))
			_lbl("An empty place in the line", Vector2(x + 10, y + 140), Vector2(202, 40), 15, UiStyle.font_it, UiStyle.DISABLED_INK).horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
			continue
		var h: Dictionary = party[j]
		_tex("res://assets/art/ui/portraits/%s_oval.png" % h.key, Vector2(x + 46, y), Vector2(130, 156))
		var nm := _lbl(h.name, Vector2(x, y + 160), Vector2(222, 30), 19, UiStyle.font_sc, UiStyle.INK)
		nm.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		var cl := _lbl("%s \u00b7 level %d" % [Data.HEROES[h.key].name, int(h.level)], Vector2(x, y + 190), Vector2(222, 24), 15, UiStyle.font_it, UiStyle.BROWN)
		cl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		var rs := _lbl("walks for %s" % String(h.reason).to_lower(), Vector2(x, y + 212), Vector2(222, 24), 15, UiStyle.font_it, UiStyle.BROWN)
		rs.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		_icon_count("s_stress", "Stress %d" % int(h.stress), Vector2(x + 30, y + 244), UiStyle.RED_D)
		var inj: Array = h.get("injuries", [])
		if inj.is_empty():
			_lbl("unhurt", Vector2(x + 126, y + 246), Vector2(90, 24), 15, UiStyle.font_it, UiStyle.GREEN)
		else:
			_icon_count("broken_ribs", "%d wound%s" % [inj.size(), "" if inj.size() == 1 else "s"], Vector2(x + 120, y + 244), UiStyle.RED_D)
	if party.size() < int(Abbey.A.party_min):
		_lbl("Too few. Choose the company at the cross in the garth.", Vector2(596, 870), Vector2(452, 30), 16, UiStyle.font_it, UiStyle.RED_D).horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	# --- vows and provisions
	var vows: Array = Run.meta.vows.filter(func(v): return Abbey._vow_index(v) < Run.asc_max())
	var vy := 226
	var any := false
	for a in Run.C.ascension:
		if vows.has(a.id):
			any = true
			_tex("res://assets/art/ui/seal.png", Vector2(1094, vy + 2), Vector2(26, 26))
			var vl := _lbl("%s. %s" % [a.name, a.text], Vector2(1128, vy), Vector2(366, 60), 15, UiStyle.font_it, UiStyle.INK)
			vy += max(34, int(vl.get_minimum_size().y) + 8)
	if not any:
		_lbl("No vows sworn. The descent is taken at its plainest.", Vector2(1094, vy), Vector2(400, 50), 16, UiStyle.font_it, UiStyle.BROWN)
		vy += 56
	var p: Dictionary = Run.meta.provisions
	var py: int = max(vy + 14, 400)
	_lbl("Carried down", Vector2(1094, py), Vector2(400, 26), 17, UiStyle.font_sc, UiStyle.BROWN)
	var items := [["fl_heal", max(1, p.belt.size()), "flask"], ["rl_reliquary", Run.meta.carried.size(), "relic"], ["food", int(p.food), "bread"],
		["light", int(p.light), "candles"], ["medicine", int(p.medicine), "tinctures"], ["tools", int(p.tools), "tools"]]
	for k in items.size():
		var it: Array = items[k]
		var ix := 1094 + (k % 3) * 134
		var iy := py + 32 + int(k / 3) * 74
		_tex("res://assets/art/icons/%s.png" % it[0], Vector2(ix, iy), Vector2(50, 50))
		_lbl("%d" % int(it[1]), Vector2(ix + 54, iy + 2), Vector2(70, 26), 20, UiStyle.font_sc, UiStyle.INK)
		_lbl(it[2], Vector2(ix + 54, iy + 26), Vector2(80, 22), 14, UiStyle.font_it, UiStyle.BROWN)
	var go := _btn("Descend", Vector2(1094, 700), Vector2(400, 74), _begin_run)
	go.add_theme_font_size_override("font_size", 32)
	UiStyle.red_button(go)
	go.disabled = party.size() < int(Abbey.A.party_min)
	_tex("res://assets/art/ui/seal.png", Vector2(1062, 698), Vector2(76, 76))
	_btn("Back to the doors", Vector2(1094, 790), Vector2(196, 44), show_hub)
	_btn("Back to the garth", Vector2(1298, 790), Vector2(196, 44), func(): main._show_menu())
	_toast(msg)
	msg = ""

## The writ layout shared by the commission, victory and spoils screens: the world's backdrop shaded, one parchment
## sheet, a cartouche with the title in blackletter, an italic line beneath. Returns nothing; draw on `screen`.
func _writ(title: String, sub: String, world := "", ink := "") -> void:
	var wk: String = world if world != "" else String(Run.r.get("world", hub_world)) if not Run.r.is_empty() else hub_world
	var room: String = Data.WORLDS[wk].rooms[1]
	var bgp := "res://assets/art/rooms/%s_far.webp" % room
	if not ResourceLoader.exists(bgp):
		bgp = "res://assets/art/rooms/%s_far.png" % room
	_screen("", "", bgp, true)
	var shade := ColorRect.new()
	shade.color = Color(0.08, 0.05, 0.03, 0.42)
	shade.size = size
	screen.add_child(shade)
	if title == "":
		return   # untitled run screens (the map) bring their own sheet
	_tex("res://assets/art/map/sheet.png", Vector2(46, 22), Vector2(1508, 940))
	_tex("res://assets/art/map/cartouche.png", Vector2(470, 40), Vector2(660, 94))
	if ink != "":
		for x in [370, 1140]:
			var em := _tex("res://assets/art/map/ink_%s.png" % ink, Vector2(x, 42), Vector2(90, 90))
			em.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
			em.modulate = Color(1, 1, 1, 0.85)
	var t := _lbl(title, Vector2(470, 50), Vector2(660, 70), 40, UiStyle.font_bl, UiStyle.RED_D)
	t.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	t.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	if sub != "":
		var sl := _lbl(sub, Vector2(240, 136), Vector2(1120, 26), 17, UiStyle.font_it, UiStyle.BROWN)
		sl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER

## A counter with its icon, for gold, food and the like: icon then value, in small caps.
func _counter(icon_id: String, text: String, pos: Vector2, fs := 22) -> void:
	screen.add_child(UiStyle.icon_rect(icon_id, pos, fs + 18))
	_lbl(text, pos + Vector2(fs + 24, 4), Vector2(220, fs + 12), fs, UiStyle.font_sc, UiStyle.INK)

## A section heading on the sheet: small caps with a hairline rule running to the right.
func _section(text: String, pos: Vector2, w: float) -> void:
	_lbl(text, pos, Vector2(w, 26), 19, UiStyle.font_sc, UiStyle.RED_D)
	_rule(pos + Vector2(0, 30), w, 1)

## A hero's oval portrait with name beneath; darkened if dead.
func _oval(h: Dictionary, pos: Vector2, w: float, with_name := true) -> void:
	var por := _tex("res://assets/art/ui/portraits/%s_oval.png" % h.key, pos, Vector2(w, w * 1.2))
	if h.get("dead", false):
		por.modulate = Color(0.45, 0.4, 0.38, 1.0)
	if with_name:
		var nm := _lbl(h.name, pos + Vector2(-40, w * 1.2 + 2), Vector2(w + 80, 26), 17, UiStyle.font_sc, UiStyle.INK)
		nm.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER

## The big red lacquer button that moves the run on.
func _go(text: String, pos: Vector2, sz: Vector2, cb: Callable) -> Button:
	var b := _btn(text, pos, sz, cb)
	b.add_theme_font_size_override("font_size", 24)
	UiStyle.red_button(b)
	return b

## A textured bar (HP, stress) with its value written over it.
func _tbar(pos: Vector2, w: float, frac: float, fill: String, text: String) -> void:
	const BH := 26.0
	_tex("res://assets/art/ui/tex/bar_track.png", pos, Vector2(w, BH))
	if frac > 0.0:
		var f := _tex("res://assets/art/ui/tex/%s.png" % fill, pos, Vector2(w * clamp(frac, 0.0, 1.0), BH))
		f.stretch_mode = TextureRect.STRETCH_SCALE
	_rule(Vector2(pos.x, pos.y), w, 1.5)
	_rule(Vector2(pos.x, pos.y + BH - 1.5), w, 1.5)
	_rule(Vector2(pos.x, pos.y), BH, 1.5, true)
	_rule(Vector2(pos.x + w - 1.5, pos.y), BH, 1.5, true)
	var l := _lbl(text, pos + Vector2(0, 1), Vector2(w, BH), 17, UiStyle.font_sc, UiStyle.HI)
	l.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	l.add_theme_color_override("font_outline_color", UiStyle.INK)
	l.add_theme_constant_override("outline_size", 4)

## A texture laid on the current screen, scaled to the box.
func _tex(path: String, pos: Vector2, sz: Vector2) -> TextureRect:
	var tr := TextureRect.new()
	tr.texture = load(path) if ResourceLoader.exists(path) else null
	tr.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	tr.stretch_mode = TextureRect.STRETCH_SCALE
	tr.position = pos
	tr.size = sz
	tr.mouse_filter = Control.MOUSE_FILTER_IGNORE
	screen.add_child(tr)
	return tr

## A thin ink rule, horizontal or vertical.
func _rule(pos: Vector2, length: float, thick: float, vertical := false) -> void:
	var r := ColorRect.new()
	r.color = Color(UiStyle.INK, 0.55)
	r.position = pos
	r.size = Vector2(thick, length) if vertical else Vector2(length, thick)
	r.mouse_filter = Control.MOUSE_FILTER_IGNORE
	screen.add_child(r)

## A small status icon with its count beside it.
func _icon_count(icon: String, text: String, pos: Vector2, col: Color) -> void:
	_tex("res://assets/art/icons/%s.png" % icon, pos, Vector2(24, 24))
	_lbl(text, pos + Vector2(28, 0), Vector2(90, 24), 15, UiStyle.font_it, col)

## The ruler's own figure, head and shoulders, as a small engraving beside its commission.
func _ruler_thumb(key: String, pos: Vector2, sz: Vector2) -> void:
	var path := "res://assets/art/rigs_li/%s/full.webp" % key
	if not ResourceLoader.exists(path):
		return
	var tex: Texture2D = load(path)
	var at := AtlasTexture.new()
	at.atlas = tex
	at.region = Rect2(tex.get_width() * 0.12, tex.get_height() * 0.08, tex.get_width() * 0.76, tex.get_height() * 0.62)
	var tr := TextureRect.new()
	tr.texture = at
	tr.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	tr.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	tr.position = pos
	tr.size = sz
	tr.mouse_filter = Control.MOUSE_FILTER_IGNORE
	screen.add_child(tr)

func _asc_toggle(mid: String, on: bool) -> void:
	if on and not hub_asc.has(mid):
		hub_asc.append(mid)
	elif not on:
		hub_asc.erase(mid)

func _toggle_hero(key: String) -> void:
	if not Run.class_unlocked(key):
		_toast("Unlock this class with ostia first.")
		return
	if hub_party.has(key):
		if hub_party.size() > 2:
			hub_party.erase(key)
	elif hub_party.size() < 4:
		hub_party.append(key)
	var ordered := []
	for k in Data.CLASS_ORDER:
		if hub_party.has(k):
			ordered.append(k)
	hub_party = ordered
	show_prepare()

func _toggle_playtest() -> void:
	UiStyle.settings["playtest_all"] = not Run.playtest_all()
	UiStyle.save_settings()
	show_hub()

func _begin_run() -> void:
	var err := Abbey.start_descent(hub_obj, hub_world, int(Time.get_unix_time_from_system()) % 1000000)
	if err != "":
		_toast(err)
		return
	if not Data.COMMISSIONS.get(hub_world, []).is_empty():
		Run.r.commission = hub_commission
		Run.save()
	show_map()

func _continue_run() -> void:
	if not Run.load_run():
		_toast("The save could not be read.")
		return
	if Run.r.get("resolving", "") != "":
		_enter(Run.node(Run.r.resolving))
	else:
		show_map()

# ================================================================== map
func _header(parent: Control, at := Vector2(60, 20)) -> void:
	var r := Run.r
	var sup: Dictionary = r.supplies
	var obj: Dictionary = Run.C.objectives[r.objective]
	var extra := ""
	match r.objective:
		"purge": extra = " · %d of 7 fights" % r.fights_won
		"relic": extra = " · Pearl %s" % ("taken" if r.has_pearl else "not yet found")
		"escort": extra = " · pilgrim heart %d" % r.pilgrim
	var I := func(k: String) -> String: return UiStyle.icon_tag(k, 26)
	_rich("[b]%s[/b] · %s%s\n%s gold [b]%d[/b]   %s food [b]%d[/b]   %s light [b]%d[/b]   %s medicine [b]%d[/b]   %s tools [b]%d[/b]   ·   doom [b]%d[/b] (level %d)%s" %
		[("Commission: " + Data.ENEMIES[r.commission].name) if String(r.get("commission", "")) != "" and Data.ENEMIES.has(r.commission) else obj.name, Run.world_name(), extra, I.call("gold"), r.gold, I.call("food"), sup.food, I.call("light"), sup.light, I.call("medicine"), sup.medicine, I.call("tools"), sup.tools, r.doom, Run.doom_level(), "   ·   [color=#9c3d2b]darkness: foes +1 Might[/color]" if sup.light <= 0 else ""],
		at, Vector2(1100, 60), 17, parent)
	var rl := []
	for id in r.relics:
		rl.append(UiStyle.icon_tag(id, 24) + " " + Run.C.relics[id].name)
	_rich("[i]relics (%d/%d):[/i] %s" % [r.relics.size(), Run.relic_cap(), ", ".join(rl) if rl.size() > 0 else "none"], at + Vector2(0, 52), Vector2(1100, 26), 15, parent)

const MAP_INK := Color("2b1d12")
const MAP_RUB := Color("9c3d2b")
const LEGEND := [["start", "Threshold"], ["combat", "Fight"], ["elite", "Elite"], ["event", "Event"], ["merchant", "Merchant"], ["shrine", "Shrine"],
	["camp", "Field camp"], ["hidden", "Cache"], ["waypoint", "Waypoint"], ["boss", "The ruler"], ["unknown", "Unscouted"]]

func _ink(id: String) -> Texture2D:
	var p := "res://assets/art/map/ink_%s.png" % id
	return load(p) if ResourceLoader.exists(p) else null

## A road drawn by hand: a gentle bow between two rooms, a little tremor in the pen, stopping short of each icon.
func _road(a: Vector2, b: Vector2, seed_s: String) -> PackedVector2Array:
	var rng := RandomNumberGenerator.new()
	rng.seed = hash(seed_s)
	var d := b - a
	var nrm := Vector2(-d.y, d.x).normalized()
	var c := (a + b) / 2 + nrm * rng.randf_range(-0.12, 0.12) * d.length()
	var pts := PackedVector2Array()
	var t0 := 34.0 / d.length()
	var steps := 22
	for i in steps + 1:
		var t: float = lerp(t0, 1.0 - t0, float(i) / steps)
		var q: Vector2 = a.lerp(c, t).lerp(c.lerp(b, t), t)
		pts.append(q + Vector2(rng.randf_range(-1.1, 1.1), rng.randf_range(-1.1, 1.1)))
	return pts

func _dashes(cv: Control, pts: PackedVector2Array, col: Color, w: float, on: float, off: float) -> void:
	var acc := 0.0
	var drawing := true
	for i in pts.size() - 1:
		var p: Vector2 = pts[i]
		var q: Vector2 = pts[i + 1]
		var seg := p.distance_to(q)
		var s0 := 0.0
		while s0 < seg:
			var left := (on if drawing else off) - acc
			var s1: float = min(seg, s0 + left)
			if drawing:
				cv.draw_line(p.lerp(q, s0 / seg), p.lerp(q, s1 / seg), col, w, true)
			acc += s1 - s0
			s0 = s1
			if acc >= (on if drawing else off) - 0.01:
				acc = 0.0
				drawing = not drawing

## The rubric ring a scribe draws round the rooms the company may enter next: a loop that overshoots its start.
func _ring(cv: Control, c: Vector2, r: float, col: Color, seed_s: String) -> void:
	var rng := RandomNumberGenerator.new()
	rng.seed = hash(seed_s)
	var a0 := rng.randf() * TAU
	var ph := rng.randf() * TAU
	var pts := PackedVector2Array()
	for i in 49:
		var a := a0 + float(i) / 48.0 * TAU * 1.12
		var rr := r + sin(a * 3.0 + ph) * 2.2 + float(i) / 48.0 * 3.0
		pts.append(c + Vector2(cos(a), sin(a) * 0.92) * rr)
	cv.draw_polyline(pts, col, 3.0, true)

## Paints a figure in the chart's two inks, so a ruler drawn in colour sits on the sheet as an engraving would.
func _sepia() -> ShaderMaterial:
	var sh := Shader.new()
	sh.code = """shader_type canvas_item;
void fragment() {
	vec4 c = texture(TEXTURE, UV);
	float g = dot(c.rgb, vec3(0.3, 0.59, 0.11));
	vec3 ink = vec3(0.17, 0.11, 0.07);
	vec3 wash = vec3(0.72, 0.6, 0.45);
	COLOR = vec4(mix(ink, wash, smoothstep(0.05, 0.75, g)), c.a);
}"""
	var m := ShaderMaterial.new()
	m.shader = sh
	return m

func show_map() -> void:
	if Run.r.outcome != "":
		show_end()
		return
	if not Run.r.pending.is_empty():
		show_reward()
		return
	_screen()
	var top := _panel(Vector2(16, 8), Vector2(1568, 92))
	top.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_header(screen)
	_btn("The company", Vector2(1180, 16), Vector2(170, 40), show_roster)
	_btn("Scout (1 light)", Vector2(1360, 16), Vector2(200, 40), func(): _toast("" if Run.scout() else "No light left."); show_map())
	_btn("Save and leave", Vector2(1360, 60), Vector2(200, 32), func(): Run.save(); main._show_menu())
	# the chart: one sheet of the kingdom, inked as the company walks it
	var chart := Control.new()
	chart.size = size
	chart.mouse_filter = Control.MOUSE_FILTER_IGNORE
	if UiStyle.dark:
		chart.modulate = Color(0.8, 0.76, 0.7)
	screen.add_child(chart)
	var sheet := TextureRect.new()
	sheet.texture = load("res://assets/art/map/sheet.png")
	sheet.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	sheet.position = Vector2(20, 104)
	sheet.size = Vector2(1560, 812)
	sheet.mouse_filter = Control.MOUSE_FILTER_IGNORE
	chart.add_child(sheet)
	var cart := TextureRect.new()
	cart.texture = load("res://assets/art/map/cartouche.png")
	cart.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	cart.position = Vector2(540, 120)
	cart.size = Vector2(520, 74)
	cart.mouse_filter = Control.MOUSE_FILTER_IGNORE
	chart.add_child(cart)
	var ttl := _lbl(Run.world_name(), Vector2(560, 128), Vector2(480, 56), 34, UiStyle.font_bl, MAP_RUB, chart)
	ttl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	ttl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	ttl.autowrap_mode = TextServer.AUTOWRAP_OFF
	var rose := TextureRect.new()
	rose.texture = _ink("compass")
	rose.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	rose.position = Vector2(52, 734)
	rose.size = Vector2(106, 106)
	rose.mouse_filter = Control.MOUSE_FILTER_IGNORE
	rose.modulate = Color(1, 1, 1, 0.85)
	chart.add_child(rose)
	var nodes: Dictionary = Run.r.map.nodes
	var pos := func(n: Dictionary) -> Vector2: return Vector2(104 + n.layer * (1352.0 / (Run.LAYERS - 1)), 116 + n.x * 790)
	var nexts := Run.next_nodes()
	var roads := Control.new()
	roads.size = size
	roads.mouse_filter = Control.MOUSE_FILTER_IGNORE
	chart.add_child(roads)
	roads.draw.connect(func():
		for id in nodes:
			var n: Dictionary = nodes[id]
			var seen: bool = n.revealed or n.visited
			for l in n.links:
				var m: Dictionary = nodes[l]
				var pts := _road(pos.call(n), pos.call(m), String(id) + String(l))
				if n.visited and m.visited:
					roads.draw_polyline(pts, MAP_INK, 3.4, true)
				elif id == Run.r.at:
					_dashes(roads, pts, MAP_RUB, 3.0, 11.0, 7.0)
				elif seen and (m.revealed or m.visited):
					_dashes(roads, pts, Color(MAP_INK, 0.62), 2.0, 6.0, 7.0)
				else:
					_dashes(roads, pts, Color(MAP_INK, 0.28), 1.6, 3.0, 9.0)
		for id in nexts:
			_ring(roads, pos.call(nodes[id]), 38.0, MAP_RUB, String(id))
	)
	var ruler: String = String(Run.r.get("commission", ""))
	for id in nodes:
		var n: Dictionary = nodes[id]
		var info: Array = TYPE_INFO.get(n.type, ["?", "?", "6f5036"])
		var shown: bool = n.revealed or n.visited
		var c: Vector2 = pos.call(n)
		if shown and n.get("corrupted", false):
			var st := TextureRect.new()
			st.texture = _ink("stain")
			st.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
			st.size = Vector2(96, 96)
			st.position = c - st.size / 2
			st.mouse_filter = Control.MOUSE_FILTER_IGNORE
			chart.add_child(st)
		var big: bool = n.type in ["boss", "waypoint", "start"]
		var b := TextureButton.new()
		b.texture_normal = _ink(n.type if shown else "unknown")
		if b.texture_normal == null:
			b.texture_normal = _ink("unknown")
		b.ignore_texture_size = true
		b.stretch_mode = TextureButton.STRETCH_KEEP_ASPECT_CENTERED
		b.size = Vector2(86, 86) if big and shown else (Vector2(70, 70) if shown else Vector2(56, 56))
		b.position = c - b.size / 2
		b.pivot_offset = b.size / 2
		b.focus_mode = Control.FOCUS_NONE
		b.disabled = not nexts.has(id)
		if n.visited and id != Run.r.at:
			b.modulate = Color(1, 1, 1, 0.42)
		elif not shown:
			b.modulate = Color(1, 1, 1, 0.7)
		b.tooltip_text = (("The ruler: " + Data.ENEMIES[ruler].name) if n.type == "boss" and ruler != "" and Data.ENEMIES.has(ruler) else "") + ("%s%s%s" % [info[0] if not (n.type == "boss" and ruler != "") else "", " (the Pearl's keeper)" if n.get("keeper", false) else "", " · corrupted by the rising water" if n.get("corrupted", false) else ""]) if shown else "Unscouted"
		if not b.disabled:
			b.mouse_entered.connect(func(): b.scale = Vector2(1.14, 1.14))
			b.mouse_exited.connect(func(): b.scale = Vector2.ONE)
			b.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		var nid: String = id
		b.pressed.connect(func(): _enter(Run.move_to(nid)))
		chart.add_child(b)
		if shown and n.get("keeper", false):
			var pearl := _lbl("the Pearl", c + Vector2(-50, 34), Vector2(100, 22), 15, UiStyle.font_it, MAP_RUB, chart)
			pearl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		if n.type == "boss" and shown:
			# the commission's ruler waits at the end of the road, drawn standing beside the throne
			if ruler != "" and ResourceLoader.exists("res://assets/art/rigs_li/%s/full.webp" % ruler):
				var fig := TextureRect.new()
				fig.texture = load("res://assets/art/rigs_li/%s/full.webp" % ruler)
				fig.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
				fig.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
				fig.size = Vector2(130, 130)
				fig.position = c + Vector2(-65, -176)
				fig.mouse_filter = Control.MOUSE_FILTER_IGNORE
				fig.material = _sepia()
				chart.add_child(fig)
			var nm := _lbl(Data.ENEMIES[ruler].name if ruler != "" and Data.ENEMIES.has(ruler) else "The ruler", c + Vector2(-75, 42), Vector2(150, 44), 17, UiStyle.font_sc, MAP_RUB, chart)
			nm.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		if id == Run.r.at:
			var pen := TextureRect.new()
			pen.texture = _ink("pennant")
			pen.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
			pen.size = Vector2(54, 54)
			pen.position = c + Vector2(10, -66)
			pen.mouse_filter = Control.MOUSE_FILTER_IGNORE
			chart.add_child(pen)
	# the key, lettered along the foot of the sheet
	var lx := 230.0
	for it in LEGEND:
		var ic := TextureRect.new()
		ic.texture = _ink(it[0])
		ic.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		ic.size = Vector2(30, 30)
		ic.position = Vector2(lx, 852)
		ic.mouse_filter = Control.MOUSE_FILTER_IGNORE
		chart.add_child(ic)
		var t := _lbl(it[1], Vector2(lx + 32, 856), Vector2(110, 24), 16, UiStyle.font_sc, MAP_INK, chart)
		t.autowrap_mode = TextServer.AUTOWRAP_OFF
		lx += 34 + t.get_minimum_size().x + 26
	_lbl("Choose the next room (ringed in red). Each step costs food and advances the doom clock; light burns every second step. Scouting reveals three more columns.", Vector2(60, 928), Vector2(1480, 40), 16, UiStyle.font_it, UiStyle.BROWN).horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_toast(msg)
	msg = ""

# ================================================================== entering a node
func _enter(n: Dictionary) -> void:
	Run.r.resolving = n.id
	Run.save()
	match n.type:
		"combat", "elite", "boss":
			_fight(n)
		"event":
			show_event(n)
		"merchant":
			show_merchant()
		"shrine":
			show_shrine()
		"camp":
			show_field_camp()
		"waypoint":
			# Rules v2, rule 20: the waypoint is guarded; win the guardian fight, take a legendary, then make camp
			if not n.get("guarded", false) and Run.guardian_room() >= 0:
				n.tier = "guardian"
				n.room = Run.guardian_room()
				_fight(n)
			else:
				show_waypoint()
		"hidden":
			_done_node(Run.hidden_cache())
		_:
			_done_node("")

func _done_node(note: String) -> void:
	Run.r.resolving = ""
	Run.save()
	msg = note
	show_map()

func _fight(n: Dictionary) -> void:
	var idx := Run.room_for(n)
	n.room_name = Data.ENCOUNTERS[idx].name
	if not n.has("tier"):
		n.tier = Data.ENCOUNTERS[idx].tier
	visible = false
	var saved := Run.saved_fight()
	if not saved.is_empty() and int(saved.idx) == idx:
		main.resume_run_fight(saved)
		return
	Run.save()
	var setup := Run.combat_setup()
	if n.get("tier", "") == "guardian":
		setup.foe_hp = float(setup.foe_hp) * 1.1   # the guardian is an elite fight at 1.1x HP (Gate 3 calibration)
	main.start_run_fight(idx, setup, int(Run.r.seed) + Run.r.nodes_moved * 97)

func after_fight(s: Dictionary) -> void:
	# the fight is over: drop it from the save first, so its spoils can never be taken twice
	Run.clear_fight()
	var n := Run.node(Run.r.at)
	Run.r.belt = s.get("belt", [])
	var sum := Run.after_combat(s, n)
	Run.r.resolving = ""
	Run.save()
	var where: String = String(n.get("room_name", ""))
	_writ("Victory" if sum.won else "The Company Is Lost", ("%s  \u00b7  " % where if where != "" else "") + "layer %d" % (Run.current_layer() + 1))
	if sum.won and n.get("type", "") == "waypoint":
		n.guarded = true
		Run.r.pending.append({"kind": "waypoint"})   # the camp opens after the guardian's spoils
		Run.save()
	# what the room paid: gold and experience as inked tallies
	if sum.won:
		_tex("res://assets/art/icons/gold.png", Vector2(600, 180), Vector2(54, 54))
		_lbl("+%d gold" % sum.gold, Vector2(660, 190), Vector2(160, 36), 26, UiStyle.font_sc, UiStyle.INK)
		_tex("res://assets/art/icons/ostia.png", Vector2(830, 180), Vector2(54, 54))
		_lbl("+%d experience" % sum.xp, Vector2(890, 190), Vector2(220, 36), 26, UiStyle.font_sc, UiStyle.INK)
	_rule(Vector2(110, 256), 1380, 1)
	# the company as it stands after the room: portrait, HP, stress, and what changed
	var heroes: Array = Run.r.heroes
	var cols := heroes.size()
	var cw: float = 1380.0 / max(1, cols)
	var notes := {}
	for t in sum.levels + sum.injuries:
		for hi in heroes.size():
			if String(t).begins_with(String(heroes[hi].name)):
				notes[hi] = notes.get(hi, []) + [t]
	for hi in cols:
		var h: Dictionary = heroes[hi]
		var x := 110.0 + hi * cw
		var cx := x + cw / 2.0
		var dead: bool = h.get("dead", false)
		var por := _tex("res://assets/art/ui/portraits/%s_oval.png" % h.key, Vector2(cx - 100, 284), Vector2(200, 240))
		if dead:
			por.modulate = Color(0.45, 0.4, 0.38, 1.0)
		var nm := _lbl(h.name, Vector2(x, 534), Vector2(cw, 34), 26, UiStyle.font_sc, UiStyle.INK)
		nm.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		var cl := _lbl("%s \u00b7 level %d" % [Data.HEROES[h.key].name, int(h.level)], Vector2(x, 570), Vector2(cw, 24), 18, UiStyle.font_it, UiStyle.BROWN)
		cl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		if dead:
			var dl := _lbl("Fallen", Vector2(x, 606), Vector2(cw, 40), 32, UiStyle.font_bl, UiStyle.RED_D)
			dl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
			continue
		var bw: float = min(280.0, cw - 40.0)
		_tbar(Vector2(cx - bw / 2, 608), bw, float(h.hp) / Run.max_hp(h), "bar_red", "HP %d / %d" % [int(h.hp), Run.max_hp(h)])
		_tbar(Vector2(cx - bw / 2, 642), bw, float(h.stress) / 100.0, "bar_violet", "Stress %d" % int(h.stress))
		var ny := 682.0
		for t in notes.get(hi, []):
			var nl := _lbl(String(t).get_slice(": ", 1) if ": " in String(t) else String(t), Vector2(x + 10, ny), Vector2(cw - 20, 44), 19, UiStyle.font_it, UiStyle.RED_D)
			nl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
			ny += max(24.0, nl.get_minimum_size().y + 4)
	var go := _btn("Onward", Vector2(600, 828), Vector2(400, 70), show_map)
	go.add_theme_font_size_override("font_size", 30)
	UiStyle.red_button(go)

# ================================================================== events
func show_event(n: Dictionary) -> void:
	var e := Run.event_for(n)
	_writ(e.title, Run.world_name(), "", "event")
	_illumination(Vector2(200, 196), Vector2(1200, 300))
	var t := _lbl(e.text, Vector2(660, 216), Vector2(710, 260), 23, UiStyle.font_it)
	t.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	var y := 540
	for o in e.options:
		var ok := Run.option_ok(o)
		var b := _btn(o.label, Vector2(350, y), Vector2(900, 58), func(): _resolve_option(n, o))
		b.disabled = not ok
		b.add_theme_font_size_override("font_size", 20)
		y += 72

func _resolve_option(n: Dictionary, o: Dictionary) -> void:
	var res := Run.apply_option(o)
	_writ(Run.event_for(n).title, Run.world_name(), "", "event")
	_illumination(Vector2(200, 196), Vector2(1200, 300))
	var t := _lbl(res.text, Vector2(660, 216), Vector2(710, 260), 23, UiStyle.font_it)
	t.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	if not res.notes.is_empty():
		_lbl(" \u00b7 ".join(res.notes), Vector2(200, 540), Vector2(1200, 70), 21, UiStyle.font_sc, UiStyle.RED_D).horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	if res.get("fight", false):
		n.type = "combat"
		_go("Fight", Vector2(600, 660), Vector2(400, 70), func(): _fight(n))
	else:
		_go("Onward", Vector2(600, 660), Vector2(400, 70), func(): _done_node(""))

# ================================================================== merchant
func show_merchant() -> void:
	var st := Run.merchant_stock()
	_writ("The Merchant", "He trades in what %s gives back." % Run.world_name().replace("The ", "the "), "", "merchant")
	_counter("gold", str(Run.r.gold), Vector2(1260, 150))
	_section("Cards", Vector2(90, 178), 1420)
	var x := 90
	for c in st.cards:
		if c.get("sold", false):
			continue
		var h: Dictionary = Run.r.heroes[c.hero]
		if h.dead:
			continue
		var cc: Dictionary = c
		_card(c.card, Vector2(x, 218), 0.62, func(): _buy_card(cc))
		var pl := _lbl(h.name.split(" ")[0], Vector2(x - 4, 378), Vector2(124, 22), 15, UiStyle.font_it, UiStyle.BROWN)
		pl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		screen.add_child(UiStyle.icon_rect("gold", Vector2(x + 28, 400), 26))
		_lbl(str(c.price), Vector2(x + 58, 400), Vector2(60, 26), 18, UiStyle.font_sc, UiStyle.INK)
		x += 128
	_section("Wares", Vector2(90, 448), 700)
	var y := 490
	for g in st.gear:
		if g.get("sold", false):
			continue
		var gd: Dictionary = Run.C.gear[g.item.id]
		var gg: Dictionary = g
		_ibtn(g.item.id, "%s (%s, %s) \u00b7 %d gold" % [gd.name, gd.slot, gd.rarity, g.price], Vector2(90, y), Vector2(700, 46), func(): _buy_gear(gg), null, gd.text + ("\nClass: " + Data.HEROES[gd.cls].name if gd.cls != null else ""))
		y += 54
	if not st.relic.is_empty() and not st.relic.get("sold", false):
		var rl: Dictionary = Run.C.relics[st.relic.id]
		_ibtn(st.relic.id, "Relic: %s \u00b7 %d gold" % [rl.name, st.relic.price], Vector2(90, y), Vector2(700, 46), func(): _buy_relic(st.relic), null, rl.text)
		y += 54
	if not st.rune.get("sold", false):
		_ibtn(st.rune.id, "%s \u00b7 %d gold" % [Run.C.runes[st.rune.id].name, st.rune.price], Vector2(90, y), Vector2(700, 46), func(): _buy_rune(st.rune), null, Run.C.runes[st.rune.id].text)
		y += 54
	for f in st.flasks:
		if f.get("sold", false):
			continue
		var ff: Dictionary = f
		_ibtn(f.card, "Belt: %s \u00b7 %d gold" % [Data.CARDS[f.card].name, f.price], Vector2(90, y), Vector2(700, 46), func(): _buy_flask(ff), null, Data.CARDS[f.card].text)
		y += 54
	_section("Services", Vector2(850, 448), 660)
	var sy := 490
	for k in st.supplies:
		var kk: String = k
		_ibtn(k, "+1 %s \u00b7 %d gold" % [k, st.supplies[k]], Vector2(850, sy), Vector2(300, 46), func(): _buy_supply(kk, st.supplies[kk]))
		sy += 54
	# the right half of Services: deck work (strike, then one upgrade per hero)
	_btn("Strike a card \u00b7 %d gold" % Run.price(50), Vector2(1170, 490), Vector2(340, 46), func(): _pick_removal(Run.price(50), show_merchant))
	# Rules v2, rule 19: the merchant also upgrades a card for 60 gold
	var uy := 544
	for h in Run.living():
		var hh: Dictionary = h
		_btn("Upgrade: %s \u00b7 %d gold" % [h.name.split(" ")[0], Run.price(60)], Vector2(1170, uy), Vector2(340, 46), func():
			if Run.r.gold < Run.price(60):
				_toast("Not enough gold.")
				return
			_pick_upgrade(hh, show_merchant, Run.price(60)))
		uy += 54
	_go("Leave", Vector2(1290, 862), Vector2(220, 60), func(): _done_node(""))
	Run.save()

func _buy_rune(rn: Dictionary) -> void:
	if Run.spend(rn.price):
		Run.r.runes.append(rn.id)
		rn.sold = true
	else:
		_toast("Not enough gold.")
	show_merchant()

func _buy_supply(k: String, cost: int) -> void:
	if Run.spend(cost):
		Run.r.supplies[k] += 1
	else:
		_toast("Not enough gold.")
	show_merchant()

func _buy_card(c: Dictionary) -> void:
	if not Run.spend(c.price):
		_toast("Not enough gold.")
		return
	Run.r.heroes[c.hero].deck.append(c.card)
	c.sold = true
	show_merchant()

func _buy_gear(g: Dictionary) -> void:
	if not Run.spend(g.price):
		_toast("Not enough gold.")
		return
	var it: Dictionary = g.item.duplicate(true)
	it.paid_gold = int(g.price)
	Run.r.stash.append(it)
	g.sold = true
	msg = "Bought. Equip it from the company screen."
	show_merchant()

func _buy_relic(rl: Dictionary) -> void:
	if Run.r.relics.size() >= Run.relic_cap():
		_toast("You can carry no more relics.")
		return
	if not Run.spend(rl.price):
		_toast("Not enough gold.")
		return
	Run.r.relics.append(rl.id)
	rl.sold = true
	show_merchant()

func _buy_flask(f: Dictionary) -> void:
	if Run.r.belt.size() >= int(Run.r.belt_max):
		_toast("The belt is full.")
		return
	if not Run.spend(f.price):
		_toast("Not enough gold.")
		return
	Run.r.belt.append(f.card)
	f.sold = true
	show_merchant()

func _pick_removal(cost: int, back: Callable) -> void:
	_writ("Strike a Card", "Choose a card to remove from a deck (%d gold)." % cost)
	var y := 190
	for i in Run.r.heroes.size():
		var h: Dictionary = Run.r.heroes[i]
		if h.dead:
			continue
		_oval(h, Vector2(96, y), 74)
		var x := 220
		var seen := {}
		for cid in h.deck:
			if seen.has(cid):
				continue
			seen[cid] = true
			var hh: Dictionary = h
			var cc: String = cid
			_card(cid, Vector2(x, y - 4), 0.5, func(): _toast(Run.remove_card(hh, cc, cost)); back.call())
			x += 100
			if x > 1420:
				break
		y += 160
	_btn("Back", Vector2(1290, 870), Vector2(220, 52), back)

# ================================================================== shrine and camps
func show_shrine() -> void:
	_writ("A Shrine", "A font of black water before a saint with no face.", "", "shrine")
	_panel(Vector2(300, 190), Vector2(1000, 110))
	var t := _lbl("Something of %s has seeped into it." % Run.world_name().replace("The ", "the "), Vector2(330, 200), Vector2(940, 90), 22, UiStyle.font_it)
	t.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	t.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	_counter("gold", str(Run.r.gold), Vector2(1260, 150))
	var opts := [["Offer blood: the hardiest hero loses 6 max HP; receive a relic", "blood"], ["Gaze into the font: every hero gains 18 stress; receive gear", "fear"], ["Pray (%d gold): heal 10 and shed 10 stress" % Run.price(30), "prayer"]]
	var y := 350
	for o in opts:
		var k: String = o[1]
		var b := _btn(o[0], Vector2(300, y), Vector2(1000, 60), func(): _done_node(Run.shrine(k)))
		b.add_theme_font_size_override("font_size", 20)
		y += 74
	_go("Leave", Vector2(600, 620), Vector2(400, 66), func(): _done_node(""))

func show_field_camp() -> void:
	_writ("Field Camp", "Two food to make camp. Choose how the night is spent.", "", "camp")
	_counter("food", str(Run.r.supplies.food), Vector2(1260, 150))
	var x := 160
	for h in Run.living():
		_oval(h, Vector2(x, 200), 110)
		var bw := 150.0
		_tbar(Vector2(x - 20, 362), bw, float(h.hp) / Run.max_hp(h), "bar_red", "%d / %d" % [int(h.hp), Run.max_hp(h)])
		_tbar(Vector2(x - 20, 394), bw, float(h.stress) / 100.0, "bar_violet", "Stress %d" % int(h.stress))
		x += 340
	var opts := [["Tend wounds: heal 30% of max HP", "rest"], ["Talk through the night: shed 25 stress", "talk"]]
	var y := 470
	for o in opts:
		var k: String = o[1]
		var b := _btn(o[0], Vector2(450, y), Vector2(700, 60), func(): _done_node(Run.field_camp(k)))
		b.add_theme_font_size_override("font_size", 20)
		y += 74
	# Rules v2, rule 19: the company may instead hone its cards, one upgrade per hero
	var hb := _btn("Hone: each hero upgrades one card", Vector2(450, y), Vector2(700, 60), func():
		if Run.r.supplies.food < 2:
			_toast("Not enough food to make camp (2 needed).")
			return
		Run.r.supplies.food -= 2
		_upgrade_each(Run.living().duplicate(), func(): _done_node("The company hones its craft by the fire.")))
	hb.add_theme_font_size_override("font_size", 20)
	_go("Press on", Vector2(600, y + 100), Vector2(400, 66), func(): _done_node(""))

## One upgrade for each hero in turn, then `done`. A hero may pass.
func _upgrade_each(hs: Array, done: Callable) -> void:
	if hs.is_empty():
		done.call()
		return
	var h: Dictionary = hs.pop_front()
	_pick_upgrade(h, func(): _upgrade_each(hs, done))

## A picker of the hero's cards that can be upgraded; the chosen card becomes its upgraded version.
func _pick_upgrade(h: Dictionary, after: Callable, cost := 0) -> void:
	var seen := {}
	var ids := []
	for cid in h.deck:
		if not seen.has(cid) and not String(cid).ends_with("+") and Data.CARDS.has(String(cid) + "+"):
			seen[cid] = true
			ids.append(cid)
	_writ("Upgrade a Card", "%s: choose one card to upgrade, or pass. %d can be upgraded." % [h.name, ids.size()])
	_oval(h, Vector2(84, 196), 90)
	for i in ids.size():
		var cid: String = ids[i]
		var x := 230 + (i % 7) * 182
		var y := 196 + int(i / 7) * 232
		_card(cid, Vector2(x, y), 0.88, func():
			if cost > 0:
				if Run.r.gold < cost:
					_toast("Not enough gold.")
					return
				Run.r.gold -= cost   # paid only when a card is chosen
			var k: int = h.deck.find(cid)
			if k >= 0:
				h.deck[k] = cid + "+"
			Run.save()
			after.call())
	_btn("Pass", Vector2(1290, 870), Vector2(220, 52), after)

func show_waypoint() -> void:
	_writ("The Camp", "A dry chapter house the living still hold.", "", "waypoint")
	_counter("gold", str(Run.r.gold), Vector2(1180, 150))
	_counter("medicine", str(Run.r.supplies.medicine), Vector2(1360, 150))
	var y := 196
	for h in Run.living():
		var hh: Dictionary = h
		_panel(Vector2(80, y), Vector2(1440, 118))
		_oval(h, Vector2(96, y + 10), 82, false)
		_lbl(h.name, Vector2(194, y + 12), Vector2(330, 28), 22, UiStyle.font_sc, UiStyle.INK)
		_lbl("%s \u00b7 level %d" % [Data.HEROES[h.key].subclasses[h.subclass] if h.subclass != "" else Data.HEROES[h.key].name, h.level], Vector2(194, y + 42), Vector2(330, 24), 17, UiStyle.font_it, UiStyle.BROWN)
		_tbar(Vector2(194, y + 76), 170, float(h.hp) / Run.max_hp(h), "bar_red", "%d / %d" % [int(h.hp), Run.max_hp(h)])
		_tbar(Vector2(374, y + 76), 150, float(h.stress) / 100.0, "bar_violet", "Stress %d" % int(h.stress))
		if h.injuries.size() > 0:
			_lbl("Injured: " + ", ".join(h.injuries.map(func(k): return Run.C.injuries[k].name)), Vector2(540, y + 14), Vector2(270, 90), 16, UiStyle.font_it, UiStyle.RED_D)
		_btn("Infirmary: full heal \u00b7 %d gold" % Run.price(20), Vector2(820, y + 14), Vector2(330, 42), func(): _toast(Run.infirmary_heal(hh)); show_waypoint())
		_btn("Respite: -40 stress, lift Dread \u00b7 %d" % Run.price(15), Vector2(1160, y + 14), Vector2(345, 42), func(): _toast(Run.respite(hh)); show_waypoint())
		_btn("Treat injury \u00b7 %d gold" % Run.price(35), Vector2(820, y + 62), Vector2(330, 42), func(): _toast(Run.treat_injury(hh, false)); show_waypoint())
		_btn("Treat injury \u00b7 1 medicine", Vector2(1160, y + 62), Vector2(345, 42), func(): _toast(Run.treat_injury(hh, true)); show_waypoint())
		y += 130
	_btn("Forge: set runes", Vector2(80, 862), Vector2(260, 56), show_forge)
	_btn("Market", Vector2(352, 862), Vector2(220, 56), func(): show_merchant())
	_btn("Strike a card \u00b7 %d" % Run.price(50), Vector2(584, 862), Vector2(280, 56), func(): _pick_removal(Run.price(50), show_waypoint))
	_btn("The company", Vector2(876, 862), Vector2(220, 56), show_roster)
	_go("Leave the Camp", Vector2(1200, 856), Vector2(310, 66), func(): _done_node(""))

func show_forge() -> void:
	_writ("The Forge", "Set runes into gear sockets. A set rune stays for the run.", "", "forge")
	_section("Runes held", Vector2(90, 178), 1420)
	var rx := 90
	if Run.r.runes.is_empty():
		_lbl("None. Runes come from spoils and the Market.", Vector2(90, 218), Vector2(800, 30), 18, UiStyle.font_it, UiStyle.BROWN)
	for rn in Run.r.runes:
		screen.add_child(UiStyle.icon_rect(rn, Vector2(rx, 214), 40))
		_lbl(Run.C.runes[rn].name, Vector2(rx + 46, 222), Vector2(210, 28), 17, UiStyle.font_sc).tooltip_text = Run.C.runes[rn].text
		rx += 260
	var y := 290
	for h in Run.living():
		_panel(Vector2(80, y), Vector2(1440, 120))
		_oval(h, Vector2(96, y + 12), 80, false)
		_lbl(h.name, Vector2(190, y + 44), Vector2(170, 30), 20, UiStyle.font_sc)
		var x := 370
		var any := false
		for slot in Run.SLOTS:
			if not h.gear[slot].is_empty():
				any = true
		if not any:
			_lbl("No gear to set runes in. Gear comes from spoils and the Market.", Vector2(370, y + 44), Vector2(800, 30), 18, UiStyle.font_it, UiStyle.BROWN)
		for slot in Run.SLOTS:
			var it: Dictionary = h.gear[slot]
			if it.is_empty():
				continue
			var gd: Dictionary = Run.C.gear[it.id]
			screen.add_child(UiStyle.icon_rect(it.id, Vector2(x, y + 14), 44))
			var gl := _lbl("%s\nsockets %d / %d" % [gd.name, it.runes.size(), gd.sockets], Vector2(x + 50, y + 12), Vector2(230, 50), 15)
			gl.tooltip_text = gd.text
			gl.mouse_filter = Control.MOUSE_FILTER_PASS
			for rn in Run.r.runes.duplicate():
				if it.runes.size() >= gd.sockets:
					break
				var hh: Dictionary = h
				var sl: String = slot
				var rr: String = rn
				_btn("+ " + Run.C.runes[rn].name, Vector2(x, y + 70), Vector2(270, 38), func(): _toast(Run.socket_rune(hh, sl, rr)); show_forge())
				break
			x += 290
		y += 132
	_btn("Back", Vector2(1290, 870), Vector2(220, 52), show_waypoint)

# ================================================================== rewards queue
## Spoils: the hero in their oval frame on the left, the offered cards large and centred, Take nothing beneath.
func _spoils_pick(h: Dictionary, picks: Array, legendary: bool, take: Callable, skip: Callable) -> void:
	_writ("A Legend" if legendary else "Spoils", ("The guardian falls. One legendary card for %s, or none." if legendary else "One card into %s's deck, or none.") % h.name)
	_tex("res://assets/art/ui/portraits/%s_oval.png" % h.key, Vector2(115, 300), Vector2(200, 240))
	var nm := _lbl(h.name, Vector2(80, 552), Vector2(270, 34), 24, UiStyle.font_sc, UiStyle.INK)
	nm.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	var cl := _lbl("%s \u00b7 level %d" % [Data.HEROES[h.key].name, int(h.level)], Vector2(80, 590), Vector2(270, 24), 18, UiStyle.font_it, UiStyle.BROWN)
	cl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	var dk := _lbl("%d cards in the deck" % h.deck.size(), Vector2(80, 618), Vector2(270, 24), 18, UiStyle.font_it, UiStyle.BROWN)
	dk.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_rule(Vector2(370, 200), 680, 1, true)
	var sc := 1.75
	var cw: float = UiCard.W * sc
	var gap := 48.0
	var n := picks.size()
	var x0 := 390.0 + (1110.0 - (n * cw + (n - 1) * gap)) / 2.0
	for i in n:
		var cid: String = picks[i]
		var c: Dictionary = Data.CARDS[cid]
		var x := x0 + i * (cw + gap)
		var rar := String(c.get("rarity", "C"))
		var tag := _lbl({"C": "common", "U": "uncommon", "R": "rare", "L": "legendary"}.get(rar, ""), Vector2(x, 196), Vector2(cw, 26), 19, UiStyle.font_sc, UiStyle.RED_D if rar in ["R", "L"] else UiStyle.BROWN)
		tag.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		_card(cid, Vector2(x, 228), sc, func(): take.call(cid))
	var nb := _btn("Take nothing", Vector2(1110, 838), Vector2(300, 56), skip)
	nb.add_theme_font_size_override("font_size", 22)
	_lbl("Click a card to take it into the deck.", Vector2(400, 852), Vector2(600, 30), 19, UiStyle.font_it, UiStyle.BROWN)

## A slip with a framed painting of the current world on its left, for text that tells of a place.
func _illumination(pos: Vector2, sz: Vector2) -> void:
	_panel(pos, sz)
	var wk: String = String(Run.r.get("world", hub_world)) if not Run.r.is_empty() else hub_world
	var rooms: Array = Data.WORLDS[wk].rooms
	var room: String = rooms[(Run.r.get("at", 0) if not Run.r.is_empty() else 0) % rooms.size()] if typeof(Run.r.get("at", 0)) == TYPE_INT else rooms[0]
	var p := "res://assets/art/rooms/%s_far.webp" % room
	if not ResourceLoader.exists(p):
		p = "res://assets/art/rooms/%s_far.png" % room
	var ih := sz.y - 40
	var pic := _tex(p, pos + Vector2(20, 20), Vector2(ih * 1.4, ih))
	pic.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	pic.clip_contents = true
	var fr := ReferenceRect.new()
	fr.border_color = UiStyle.INK
	fr.border_width = 2.0
	fr.editor_only = false
	fr.position = pic.position
	fr.size = pic.size
	fr.mouse_filter = Control.MOUSE_FILTER_IGNORE
	screen.add_child(fr)

## A reward shown as an object: its icon large on a parchment slip, the name beneath, then what it does.
func _reward_icon(icon_id: String, name: String, text: String) -> void:
	_panel(Vector2(670, 210), Vector2(260, 260))
	screen.add_child(UiStyle.icon_rect(icon_id, Vector2(705, 245), 190))
	var nl := _lbl(name, Vector2(300, 490), Vector2(1000, 44), 34, UiStyle.font_sc, UiStyle.INK)
	nl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	var tl := _lbl(text, Vector2(350, 540), Vector2(900, 110), 22, UiStyle.font_it, UiStyle.BROWN)
	tl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER

func show_reward() -> void:
	var p: Dictionary = Run.r.pending[0]
	var next := func():
		Run.r.pending.pop_front()
		Run.save()
		show_map()
	match p.kind:
		"card":
			var h: Dictionary = Run.r.heroes[p.hero]
			if h.dead:
				next.call()
				return
			var picks := Run.card_choices(h)
			_spoils_pick(h, picks, false, func(cid): h.deck.append(cid); next.call(), next)
		"waypoint":
			Run.r.pending.pop_front()
			Run.save()
			show_waypoint()
		"legendary":
			var h: Dictionary = Run.r.heroes[p.hero]
			if h.dead:
				next.call()
				return
			var picks := Run.legendary_choices(h)
			_spoils_pick(h, picks, true, func(cid): h.deck.append(cid); next.call(), next)
		"relic":
			var rl := Run.relic_drop()
			if rl == "" or Run.r.relics.size() >= Run.relic_cap():
				next.call()
				return
			_writ("A Relic", "Found among the dead.")
			_reward_icon(rl, Run.C.relics[rl].name, Run.C.relics[rl].text)
			_go("Take it", Vector2(560, 700), Vector2(230, 62), func(): Run.r.relics.append(rl); next.call())
			_btn("Leave it", Vector2(810, 704), Vector2(230, 56), next)
		"gear":
			var it := Run.gear_drop()
			var gd: Dictionary = Run.C.gear[it.id]
			_writ("Gear", "%s \u00b7 %s" % [gd.slot.capitalize(), {"C": "common", "U": "uncommon", "R": "rare"}[gd.rarity]])
			_reward_icon(it.id, gd.name, gd.text + ("\nOnly the %s can use it." % Data.HEROES[gd.cls].name if gd.cls != null else "") + "\nSockets: %d" % gd.sockets)
			var who := []
			for h in Run.living():
				if gd.cls == null or gd.cls == h.key:
					who.append(h)
			var x := 800 - who.size() * 140
			for h in who:
				var hh: Dictionary = h
				_oval(h, Vector2(x + 95, 652), 90, false)
				_btn("Give to " + h.name.split(" ")[0], Vector2(x + 10, 766), Vector2(260, 50), func(): Run.r.stash.append(it); _toast(Run.equip(hh, it)); next.call())
				x += 280
			_btn("Into the pack", Vector2(1290, 870), Vector2(220, 52), func(): Run.r.stash.append(it); next.call())
		"rune":
			var rn: String = Run.pick(Run.C.runes.keys())
			Run.r.runes.append(rn)
			_writ("A Rune", "Set it at the Forge in the Camp.")
			_reward_icon(rn, Run.C.runes[rn].name, Run.C.runes[rn].text)
			_go("Onward", Vector2(600, 700), Vector2(400, 66), next)
		"subclass":
			var h: Dictionary = Run.r.heroes[p.hero]
			_writ("A Calling", "%s reaches level 4. The calling unlocks its cards in spoils and grants a passive that grows at levels 7 and 10." % h.name)
			var subs: Dictionary = Data.HEROES[h.key].subclasses
			var i := 0
			var x0 := 800 - subs.size() * 235
			for sk in subs:
				var x := x0 + i * 470
				_panel(Vector2(x, 210), Vector2(440, 600))
				_lbl(subs[sk], Vector2(x, 228), Vector2(440, 44), 30, UiStyle.font_bl, UiStyle.RED_D).horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
				var tx: Array = Run.C.subclass_text[sk]
				_rich("[b]Level 4:[/b] %s\n[b]Level 7:[/b] %s\n[b]Level 10:[/b] %s" % tx, Vector2(x + 24, 284), Vector2(392, 160), 16)
				var cards := []
				for cid in Data.CARDS:
					if Data.CARDS[cid].get("sub", "") == sk:
						cards.append(cid)
				for j in min(3, cards.size()):
					_card(cards[j], Vector2(x + 26 + j * 132, 456), 0.66)
				var key: String = sk
				_go("Become " + subs[sk], Vector2(x + 60, 732), Vector2(320, 60), func(): h.subclass = key; next.call())
				i += 1
		"talent":
			var h: Dictionary = Run.r.heroes[p.hero]
			_writ("Level %d" % p.level, "%s grows: +4 max HP, and one talent of three." % h.name)
			_oval(h, Vector2(700, 190), 200)
			var keys: Array = Run.C.talents.keys()
			var picks := []
			while picks.size() < 3:
				var k: String = Run.pick(keys)
				if not picks.has(k):
					picks.append(k)
			for i in 3:
				var k: String = picks[i]
				var t: Dictionary = Run.C.talents[k]
				var tb := _btn("%s\n%s" % [t.name, t.text], Vector2(170 + i * 430, 500), Vector2(400, 150), func():
					h.talents.append(k)
					if t.has("remove"):
						Run.r.pending.insert(1, {"kind": "remove", "hero": p.hero})
					next.call())
				tb.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
				tb.add_theme_font_size_override("font_size", 19)
		"remove":
			var h: Dictionary = Run.r.heroes[p.hero]
			_writ("Cull the Deck", "Remove one card from %s's deck." % h.name)
			_oval(h, Vector2(84, 196), 90)
			var x := 230
			var y := 196
			var seen := {}
			for cid in h.deck:
				if seen.has(cid):
					continue
				seen[cid] = true
				var cc: String = cid
				_card(cid, Vector2(x, y), 0.88, func(): h.deck.erase(cc); next.call())
				x += 182
				if x > 1350:
					x = 230
					y += 232
			_btn("Keep them all", Vector2(1290, 870), Vector2(220, 52), next)
		_:
			next.call()

# ================================================================== roster
func show_roster() -> void:
	_writ("The Company", "")
	_header(screen, Vector2(90, 132))
	var back := func(): (show_waypoint() if Run.node(Run.r.at).type == "waypoint" and Run.r.get("resolving", "") != "" else show_map())
	_btn("Back", Vector2(1330, 56), Vector2(180, 48), back)
	var y := 214
	for i in Run.r.heroes.size():
		var h: Dictionary = Run.r.heroes[i]
		_panel(Vector2(80, y), Vector2(1440, 156))
		_oval(h, Vector2(96, y + 12), 100, false)
		if h.dead:
			_lbl("%s \u00b7 dead" % h.name, Vector2(214, y + 14), Vector2(400, 30), 22, UiStyle.font_sc, UiStyle.RED_D)
			y += 164
			continue
		var st := Run.stats(h)
		var stl := []
		for k in st:
			if st[k] != 0 and k != "max_hp":
				stl.append("%s %+d" % [k.replace("_", " "), st[k]])
		var need: int = Run.C.xp_levels[min(9, int(h.level))] if h.level < 10 else 0
		_lbl(h.name, Vector2(214, y + 10), Vector2(420, 28), 21, UiStyle.font_sc, UiStyle.INK)
		_lbl("%s \u00b7 level %d \u00b7 xp %d%s \u00b7 grit %d" % [Data.HEROES[h.key].subclasses[h.subclass] if h.subclass != "" else Data.HEROES[h.key].name, h.level, h.xp, (" / %d" % need) if need > 0 else "", Run.grit(h)], Vector2(214, y + 38), Vector2(420, 24), 16, UiStyle.font_it, UiStyle.BROWN)
		_tbar(Vector2(214, y + 68), 200, float(h.hp) / Run.max_hp(h), "bar_red", "%d / %d" % [int(h.hp), Run.max_hp(h)])
		_tbar(Vector2(424, y + 68), 170, float(h.stress) / 100.0, "bar_violet", "Stress %d" % int(h.stress))
		_rich(("[i]" + ", ".join(stl) + "[/i]\n" if stl.size() > 0 else "") + (("[color=#9c3d2b]Injured: " + ", ".join(h.injuries.map(func(k): return Run.C.injuries[k].name)) + "[/color]") if h.injuries.size() > 0 else ""), Vector2(214, y + 100), Vector2(420, 50), 14)
		var gx := 650
		for slot in Run.SLOTS:
			var it: Dictionary = h.gear[slot]
			var gy: int = y + 12 + Run.SLOTS.find(slot) * 34
			if not it.is_empty():
				screen.add_child(UiStyle.icon_rect(it.id, Vector2(gx, gy), 30))
			var gl := _lbl(slot.capitalize() + ": " + (Run.C.gear[it.id].name if not it.is_empty() else "empty"), Vector2(gx + 36, gy + 3), Vector2(290, 26), 15, null, UiStyle.INK if not it.is_empty() else UiStyle.BROWN)
			if not it.is_empty():
				gl.tooltip_text = Run.C.gear[it.id].text + "\nRunes: " + ", ".join(it.runes.map(func(k): return Run.C.runes[k].name))
				gl.mouse_filter = Control.MOUSE_FILTER_PASS
		var counts := {}
		for cid in Run.full_deck(h):
			counts[cid] = counts.get(cid, 0) + 1
		_rich("[i]Deck (%d):[/i] " % Run.full_deck(h).size() + ", ".join(counts.keys().map(func(k): return Data.CARDS[k].name + ((" x%d" % counts[k]) if counts[k] > 1 else ""))), Vector2(990, y + 12), Vector2(515, 136), 14)
		y += 164
	var sx := 100
	_lbl("Pack:", Vector2(100, 874), Vector2(80, 26), 17, UiStyle.font_sc)
	sx = 170
	for it in Run.r.stash:
		var gd: Dictionary = Run.C.gear[it.id]
		var mb := MenuButton.new()
		mb.text = gd.name
		mb.tooltip_text = gd.text
		mb.position = Vector2(sx, 870)
		mb.size = Vector2(200, 34)
		mb.flat = false
		var pm := mb.get_popup()
		var opts := []
		for h in Run.living():
			if gd.cls == null or gd.cls == h.key:
				pm.add_item("Equip on " + h.name)
				opts.append(h)
		var itt: Dictionary = it
		pm.id_pressed.connect(func(idx): _toast(Run.equip(opts[idx], itt)); show_roster())
		screen.add_child(mb)
		sx += 210
	_lbl("Belt: %s" % (", ".join(Run.r.belt.map(func(k): return Data.CARDS[k].name)) if Run.r.belt.size() > 0 else "empty"), Vector2(100, 908), Vector2(900, 26), 16, UiStyle.font_it)
	_toast(msg)
	msg = ""

# ================================================================== end
func show_end() -> void:
	var won: bool = Run.r.outcome == "victory"
	var depth := Run.current_layer()
	var o := Run.end_run()
	_screen("The Door Closes Behind You" if won else "The Deep Keeps Them", "%s · depth %d of %d · %d fights won" % [("Commission: " + Data.ENEMIES[Run.r.commission].name) if String(Run.r.get("commission", "")) != "" and Data.ENEMIES.has(Run.r.commission) else Run.C.objectives[Run.r.objective].name, depth, Run.LAYERS - 1, Run.r.fights_won])
	var lines := ["+%d ostia (now %d)" % [o, Run.meta.ostia]]
	for wk in Run.r.get("opened", []):
		lines.append("[color=#a9822f]A door unseals: %s.[/color]" % Data.WORLDS[wk].name)
		lines.append("[i]%s[/i]" % Data.WORLDS[wk].lead)
	if Run.r.get("road_done", false):
		lines.append("[color=#a9822f]The road is walked. Every door now stands open, and you may cast lots.[/color]")
		lines.append("[i]%s[/i]" % Data.STORY.finale)
	if Run.r.get("vessel_unlocked", false):
		lines.append("[color=#8a7fb0]At the edge of the torn sky the Prismatic stops, and the six inks run up the skin and do not fuse. Something comes home that is not quite the one who left. The Vessel joins the order.[/color]")
	lines += Run.r.get("home_lines", [])
	lines += Run.r.log.slice(max(0, Run.r.log.size() - 6))
	var hs: Array = Run.r.heroes
	var x := 800 - hs.size() * 110
	for h in hs:
		_oval(h, Vector2(x + 40, 190), 140)
		x += 220
	_rich("[center]" + "\n".join(lines) + "[/center]", Vector2(250, 400), Vector2(1100, 430), 19)
	_go("Return to the abbey", Vector2(580, 852), Vector2(440, 70), func(): Run.r = {}; main._show_menu())

