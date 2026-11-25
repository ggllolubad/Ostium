extends SceneTree
## Plays encounters with the balance planner and writes one JSON line per fight.
## Usage: godot --headless --path . --script res://balance/fight.gd -- party=bulwark,duelist,elementalist enc=0-110 seeds=3 planner=look out=/path.jsonl

func arg(name: String, dflt: String) -> String:
	for a in OS.get_cmdline_user_args():
		if a.begins_with(name + "="):
			return a.substr(name.length() + 1)
	return dflt

func _init() -> void:
	print("start")
	var party: Array = arg("party", "bulwark,duelist,elementalist").split(",")
	var rng: String = arg("enc", "0-%d" % (Data.ENCOUNTERS.size() - 1))
	var encs = []
	for part in rng.split(","):
		if "-" in part:
			var ab = part.split("-")
			for i in range(int(ab[0]), int(ab[1]) + 1):
				encs.append(i)
		else:
			encs.append(int(part))
	var seeds = int(arg("seeds", "3"))
	var level = arg("planner", "look")
	var outp = arg("out", "/tmp/fights.jsonl")
	var f = FileAccess.open(outp, FileAccess.WRITE)
	var t0 = Time.get_ticks_msec()
	for ei in encs:
		var enc: Dictionary = Data.ENCOUNTERS[ei]
		for sd in seeds:
			var s = Combat.new_state(party, enc.enemies, 1000 + sd * 7919 + ei)
			s.sim = true
			var rounds = 0
			var plays = {}
			var actions = 0
			while s.outcome == "" and rounds < 30:
				Combat.start_round(s)
				rounds += 1
				var plan = SimPlanner.plan_round(s, level)
				actions += plan.size()
				for a in plan:
					plays[a.card] = plays.get(a.card, 0) + 1
				Combat.commit_cards(s, plan)
				for a in Combat.order_plan(s, plan):
					Combat.resolve_player_action(s, a)
					if s.outcome != "":
						break
				if s.outcome == "":
					Combat.resolve_echoes(s)
				for id in s.enemy_queue.duplicate():
					if s.outcome != "":
						break
					Combat.resolve_enemy_action(s, id)
				Combat.end_round(s)
			var hs = []
			for h in s.heroes:
				hs.append({"key": h.key, "hp": h.hp, "max": h.max_hp, "stress": h.stress, "dd": h.deaths_door})
			f.store_line(JSON.stringify({"enc": ei, "world": enc.get("world", ""), "tier": enc.tier, "name": enc.name, "seed": sd,
				"outcome": s.outcome if s.outcome != "" else "timeout", "rounds": rounds, "actions": actions,
				"alive": s.heroes.size(), "heroes": hs, "plays": plays}))
	f.close()
	print("done %d fights in %d ms" % [encs.size() * seeds, Time.get_ticks_msec() - t0])
	quit()
