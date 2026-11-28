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
	if mode == "garth" or mode == "guest":
		# the Abbey with the company's current figures; GUEST leaves the third hero in the guesthouse
		SaveIO.remove(Run.meta_path())
		Run.meta_load()
		if mode == "guest" and Run.meta.party.size() > 2:
			Run.meta.party = Run.meta.party.slice(0, 2)
			Run.meta_save()
		m.hub.visible = true
		if m.hub.title_ui:
			m.hub.title_ui.queue_free()
			m.hub.title_ui = null
		m.hub._set_pan(0.0)
		m.hub.hud.visible = true
		if mode == "garth":
			m.hub.show_garth()
		else:
			m.hub.show_room("guesthouse")
		for k in 30:
			await process_frame
		root.get_texture().get_image().save_png(out)
		print("saved ", out)
		quit()
		return
	if mode == "hub":
		# ROAD=n: the first n worlds on the road are cleared (in the test save folder, removed afterwards)
		var n := int(OS.get_environment("ROAD")) if OS.get_environment("ROAD") != "" else 4
		var order: Array = Data.STORY.order
		Run.meta = {"ostia": 412, "unlocked": [], "wins": n, "runs": n, "best_depth": 7, "doors": order.slice(0, min(n + 1, 15)), "cleared": order.slice(0, n)}
		Run.meta_save()
		m.run_ui.hub_world = order[min(n, 14)]
		m.hub.visible = false
		m.run_ui.visible = true
		m.run_ui.show_hub()
		await process_frame
		await process_frame
		SaveIO.remove(Run.meta_path())
	elif mode == "map" or mode == "map2" or mode == "camp" or mode == "sub" or mode == "prepare" or mode == "victory" or mode == "spoils" or mode == "legend" or mode == "scr":
		m.hub.visible = false
		m.run_ui.visible = true
		m.run_ui.hub_world = OS.get_environment("WORLD") if OS.get_environment("WORLD") != "" else "drowned"
		SaveIO.remove(Run.meta_path())   # a fresh abbey: the starting company
		Run.meta_load()
		if mode == "prepare":
			m.run_ui.show_prepare()
		else:
			var coms: Array = Data.COMMISSIONS.get(m.run_ui.hub_world, [])
			if not coms.is_empty():
				m.run_ui.hub_commission = coms[0].ruler
			m.run_ui._begin_run()
		for k in 6:
			await process_frame
		if mode == "map2":
			# a company four rooms in, with light spent on scouting: walked roads, rings, the ruler at the end
			for step in 4:
				var nx: Array = Run.next_nodes()
				Run.move_to(nx[step % nx.size()])
			Run.r.resolving = ""
			Run.r.pending = []
			Run.r.supplies.light += 1
			Run.scout()
			Run.scout()
			if OS.get_environment("REVEAL") != "":
				for nid in Run.r.map.nodes:
					Run.r.map.nodes[nid].revealed = true
			m.run_ui.show_map()
			for k in 4:
				await process_frame
		if mode == "scr":
			# any run screen by name, with a little of everything to show
			var ui = m.run_ui
			Run.r.gold = 240
			Run.r.runes = Run.C.runes.keys().slice(0, 2)
			Run.r.heroes[1].injuries = [Run.C.injuries.keys()[0]]
			Run.r.heroes[0].hp = int(Run.max_hp(Run.r.heroes[0]) * 0.6)
			Run.r.heroes[2].stress = 45
			var n: Dictionary = Run.node(Run.next_nodes()[0])
			match OS.get_environment("SCR"):
				"event": ui.show_event(n)
				"resolve":
					var e := Run.event_for(n)
					ui._resolve_option(n, e.options[0])
				"merchant": ui.show_merchant()
				"removal": ui._pick_removal(50, ui.show_map)
				"shrine": ui.show_shrine()
				"fieldcamp": ui.show_field_camp()
				"upgrade": ui._pick_upgrade(Run.r.heroes[0], ui.show_map)
				"forge": ui.show_forge()
				"relic", "gear", "rune", "talent", "remove":
					var p := {"kind": OS.get_environment("SCR"), "hero": 0, "level": 5}
					Run.r.pending.append(p)
					ui.show_reward()
				"end":
					Run.r.outcome = "defeat"
					Run.r.heroes[2].dead = true
					ui.show_end()
				"roster": ui.show_roster()
				"map": ui.show_map()
		if mode == "camp":
			m.run_ui.show_waypoint()
		if mode == "sub":
			Run.r.pending.append({"kind": "subclass", "hero": 0})
			m.run_ui.show_reward()
		if mode == "victory":
			var hs := []
			for i in Run.r.heroes.size():
				if i == 2:
					continue   # one falls, to show the dead column
				var h: Dictionary = Run.r.heroes[i]
				hs.append({"run_index": i, "hp": Run.max_hp(h) - 7 * (i + 1), "stress": 20 + 15 * i, "resolve": 0, "discard": [], "draw": [], "hand": [], "exhaust": [], "deaths_door": i == 1, "id": "h%d" % i})
			Run.move_to(Run.next_nodes()[0])
			m.run_ui.after_fight({"outcome": "victory", "heroes": hs, "enemies": [], "belt": [], "round": 4, "log": []})
		if mode == "spoils" or mode == "legend":
			Run.r.pending.append({"kind": "legendary" if mode == "legend" else "card", "hero": 0})
			m.run_ui.show_reward()
	elif mode != "menu":
		if OS.get_environment("PARTY") != "":
			m.party = Array(OS.get_environment("PARTY").split(","))
		m._start_encounter(int(OS.get_environment("ENC")) if OS.get_environment("ENC") != "" else 3)
		m.hub.visible = false
		for k in 20:
			await process_frame
		if mode == "effects":
			# a spread of active effects on heroes and foes, to check the chips above the heads
			var h = m.s.heroes
			var e = m.s.enemies
			h[0].block = 9; h[0].st.bleed = 3; h[0].st.mark = 1; h[0].ward = 2
			h[1].st.stun = 1; h[1].elements.frost = 2; h[1].st.might = 2
			h[-1].st.regen = 3
			h[2].cryo = 4
			m.s.hazards.hero[2] = 3
			for en in e:
				en.elements.fire = 3; en.st.vulnerable = 2; en.st.hex = 4
			e[0].st.thorns = 2; e[0].st.might = 1; e[0].block = 12; e[0].st.taunt = 1; e[0].elements.toxin = 5
			m.refresh_all()
			for k in 6:
				await process_frame
		if mode == "combat" or mode == "target" or mode == "detail" or mode == "ordo" or mode == "ordolong":
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
			if mode == "ordolong":
				# a long chain: the strip must fit it without running into the foes
				while m.plan.size() < 11:
					m.plan.append(m.plan[m.plan.size() % 2].duplicate())
				m.refresh_all()
				for k in 5:
					await process_frame
			if mode == "ordo" or mode == "ordolong":
				m.ordo_strip = null   # the test has no mouse resting on the strip; keep the view open for the shot
				m._show_ordo_full()
				for k in 10:
					await process_frame
			if mode == "detail":
				m.highlight_slot(0, true)
				for c in m.hand_layer.get_children():
					if c is UiCard:
						c._notification(Control.NOTIFICATION_MOUSE_ENTER)
						break
				for k in 15:
					await process_frame
			if mode == "target":
				m.on_card_clicked(h[1].id, 0)
		if mode == "leave":
			m._leave()
			m.open_church()
			for k in 4:
				await process_frame
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

