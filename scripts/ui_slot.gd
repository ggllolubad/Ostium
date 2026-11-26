class_name UiSlot
extends Panel
## A slot on the round timeline. Player slots can be dragged to reorder and right-clicked to remove.

var main: Node
var index := -1
var is_player := true
var reason := ""

func setup(m: Node, i: int, player: bool, title: String, sub: String, badge: String, badge_col: Color, border: Color, why: String, w := 176.0, art := "") -> void:
	## A chip on the Ordo strip. Player chips lead with the card's own art; when the chain is long they shrink to the
	## art and its numeral (the name stays in the tooltip). Foe chips shrink the same way. Textured, never flat.
	main = m
	index = i
	is_player = player
	reason = why
	custom_minimum_size = Vector2(w, 60)
	size = custom_minimum_size
	add_theme_stylebox_override("panel", UiStyle.tex_box("slip_sel" if (why != "" or not player) else "btn_parch", 10, Vector2(4, 4)))
	mouse_filter = Control.MOUSE_FILTER_STOP
	tooltip_text = (title + "\n" + sub + (("\nWill fizzle: " + why) if why != "" else "") + ("\nDrag to reorder · right-click to remove" if player else ""))
	var compact := w < 150.0
	var x := 6.0
	if player and art != "" and ResourceLoader.exists(art):
		var aw: float = (w - 12.0) if compact else 70.0
		var tr := TextureRect.new()
		var tex: Texture2D = load(art)
		var at := AtlasTexture.new()
		at.atlas = tex
		var ah := 48.0
		var rw: float = min(tex.get_width(), tex.get_height() * aw / ah)
		at.region = Rect2((tex.get_width() - rw) / 2.0, 0, rw, tex.get_height())
		tr.texture = at
		tr.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		tr.stretch_mode = TextureRect.STRETCH_SCALE
		tr.position = Vector2(6, 6)
		tr.size = Vector2(aw, ah)
		tr.mouse_filter = Control.MOUSE_FILTER_IGNORE
		add_child(tr)
		var fr := ReferenceRect.new()
		fr.border_color = UiStyle.INK
		fr.border_width = 1.5
		fr.editor_only = false
		fr.position = tr.position
		fr.size = tr.size
		fr.mouse_filter = Control.MOUSE_FILTER_IGNORE
		add_child(fr)
		x = 6.0 + aw + 6.0
	# the numeral, in the hero's colour (player) or the intent's (foe), as a small inked disc on the corner
	var bp := PanelContainer.new()
	var bsb := UiStyle.box(badge_col, UiStyle.INK, 2)
	bsb.set_corner_radius_all(13)
	bp.add_theme_stylebox_override("panel", bsb)
	bp.custom_minimum_size = Vector2(26, 26)
	bp.position = Vector2(2, 2) if player else Vector2(6, 17)
	bp.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var bl := UiStyle.label(badge, 14, UiStyle.font_sc if player else UiStyle.font_bl, UiStyle.INK if player else UiStyle.CREAM)
	bl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	bl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	bp.add_child(bl)
	add_child(bp)
	if not player:
		x = 38.0
	if compact and player:
		return
	var tw: float = w - x - 6.0
	if tw < 30.0:
		return
	var t := UiStyle.label(title, 15 if not compact else 13, UiStyle.font_sc)
	t.clip_text = true
	t.position = Vector2(x, 7)
	t.size = Vector2(tw, 22)
	add_child(t)
	var sl := UiStyle.label(sub if why == "" else "fizzles: " + why, 13, UiStyle.font_it, UiStyle.RED_D if why != "" else UiStyle.BROWN)
	sl.clip_text = true
	sl.position = Vector2(x, 30)
	sl.size = Vector2(tw, 22)
	add_child(sl)

func _get_drag_data(_pos: Vector2) -> Variant:
	if not is_player or main.resolving:
		return null
	var prev := duplicate(0)
	prev.modulate = Color(1, 1, 1, 0.8)
	set_drag_preview(prev)
	return {"slot": index}

func _can_drop_data(_pos: Vector2, data: Variant) -> bool:
	return is_player and data is Dictionary and data.has("slot")

func _drop_data(_pos: Vector2, data: Variant) -> void:
	main.move_slot(data.slot, index)

func _gui_input(ev: InputEvent) -> void:
	if ev is InputEventMouseButton and ev.pressed and ev.button_index == MOUSE_BUTTON_RIGHT and is_player:
		main.remove_slot(index)

func _notification(what: int) -> void:
	if what == NOTIFICATION_MOUSE_ENTER:
		main.highlight_slot(index if is_player else -100 - index, true)
	elif what == NOTIFICATION_MOUSE_EXIT:
		main.highlight_slot(-1, false)

