class_name ShopPanel
extends Control
## One keeper's object seen close, with the shop laid over it. Every panel shares the frame: the title plate,
## the ostia dish, the iron ring that closes it, and a line along the bottom where the keeper speaks.
## shop: guesthouse, almonry, smithy, infirmarium, cellarium, sacristy, scriptorium, chapter, or company.

var hub: Node
var shop := ""
var focus := -1
var L: Dictionary = {}
var body: Control
var line_l: Label
var ostia_l: Label
var sel_hero := -1
var sel: Dictionary = {}       # the selected thing: {kind: armoury|worn|rune|relic|foe|world|page, ...}
var tab := "bestiary"
var page := 0
var msg := ""

const INK := Color("2b1d12")
const RUBRIC := Color("8a1a14")
const GILT := Color("a9822f")
const BROWN := Color("5a4030")
const CREAM := Color("f1e2c0")
const CHALK := Color("dcdcd2")
const UI := "res://assets/art/ui/"
const TITLES := {"guesthouse": ["The Hosteller", "The guest book"], "almonry": ["Brother Fenn", "The ledger"], "smithy": ["Mother Hild", "The anvil"],
	"infirmarium": ["Sister Wenna", "The treatment table"], "cellarium": ["Godric", "The tally board"], "sacristy": ["Sister Ide", "The relic case"],
	"scriptorium": ["Brother Lucan", "The Codex"], "chapter": ["Prior Aldric", "The charter"], "company": ["The company", "At the cross"]}
const SLOT_NAMES := {"weapon": "Weapon", "armor": "Armour", "trinket1": "Trinket", "trinket2": "Trinket"}
const ROMAN := ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"]

func _ready() -> void:
	size = Vector2(1600, 1000)
	mouse_filter = Control.MOUSE_FILTER_STOP
	var all: Dictionary = Lighting._json(UI + "panels/layout.json")
	var art := "guesthouse" if shop == "company" else shop
	L = all.get(art, {})
	var bg := TextureRect.new()
	bg.texture = load(UI + "panels/%s.png" % art)
	bg.size = size
	bg.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(bg)
	var t: Array = TITLES[shop]
	var title := _lbl("%s  ·  %s" % [t[0], t[1]], Vector2(L.title[0] - 300, L.title[1] - 24), Vector2(600, 48), 30, UiStyle.font_bl, Color("e8d4a0"), HORIZONTAL_ALIGNMENT_CENTER, self)
	_shadow(title)
	ostia_l = _lbl("", Vector2(L.dish[0] - 90, L.dish[1] + 22), Vector2(180, 30), 20, UiStyle.font_sc, CREAM, HORIZONTAL_ALIGNMENT_CENTER, self)
	_shadow(ostia_l)
	var close := Button.new()
	close.flat = true
	close.position = Vector2(L.close[0] - 34, L.close[1] - 34)
	close.size = Vector2(68, 68)
	close.tooltip_text = "Step away (Esc)"
	close.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	close.pressed.connect(func(): hub.close_panel())
	add_child(close)
	line_l = _lbl("", Vector2(572, 950), Vector2(456, 32), 18, UiStyle.font_it, CREAM, HORIZONTAL_ALIGNMENT_CENTER, self)
	_shadow(line_l)
	body = Control.new()
	body.size = size
	body.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(body)
	if focus >= 0:
		sel_hero = focus
	elif not Run.meta.roster.is_empty():
		sel_hero = int(Run.meta.roster[0].id)
	var kp: Dictionary = Abbey.A.keepers.get(shop, {})
	msg = ("\"%s\"" % Abbey.pick(kp.hello)) if not kp.is_empty() else "Click a hero to take them in or leave them behind. Two to four go through the door."
	refresh()

func _gui_input(ev: InputEvent) -> void:
	if ev is InputEventMouseButton and ev.pressed and ev.button_index == MOUSE_BUTTON_RIGHT:
		hub.close_panel()

func refresh() -> void:
	for c in body.get_children():
		c.queue_free()
	ostia_l.text = "%d ostia" % int(Run.meta.ostia)
	line_l.text = msg
	# the footer sits between two iron studs: shrink long lines to fit rather than run over them
	var fsz := 18
	while fsz > 12 and UiStyle.font_it.get_string_size(msg, HORIZONTAL_ALIGNMENT_LEFT, -1, fsz).x > 450:
		fsz -= 1
	line_l.add_theme_font_size_override("font_size", fsz)
	call("_build_" + shop)

## Runs a shop action, shows its result on the keeper's line and redraws the panel.
func act(result: String) -> void:
	if result != "":
		msg = result
	refresh()

# ================================================================== widgets
static func sbox(name: String, m: int) -> StyleBoxTexture:
	var s := StyleBoxTexture.new()
	s.texture = load(UI + name + ".png")
	for side in [SIDE_LEFT, SIDE_RIGHT, SIDE_TOP, SIDE_BOTTOM]:
		s.set_texture_margin(side, m)
		s.set_content_margin(side, m * 0.6)
	return s

static func make_button(text: String, pos: Vector2, sz: Vector2, cb: Callable, fs := 18) -> Button:
	var b := Button.new()
	b.text = text
	b.position = pos
	b.size = sz
	b.focus_mode = Control.FOCUS_NONE
	b.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	b.add_theme_stylebox_override("normal", sbox("btn", 18))
	b.add_theme_stylebox_override("hover", sbox("btn_hover", 18))
	b.add_theme_stylebox_override("pressed", sbox("btn_down", 18))
	b.add_theme_stylebox_override("disabled", sbox("btn_off", 18))
	b.add_theme_stylebox_override("focus", StyleBoxEmpty.new())
	b.add_theme_font_override("font", UiStyle.font_sc)
	b.add_theme_font_size_override("font_size", fs)
	for k in ["font_color", "font_hover_color", "font_pressed_color"]:
		b.add_theme_color_override(k, INK)
	b.add_theme_color_override("font_hover_color", RUBRIC)
	b.add_theme_color_override("font_disabled_color", Color("3a2e22"))
	b.clip_text = true
	b.pressed.connect(cb)
	return b

func _btn(text: String, pos: Vector2, sz: Vector2, cb: Callable, enabled := true, tip := "", fs := 17) -> Button:
	var b := make_button(text, pos, sz, cb, fs)
	b.disabled = not enabled
	b.tooltip_text = tip
	body.add_child(b)
	return b

## A wax seal: the order's way of saying yes. Price or word inside, a caption under it.
func _seal(c: Vector2, inner: String, cb: Callable, enabled := true, tip := "", d := 64.0) -> TextureButton:
	var b := TextureButton.new()
	b.texture_normal = load(UI + "seal.png")
	b.texture_hover = load(UI + "seal_hover.png")
	b.texture_disabled = load(UI + "seal_off.png")
	b.ignore_texture_size = true
	b.stretch_mode = TextureButton.STRETCH_SCALE
	b.size = Vector2(d, d)
	b.position = c - Vector2(d, d) / 2
	b.disabled = not enabled
	b.tooltip_text = tip
	b.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND if enabled else Control.CURSOR_FORBIDDEN
	b.pressed.connect(cb)
	body.add_child(b)
	var l := _lbl(inner, Vector2(0, 0), Vector2(d, d - 6), int(d * 0.3) if inner.length() <= 3 else int(d * 0.2), UiStyle.font_sc, Color("f6e6c8") if enabled else Color("a09888"), HORIZONTAL_ALIGNMENT_CENTER, b)
	l.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	return b

## An item slot: dark recess, iron corners, the icon inside.
func _slot(pos: Vector2, d: float, icon: String, cb: Callable, state := "", tip := "", dim := false) -> TextureButton:
	var b := TextureButton.new()
	b.texture_normal = load(UI + ("slot_sel" if state == "sel" else "slot") + ".png")
	b.texture_hover = load(UI + ("slot_sel" if state == "sel" else "slot_hover") + ".png")
	b.ignore_texture_size = true
	b.stretch_mode = TextureButton.STRETCH_SCALE
	b.position = pos
	b.size = Vector2(d, d)
	b.tooltip_text = tip
	b.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	b.pressed.connect(cb)
	body.add_child(b)
	var word := tip.split(":")[0] if tip.contains(":") else ""
	if icon == "" and word in ["Weapon", "Armour", "Trinket"]:
		# an empty gear slot says what goes in it, faintly, like a chalk mark on the peg
		var g := _lbl(word, Vector2(0, d * 0.34), Vector2(d, d * 0.32), int(d * 0.19), UiStyle.font_it, Color(0.85, 0.78, 0.66, 0.32), HORIZONTAL_ALIGNMENT_CENTER, b)
		g.mouse_filter = Control.MOUSE_FILTER_IGNORE
	if icon != "":
		var t := _icon(icon, Vector2(d * 0.1, d * 0.1), Vector2(d * 0.8, d * 0.8), b)
		if dim:
			t.modulate = Color(0.45, 0.42, 0.4)
	return b

func _icon(id: String, pos: Vector2, sz: Vector2, parent: Node = null) -> TextureRect:
	var t := TextureRect.new()
	var p := "res://assets/art/icons/%s.png" % id
	t.texture = Lighting.tex_at(p)
	t.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	t.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	t.position = pos
	t.size = sz
	t.mouse_filter = Control.MOUSE_FILTER_IGNORE
	(parent if parent else body).add_child(t)
	return t

func _portrait(key: String, pos: Vector2, sz: Vector2, framed := true, parent: Node = null, dim := false) -> TextureRect:
	var host: Node = parent if parent else body
	if framed:
		var mask := Panel.new()
		var sb := StyleBoxFlat.new()
		sb.bg_color = Color(0.08, 0.06, 0.05)
		sb.set_corner_radius_all(int(min(sz.x, sz.y) / 2))
		sb.corner_detail = 16
		mask.add_theme_stylebox_override("panel", sb)
		mask.clip_children = CanvasItem.CLIP_CHILDREN_AND_DRAW
		mask.position = pos
		mask.size = sz
		mask.mouse_filter = Control.MOUSE_FILTER_IGNORE
		host.add_child(mask)
		parent = mask
		pos = Vector2.ZERO
	var t := TextureRect.new()
	t.texture = Lighting.tex_at(UI + "portraits/%s.png" % key)
	t.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	t.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	t.position = pos
	t.size = sz
	t.mouse_filter = Control.MOUSE_FILTER_IGNORE
	if dim:
		t.modulate = Color(0.55, 0.5, 0.5)
	(parent if parent else body).add_child(t)
	if framed:
		var f := TextureRect.new()
		f.texture = load(UI + "portrait.png")
		f.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		f.position = parent.position - sz * 0.06
		f.size = sz * 1.12
		f.mouse_filter = Control.MOUSE_FILTER_IGNORE
		host.add_child(f)
	return t

func _lbl(text: String, pos: Vector2, sz: Vector2, fs := 17, font: FontFile = null, col := INK, align := HORIZONTAL_ALIGNMENT_LEFT, parent: Node = null) -> Label:
	var l := Label.new()
	l.text = text
	l.position = pos
	l.size = sz
	l.add_theme_font_override("font", font if font else UiStyle.font_rm)
	l.add_theme_font_size_override("font_size", fs)
	l.add_theme_color_override("font_color", col)
	l.horizontal_alignment = align
	l.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART if (sz.y >= fs * 2.1 or text.contains("\n")) else TextServer.AUTOWRAP_OFF
	l.clip_text = true
	l.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS if l.autowrap_mode == TextServer.AUTOWRAP_OFF else TextServer.OVERRUN_NO_TRIMMING
	l.mouse_filter = Control.MOUSE_FILTER_IGNORE
	(parent if parent else body).add_child(l)
	return l

func _rich(text: String, pos: Vector2, sz: Vector2, fs := 16, col := INK) -> RichTextLabel:
	var r := RichTextLabel.new()
	r.bbcode_enabled = true
	r.text = text
	r.position = pos
	r.size = sz
	r.scroll_active = false
	r.add_theme_font_override("normal_font", UiStyle.font_rm)
	r.add_theme_font_override("italics_font", UiStyle.font_it)
	r.add_theme_font_override("bold_font", UiStyle.font_sc)
	for k in ["normal_font_size", "italics_font_size", "bold_font_size"]:
		r.add_theme_font_size_override(k, fs)
	r.add_theme_color_override("default_color", col)
	r.mouse_filter = Control.MOUSE_FILTER_IGNORE
	body.add_child(r)
	return r

func _shadow(l: Label) -> void:
	l.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.9))
	l.add_theme_constant_override("shadow_offset_x", 2)
	l.add_theme_constant_override("shadow_offset_y", 2)
	l.add_theme_constant_override("shadow_outline_size", 5)

func _head(text: String, pos: Vector2, w: float, col := RUBRIC, fs := 32) -> Label:
	return _lbl(text, pos, Vector2(w, fs + 14), fs, UiStyle.font_bl, col, HORIZONTAL_ALIGNMENT_CENTER)

## A thin bar: stress in red, hit points in green, filled to frac.
func _bar(pos: Vector2, w: float, frac: float, col: Color, h := 10.0) -> void:
	var back := ColorRect.new()
	back.position = pos
	back.size = Vector2(w, h)
	back.color = Color(0.1, 0.07, 0.05, 0.55)
	back.mouse_filter = Control.MOUSE_FILTER_IGNORE
	body.add_child(back)
	var fill := ColorRect.new()
	fill.position = pos + Vector2(1, 1)
	fill.size = Vector2(max(0.0, (w - 2) * clamp(frac, 0.0, 1.0)), h - 2)
	fill.color = col
	fill.mouse_filter = Control.MOUSE_FILTER_IGNORE
	body.add_child(fill)

## A clickable row the size of a line of the book.
func _row(pos: Vector2, sz: Vector2, cb: Callable, selected := false, tip := "") -> Button:
	var b := Button.new()
	b.position = pos
	b.size = sz
	b.flat = true
	b.focus_mode = Control.FOCUS_NONE
	b.tooltip_text = tip
	b.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	var hv := StyleBoxFlat.new()
	hv.bg_color = Color(0.54, 0.1, 0.08, 0.08)
	hv.border_color = Color(0.54, 0.1, 0.08, 0.35)
	hv.set_border_width_all(1)
	b.add_theme_stylebox_override("hover", hv)
	if selected:
		var sb := StyleBoxFlat.new()
		sb.bg_color = Color(0.54, 0.1, 0.08, 0.13)
		sb.border_color = Color(0.54, 0.1, 0.08, 0.7)
		sb.set_border_width_all(2)
		b.add_theme_stylebox_override("normal", sb)
	b.pressed.connect(cb)
	body.add_child(b)
	return b

# ================================================================== text helpers
func _hero_line(h: Dictionary) -> String:
	return "%s · level %d · %s" % [Data.HEROES[h.key].name, int(h.level), h.get("reason", "")]

func _status(h: Dictionary) -> Array:
	if not Abbey.can_descend(h):
		return ["Shattered", RUBRIC]
	if Run.meta.party.has(h.id):
		return ["In the company", Color("7a5410")]
	return ["Resting", BROWN]

func _item_tip(it: Dictionary) -> String:
	var g: Dictionary = Run.C.gear[it.id]
	var s := "%s (%s %s)\n%s" % [Abbey.item_name(it), {"C": "common", "U": "uncommon", "R": "rare"}[g.rarity], g.slot, g.text]
	var ts := Abbey.temper_stats(it)
	for k in ts:
		s += "\nTempered: +%d %s" % [ts[k], k.replace("_", " ")]
	if g.cls != null:
		s += "\nOnly the %s can use it." % Data.HEROES[g.cls].name
	var rn: Array = it.get("runes", [])
	s += "\nSockets: %d (%s)" % [Abbey.sockets(it), ", ".join(rn.map(func(r): return Run.C.runes[r].name)) if not rn.is_empty() else "empty"]
	return s

func _rar_col(it: Dictionary) -> Color:
	return {"C": INK, "U": Color("2a4a7a"), "R": Color("8a6a1a")}[Run.C.gear[it.id].rarity]

func _hero_rows(pos: Vector2, w: float, rows: int, rh: float, list: Array, pick: Callable, ink := INK, sub := BROWN) -> void:
	var start := clampi(page, 0, max(0, list.size() - 1)) / rows * rows
	for i in range(start, min(list.size(), start + rows)):
		var h: Dictionary = list[i]
		var y := pos.y + (i - start) * rh
		var id := int(h.id)
		_row(Vector2(pos.x - 6, y - 2), Vector2(w + 12, rh - 4), func(): pick.call(id), id == sel_hero, Abbey.reason_rule(h))
		_portrait(h.key, Vector2(pos.x, y + 2), Vector2(rh * 0.62, rh * 0.76), false, null, not Abbey.can_descend(h))
		_lbl(h.name, Vector2(pos.x + rh * 0.72, y + 4), Vector2(w - rh * 0.72 - 120, 26), 20, UiStyle.font_sc, ink)
		_lbl(_hero_line(h), Vector2(pos.x + rh * 0.72, y + 30), Vector2(w - rh * 0.72, 22), 15, UiStyle.font_it, sub)
		var st := _status(h)
		_lbl(st[0], Vector2(pos.x + w - 170, y + 6), Vector2(150, 22), 14, UiStyle.font_sc, st[1], HORIZONTAL_ALIGNMENT_RIGHT)
	if list.size() > rows:
		var pages := int(ceil(list.size() / float(rows)))
		var cur := start / rows
		_btn("‹", Vector2(pos.x, pos.y + rows * rh + 4), Vector2(44, 34), func(): page = max(0, (cur - 1) * rows); refresh(), cur > 0)
		_lbl("%d / %d" % [cur + 1, pages], Vector2(pos.x + 50, pos.y + rows * rh + 8), Vector2(80, 26), 16, UiStyle.font_sc, sub, HORIZONTAL_ALIGNMENT_CENTER)
		_btn("›", Vector2(pos.x + 136, pos.y + rows * rh + 4), Vector2(44, 34), func(): page = (cur + 1) * rows; refresh(), cur < pages - 1)

func _pick_hero(id: int) -> void:
	sel_hero = id
	refresh()

# ================================================================== Guesthouse: the guest book
func _build_guesthouse() -> void:
	var lp: Array = L.left
	var rp: Array = L.right
	_head("The Book of Guests", Vector2(lp[0], lp[1] + 12), lp[2])
	_lbl("Beds taken: %d of %d" % [Run.meta.roster.size(), Abbey.beds()], Vector2(lp[0], lp[1] + 58), Vector2(lp[2], 24), 16, UiStyle.font_it, BROWN, HORIZONTAL_ALIGNMENT_CENTER)
	_hero_rows(Vector2(lp[0] + 10, lp[1] + 94), lp[2] - 20, 7, 68, Run.meta.roster, _pick_hero)
	var free: int = int(Abbey.beds()) - Run.meta.roster.size()
	var ey: float = lp[1] + 94 + min(7, Run.meta.roster.size()) * 68 + 16
	for i in min(free, 7 - min(7, Run.meta.roster.size())):
		_lbl("·  an empty bed, aired  ·", Vector2(lp[0] + 10, ey + i * 44), Vector2(lp[2] - 20, 30), 16, UiStyle.font_it, Color(0.35, 0.25, 0.19, 0.55), HORIZONTAL_ALIGNMENT_CENTER)
	_hero_sheet(rp, 330)
	# strangers at the gate
	var y0: float = rp[1] + 360
	_lbl("Strangers at the gate", Vector2(rp[0], y0), Vector2(rp[2], 30), 22, UiStyle.font_sc, RUBRIC, HORIZONTAL_ALIGNMENT_CENTER)
	var rec: Array = Run.meta.recruits
	if rec.is_empty():
		_lbl("No one waits at the gate. Come back after the next descent.", Vector2(rp[0] + 20, y0 + 60), Vector2(rp[2] - 40, 60), 17, UiStyle.font_it, BROWN, HORIZONTAL_ALIGNMENT_CENTER)
	for i in rec.size():
		var c: Dictionary = rec[i]
		var h: Dictionary = c.hero
		var x: float = rp[0] + 6 + i * (rp[2] / 3.0)
		var cw: float = rp[2] / 3.0 - 12
		var ok := Run.class_unlocked(h.key)
		_portrait(h.key, Vector2(x + cw / 2 - 40, y0 + 40), Vector2(80, 96), true, null, not ok)
		_lbl(h.name, Vector2(x, y0 + 146), Vector2(cw, 24), 16, UiStyle.font_sc, INK, HORIZONTAL_ALIGNMENT_CENTER)
		_lbl("%s · L%d\nReason: %s" % [Data.HEROES[h.key].name, int(h.level), h.reason], Vector2(x, y0 + 168), Vector2(cw, 44), 14, UiStyle.font_it, BROWN, HORIZONTAL_ALIGNMENT_CENTER)
		var idx := i
		var tip := "%s\n%s\n%s" % [Data.HEROES[h.key].blurb, Abbey.A.reasons[h.reason].text, Abbey.reason_rule(h)]
		if not ok:
			tip += "\nThe Chapter has not sanctioned this calling yet."
		_seal(Vector2(x + cw / 2, y0 + 240), str(c.price), func(): act(Abbey.recruit(idx)), ok and int(Run.meta.ostia) >= int(c.price) and Run.meta.roster.size() < Abbey.beds(), "Sign them into the book for %d ostia.\n%s" % [c.price, tip], 58)

## The right page of the guest book and the company screen: one hero, whole.
func _hero_sheet(rp: Array, hgt: float) -> void:
	var h := Abbey.hero(sel_hero)
	if h.is_empty():
		_lbl("Choose a name in the book.", Vector2(rp[0], rp[1] + 120), Vector2(rp[2], 30), 18, UiStyle.font_it, BROWN, HORIZONTAL_ALIGNMENT_CENTER)
		return
	var x: float = rp[0]
	var y: float = rp[1]
	_portrait(h.key, Vector2(x + 18, y + 18), Vector2(140, 168), true, null, not Abbey.can_descend(h))
	_lbl(h.name, Vector2(x + 180, y + 10), Vector2(rp[2] - 180, 40), 30, UiStyle.font_bl, RUBRIC)
	_lbl("%s, level %d · %d descents" % [Data.HEROES[h.key].name, int(h.level), int(h.get("descents", 0))], Vector2(x + 180, y + 52), Vector2(rp[2] - 180, 24), 17, UiStyle.font_sc, INK)
	_rich("[i]Reason:[/i] [b]%s[/b]. %s [color=#5a4030]%s[/color]" % [h.reason, Abbey.A.reasons[h.reason].text, Abbey.reason_rule(h)], Vector2(x + 180, y + 78), Vector2(rp[2] - 180, 64), 15)
	var mh := Run.max_hp(h)
	_lbl("Health %d · Armour %d · Grit %d" % [mh, int(Data.HEROES[h.key].armor) + int(Run.stats(h).get("armor", 0)), Run.grit(h)], Vector2(x + 180, y + 140), Vector2(rp[2] - 180, 22), 15, UiStyle.font_sc, BROWN)
	_lbl("Stress %d" % int(h.stress), Vector2(x + 180, y + 164), Vector2(100, 20), 15, UiStyle.font_sc, RUBRIC)
	_bar(Vector2(x + 270, y + 170), rp[2] - 290, int(h.stress) / 200.0, Color("8a1a14"))
	var notes := []
	for inj in h.injuries:
		notes.append(Run.C.injuries[inj].name)
	var dr: int = h.deck.count("dread")
	if dr > 0:
		notes.append("%d Dread" % dr)
	if not Abbey.can_descend(h):
		notes.append("Shattered: %d descent%s to recover, or Wenna's mending" % [int(h.shattered), "" if int(h.shattered) == 1 else "s"])
	_lbl(("Wounds: " + ", ".join(notes)) if not notes.is_empty() else "No wounds that show.", Vector2(x + 18, y + 198), Vector2(rp[2] - 30, 44), 15, UiStyle.font_it, RUBRIC if not notes.is_empty() else BROWN)
	# gear worn
	var gx: float = x + 18
	for slot in Run.SLOTS:
		var it: Dictionary = h.gear[slot]
		_slot(Vector2(gx, y + 244), 64, it.id if not it.is_empty() else "", func(): pass, "", _item_tip(it) if not it.is_empty() else "%s: empty. Mother Hild fits gear at the anvil." % SLOT_NAMES[slot])
		gx += 72
	var worn := 0
	for slot in Run.SLOTS:
		if not h.gear[slot].is_empty():
			worn += 1
	_lbl("Gear worn: %d of 4\n%d cards in the deck%s" % [worn, h.deck.size(), (" · " + Run.C.subclass_text.get(h.subclass, [""])[0]) if h.subclass != "" else ""], Vector2(x + 316, y + 248), Vector2(rp[2] - 330, 56), 15, UiStyle.font_it, BROWN)
	var inp: bool = Run.meta.party.has(h.id)
	var id := int(h.id)
	_btn("Leave behind" if inp else "Take into the company", Vector2(x + 18, y + hgt - 18), Vector2(250, 42), func(): act(Abbey.toggle_party(id)), inp or Abbey.can_descend(h), "The company: %d of %d." % [Run.meta.party.size(), int(Abbey.A.party_max)])
	if shop == "guesthouse":
		_btn("Send away", Vector2(x + 284, y + hgt - 18), Vector2(170, 42), func(): act(Abbey.dismiss(id)), Run.meta.roster.size() > int(Abbey.A.party_min), "They leave by the gate. Their gear stays in the armoury.")

# ================================================================== the company, at the cross
func _build_company() -> void:
	var lp: Array = L.left
	var rp: Array = L.right
	_head("The Company", Vector2(lp[0], lp[1] + 12), lp[2])
	# the four places at the cross
	var party := Abbey.party_heroes()
	for i in int(Abbey.A.party_max):
		var x: float = lp[0] + 18 + i * 124
		if i < party.size():
			var h: Dictionary = party[i]
			var id := int(h.id)
			_portrait(h.key, Vector2(x, lp[1] + 70), Vector2(100, 120))
			_row(Vector2(x - 8, lp[1] + 62), Vector2(116, 170), func(): _pick_hero(id), id == sel_hero, "%s\n%s" % [h.name, _hero_line(h)])
			_lbl(h.name.split(" ")[0], Vector2(x - 10, lp[1] + 198), Vector2(120, 24), 16, UiStyle.font_sc, INK, HORIZONTAL_ALIGNMENT_CENTER)
		else:
			# an empty place: the same oval, dark, waiting
			var m := Panel.new()
			var sb := StyleBoxFlat.new()
			sb.bg_color = Color(0.1, 0.07, 0.05, 0.55)
			sb.border_color = Color("6a5232")
			sb.set_border_width_all(3)
			sb.set_corner_radius_all(50)
			sb.corner_detail = 16
			m.add_theme_stylebox_override("panel", sb)
			m.position = Vector2(x, lp[1] + 70)
			m.size = Vector2(100, 120)
			m.mouse_filter = Control.MOUSE_FILTER_IGNORE
			body.add_child(m)
			_lbl("a place\nat the cross", Vector2(x - 10, lp[1] + 104), Vector2(120, 50), 14, UiStyle.font_it, Color("d8c8a0"), HORIZONTAL_ALIGNMENT_CENTER)
	_lbl("The rest of the guests", Vector2(lp[0], lp[1] + 240), Vector2(lp[2], 26), 20, UiStyle.font_sc, RUBRIC, HORIZONTAL_ALIGNMENT_CENTER)
	var rest: Array = Run.meta.roster.filter(func(h): return not Run.meta.party.has(h.id))
	_hero_rows(Vector2(lp[0] + 10, lp[1] + 274), lp[2] - 20, 5, 66, rest, _pick_hero)
	if rest.is_empty():
		_lbl("Every guest stands at the cross.", Vector2(lp[0], lp[1] + 290), Vector2(lp[2], 30), 16, UiStyle.font_it, BROWN, HORIZONTAL_ALIGNMENT_CENTER)
	_hero_sheet(rp, 330)
	# what the company carries
	var y0: float = rp[1] + 370
	_lbl("They will carry", Vector2(rp[0], y0), Vector2(rp[2], 28), 21, UiStyle.font_sc, RUBRIC, HORIZONTAL_ALIGNMENT_CENTER)
	var prov: Dictionary = Run.meta.provisions
	var belt: Array = prov.belt
	for i in int(Run.meta.belt_max):
		_slot(Vector2(rp[0] + 20 + i * 64, y0 + 40), 56, belt[i] if i < belt.size() else "", func(): pass, "", Data.CARDS[belt[i]].text if i < belt.size() else "An empty loop on the belt. Brother Fenn sells flasks.")
	var c: Array = Run.meta.carried
	for i in c.size():
		_slot(Vector2(rp[0] + 40 + (int(Run.meta.belt_max) + i) * 64, y0 + 40), 56, c[i], func(): pass, "", "%s\n%s" % [Run.C.relics[c[i]].name, Run.C.relics[c[i]].text])
	_lbl("Bread %d · candles %d · tinctures %d · tools %d  (Godric's count, on top of the usual)" % [int(prov.food), int(prov.light), int(prov.medicine), int(prov.tools)], Vector2(rp[0], y0 + 108), Vector2(rp[2], 44), 15, UiStyle.font_it, BROWN, HORIZONTAL_ALIGNMENT_CENTER)
	var vows: Array = Run.meta.vows
	_lbl(("Vows: " + ", ".join(vows.map(func(v): return _vow_name(v)))) if not vows.is_empty() else "No vows taken. The Prior keeps the charter.", Vector2(rp[0], y0 + 154), Vector2(rp[2], 44), 15, UiStyle.font_it, RUBRIC if not vows.is_empty() else BROWN, HORIZONTAL_ALIGNMENT_CENTER)
	_btn("To the church and the doors", Vector2(rp[0] + rp[2] / 2 - 170, y0 + 206), Vector2(340, 46), func(): var hb := hub; hb.close_panel(); hb._go(hb.go_church), party.size() >= int(Abbey.A.party_min), "The doors are in the side chapels of the church.", 19)

func _vow_name(id: String) -> String:
	for a in Run.C.ascension:
		if a.id == id:
			return a.name
	return id

# ================================================================== Almonry: Fenn's ledger
func _build_almonry() -> void:
	var lp: Array = L.left
	var rp: Array = L.right
	_head("Goods for the Road", Vector2(lp[0], lp[1] - 6), lp[2])
	var y: float = lp[1] + 52
	var stock: Array = Run.meta.stock.get("gear", [])
	for i in stock.size():
		var g: Dictionary = stock[i]
		var it: Dictionary = g.item
		var gd: Dictionary = Run.C.gear[it.id]
		_slot(Vector2(lp[0] + 4, y), 60, it.id, func(): pass, "", _item_tip(it))
		_lbl(Abbey.item_name(it), Vector2(lp[0] + 76, y + 2), Vector2(lp[2] - 200, 24), 19, UiStyle.font_sc, _rar_col(it))
		var who := (" For the %s." % Data.HEROES[gd.cls].name) if gd.cls != null else ""
		_lbl(gd.text + who, Vector2(lp[0] + 76, y + 28), Vector2(lp[2] - 200, 36), 14, UiStyle.font_it, BROWN)
		var idx := i
		_seal(Vector2(lp[0] + lp[2] - 52, y + 30), str(g.price), func(): act(Abbey.buy_gear(idx)), int(Run.meta.ostia) >= int(g.price), "Buy %s for %d ostia. It waits in the armoury." % [Abbey.item_name(it), g.price], 54)
		y += 72
	if stock.is_empty():
		_lbl("Fenn's shelves are bare until the next descent.", Vector2(lp[0], y + 10), Vector2(lp[2], 30), 17, UiStyle.font_it, BROWN, HORIZONTAL_ALIGNMENT_CENTER)
		y += 60
	_lbl("Flasks, brewed by the Alchemists · %d each" % int(Abbey.A.almonry.flask_price), Vector2(lp[0], y + 8), Vector2(lp[2], 24), 17, UiStyle.font_sc, RUBRIC)
	var fl: Array = Run.meta.stock.get("flasks", [])
	var full: bool = Run.meta.provisions.belt.size() >= int(Run.meta.belt_max)
	for i in fl.size():
		var idx := i
		var id: String = fl[i]
		var b := _slot(Vector2(lp[0] + 4 + i * 74, y + 40), 64, id, func(): act(Abbey.buy_flask(idx)), "", "%s\n%s\nBuy for %d ostia%s" % [Data.CARDS[id].name, Data.CARDS[id].text, int(Abbey.A.almonry.flask_price), " (the belt is full)" if full else ""], full)
	if full and not fl.is_empty():
		_lbl("The belt is full: widen it, or the flasks wait on the shelf.", Vector2(lp[0], y + 112), Vector2(lp[2], 24), 15, UiStyle.font_it, BROWN)
	# what the left page holds in its foot: Fenn's alms note, so the page is a page and not a gap
	_rich("[i][color=#5a4030]Alms given at the gate this season: bread to the road-folk, salt to the drowned villages. The goods above are what is left over, and they are not free.[/color][/i]", Vector2(lp[0] + 10, y + 160), Vector2(lp[2] - 20, 80), 15)
	var bp := Abbey.belt_price()
	var can_widen := int(Run.meta.belt_max) < int(Abbey.A.almonry.belt.max)
	_btn(("A wider belt · %d" % bp) if can_widen else "The widest belt", Vector2(lp[0] + lp[2] - 210, y + 50), Vector2(206, 44), func(): act(Abbey.widen_belt()), can_widen and int(Run.meta.ostia) >= bp, "One more flask loop for every descent.")
	# right page: the belt, then the armoury and what Fenn pays for it
	_head("The Belt", Vector2(rp[0], rp[1] - 6), rp[2], RUBRIC, 28)
	var belt: Array = Run.meta.provisions.belt
	for i in int(Run.meta.belt_max):
		_slot(Vector2(rp[0] + rp[2] / 2 - int(Run.meta.belt_max) * 38 + i * 76, rp[1] + 44), 68, belt[i] if i < belt.size() else "", func(): pass, "", Data.CARDS[belt[i]].text if i < belt.size() else "An empty loop. A Wineskin is given free if the belt goes out bare.")
	_head("The Armoury", Vector2(rp[0], rp[1] + 128), rp[2], RUBRIC, 28)
	_lbl("Fenn buys back at %d in the hundred." % int(round(float(Abbey.A.almonry.sell_rate) * 100)), Vector2(rp[0], rp[1] + 170), Vector2(rp[2], 22), 15, UiStyle.font_it, BROWN, HORIZONTAL_ALIGNMENT_CENTER)
	var arm: Array = Run.meta.armoury
	var rows := 6
	var start := clampi(page, 0, max(0, arm.size() - 1)) / rows * rows
	for i in range(start, min(arm.size(), start + rows)):
		var it: Dictionary = arm[i]
		var yy: float = rp[1] + 204 + (i - start) * 62
		_slot(Vector2(rp[0] + 4, yy), 54, it.id, func(): pass, "", _item_tip(it))
		_lbl(Abbey.item_name(it), Vector2(rp[0] + 70, yy + 4), Vector2(rp[2] - 200, 24), 18, UiStyle.font_sc, _rar_col(it))
		_lbl(Run.C.gear[it.id].text, Vector2(rp[0] + 70, yy + 28), Vector2(rp[2] - 200, 22), 14, UiStyle.font_it, BROWN)
		var v := Abbey.sell_value(it)
		var ref := it
		var tip := "Fenn pays %d ostia." % v
		if not it.get("runes", []).is_empty():
			tip += " Its runes go back to your pouch."
		if it.has("paid_gold"):
			tip += " Bought with gold on the road: he pays no more than the gold was worth."
		_btn("Sell · %d" % v, Vector2(rp[0] + rp[2] - 118, yy + 8), Vector2(114, 38), func(): act(Abbey.sell(ref)), true, tip, 15)
	if arm.is_empty():
		_lbl("Nothing hangs in the armoury. Gear found on the road comes home here.", Vector2(rp[0] + 20, rp[1] + 220), Vector2(rp[2] - 40, 60), 16, UiStyle.font_it, BROWN, HORIZONTAL_ALIGNMENT_CENTER)
	if arm.size() > rows:
		var cur := start / rows
		_btn("‹", Vector2(rp[0], rp[1] + 204 + rows * 62), Vector2(44, 34), func(): page = max(0, (cur - 1) * rows); refresh(), cur > 0)
		_btn("›", Vector2(rp[0] + 52, rp[1] + 204 + rows * 62), Vector2(44, 34), func(): page = (cur + 1) * rows; refresh(), start + rows < arm.size())

# ================================================================== Smithy: the anvil
func _build_smithy() -> void:
	var hr: Array = L.heroes
	_lbl("The company's gear", Vector2(hr[0], hr[1] - 16), Vector2(hr[2], 28), 21, UiStyle.font_sc, CREAM, HORIZONTAL_ALIGNMENT_CENTER)
	_shadow(body.get_child(body.get_child_count() - 1))
	var list: Array = Run.meta.roster.duplicate()
	list.sort_custom(func(a, b): return int(Run.meta.party.has(a.id)) > int(Run.meta.party.has(b.id)))
	var rows := 4
	var start := clampi(page, 0, max(0, list.size() - 1)) / rows * rows
	var rh: float = 184.0
	for i in range(start, min(list.size(), start + rows)):
		var h: Dictionary = list[i]
		var y: float = hr[1] + 22 + (i - start) * rh
		var id := int(h.id)
		_portrait(h.key, Vector2(hr[0] + 6, y), Vector2(70, 84), true, null, not Abbey.can_descend(h))
		var hb := _row(Vector2(hr[0], y - 6), Vector2(hr[2], 96), func(): _pick_hero(id), id == sel_hero, "Choose %s to give gear to." % h.name)
		var nl := _lbl(h.name, Vector2(hr[0] + 92, y), Vector2(hr[2] - 96, 26), 19, UiStyle.font_sc, CREAM)
		_shadow(nl)
		var sl := _lbl(_hero_line(h), Vector2(hr[0] + 92, y + 28), Vector2(hr[2] - 96, 22), 14, UiStyle.font_it, Color("d8c4a0"))
		_shadow(sl)
		for j in Run.SLOTS.size():
			var slot: String = Run.SLOTS[j]
			var it: Dictionary = h.gear[slot]
			var is_sel: bool = sel.get("kind", "") == "worn" and int(sel.get("hero", -1)) == id and sel.get("slot", "") == slot
			_slot(Vector2(hr[0] + 6 + j * 86, y + 96), 74, it.id if not it.is_empty() else "", func(): sel = {"kind": "worn", "hero": id, "slot": slot}; sel_hero = id; refresh(), "sel" if is_sel else "",
				_item_tip(it) if not it.is_empty() else "%s: empty" % SLOT_NAMES[slot])
	if list.size() > rows:
		var cur := start / rows
		_btn("‹", Vector2(hr[0] + 80, hr[1] + hr[3] - 30), Vector2(44, 34), func(): page = max(0, (cur - 1) * rows); refresh(), cur > 0)
		_btn("›", Vector2(hr[0] + 236, hr[1] + hr[3] - 30), Vector2(44, 34), func(): page = (cur + 1) * rows; refresh(), start + rows < list.size())
	# the armoury rack: four hooks on each of four bars
	var rk: Array = L.rack
	var arm: Array = Run.meta.armoury
	_lbl("The armoury", Vector2(rk[0], rk[1] - 32), Vector2(rk[2], 28), 21, UiStyle.font_sc, CREAM, HORIZONTAL_ALIGNMENT_CENTER)
	_shadow(body.get_child(body.get_child_count() - 1))
	for i in min(arm.size(), 16):
		var it: Dictionary = arm[i]
		var bx: float = rk[0] + 38 + (i % 4) * ((rk[2] - 140) / 3.0) - 6
		var by: float = rk[1] + 64 + int(i / 4) * ((rk[3] - 80) / 3.0) - 6
		var ref := it
		var is_sel: bool = sel.get("kind", "") == "armoury" and sel.get("item") == it
		_slot(Vector2(bx, by), 80, it.id, func(): sel = {"kind": "armoury", "item": ref}; refresh(), "sel" if is_sel else "", _item_tip(it))
	if arm.is_empty():
		var e := _lbl("The rack is bare. Brother Fenn sells gear; the road gives it.", Vector2(rk[0] + 30, rk[1] + 300), Vector2(rk[2] - 60, 80), 17, UiStyle.font_it, CREAM, HORIZONTAL_ALIGNMENT_CENTER)
		_shadow(e)
	# the rune tablet: runes waiting to be cut, then Hild's own stock
	var tr: Array = L.tray
	var runes: Array = Run.meta.runes
	for i in 6:
		var cx: float = tr[0] + 44 + i * (tr[2] - 88) / 5.0 - 30
		var cy: float = tr[1] + tr[3] / 2.0 - 30
		if i < runes.size():
			var rn: String = runes[i]
			var is_sel: bool = sel.get("kind", "") == "rune" and sel.get("index", -1) == i
			var idx := i
			var b := _slot(Vector2(cx, cy), 60, rn, func(): sel = {"kind": "rune", "index": idx}; refresh(), "sel" if is_sel else "", "%s\n%s\nChoose it, then choose a piece with a free socket." % [Run.C.runes[rn].name, Run.C.runes[rn].text])
			b.modulate.a = 0.98
	var stock: Array = Run.meta.stock.get("runes", [])
	var sx: float = tr[0]
	var lb := _lbl("Hild will cut:", Vector2(sx - 10, tr[1] + tr[3] + 4), Vector2(130, 26), 16, UiStyle.font_it, CREAM)
	_shadow(lb)
	for i in stock.size():
		var idx := i
		var rn: String = stock[i]
		_btn("%s · %d" % [Run.C.runes[rn].name.replace("Rune of ", ""), int(Abbey.A.smithy.rune_price)], Vector2(sx + 120 + i * 128, tr[1] + tr[3] + 2), Vector2(122, 34), func(): act(Abbey.buy_rune(idx)), int(Run.meta.ostia) >= int(Abbey.A.smithy.rune_price), "%s: %s\nBuy it for the tablet." % [Run.C.runes[rn].name, Run.C.runes[rn].text], 14)
	# the anvil: whatever is chosen lies on it
	var an: Array = L.anvil
	var it: Dictionary = {}
	var owner: Dictionary = {}
	if sel.get("kind", "") == "armoury":
		it = sel.item
	elif sel.get("kind", "") == "worn":
		owner = Abbey.hero(int(sel.hero))
		it = owner.gear[sel.slot] if not owner.is_empty() else {}
	var cx: float = an[0] + an[2] / 2.0
	if it.is_empty():
		var t := _lbl("Choose a piece from the rack or from a hero, and lay it on the anvil.", Vector2(an[0], an[1] + 60), Vector2(an[2], 70), 20, UiStyle.font_it, CREAM, HORIZONTAL_ALIGNMENT_CENTER)
		_shadow(t)
		return
	# the piece lies on the anvil face; its name and what Hild can do with it stand above
	_icon(it.id, Vector2(cx - 70, 508), Vector2(140, 140))
	var nm := _lbl(Abbey.item_name(it), Vector2(an[0] - 40, an[1] + 6), Vector2(an[2] + 80, 44), 30, UiStyle.font_bl, Color("f0d8a8"), HORIZONTAL_ALIGNMENT_CENTER)
	_shadow(nm)
	var g: Dictionary = Run.C.gear[it.id]
	var ts := Abbey.temper_stats(it)
	var extra := ""
	for k in ts:
		extra += "  ·  tempered +%d %s" % [ts[k], k.replace("_", " ")]
	var rn: Array = it.get("runes", [])
	var info := _lbl("%s%s\nSockets %d: %s%s" % [g.text, extra, Abbey.sockets(it), ", ".join(rn.map(func(r): return Run.C.runes[r].name)) if not rn.is_empty() else "none set", ("  ·  worn by " + owner.name) if not owner.is_empty() else ""], Vector2(an[0] - 40, an[1] + 50), Vector2(an[2] + 80, 56), 16, UiStyle.font_it, Color("e8d8b8"), HORIZONTAL_ALIGNMENT_CENTER)
	_shadow(info)
	# left of the anvil: Hild's work on the steel
	var lx: float = an[0] - 30
	var y0: float = an[1] + 120
	var tp := Abbey.temper_price(it)
	var can_t := int(it.get("temper", 0)) < int(Abbey.A.smithy.temper.max)
	_btn(("Temper · %d" % tp) if can_t else "Fully tempered", Vector2(lx, y0), Vector2(200, 42), func(): act(Abbey.temper(it)), can_t and int(Run.meta.ostia) >= tp, "Fold the steel again: +1 to its main stat.")
	var can_s := Abbey.sockets(it) < int(Abbey.A.smithy.socket.max)
	_btn(("Cut a socket · %d" % int(Abbey.A.smithy.socket.price)) if can_s else "No room for more", Vector2(lx, y0 + 50), Vector2(200, 42), func(): act(Abbey.cut_socket(it)), can_s and int(Run.meta.ostia) >= int(Abbey.A.smithy.socket.price), "A new socket for a rune.")
	_btn("Strip a rune", Vector2(lx, y0 + 100), Vector2(200, 42), func(): act(Abbey.strip_rune(it, it.runes.size() - 1)), not it.get("runes", []).is_empty(), "Prise out the last rune set; it goes back on the tablet.")
	# right of the anvil: runes from the tablet, and who it belongs to
	var rx: float = an[0] + an[2] - 170
	var free: bool = it.get("runes", []).size() < Abbey.sockets(it)
	if free and runes.size() > 0:
		var rl := _lbl("Cut in a rune · %d" % int(Abbey.A.smithy.set.price), Vector2(rx, y0 - 30), Vector2(200, 26), 16, UiStyle.font_it, CREAM, HORIZONTAL_ALIGNMENT_CENTER)
		_shadow(rl)
		var seen := []
		for r in runes:
			if seen.has(r) or seen.size() >= 3:
				continue
			var rr: String = r
			_btn(Run.C.runes[r].name.replace("Rune of ", ""), Vector2(rx, y0 + seen.size() * 50), Vector2(200, 42), func(): act(Abbey.set_rune(it, rr)), int(Run.meta.ostia) >= int(Abbey.A.smithy.set.price), Run.C.runes[r].text, 16)
			seen.append(r)
	var gy: float = y0 + 150
	if sel.get("kind", "") == "armoury":
		var h := Abbey.hero(sel_hero)
		if not h.is_empty():
			var ok: bool = g.cls == null or g.cls == h.key
			_btn("Give to %s" % h.name.split(" ")[0], Vector2(lx, gy), Vector2(200, 42), func(): sel = {}; act(Abbey.equip(h, it)), ok, ("%s takes it up." % h.name) if ok else "Only the %s can use that." % Data.HEROES[g.cls].name, 19)
	elif not owner.is_empty():
		var oid := int(owner.id)
		var slot: String = sel.slot
		_btn("Back on the rack", Vector2(lx, gy), Vector2(200, 42), func(): sel = {}; act(Abbey.unequip(Abbey.hero(oid), slot)), true, "", 18)

# ================================================================== Infirmarium: the treatment table
func _build_infirmarium() -> void:
	var pa: Array = L.patients
	_lbl("Patients", Vector2(pa[0], pa[1] - 40), Vector2(pa[2], 44), 32, UiStyle.font_bl, RUBRIC, HORIZONTAL_ALIGNMENT_CENTER)
	var list: Array = Run.meta.roster.duplicate()
	list.sort_custom(func(a, b): return _need(a) > _need(b))
	var rows := 7
	var start := clampi(page, 0, max(0, list.size() - 1)) / rows * rows
	for i in range(start, min(list.size(), start + rows)):
		var h: Dictionary = list[i]
		var y: float = pa[1] + (i - start) * 66
		var id := int(h.id)
		_row(Vector2(pa[0] - 6, y - 2), Vector2(pa[2] + 12, 62), func(): _pick_hero(id), id == sel_hero)
		_portrait(h.key, Vector2(pa[0], y + 2), Vector2(44, 54), false, null, not Abbey.can_descend(h))
		_lbl(h.name, Vector2(pa[0] + 54, y + 2), Vector2(pa[2] - 60, 24), 18, UiStyle.font_sc, INK)
		var marks := ["stress %d" % int(h.stress)]
		if not h.injuries.is_empty(): marks.append("%d injur%s" % [h.injuries.size(), "y" if h.injuries.size() == 1 else "ies"])
		if h.deck.has("dread"): marks.append("%d Dread" % h.deck.count("dread"))
		if not Abbey.can_descend(h): marks.append("Shattered")
		_lbl(" · ".join(marks), Vector2(pa[0] + 54, y + 28), Vector2(pa[2] - 60, 22), 15, UiStyle.font_it, RUBRIC if _need(h) > 0 else BROWN)
	# Wenna's daybook under the list: the state of the house in her words
	var hurt := list.filter(func(h): return not h.injuries.is_empty()).size()
	var shat := list.filter(func(h): return not Abbey.can_descend(h)).size()
	var strained := list.filter(func(h): return int(h.stress) >= 100).size()
	var dy: float = pa[1] + min(list.size(), rows) * 66 + 24
	if list.size() < rows:
		_rich("[i][color=#5a4030]Daybook.[/color] %s %s %s[/i]" % [
			("%d nursing wounds." % hurt) if hurt > 0 else "No open wounds.",
			("%d in Shattered rest." % shat) if shat > 0 else "None lying broken.",
			("%d near the edge of their nerve." % strained) if strained > 0 else "Nerves holding, for now."], Vector2(pa[0], dy), Vector2(pa[2], 80), 16, RUBRIC)
	if list.size() > rows:
		var cur := start / rows
		_btn("‹", Vector2(pa[0], pa[1] + rows * 66), Vector2(44, 34), func(): page = max(0, (cur - 1) * rows); refresh(), cur > 0)
		_btn("›", Vector2(pa[0] + 52, pa[1] + rows * 66), Vector2(44, 34), func(): page = (cur + 1) * rows; refresh(), start + rows < list.size())
	# the chart
	var ch: Array = L.chart
	var h := Abbey.hero(sel_hero)
	if h.is_empty():
		return
	_lbl(h.name, Vector2(ch[0], ch[1] - 50), Vector2(ch[2], 40), 30, UiStyle.font_bl, RUBRIC)
	_lbl(_hero_line(h), Vector2(ch[0], ch[1] - 10), Vector2(ch[2], 22), 16, UiStyle.font_it, BROWN)
	_lbl("Stress  %d / 200" % int(h.stress), Vector2(ch[0], ch[1] + 22), Vector2(ch[2], 24), 18, UiStyle.font_sc, INK)
	_bar(Vector2(ch[0], ch[1] + 50), ch[2] - 20, int(h.stress) / 200.0, Color("8a1a14"), 12)
	var y: float = ch[1] + 78
	_lbl("Injuries", Vector2(ch[0], y), Vector2(ch[2], 24), 18, UiStyle.font_sc, INK)
	y += 28
	if h.injuries.is_empty():
		_lbl("None. The body is whole, for now.", Vector2(ch[0], y), Vector2(ch[2], 24), 16, UiStyle.font_it, BROWN)
		y += 30
	for inj in h.injuries:
		var d: Dictionary = Run.C.injuries[inj]
		_lbl("%s: %s" % [d.name, d.text], Vector2(ch[0], y), Vector2(ch[2], 44), 15, UiStyle.font_it, RUBRIC)
		var ij: String = inj
		var tp := int(Abbey.A.infirmarium.treat.price)
		_btn("Treat · %d" % tp, Vector2(ch[0], y + 46), Vector2(180, 36), func(): act(Abbey.treat(h, ij)), int(Run.meta.ostia) >= tp, Abbey.A.infirmarium.treat.text, 15)
		y += 92
	var dr: int = h.deck.count("dread")
	_lbl("Dread in the deck: %d" % dr, Vector2(ch[0], y + 6), Vector2(ch[2], 24), 17, UiStyle.font_sc, RUBRIC if dr > 0 else INK)
	_lbl(("Shattered. %d descent%s of rest, or mending." % [int(h.shattered), "" if int(h.shattered) == 1 else "s"]) if not Abbey.can_descend(h) else "Fit to descend.", Vector2(ch[0], y + 36), Vector2(ch[2], 24), 17, UiStyle.font_sc, RUBRIC if not Abbey.can_descend(h) else Color("3a5a2a"))
	# Wenna's services
	var sv: Array = L.services
	var I: Dictionary = Abbey.A.infirmarium
	var sy: float = sv[1]
	for k in ["ease", "dread", "mend"]:
		var s: Dictionary = I[k]
		var ok: bool = int(Run.meta.ostia) >= int(s.price)
		if k == "ease": ok = ok and int(h.stress) > 0
		if k == "dread": ok = ok and dr > 0
		if k == "mend": ok = ok and not Abbey.can_descend(h)
		var key: String = k
		_btn("%s · %d" % [s.name, int(s.price)], Vector2(sv[0], sy), Vector2(sv[2], 48), func(): act(_infirm(key, h)), ok, s.text, 18)
		_lbl(s.text, Vector2(sv[0] + 8, sy + 52), Vector2(sv[2] - 16, 40), 15, UiStyle.font_it, BROWN, HORIZONTAL_ALIGNMENT_CENTER)
		sy += 118

func _need(h: Dictionary) -> int:
	return int(h.stress) + 50 * h.injuries.size() + 40 * h.deck.count("dread") + (200 if not Abbey.can_descend(h) else 0)

func _infirm(k: String, h: Dictionary) -> String:
	match k:
		"ease": return Abbey.ease(h)
		"dread": return Abbey.lift_dread(h)
		"mend": return Abbey.mend(h)
	return ""

# ================================================================== Cellarium: the tally board
func _build_cellarium() -> void:
	var la: Array = L.lanes
	var lw: float = (1440 - 380) / 4.0
	var base := {"food": 8, "light": 6, "medicine": 2, "tools": 2}
	var bonus := {"food": 2 if Run.meta.unlocked.has("provisioner") else 0, "light": 2 if Run.meta.unlocked.has("lamplighter") else 0, "medicine": 1 if Run.meta.unlocked.has("surgeon") else 0, "tools": 0}
	var keys := ["food", "light", "medicine", "tools"]
	var spent := 0
	for k in 4:
		var key: String = keys[k]
		var c: Dictionary = Abbey.A.cellarium[key]
		var x0: float = 120 + k * lw
		var sx: float = x0 + lw / 2
		var have := int(Run.meta.provisions[key])
		spent += have * int(c.price)
		var t := _lbl(c.name, Vector2(x0 + 8, 104), Vector2(lw - 16, 30), 22, UiStyle.font_sc, CREAM, HORIZONTAL_ALIGNMENT_CENTER)
		_shadow(t)
		# a brass peg in a hole for every one bought
		var rows := 8
		var top: float = 96 + 250.0
		var step: float = (856 - 400) / 8.0
		for n in int(c.cap):
			var col := n % 2
			var row := n / 2
			var px: float = sx + (lw * 0.32 if col == 1 else -lw * 0.32)
			var py: float = top + row * step
			if n < have:
				var peg := Panel.new()
				var sb := StyleBoxFlat.new()
				sb.bg_color = Color("c89a3a")
				sb.border_color = Color("2b1d12")
				sb.set_border_width_all(2)
				sb.set_corner_radius_all(9)
				peg.add_theme_stylebox_override("panel", sb)
				peg.size = Vector2(18, 18)
				peg.position = Vector2(px - 9, py - 9)
				peg.mouse_filter = Control.MOUSE_FILTER_IGNORE
				body.add_child(peg)
		var n1 := _lbl("%d" % (base[key] + bonus[key] + have), Vector2(sx - 60, 96 + 178), Vector2(120, 50), 40, UiStyle.font_bl, Color("f4e2b4"), HORIZONTAL_ALIGNMENT_CENTER)
		_shadow(n1)
		var n2 := _lbl("%d usual%s · +%d bought" % [base[key], (" · +%d works" % bonus[key]) if bonus[key] > 0 else "", have], Vector2(x0 + 8, 96 + 720), Vector2(lw - 16, 28), 16, UiStyle.font_it, Color("f6e8c8"), HORIZONTAL_ALIGNMENT_CENTER)
		_shadow(n2)
		_btn("−", Vector2(sx - 96, 96 + 750), Vector2(60, 46), func(): act(Abbey.provision(key, -1)), have > 0, "Put one back on the shelf (refunded).", 26)
		_btn("Buy · %d" % int(c.price), Vector2(sx - 30, 96 + 750), Vector2(126, 46), func(): act(Abbey.provision(key, 1)), have < int(c.cap) and int(Run.meta.ostia) >= int(c.price), "%s\nUp to %d more." % [c.text, int(c.cap)], 20)
	# the slate: Godric's count for the next descent
	var sl: Array = L.slate
	var p: Dictionary = Run.meta.provisions
	var lines := ["For the next descent", ""]
	for key in keys:
		lines.append("%s  %d" % [Abbey.A.cellarium[key].name, base[key] + bonus[key] + int(p[key])])
	lines.append("")
	lines.append("Flasks on the belt  %d of %d" % [p.belt.size(), int(Run.meta.belt_max)])
	lines.append("Relics carried  %d of %d" % [Run.meta.carried.size(), Abbey.carry_cap()])
	lines.append("")
	lines.append("Chalked against the order:")
	lines.append("%d ostia" % spent)
	var r := _lbl("\n".join(lines), Vector2(sl[0] + 26, sl[1] + 30), Vector2(sl[2] - 52, sl[3] - 60), 19, UiStyle.font_it, CHALK, HORIZONTAL_ALIGNMENT_CENTER)
	r.add_theme_constant_override("line_spacing", 6)

# ================================================================== Sacristy: the relic case
func _build_sacristy() -> void:
	var te: Array = L.teeth
	var order: Array = Data.STORY.order
	var cl: Array = Run.meta.get("cleared", [])
	for i in 15:
		var wk: String = order[i]
		var nx: float = 150 + i * (1300 / 15.0)
		var have := cl.has(wk)
		var t := TextureRect.new()
		t.texture = Lighting.tex_at("res://assets/art/icons/t_tooth_charm.png")
		t.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		t.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		t.position = Vector2(nx + 6, 96 + 66)
		t.size = Vector2(62, 70)
		t.modulate = Color(1.1, 1.0, 0.85) if have else Color(0.12, 0.1, 0.1, 0.8)
		t.tooltip_text = ("The Tooth of %s. It is warm." % Data.WORLDS[wk].name) if have else "%s · %s\nIts Tooth is still in its ruler's keeping." % [ROMAN[i], Data.WORLDS[wk].name]
		t.mouse_filter = Control.MOUSE_FILTER_PASS
		body.add_child(t)
	# the case: owned relics first, then what Ide has to sell
	var cs: Array = L.case
	var cells := []
	for id in Run.meta.relics:
		cells.append({"id": id, "state": Run.meta.relics[id]})
	var stock: Array = Run.meta.stock.get("relics", [])
	for i in stock.size():
		cells.append({"id": stock[i].id, "state": "sale", "price": stock[i].price, "i": i})
	var cw: float = cs[2] / 6.0
	var chh: float = cs[3] / 3.0
	for i in min(cells.size(), 18):
		var c: Dictionary = cells[i]
		var x: float = cs[0] + (i % 6) * cw
		var y: float = cs[1] + int(i / 6) * chh
		var id: String = c.id
		var rl: Dictionary = Run.C.relics[id]
		var carried: bool = Run.meta.carried.has(id)
		if c.state == "veiled":
			_slot(Vector2(x + cw / 2 - 44, y + 12), 88, "", func(): pass, "", "A veiled relic. Sister Ide must handle it before anyone carries it.")
			var v := _lbl("?", Vector2(x + cw / 2 - 44, y + 18), Vector2(88, 76), 56, UiStyle.font_bl, Color("8a7a6a"), HORIZONTAL_ALIGNMENT_CENTER)
			_shadow(v)
			var vl := _lbl("Veiled", Vector2(x, y + 102), Vector2(cw, 22), 17, UiStyle.font_sc, CREAM, HORIZONTAL_ALIGNMENT_CENTER)
			_shadow(vl)
			_btn("Identify · %d" % int(Abbey.A.sacristy.identify), Vector2(x + cw / 2 - 74, y + chh - 54), Vector2(148, 32), func(): act(Abbey.identify(id)), int(Run.meta.ostia) >= int(Abbey.A.sacristy.identify), "Ide will tell you what it is.", 14)
			continue
		var tip := "%s\n%s" % [rl.name, rl.text]
		if c.state == "sale":
			var idx: int = c.i
			_slot(Vector2(x + cw / 2 - 44, y + 12), 88, id, func(): pass, "", tip + "\nIde will part with it for %d ostia." % int(c.price))
			_seal(Vector2(x + cw - 34, y + 30), str(c.price), func(): act(Abbey.buy_relic(idx)), int(Run.meta.ostia) >= int(c.price), "Buy %s for %d ostia." % [rl.name, c.price], 50)
		else:
			_slot(Vector2(x + cw / 2 - 44, y + 12), 88, id, func(): act(Abbey.toggle_carry(id)), "sel" if carried else "", tip + ("\nCarried into the next descent. Click to leave it in the case." if carried else "\nClick to carry it into the next descent."))
		var nl := _lbl(rl.name, Vector2(x + 4, y + 102), Vector2(cw - 8, 24), 16, UiStyle.font_sc, Color("f4d890") if carried else CREAM, HORIZONTAL_ALIGNMENT_CENTER)
		_shadow(nl)
		var sub := "for sale" if c.state == "sale" else ("carried" if carried else "in the case")
		var sl := _lbl(sub, Vector2(x + 4, y + 124), Vector2(cw - 8, 22), 14, UiStyle.font_it, Color("c8b8a0"), HORIZONTAL_ALIGNMENT_CENTER)
		_shadow(sl)
	if cells.is_empty():
		var e := _lbl("The case is empty. Relics come home from the worlds, veiled.", Vector2(cs[0], cs[1] + cs[3] / 2 - 20), Vector2(cs[2], 40), 20, UiStyle.font_it, CREAM, HORIZONTAL_ALIGNMENT_CENTER)
		_shadow(e)
	# the altar cloth
	var cl2: Array = L.cloth
	_lbl("Carried into the next descent: %d of %d" % [Run.meta.carried.size(), Abbey.carry_cap()], Vector2(cl2[0], cl2[1] + 8), Vector2(cl2[2], 26), 19, UiStyle.font_sc, RUBRIC, HORIZONTAL_ALIGNMENT_CENTER)
	var names: Array = Run.meta.carried.map(func(i): return Run.C.relics[i].name)
	_lbl(", ".join(names) if not names.is_empty() else "Nothing. Click a relic in the case to lay it on the cloth.", Vector2(cl2[0] + 40, cl2[1] + 40), Vector2(cl2[2] - 80, 50), 17, UiStyle.font_it, INK, HORIZONTAL_ALIGNMENT_CENTER)

# ================================================================== Scriptorium: the Codex
func _build_scriptorium() -> void:
	var tabs := [["bestiary", "Bestiary"], ["worlds", "The Worlds"], ["truth", "The Truth"], ["chronicle", "Chronicle"]]
	var tb: Array = L.tabs
	for i in tabs.size():
		var t: Array = tabs[i]
		var b := TextureButton.new()
		b.texture_normal = load(UI + ("tab_sel" if tab == t[0] else "tab") + ".png")
		b.ignore_texture_size = true
		b.stretch_mode = TextureButton.STRETCH_SCALE
		b.position = Vector2(tb[0] - 30, tb[1] + i * 70)
		b.size = Vector2(170, 62)
		b.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		var key: String = t[0]
		b.pressed.connect(func(): tab = key; page = 0; sel = {}; refresh())
		body.add_child(b)
		var l := _lbl(t[1], Vector2(6, 0), Vector2(150, 58), 17, UiStyle.font_sc, Color("f4e4c4"), HORIZONTAL_ALIGNMENT_CENTER, b)
		l.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	call("_codex_" + tab)

func _list_page(lp: Array, items: Array, label: Callable, pick: Callable, is_sel: Callable, rows := 14) -> void:
	var start := clampi(page, 0, max(0, items.size() - 1)) / rows * rows
	for i in range(start, min(items.size(), start + rows)):
		var it = items[i]
		var y: float = lp[1] + 52 + (i - start) * 40
		var r := _row(Vector2(lp[0] - 6, y - 2), Vector2(lp[2] + 12, 38), func(): pick.call(it), is_sel.call(it))
		var lab: Array = label.call(it)
		_lbl(lab[0], Vector2(lp[0] + 4, y + 4), Vector2(lp[2] - 200, 28), 18, UiStyle.font_sc, lab[1])
		_lbl(lab[2], Vector2(lp[0] + lp[2] - 190, y + 6), Vector2(160, 26), 14, UiStyle.font_it, BROWN, HORIZONTAL_ALIGNMENT_RIGHT)
	if items.size() > rows:
		var cur := start / rows
		_btn("‹", Vector2(lp[0], lp[1] + 52 + rows * 40 + 4), Vector2(54, 38), func(): page = max(0, (cur - 1) * rows); refresh(), cur > 0, "Previous page", 28)
		_lbl("%d / %d" % [cur + 1, int(ceil(items.size() / float(rows)))], Vector2(lp[0] + 50, lp[1] + 56 + rows * 40), Vector2(80, 26), 16, UiStyle.font_sc, BROWN, HORIZONTAL_ALIGNMENT_CENTER)
		_btn("›", Vector2(lp[0] + 136, lp[1] + 52 + rows * 40 + 4), Vector2(54, 38), func(): page = (cur + 1) * rows; refresh(), start + rows < items.size(), "Next page", 28)

func _codex_bestiary() -> void:
	var lp: Array = L.left
	var rp: Array = L.right
	_head("Bestiary", Vector2(lp[0], lp[1] - 6), lp[2], RUBRIC, 30)
	var foes := []
	var opened: Array = Run.meta.get("doors", ["drowned"])
	for wk in Data.STORY.order:
		if not (opened.has(wk) or Run.all_cleared()):
			continue
		var w: Dictionary = Data.WORLDS[wk]
		for k in w.foes + w.elites + w.bosses:
			if not foes.has(k):
				foes.append(k)
	var seen := foes.filter(func(k): return Abbey.codex_depth(k) > 0).size()
	_lbl("%d of %d entries begun" % [seen, foes.size()], Vector2(lp[0], lp[1] + 26), Vector2(lp[2], 22), 15, UiStyle.font_it, BROWN, HORIZONTAL_ALIGNMENT_CENTER)
	_list_page(lp, foes, func(k): var d: int = Abbey.codex_depth(k); return [Data.ENEMIES[k].name if d > 0 else "· unrecorded ·", INK if d > 0 else BROWN, Data.WORLDS[Data.ENEMIES[k].world].name.replace("The ", "") if d > 0 else ""],
		func(k): sel = {"kind": "foe", "key": k}; refresh(), func(k): return sel.get("key", "") == k)
	if sel.get("kind", "") != "foe":
		_lbl("Brother Lucan writes down every thing the company meets. Choose an entry.", Vector2(rp[0] + 20, rp[1] + 200), Vector2(rp[2] - 40, 80), 19, UiStyle.font_it, BROWN, HORIZONTAL_ALIGNMENT_CENTER)
		return
	var k: String = sel.key
	var e: Dictionary = Data.ENEMIES[k]
	var d := Abbey.codex_depth(k)
	var fk: Array = Abbey.codex_foe(k)
	if d == 0:
		_lbl("No one has come back from meeting this.", Vector2(rp[0] + 20, rp[1] + 200), Vector2(rp[2] - 40, 80), 20, UiStyle.font_it, BROWN, HORIZONTAL_ALIGNMENT_CENTER)
		return
	_head(e.name, Vector2(rp[0], rp[1] - 4), rp[2], RUBRIC, 34)
	_lbl("%s · %s · met %d, slain %d" % [Data.WORLDS[e.world].name, {"foe": "foe", "elite": "elite", "boss": "ruler"}.get(e.get("tier", "foe"), "foe"), int(fk[0]), int(fk[1])], Vector2(rp[0], rp[1] + 44), Vector2(rp[2], 24), 16, UiStyle.font_it, BROWN, HORIZONTAL_ALIGNMENT_CENTER)
	_lbl("Health %d · Armour %d" % [int(e.hp), int(e.armor)], Vector2(rp[0], rp[1] + 76), Vector2(rp[2], 24), 19, UiStyle.font_sc, INK, HORIZONTAL_ALIGNMENT_CENTER)
	# Lucan's drawing of it, in sepia ink
	var fp := "res://assets/art/rigs/%s/full.png" % k
	if ResourceLoader.exists(fp):
		var dr := TextureRect.new()
		dr.texture = load(fp)
		dr.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		dr.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		dr.position = Vector2(rp[0] + rp[2] / 2 - 180, rp[1] + 100)
		dr.size = Vector2(360, 230)
		dr.self_modulate = Color(0.62, 0.48, 0.34, 0.9) if d >= 2 else Color(0.2, 0.15, 0.1, 0.55)
		dr.mouse_filter = Control.MOUSE_FILTER_IGNORE
		body.add_child(dr)
	if d >= 2:
		_rich("[i]%s[/i]" % e.get("lore", ""), Vector2(rp[0] + 20, rp[1] + 340), Vector2(rp[2] - 40, 100), 16)
	else:
		_lbl("Slay one, and Lucan can write what it is.", Vector2(rp[0] + 20, rp[1] + 330), Vector2(rp[2] - 40, 60), 17, UiStyle.font_it, BROWN, HORIZONTAL_ALIGNMENT_CENTER)
	var res: Dictionary = e.get("resist", {})
	if d >= 3:
		var parts := []
		for el in res:
			parts.append("%s %s" % [str(el).capitalize(), ("resists" if float(res[el]) < 1.0 else "suffers") if res[el] is float or res[el] is int else str(res[el])])
		_lbl("Courses: " + (", ".join(parts) if not parts.is_empty() else "no element troubles it more than another."), Vector2(rp[0] + 20, rp[1] + 440), Vector2(rp[2] - 40, 70), 17, UiStyle.font_sc, RUBRIC, HORIZONTAL_ALIGNMENT_CENTER)
	else:
		_lbl("Its courses are unknown (slay %d, or commission a study)." % int(Abbey.A.scriptorium.reveal_kills), Vector2(rp[0] + 20, rp[1] + 440), Vector2(rp[2] - 40, 50), 16, UiStyle.font_it, BROWN, HORIZONTAL_ALIGNMENT_CENTER)
		_btn("Commission a study · %d" % int(Abbey.A.scriptorium.study), Vector2(rp[0] + rp[2] / 2 - 150, rp[1] + 500), Vector2(300, 44), func(): act(Abbey.study(k)), int(Run.meta.ostia) >= int(Abbey.A.scriptorium.study), "Lucan writes out everything the order knows of it.")

func _codex_worlds() -> void:
	var lp: Array = L.left
	var rp: Array = L.right
	_head("The Worlds", Vector2(lp[0], lp[1] - 6), lp[2], RUBRIC, 30)
	var ws: Array = Data.STORY.order
	_list_page(lp, ws, func(wk): var i: int = ws.find(wk); var open: bool = Run.door_open(wk); return ["%s · %s" % [ROMAN[i], Data.WORLDS[wk].name if open else "Sealed"], INK if open else BROWN, "cleared" if Run.meta.cleared.has(wk) else ("open" if open else "")],
		func(wk): sel = {"kind": "world", "key": wk}; refresh(), func(wk): return sel.get("key", "") == wk, 15)
	if sel.get("kind", "") != "world":
		_lbl("Fifteen doors, one road. Choose a world.", Vector2(rp[0] + 20, rp[1] + 200), Vector2(rp[2] - 40, 60), 19, UiStyle.font_it, BROWN, HORIZONTAL_ALIGNMENT_CENTER)
		return
	var wk: String = sel.key
	var w: Dictionary = Data.WORLDS[wk]
	if not Run.door_open(wk):
		_head("Sealed", Vector2(rp[0], rp[1]), rp[2], RUBRIC, 34)
		_lbl("Clear %s to open it." % Data.WORLDS[Run.prev_on_road(wk)].name, Vector2(rp[0] + 20, rp[1] + 70), Vector2(rp[2] - 40, 60), 18, UiStyle.font_it, BROWN, HORIZONTAL_ALIGNMENT_CENTER)
		return
	_head(w.name, Vector2(rp[0], rp[1] - 4), rp[2], RUBRIC, 34)
	_lbl("Act %s, %s · %s and %s · %s" % [ROMAN[int(w.act) - 1], w.act_name, str(w.pair[0]).capitalize(), str(w.pair[1]).capitalize(), w.conjunction], Vector2(rp[0], rp[1] + 44), Vector2(rp[2], 24), 16, UiStyle.font_sc, BROWN, HORIZONTAL_ALIGNMENT_CENTER)
	_rich("%s\n\n[color=#7a2a1a][i]The road: %s[/i][/color]" % [w.blurb, w.lead], Vector2(rp[0] + 20, rp[1] + 84), Vector2(rp[2] - 40, 300), 18)
	var rulers: Array = w.bosses.map(func(k): return Data.ENEMIES[k].name if Abbey.codex_depth(k) > 0 else "unrecorded")
	_lbl(("Rulers: " if rulers.size() > 1 else "Ruler: ") + ", ".join(rulers), Vector2(rp[0] + 20, rp[1] + 420), Vector2(rp[2] - 40, 50), 18, UiStyle.font_sc, RUBRIC, HORIZONTAL_ALIGNMENT_CENTER)

func _codex_truth() -> void:
	var lp: Array = L.left
	var rp: Array = L.right
	_head("Pages of the Truth", Vector2(lp[0], lp[1] - 6), lp[2], RUBRIC, 30)
	var ws: Array = Data.STORY.order
	var cl: Array = Run.meta.get("cleared", [])
	_list_page(lp, ws, func(wk): var i: int = ws.find(wk); return ["Page %s" % ROMAN[i], INK if cl.has(wk) else BROWN, "written" if cl.has(wk) else "blank"],
		func(wk): sel = {"kind": "page", "key": wk}; refresh(), func(wk): return sel.get("key", "") == wk, 15)
	if sel.get("kind", "") != "page":
		_lbl("Every Tooth brought home, Lucan writes one sentence more.", Vector2(rp[0] + 20, rp[1] + 200), Vector2(rp[2] - 40, 60), 19, UiStyle.font_it, BROWN, HORIZONTAL_ALIGNMENT_CENTER)
		return
	var wk: String = sel.key
	_head("Page %s" % ROMAN[ws.find(wk)], Vector2(rp[0], rp[1]), rp[2], RUBRIC, 34)
	if cl.has(wk):
		_rich("[i]%s[/i]" % Abbey.A.pages[wk], Vector2(rp[0] + 30, rp[1] + 90), Vector2(rp[2] - 60, 300), 22)
	else:
		_lbl("The page is ruled and blank. Its Tooth is still out in the worlds.", Vector2(rp[0] + 20, rp[1] + 100), Vector2(rp[2] - 40, 60), 18, UiStyle.font_it, BROWN, HORIZONTAL_ALIGNMENT_CENTER)

func _codex_chronicle() -> void:
	var lp: Array = L.left
	var rp: Array = L.right
	_head("The Chronicle", Vector2(lp[0], lp[1] - 6), lp[2], RUBRIC, 30)
	var m: Dictionary = Run.meta
	var lines := [
		"Descents begun: %d" % int(m.get("runs", 0)),
		"Worlds cleared: %d of 15" % m.get("cleared", []).size(),
		"Deepest step: %d" % int(m.get("best_depth", 0)),
		"Victories: %d" % int(m.get("wins", 0)),
		"Cards set down by Lucan: %d" % m.codex.cards.size(),
		"Foes recorded: %d" % m.codex.foes.size(),
	]
	_lbl("\n".join(lines), Vector2(lp[0] + 20, lp[1] + 60), Vector2(lp[2] - 40, 300), 20, UiStyle.font_sc, INK)
	_head("The Guests", Vector2(rp[0], rp[1] - 6), rp[2], RUBRIC, 30)
	var y: float = rp[1] + 56
	for h in m.roster.slice(0, 10):
		_lbl("%s, %s" % [h.name, _hero_line(h)], Vector2(rp[0] + 10, y), Vector2(rp[2] - 20, 24), 16, UiStyle.font_rm, INK)
		_lbl("%d descents" % int(h.get("descents", 0)), Vector2(rp[0] + 10, y + 22), Vector2(rp[2] - 20, 20), 14, UiStyle.font_it, BROWN)
		y += 52

# ================================================================== Chapter House: the charter
func _build_chapter() -> void:
	var lp: Array = L.left
	var rp: Array = L.right
	_head("Works and Callings", Vector2(lp[0], lp[1] - 10), lp[2], RUBRIC, 30)
	var us := Abbey.all_unlocks()
	var y: float = lp[1] + 40
	for id in us:
		var u: Dictionary = us[id]
		var have: bool = Run.meta.unlocked.has(id)
		_lbl(u.name, Vector2(lp[0] + 10, y), Vector2(lp[2] - 100, 24), 18, UiStyle.font_sc, INK if not have else Color("6a4a0c"))
		_lbl(u.get("text", "A new calling may sign the guest book."), Vector2(lp[0] + 10, y + 22), Vector2(lp[2] - 100, 22), 14, UiStyle.font_it, BROWN)
		var key: String = id
		if have:
			_lbl("signed", Vector2(lp[0] + lp[2] - 90, y + 10), Vector2(86, 24), 16, UiStyle.font_it, Color("6a4a0c"), HORIZONTAL_ALIGNMENT_CENTER)
		else:
			_seal(Vector2(lp[0] + lp[2] - 44, y + 20), str(u.cost), func(): act(Abbey.buy_unlock(key)), int(Run.meta.ostia) >= int(u.cost), "Have Aldric sign it into the charter for %d ostia." % u.cost, 42)
		y += 47
	_head("The Vows", Vector2(rp[0], rp[1] - 10), rp[2], RUBRIC, 30)
	_lbl("Taken here, they bind every descent. %d of 15 may be sworn." % Run.asc_max(), Vector2(rp[0], rp[1] + 30), Vector2(rp[2], 22), 15, UiStyle.font_it, BROWN, HORIZONTAL_ALIGNMENT_CENTER)
	y = rp[1] + 62
	for i in Run.C.ascension.size():
		var a: Dictionary = Run.C.ascension[i]
		var sworn: bool = Run.meta.vows.has(a.id)
		var open: bool = i < Run.asc_max()
		var vid: String = a.id
		var r := _row(Vector2(rp[0] - 4, y - 2), Vector2(rp[2] + 8, 36), func(): act(Abbey.toggle_vow(vid)), sworn, a.text if open else "Win a descent to be trusted with this vow.")
		r.disabled = not open
		var mark := TextureRect.new()
		mark.texture = load(UI + ("seal.png" if sworn else "seal_off.png"))
		mark.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		mark.position = Vector2(rp[0] + 2, y + 2)
		mark.size = Vector2(28, 28)
		mark.modulate.a = 1.0 if sworn else (0.5 if open else 0.2)
		mark.mouse_filter = Control.MOUSE_FILTER_IGNORE
		body.add_child(mark)
		_lbl("%s · %s" % [ROMAN[i], a.name], Vector2(rp[0] + 40, y + 4), Vector2(250, 26), 17, UiStyle.font_sc, (RUBRIC if sworn else INK) if open else BROWN)
		_lbl(a.text, Vector2(rp[0] + 280, y + 6), Vector2(rp[2] - 300, 26), 14, UiStyle.font_it, BROWN if open else Color(0.36, 0.28, 0.21, 0.85))
		y += 37

