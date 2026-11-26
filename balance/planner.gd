class_name SimPlanner
extends RefCounted
## Balance-sim planner. Builds a round's plan one action at a time: every legal action is tried through the game's own
## preview (Combat.simulate, enemy phase included) and the one that most improves the evaluated state is kept, until
## nothing helps or vigour runs out. "greedy" is the old smoke-test planner (first legal action), kept as a weak bracket.

static var W = {
	"enemy_hp": 1.0, "kill": 14.0, "threat": 0.6,
	"hero_hp": 1.3, "dd": 45.0, "death": 260.0, "stress": 0.35, "low_hp": 0.6,
	"bleed": 1.4, "doom": 1.2, "burn": 1.3, "el": 0.5, "vuln": 4.0, "mark": 1.5, "hex": 0.8, "stun": 6.0,
	"might": 3.0, "focus": 1.2, "momentum": 1.8, "thorns": 0.8, "riposte": 1.0, "regen": 1.4, "ward": 0.8,
	"armor": 5.0, "e_armor": 3.0, "energy": 3.5, "next_hand": 3.0, "draw": 2.0, "prime": 1.5, "block_left": 0.15,
}

static func evaluate(s0: Dictionary, s: Dictionary) -> float:
	var v = 0.0
	if s.outcome == "victory":
		v += 1000.0
	elif s.outcome == "defeat":
		v -= 5000.0
	# foes: HP removed (dead foes count all their remaining HP), weighted up for foes that hit hard
	var alive = {}
	for e in s.enemies:
		alive[e.id] = e
	for e0 in s0.enemies:
		var thr = _threat(e0)
		var e: Dictionary = alive.get(e0.id, {})
		var lost: float = e0.hp if e.is_empty() else float(e0.hp - e.hp)
		v += lost * W.enemy_hp * (1.0 + thr * W.threat / 10.0)
		if e.is_empty():
			v += W.kill + thr * 1.5
			continue
		v += W.bleed * _tri(e.st.bleed) + W.doom * e.st.doom + W.burn * max(0, e.elements.fire - e.elements.water)
		var els = 0
		for k in Data.ELEMENTS:
			els += e.elements[k]
		v += W.el * els + W.vuln * e.st.vulnerable + W.mark * e.st.mark + W.hex * e.st.hex + W.stun * e.st.stun
		v -= W.e_armor * (e.armor - e0.armor) + 0.5 * e.block
	# heroes
	var hal = {}
	for h in s.heroes:
		hal[h.id] = h
	for h0 in s0.heroes:
		var h: Dictionary = hal.get(h0.id, {})
		if h.is_empty() or h.get("dead", false):
			v -= W.death
			continue
		var lost = float(h0.hp - h.hp)
		var frac = 1.0 - float(h.hp) / max(1, h.max_hp)
		v -= lost * W.hero_hp * (1.0 + frac * W.low_hp)
		if h.deaths_door and not h0.deaths_door:
			v -= W.dd
		elif h.deaths_door:
			v -= 10.0 * (h0.grit - h.grit)
		elif h0.deaths_door and not h.deaths_door:
			v += W.dd * 0.8
		v -= W.stress * (h.stress - h0.stress)
		var st: Dictionary = h.st
		v += W.might * (st.might - h0.st.might) + W.focus * st.focus + W.momentum * st.momentum + W.thorns * st.thorns
		v += W.riposte * st.riposte + W.regen * _tri(st.regen) + W.ward * h.ward + W.armor * (h.armor - h0.armor)
		v += W.next_hand * h.next_hand.size() + W.draw * h.bonus_draw + W.block_left * h.block
		var hels = 0
		for k in Data.ELEMENTS:
			hels += h.elements[k]
		v -= W.el * 1.5 * hels
	v += W.energy * s.bonus_energy + W.prime * s.prime
	# Gate 3: lasting rites, brewed flasks and the Augur's Omen are worth something now, not only when they fire
	v += 10.0 * (s.get("rites", []).size() - s0.get("rites", []).size())
	v += 4.0 * (s.get("belt_next", []).size() - s0.get("belt_next", []).size())
	for h in s.heroes:
		v += 1.5 * h.get("omen", 0) + 1.0 * h.st.get("empower", 0)
	return v

static func _tri(n: int) -> float:
	return n * (n + 1) / 2.0

static func _threat(e: Dictionary) -> float:
	var it = Combat.intent_of(e)
	var t = 0.0
	if not it.is_empty():
		for f in it.fx:
			if f.t == "dmg":
				t += float(f.n) * (3.0 if it.target == "all_heroes" else 1.0)
	return t

## Every legal action for the state at the end of `plan`, given the vigour left.
static func candidates(s: Dictionary, st: Dictionary, energy: int, used_kits: Dictionary) -> Array:
	var out = []
	for h in st.heroes:
		var seen = {}
		for i in h.hand.size():
			var cid: String = h.hand[i]
			if cid == "__used__" or seen.has(cid):
				continue
			seen[cid] = true
			_add_card(out, st, h, cid, "hand", i, energy)
		for kid in h.kit + ["swap"]:
			if used_kits.has("%d:%s" % [h.id, kid]):
				continue
			_add_card(out, st, h, kid, "kit", -1, energy)
	return out

static func _add_card(out: Array, st: Dictionary, h: Dictionary, cid: String, src: String, idx: int, energy: int) -> void:
	var c: Dictionary = Data.CARDS[cid]
	if c.target == "none":
		return
	var cost: int = Combat.cost_of(st, h, cid) if c.cost >= 0 else energy
	if cost > energy or (c.cost < 0 and cost == 0):
		return
	var base = {"hero": h.id, "card": cid, "source": src, "hand_index": idx, "target": -1, "x": cost, "cost": cost}
	match c.target:
		"enemy":
			for e in st.enemies:
				var a = base.duplicate()
				a.target = e.id
				if Combat.check_action(st, a) == "":
					out.append(a)
		"ally", "ally_other", "adjacent_ally":
			for o in st.heroes:
				var a = base.duplicate()
				a.target = o.id
				if Combat.check_action(st, a) == "":
					out.append(a)
		_:
			if Combat.check_action(st, base) == "":
				out.append(base)

## Plans one round on live state `s`. Returns the plan (actions with hand_index into the round-start hands).
static func plan_round(s: Dictionary, level: String) -> Array:
	var plan = []
	var energy: int = s.energy
	var used_kits = {}
	var removed = {}   # hero id -> [hand indices already planned]
	var cur: float = evaluate(s, Combat.simulate(s, [], true).state)
	var guard = 0
	while energy >= 0 and guard < 14:
		guard += 1
		# the state after the plan so far, players' half only, with planned cards taken out of the hands
		var st: Dictionary = Combat.simulate(s, plan, false).state
		for hid in removed:
			var hh = Combat.find(st, hid)
			if hh.is_empty():
				continue
			var idxs: Array = removed[hid].duplicate()
			idxs.sort()
			idxs.reverse()
			for ix in idxs:
				hh.hand[ix] = "__used__"
		var cands = []
		for a in candidates(s, st, energy, used_kits):
			cands.append(a)
		if cands.is_empty():
			break
		var best = {}
		var best_v = cur
		if level == "greedy":
			best = cands[0]
		else:
			for a in cands:
				var r = Combat.simulate(s, plan + [a], true)
				if r.reasons[-1] != "":
					continue
				var v = evaluate(s, r.state)
				if v > best_v + 0.01:
					best_v = v
					best = a
		if best.is_empty():
			break
		plan.append(best)
		energy -= int(best.cost)
		if best.source == "kit":
			used_kits["%d:%s" % [best.hero, best.card]] = true
		if best.source == "hand":
			if not removed.has(best.hero):
				removed[best.hero] = []
			removed[best.hero].append(best.hand_index)
		cur = best_v
	return plan

## The simulated state with placeholder entries dropped from the hands (keeps indices aligned with the live hands).
static func _clean(st: Dictionary) -> Dictionary:
	var c = st.duplicate(false)
	var hs = []
	for h in st.heroes:
		var h2: Dictionary = h.duplicate(false)
		var hand = []
		for x in h.hand:
			hand.append(x)
		h2.hand = hand
		hs.append(h2)
	c.heroes = hs
	return c
