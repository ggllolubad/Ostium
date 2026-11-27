class_name SettingsPanel
extends Control
## The settings sheet: a textured parchment panel over a dimmed screen. For now it holds the display mode;
## audio and gameplay rows join it later. Opened from the title menu, the doors screen, or F11 / Alt+Enter toggles
## the display mode directly. Settings are saved with UiStyle.save_settings().

const MODES := [["windowed", "Windowed"], ["fullscreen", "Fullscreen (borderless)"]]

static func display_mode() -> String:
	return String(UiStyle.settings.get("display", "windowed"))

## Applies the saved display mode to the game window.
static func apply_display() -> void:
	if DisplayServer.get_name() == "headless":
		return
	if display_mode() == "fullscreen":
		DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_FULLSCREEN)
	else:
		DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_MAXIMIZED)

static func set_display(mode: String) -> void:
	UiStyle.settings["display"] = mode
	UiStyle.save_settings()
	apply_display()

static func toggle_display() -> void:
	set_display("windowed" if display_mode() == "fullscreen" else "fullscreen")

## Opens the sheet on top of `host`.
static func open(host: Node) -> SettingsPanel:
	var p := SettingsPanel.new()
	p.z_index = 90
	host.add_child(p)
	p._build()
	return p

func _build() -> void:
	set_anchors_preset(Control.PRESET_FULL_RECT)
	size = Vector2(1600, 1000)
	mouse_filter = Control.MOUSE_FILTER_STOP
	var dim := ColorRect.new()
	dim.color = Color(0.05, 0.03, 0.02, 0.6)
	dim.size = size
	add_child(dim)
	var sheet := Panel.new()
	sheet.add_theme_stylebox_override("panel", UiStyle.tex_box("btn_parch", 14))
	sheet.position = Vector2(520, 300)
	sheet.size = Vector2(560, 360)
	add_child(sheet)
	var t := UiStyle.label("Settings", 38, UiStyle.font_bl, UiStyle.RED_D)
	t.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	t.position = Vector2(0, 22)
	t.size = Vector2(560, 50)
	sheet.add_child(t)
	var r := UiStyle.label("Display", 22, UiStyle.font_sc, UiStyle.INK)
	r.position = Vector2(40, 106)
	r.size = Vector2(480, 30)
	sheet.add_child(r)
	var y := 144.0
	for m in MODES:
		var b := Button.new()
		b.text = m[1]
		b.position = Vector2(40, y)
		b.size = Vector2(480, 50)
		b.add_theme_font_override("font", UiStyle.font_sc)
		b.add_theme_font_size_override("font_size", 20)
		if display_mode() == m[0]:
			b.add_theme_stylebox_override("normal", UiStyle.tex_box("slip_sel"))
			b.add_theme_stylebox_override("hover", UiStyle.tex_box("slip_sel"))
			b.add_theme_color_override("font_color", UiStyle.RED_D)
		var mode: String = m[0]
		b.pressed.connect(func(): SettingsPanel.set_display(mode); _rebuild())
		sheet.add_child(b)
		y += 58
	var hint := UiStyle.label("F11 or Alt+Enter switches at any time.", 15, UiStyle.font_it, UiStyle.BROWN)
	hint.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	hint.position = Vector2(0, 264)
	hint.size = Vector2(560, 24)
	sheet.add_child(hint)
	var c := Button.new()
	c.text = "Close"
	c.position = Vector2(200, 296)
	c.size = Vector2(160, 44)
	c.pressed.connect(queue_free)
	sheet.add_child(c)

func _rebuild() -> void:
	for ch in get_children():
		ch.queue_free()
	_build()

func _unhandled_input(ev: InputEvent) -> void:
	if ev is InputEventKey and ev.pressed and ev.keycode == KEY_ESCAPE:
		queue_free()
		get_viewport().set_input_as_handled()
