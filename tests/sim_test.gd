extends SceneTree
# Headless smoke test: plays every encounter with a greedy random planner and reports outcomes.
func _init() -> void:
	var results := []
	for ei in Data.ENCOUNTERS.size():
		for seed in [1, 7, 42, 99, 1234]:
			var s := Combat.new_state(["bulwark", "duelist", "elementalist"], Data.ENCOUNTERS[ei].enemies, seed)
			var rounds := 0
			while s.outcome == "" and rounds < 40:
				Combat.start_round(s)
				rounds += 1
				var plan := []
				var energy: int = s.energy
				for h in s.heroes:
					for i in h.hand.size():
						var cid: String = h.hand[i]
						var c: Dictionary = Combat.card(cid)
						var cost: int = c.cost if c.cost >= 0 else energy
						if cost > energy or c.target == "none" or cost == 0 and c.cost < 0:
							continue
						var a := {"hero": h.id, "card": cid, "source": "hand", "hand_index": i, "target": -1, "x": cost}
						match c.target:
							"enemy":
								if s.enemies.is_empty(): continue
								a.target = s.enemies[(i + seed) % s.enemies.size()].id
							"ally", "adjacent_ally":
								a.target = s.heroes[(i + 1) % s.heroes.size()].id
						var sim := Combat.simulate(s, plan + [a], false)
						if sim.reasons[-1] == "":
							plan.append(a)
							energy -= cost
				var preview := Combat.simulate(s, plan)
				Combat.commit_cards(s, plan)
				for a in Combat.order_plan(s, plan):
					Combat.resolve_player_action(s, a)
				Combat.resolve_echoes(s)
				for id in s.enemy_queue.duplicate():
					Combat.resolve_enemy_action(s, id)
				# preview must match reality exactly (deterministic)
				var hp_real := []
				for u in s.heroes + s.enemies: hp_real.append([u.id, u.hp])
				var hp_prev := []
				for u in preview.state.heroes + preview.state.enemies: hp_prev.append([u.id, u.hp])
				if hp_real != hp_prev:
					push_error("PREVIEW MISMATCH enc %d seed %d round %d" % [ei, seed, rounds])
				Combat.end_round(s)
			var hps := []
			for h in s.heroes: hps.append("%s %d/%d s%d%s" % [h.key.substr(0,3), h.hp, h.max_hp, h.stress, "DD" if h.deaths_door else ""])
			results.append("enc %d seed %d: %s in %d rounds | alive %d | %s" % [ei, seed, s.outcome, rounds, s.heroes.size(), ", ".join(hps)])
	for r in results:
		print(r)
	quit()

