class_name Run
extends RefCounted
## The run layer: heroes between fights, the map, supplies, doom, rewards, camp, events, levels, gear,
## relics, save/load, and the meta progression that persists between runs. All state is one Dictionary (Run.r)
## so it saves to JSON as-is. Randomness is seeded from the run seed and a step counter.

## Save format version. Bump it when the shape of run.json or meta.json changes, and teach _migrate_* the step.
const SAVE_VERSION := 1
const LAYERS := 13
const SLOTS := ["weapon", "armor", "trinket1", "trinket2"]

static var r: Dictionary = {}
static var meta: Dictionary = {}
static var C: Dictionary = Data._load_json("res://data/run.json")

# ------------------------------------------------------------------ rng
static func rnd() -> float:
	r.step = int(r.get("step", 0)) + 1
	# splitmix64 over (seed, step). The old string hash moved by 1 per step, so every roll in a run came out almost the
	# same (one encounter repeated, the same rewards and map nodes). Fixed 2026-11-25.
	var z: int = int(r.seed) * 0x5851F42D4C957F2D + int(r.step) * 0x14057B7EF767814F
	z = (z ^ (z >> 30)) * 0x3C79AC492BA7B653
	z = (z ^ (z >> 27)) * 0x1C69B3F74AC4AE35
	z = z ^ (z >> 31)
	return float((z & 0x7fffffff) % 1000003) / 1000003.0

static func rint(n: int) -> int:
	return int(floor(rnd() * n)) % max(1, n)

static func pick(arr: Array):
	return arr[rint(arr.size())] if arr.size() > 0 else null

static func has_asc(id: String) -> bool:
	return r.get("asc", []).has(id)

# ------------------------------------------------------------------ meta
static func meta_path() -> String:
	return SaveIO.path("meta.json")

static func run_path() -> String:
	return SaveIO.path("run.json")

static func meta_load() -> void:
	meta = {"ostia": 0, "unlocked": [], "wins": 0, "runs": 0, "best_depth": 0, "doors": ["drowned"], "cleared": []}
	var v := SaveIO.read_json(meta_path())
	if not v.is_empty():
		meta.merge(_migrate_meta(Data._ints(v)), true)
	meta.version = SAVE_VERSION
	Abbey.ensure()

static func meta_save() -> void:
	meta.version = SAVE_VERSION
	SaveIO.write_json(meta_path(), meta)

## Brings an older meta save up to SAVE_VERSION. Version 0 is every save written before versioning existed.
static func _migrate_meta(v: Dictionary) -> Dictionary:
	var ver := int(v.get("version", 0))
	if ver > SAVE_VERSION:
		push_warning("meta.json was written by a newer Ostium (version %d); loading what this version understands." % ver)
	# 0 -> 1: no shape change; Abbey.ensure() fills in anything missing.
	return v

## Brings an older run save up to SAVE_VERSION. Returns {} if the run cannot be carried forward.
static func _migrate_run(v: Dictionary) -> Dictionary:
	var ver := int(v.get("version", 0))
	if ver > SAVE_VERSION:
		push_warning("run.json was written by a newer Ostium (version %d)." % ver)
		return {}
	# 0 -> 1: a fight in progress was not saved before version 1; the room simply begins again.
	if ver < 1:
		v.erase("fight")
	v.version = SAVE_VERSION
	return v

static func class_unlocked(key: String) -> bool:
	return key in ["bulwark", "duelist", "elementalist"] or meta.unlocked.has(key)

## Doors follow the road (data/story.json): the Drowned Kingdom is open from the start, and clearing a world
## unseals the next door on the road. Once all fifteen are cleared, every door is open and the company may Cast Lots.
static func door_open(w: String) -> bool:
	return all_cleared() or meta.get("doors", ["drowned"]).has(w)

static func all_cleared() -> bool:
	for k in Data.STORY.order:
		if not meta.get("cleared", []).has(k):
			return false
	return true

## The next sealed door on the road, or "" when the road is fully open.
static func next_door() -> String:
	for k in Data.STORY.order:
		if not meta.get("doors", ["drowned"]).has(k):
			return k
	return ""

## The world before this one on the road ("" for the first).
static func prev_on_road(w: String) -> String:
	var i: int = Data.STORY.order.find(w)
	return Data.STORY.order[i - 1] if i > 0 else ""

static func open_doors_from(w: String) -> Array:
	var opened := []
	var i: int = Data.STORY.order.find(w)
	if i >= 0 and i + 1 < Data.STORY.order.size():
		var nk: String = Data.STORY.order[i + 1]
		if not meta.doors.has(nk):
			meta.doors.append(nk)
			opened.append(nk)
	return opened

## Cast Lots: a random door once the road is complete, never the same world twice in a row.
static func cast_lots() -> String:
	var pool: Array = Data.STORY.order.filter(func(k): return k != meta.get("last_world", ""))
	return pool[randi() % pool.size()]

static func world_name() -> String:
	return Data.WORLDS.get(r.get("world", "drowned"), Data.WORLDS.drowned).name

## Threat (Cole, 2026-11-25): every world's foes scale with the descents the abbey has cleared, never with which
## world is rolled, so a random late door on a young save is no harder than the first. Fixed when a descent starts.
## Index = descents cleared (capped at 14). Calibrated in balance/ to about a 35-40% simulated clear rate per tier.
const THREAT_HP := [1.5, 1.63, 1.75, 1.89, 2.02, 2.2, 2.38, 2.56, 2.75, 2.92, 3.08, 3.26, 3.43, 3.58, 3.73]
const THREAT_DMG := [1.32, 1.51, 1.73, 1.94, 2.17, 2.47, 2.8, 3.15, 3.51, 3.89, 4.3, 4.73, 5.17, 5.63, 6.12]

## Foe HP and damage by company size (index = heroes in the fight), so every size is equally hard.
const PARTY_HP := [1.0, 0.5, 0.68, 1.0, 1.3]
const PARTY_DMG := [1.0, 0.7, 0.82, 1.0, 1.15]

static func threat() -> int:
	return clamp(int(meta.get("wins", 0)), 0, THREAT_HP.size() - 1)

static func asc_max() -> int:
	return min(15, int(meta.get("wins", 0)) + 1)

static func buy_unlock(id: String) -> bool:
	var u: Dictionary = C.unlocks[id]
	if meta.unlocked.has(id) or meta.ostia < u.cost:
		return false
	meta.ostia -= u.cost
	meta.unlocked.append(id)
	meta_save()
	return true

# ------------------------------------------------------------------ new run
## A descent with heroes from the persistent roster. Each hero is a copy; Abbey.return_home() writes them back.
static func new_run_roster(party: Array, objective: String, asc: Array, seed: int, world := "drowned") -> void:
	var prov: Dictionary = meta.provisions
	var belt: Array = prov.belt.duplicate()
	if belt.is_empty():
		belt = ["fl_heal"]
	r = {"seed": seed, "step": 0, "objective": objective, "world": world, "threat": threat(), "asc": asc, "heroes": [], "gold": 60, "relics": meta.carried.duplicate(), "runes": [],
		"belt": belt, "belt_max": int(meta.belt_max), "stash": [],
		"supplies": {"food": 8 + int(prov.food), "light": 6 + int(prov.light), "medicine": 2 + int(prov.medicine), "tools": 2 + int(prov.tools)}, "doom": 0, "nodes_moved": 0,
		"map": {}, "at": "", "fights_won": 0, "elites_won": 0, "pilgrim": 20 if objective == "escort" else 0,
		"has_pearl": false, "log": [], "outcome": "", "pending": [], "visited_camp": false}
	meta.last_world = world
	if meta.unlocked.has("provisioner"): r.supplies.food += 2
	if meta.unlocked.has("lamplighter"): r.supplies.light += 2
	if meta.unlocked.has("quartermaster"): r.gold += 40
	if meta.unlocked.has("surgeon"): r.supplies.medicine += 1
	if has_asc("a_food"): r.supplies.food -= 3
	if has_asc("a_light"): r.supplies.light = max(0, r.supplies.light - 2)
	for src in party:
		var h: Dictionary = src.duplicate(true)
		var rs: Dictionary = Abbey.A.reasons.get(h.get("reason", ""), {})
		h.dead = false
		h.resolve = int(rs.get("resolve", 0))
		h.stress = min(200, int(h.stress) + int(rs.get("stress", 0)) + (25 if has_asc("a_stress") else 0))
		if has_asc("a_curse"):
			h.deck.append("dread")
		if meta.unlocked.has("armourer") and h.gear.armor.is_empty():
			h.gear.armor = {"id": pick(["a_padded_jack", "a_brigandine", "a_oilskin"]), "runes": []}
		# Rules v2, rule 17: each descent starts on the calling's starter deck; curses and afflictions carried home stay
		var carried: Array = h.deck.filter(func(c): return Data.CARDS.get(c, {}).get("rarity", "") in ["Curse", "Affliction", "A"])
		h.deck = Data.HEROES[h.key].deck.duplicate() + carried
		h.hp = max_hp(h)
		r.heroes.append(h)
	_gen_map()
	meta.provisions = {"food": 0, "light": 0, "medicine": 0, "tools": 0, "belt": []}
	meta.runs = int(meta.get("runs", 0)) + 1
	meta_save()
	save()

static func living() -> Array:
	var o := []
	for h in r.heroes:
		if not h.dead:
			o.append(h)
	return o

static func say(t: String) -> void:
	r.log.append(t)

# ------------------------------------------------------------------ hero stats
static func stats(h: Dictionary) -> Dictionary:
	var s := {}
	var add := func(d: Dictionary):
		for k in d:
			s[k] = s.get(k, 0) + d[k]
	for slot in SLOTS:
		var it: Dictionary = h.gear[slot]
		if it.is_empty():
			continue
		add.call(C.gear[it.id].stats)
		add.call(Abbey.temper_stats(it))
		for rn in it.get("runes", []):
			add.call(C.runes[rn].stats)
	for t in h.talents:
		add.call(C.talents[t].get("stats", {}))
	add.call(Abbey.reason_stats(h))
	for inj in h.injuries:
		var d: Dictionary = C.injuries[inj]
		for k in ["max_hp", "stress_res", "might"]:
			if d.has(k):
				s[k] = s.get(k, 0) + d[k]
	s["max_hp"] = s.get("max_hp", 0) + 4 * (int(h.level) - 1)
	return s

static func max_hp(h: Dictionary) -> int:
	return max(1, int(h.base_hp) + int(stats(h).get("max_hp", 0)))

static func grit(h: Dictionary) -> int:
	return max(0, int(Data.HEROES[h.key].grit) + int(stats(h).get("grit", 0)) - (1 if has_asc("a_injury") else 0))

static func full_deck(h: Dictionary) -> Array:
	var d: Array = h.deck.duplicate()
	for inj in h.injuries:
		if C.injuries[inj].has("card"):
			d.append(C.injuries[inj].card)
	return d

static func passives(h: Dictionary) -> Array:
	if h.subclass == "":
		return []
	var tiers: Array = C.subclass_passives[h.subclass]
	var o := []
	for i in 3:
		if int(h.level) >= [4, 7, 10][i]:
			o += tiers[i]
	return o

# ------------------------------------------------------------------ combat setup and results
static func combat_setup() -> Dictionary:
	var hs := []
	var res := 0
	var energy := 0
	var start := []
	var round_fx := []
	for id in r.relics:
		var rl: Dictionary = C.relics[id]
		energy += int(rl.get("energy", 0))
		res += int(rl.get("stress_res", 0))
		start += rl.get("start", [])
		round_fx += rl.get("round", [])
	for i in r.heroes.size():
		var h: Dictionary = r.heroes[i]
		if h.dead:
			continue
		var st := stats(h)
		energy += int(st.get("energy", 0))
		hs.append({"index": i, "key": h.key, "max_hp": max_hp(h), "hp": min(h.hp, max_hp(h)), "stress": h.stress, "resolve": h.resolve,
			"deck": full_deck(h), "grit": grit(h), "armor": int(Data.HEROES[h.key].armor) + int(st.get("armor", 0)), "stats": st, "passives": passives(h), "sub": h.get("subclass", "")})
	var lvl := doom_level()
	var tl: int = clamp(int(r.get("threat", 0)), 0, THREAT_HP.size() - 1)
	var foe_hp: float = THREAT_HP[tl] + 0.08 * lvl * (2 if has_asc("a_scaling") else 1) + (0.1 if has_asc("a_hp") else 0.0)
	var foe_might := (1 if has_asc("a_might") else 0) + (1 if r.supplies.light <= 0 else 0) + (lvl / 3)
	# company size (Rules v2 variants, 2026-11-25: 2 heroes cleared 2%, 3 heroes 40%, 4 heroes 93% at equal Threat)
	var n_alive: int = clampi(r.heroes.size(), 1, 4)   # the company that set out: a death does not make foes weaker
	foe_hp *= float(Combat.RULES.get("party_hp_%d" % n_alive, PARTY_HP[n_alive]))
	var foe_dmg: float = THREAT_DMG[tl] * float(Combat.RULES.get("party_dmg_%d" % n_alive, PARTY_DMG[n_alive]))
	return {"heroes": hs, "world": r.get("world", ""), "belt": r.belt.duplicate(), "energy": energy, "start": start, "round": round_fx, "stress_res": res, "foe_hp": foe_hp, "foe_might": foe_might, "foe_dmg": foe_dmg,
		"boss_hp": 1.15 if has_asc("a_boss") else 1.0}

## Writes the fight's outcome back into the run. Returns a summary for the reward screen.
static func after_combat(s: Dictionary, node: Dictionary) -> Dictionary:
	Abbey.record_fight(s)
	# the belt (Gate 2 decision 8): used flasks are gone, Fresh (brewed or refilled) ones spoil, Improved ones revert
	if s.has("belt"):
		var left: Array = s.belt.duplicate() + s.get("belt_next", [])
		for f in s.get("fresh_on_belt", []):
			left.erase(f)
		for i in left.size():
			if String(left[i]).ends_with("+"):
				left[i] = String(left[i]).trim_suffix("+")
		r.belt = left
	var sum := {"won": s.outcome == "victory", "gold": 0, "xp": 0, "injuries": [], "deaths": [], "levels": []}
	var alive_ids := {}
	for ch in s.heroes:
		alive_ids[ch.run_index] = ch
	for i in r.heroes.size():
		var h: Dictionary = r.heroes[i]
		if h.dead:
			continue
		if not alive_ids.has(i):
			h.dead = true
			sum.deaths.append(h.name)
			say("%s died in the %s." % [h.name, node.get("room_name", "dark")])
			continue
		var ch: Dictionary = alive_ids[i]
		h.hp = max(1, ch.hp)
		h.stress = ch.stress
		h.resolve = ch.resolve
		# curses picked up in the fight join the deck
		var cur := {}
		for c in ch.discard + ch.draw + ch.hand + ch.exhaust:
			if c == "dread" or String(c).begins_with("aff_"):
				cur[c] = int(cur.get(c, 0)) + 1
		for c in cur:
			for k in max(0, int(cur[c]) - h.deck.count(c)):
				h.deck.append(c)
		if ch.get("was_dd", false) or ch.deaths_door:
			var inj: String = pick(C.injuries.keys())
			if not h.injuries.has(inj):
				h.injuries.append(inj)
				sum.injuries.append("%s: %s" % [h.name, C.injuries[inj].name])
			if r.objective == "escort":
				r.pilgrim -= 5
	if living().is_empty():
		r.outcome = "defeat"
		return sum
	if not sum.won:
		r.outcome = "defeat"
		return sum
	var tier: String = node.get("tier", "foe")
	var gold: int = {"foe": 18, "elite": 42, "guardian": 60, "boss": 100}.get(tier, 18) + rint(10)
	gold = int(gold * gold_mult())
	r.gold += gold
	sum.gold = gold
	var xp: int = {"foe": 4, "elite": 10, "guardian": 16, "boss": 24}.get(tier, 4)   # Rules v2, rule 21
	sum.xp = xp
	for h in living():
		var before: int = h.level
		gain_xp(h, xp)
		if h.level > before:
			sum.levels.append("%s reaches level %d" % [h.name, h.level])
	r.fights_won += 1
	if tier == "elite":
		r.elites_won += 1
	if node.get("keeper", false):
		r.has_pearl = true
		say("The Pearl of Saint Ysolde is yours.")
	if tier == "boss":
		r.outcome = "victory" if objective_met() else "defeat"
	_queue_rewards(tier, node)
	save()
	return sum

static func gold_mult() -> float:
	var m := 1.0
	for id in r.relics:
		m *= float(C.relics[id].get("gold_mult", 1.0))
	if has_asc("a_gold"):
		m *= 0.75
	return m

static func objective_met() -> bool:
	match r.objective:
		"relic": return r.has_pearl
		"purge": return r.fights_won >= 7
		"escort": return r.pilgrim > 0
	return true

# ------------------------------------------------------------------ rewards queue (shown one screen at a time)
static func _queue_rewards(tier: String, node: Dictionary) -> void:
	for h in living():
		r.pending.append({"kind": "card", "hero": r.heroes.find(h)})
	if tier == "elite" or tier == "boss":
		r.pending.append({"kind": "relic"})
	if tier == "elite" or rnd() < 0.25:
		r.pending.append({"kind": "gear"})
	if rnd() < 0.2:
		r.pending.append({"kind": "rune"})
	for h in living():
		_queue_levelups(h)

static func _queue_levelups(h: Dictionary) -> void:
	while int(h.get("levels_seen", 1)) < int(h.level):
		h.levels_seen = int(h.get("levels_seen", 1)) + 1
		var lv: int = h.levels_seen
		if lv == 4 and h.subclass == "":
			r.pending.append({"kind": "subclass", "hero": r.heroes.find(h)})
		else:
			r.pending.append({"kind": "talent", "hero": r.heroes.find(h), "level": lv})

static func gain_xp(h: Dictionary, n: int) -> void:
	h.xp = int(h.xp) + int(round(n * Abbey.xp_mult(h)))
	var lv := 1
	for i in C.xp_levels.size():
		if h.xp >= C.xp_levels[i]:
			lv = i + 1
	var old: int = h.level
	h.level = min(10, lv)
	if h.level > old:
		h.hp = int(h.hp) + 4 * (h.level - old)

static func card_choices(h: Dictionary, n := 3) -> Array:
	if has_asc("a_choice"):
		n = min(n, 2)
	var pool := Data.pool(h.key, h.subclass)
	var by := {"C": [], "U": [], "R": [], "X": []}
	for id in pool:
		by[Data.CARDS[id].rarity].append(id)
	var out := []
	var guard := 0
	var depth := float(current_layer()) / LAYERS
	while out.size() < n and guard < 60:
		guard += 1
		var roll := rnd()
		var rar := "R" if roll < 0.06 + 0.1 * depth else ("U" if roll < 0.38 + 0.1 * depth else "C")
		if h.subclass != "" and rnd() < 0.3:
			rar = "X"
		var arr: Array = by[rar]
		if arr.is_empty():
			continue
		var id: String = pick(arr)
		if not out.has(id):
			out.append(id)
	return out

static func gear_drop(tier := "foe") -> Dictionary:
	var ids: Array = C.gear.keys()
	var want := "R" if (tier == "boss" or rnd() < 0.12) else ("U" if rnd() < 0.4 else "C")
	var cand := []
	for id in ids:
		if C.gear[id].rarity == want:
			cand.append(id)
	return {"id": pick(cand), "runes": []}

static func relic_drop() -> String:
	var cand := []
	for id in C.relics:
		if not r.relics.has(id):
			cand.append(id)
	return pick(cand) if cand.size() > 0 else ""

static func relic_cap() -> int:
	return 4 + min(6, int(meta.get("wins", 0)))

# ------------------------------------------------------------------ map
static func _gen_map() -> void:
	var nodes := {}
	var layers := []
	for L in LAYERS:
		var n := 1 if L in [0, 6, LAYERS - 1] else 2 + rint(3)
		var row := []
		for i in n:
			var id := "n%d_%d" % [L, i]
			var t := _node_type(L)
			var node := {"id": id, "layer": L, "x": (i + 1.0) / (n + 1.0) + (rnd() - 0.5) * 0.06, "type": t, "links": [], "visited": false, "revealed": L <= 1}
			nodes[id] = node
			row.append(id)
		layers.append(row)
	# links: each node joins the nearest one or two nodes of the next layer; every next node gets at least one parent
	for L in LAYERS - 1:
		var a: Array = layers[L]
		var b: Array = layers[L + 1]
		for id in a:
			var x: float = nodes[id].x
			var sorted := b.duplicate()
			sorted.sort_custom(func(p, q): return abs(nodes[p].x - x) < abs(nodes[q].x - x))
			nodes[id].links.append(sorted[0])
			if sorted.size() > 1 and rnd() < 0.55:
				nodes[id].links.append(sorted[1])
		for id in b:
			var has_parent := false
			for p in a:
				if nodes[p].links.has(id):
					has_parent = true
			if not has_parent:
				var best: String = a[0]
				for p in a:
					if abs(nodes[p].x - nodes[id].x) < abs(nodes[best].x - nodes[id].x):
						best = p
				nodes[best].links.append(id)
	# objective nodes
	if r.objective == "relic":
		var row: Array = layers[9]
		var k: String = row[rint(row.size())]
		nodes[k].type = "elite"
		nodes[k].keeper = true
	nodes[layers[0][0]].type = "start"
	nodes[layers[6][0]].type = "waypoint"
	nodes[layers[LAYERS - 1][0]].type = "boss"
	r.map = {"nodes": nodes, "layers": layers}
	r.at = layers[0][0]
	nodes[r.at].visited = true
	_reveal()

static func _node_type(L: int) -> String:
	var w := {"combat": 46, "event": 22, "elite": 0 if L < 3 else (16 if has_asc("a_elite") else 10), "merchant": 7, "shrine": 6, "camp": 0 if L < 4 else 6, "hidden": 4}
	var total := 0
	for k in w:
		total += w[k]
	var x := rnd() * total
	for k in w:
		x -= w[k]
		if x <= 0:
			return k
	return "combat"

static func node(id: String) -> Dictionary:
	return r.map.nodes.get(id, {})

static func current_layer() -> int:
	return int(node(r.at).get("layer", 0))

static func next_nodes() -> Array:
	return node(r.at).get("links", [])

static func _reveal(extra := 0) -> void:
	var L := current_layer()
	for id in r.map.nodes:
		var n: Dictionary = r.map.nodes[id]
		if n.layer <= L + 1 + extra:
			n.revealed = true

static func scout() -> bool:
	if r.supplies.light <= 0:
		return false
	r.supplies.light -= 1
	_reveal(3)
	say("You spend light to scout ahead.")
	save()
	return true

static func doom_level() -> int:
	return int(r.doom) / 4

## Moves the company. Returns the node so the UI can open the right screen.
static func move_to(id: String) -> Dictionary:
	var n := node(id)
	r.at = id
	n.visited = true
	r.nodes_moved += 1
	r.doom += 2 if has_asc("a_doom") else 1
	if r.supplies.food > 0:
		r.supplies.food -= 1
	else:
		for h in living():
			add_stress(h, 12)
		say("No food. The company starves (+12 stress each).")
	if r.nodes_moved % 2 == 0 and r.supplies.light > 0:
		r.supplies.light -= 1
	if r.supplies.light <= 0:
		for h in living():
			add_stress(h, 4)
	# doom corrupts unvisited events into fights as the water rises
	if doom_level() >= 2:
		for nid in r.map.nodes:
			var o: Dictionary = r.map.nodes[nid]
			if not o.visited and o.type == "event" and rnd() < 0.15:
				o.type = "combat"
				o.corrupted = true
	_reveal()
	save()
	return n

static func add_stress(h: Dictionary, n: int) -> void:
	var res := float(stats(h).get("stress_res", 0))
	for id in r.relics:
		res += float(C.relics[id].get("stress_res", 0))
	h.stress = clamp(int(h.stress) + int(round(n * (1.0 - clamp(res, -50, 75) / 100.0))), 0, 200)

static func room_for(n: Dictionary) -> int:
	if n.has("room"):
		return n.room
	var tier := "foe"
	match n.type:
		"elite": tier = "elite"
		"boss": tier = "boss"
	var L: int = n.layer
	var cand := []
	var w: String = r.get("world", "drowned")
	var first := -1
	for i in Data.ENCOUNTERS.size():
		var e: Dictionary = Data.ENCOUNTERS[i]
		if e.tier != tier or e.get("world", "drowned") != w:
			continue
		if first == -1:
			first = i
		if tier == "foe":
			var hard: bool = e.enemies.size() >= 3
			if L < 4 and hard and i > first + 2:
				continue
		cand.append(i)
	if tier == "boss" and w == "drowned":
		var want: String = {"boss": "The Drowned King", "relic": "The Bell Below", "purge": "The Bell Below", "escort": "Mother of Brine"}[r.objective]
		for i in cand:
			if Data.ENCOUNTERS[i].name == want:
				n.room = i
				return i
	n.room = pick(cand)
	n.tier = tier
	return n.room

# ------------------------------------------------------------------ camp and services
static func price(base: int) -> int:
	return int(round(base * (1.25 if has_asc("a_prices") else 1.0)))

static func field_camp(choice: String) -> String:
	if r.supplies.food < 2:
		return "Not enough food to make camp (2 needed)."
	r.supplies.food -= 2
	var mult := 0.5 if has_asc("a_heal") else 1.0
	for h in living():
		if choice == "rest":
			h.hp = min(max_hp(h), h.hp + int(max_hp(h) * 0.3 * mult))
		else:
			h.stress = max(0, h.stress - int(25 * mult))
	save()
	return "The company rests." if choice == "rest" else "The company talks through the night. Stress eases."

static func infirmary_heal(h: Dictionary) -> String:
	var cost := price(20)
	if r.gold < cost: return "Not enough gold."
	r.gold -= cost
	h.hp = max_hp(h)
	save()
	return "%s is patched up." % h.name

static func treat_injury(h: Dictionary, use_medicine: bool) -> String:
	if h.injuries.is_empty(): return "Nothing to treat."
	if use_medicine:
		if r.supplies.medicine <= 0: return "No medicine."
		r.supplies.medicine -= 1
	else:
		var cost := price(35)
		if r.gold < cost: return "Not enough gold."
		r.gold -= cost
	var inj: String = h.injuries.pop_back()
	save()
	return "%s's %s is treated." % [h.name, C.injuries[inj].name]

static func respite(h: Dictionary) -> String:
	var cost := price(15)
	if r.gold < cost: return "Not enough gold."
	r.gold -= cost
	h.stress = max(0, h.stress - 40)
	var n: int = h.deck.count("dread")
	if n > 0:
		h.deck.erase("dread")
	save()
	return "%s finds some peace%s." % [h.name, " and sheds a Dread curse" if n > 0 else ""]

static func remove_card(h: Dictionary, cid: String, cost: int) -> String:
	if r.gold < cost: return "Not enough gold."
	if not h.deck.has(cid): return ""
	r.gold -= cost
	h.deck.erase(cid)
	save()
	return "%s is struck from %s's deck." % [Data.CARDS[cid].name, h.name]

static func socket_rune(h: Dictionary, slot: String, rune: String) -> String:
	var it: Dictionary = h.gear[slot]
	if it.is_empty(): return "Nothing in that slot."
	if it.runes.size() >= Abbey.sockets(it): return "No free socket."
	if not r.runes.has(rune): return ""
	r.runes.erase(rune)
	it.runes.append(rune)
	save()
	return "%s set into %s." % [C.runes[rune].name, C.gear[it.id].name]

static func equip(h: Dictionary, it: Dictionary) -> String:
	var g: Dictionary = C.gear[it.id]
	if g.cls != null and g.cls != h.key:
		return "Only the %s can use that." % Data.HEROES[g.cls].name
	var slot: String = g.slot
	if slot == "trinket":
		slot = "trinket1" if h.gear.trinket1.is_empty() else ("trinket2" if h.gear.trinket2.is_empty() else "trinket1")
	var old: Dictionary = h.gear[slot]
	h.gear[slot] = it
	r.stash.erase(it)
	if not old.is_empty():
		r.stash.append(old)
	h.hp = min(h.hp, max_hp(h))
	save()
	return "%s equips %s." % [h.name, g.name]

static func merchant_stock() -> Dictionary:
	var n := node(r.at)
	if n.has("stock"):
		return n.stock
	var cards := []
	for h in living():
		for c in card_choices(h, 2):
			cards.append({"hero": r.heroes.find(h), "card": c, "price": price({"C": 45, "U": 70, "R": 110, "X": 85}[Data.CARDS[c].rarity])})
	var gear := []
	for i in 3:
		var it := gear_drop()
		gear.append({"item": it, "price": price({"C": 50, "U": 85, "R": 140}[C.gear[it.id].rarity])})
	var relic := relic_drop()
	var stock := {"cards": cards, "gear": gear, "relic": {"id": relic, "price": price(150)} if relic != "" else {}, "rune": {"id": pick(C.runes.keys()), "price": price(60)},
		"flasks": [{"card": pick(C.consumables), "price": price(25)}, {"card": pick(C.consumables), "price": price(25)}],
		"supplies": {"food": price(10), "light": price(12), "medicine": price(30), "tools": price(25)}}
	n.stock = stock
	return stock

static func spend(n: int) -> bool:
	if r.gold < n:
		return false
	r.gold -= n
	return true

static func shrine(choice: String) -> String:
	match choice:
		"blood":
			var h: Dictionary = living().reduce(func(a, b): return a if a.hp >= b.hp else b)
			h.base_hp = int(h.base_hp) - 6
			h.hp = min(h.hp, max_hp(h))
			var rl := relic_drop()
			if rl != "" and r.relics.size() < relic_cap():
				r.relics.append(rl)
				save()
				return "%s bleeds into the font (-6 max HP). The saint grants %s." % [h.name, C.relics[rl].name]
			return "The saint takes the blood and gives nothing."
		"fear":
			for h in living():
				add_stress(h, 18)
			r.stash.append(gear_drop("elite"))
			save()
			return "You look into the font. You see too much. Something lies at the bottom: gear, now in your pack."
		"prayer":
			if not spend(price(30)):
				return "Not enough gold."
			for h in living():
				h.hp = min(max_hp(h), h.hp + 10)
				h.stress = max(0, h.stress - 10)
			save()
			return "The company prays. Wounds close a little, fears ebb."
	return ""

# ------------------------------------------------------------------ events
static func event_for(n: Dictionary) -> Dictionary:
	if not n.has("event"):
		var seen: Array = r.get("events_seen", [])
		var cand := []
		var here := []
		for e in C.events:
			if e.get("world", r.get("world", "drowned")) == r.get("world", "drowned"):
				here.append(e)
		for e in here:
			if not seen.has(e.id):
				cand.append(e)
		if cand.is_empty():
			cand = here
		var e: Dictionary = pick(cand)
		n.event = e.id
		seen.append(e.id)
		r.events_seen = seen
	for e in C.events:
		if e.id == n.event:
			return e
	return {}

static func option_ok(o: Dictionary) -> bool:
	var req: Dictionary = o.get("req", {})
	for k in req:
		if k == "gold":
			if r.gold < req[k]:
				return false
		elif r.supplies.get(k, 0) < req[k]:
			return false
	return true

## Applies an event option. Returns {text, fight?, card_for?, remove?}.
static func apply_option(o: Dictionary) -> Dictionary:
	var res := {"text": o.after, "notes": []}
	for x in o.outcome:
		var who: Array = _who(x.get("who", "all"))
		match x.t:
			"gold":
				r.gold = max(0, r.gold + int(x.n))
				res.notes.append("%+d gold" % x.n)
			"supply":
				r.supplies[x.s] = max(0, r.supplies[x.s] + int(x.n))
				res.notes.append("%+d %s" % [x.n, x.s])
			"hp":
				for h in who:
					h.hp = clamp(h.hp + int(x.n), 1, max_hp(h))
				res.notes.append("%+d HP (%s)" % [x.n, _names(who)])
			"maxhp":
				for h in who:
					h.base_hp = int(h.base_hp) + int(x.n)
					h.hp = min(h.hp, max_hp(h))
				res.notes.append("%+d max HP (%s)" % [x.n, _names(who)])
			"stress":
				for h in who:
					if x.n > 0:
						add_stress(h, int(x.n))
					else:
						h.stress = max(0, h.stress + int(x.n))
				res.notes.append("%+d stress (%s)" % [x.n, _names(who)])
			"doom":
				r.doom = max(0, r.doom + int(x.n))
				res.notes.append("doom %+d" % x.n)
			"xp":
				for h in living():
					gain_xp(h, int(x.n))
					_queue_levelups(h)
				res.notes.append("+%d experience" % x.n)
			"relic":
				var rl := relic_drop()
				if rl != "" and r.relics.size() < relic_cap():
					r.relics.append(rl)
					res.notes.append("relic: " + C.relics[rl].name)
			"gear":
				var it := gear_drop()
				r.stash.append(it)
				res.notes.append("gear: " + C.gear[it.id].name)
			"rune":
				var rn: String = pick(C.runes.keys())
				r.runes.append(rn)
				res.notes.append("rune: " + C.runes[rn].name)
			"card":
				var h: Dictionary = pick(living())
				r.pending.append({"kind": "card", "hero": r.heroes.find(h)})
			"curse":
				for h in who:
					h.deck.append("dread")
				res.notes.append("Dread curse (%s)" % _names(who))
			"remove_card":
				r.pending.append({"kind": "remove", "hero": r.heroes.find(pick(living()))})
			"fight":
				res.fight = true
	save()
	return res

static func _who(w: String) -> Array:
	var l := living()
	if l.is_empty():
		return []
	match w:
		"all": return l
		"random": return [pick(l)]
		"highest":
			var b: Dictionary = l[0]
			for h in l:
				if h.hp > b.hp:
					b = h
			return [b]
		"lowest":
			var b: Dictionary = l[0]
			for h in l:
				if h.hp < b.hp:
					b = h
			return [b]
	return l

static func _names(a: Array) -> String:
	var o := []
	for h in a:
		o.append(h.name)
	return ", ".join(o)

static func hidden_cache() -> String:
	if r.supplies.tools <= 0:
		return "A hidden cache, sealed. You have no tools to open it."
	r.supplies.tools -= 1
	var g := 40 + rint(40)
	r.gold += g
	var rn: String = pick(C.runes.keys())
	r.runes.append(rn)
	save()
	return "You pry the cache open: %d gold and a %s." % [g, C.runes[rn].name]

# ------------------------------------------------------------------ end of run, save and load
static func end_run() -> int:
	var depth := current_layer()
	var o := 4 * depth + 20 * int(r.elites_won) + (60 if r.outcome == "victory" else 0)
	if r.outcome == "victory":
		o += int(C.objectives[r.objective].reward)
		meta.wins = int(meta.get("wins", 0)) + 1
		var w: String = r.get("world", "drowned")
		if not meta.cleared.has(w):
			meta.cleared.append(w)
			o += 40
		r["opened"] = open_doors_from(w)
		r["road_done"] = all_cleared() and meta.cleared.size() == Data.STORY.order.size() and not meta.get("road_announced", false)
		if r.road_done:
			meta.road_announced = true
	if not r.heroes.is_empty() and r.heroes[0].has("id"):
		var home := Abbey.return_home()
		o += int(home.ostia)
		r["home_lines"] = home.lines
	meta.ostia = int(meta.ostia) + o
	meta.best_depth = max(int(meta.get("best_depth", 0)), depth)
	meta_save()
	SaveIO.remove(run_path())
	return o

static func save() -> void:
	if r.is_empty():
		return
	r.version = SAVE_VERSION
	SaveIO.write_json(run_path(), r)

static func has_save() -> bool:
	return SaveIO.exists(run_path())

static func load_run() -> bool:
	var v := SaveIO.read_json(run_path())
	if v.is_empty():
		return false
	v = _migrate_run(Data._ints(v))
	if v.is_empty():
		return false
	r = v
	return true

# ------------------------------------------------------------------ a fight in progress
## The whole fight state is kept in the run save after every round, and again the moment a round is committed
## (with the committed Ordo), so leaving or crashing mid-fight resumes the same round, hand and foes exactly.
static func save_fight(idx: int, state: Dictionary, committed: Array) -> void:
	if r.is_empty():
		return
	r.fight = {"idx": idx, "node": r.get("at", ""), "blob": SaveIO.pack({"s": state, "plan": committed})}
	save()

## The saved fight for the room the company is in, or {} if there is none (or it belongs to another room).
static func saved_fight() -> Dictionary:
	var f: Dictionary = r.get("fight", {})
	if f.is_empty() or String(f.get("node", "")) != String(r.get("at", "")):
		return {}
	var v = SaveIO.unpack(String(f.get("blob", "")))
	if typeof(v) != TYPE_DICTIONARY or typeof(v.get("s")) != TYPE_DICTIONARY or v.s.is_empty():
		return {}
	return {"idx": int(f.idx), "s": v.s, "plan": v.get("plan", [])}

static func clear_fight() -> void:
	r.erase("fight")

