class_name UiStyle
extends RefCounted
## Shared palette, fonts and widget helpers for the Living Manuscript look.

# Palette. Static so the light/dark theme can swap it at start-up (see apply_theme).
static var INK := Color("2b1d12")
static var PARCH := Color("ecdfc2")
static var PARCH_L := Color("f3e8cf")
static var PARCH_D := Color("e6d6b0")
static var HI := Color("f7eedb")
static var RED := Color("c4573f")
static var RED_D := Color("9c3d2b")
static var BLUE := Color("5a78a6")
static var GOLD := Color("d6ad52")
static var GOLD_D := Color("a9822f")
static var GREEN := Color("62804f")
static var BROWN := Color("6f5036")
static var VIOLET := Color("8e7aa6")
static var FOE_SLOT := Color("efd9cf")
static var DIM := Color(0.92, 0.87, 0.76, 0.93)
static var PAGE_TINT := Color(1, 1, 1)
static var DISABLED := Color("e2d6bb")
static var DISABLED_INK := Color("9a8a70")
const CREAM := Color("f7eedb")
static var dark := false
static var settings := {}

const SETTINGS_FILE := "settings.json"

static func load_settings() -> void:
	var v := SaveIO.read_json(SaveIO.path(SETTINGS_FILE))
	if not v.is_empty():
		settings = v
	apply_theme(settings.get("theme", "light") == "dark")

static func save_settings() -> void:
	SaveIO.write_json(SaveIO.path(SETTINGS_FILE), settings)

static func apply_theme(is_dark: bool) -> void:
	dark = is_dark
	settings["theme"] = "dark" if is_dark else "light"
	if is_dark:
		INK = Color("e6dbc3"); PARCH = Color("2c2824"); PARCH_L = Color("36312c"); PARCH_D = Color("25211e"); HI = Color("423b34")
		RED = Color("c4573f"); RED_D = Color("e08a70"); BLUE = Color("93b3da"); GOLD = Color("d6ad52"); GOLD_D = Color("d9b25e")
		GREEN = Color("9ab884"); BROWN = Color("bfa284"); VIOLET = Color("bba9d9"); FOE_SLOT = Color("3a2b28")
		DIM = Color(0.08, 0.07, 0.06, 0.93); PAGE_TINT = Color(0.26, 0.24, 0.22); DISABLED = Color("2a2622"); DISABLED_INK = Color("7a6e60")
	else:
		INK = Color("2b1d12"); PARCH = Color("ecdfc2"); PARCH_L = Color("f3e8cf"); PARCH_D = Color("e6d6b0"); HI = Color("f7eedb")
		RED = Color("c4573f"); RED_D = Color("9c3d2b"); BLUE = Color("5a78a6"); GOLD = Color("d6ad52"); GOLD_D = Color("a9822f")
		GREEN = Color("62804f"); BROWN = Color("6f5036"); VIOLET = Color("8e7aa6"); FOE_SLOT = Color("efd9cf")
		DIM = Color(0.92, 0.87, 0.76, 0.93); PAGE_TINT = Color(1, 1, 1); DISABLED = Color("e2d6bb"); DISABLED_INK = Color("9a8a70")

static func rarity_col(r: String) -> Color:
	return {"S": BROWN, "K": BROWN, "C": INK, "U": BLUE, "R": GOLD_D, "X": VIOLET, "F": GREEN, "Curse": RED_D}.get(r, INK)

static var font_rm: FontFile
static var font_it: FontFile
static var font_sc: FontFile
static var font_bl: FontFile

static func load_fonts() -> void:
	if font_rm != null:
		return
	font_rm = load("res://assets/fonts/IMFeENrm28P.ttf")
	font_it = load("res://assets/fonts/IMFeENit28P.ttf")
	font_sc = load("res://assets/fonts/IMFeENsc28P.ttf")
	font_bl = load("res://assets/fonts/UnifrakturMaguntia-Book.ttf")

static func make_theme() -> Theme:
	load_fonts()
	var t := Theme.new()
	t.default_font = font_rm
	t.default_font_size = 17
	t.set_color("font_color", "Label", INK)
	t.set_color("default_color", "RichTextLabel", INK)
	t.set_font("normal_font", "RichTextLabel", font_rm)
	t.set_font("italics_font", "RichTextLabel", font_it)
	t.set_font("bold_font", "RichTextLabel", font_sc)
	# textured parchment buttons (tools/art/ui_tex.py), not flat fills
	for st in ["normal", "hover", "pressed", "disabled"]:
		t.set_stylebox(st, "Button", tex_box({"normal": "btn_parch", "hover": "btn_parch_hover", "pressed": "btn_parch_down", "disabled": "btn_parch_off"}[st]))
	var fb := box(PARCH_L, RED, 2)
	fb.draw_center = false
	t.set_stylebox("focus", "Button", fb)
	t.set_color("font_color", "Button", INK)
	t.set_color("font_hover_color", "Button", INK)
	t.set_color("font_pressed_color", "Button", INK)
	t.set_color("font_disabled_color", "Button", DISABLED_INK)
	t.set_font("font", "Button", font_sc)
	t.set_font_size("font_size", "Button", 17)
	var tip := box(PARCH_L, INK, 2)
	tip.content_margin_left = 10
	tip.content_margin_right = 10
	tip.content_margin_top = 6
	tip.content_margin_bottom = 6
	t.set_stylebox("panel", "TooltipPanel", tip)
	t.set_color("font_color", "TooltipLabel", INK)
	t.set_font("font", "TooltipLabel", font_rm)
	t.set_font_size("font_size", "TooltipLabel", 16)
	return t

static func box(bg: Color, border: Color, w: int, shadow := false) -> StyleBoxFlat:
	var b := StyleBoxFlat.new()
	b.bg_color = bg
	b.border_color = border
	b.set_border_width_all(w)
	b.content_margin_left = 6
	b.content_margin_right = 6
	b.content_margin_top = 4
	b.content_margin_bottom = 4
	if shadow:
		b.shadow_color = INK
		b.shadow_size = 0
		b.shadow_offset = Vector2(4, 5)
	return b

static var _icons := {}
## Engraved icon for an item, status, element, node or supply (res://assets/art/icons/<id>.png); null if none.
static func icon(id: String) -> Texture2D:
	if not _icons.has(id):
		var p := "res://assets/art/icons/%s.png" % id
		_icons[id] = load(p) if ResourceLoader.exists(p) else null
	return _icons[id]

## BBCode image tag for an icon, or "" when the icon does not exist.
static func icon_tag(id: String, px := 22) -> String:
	return "[img=%dx%d]res://assets/art/icons/%s.png[/img]" % [px, px, id] if icon(id) != null else ""

## A TextureRect showing an icon, for panels.
static func icon_rect(id: String, pos: Vector2, px := 64) -> TextureRect:
	var t := TextureRect.new()
	t.texture = icon(id)
	t.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	t.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	t.position = pos
	t.size = Vector2(px, px)
	t.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return t

## A 9-slice textured box from assets/art/ui/tex/<name>.png.
static func tex_box(name: String, margin := 14, pad := Vector2(12, 6)) -> StyleBoxTexture:
	var sb := StyleBoxTexture.new()
	sb.texture = load("res://assets/art/ui/tex/%s.png" % name)
	sb.texture_margin_left = margin
	sb.texture_margin_right = margin
	sb.texture_margin_top = margin
	sb.texture_margin_bottom = margin
	sb.content_margin_left = pad.x
	sb.content_margin_right = pad.x
	sb.content_margin_top = pad.y
	sb.content_margin_bottom = pad.y
	return sb

## The red lacquered style for a main action (Descend, Play the Ordo).
static func red_button(b: Button) -> void:
	b.add_theme_stylebox_override("normal", tex_box("btn_red", 16))
	b.add_theme_stylebox_override("hover", tex_box("btn_red_hover", 16))
	b.add_theme_stylebox_override("pressed", tex_box("btn_red_down", 16))
	for c in ["font_color", "font_hover_color", "font_pressed_color"]:
		b.add_theme_color_override(c, HI)

static func label(text: String, size := 17, font: FontFile = null, color := INK) -> Label:
	load_fonts()
	var l := Label.new()
	l.text = text
	l.add_theme_font_size_override("font_size", size)
	l.add_theme_font_override("font", font if font != null else font_rm)
	l.add_theme_color_override("font_color", color)
	l.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return l

static func rich(size := 16) -> RichTextLabel:
	var r := RichTextLabel.new()
	r.bbcode_enabled = true
	r.fit_content = true
	r.scroll_active = false
	r.add_theme_font_size_override("normal_font_size", size)
	r.add_theme_font_size_override("italics_font_size", size)
	r.add_theme_font_size_override("bold_font_size", size)
	r.mouse_filter = Control.MOUSE_FILTER_PASS
	return r

static func cat_color(cat: String) -> Color:
	if cat == "attuned":
		return VIOLET
	return Data.ELEMENT_COLOR.get(cat, BROWN)

## Colours known keywords in card text and adds hover hints.
static func rules_bbcode(text: String) -> String:
	var out := text
	var words := {"Water": "water", "Fire": "fire", "Frost": "frost", "Lightning": "lightning", "Toxin": "toxin", "Void": "void"}
	for w in words:
		out = out.replace(w, "[color=#%s]%s[/color]" % [Data.ELEMENT_COLOR[words[w]].to_html(false), w])
	for k in ["Block", "Bleed", "Stun", "Mark", "Taunt", "Guard", "Riposte", "Momentum", "Focus", "Ward", "Armor", "Prime", "Echo", "Retain", "Exhaust", "Vulnerable"]:
		out = out.replace(k, "[b]%s[/b]" % k)
	return out

## Card text with every keyword underlined as a link (its definition shows on hover) and courses in their colours.
static var _kw_re: RegEx = null
static func rules_links(text: String) -> String:
	if _kw_re == null:
		var keys: Array = Data.KEYWORDS.keys()
		keys.sort_custom(func(a, b): return String(a).length() > String(b).length())
		_kw_re = RegEx.create_from_string("\\b(" + "|".join(keys) + ")\\b")
	var out := text
	var words := {"Water": "water", "Fire": "fire", "Frost": "frost", "Lightning": "lightning", "Toxin": "toxin", "Void": "void"}
	for w in words:
		out = out.replace(w, "[color=#%s]%s[/color]" % [Data.ELEMENT_COLOR[words[w]].to_html(false), w])
	return _kw_re.sub(out, "[url=$1]$1[/url]", true)

static func keyword_tip(card: Dictionary) -> String:
	var lines := [card.name + (" · cost X" if card.cost < 0 else " · cost %d" % card.cost), card.text]
	var seen := {}
	var probe: String = card.text + " " + " ".join(card.get("kw", []))
	if card.get("attr", "") == "stable":
		probe += " Stable"
	if card.get("attr", "") == "volatile":
		probe += " Volatile"
	for k in Data.KEYWORDS:
		if probe.find(k) >= 0 and not seen.has(k):
			seen[k] = true
			lines.append("%s: %s" % [k, Data.KEYWORDS[k]])
	for e in Data.ELEMENT_STATUS:
		var nm: String = e.capitalize()
		if probe.find(nm) >= 0:
			var st: String = Data.ELEMENT_STATUS[e]
			if Data.KEYWORDS.has(st) and not seen.has(st):
				seen[st] = true
				lines.append("%s (%s): %s" % [nm, st, Data.KEYWORDS[st]])
	if card.has("use"):
		lines.append("Use from rank %s%s" % [_r(card.use), (" · hits rank %s" % _r(card.hit)) if card.has("hit") else ""])
	return "\n".join(lines)

static func _r(a: Array) -> String:
	var p := []
	for x in a:
		p.append(str(x))
	return "-".join(p) if p.size() > 1 else (p[0] if p.size() == 1 else "-")

