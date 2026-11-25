extends SceneTree
func _init() -> void:
	var s := Combat.new_state(["bulwark", "duelist", "elementalist"], Data.ENCOUNTERS[2].enemies, 42)
	var rounds := 0
	while s.outcome == "" and rounds < 3:
		Combat.start_round(s)
		rounds += 1
		var plan := []
		var energy: int = s.energy
		for h in s.heroes:
			for i in h.hand.size():
				var cid: String = h.hand[i]
				var c: Dictionary = Combat.card(cid)
				var cost: int = c.cost if c.cost >= 0 else energy
				if cost > energy or c.target == "none": continue
				var a := {"hero": h.id, "card": cid, "source": "hand", "hand_index": i, "target": -1, "x": cost}
				match c.target:
					"enemy": a.target = s.enemies[i % s.enemies.size()].id
					"ally", "adjacent_ally": a.target = s.heroes[(i + 1) % s.heroes.size()].id
				var sim := Combat.simulate(s, plan + [a], false)
				if sim.reasons[-1] == "":
					plan.append(a); energy -= cost
		Combat.commit_cards(s, plan)
		for a in Combat.order_plan(s, plan): Combat.resolve_player_action(s, a)
		Combat.resolve_echoes(s)
		for id in s.enemy_queue.duplicate(): Combat.resolve_enemy_action(s, id)
		Combat.end_round(s)
	for l in s.log: print(l)
	quit()

