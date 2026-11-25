extends SceneTree
# Plays every card once in a live fight to catch runtime errors and report cards that do nothing visible.
func _init() -> void:
	var others := {"bulwark": ["duelist", "elementalist"], "duelist": ["bulwark", "elementalist"], "elementalist": ["bulwark", "duelist"],
		"alchemist": ["bulwark", "duelist"], "oracle": ["bulwark", "duelist"], "hexweaver": ["bulwark", "duelist"]}
	var n := 0
	var inert := []
	for id in Data.CARDS:
		var c: Dictionary = Data.CARDS[id]
		if c.cls == "shared" or c.target == "none":
			continue
		var cls: String = c.cls if Data.HEROES.has(c.cls) else "oracle"   # neutral, world and flask cards: any calling
		var party: Array = others.get(cls, ["bulwark", "duelist"]).duplicate()
		var rank: int = c.use[0] if c.use.size() > 0 else 1
		party.insert(min(rank - 1, party.size()), cls)
		var s := Combat.new_state(party, ["thrall", "warden", "siren"], 7)
		Combat.start_round(s)
		var h: Dictionary = {}
		for x in s.heroes:
			if x.key == cls:
				h = x
		# pre-load some state so scaling cards have something to read
		for e in s.enemies:
			e.elements.water = 2
			e.elements.fire = 1
			e.st.bleed = 3
			e.st.hex = 2
			e.st.doom = 4
		h.st.momentum = 2
		h.block = 6
		h.omen = 3
		h.hand.append(id)
		var a := {"hero": h.id, "card": id, "source": "hand", "hand_index": h.hand.size() - 1, "target": -1, "x": 2, "cost": max(0, c.cost)}
		var pool: Array = s.enemies if c.target == "enemy" else s.heroes
		if c.target in ["enemy", "ally", "ally_other", "adjacent_ally"]:
			for u in pool:
				var a2 := a.duplicate()
				a2.target = u.id
				if Combat.check_action(s, a2) == "":
					a = a2
					break
			if a.target == -1:
				push_error("no legal target for " + id)
				continue
		var before := JSON.stringify(s.heroes) + JSON.stringify(s.enemies) + JSON.stringify([s.rites, s.belt, s.belt_next, s.prime])
		var r := Combat.resolve_player_action(s, a)
		if r != "":
			push_error("card %s fizzled: %s" % [id, r])
		Combat.resolve_echoes(s)
		var after := JSON.stringify(s.heroes) + JSON.stringify(s.enemies) + JSON.stringify([s.rites, s.belt, s.belt_next, s.prime])
		if before == after and s.bonus_energy == 0:
			inert.append(id)
		for eid in s.enemy_queue.duplicate():
			Combat.resolve_enemy_action(s, eid)
		Combat.end_round(s)
		if s.outcome == "":
			Combat.start_round(s)
		n += 1
	print("cards exercised: ", n)
	print("no visible effect: ", inert)
	quit()

