class_name UiSlot
extends Panel
## A slot on the round timeline. Player slots can be dragged to reorder and right-clicked to remove.

var main: Node
var index := -1
var is_player := true
var reason := ""

func setup(m: Node, i: int, player: bool, title: String, sub: String, badge: String, badge_col: Color, border: Color, why: String) -> void:
	main = m
	index = i
	is_player = player
	reason = why
	custom_minimum_size = Vector2(176, 60)
	var sb := UiStyle.box(UiStyle.PARCH if player else UiStyle.FOE_SLOT, UiStyle.RED if why != "" else border, 3 if why != "" else 2)
	add_theme_stylebox_override("panel", sb)
	mouse_filter = Control.MOUSE_FILTER_STOP
	tooltip_text = (title + "\n" + sub + (("\nWill fizzle: " + why) if why != "" else "") + ("\nDrag to reorder · right-click to remove" if player else ""))
	var h := HBoxContainer.new()
	h.position = Vector2(6, 6)
	h.size = Vector2(164, 48)
	h.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(h)
	var bp := PanelContainer.new()
	var bsb := UiStyle.box(badge_col, UiStyle.INK, 2)
	if player:
		bsb.set_corner_radius_all(16)
	bp.add_theme_stylebox_override("panel", bsb)
	bp.custom_minimum_size = Vector2(32, 32)
	bp.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	bp.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var bl := UiStyle.label(badge, 16, UiStyle.font_sc if player else UiStyle.font_bl, UiStyle.INK if player else UiStyle.CREAM)
	bl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	bp.add_child(bl)
	h.add_child(bp)
	var v := VBoxContainer.new()
	v.add_theme_constant_override("separation", -2)
	v.mouse_filter = Control.MOUSE_FILTER_IGNORE
	v.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	var t := UiStyle.label(title, 16, UiStyle.font_sc)
	t.clip_text = true
	v.add_child(t)
	var sl := UiStyle.label(sub if why == "" else "fizzles: " + why, 13, UiStyle.font_it, UiStyle.RED_D if why != "" else UiStyle.BROWN)
	sl.clip_text = true
	v.add_child(sl)
	h.add_child(v)

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

