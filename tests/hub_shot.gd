extends SceneTree
# Screenshots of the abbey: the title, the garth, each room, and every shop panel with some state in it.
# Usage: godot --path . --rendering-driver opengl3 --script res://tests/hub_shot.gd -- <outdir> [only]

var out := "/tmp/hub_shots"
var hub: Hub

func _initialize() -> void:
	var args := OS.get_cmdline_user_args()
	if args.size() > 0:
		out = args[0]
	var only: String = args[1] if args.size() > 1 else ""
	DirAccess.make_dir_recursive_absolute(out)
	root.size = Vector2i(1600, 1000)
	UiStyle.load_fonts()
	SaveIO.dir = "user://test_saves"
	SaveIO.remove(Run.meta_path())
	Run.meta_load()
	_seed_state()
	var main := Control.new()
	main.theme = UiStyle.make_theme()
	main.size = Vector2(1600, 1000)
	root.add_child(main)
	hub = Hub.new()
	hub.main = main
	main.add_child(hub)
	await process_frame
	if only == "" or only == "title":
		hub.show_title()
		await process_frame
		for c in hub.title_ui.get_children():
			c.modulate.a = 1.0
		await _shot("title_0")
		hub._set_pan(700.0)
		await _shot("title_mid")
		hub._set_pan(0.0)
		if hub.title_ui:
			hub.title_ui.queue_free()
			hub.title_ui = null
		hub.hud.visible = true
	hub.input_on = true
	if only == "" or only == "garth":
		hub.show_garth()
		await _shot("garth")
		hub._hover(Vector2(800, 330))
		await _shot("garth_hover")
	for room in ["smithy", "infirmarium", "almonry", "cellarium", "sacristy", "scriptorium", "chapter", "guesthouse"]:
		if only != "" and only != room and only != "panels":
			continue
		hub.show_room(room)
		if only != "panels":
			await _shot("room_" + room)
		hub.open_panel(room)
		await process_frame
		hub.panel.modulate.a = 1.0
		if room == "smithy":
			hub.panel.sel = {"kind": "armoury", "item": Run.meta.armoury[0]}
			hub.panel.refresh()
		if room == "scriptorium":
			hub.panel.sel = {"kind": "foe", "key": Data.WORLDS.drowned.foes[0]}
			hub.panel.refresh()
		await _shot("panel_" + room)
		hub.panel.queue_free()
		hub.panel = null
	if only == "" or only == "company" or only == "panels":
		hub.show_garth()
		hub.open_panel("company")
		await process_frame
		hub.panel.modulate.a = 1.0
		await _shot("panel_company")
	quit()

func _shot(name: String) -> void:
	for i in 5:
		await process_frame
	root.get_texture().get_image().save_png("%s/%s.png" % [out, name])
	print("saved ", name)

## A lived-in abbey: more guests, gear, runes, relics, wounds, a found relic still veiled, a cleared world.
func _seed_state() -> void:
	var m: Dictionary = Run.meta
	m.ostia = 340
	Abbey.buy_unlock("alchemist")
	m.ostia = 340
	Abbey.recruit(0)
	m.roster[0].injuries = ["broken_ribs"]
	m.roster[0].stress = 64
	m.roster[1].deck.append("dread")
	m.roster[1].stress = 112
	if m.roster.size() > 3:
		m.roster[3].shattered = 1
	for id in ["w_templar_hammer", "a_brigandine", "t_rosary", "w_notched_rapier", "a_hauberk"]:
		m.armoury.append({"id": id, "runes": []})
	m.armoury[0].temper = 1
	m.runes = ["r_iron", "r_blood", "r_wrath"]
	m.relics = {"rl_bell_clapper": "known", "rl_saints_finger": "known", "rl_drowned_lantern": "veiled"}
	m.carried = ["rl_bell_clapper"]
	m.provisions.food = 3
	m.provisions.light = 2
	m.provisions.belt = ["fl_heal", "fl_fire"]
	m.cleared = ["drowned"]
	m.doors = ["drowned", "mire"]
	m.vows = ["a_hp"]
	m.wins = 1
	for k in Data.WORLDS.drowned.foes:
		m.codex.foes[k] = [3, 2]
	m.ostia = 186
	Run.meta_save()

