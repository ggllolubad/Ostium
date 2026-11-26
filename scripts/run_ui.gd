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
func _screen(title := "", sub := "", bgp := "") -> Control:
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
	veil.color = Color(0, 0, 0, 0.18) if hub else UiStyle.DIM
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
	l.position = pos
	l.size = sz
	l.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
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
	var sb := UiStyle.box(UiStyle.PARCH_L, UiStyle.INK, 2)
	sb.shadow_color = Color(0, 0, 0, 0.35)
	sb.shadow_offset = Vector2(3, 4)
	sb.shadow_size = 1
	p.add_theme_stylebox_override("panel", sb)
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
		_btn("Theme: %s" % ("dark" if UiStyle.dark else "light"), Vector2(1255, 808), Vector2(235, 46), _toggle_theme)
	else:
		_btn("Theme: %s" % ("dark" if UiStyle.dark else "light"), Vector2(1010, 808), Vector2(480, 46), _toggle_theme)
	_btn("Back to the garth", Vector2(1010, 864), Vector2(480, 44), func(): main._show_menu())
	_btn("Playtest: all callings %s" % ("on" if Run.playtest_all() else "off"), Vector2(1010, 916), Vector2(480, 40), _toggle_playtest, null,
		"Unlock every calling for testing. Saved with your settings; turn it off to play the unlocks normally.")
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
	_screen(Data.WORLDS[hub_world].name, "Choose the Prior's commission. The company, its gear and its vows were settled in the abbey.")
	var coms: Array = Data.COMMISSIONS.get(hub_world, [])
	if not coms.is_empty():
		# the commission: which of the world's rulers the Prior sends the company after
		_lbl("The commission", Vector2(80, 130), Vector2(400, 30), 22, UiStyle.font_sc, UiStyle.BROWN)
		var known := false
		for c in coms:
			if c.ruler == hub_commission:
				known = true
		if not known:
			hub_commission = coms[0].ruler
		for ci in coms.size():
			var c: Dictionary = coms[ci]
			var b := _btn(c.name, Vector2(80, 166 + ci * 58), Vector2(400, 50), func(): hub_commission = c.ruler; show_prepare(), null, c.text)
			if c.ruler == hub_commission:
				b.add_theme_stylebox_override("normal", UiStyle.box(UiStyle.HI, UiStyle.RED, 3))
			if c.ruler == hub_commission:
				_lbl("\u201c%s\u201d" % c.text, Vector2(80, 350), Vector2(400, 150), 16, UiStyle.font_it)
		hub_obj = "boss"
	var i := 0
	for k in (Run.C.objectives if coms.is_empty() else {}):
		var o: Dictionary = Run.C.objectives[k]
		var b := _btn(o.name, Vector2(80, 166 + i * 58), Vector2(400, 50), func(): hub_obj = k; show_prepare(), null, o.text)
		if k == hub_obj:
			b.add_theme_stylebox_override("normal", UiStyle.box(UiStyle.HI, UiStyle.RED, 3))
		i += 1
	if coms.is_empty():
		_lbl(Run.C.objectives[hub_obj].text, Vector2(80, 404), Vector2(400, 80), 16, UiStyle.font_it)
	# the company, from the roster
	var party := Abbey.party_heroes()
	_lbl("The company · %d of %d" % [party.size(), int(Abbey.A.party_max)], Vector2(540, 130), Vector2(520, 30), 22, UiStyle.font_sc, UiStyle.BROWN)
	for j in party.size():
		var h: Dictionary = party[j]
		var x := 540 + (j % 2) * 262
		var y := 166 + int(j / 2) * 196
		_panel(Vector2(x, y), Vector2(252, 186))
		_portrait(h.key, Vector2(x + 8, y + 8), Vector2(110, 120))
		_lbl(h.name, Vector2(x + 124, y + 12), Vector2(124, 50), 17, UiStyle.font_sc)
		_lbl("%s\nlevel %d · %s" % [Data.HEROES[h.key].name, int(h.level), h.reason], Vector2(x + 124, y + 62), Vector2(124, 50), 14, UiStyle.font_it, UiStyle.BROWN)
		var wounds := "stress %d" % int(h.stress)
		if not h.injuries.is_empty():
			wounds += " · %d injur%s" % [h.injuries.size(), "y" if h.injuries.size() == 1 else "ies"]
		_lbl(wounds, Vector2(x + 8, y + 136), Vector2(236, 40), 14, UiStyle.font_it, UiStyle.RED_D)
	if party.size() < int(Abbey.A.party_min):
		_lbl("Too few. Choose the company at the cross in the garth.", Vector2(540, 560), Vector2(520, 60), 18, UiStyle.font_it, UiStyle.RED_D)
	# vows and provisions
	_lbl("Vows sworn in the Chapter House", Vector2(1100, 130), Vector2(440, 30), 22, UiStyle.font_sc, UiStyle.BROWN)
	var vows: Array = Run.meta.vows.filter(func(v): return Abbey._vow_index(v) < Run.asc_max())
	var vl := []
	for a in Run.C.ascension:
		if vows.has(a.id):
			vl.append("%s: %s" % [a.name, a.text])
	_lbl("\n".join(vl) if not vl.is_empty() else "None.", Vector2(1100, 166), Vector2(440, 300), 15, UiStyle.font_it)
	var p: Dictionary = Run.meta.provisions
	_lbl("Carried: %d flask%s, %d relic%s, +%d bread, +%d candles, +%d tinctures, +%d tools" % [max(1, p.belt.size()), "" if max(1, p.belt.size()) == 1 else "s", Run.meta.carried.size(), "" if Run.meta.carried.size() == 1 else "s", int(p.food), int(p.light), int(p.medicine), int(p.tools)],
		Vector2(1100, 480), Vector2(440, 80), 16, UiStyle.font_it, UiStyle.BROWN)
	var go := _btn("Descend", Vector2(1100, 620), Vector2(440, 64), _begin_run)
	go.add_theme_font_size_override("font_size", 28)
	go.disabled = party.size() < int(Abbey.A.party_min)
	_btn("Back to the doors", Vector2(1100, 694), Vector2(440, 48), show_hub)
	_btn("Back to the garth", Vector2(1100, 752), Vector2(440, 48), func(): main._show_menu())
	_lbl("Pick a hero (portrait or keys 1-4), click a card, then its target. Drag Ordo slots to reorder, right-click to remove. The field previews the whole round, foes included. Enter commits; L opens the chronicle.",
		Vector2(80, 880), Vector2(1440, 50), 15, UiStyle.font_it, UiStyle.BROWN).horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_toast(msg)
	msg = ""

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

func _toggle_theme() -> void:
	UiStyle.apply_theme(not UiStyle.dark)
	UiStyle.save_settings()
	get_tree().reload_current_scene()

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
func _header(parent: Control) -> void:
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
		Vector2(60, 20), Vector2(1100, 60), 17, parent)
	var rl := []
	for id in r.relics:
		rl.append(UiStyle.icon_tag(id, 24) + " " + Run.C.relics[id].name)
	_rich("[i]relics (%d/%d):[/i] %s" % [r.relics.size(), Run.relic_cap(), ", ".join(rl) if rl.size() > 0 else "none"], Vector2(60, 72), Vector2(1100, 26), 15, parent)

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
	_screen("Victory" if sum.won else "The company is lost", n.get("room_name", ""))
	var lines := []
	if sum.won:
		lines.append("+%d gold · +%d experience" % [sum.gold, sum.xp])
	for t in sum.levels + sum.injuries:
		lines.append(t)
	for d in sum.deaths:
		lines.append("[color=#9c3d2b]%s is dead.[/color]" % d)
	_rich("[center]" + "\n".join(lines) + "[/center]", Vector2(300, 200), Vector2(1000, 300), 20)
	if sum.won and n.get("type", "") == "waypoint":
		n.guarded = true
		Run.r.pending.append({"kind": "waypoint"})   # the camp opens after the guardian's spoils
		Run.save()
	_btn("Onward", Vector2(660, 560), Vector2(280, 56), show_map)

# ================================================================== events
func show_event(n: Dictionary) -> void:
	var e := Run.event_for(n)
	_screen(e.title)
	_panel(Vector2(300, 140), Vector2(1000, 220))
	_lbl(e.text, Vector2(330, 160), Vector2(940, 180), 21, UiStyle.font_it)
	var y := 400
	for o in e.options:
		var ok := Run.option_ok(o)
		var b := _btn(o.label, Vector2(400, y), Vector2(800, 52), func(): _resolve_option(n, o))
		b.disabled = not ok
		b.add_theme_font_size_override("font_size", 19)
		y += 64

func _resolve_option(n: Dictionary, o: Dictionary) -> void:
	var res := Run.apply_option(o)
	_screen(Run.event_for(n).title)
	_lbl(res.text, Vector2(300, 180), Vector2(1000, 120), 22, UiStyle.font_it).horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_lbl(" · ".join(res.notes), Vector2(300, 320), Vector2(1000, 60), 18, UiStyle.font_sc, UiStyle.BROWN).horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	if res.get("fight", false):
		n.type = "combat"
		_btn("Fight", Vector2(660, 440), Vector2(280, 56), func(): _fight(n))
	else:
		_btn("Onward", Vector2(660, 440), Vector2(280, 56), func(): _done_node(""))

# ================================================================== merchant
func show_merchant() -> void:
	var st := Run.merchant_stock()
	_screen("The Merchant", "He trades in what %s gives back. Gold: %d" % [Run.world_name().replace("The ", "the "), Run.r.gold])
	var x := 60
	for c in st.cards:
		if c.get("sold", false):
			continue
		var h: Dictionary = Run.r.heroes[c.hero]
		if h.dead:
			continue
		var cc: Dictionary = c
		_card(c.card, Vector2(x, 140), 0.62, func(): _buy_card(cc))
		_lbl("%s · %d" % [h.name, c.price], Vector2(x, 300), Vector2(116, 40), 14, UiStyle.font_sc).horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		x += 124
	var y := 380
	for g in st.gear:
		if g.get("sold", false):
			continue
		var gd: Dictionary = Run.C.gear[g.item.id]
		var gg: Dictionary = g
		_ibtn(g.item.id, "%s (%s, %s) · %d" % [gd.name, gd.slot, gd.rarity, g.price], Vector2(60, y), Vector2(560, 42), func(): _buy_gear(gg), null, gd.text + ("\nClass: " + Data.HEROES[gd.cls].name if gd.cls != null else ""))
		y += 50
	if not st.relic.is_empty() and not st.relic.get("sold", false):
		var rl: Dictionary = Run.C.relics[st.relic.id]
		_ibtn(st.relic.id, "Relic: %s · %d" % [rl.name, st.relic.price], Vector2(60, y), Vector2(560, 42), func(): _buy_relic(st.relic), null, rl.text)
		y += 50
	if not st.rune.get("sold", false):
		_ibtn(st.rune.id, "%s · %d" % [Run.C.runes[st.rune.id].name, st.rune.price], Vector2(60, y), Vector2(560, 42), func(): _buy_rune(st.rune), null, Run.C.runes[st.rune.id].text)
		y += 50
	for f in st.flasks:
		if f.get("sold", false):
			continue
		var ff: Dictionary = f
		_ibtn(f.card, "Belt: %s · %d" % [Data.CARDS[f.card].name, f.price], Vector2(60, y), Vector2(560, 42), func(): _buy_flask(ff), null, Data.CARDS[f.card].text)
		y += 50
	var sy := 380
	for k in st.supplies:
		var kk: String = k
		_ibtn(k, "+1 %s · %d" % [k, st.supplies[k]], Vector2(700, sy), Vector2(260, 42), func(): _buy_supply(kk, st.supplies[kk]))
		sy += 50
	_btn("Strike a card from a deck · %d" % Run.price(50), Vector2(700, sy), Vector2(360, 42), func(): _pick_removal(Run.price(50), show_merchant))
	# Rules v2, rule 19: the merchant also upgrades a card for 60 gold
	var uy := sy + 50
	for h in Run.living():
		var hh: Dictionary = h
		_btn("Upgrade a card of %s · %d" % [h.name, Run.price(60)], Vector2(700, uy), Vector2(360, 42), func():
			if Run.r.gold < Run.price(60):
				_toast("Not enough gold.")
				return
			_pick_upgrade(hh, show_merchant, Run.price(60)))
		uy += 50
	_btn("Leave", Vector2(1300, 900), Vector2(240, 50), func(): _done_node(""))
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
	_screen("Strike a card", "Choose a card to remove (%d gold)." % cost)
	var y := 140
	for i in Run.r.heroes.size():
		var h: Dictionary = Run.r.heroes[i]
		if h.dead:
			continue
		_lbl(h.name, Vector2(40, y), Vector2(200, 30), 20, UiStyle.font_sc)
		var x := 200
		var seen := {}
		for cid in h.deck:
			if seen.has(cid):
				continue
			seen[cid] = true
			var hh: Dictionary = h
			var cc: String = cid
			_card(cid, Vector2(x, y - 10), 0.42, func(): _toast(Run.remove_card(hh, cc, cost)); back.call())
			x += 82
			if x > 1500:
				break
		y += 130
	_btn("Back", Vector2(1300, 920), Vector2(240, 46), back)

# ================================================================== shrine and camps
func show_shrine() -> void:
	_screen("A Shrine", "A font of black water before a saint with no face. Something of %s has seeped into it." % Run.world_name().replace("The ", "the "))
	_btn("Offer blood: the hardiest hero loses 6 max HP; receive a relic", Vector2(300, 260), Vector2(1000, 56), func(): _done_node(Run.shrine("blood")))
	_btn("Gaze into the font: every hero gains 18 stress; receive gear", Vector2(300, 330), Vector2(1000, 56), func(): _done_node(Run.shrine("fear")))
	_btn("Pray (%d gold): heal 10 and shed 10 stress" % Run.price(30), Vector2(300, 400), Vector2(1000, 56), func(): _done_node(Run.shrine("prayer")))
	_btn("Leave", Vector2(660, 500), Vector2(280, 50), func(): _done_node(""))

func show_field_camp() -> void:
	_screen("Field Camp", "Two food to make camp. Food: %d" % Run.r.supplies.food)
	_btn("Tend wounds: heal 30% of max HP", Vector2(500, 260), Vector2(600, 56), func(): _done_node(Run.field_camp("rest")))
	_btn("Talk through the night: shed 25 stress", Vector2(500, 330), Vector2(600, 56), func(): _done_node(Run.field_camp("talk")))
	# Rules v2, rule 19: the company may instead hone its cards, one upgrade per hero
	_btn("Hone: each hero upgrades one card", Vector2(500, 400), Vector2(600, 56), func():
		if Run.r.supplies.food < 2:
			_toast("Not enough food to make camp (2 needed).")
			return
		Run.r.supplies.food -= 2
		_upgrade_each(Run.living().duplicate(), func(): _done_node("The company hones its craft by the fire.")))
	_btn("Press on", Vector2(660, 490), Vector2(280, 50), func(): _done_node(""))

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
	_screen("Upgrade · " + h.name, "Choose one card to upgrade, or pass. %d can be upgraded." % ids.size())
	for i in ids.size():
		var cid: String = ids[i]
		var x := 60 + (i % 10) * 148
		var y := 130 + int(i / 10) * 230
		_card(cid, Vector2(x, y), 0.62, func():
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
	_btn("Pass", Vector2(660, 900), Vector2(280, 50), after)

func show_waypoint() -> void:
	_screen("The Camp", "A dry chapter house the living still hold. Gold %d · medicine %d" % [Run.r.gold, Run.r.supplies.medicine])
	var y := 150
	for h in Run.living():
		var hh: Dictionary = h
		_panel(Vector2(60, y), Vector2(1480, 96))
		_portrait(h.key, Vector2(70, y + 6), Vector2(90, 84))
		_rich("[b]%s[/b] · level %d %s\nHP %d/%d · stress %d%s" % [h.name, h.level, ("· " + Data.HEROES[h.key].subclasses[h.subclass]) if h.subclass != "" else "", h.hp, Run.max_hp(h), h.stress,
			("\ninjuries: " + ", ".join(h.injuries.map(func(k): return Run.C.injuries[k].name))) if h.injuries.size() > 0 else ""], Vector2(170, y + 8), Vector2(420, 84), 16)
		_btn("Infirmary: full heal · %d" % Run.price(20), Vector2(600, y + 10), Vector2(300, 36), func(): _toast(Run.infirmary_heal(hh)); show_waypoint())
		_btn("Treat injury · %d gold" % Run.price(35), Vector2(600, y + 50), Vector2(300, 36), func(): _toast(Run.treat_injury(hh, false)); show_waypoint())
		_btn("Treat injury · 1 medicine", Vector2(910, y + 50), Vector2(260, 36), func(): _toast(Run.treat_injury(hh, true)); show_waypoint())
		_btn("Respite: -40 stress, lift Dread · %d" % Run.price(15), Vector2(910, y + 10), Vector2(380, 36), func(): _toast(Run.respite(hh)); show_waypoint())
		y += 106
	_btn("Forge: set runes", Vector2(60, y + 10), Vector2(300, 46), show_forge)
	_btn("Market", Vector2(370, y + 10), Vector2(300, 46), func(): show_merchant())
	_btn("Strike a card · %d" % Run.price(50), Vector2(680, y + 10), Vector2(300, 46), func(): _pick_removal(Run.price(50), show_waypoint))
	_btn("The company", Vector2(990, y + 10), Vector2(240, 46), show_roster)
	_btn("Leave the Camp", Vector2(1240, y + 10), Vector2(300, 46), func(): _done_node(""))

func show_forge() -> void:
	_screen("The Forge", "Set runes into gear sockets. Runes held: %s" % (", ".join(Run.r.runes.map(func(k): return Run.C.runes[k].name)) if Run.r.runes.size() > 0 else "none"))
	var y := 150
	for h in Run.living():
		_lbl(h.name, Vector2(60, y), Vector2(200, 30), 20, UiStyle.font_sc)
		var x := 260
		for slot in Run.SLOTS:
			var it: Dictionary = h.gear[slot]
			if it.is_empty():
				continue
			var gd: Dictionary = Run.C.gear[it.id]
			_lbl("%s [%d/%d]" % [gd.name, it.runes.size(), gd.sockets], Vector2(x, y), Vector2(260, 24), 15)
			var bx := x
			for rn in Run.r.runes.duplicate():
				if it.runes.size() >= gd.sockets:
					break
				var hh: Dictionary = h
				var sl: String = slot
				var rr: String = rn
				_btn("+ " + Run.C.runes[rn].name, Vector2(bx, y + 26), Vector2(250, 32), func(): _toast(Run.socket_rune(hh, sl, rr)); show_forge())
				break
			x += 290
		y += 90
	_btn("Back", Vector2(1300, 920), Vector2(240, 46), show_waypoint)

# ================================================================== rewards queue
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
			_screen("Spoils · " + h.name, "Take one card into %s's deck, or none." % h.name)
			var picks := Run.card_choices(h)
			for i in picks.size():
				var cid: String = picks[i]
				_card(cid, Vector2(800 - picks.size() * 130 + i * 260, 200), 1.25, func(): h.deck.append(cid); next.call())
			_btn("Take nothing", Vector2(660, 620), Vector2(280, 50), next)
		"waypoint":
			Run.r.pending.pop_front()
			Run.save()
			show_waypoint()
		"legendary":
			var h: Dictionary = Run.r.heroes[p.hero]
			if h.dead:
				next.call()
				return
			_screen("A Legend · " + h.name, "The guardian falls. Take one legendary card into %s's deck, or none." % h.name)
			var picks := Run.legendary_choices(h)
			for i in picks.size():
				var cid: String = picks[i]
				_card(cid, Vector2(800 - picks.size() * 130 + i * 260, 200), 1.25, func(): h.deck.append(cid); next.call())
			_btn("Take nothing", Vector2(660, 620), Vector2(280, 50), next)
		"relic":
			var rl := Run.relic_drop()
			if rl == "" or Run.r.relics.size() >= Run.relic_cap():
				next.call()
				return
			_screen("A Relic", Run.C.relics[rl].name)
			screen.add_child(UiStyle.icon_rect(rl, Vector2(748, 112), 104))
			_lbl(Run.C.relics[rl].text, Vector2(300, 220), Vector2(1000, 80), 24, UiStyle.font_it).horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
			_btn("Take it", Vector2(560, 360), Vector2(220, 52), func(): Run.r.relics.append(rl); next.call())
			_btn("Leave it", Vector2(820, 360), Vector2(220, 52), next)
		"gear":
			var it := Run.gear_drop()
			var gd: Dictionary = Run.C.gear[it.id]
			_screen("Gear", "%s · %s · %s" % [gd.name, gd.slot, {"C": "common", "U": "uncommon", "R": "rare"}[gd.rarity]])
			screen.add_child(UiStyle.icon_rect(it.id, Vector2(756, 110), 88))
			_lbl(gd.text + ("\nOnly the %s can use it." % Data.HEROES[gd.cls].name if gd.cls != null else "") + "\nSockets: %d" % gd.sockets, Vector2(300, 200), Vector2(1000, 120), 22, UiStyle.font_it).horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
			var x := 400
			for h in Run.living():
				if gd.cls != null and gd.cls != h.key:
					continue
				var hh: Dictionary = h
				_btn("Give to " + h.name, Vector2(x, 360), Vector2(240, 48), func(): Run.r.stash.append(it); _toast(Run.equip(hh, it)); next.call())
				x += 250
			_btn("Into the pack", Vector2(660, 430), Vector2(280, 48), func(): Run.r.stash.append(it); next.call())
		"rune":
			var rn: String = Run.pick(Run.C.runes.keys())
			Run.r.runes.append(rn)
			_screen("A Rune", Run.C.runes[rn].name)
			screen.add_child(UiStyle.icon_rect(rn, Vector2(748, 112), 104))
			_lbl(Run.C.runes[rn].text + "\nSet it at the Forge in the Camp.", Vector2(300, 220), Vector2(1000, 80), 22, UiStyle.font_it).horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
			_btn("Onward", Vector2(660, 340), Vector2(280, 50), next)
		"subclass":
			var h: Dictionary = Run.r.heroes[p.hero]
			_screen("%s reaches level 4" % h.name, "Choose a calling. It unlocks its cards in spoils and grants a passive that grows at levels 7 and 10.")
			var subs: Dictionary = Data.HEROES[h.key].subclasses
			var i := 0
			for sk in subs:
				var x := 120 + i * 470
				_panel(Vector2(x, 160), Vector2(440, 560))
				_lbl(subs[sk], Vector2(x, 176), Vector2(440, 40), 28, UiStyle.font_bl, UiStyle.RED_D).horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
				var tx: Array = Run.C.subclass_text[sk]
				_rich("[b]Level 4:[/b] %s\n[b]Level 7:[/b] %s\n[b]Level 10:[/b] %s" % tx, Vector2(x + 20, 230), Vector2(400, 150), 16)
				var cards := []
				for cid in Data.CARDS:
					if Data.CARDS[cid].get("sub", "") == sk:
						cards.append(cid)
				for j in min(3, cards.size()):
					_card(cards[j], Vector2(x + 20 + j * 136, 400), 0.68)
				var key: String = sk
				_btn("Become " + subs[sk], Vector2(x + 70, 660), Vector2(300, 48), func(): h.subclass = key; next.call())
				i += 1
		"talent":
			var h: Dictionary = Run.r.heroes[p.hero]
			_screen("%s reaches level %d" % [h.name, p.level], "+4 max HP. Choose a talent.")
			var keys: Array = Run.C.talents.keys()
			var picks := []
			while picks.size() < 3:
				var k: String = Run.pick(keys)
				if not picks.has(k):
					picks.append(k)
			for i in 3:
				var k: String = picks[i]
				var t: Dictionary = Run.C.talents[k]
				_btn("%s\n%s" % [t.name, t.text], Vector2(200 + i * 410, 260), Vector2(390, 120), func():
					h.talents.append(k)
					if t.has("remove"):
						Run.r.pending.insert(1, {"kind": "remove", "hero": p.hero})
					next.call())
		"remove":
			var h: Dictionary = Run.r.heroes[p.hero]
			_screen("Cull the Deck", "Remove one card from %s's deck." % h.name)
			var x := 60
			var y := 160
			var seen := {}
			for cid in h.deck:
				if seen.has(cid):
					continue
				seen[cid] = true
				var cc: String = cid
				_card(cid, Vector2(x, y), 0.6, func(): h.deck.erase(cc); next.call())
				x += 120
				if x > 1460:
					x = 60
					y += 170
			_btn("Keep them all", Vector2(660, 900), Vector2(280, 46), next)
		_:
			next.call()

# ================================================================== roster
func show_roster() -> void:
	_screen()
	_header(screen)
	var back := func(): (show_waypoint() if Run.node(Run.r.at).type == "waypoint" and Run.r.get("resolving", "") != "" else show_map())
	_btn("Back", Vector2(1360, 20), Vector2(180, 44), back)
	var y := 110
	for i in Run.r.heroes.size():
		var h: Dictionary = Run.r.heroes[i]
		_panel(Vector2(40, y), Vector2(1520, 186))
		_portrait(h.key, Vector2(50, y + 8), Vector2(120, 120))
		if h.dead:
			_lbl("%s · dead" % h.name, Vector2(180, y + 10), Vector2(400, 30), 22, UiStyle.font_sc, UiStyle.RED_D)
			y += 196
			continue
		var st := Run.stats(h)
		var stl := []
		for k in st:
			if st[k] != 0 and k != "max_hp":
				stl.append("%s %+d" % [k.replace("_", " "), st[k]])
		var need: int = Run.C.xp_levels[min(9, int(h.level))] if h.level < 10 else 0
		_rich("[b]%s[/b] · level %d%s · xp %d%s\nHP %d/%d · stress %d · grit %d\n%s\n%s" % [h.name, h.level, (" · " + Data.HEROES[h.key].subclasses[h.subclass]) if h.subclass != "" else "", h.xp, (" / %d" % need) if need > 0 else "",
			h.hp, Run.max_hp(h), h.stress, Run.grit(h), ("[i]" + ", ".join(stl) + "[/i]") if stl.size() > 0 else "",
			("[color=#9c3d2b]injuries: " + ", ".join(h.injuries.map(func(k): return Run.C.injuries[k].name)) + "[/color]") if h.injuries.size() > 0 else ""], Vector2(180, y + 8), Vector2(460, 170), 15)
		var gx := 650
		for slot in Run.SLOTS:
			var it: Dictionary = h.gear[slot]
			var txt: String = slot.capitalize() + ": " + (Run.C.gear[it.id].name if not it.is_empty() else "empty")
			var tip := ""
			if not it.is_empty():
				tip = Run.C.gear[it.id].text + "\nRunes: " + ", ".join(it.runes.map(func(k): return Run.C.runes[k].name))
			_lbl(txt, Vector2(gx, y + 10 + Run.SLOTS.find(slot) * 26), Vector2(330, 24), 15).tooltip_text = tip
		var cx := 990
		var shown := 0
		var counts := {}
		for cid in Run.full_deck(h):
			counts[cid] = counts.get(cid, 0) + 1
		_rich("[i]deck (%d):[/i] " % Run.full_deck(h).size() + ", ".join(counts.keys().map(func(k): return Data.CARDS[k].name + ((" x%d" % counts[k]) if counts[k] > 1 else ""))), Vector2(cx, y + 8), Vector2(560, 170), 14)
		y += 196
	var sx := 40
	_lbl("Pack:", Vector2(40, 900), Vector2(80, 26), 17, UiStyle.font_sc)
	sx = 110
	for it in Run.r.stash:
		var gd: Dictionary = Run.C.gear[it.id]
		var mb := MenuButton.new()
		mb.text = gd.name
		mb.tooltip_text = gd.text
		mb.position = Vector2(sx, 896)
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
	_lbl("Belt: %s" % (", ".join(Run.r.belt.map(func(k): return Data.CARDS[k].name)) if Run.r.belt.size() > 0 else "empty"), Vector2(40, 940), Vector2(900, 26), 16, UiStyle.font_it)
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
	_rich("[center]" + "\n".join(lines) + "[/center]", Vector2(300, 200), Vector2(1000, 400), 19)
	_btn("Return to the abbey", Vector2(640, 640), Vector2(320, 56), func(): Run.r = {}; main._show_menu())

