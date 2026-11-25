extends SceneTree
# Usage: godot --path . --script res://tests/shot.gd -- <mode> <out.png>
func _initialize() -> void:
	SaveIO.dir = "user://test_saves"
	var args := OS.get_cmdline_user_args()
	var mode: String = args[0] if args.size() > 0 else "combat"
	var out: String = args[1] if args.size() > 1 else "/tmp/shot.png"
	root.size = Vector2i(1600, 1000)
	var m = load("res://scenes/main.tscn").instantiate()
	root.add_child(m)
	await process_frame
	if mode == "hub":
		# ROAD=n: the first n worlds on the road are cleared (in the test save folder, removed afterwards)
		var n := int(OS.get_environment("ROAD")) if OS.get_environment("ROAD") != "" else 4
		var order: Array = Data.STORY.order
		Run.meta = {"ostia": 412, "unlocked": [], "wins": n, "runs": n, "best_depth": 7, "doors": order.slice(0, min(n + 1, 15)), "cleared": order.slice(0, n)}
		Run.meta_save()
		m.run_ui.hub_world = order[min(n, 14)]
		m.run_ui.visible = true
		m.run_ui.show_hub()
		await process_frame
		await process_frame
		SaveIO.remove(Run.meta_path())
	elif mode == "map" or mode == "camp" or mode == "sub":
		m.run_ui._begin_run()
		if mode == "camp":
			m.run_ui.show_waypoint()
		if mode == "sub":
			Run.r.pending.append({"kind": "subclass", "hero": 0})
			m.run_ui.show_reward()
	elif mode != "menu":
		m._start_encounter(int(OS.get_environment("ENC")) if OS.get_environment("ENC") != "" else 3)
		await process_frame
		if mode == "combat" or mode == "target":
			var h = m.s.heroes
			var e = m.s.enemies
			m.set_active(h[2].id)
			m.on_card_clicked(h[2].id, 0)
			if not m.targeting.is_empty():
				m.on_unit_clicked(m.valid_targets[0])
			m.set_active(h[0].id)
			m.on_card_clicked(h[0].id, 0)
			if not m.targeting.is_empty():
				m.on_unit_clicked(m.valid_targets[0])
			m.set_active(h[1].id)
			if mode == "target":
				m.on_card_clicked(h[1].id, 0)
		if mode == "resolve":
			m.on_card_clicked(m.s.heroes[0].id, 0)
			if not m.targeting.is_empty():
				m.on_unit_clicked(m.valid_targets[0])
			m._commit()
			for i in 600:
				await process_frame
				if not m.resolving: break
	if mode == "anim":
		m._start_encounter(3)
		for i in 5:
			await process_frame
		var h = m.s.heroes
		for hi in [0, 2]:
			m.set_active(h[hi].id)
			for ci in h[hi].hand.size():
				var before: int = m.plan.size()
				m.on_card_clicked(h[hi].id, ci)
				if not m.targeting.is_empty():
					m.on_unit_clicked(m.valid_targets[0])
				if m.plan.size() > before:
					break
		m._commit()
		var shots := []
		var t0 := Time.get_ticks_msec()
		for k in 9:
			while Time.get_ticks_msec() - t0 < 200 + k * 160:
				await process_frame
			shots.append(root.get_texture().get_image())
		var strip := Image.create(800 * 3, 500 * 3, false, Image.FORMAT_RGBA8)
		for k in 9:
			var im: Image = shots[k]
			im.resize(800, 500)
			strip.blit_rect(im, Rect2i(0, 0, 800, 500), Vector2i((k % 3) * 800, int(k / 3) * 500))
		strip.save_png(out)
		print("saved ", out)
		quit()
		return
	for i in 30:
		await process_frame
	var img := root.get_texture().get_image()
	img.save_png(out)
	print("saved ", out)
	quit()

