extends SceneTree
# Plays whole descents headlessly through the Run layer (no UI), with a greedy card planner for fights.
func greedy_fight(s: Dictionary) -> void:
	var rounds := 0
	while s.outcome == "" and rounds < 40:
		Combat.start_round(s)
		rounds += 1
		var plan := []
		var energy: int = s.energy
		for h in s.heroes:
			for i in h.hand.size():
				var cid: String = h.hand[i]
				var c: Dictionary = Data.CARDS[cid]
				var cost: int = c.cost if c.cost >= 0 else energy
				if cost > energy or c.target == "none" or (cost == 0 and c.cost < 0):
					continue
				var a := {"hero": h.id, "card": cid, "source": "hand", "hand_index": i, "target": -1, "x": cost}
				var pool: Array = s.enemies if c.target == "enemy" else s.heroes
				if c.target in ["enemy", "ally", "ally_other", "adjacent_ally"]:
					var st: Dictionary = Combat.simulate(s, plan, false).state
					for u in pool:
						var a2 := a.duplicate()
						a2.target = u.id
						if Combat.check_action(st, a2) == "":
							a = a2
							break
				var sim := Combat.simulate(s, plan + [a], false)
				if sim.reasons[-1] == "":
					plan.append(a)
					energy -= cost
		Combat.commit_cards(s, plan)
		for a in Combat.order_plan(s, plan):
			Combat.resolve_player_action(s, a)
		Combat.resolve_echoes(s)
		for id in s.enemy_queue.duplicate():
			Combat.resolve_enemy_action(s, id)
		Combat.end_round(s)
	if s.outcome == "":
		s.outcome = "defeat"

func _init() -> void:
	SaveIO.dir = "user://test_saves"
	var worlds: Array = ["drowned"] if OS.get_environment("WORLDS") == "" else (Data.WORLD_ORDER if OS.get_environment("WORLDS") == "all" else OS.get_environment("WORLDS").split(","))
	for trial in 3 * worlds.size():
		var obj: String = ["boss", "relic", "escort"][trial % 3]
		var wk: String = worlds[trial / 3]
		# a fresh abbey each trial: the starting company of Bulwark, Duelist and Elementalist
		SaveIO.remove(Run.meta_path())
		Run.meta_load()
		var err := Abbey.start_descent(obj, wk, 4242 + trial)
		assert(err == "", err)
		printraw(wk + " ")
		var steps := 0
		while Run.r.outcome == "" and steps < 40:
			steps += 1
			while not Run.r.pending.is_empty():
				var p: Dictionary = Run.r.pending.pop_front()
				var h: Dictionary = Run.r.heroes[p.get("hero", 0)]
				match p.kind:
					"card":
						var ch := Run.card_choices(h)
						if ch.size() > 0: h.deck.append(ch[0])
					"subclass": h.subclass = Data.HEROES[h.key].subclasses.keys()[0]
					"talent": h.talents.append("tough")
					"relic":
						var rl := Run.relic_drop()
						if rl != "": Run.r.relics.append(rl)
					"gear":
						var it := Run.gear_drop()
						Run.r.stash.append(it)
						Run.equip(Run.living()[0], it)
			var nx := Run.next_nodes()
			if nx.is_empty():
				break
			var n := Run.move_to(nx[steps % nx.size()])
			match n.type:
				"combat", "elite", "boss":
					var idx := Run.room_for(n)
					n.tier = Data.ENCOUNTERS[idx].tier
					var s := Combat.new_state_run(Run.combat_setup(), Data.ENCOUNTERS[idx].enemies, 7 + steps)
					greedy_fight(s)
					var sum := Run.after_combat(s, n)
				"event":
					var e := Run.event_for(n)
					for o in e.options:
						if Run.option_ok(o):
							Run.apply_option(o)
							break
				"merchant":
					var st := Run.merchant_stock()
				"shrine": Run.shrine("prayer")
				"camp": Run.field_camp("rest")
				"hidden": Run.hidden_cache()
				"waypoint":
					for h in Run.living():
						Run.infirmary_heal(h)
		var lv := []
		for h in Run.r.heroes:
			lv.append("%s L%d %s%s" % [h.key.substr(0, 3), h.level, h.subclass, " DEAD" if h.dead else ""])
		print("%s: %s at layer %d after %d steps, gold %d, relics %d, doom %d | %s" % [obj, Run.r.outcome, Run.current_layer(), steps, Run.r.gold, Run.r.relics.size(), Run.r.doom, ", ".join(lv)])
		Run.end_run()
	quit()

