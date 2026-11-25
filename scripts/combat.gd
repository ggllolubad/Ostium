class_name Combat
extends RefCounted
## Deterministic combat model. The whole fight lives in one Dictionary `s` so it can be cloned
## with duplicate(true) for exact previews. Every function is static and mutates `s`.
## Events for the UI are appended to s.events; human-readable lines to s.log.

const TRIGGER_LIMIT := 5
## Intent targets that pick one hero, so a Taunt pulls them.
const SINGLE_TARGETS := ["front", "back", "rank2", "rank3", "random", "weakest", "most_stress", "marked", "most_cards", "heaviest",
	"healthiest", "most_burn", "most_played", "acted_last", "first_actor"]
## Combat Rules v2 switches (2026-11-25). The balance sim flips these to compare variants; the game uses the defaults.
static var RULES := {"vigour_per": 2, "vigour_flat": 0, "draw": 4, "hand_cap": 10, "hex": true, "az_v2": true, "drown_cap": 20,
	"virtues": true, "afflictions": true, "traits": true}
const VIRTUES := ["steadfast", "stalwart", "vigilant", "rallying", "unbowed"]
const MAX_REACTION_POWER := 12

# ------------------------------------------------------------------ construction
static func new_state(hero_keys: Array, enemy_keys: Array, seed: int) -> Dictionary:
	var s := {"heroes": [], "enemies": [], "round": 0, "energy": 0, "next_id": 1, "rng": seed,
		"prime": 0, "last_actor": -1, "echoes": [], "enemy_queue": [], "hazards": {"hero": {}, "enemy": {}},
		"events": [], "log": [], "triggers": {}, "outcome": "", "sim": false, "lockdown_used": {},
		"bonus_energy": 0, "primes_consumed": 0, "reactions_round": 0, "last_target": -1, "belt": [],
		"belt_next": [], "belt_used": [], "fresh_on_belt": [], "improved": [], "flasks_used": 0, "rites": [], "rite_depth": 0}
	for k in hero_keys:
		s.heroes.append(_make_hero(s, k))
	for k in enemy_keys:
		s.enemies.append(_make_enemy(s, k))
	for h in s.heroes:
		h.draw = h.deck.duplicate()
		_shuffle(s, h.draw)
	s.vigour_base = int(RULES.vigour_per) * s.heroes.size() + int(RULES.vigour_flat)   # fixed for the fight (Rules v2, rule 1)
	return s

static func _blank_unit(s: Dictionary) -> Dictionary:
	var id: int = s.next_id
	s.next_id += 1
	var el := {}
	var fr := {}
	for e in Data.ELEMENTS:
		el[e] = 0
		fr[e] = false
	return {"id": id, "hp": 1, "max_hp": 1, "block": 0, "armor": 0, "ward": 0, "dead": false, "elements": el, "fresh": fr,
		"st": {"bleed": 0, "stun": 0, "mark": 0, "vulnerable": 0, "might": 0, "focus": 0, "momentum": 0, "riposte": 0,
			"taunt": 0, "tenacity": 0, "freeze": 0, "freeze_bonus": 0, "neuro": 0, "silence": 0, "blight": 0, "lockdown": 0,
			"thorns": 0, "dodge": 0, "regen": 0, "hex": 0, "doom": 0, "fortify": 0, "anchor": 0, "cap": 0, "charge": 0, "empower": 0},
		"hollow": false, "moved": false, "guarded_by": -1, "postponed": false, "turned": -1, "omen": 0, "scars": 0,
		"held": {"fire": 0, "frost": 0, "lightning": 0, "water": 0, "toxin": 0, "void": 0}}

static func _make_hero(s: Dictionary, key: String) -> Dictionary:
	var d: Dictionary = Data.HEROES[key]
	var u := _blank_unit(s)
	u.merge({"side": "hero", "key": key, "name": d.name, "max_hp": d.hp, "hp": d.hp, "armor": d.armor, "grit": d.grit, "grit_max": d.grit,
		"deaths_door": false, "stress": 0, "resolve": 0, "deck": d.deck.duplicate(), "draw": [], "hand": [], "discard": [], "exhaust": [],
		"kit": d.kit.duplicate(), "kit_used": {}, "attuned": d.get("attuned", 3), "art": d.art, "color": d.color,
		"bonus_draw": 0, "next_hand": [], "played": 0}, true)
	return u

static func _make_enemy(s: Dictionary, key: String) -> Dictionary:
	var d: Dictionary = Data.ENEMIES[key]
	var u := _blank_unit(s)
	u.merge({"side": "enemy", "key": key, "name": d.name, "max_hp": d.hp, "hp": d.hp, "armor": d.armor, "intent": "", "intent_target": -1,
		"art": d.art, "personality": d.get("personality", "ai"), "last_intent": "", "span": int(d.get("span", 1)), "phase": 0, "ai_override": [],
		"resist": d.get("resist", {}).duplicate(), "flags": d.get("flags", []).duplicate(), "used_once": {},
		"postponed_last": false}, true)
	return u

# ------------------------------------------------------------------ run setup
## setup: {heroes: [{key, max_hp, hp, stress, deck, grit, armor, stats, passives:[fx]}], energy, start:[fx], round:[fx], foe_hp, foe_might}
static func new_state_run(setup: Dictionary, enemy_keys: Array, seed: int) -> Dictionary:
	var keys := []
	for hs in setup.heroes:
		keys.append(hs.key)
	var s := new_state(keys, enemy_keys, seed)
	for i in s.heroes.size():
		var h: Dictionary = s.heroes[i]
		var hs: Dictionary = setup.heroes[i]
		h.max_hp = int(hs.max_hp)
		h.hp = clamp(int(hs.hp), 1, h.max_hp)
		h.stress = int(hs.stress)
		h.resolve = int(hs.get("resolve", 0))
		h.grit = int(hs.grit)
		h.grit_max = int(hs.grit)
		h.armor = int(hs.armor)
		h.deck = hs.deck.duplicate()
		h.draw = hs.deck.duplicate()
		_shuffle(s, h.draw)
		h.stats = hs.stats
		h.stress_res = int(hs.stats.get("stress_res", 0)) + int(setup.get("stress_res", 0))
		h.passives = hs.get("passives", [])
		h.run_index = int(hs.get("index", i))
		h.sub = String(hs.get("sub", ""))
		h.st.might += int(hs.stats.get("might", 0))
	for e in s.enemies:
		var mult := float(setup.get("foe_hp", 1.0)) * (float(setup.get("boss_hp", 1.0)) if Data.ENEMIES[e.key].tier == "boss" else 1.0)
		mult *= float(setup.get("tier_hp", {}).get(Data.ENEMIES[e.key].tier, 1.0))   # Gate 3 content scale by tier
		e.max_hp = int(round(e.max_hp * mult))
		e.hp = e.max_hp
		e.st.might += int(setup.get("foe_might", 0))
	s.setup = setup
	s.world = setup.get("world", "")
	s.foe_dmg = float(setup.get("foe_dmg", 1.0))
	s.belt = setup.get("belt", []).duplicate()
	return s

static func _apply_start_setup(s: Dictionary, setup: Dictionary) -> void:
	var ctx := {"x": 0, "half": false, "prime": 0}
	for h in s.heroes.duplicate():
		var st: Dictionary = h.get("stats", {})
		if st.get("block", 0) > 0:
			_gain_block(s, h, int(st.block))
		if st.get("ward", 0) > 0:
			h.ward += int(st.ward)
		for k in ["focus", "thorns", "regen", "riposte", "momentum", "dodge"]:
			if st.get(k, 0) > 0:
				h.st[k] += int(st[k])
		var fxs: Array = setup.get("start", []) + h.get("passives", [])
		for fx in fxs:
			var tl: Array = [h]
			_exec(s, h, {"name": "start", "cat": "physical", "fx": [fx]}, tl, ctx.duplicate(), false)
	if s.get("sim", false):
		s.events = []

# ------------------------------------------------------------------ helpers
static func _rand(s: Dictionary) -> int:
	s.rng = int((s.rng * 1103515245 + 12345) % 2147483648)
	return s.rng

static func _shuffle(s: Dictionary, arr: Array) -> void:
	for i in range(arr.size() - 1, 0, -1):
		var j := _rand(s) % (i + 1)
		var t = arr[i]
		arr[i] = arr[j]
		arr[j] = t

static func find(s: Dictionary, id: int) -> Dictionary:
	for u in s.heroes:
		if u.id == id:
			return u
	for u in s.enemies:
		if u.id == id:
			return u
	return {}

static func side_arr(s: Dictionary, u: Dictionary) -> Array:
	return s.heroes if u.side == "hero" else s.enemies

static func rank_of(s: Dictionary, u: Dictionary) -> int:
	var arr := side_arr(s, u)
	var r := 1
	for o in arr:
		if o == u:
			return r
		r += int(o.get("span", 1))
	return 0

## Every rank a (possibly multi-rank) unit occupies.
static func ranks_of(s: Dictionary, u: Dictionary) -> Array:
	var r0 := rank_of(s, u)
	var o := []
	for i in int(u.get("span", 1)):
		o.append(r0 + i)
	return o

static func card(id: String) -> Dictionary:
	return Data.CARDS[id]

static func _ev(s: Dictionary, e: Dictionary) -> void:
	s.events.append(e)

static func _log(s: Dictionary, text: String) -> void:
	if not s.sim:
		s.log.append(text)

static func elements_on(u: Dictionary) -> int:
	var n := 0
	for e in Data.ELEMENTS:
		if u.elements[e] > 0:
			n += 1
	return n

# ------------------------------------------------------------------ round flow
static func start_round(s: Dictionary) -> void:
	s.round += 1
	s.prime = 0
	s.first_actor_prev = s.get("first_actor", -1)
	s.first_actor = -1
	s.last_actor = -1
	s.echoes = []
	s.triggers = {}
	s.lockdown_used = {}
	s.primes_consumed = 0
	s.reactions_round = 0
	s.last_target = -1
	for u in s.heroes:
		if u.st.fortify > 0:
			u.st.fortify -= 1
		else:
			u.block = 0
	for e in s.enemies:
		if e.st.fortify > 0:
			e.st.fortify -= 1
	for h in s.heroes:
		h.kit_used = {}
		h.played = 0
		h.flask_round = false
	s.flasks_used = 0
	s.belt += s.get("belt_next", [])
	s.belt_next = []
	s.energy = int(s.get("vigour_base", 2 * s.heroes.size())) + s.bonus_energy
	s.bonus_energy = 0
	var setup: Dictionary = s.get("setup", {})
	if s.round == 1 and not setup.is_empty():
		s.energy += int(setup.get("energy", 0))
		for h in s.heroes:
			h.bonus_draw += int(h.get("stats", {}).get("draw", 0))
	for h in s.heroes:
		_draw(s, h, int(RULES.draw) + h.bonus_draw + (1 if h.get("virtue", "") == "vigilant" else 0))
		h.bonus_draw = 0
		if h.get("virtue", "") == "stalwart":
			_gain_block(s, h, 6)
		for cid in h.next_hand:
			var nd: Dictionary = Data.CARDS.get(cid, {})
			if nd.has("on_draw"):
				h.discard.append(cid)
				_exec(s, h, {"name": nd.name, "cat": "physical", "fx": nd.on_draw}, [h], {"x": 0, "half": false, "prime": 0}, false)
			else:
				h.hand.append(cid)
		h.next_hand = []
		h.prev_played = h.get("played_last", 0)
	choose_intents(s)
	if RULES.traits:
		for e in s.enemies.duplicate():
			_trait(s, e, "round_start", [e])
	_rite_fire(s, "round_start", {})
	_log(s, "— Round %d —" % s.round)
	if not setup.is_empty():
		if s.round == 1:
			_apply_start_setup(s, setup)
		for fx in setup.get("round", []):
			for h in s.heroes.duplicate():
				_exec(s, h, {"name": "relic", "cat": "physical", "fx": [fx]}, [h], {"x": 0, "half": false, "prime": 0}, false)
		s.events = [] if s.get("sim", false) else s.events

static func _draw(s: Dictionary, h: Dictionary, n: int) -> void:
	var drawn := 0
	var guard := 0
	while drawn < n and guard < 40:
		guard += 1
		if h.draw.is_empty():
			if h.discard.is_empty():
				return
			h.draw = h.discard.duplicate()
			h.discard = []
			_shuffle(s, h.draw)
		var c: String = h.draw.pop_back()
		if c == "dread":
			s.energy = max(0, s.energy - 1)
			h.discard.append(c)
			_log(s, "%s draws Dread and loses 1 energy." % h.name)
			continue
		var cd: Dictionary = Data.CARDS.get(c, {})
		if cd.has("on_draw"):
			h.discard.append(c)
			_exec(s, h, {"name": cd.name, "cat": "physical", "fx": cd.on_draw}, [h], {"x": 0, "half": false, "prime": 0}, false)
			_log(s, "%s draws %s." % [h.name, cd.name])
			continue
		if c == "festering":
			h.discard.append(c)
			_lose_hp(s, h, 2)
			_log(s, "%s's wound festers (2 HP)." % h.name)
			continue
		h.hand.append(c)
		drawn += 1

static func choose_intents(s: Dictionary) -> void:
	var q := []
	for i in s.enemies.size():
		var e: Dictionary = s.enemies[i]
		if e.postponed:
			e.postponed = false
			q.append(e.id)
			continue
		if Data.ENEMIES[e.key].has("ai"):
			e.postponed_last = false
			e.intent = EnemyAI.pick(s, e, i)
			e.last_intent = e.intent
			e.intent_target = _intent_target(s, e, Data.ENEMIES[e.key].intents[e.intent])
			q.append(e.id)
			continue
		var pick := "grasp"
		match e.personality:
			"mindless":
				var cyc := ["grasp", "hook", "gurgle"]
				pick = cyc[(s.round + i) % 3]
				for h in s.heroes:
					if h.deaths_door:
						pick = "grasp"
			"protector":
				var wounded := false
				for o in s.enemies:
					if o != e and float(o.hp) / o.max_hp < 0.5:
						wounded = true
				if wounded and e.last_intent != "bulwark":
					pick = "bulwark"
				elif s.round % 3 == 0:
					pick = "sweep"
				else:
					pick = "trident"
			"cunning":
				var hurt := false
				for o in s.enemies:
					if float(o.hp) / o.max_hp <= 0.75:
						hurt = true
				if hurt and e.last_intent != "mend":
					pick = "mend"
				elif s.round % 2 == 1:
					pick = "song"
				else:
					pick = "lure"
		e.intent = pick
		e.last_intent = pick
		e.intent_target = _intent_target(s, e, Data.ENEMIES[e.key].intents[pick])
		q.append(e.id)
	s.enemy_queue = q

static func _intent_target(s: Dictionary, e: Dictionary, intent: Dictionary) -> int:
	match intent.target:
		"front":
			for h in s.heroes:
				if h.deaths_door and e.personality == "mindless":
					return h.id
			return s.heroes[0].id if s.heroes.size() > 0 else -1
		"back":
			return s.heroes[-1].id if s.heroes.size() > 0 else -1
		"ally_lowest":
			var best: Dictionary = {}
			for o in s.enemies:
				if best.is_empty() or float(o.hp) / o.max_hp < float(best.hp) / best.max_hp:
					best = o
			return best.id
		"self":
			return e.id
		"rank2", "rank3":
			if s.heroes.is_empty():
				return -1
			return s.heroes[min(s.heroes.size() - 1, 1 if intent.target == "rank2" else 2)].id
		"random":
			if s.heroes.is_empty():
				return -1
			match e.personality:
				"cruel":
					return _most_stressed(s).id
				"cunning":
					return s.heroes[-1].id
			return s.heroes[_rand(s) % s.heroes.size()].id
		"weakest":
			var best: Dictionary = {}
			for h in s.heroes:
				if best.is_empty() or float(h.hp) / h.max_hp < float(best.hp) / best.max_hp:
					best = h
			return best.id if not best.is_empty() else -1
		"most_stress":
			return _most_stressed(s).id if not s.heroes.is_empty() else -1
		"ally_front":
			return s.enemies[0].id if not s.enemies.is_empty() else -1
		"marked", "most_cards", "heaviest", "healthiest", "most_burn", "most_played":
			var best: Dictionary = {}
			var bv := -1.0
			for h in s.heroes:
				var v := 0.0
				match intent.target:
					"marked": v = h.st.mark
					"most_cards": v = h.hand.size()
					"heaviest": v = h.block + h.armor
					"healthiest": v = h.hp
					"most_burn": v = h.elements.fire
					"most_played": v = h.get("played_last", 0)
				if v > bv:
					bv = v
					best = h
			return best.id if not best.is_empty() else -1
		"acted_last", "first_actor":
			var hid: int = int(s.get("acted_last" if intent.target == "acted_last" else "first_actor_prev", -1))
			var hh := find(s, hid)
			return hh.id if not hh.is_empty() and not hh.dead else (s.heroes[0].id if not s.heroes.is_empty() else -1)
		"all_allies", "all_heroes", "front2", "back2":
			return -1
	return -1

static func _most_stressed(s: Dictionary) -> Dictionary:
	var best: Dictionary = {}
	for h in s.heroes:
		if best.is_empty() or h.stress > best.stress:
			best = h
	return best

static func intent_of(e: Dictionary) -> Dictionary:
	if e.intent == "":
		return {}
	return Data.ENEMIES[e.key].intents[e.intent]

# ------------------------------------------------------------------ planning
## Locked-down heroes act last; otherwise the plan keeps the player's order.
static func order_plan(s: Dictionary, plan: Array) -> Array:
	var first := []
	var last := []
	for a in plan:
		var h := find(s, a.hero)
		if not h.is_empty() and h.st.lockdown > 0:
			last.append(a)
		else:
			first.append(a)
	return first + last

## "" when the action is legal against state `s` (the state at that point of the plan), else a reason.
static func check_action(s: Dictionary, a: Dictionary) -> String:
	var h := find(s, a.hero)
	if h.is_empty() or h.dead:
		return "actor has fallen"
	var c := card(a.card)
	if c.target == "none":
		return "unplayable"
	if a.source == "hand" and h.st.freeze > 0:
		return "frozen: kit only"
	if h.st.get("stun", 0) > 0 and a.source != "belt":
		return "stunned this round"
	if a.source == "belt" and h.get("flask_round", false):
		return "one flask per hero a round"
	var r := rank_of(s, h)
	if a.source != "belt" and not c.use.has(r):
		return "%s must be in rank %s" % [h.name, _ranks_text(c.use)]
	match c.target:
		"enemy":
			var t := find(s, a.target)
			if t.is_empty() or t.dead:
				return "target is gone"
			var hit_ok := false
			for rr in ranks_of(s, t):
				if c.get("hit", [rr]).has(rr):
					hit_ok = true
			if not hit_ok:
				return "target must be in rank %s" % _ranks_text(c.hit)
		"ally", "adjacent_ally", "ally_other":
			var t := find(s, a.target)
			if t.is_empty() or t.dead or t.side != "hero":
				return "ally is gone"
			if c.target == "ally_other" and t.id == h.id:
				return "must target another hero"
			if c.target == "adjacent_ally" and abs(rank_of(s, t) - r) != 1:
				return "ally must be adjacent"
		"all_enemies":
			if s.enemies.is_empty():
				return "no foes"
	return ""

static func _ranks_text(arr: Array) -> String:
	var parts := []
	for x in arr:
		parts.append(str(x))
	return "-".join(parts) if parts.size() > 1 else parts[0]

## Simulates the plan (player actions, echoes, then the enemy phase) on a clone.
## Returns {state, reasons} where reasons[i] matches the ordered plan.
static func simulate(s: Dictionary, plan: Array, include_enemies := true) -> Dictionary:
	var c: Dictionary = s.duplicate(true)
	c.sim = true
	c.events = []
	var ordered := order_plan(c, plan)
	var reasons := []
	for a in ordered:
		reasons.append(resolve_player_action(c, a))
	if include_enemies:
		resolve_echoes(c)
		for id in c.enemy_queue.duplicate():
			resolve_enemy_action(c, id)
	return {"state": c, "reasons": reasons, "ordered": ordered}

## Removes played cards from hands at commit; they go to discard or exhaust.
static func commit_cards(s: Dictionary, plan: Array) -> void:
	var used := {}
	for a in plan:
		if a.source == "belt":
			var bi: int = s.belt.find(a.card)
			if bi >= 0:
				s.belt.remove_at(bi)
			continue
		if a.source == "hand":
			if not used.has(a.hero):
				used[a.hero] = []
			used[a.hero].append(a.hand_index)
		else:
			var h := find(s, a.hero)
			h.kit_used[a.card] = true
	for hid in used:
		var h := find(s, hid)
		var idxs: Array = used[hid]
		idxs.sort()
		idxs.reverse()
		for i in idxs:
			var cid: String = h.hand[i]
			h.hand.remove_at(i)
			if card(cid).get("kw", []).has("Exhaust") or card(cid).get("kw", []).has("Rite"):
				h.exhaust.append(cid)
			else:
				h.discard.append(cid)

# ------------------------------------------------------------------ resolution
static func resolve_player_action(s: Dictionary, a: Dictionary) -> String:
	var reason := check_action(s, a)
	var h := find(s, a.hero)
	var c := card(a.card)
	if reason != "":
		_ev(s, {"t": "fizzle", "unit": a.hero, "text": "%s fizzles: %s" % [c.name, reason]})
		_log(s, "%s's %s fizzles (%s)." % [h.get("name", "?"), c.name, reason])
		s.prime = 0
		return reason
	_ev(s, {"t": "act", "unit": h.id, "target": a.get("target", -1), "text": c.name, "card": a.card})
	_log(s, "%s uses %s." % [h.name, c.name])
	_static_tick(s, h)
	if h.dead:
		return "actor fell"
	if s.last_actor == h.id:
		_add_status(s, h, h, "momentum", 1, true)
	if s.last_actor == -1:
		s.first_actor = h.id
	s.last_actor = h.id
	s.acted_last = h.id
	var ctx := {"x": a.get("x", 0), "half": a.get("echo", false), "prime": 0 if a.get("echo", false) else s.prime,
		"follow": a.get("target", -1) != -1 and a.get("target", -1) == s.last_target}
	if not a.get("echo", false):
		s.prime = 0   # this action's own Prime effects build the next action's Prime
	var targets := _targets_for(s, h, c, a)
	var neuro: bool = h.st.neuro > 0
	if neuro:
		h.st.neuro = 0
	if a.get("source", "") == "belt":
		h.flask_round = true
		s.flasks_used = int(s.get("flasks_used", 0)) + 1
		s.belt_used.append(a.card)
		var fi: int = s.get("fresh_on_belt", []).find(a.card)
		if fi >= 0:
			s.fresh_on_belt.remove_at(fi)
	_exec(s, h, c, targets, ctx, neuro)
	if not a.get("echo", false) and int(ctx.get("prime", 0)) > 0:
		s.prime += int(ctx.prime)   # Prime this action could not use carries to the next one (Gate 3)
	s.last_target = a.get("target", -1)
	h.played += 1
	if a.get("source", "") == "belt":
		_rite_fire(s, "flask", h)
	elif not a.get("echo", false):
		var subj: Dictionary = targets[0] if targets.size() > 0 and targets[0] != h else {}
		_rite_fire(s, "play", subj, h.id, "only", {"kw": c.get("kw", []), "cat": c.get("cat", "physical")})
	if c.get("kw", []).has("Rite") and c.has("rite") and not a.get("echo", false):
		s.rites.append({"uid": s.next_id, "owner": h.id, "rite": c.rite, "name": c.name, "cat": c.get("cat", "physical"), "from_round": s.round})
		s.next_id += 1
		_ev(s, {"t": "status", "unit": h.id, "text": "Rite: " + c.name})
	if c.get("kw", []).has("Echo") and not a.get("echo", false):
		var e: Dictionary = a.duplicate()
		e.echo = true
		s.echoes.append(e)
	return ""

static func resolve_echoes(s: Dictionary) -> void:
	for e in s.echoes:
		var h := find(s, e.hero)
		if h.is_empty():
			continue
		var c := card(e.card)
		_ev(s, {"t": "act", "unit": h.id, "target": e.get("target", -1), "text": c.name + " (Echo)", "card": e.card})
		_log(s, "%s's %s echoes." % [h.name, c.name])
		var targets := _targets_for(s, h, c, e)
		_exec(s, h, c, targets, {"x": e.get("x", 0), "half": true, "prime": 0}, false)
	s.echoes = []

static func _targets_for(s: Dictionary, h: Dictionary, c: Dictionary, a: Dictionary) -> Array:
	match c.target:
		"self":
			return [h]
		"all_enemies":
			return s.enemies.duplicate()
		"all_allies":
			return s.heroes.duplicate()
		_:
			var t := find(s, a.get("target", -1))
			if t.is_empty():
				return []
			return [t]

static func resolve_enemy_action(s: Dictionary, id: int) -> void:
	var e := find(s, id)
	if e.is_empty() or e.dead or s.outcome != "":
		return
	var intent := intent_of(e)
	if intent.is_empty():
		return
	if e.postponed:
		_ev(s, {"t": "status", "unit": e.id, "text": "Waits"})
		return
	if e.st.stun > 0:
		e.st.stun = 0
		e.st.tenacity = 1
		_ev(s, {"t": "status", "unit": e.id, "text": "Stunned"})
		_log(s, "%s is stunned and loses its action." % e.name)
		if RULES.traits:
			_trait(s, e, "lost_action", [e])
		return
	if e.st.freeze > 0:
		e.st.freeze = 0
		e.st.tenacity = 1
		_ev(s, {"t": "status", "unit": e.id, "text": "Frozen"})
		_log(s, "%s is frozen solid and loses its action." % e.name)
		if RULES.traits:
			_trait(s, e, "lost_action", [e])
		return
	_static_tick(s, e)
	if e.dead:
		return
	if e.st.fortify <= 0:
		e.block = 0   # a foe's Block lasts from its own action until its next one, through the heroes' turn
	var fx: Array = intent.fx
	var name: String = intent.name
	if e.st.silence > 0:
		e.st.silence = 0
		fx = [{"t": "dmg", "n": 3}]
		name = "Choked Blow"
	elif e.st.neuro > 0:
		e.st.neuro = 0
		fx = [intent.fx[0]]
	var targets := []
	match intent.target:
		"all_heroes":
			targets = s.heroes.duplicate()
		"front2":
			targets = s.heroes.slice(0, 2)
		"back2":
			targets = s.heroes.slice(max(0, s.heroes.size() - 2))
		"all_allies":
			targets = s.enemies.duplicate()
		"self":
			targets = [e]
		"ally_lowest", "ally_front":
			var t := find(s, e.intent_target)
			if t.is_empty():
				t = e
			targets = [t]
		_:
			var t := find(s, e.intent_target)
			if t.is_empty() or t.dead:
				if s.heroes.is_empty():
					return
				t = s.heroes[0] if intent.target == "front" else s.heroes[-1]
			if intent.kind == "attack":
				t = _redirect_hero_target(s, t)
			targets = [t]
	if e.turned != -1:
		var v := find(s, e.turned)
		e.turned = -1
		if not v.is_empty() and not v.dead and intent.kind == "attack":
			targets = [v]
	var tids := []
	for tt in targets:
		tids.append(tt.id)
	_ev(s, {"t": "act", "unit": e.id, "target": targets[0].id if targets.size() == 1 else -1, "targets": tids, "text": name, "intent": intent.duplicate(true)})
	_log(s, "%s: %s." % [e.name, name])
	s.enemy_phase = true
	_exec(s, e, {"name": name, "cat": "physical", "attr": "", "fx": fx}, targets, {"x": 0, "half": false, "prime": 0}, false)
	s.enemy_phase = false

static func _redirect_hero_target(s: Dictionary, t: Dictionary) -> Dictionary:
	for h in s.heroes:
		if h.st.taunt > 0:
			if h != t:
				_ev(s, {"t": "status", "unit": h.id, "text": "Taunt!"})
				_log(s, "%s draws the blow (Taunt)." % h.name)
			return h
	if t.guarded_by != -1:
		var g := find(s, t.guarded_by)
		if not g.is_empty() and not g.dead:
			_ev(s, {"t": "status", "unit": g.id, "text": "Guard!"})
			_log(s, "%s guards %s." % [g.name, t.name])
			return g
	return t

static func _redirect_enemy_target(s: Dictionary, t: Dictionary) -> Dictionary:
	if t.guarded_by != -1:
		var g := find(s, t.guarded_by)
		if not g.is_empty() and not g.dead:
			_ev(s, {"t": "status", "unit": g.id, "text": "Guard!"})
			_log(s, "%s guards %s." % [g.name, t.name])
			return g
	return t

static func _static_tick(s: Dictionary, u: Dictionary) -> void:
	var st: int = u.elements.lightning
	if st > 0:
		_ev(s, {"t": "status", "unit": u.id, "text": "Static"})
		_hurt(s, null, u, st, {"true": false})

# ------------------------------------------------------------------ quantities and conditions
## A named quantity read by card scaling ("per") and conditions ("if"). "t." prefix reads the target.
static func q(s: Dictionary, actor: Dictionary, t: Dictionary, name: String, ctx: Dictionary) -> float:
	var u: Dictionary = actor
	var key := name
	if name.begins_with("t."):
		u = t
		key = name.substr(2)
	elif name.begins_with("m."):
		u = ctx.get("main", {})
		key = name.substr(2)
	match key:
		"x": return ctx.get("x", 0)
		"consumed": return ctx.get("consumed", 0)
		"dealt": return ctx.get("dealt", 0)
		"killed": return 1 if ctx.get("killed", false) else 0
		"prime_count": return s.get("primes_consumed", 0)
		"reactions": return s.get("reactions_round", 0)
		"enemies": return (s.enemies if actor.get("side", "hero") == "hero" else s.heroes).size()
		"allies": return side_arr(s, actor).size()
		"ally_hurt":
			for o in side_arr(s, actor):
				if o != actor and float(o.hp) / o.max_hp < 0.5:
					return 1
			return 0
		"ally_hurt75":
			for o in side_arr(s, actor):
				if float(o.hp) / o.max_hp <= 0.75:
					return 1
			return 0
		"hero_dd":
			for h in s.heroes:
				if h.deaths_door:
					return 1
			return 0
		"hero_stress":
			var m := 0
			for h in s.heroes:
				m = max(m, h.stress)
			return m
		"allies_dd":
			var n := 0
			for h in s.heroes:
				if h.deaths_door:
					n += 1
			return n
		"same_target": return 1 if ctx.get("follow", false) else 0
		"round": return s.round
		"incoming": return _incoming(s, -1)
		"incoming_me": return _incoming(s, actor.id)
		"attackers":
			var n := 0
			for e in s.enemies:
				var it := intent_of(e)
				if not it.is_empty() and it.kind == "attack" and (e.intent_target == actor.id or it.target == "all_heroes" or (actor.st.get("taunt", 0) > 0 and it.target in SINGLE_TARGETS)):
					n += 1
			return n
		"elements_all":
			var seen := {}
			for e in s.enemies:
				for el in Data.ELEMENTS:
					if e.elements[el] > 0:
						seen[el] = true
			return seen.size()
		"total_bleed":
			var n := 0
			for e in s.enemies:
				n += e.st.bleed
			return n
		"total_frost":
			var n := 0
			for e in s.enemies:
				n += e.elements.frost
			return n
		"total_hex":
			var n := 0
			for e in s.enemies:
				n += e.st.hex
			return n
		"total_doom":
			var n := 0
			for e in s.enemies:
				n += e.st.doom
			return n
		"flasks": return s.get("belt", []).size()
		"flasks_used": return s.get("flasks_used", 0)
	if u.is_empty():
		return 0
	match key:
		"hp", "max_hp", "block", "armor", "ward", "stress", "grit", "omen", "played", "resolve":
			return u.get(key, 0)
		"missing_hp": return u.max_hp - u.hp
		"hp_pct": return 100.0 * u.hp / max(1, u.max_hp)
		"dd": return 1 if u.get("deaths_door", false) else 0
		"rank": return rank_of(s, u)
		"elements", "spectrum": return elements_on(u)
		"ailments": return _debuff_count(u)
		"delayed": return 1 if int(u.get("delayed_round", -1)) == int(s.round) else 0
		"incoming_to": return _incoming(s, u.id)
		"targeted":
			var n := 0
			for e in s.enemies:
				var it := intent_of(e)
				if not it.is_empty() and it.kind == "attack" and (e.intent_target == u.id or it.target == "all_heroes"):
					n += 1
			return n
		"scars": return u.get("scars", 0)
		"held_total", "held_kinds", "held_max", "held_min":
			var tot := 0
			var kinds := 0
			var mx := 0
			var mn := 99
			for el in Data.ELEMENTS:
				var v: int = u.get("held", {}).get(el, 0)
				tot += v
				if v > 0:
					kinds += 1
					mn = min(mn, v)
				mx = max(mx, v)
			match key:
				"held_total": return tot
				"held_kinds": return kinds
				"held_max": return mx
			return mn if kinds > 0 else 0
		"el_total":
			var n := 0
			for el in Data.ELEMENTS:
				n += u.elements[el]
			return n
		"el_max":
			var n := 0
			for el in Data.ELEMENTS:
				n = max(n, u.elements[el])
			return n
		"attuned": return u.elements[Data.ELEMENTS[actor.get("attuned", 0)]]
		"attacking":
			var it := intent_of(u) if u.side == "enemy" else {}
			return 1 if not it.is_empty() and it.kind == "attack" else 0
		"targeting_me":
			if u.side == "hero":
				for e in s.enemies:
					var ie := intent_of(e)
					if not ie.is_empty() and ie.kind == "attack" and (e.intent_target == u.id or ie.target == "all_heroes"):
						return 1
				return 0
			var it := intent_of(u) if u.side == "enemy" else {}
			return 1 if not it.is_empty() and it.kind == "attack" and (u.intent_target == actor.id or it.target == "all_heroes" or (actor.st.get("taunt", 0) > 0 and it.target in SINGLE_TARGETS)) else 0
		"moved": return 1 if u.moved else 0
		"exhaust", "discard", "hand", "draw":
			return u.get(key, []).size()
		"debuffs": return _debuff_count(u)
	if Data.ELEMENTS.has(key):
		return u.elements[key]
	if key.begins_with("held_") and Data.ELEMENTS.has(key.substr(5)):
		return u.get("held", {}).get(key.substr(5), 0)
	if u.st.has(key):
		return u.st[key]
	return 0

static func cond(s: Dictionary, actor: Dictionary, t: Dictionary, c: String, ctx: Dictionary) -> bool:
	if c == "":
		return true
	for part in c.split("&"):
		if not _cond1(s, actor, t, part.strip_edges(), ctx):
			return false
	return true

static func _cond1(s: Dictionary, actor: Dictionary, t: Dictionary, c: String, ctx: Dictionary) -> bool:
	for op in [">=", "<=", "==", "!=", ">", "<"]:
		var i := c.find(op)
		if i > 0:
			var lhs := q(s, actor, t, c.substr(0, i), ctx)
			var rs := c.substr(i + op.length())
			var rhs := float(rs) if rs.is_valid_float() else q(s, actor, t, rs, ctx)
			match op:
				">=": return lhs >= rhs
				"<=": return lhs <= rhs
				"==": return lhs == rhs
				"!=": return lhs != rhs
				">": return lhs > rhs
				"<": return lhs < rhs
	if c.begins_with("!"):
		return q(s, actor, t, c.substr(1), ctx) == 0
	return q(s, actor, t, c, ctx) > 0

static func _incoming(s: Dictionary, only_id: int) -> int:
	var total := 0
	for e in s.enemies:
		var it := intent_of(e)
		if it.is_empty() or it.kind != "attack" or e.get("postponed", false):
			continue
		if only_id != -1 and e.intent_target != only_id and it.target != "all_heroes":
			continue
		for f in it.fx:
			if f.t == "dmg":
				total += int(f.n) + e.st.might
	return total

static func _debuff_count(u: Dictionary) -> int:
	var n := 0
	for el in Data.ELEMENTS:
		n += u.elements[el]
	for k in ["bleed", "vulnerable", "mark", "hex", "doom"]:
		n += u.st.get(k, 0)
	return n

## Scaled amount: n + k * per, capped by max; halved for echoes.
static func _amt(s: Dictionary, actor: Dictionary, t: Dictionary, fx: Dictionary, ctx: Dictionary) -> int:
	var n: float = fx.get("n", 0)
	if fx.has("per"):
		n += float(fx.get("k", 1)) * q(s, actor, t, fx.per, ctx)
	if fx.has("max"):
		n = min(n, float(fx.max))
	var v := int(floor(n))
	if ctx.get("half", false) and v > 0:
		v = int(ceil(v / 2.0))
	return v

# ------------------------------------------------------------------ effects
static func _fx_targets(s: Dictionary, actor: Dictionary, fx: Dictionary, base: Array) -> Array:
	var to: String = fx.get("to", "")
	match to:
		"", "target":
			return base
		"self":
			return [actor]
		"all_enemies":
			return (s.enemies if actor.side == "hero" else s.heroes).duplicate()
		"all_allies":
			return side_arr(s, actor).duplicate()
		"allies_other":
			var o := []
			for u in side_arr(s, actor):
				if u != actor:
					o.append(u)
			return o
		"adjacent", "behind", "in_front":
			var o := []
			for t in base:
				var arr := side_arr(s, t)
				var i := arr.find(t)
				var js := [i - 1, i + 1] if to == "adjacent" else ([i + 1] if to == "behind" else [i - 1])
				for j in js:
					if j >= 0 and j < arr.size() and not o.has(arr[j]):
						o.append(arr[j])
			return o
		"front_enemy":
			var arr: Array = s.enemies if actor.side == "hero" else s.heroes
			return [arr[0]] if arr.size() > 0 else []
		"front2":
			var arr: Array = s.enemies if actor.side == "hero" else s.heroes
			return arr.slice(0, 2)
		"self_adjacent":
			var arr := side_arr(s, actor)
			var i := arr.find(actor)
			var o := []
			for j in [i - 1, i + 1]:
				if i >= 0 and j >= 0 and j < arr.size():
					o.append(arr[j])
			return o
		"killer":
			var k := find(s, int(actor.get("last_hit_by", -1)))
			return [k] if not k.is_empty() and not k.dead else []
		"lowest_ally":
			var best: Dictionary = {}
			for u in side_arr(s, actor):
				if best.is_empty() or float(u.hp) / u.max_hp < float(best.hp) / best.max_hp:
					best = u
			return [best] if not best.is_empty() else []
		"attackers":
			var o := []
			for e in s.enemies:
				var it := intent_of(e)
				if not it.is_empty() and it.kind == "attack" and (e.intent_target == actor.id or it.target == "all_heroes"):
					o.append(e)
			return o
	return base

static func _exec(s: Dictionary, actor: Dictionary, c: Dictionary, targets: Array, ctx: Dictionary, only_first: bool) -> void:
	var list: Array = c.fx
	if only_first and list.size() > 1:
		list = [list[0]]
		_ev(s, {"t": "status", "unit": actor.id, "text": "Neurotoxin"})
	var physical: bool = c.get("cat", "physical") == "physical"
	for k in ["consumed", "dealt"]:
		if not ctx.has(k):
			ctx[k] = 0
	if not ctx.has("main"):
		ctx.main = targets[0] if targets.size() > 0 else {}
	for fx in list:
		if actor.dead or s.outcome != "":
			return
		var tl := _fx_targets(s, actor, fx, targets)
		if fx.t in ["self_block", "self_status", "armor", "advance", "retreat", "attune", "attune_to", "prime", "energy", "omen", "self_dmg", "self_stress", "to_front"] and not fx.has("to"):
			tl = [actor]
		var c_if: String = fx.get("if", "")
		for t in tl.duplicate():
			if typeof(t) != TYPE_DICTIONARY or t.is_empty():
				continue
			if t.dead and fx.t != "add":
				continue
			if c_if != "" and not cond(s, actor, t, c_if, ctx):
				continue
			_fx1(s, actor, c, fx, t, ctx, physical)
			if actor.dead or s.outcome != "":
				break
		if fx.t == "dmg":
			ctx.prime = 0
	_check_outcome(s)

static func _fx1(s: Dictionary, actor: Dictionary, c: Dictionary, fx: Dictionary, t: Dictionary, ctx: Dictionary, physical: bool) -> void:
	var n := _amt(s, actor, t, fx, ctx)
	match fx.t:
		"dmg":
			var times: int = fx.get("times", 1)
			if fx.has("times_per"):
				times += int(q(s, actor, t, fx.times_per, ctx))
			var tt: Dictionary = t
			if actor.side == "hero" and tt.side == "enemy":
				tt = _redirect_enemy_target(s, tt)
			for i in times:
				if tt.dead or actor.dead:
					break
				var p: int = ctx.prime
				ctx.prime = 0
				if p > 0:
					s.primes_consumed = s.get("primes_consumed", 0) + 1
				var amount: int = n + p
				if tt.get("flags", []).has("swarm"):
					# Swarm: single-target hits deal half, hits on every foe deal 50% more
					var wide: bool = c.get("target", "") == "all_enemies" or fx.get("to", "") == "all_enemies"
					amount = int(ceil(amount * 1.5)) if wide else int(floor(amount * 0.5))
				var dealt := _attack(s, actor, tt, amount, physical, fx)
				ctx.dealt += dealt
				if tt.dead:
					ctx.killed = true
				if fx.has("lifesteal") and dealt > 0:
					_heal(s, actor, int(ceil(dealt * float(fx.lifesteal) / 100.0)))
		"coup":
			var d: int = 4 + 4 * actor.st.momentum
			actor.st.momentum = 0
			if t.st.mark > 0:
				d *= 2
				t.st.mark = 0
			if ctx.half:
				d = int(ceil(d / 2.0))
			ctx.dealt += _attack(s, actor, t, d + ctx.prime, true, {})
			ctx.prime = 0
		"dmg_per_element":
			ctx.dealt += _attack(s, actor, t, n * elements_on(t) + ctx.prime, false, {})
			ctx.prime = 0
		"block", "self_block", "block_target":
			_gain_block(s, t, n + _take_prime(s, ctx, false))
		"armor":
			t.armor = max(0, t.armor + n)
			_ev(s, {"t": "status", "unit": t.id, "text": ("%+d Armor" % n)})
			_log(s, "%s %s %d Armor." % [t.name, "gains" if n >= 0 else "loses", abs(n)])
		"ward":
			var w: int = max(0, n - t.elements["void"])
			t.ward += w
			_ev(s, {"t": "status", "unit": t.id, "text": "+%d Ward" % w})
		"status", "self_status":
			if n > 0:
				_add_status(s, actor, t, fx.s, n, false)
		"clear":
			if fx.s == "charge":
				actor.st.charge = 0   # a countdown is always the creature's own
			else:
				t.st[fx.s] = 0
		"apply":
			_apply_element(s, actor, t, fx.e, n + _take_prime(s, ctx, true), fx.get("attr", c.get("attr", "stable")))
		"apply_x":
			if ctx.x > 0:
				_apply_element(s, actor, t, fx.e, ctx.x if not ctx.half else int(ceil(ctx.x / 2.0)), fx.get("attr", "volatile"))
		"apply_attuned":
			_apply_element(s, actor, t, Data.ELEMENTS[actor.get("attuned", 0)], n + _take_prime(s, ctx, true), fx.get("attr", c.get("attr", "stable")))
		"apply_next":
			_apply_element(s, actor, t, Data.ELEMENTS[(actor.get("attuned", 0) + 1) % 6], n + _take_prime(s, ctx, true), fx.get("attr", c.get("attr", "stable")))
		"apply_missing":
			for el in Data.ELEMENTS:
				if t.elements[el] == 0 and not t.dead:
					_apply_element(s, actor, t, el, max(1, n), "stable")
		"react":
			var best := ""
			for el in Data.ELEMENTS:
				if t.elements[el] > 0 and (best == "" or t.elements[el] > t.elements[best]):
					best = el
			if best != "":
				t.elements[best] -= 1
				_apply_element(s, actor, t, best, max(1, n) + _take_prime(s, ctx, true), "volatile")
		"attune":
			for i in max(1, n):
				actor.attuned = (actor.attuned + 1) % Data.ELEMENTS.size()
			_ev(s, {"t": "status", "unit": actor.id, "text": "Attuned: " + Data.ELEMENTS[actor.attuned].capitalize()})
			_log(s, "%s attunes to %s." % [actor.name, Data.ELEMENTS[actor.attuned]])
		"attune_to":
			actor.attuned = Data.ELEMENTS.find(fx.e)
			_ev(s, {"t": "status", "unit": actor.id, "text": "Attuned: " + fx.e.capitalize()})
		"push":
			_move(s, t, max(1, n))
		"pull":
			_move(s, t, -max(1, n))
		"advance":
			_move(s, t, -max(1, n))
		"retreat":
			_move(s, t, max(1, n))
		"to_front":
			_move(s, t, -4)
		"swap":
			var arr := side_arr(s, actor)
			var i := arr.find(actor)
			var j := arr.find(t)
			if i >= 0 and j >= 0 and i != j and actor.st.anchor == 0 and t.st.anchor == 0:
				arr[i] = t
				arr[j] = actor
				actor.moved = true
				t.moved = true
				_ev(s, {"t": "move", "unit": actor.id})
				_log(s, "%s swaps with %s." % [actor.name, t.name])
		"guard":
			if t != actor:
				t.guarded_by = actor.id
				_ev(s, {"t": "status", "unit": t.id, "text": "Guarded"})
				_log(s, "%s guards %s." % [actor.name, t.name])
		"guard_weakest":
			var best: Dictionary = {}
			for o in side_arr(s, actor):
				if o != actor and (best.is_empty() or float(o.hp) / o.max_hp < float(best.hp) / best.max_hp):
					best = o
			if not best.is_empty():
				best.guarded_by = actor.id
				best.guard_fresh = actor.side == "enemy"
				_ev(s, {"t": "status", "unit": best.id, "text": "Guarded"})
		"prime":
			s.prime += n
			_ev(s, {"t": "status", "unit": actor.id, "text": "Prime +%d" % n})
			_log(s, "%s primes the next action (+%d)." % [actor.name, n])
		"bash_stun":
			if t.st.mark > 0 or t.moved:
				_add_status(s, actor, t, "stun", 1, false)
		"heal":
			_heal(s, t, n + _take_prime(s, ctx, false))
		"stress":
			if t.side == "hero":
				if n > 0:
					n = int(round(n * (1.0 - clamp(t.get("stress_res", 0), -50, 75) / 100.0)))
				var before: int = t.stress
				t.stress = clamp(t.stress + n, 0, 200)
				var dlt: int = t.stress - before
				if dlt != 0:
					_ev(s, {"t": "stress", "unit": t.id, "n": dlt})
					_log(s, "%s %s %d stress." % [t.name, "gains" if dlt > 0 else "sheds", abs(dlt)])
		"self_stress":
			actor.stress = clamp(actor.stress + n, 0, 200)
			_ev(s, {"t": "stress", "unit": actor.id, "n": n})
		"self_dmg":
			if actor.side == "hero":
				# your own cards cannot put you at Death's Door, or cost Grit once you are there (Gate 3 review)
				var room: int = max(0, int(actor.hp) - 1)
				if room > 0:
					_hurt(s, null, actor, min(n, room), {"true": true})
			else:
				_hurt(s, null, actor, n, {"true": true})
		"draw":
			if t.side == "hero":
				t.bonus_draw += n
				_ev(s, {"t": "status", "unit": t.id, "text": "+%d draw next round" % n})
		"energy":
			s.bonus_energy += n
			_ev(s, {"t": "status", "unit": actor.id, "text": "+%d vigour next round" % n})
		"add":
			if t.side == "hero":
				for i in max(1, n):
					t.next_hand.append(fx.card)
				_ev(s, {"t": "status", "unit": t.id, "text": "+ " + Data.CARDS[fx.card].name})
				_log(s, "%s will have %s next round." % [t.name, Data.CARDS[fx.card].name])
		"consume":
			var amt := 0
			if fx.has("e"):
				amt = t.elements[fx.e]
				t.elements[fx.e] = 0
			elif fx.s in ["block", "ward", "omen"]:
				amt = t.get(fx.s, 0)
				t[fx.s] = 0
			elif fx.s == "elements":
				for el in Data.ELEMENTS:
					amt += t.elements[el]
					t.elements[el] = 0
			else:
				amt = t.st.get(fx.s, 0)
				t.st[fx.s] = 0
			ctx.consumed += amt
		"double":
			if fx.has("e"):
				t.elements[fx.e] *= 2
			elif fx.get("s", "") == "largest":
				var best := ""
				for el in Data.ELEMENTS:
					if t.elements[el] > 0 and (best == "" or t.elements[el] > t.elements[best]):
						best = el
				if best != "":
					t.elements[best] *= 2
			else:
				t.st[fx.s] = t.st.get(fx.s, 0) * 2
			_ev(s, {"t": "status", "unit": t.id, "text": "Doubled"})
		"spread":
			var arr := side_arr(s, t)
			var i := arr.find(t)
			for j in [i - 1, i + 1]:
				if j >= 0 and j < arr.size():
					for el in (Data.ELEMENTS if fx.get("e", "all") == "all" else [fx.e]):
						var amount: int = t.elements[el] if n <= 0 else min(n, t.elements[el])
						if amount > 0:
							_apply_element(s, actor, arr[j], el, amount, "stable")
		"convert":
			var amount: int = t.elements[fx.from]
			t.elements[fx.from] = 0
			if amount > 0:
				t.elements[fx.e] += amount
				t.fresh[fx.e] = true
				_ev(s, {"t": "element", "unit": t.id, "e": fx.e, "n": amount})
		"cleanse":
			var left: int = max(1, n)
			for el in Data.ELEMENTS:
				var r: int = min(left, t.elements[el])
				t.elements[el] -= r
				left -= r
			for k in ["bleed", "vulnerable", "mark", "hex", "doom", "lockdown", "freeze", "neuro"]:
				var r: int = min(left, t.st.get(k, 0))
				t.st[k] -= r
				left -= r
			_ev(s, {"t": "status", "unit": t.id, "text": "Cleansed"})
		"transfer":
			var src: Dictionary = actor
			if fx.get("from", "self") == "ally_most":
				var best := -1
				for h in s.heroes:
					if h != actor and _debuff_count(h) > best:
						best = _debuff_count(h)
						src = h
			var moved := 0
			# n > 0 moves only the n largest ailments (each one with all its stacks); no n moves every ailment
			var ail := []
			for el in Data.ELEMENTS:
				if src.elements[el] > 0:
					ail.append(["e", el, src.elements[el]])
			for k in ["bleed", "vulnerable", "mark", "hex", "doom"]:
				if src.st.get(k, 0) > 0:
					ail.append(["s", k, src.st[k]])
			ail.sort_custom(func(a, b): return a[2] > b[2])
			if fx.has("n") and int(fx.n) > 0:
				ail = ail.slice(0, int(fx.n))
			for a in ail:
				moved += int(a[2])
				if a[0] == "e":
					src.elements[a[1]] = 0
					_apply_element(s, actor, t, a[1], int(a[2]), "stable")
				else:
					t.st[a[1]] = t.st.get(a[1], 0) + int(a[2])
					src.st[a[1]] = 0
			ctx.consumed += moved
			_ev(s, {"t": "status", "unit": t.id, "text": "Transferred %d" % moved})
			_log(s, "%s transfers %d afflictions onto %s." % [actor.name, moved, t.name])
		"execute":
			n += _take_prime(s, ctx, false)   # Prime raises the execute threshold
			var eff_hp: int = t.hp - int(t.st.get("doom", 0))   # Doom lowers every execute check
			if t.side == "enemy" and not t.dead and eff_hp <= n and _next_threshold_hp(t) > 0:
				# a boss with phases left is driven down to its next threshold instead
				t.hp = _next_threshold_hp(t)
				_ev(s, {"t": "reaction", "unit": t.id, "text": "Broken"})
				_check_phase(s, t)
				_rite_fire(s, "execute", t)
			elif t.side == "enemy" and not t.dead and eff_hp <= n:
				_ev(s, {"t": "reaction", "unit": t.id, "text": "Executed"})
				_log(s, "%s is executed." % t.name)
				_kill(s, t)
				ctx.killed = true
				_rite_fire(s, "execute", {})
		"delay":
			_delay(s, t)
		"turn":
			if t.side == "enemy":
				var arr: Array = s.enemies
				var i := arr.find(t)
				var victim: Dictionary = {}
				for j in [i + 1, i - 1]:
					if j >= 0 and j < arr.size():
						victim = arr[j]
						break
				var it := intent_of(t)
				if not victim.is_empty() and not it.is_empty() and it.kind == "attack":
					t.turned = victim.id
					_ev(s, {"t": "status", "unit": t.id, "text": "Turned on " + victim.name.split(" ")[-1]})
					_log(s, "%s's attack is turned on %s." % [t.name, victim.name])
		"steal_block":
			var amount: int = t.block
			t.block = 0
			if amount > 0:
				_gain_block(s, actor, amount)
		"omen":
			actor.omen = actor.get("omen", 0) + n
			_ev(s, {"t": "status", "unit": actor.id, "text": "Omen +%d" % n})
		"cap":
			actor.st.cap = actor.st.get("cap", 0) + n
		"grit":
			if t.side == "hero":
				t.grit += n
				_ev(s, {"t": "status", "unit": t.id, "text": "+%d Grit" % n})
		"kill_self_hp":
			# convert all but 1 HP into Block
			var lost: int = max(0, t.hp - 1)
			t.hp = 1
			_gain_block(s, t, int(lost * float(fx.get("k", 1))))
		"summon":
			_summon(s, actor, fx)
		"discard_random":
			if t.side == "hero" and not t.hand.is_empty():
				var i: int = _rand(s) % t.hand.size()
				t.discard.append(t.hand[i])
				t.hand.remove_at(i)
		"lose_armor":
			t.armor = max(0, t.armor - max(1, n))
		"stress_take":
			# take stress from every other hero onto the actor
			var total := 0
			for h in s.heroes:
				if h != actor:
					var r: int = min(n, h.stress)
					h.stress -= r
					total += r
					if r > 0:
						_ev(s, {"t": "stress", "unit": h.id, "n": -r})
			actor.stress = min(200, actor.stress + total)
			if total > 0:
				_ev(s, {"t": "stress", "unit": actor.id, "n": total})
		"take":
			# move course stacks from the target onto the Vessel (Ward does not stop a Take)
			var els: Array = Data.ELEMENTS if fx.get("e", "") == "all" else [fx.get("e", "") if fx.get("e", "") not in ["", "largest"] else _largest(t, false)]
			var took := 0
			for el in els:
				if el == "" or t.elements[el] <= 0:
					continue
				var amt: int = t.elements[el] if n <= 0 else min(n, t.elements[el])
				t.elements[el] -= amt
				took += amt
				_hold(s, actor, el, amt)
			ctx.consumed += took
		"give":
			# move held stacks onto the target, Stable unless the card says Volatile
			var els: Array = Data.ELEMENTS if fx.get("e", "") == "all" else [fx.get("e", "") if fx.get("e", "") not in ["", "largest"] else _largest(actor, true)]
			var gave := 0
			for el in els:
				if el == "" or actor.held[el] <= 0:
					continue
				var amt: int = actor.held[el] if n <= 0 else min(n, actor.held[el])
				actor.held[el] -= amt
				gave += amt
				_apply_element(s, actor, t, el, amt, fx.get("attr", "stable"))
			ctx.consumed += gave
		"even":
			# even out held stacks across the courses held (The Weighing)
			var kinds := []
			var tot := 0
			for el in Data.ELEMENTS:
				if actor.held[el] > 0:
					kinds.append(el)
					tot += actor.held[el]
			for i in kinds.size():
				actor.held[kinds[i]] = int(tot / kinds.size()) + (1 if i < tot % kinds.size() else 0)
		"brew":
			for i in max(1, n):
				s.belt_next.append(fx.card)
				s.fresh_on_belt.append(fx.card)
			_ev(s, {"t": "status", "unit": actor.id, "text": "Brews " + Data.CARDS[fx.card].name})
			_log(s, "%s brews %s (on the belt next round)." % [actor.name, Data.CARDS[fx.card].name])
		"refill":
			for i in max(1, n):
				if s.belt_used.is_empty():
					break
				var f: String = s.belt_used.pop_back()
				s.belt_next.append(f)
				s.fresh_on_belt.append(f)
				_ev(s, {"t": "status", "unit": actor.id, "text": "Refills " + Data.CARDS[f].name})
		"improve":
			for i in max(1, n):
				var done := false
				for arr_name in ["belt", "belt_next"]:
					var arr: Array = s[arr_name]
					for j in arr.size():
						var f: String = arr[j]
						if not f.ends_with("+") and Data.CARDS.has(f + "+"):
							arr[j] = f + "+"
							s.improved.append(f)
							var fi: int = s.fresh_on_belt.find(f)
							if fi >= 0:
								s.fresh_on_belt[fi] = f + "+"
							_ev(s, {"t": "status", "unit": actor.id, "text": "Improves " + Data.CARDS[f].name})
							done = true
							break
					if done:
						break
		"unbind":
			var found := false
			for h in s.heroes:
				for pile in ["hand", "draw", "discard"]:
					var arr: Array = h[pile]
					for j in arr.size():
						var cd: Dictionary = Data.CARDS.get(arr[j], {})
						if cd.get("rarity", "") in ["A", "Affliction"]:
							var cid: String = arr[j]
							arr.remove_at(j)
							h.exhaust.append(cid)
							_log(s, "%s unbinds %s from %s." % [actor.name, cd.name, h.name])
							if t.side == "enemy" and not t.dead:
								var harm := []
								for f in cd.get("on_draw", []):
									if not f.t in ["energy", "draw", "discard_random", "add"]:
										var g: Dictionary = f.duplicate()
										g.erase("to")
										harm.append(g)
								_exec(s, actor, {"name": cd.name, "cat": "physical", "fx": harm}, [t], {"x": 0, "half": false, "prime": 0}, false)
							found = true
							break
					if found:
						break
				if found:
					break
			if t.side == "enemy" and not t.dead and n > 0:
				_add_status(s, actor, t, "hex", n, false)
		_:
			push_error("unknown fx type: " + str(fx.t))

## Prime spent by a non-damage effect: full on Block and healing, half (rounded up) on course stacks.
static func _take_prime(s: Dictionary, ctx: Dictionary, half: bool) -> int:
	var p: int = int(ctx.get("prime", 0))
	if p <= 0:
		return 0
	ctx.prime = 0
	s.primes_consumed = s.get("primes_consumed", 0) + 1
	return int(ceil(p / 2.0)) if half else p

static func _delay(s: Dictionary, t: Dictionary) -> void:
	if t.side != "enemy" or t.dead:
		return
	if s.lockdown_used.get(t.id, false) or t.st.tenacity > 0:
		_ev(s, {"t": "status", "unit": t.id, "text": "Tenacity"})
		return
	s.lockdown_used[t.id] = true
	t.delayed_round = s.round
	var q: Array = s.enemy_queue
	if q.has(t.id):
		if t.get("postponed_last", false):
			q.erase(t.id)
			q.append(t.id)
			_ev(s, {"t": "status", "unit": t.id, "text": "Will not wait again"})
			_log(s, "%s already waited a round; it acts last instead." % t.name)
		else:
			# Gate 3 review: a Delayed foe's action waits until next round, where it acts first (never twice in a row)
			t.postponed = true
			t.postponed_last = true
			_ev(s, {"t": "status", "unit": t.id, "text": "Postponed"})
			_log(s, "%s's action is postponed to next round." % t.name)

static func _attack(s: Dictionary, src: Dictionary, t: Dictionary, base: int, physical: bool, opts: Dictionary) -> int:
	if t.is_empty() or t.dead:
		return 0
	if t.st.get("dodge", 0) > 0:
		t.st.dodge -= 1
		_ev(s, {"t": "status", "unit": t.id, "text": "Dodged"})
		_log(s, "%s dodges." % t.name)
		return 0
	var d: int = base + src.st.might - src.elements.frost
	if src.st.get("empower", 0) > 0:
		d += int(src.st.empower)   # a one-shot bonus on the next hit, then spent
		src.st.empower = 0
	if src.get("side", "") == "enemy" and float(s.get("foe_dmg", 1.0)) != 1.0:
		d = int(round(d * float(s.foe_dmg)))   # Threat (Rules v2): foes hit harder with every descent cleared
	if RULES.hex:
		d -= int(src.st.get("hex", 0) / 2)   # Hex: 1 less damage per 2 stacks (Rules v2, rule 9)
	d = max(0, d)
	if t.st.vulnerable > 0:
		d = int(ceil(d * 1.5))
	if physical:
		match t.get("resist", {}).get("physical", ""):
			"resist": d = int(d * 0.7)
			"weak": d = int(ceil(d * 1.3))
	if physical and t.st.freeze > 0:
		d += t.st.freeze_bonus
		t.st.freeze = 0
		_ev(s, {"t": "reaction", "unit": t.id, "text": "Shatter"})
		_log(s, "%s shatters free of the ice." % t.name)
	var dealt := _hurt(s, src, t, d, {"true": opts.get("true", false), "pierce": opts.get("pierce", false)})
	if not t.dead and not src.dead:
		if t.st.riposte > 0 and _trigger(s, "riposte_%d" % t.id):
			_ev(s, {"t": "status", "unit": t.id, "text": "Riposte"})
			_log(s, "%s ripostes." % t.name)
			_hurt(s, t, src, t.st.riposte, {})
			t.st.riposte -= 1
		if not src.dead and t.st.get("thorns", 0) > 0 and _trigger(s, "thorns_%d" % t.id):
			_ev(s, {"t": "status", "unit": src.id, "text": "Thorns"})
			_log(s, "%s is pierced by thorns." % src.name)
			_hurt(s, t, src, t.st.thorns, {})
	return dealt

static func _trigger(s: Dictionary, key: String) -> bool:
	var n: int = s.triggers.get(key, 0)
	if n >= TRIGGER_LIMIT:
		return false
	s.triggers[key] = n + 1
	return true

## opts: true (ignore armor and block), pierce (ignore block only)
static func _hurt(s: Dictionary, src, t: Dictionary, amount: int, opts: Dictionary) -> int:
	if t.dead:
		return 0
	var d: int = amount
	var blocked := 0
	if not opts.get("true", false):
		var armor_eff: int = max(0, t.armor - t.elements.toxin)
		d = max(0, d - armor_eff)
		if not opts.get("pierce", false):
			blocked = min(t.block, d)
			t.block -= blocked
			d -= blocked
	_ev(s, {"t": "dmg", "unit": t.id, "n": d, "blocked": blocked})
	if d > 0:
		_log(s, "%s takes %d%s." % [t.name, d, (" (%d blocked)" % blocked) if blocked > 0 else ""])
	elif blocked > 0:
		_log(s, "%s blocks %d." % [t.name, blocked])
	if blocked > 0 and t.side == "hero":
		add_resolve(t, 3)
	if src != null and typeof(src) == TYPE_DICTIONARY and src.has("id"):
		t.last_hit_by = src.id
	_lose_hp(s, t, d)
	if t.dead and src != null and src.get("side", "") == "hero":
		add_resolve(src, 12)
	if RULES.traits and d > 0 and not t.dead and t.side == "enemy" and src != null and src.get("side", "") == "hero" and _trigger(s, "trait_hit_%d" % t.id):
		_trait(s, t, "hit", [src])
	if (d > 0 or blocked > 0) and t.side == "hero" and src != null and src.get("side", "") == "enemy" and not src.dead:
		_rite_fire(s, "hit", src, t.id, "only")
		_rite_fire(s, "ally_hit", src, t.id, "except")
	return d

static func _lose_hp(s: Dictionary, u: Dictionary, d: int) -> void:
	if d <= 0 or u.dead:
		return
	if u.side == "hero":
		if u.deaths_door:
			if u.grit > 0:
				u.grit -= 1
				_ev(s, {"t": "status", "unit": u.id, "text": "Grit holds (%d left)" % u.grit})
				_log(s, "%s endures on Death's Door (%d Grit left)." % [u.name, u.grit])
			else:
				_kill(s, u)
			return
		u.scars = min(int(u.max_hp), int(u.get("scars", 0)) + min(d, int(u.hp)))
		u.hp -= d
		if u.hp <= 0:
			u.hp = 0
			u.deaths_door = true
			u.was_dd = true
			u.stress = min(200, u.stress + 10)
			_ev(s, {"t": "dd", "unit": u.id})
			_log(s, "%s is at Death's Door!" % u.name)
	else:
		u.hp -= d
		_check_phase(s, u)
		if u.hp <= 0:
			u.hp = 0
			_kill(s, u)

## Bosses change their rules at HP thresholds. Damage carries through a threshold; executes stop at it.
static func _check_phase(s: Dictionary, u: Dictionary) -> void:
	var phases: Array = Data.ENEMIES[u.key].get("phases", [])
	while u.phase < phases.size() and u.hp > 0 and float(u.hp) / u.max_hp * 100.0 <= float(phases[u.phase].at):
		var ph: Dictionary = phases[u.phase]
		u.phase += 1
		u.ai_override = ph.ai
		if ph.has("might"):
			u.st.might += int(ph.might)
		if ph.has("heal"):
			u.hp = min(u.max_hp, u.hp + int(ph.heal))
		_ev(s, {"t": "reaction", "unit": u.id, "text": "Phase %d" % (u.phase + 1)})
		_log(s, "%s: %s" % [u.name, ph.text])
		if ph.has("fx"):
			_exec(s, u, {"name": "phase", "cat": "physical", "fx": ph.fx}, [u], {"x": 0, "half": false, "prime": 0}, false)
		if RULES.traits:
			_trait(s, u, "phase", [u])

static func _next_threshold_hp(u: Dictionary) -> int:
	var phases: Array = Data.ENEMIES[u.key].get("phases", [])
	if u.phase < phases.size():
		return int(floor(u.max_hp * float(phases[u.phase].at) / 100.0))
	return -1

static func _kill(s: Dictionary, u: Dictionary) -> void:
	if u.dead:
		return
	u.dead = true
	if RULES.traits and u.side == "enemy":
		var proxy: Dictionary = u.duplicate(false)
		proxy.dead = false
		_trait(s, proxy, "death", [proxy])
	_ev(s, {"t": "death", "unit": u.id})
	_log(s, "%s falls." % u.name)
	side_arr(s, u).erase(u)
	s.enemy_queue.erase(u.id)
	for o in s.heroes + s.enemies:
		if o.guarded_by == u.id:
			o.guarded_by = -1
	if u.side == "enemy":
		if RULES.traits:
			for o in s.enemies.duplicate():
				if not o.dead:
					_trait(s, o, "ally_death", [o])
		_rite_fire(s, "kill", u)
	_check_outcome(s)

static func _check_outcome(s: Dictionary) -> void:
	if s.outcome != "":
		return
	if s.enemies.is_empty():
		s.outcome = "victory"
	elif s.heroes.is_empty():
		s.outcome = "defeat"

static func _gain_block(s: Dictionary, u: Dictionary, n: int) -> void:
	if u.st.blight > 0 and u.side == "enemy":
		_ev(s, {"t": "status", "unit": u.id, "text": "Blighted"})
		return
	var g: int = max(0, n - u.elements["void"])
	u.block += g
	_ev(s, {"t": "block", "unit": u.id, "n": g})

static func _heal(s: Dictionary, u: Dictionary, n: int) -> void:
	if u.dead:
		return
	if u.st.blight > 0:
		_ev(s, {"t": "status", "unit": u.id, "text": "Blighted"})
		_log(s, "%s cannot be healed (Blight)." % u.name)
		return
	var h: int = max(0, n - u.elements.toxin)
	if u.side == "hero" and u.deaths_door and h > 0:
		u.deaths_door = false
	u.hp = min(u.max_hp, u.hp + h)
	_ev(s, {"t": "heal", "unit": u.id, "n": h})
	_log(s, "%s heals %d." % [u.name, h])

static func _add_status(s: Dictionary, src: Dictionary, t: Dictionary, name: String, n: int, quiet: bool) -> void:
	if t.dead:
		return
	if s.get("enemy_phase", false):
		if not t.has("fresh_st"):
			t.fresh_st = {}
		t.fresh_st[name] = true
	match name:
		"stun":
			if t.st.tenacity > 0 or t.get("flags", []).has("unstunnable"):
				_ev(s, {"t": "status", "unit": t.id, "text": "Tenacity"})
				return
			t.st.stun = 1
		"taunt":
			t.st.taunt = 1
		"vulnerable":
			t.st.vulnerable = max(t.st.vulnerable, n)
		"fortify":
			t.st.fortify = max(t.st.fortify, n)
		_:
			t.st[name] = t.st.get(name, 0) + n
	if not quiet:
		_ev(s, {"t": "status", "unit": t.id, "text": "%s %s" % [name.capitalize(), ("+%d" % n) if n > 1 else ""]})
		_log(s, "%s gains %s %d." % [t.name, name.capitalize(), n])

static func _move(s: Dictionary, u: Dictionary, delta: int) -> void:
	if u.st.get("anchor", 0) > 0 or u.get("flags", []).has("immovable"):
		_ev(s, {"t": "status", "unit": u.id, "text": "Anchored"})
		return
	var arr := side_arr(s, u)
	var i := arr.find(u)
	if i < 0:
		return
	var j: int = clamp(i + delta, 0, arr.size() - 1)
	if i == j:
		return
	arr.remove_at(i)
	arr.insert(j, u)
	for k in range(min(i, j), max(i, j) + 1):
		arr[k].moved = true
	_ev(s, {"t": "move", "unit": u.id})
	_log(s, "%s is moved to rank %d." % [u.name, j + 1])
	if RULES.traits and u.side == "enemy":
		_trait(s, u, "moved", [u])

# ------------------------------------------------------------------ elements and reactions
static func _apply_element(s: Dictionary, src: Dictionary, t: Dictionary, e: String, n: int, attr: String) -> void:
	if t.dead or n <= 0:
		return
	if t.get("key", "") == "vessel":
		_hold(s, t, e, n)   # the body rule: courses settle on the Vessel's skin and wait
		return
	if src.side == "hero" and src.st.focus > 0:
		n += src.st.focus
		src.st.focus = 0
	var rs: String = t.get("resist", {}).get(e, "")
	if rs == "immune":
		_ev(s, {"t": "status", "unit": t.id, "text": "Immune"})
		_log(s, "%s is immune to %s." % [t.name, Data.ELEMENT_STATUS[e]])
		return
	elif rs == "resist":
		n = n / 2
		if n <= 0:
			_ev(s, {"t": "status", "unit": t.id, "text": "Resisted"})
			return
	elif rs == "weak":
		n = int(ceil(n * 1.5))
	if t.ward > 0:
		var w: int = min(t.ward, n)
		t.ward -= w
		n -= w
		_ev(s, {"t": "status", "unit": t.id, "text": "Ward absorbs %d" % w})
		if n <= 0:
			return
	if attr == "volatile":
		var reacted := false
		for o in Data.ELEMENTS:
			if o == e or t.elements[o] <= 0 or t.dead:
				continue
			var consumed: int = min(n * 2, t.elements[o])
			t.elements[o] -= consumed
			s.reactions_round = s.get("reactions_round", 0) + 1
			_reaction(s, src, t, e, o, min(MAX_REACTION_POWER + src.get("st", {}).get("cap", 0), n + consumed))
			reacted = true
		if reacted:
			return
	t.elements[e] += n
	t.fresh[e] = true
	_ev(s, {"t": "element", "unit": t.id, "e": e, "n": n})
	_log(s, "%s gains %d %s." % [t.name, n, Data.ELEMENT_STATUS[e]])
	if RULES.traits and t.side == "enemy" and src.get("side", "") == "hero" and _trigger(s, "trait_course_%d" % t.id):
		_trait(s, t, "course", [t], e)

## The Vessel holds up to HOLD_CAP stacks of each course (Gate 2 decision 10); overflow is lost.
const HOLD_CAP := 6

static func _hold(s: Dictionary, v: Dictionary, e: String, n: int) -> void:
	var before: int = v.held[e]
	v.held[e] = min(HOLD_CAP, before + n)
	v.held_fresh = v.get("held_fresh", {})
	v.held_fresh[e] = true
	_ev(s, {"t": "element", "unit": v.id, "e": e, "n": v.held[e] - before})
	_log(s, "%s holds %d %s." % [v.name, v.held[e], Data.ELEMENT_STATUS[e]])

## The largest course a unit carries (held stacks for the Vessel), or "".
static func _largest(u: Dictionary, held: bool) -> String:
	var src: Dictionary = u.held if held else u.elements
	var best := ""
	for el in Data.ELEMENTS:
		if src[el] > 0 and (best == "" or src[el] > src[best]):
			best = el
	return best

static func reaction_key(a: String, b: String) -> String:
	var p := [a, b]
	p.sort()
	return "%s+%s" % p

static func _reaction(s: Dictionary, src: Dictionary, t: Dictionary, a: String, b: String, p: int) -> void:
	var key := reaction_key(a, b)
	var r: Dictionary = Data.REACTIONS[key]
	var res: Dictionary = t.get("resist", {})
	if res.get(a, "") in ["resist", "immune"] or res.get(b, "") in ["resist", "immune"]:
		p = max(1, p / 2)
	elif res.get(a, "") == "weak" or res.get(b, "") == "weak":
		p = int(ceil(p * 1.5))
	_ev(s, {"t": "reaction", "unit": t.id, "text": r.name})
	if src.get("side", "") == "hero":
		add_resolve(src, 8)
		_rite_fire(s, "conjunction", t)
	_log(s, "%s! (%s on %s, power %d)" % [r.name, key.replace("+", " + "), t.name, p])
	match key:
		"fire+frost":
			t.armor = max(0, t.armor - int(ceil(p / 2.0)))
			_hurt(s, src, t, p, {})
		"fire+lightning":
			_hurt(s, src, t, 2 * p, {"pierce": true})
			var arr := side_arr(s, t)
			var i := arr.find(t)
			for j in [i - 1, i + 1]:
				if j >= 0 and j < arr.size():
					_apply_element(s, src, arr[j], "fire", int(ceil(p / 2.0)), "stable")
		"fire+water":
			_hurt(s, src, t, 2 * p, {})
			_add_status(s, src, t, "vulnerable", 1, false)
		"fire+toxin":
			_hurt(s, src, t, 3 * p, {})
		"fire+void":
			t.elements.fire += p
			t.fresh.fire = true
			t.hollow = true
		"frost+lightning":
			if t.side == "enemy":
				if s.lockdown_used.get(t.id, false):
					_ev(s, {"t": "status", "unit": t.id, "text": "Tenacity"})
				else:
					s.lockdown_used[t.id] = true
					if s.enemy_queue.has(t.id):
						s.enemy_queue.erase(t.id)
						s.enemy_queue.append(t.id)
			else:
				t.st.lockdown = 2
		"frost+water":
			if t.st.tenacity > 0 or t.get("flags", []).has("unstunnable"):
				_ev(s, {"t": "status", "unit": t.id, "text": "Tenacity"})
			else:
				t.st.freeze = 2 if t.side == "hero" else 1
				t.st.freeze_bonus = p * 2
		"frost+toxin":
			t.max_hp = max(1, t.max_hp - p)
			t.hp = min(t.hp, t.max_hp)
		"frost+void":
			if not RULES.az_v2:
				if t.side == "enemy":
					if t.hp <= p * 4:
						_kill(s, t)
					else:
						_hurt(s, src, t, p, {})
				else:
					t.hp = 0
					t.deaths_door = true
					_ev(s, {"t": "dd", "unit": t.id})
			elif t.side == "enemy":
				# Rules v2, rule 6: killed at 2x power HP or less; a ruler with phases left drops to its next phase
				var az_hp: int = t.hp - int(t.st.get("doom", 0))   # Doom lowers this execute too (Gate 2 decision 1)
				if az_hp <= p * 2 and _next_threshold_hp(t) > 0:
					t.hp = _next_threshold_hp(t)
					_check_phase(s, t)
				elif az_hp <= p * 2:
					_kill(s, t)
				else:
					_hurt(s, src, t, p, {})
			else:
				_hurt(s, src, t, 2 * p, {"pierce": true})
		"lightning+water":
			_hurt(s, src, t, 2 * p, {})
			for o in side_arr(s, t).duplicate():
				if o != t and not o.dead and o.elements.water > 0:
					o.elements.water -= 1
					_hurt(s, src, o, p, {})
		"lightning+toxin":
			t.st.neuro = 1
		"lightning+void":
			_hurt(s, src, t, 2 * p, {"true": true})
		"toxin+water":
			var side: String = t.side
			s.hazards[side][rank_of(s, t)] = 3
		"void+water":
			if t.side == "enemy":
				t.st.silence = 1
			else:
				var sn: int = min(p * 3, int(RULES.drown_cap))   # Rules v2, rule 7
				t.stress = min(200, t.stress + sn)
				_ev(s, {"t": "stress", "unit": t.id, "n": sn})
		"toxin+void":
			t.st.blight = 2

# ------------------------------------------------------------------ rites (Gate 3: lasting card effects)
## Fires every rite listening for `on`. subject: the trigger's target (empty for none). owner/mode filter by owner:
## "only" keeps rites owned by `owner`, "except" skips them. info carries the played card's kw and cat for "play".
static func _rite_fire(s: Dictionary, on: String, subject: Dictionary, owner := -1, mode := "", info := {}) -> void:
	if s.get("rites", []).is_empty() or int(s.get("rite_depth", 0)) > 2 or s.outcome != "":
		return
	s.rite_depth = int(s.get("rite_depth", 0)) + 1
	for r in s.rites.duplicate():
		var rt: Dictionary = r.rite
		if rt.get("on", "") != on:
			continue
		if mode == "only" and r.owner != owner:
			continue
		if mode == "except" and r.owner == owner:
			continue
		var h := find(s, r.owner)
		if h.is_empty() or h.dead:
			continue
		if rt.has("kw") and not info.get("kw", []).has(rt.kw):
			continue
		if rt.has("cat") and info.get("cat", "") != rt.cat:
			continue
		var pr := int(rt.get("per_round", 0))
		var key := "rite_%d" % int(r.uid)
		if pr > 0 and int(s.triggers.get(key, 0)) >= pr:
			continue
		if rt.has("rounds") and s.round > int(r.get("from_round", 0)) + int(rt.rounds):
			continue
		if on == "play" and not subject.is_empty() and subject.get("side", "") == "hero" and not rt.get("allies", false):
			continue   # a "play" rite answers cards played on foes unless it says allies
		var t: Dictionary = subject if not subject.is_empty() and not subject.get("dead", false) else h
		var rctx := {"x": 0, "half": false, "prime": 0, "consumed": 0, "dealt": 0}
		if not subject.is_empty():
			rctx.main = subject   # m. reads the trigger's subject, even a foe that just died
		if rt.has("if") and not cond(s, h, t, String(rt["if"]), rctx):
			continue
		s.triggers[key] = int(s.triggers.get(key, 0)) + 1
		_ev(s, {"t": "status", "unit": h.id, "text": r.name})
		_exec(s, h, {"name": r.name, "cat": r.cat, "fx": rt.get("fx", [])}, [t], rctx, false)
		if s.outcome != "":
			break
	s.rite_depth = int(s.rite_depth) - 1

# ------------------------------------------------------------------ traits and summons (Rules v2, rules 14 and 15)
## An enemy trait: {"on": "round_start" | "hit" | "death", "fx": [...], "name", "text"}. Targets: the trait's fx "to",
## else `base` (the enemy itself at round start and on death, the hero that hit it on "hit").
static func _trait(s: Dictionary, e: Dictionary, on: String, base: Array, course := "") -> void:
	for tr in Data.ENEMIES[e.key].get("traits", []):
		if tr.get("on", "") != on:
			continue
		if tr.has("e") and course != "" and tr.e != course:
			continue
		_ev(s, {"t": "status", "unit": e.id, "text": tr.get("name", "Trait")})
		_exec(s, e, {"name": tr.get("name", "trait"), "cat": tr.get("cat", "physical"), "fx": tr.fx}, base, {"x": 0, "half": false, "prime": 0}, false)

## Calls a new enemy into the rearmost free rank (at most 4 ranks; large enemies take 2). It shows no intent and does
## not act until next round. fx: {"t": "summon", "e": key, "max": n per summoner per fight}
static func _summon(s: Dictionary, actor: Dictionary, fx: Dictionary) -> void:
	if actor.side != "enemy":
		return
	var used := 0
	for e in s.enemies:
		used += int(e.get("span", 1))
	var d: Dictionary = Data.ENEMIES.get(fx.e, {})
	if d.is_empty() or used + int(d.get("span", 1)) > 4:
		return
	var key := "summons_%d" % actor.id
	if int(s.get(key, 0)) >= int(fx.get("max", 2)):
		return
	s[key] = int(s.get(key, 0)) + 1
	var u := _make_enemy(s, fx.e)
	var setup: Dictionary = s.get("setup", {})
	if not setup.is_empty():
		u.max_hp = int(round(u.max_hp * float(setup.get("foe_hp", 1.0))))
		u.hp = u.max_hp
		u.st.might += int(setup.get("foe_might", 0))
	u.summoned = true
	if fx.get("front", false):
		s.enemies.insert(0, u)
	else:
		s.enemies.append(u)
	_ev(s, {"t": "summon", "unit": u.id, "by": actor.id, "text": u.name})
	_log(s, "%s calls %s." % [actor.name, u.name])

# ------------------------------------------------------------------ end of round
static func end_round(s: Dictionary) -> void:
	if s.outcome != "":
		return
	if RULES.traits:
		for e in s.enemies.duplicate():
			if not e.dead:
				_trait(s, e, "round_end", [e])
	_rite_fire(s, "round_end", {})
	if s.outcome != "":
		return
	for u in (s.heroes + s.enemies).duplicate():
		if u.dead:
			continue
		var burn: int = max(0, u.elements.fire - u.elements.water)
		if burn > 0:
			_ev(s, {"t": "status", "unit": u.id, "text": "Burn"})
			_log(s, "%s burns." % u.name)
			_hurt(s, null, u, burn, {"pierce": u.hollow})
		if not u.dead and u.st.bleed > 0:
			_ev(s, {"t": "status", "unit": u.id, "text": "Bleed"})
			_log(s, "%s bleeds." % u.name)
			_hurt(s, null, u, u.st.bleed, {"true": true})
			u.st.bleed -= 1
	for side in ["hero", "enemy"]:
		var arr: Array = s.heroes if side == "hero" else s.enemies
		var hz: Dictionary = s.hazards[side]
		for r in hz.keys():
			if hz[r] > 0 and r - 1 < arr.size():
				_apply_element(s, {"side": "hazard", "st": {"focus": 0}}, arr[r - 1], "toxin", 1, "stable")
			hz[r] -= 1
			if hz[r] <= 0:
				hz.erase(r)
	for u in (s.heroes + s.enemies).duplicate():
		if u.dead:
			continue
		if u.st.regen > 0:
			_heal(s, u, u.st.regen)
			u.st.regen -= 1
		if u.side == "enemy" and u.st.doom > 0 and u.st.doom >= u.hp:
			if _next_threshold_hp(u) > 0:
				# a ruler with phases left is broken to its next phase instead (Gate 2 decision 7)
				u.hp = _next_threshold_hp(u)
				_ev(s, {"t": "reaction", "unit": u.id, "text": "Doom breaks"})
				_log(s, "Doom breaks %s." % u.name)
				u.st.doom = 0   # the Doom is spent breaking the phase
				_check_phase(s, u)
			else:
				_ev(s, {"t": "reaction", "unit": u.id, "text": "Doom"})
				_log(s, "Doom claims %s." % u.name)
				_kill(s, u)
	if s.outcome != "":
		return
	for u in s.heroes + s.enemies:
		u.st.thorns = int(u.st.thorns / 2)
		u.st.momentum = int(u.st.momentum / 2)
		u.st.riposte = int(u.st.riposte / 2)
		u.st.focus = int(u.st.focus / 2)
		var fs: Dictionary = u.get("fresh_st", {})
		u.fresh_st = {}
		if not (u.side == "enemy" and fs.has("dodge")):
			u.st.dodge = 0
		if not fs.has("anchor"):
			u.st.anchor = max(0, u.st.anchor - 1)
		u.turned = -1
		for e in Data.ELEMENTS:
			if u.fresh[e]:
				u.fresh[e] = false
			elif u.elements[e] > 0 and not (e == "fire" and u.hollow):
				u.elements[e] -= 1
		if u.elements.fire == 0:
			u.hollow = false
		if u.get("key", "") == "vessel":
			var hf: Dictionary = u.get("held_fresh", {})
			for e in Data.ELEMENTS:
				if hf.get(e, false):
					hf[e] = false
				elif u.held[e] > 0:
					u.held[e] -= 1
		# statuses laid in the foes' phase (fs) skip this round's decay, so they last through the next round
		if not fs.has("vulnerable"):
			u.st.vulnerable = max(0, u.st.vulnerable - 1)
		if not fs.has("taunt"):
			u.st.taunt = 0
		u.st.tenacity = 0
		if not fs.has("mark"):
			u.st.mark = max(0, u.st.mark - 1)
		if not fs.has("blight"):
			u.st.blight = max(0, u.st.blight - 1)
		if not fs.has("lockdown"):
			u.st.lockdown = max(0, u.st.lockdown - 1)
		if u.side == "hero":
			u.st.freeze = max(0, u.st.freeze - 1)
			if not fs.has("stun"):
				u.st.stun = 0   # a stunned hero loses one round of cards
		if not (u.side == "enemy" and u.get("guard_fresh", false)):
			u.guarded_by = -1
		u.guard_fresh = false
		u.moved = false
	for h in s.heroes:
		h.played_last = h.played
		var keep := []
		for cid in h.hand:
			if card(cid).get("kw", []).has("Retain") and keep.size() < int(RULES.hand_cap):
				keep.append(cid)
			else:
				h.discard.append(cid)
		h.hand = keep
		if h.stress >= 100:
			_resolve_test(s, h)
	_check_outcome(s)

static func _resolve_test(s: Dictionary, h: Dictionary) -> void:
	if h.resolve >= 50:
		if not RULES.virtues:
			h.stress = 50
			h.st.might += 2
			_heal(s, h, 6)
			_ev(s, {"t": "status", "unit": h.id, "text": "VIRTUE: Steadfast"})
			return
		# Rules v2, rule 11: one of five virtues; half the time the calling's own leaning, half the time any of the five
		var lean: Dictionary = {"bulwark": "stalwart", "duelist": "steadfast", "elementalist": "vigilant", "alchemist": "rallying",
			"oracle": "vigilant", "hexweaver": "unbowed"}
		var v: String = lean.get(h.key, "steadfast") if _rand(s) % 2 == 0 else VIRTUES[_rand(s) % VIRTUES.size()]
		h.virtue = v
		h.stress = 40
		match v:
			"steadfast":
				h.st.might += 2
				_heal(s, h, 6)
			"rallying":
				for o in s.heroes:
					if o != h:
						o.stress = max(0, o.stress - 15)
						_gain_block(s, o, 4)
			"unbowed":
				h.grit += 2
				_heal(s, h, 10)
		_ev(s, {"t": "status", "unit": h.id, "text": "VIRTUE: " + v.capitalize()})
		_log(s, "%s's resolve is tested... %s!" % [h.name, v.capitalize()])
	else:
		h.stress = 60
		var aff := "dread"
		if RULES.afflictions and Data.CARDS.has("aff_" + str(s.get("world", ""))):
			aff = "aff_" + str(s.world)
		h.discard.append(aff)
		_ev(s, {"t": "status", "unit": h.id, "text": "AFFLICTION: Dread"})
		_log(s, "%s's resolve is tested... Dread takes hold (a Dread curse joins the deck)." % h.name)

## Most resolve a hero can earn in one fight, so a long fight cannot be stalled out to farm it.
const RESOLVE_PER_FIGHT := 30

## Heroic acts fill the resolve meter: up to RESOLVE_PER_FIGHT a fight, and never past 100.
static func add_resolve(h: Dictionary, n: int) -> void:
	var room: int = RESOLVE_PER_FIGHT - int(h.get("resolve_gained", 0))
	var gain: int = clampi(n, 0, max(0, min(room, 100 - int(h.resolve))))
	h.resolve = int(h.resolve) + gain
	h.resolve_gained = int(h.get("resolve_gained", 0)) + gain

