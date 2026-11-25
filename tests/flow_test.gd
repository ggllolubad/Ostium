extends SceneTree
# The whole abbey loop through the real scene: title, the pan down, every room and shop panel (pressing their
# buttons at random), the company, the church, a descent, a death, the return home. Fails on any runtime error.
# Usage: godot --path . --rendering-driver opengl3 --script res://tests/flow_test.gd

var fails := 0

func ok(c: bool, what: String) -> void:
	print(("ok   " if c else "FAIL ") + what)
	if not c:
		fails += 1

func wait(n := 3) -> void:
	for i in n:
		await process_frame

func _initialize() -> void:
	root.size = Vector2i(1600, 1000)
	SaveIO.dir = "user://test_saves"
	SaveIO.remove(Run.meta_path())
	SaveIO.remove(Run.run_path())
	var m = load("res://scenes/main.tscn").instantiate()
	root.add_child(m)
	await wait(5)
	var hub: Hub = m.hub
	ok(hub.title_ui != null, "title screen up")
	Engine.time_scale = 20.0
	hub._play()
	await wait(30)
	var t0 := Time.get_ticks_msec()
	while not hub.input_on and Time.get_ticks_msec() - t0 < 8000:
		await process_frame
	Engine.time_scale = 1.0
	ok(hub.input_on, "pan ends in the garth with input on")
	ok(hub.hud.visible, "ostia dish shown")
	Run.meta.ostia = 900
	var rng := RandomNumberGenerator.new()
	rng.seed = 7
	var pressed := 0
	for room in ["guesthouse", "smithy", "infirmarium", "almonry", "cellarium", "sacristy", "scriptorium", "chapter", "company"]:
		if room == "company":
			hub.show_garth()
		else:
			hub.show_room(room)
		await wait()
		hub.open_panel(room)
		await wait()
		ok(hub.panel != null and not hub.hud.visible, "%s panel open, dish hidden" % room)
		for k in 14:
			if hub.panel == null:
				hub.open_panel(room)
				await wait()
			var btns := []
			_collect(hub.panel, btns)
			btns = btns.filter(func(b): return b.visible and not b.disabled and b.is_inside_tree())
			if btns.is_empty():
				break
			var b: BaseButton = btns[rng.randi() % btns.size()]
			b.emit_signal("pressed")
			pressed += 1
			await wait(2)
		if hub.panel != null:
			hub.close_panel()
			await wait()
		ok(hub.panel == null and hub.hud.visible, "%s panel closed, dish back" % room)
	print("pressed %d buttons" % pressed)
	# a press may have started a fade (to the church, say): let it finish before the test moves on
	var t1 := Time.get_ticks_msec()
	while not hub.input_on and Time.get_ticks_msec() - t1 < 3000:
		await process_frame
	ok(Run.meta.roster.size() >= 2, "roster survives the shops")
	# a company of at least two
	for h in Run.meta.roster:
		if Run.meta.party.size() >= 2:
			break
		if Abbey.can_descend(h) and not Run.meta.party.has(int(h.id)):
			Abbey.toggle_party(h)
	if Run.meta.party.size() < 2:
		for h in Run.meta.roster:
			h.shattered = 0
			if Run.meta.party.size() < 2 and not Run.meta.party.has(int(h.id)):
				Abbey.toggle_party(h)
	Abbey.save()
	ok(Abbey.party_heroes().size() >= 2, "company of %d" % Abbey.party_heroes().size())
	# the church, the commission, the descent
	m.open_church()
	await wait()
	m.run_ui.show_prepare()
	await wait()
	m.run_ui._begin_run()
	await wait()
	ok(not Run.r.is_empty() and Run.r.has("map"), "descent begun")
	var ids: Array = Run.r.heroes.map(func(h): return int(h.get("id", -1)))
	ok(not ids.has(-1), "heroes in the run carry roster ids")
	# the first hero falls; the run ends in defeat
	Run.r.heroes[0].hp = 0
	Run.r.heroes[0]["dead"] = true
	Run.r.outcome = "defeat"
	Run.r.gold = 120
	var before := int(Run.meta.ostia)
	m.run_ui.show_end()
	await wait()
	var fallen := Abbey.hero(ids[0])
	ok(not fallen.is_empty() and int(fallen.get("shattered", 0)) > 0, "the fallen come home Shattered")
	ok(int(Run.meta.ostia) > before, "gold turned to ostia (%d -> %d)" % [before, int(Run.meta.ostia)])
	m._show_menu()
	await wait(5)
	ok(hub.visible and not m.run_ui.visible, "back in the abbey")
	ok(hub.panel == null, "no panel left open")
	print("FAILS: %d" % fails)
	quit()

func _collect(n: Node, out: Array) -> void:
	for c in n.get_children():
		if c is BaseButton:
			out.append(c)
		_collect(c, out)

