extends SceneTree
## Balance sim, layer 3: whole descents through the game's own Run code. A reference company for the chosen door (Rules
## v2, "Reference companies") walks the map, fights with SimPlanner, takes rewards, rests or upgrades at camps, fights the
## midpoint guardian and the ruler. One JSON line per descent.
## Usage: godot --headless --path . --script res://balance/descent.gd -- door=1 runs=20 party=bulwark,duelist,elementalist
##        out=/path.jsonl planner=look rules='{"vigour_per":2}'

const TALENTS = ["tough", "grit", "sharp", "steady", "iron_hide", "studied", "quick"]
# door -> [level, gear rarities, runes per hero, relics carried]
const REF = {1: [1, ["C"], 0, 0], 2: [2, ["C"], 0, 0], 3: [3, ["C"], 0, 1], 4: [4, ["C", "U"], 1, 1], 5: [4, ["C", "U"], 1, 1],
	6: [5, ["C", "U"], 1, 1], 7: [6, ["U"], 2, 1], 8: [6, ["U"], 2, 2], 9: [7, ["U"], 2, 2], 10: [8, ["U", "R"], 3, 2],
	11: [8, ["U", "R"], 3, 2], 12: [9, ["U", "R"], 3, 2], 13: [9, ["R"], 3, 2], 14: [10, ["R"], 4, 3], 15: [10, ["R"], 4, 3]}

var level_name = "look"
var foe_mult = 1.0
var foe_might = 0
var stats = {}

func arg(name: String, dflt: String) -> String:
	for a in OS.get_cmdline_user_args():
		if a.begins_with(name + "="):
			return a.substr(name.length() + 1)
	return dflt

func _init() -> void:
	var party: Array = arg("party", "bulwark,duelist,elementalist").split(",")
	var door = int(arg("door", "1"))
	var runs = int(arg("runs", "10"))
	var seed0 = int(arg("seed", "100"))
	level_name = arg("planner", "look")
	foe_mult = float(arg("foe", "1.0"))
	foe_might = int(arg("might", "0"))
	var rules = JSON.parse_string(arg("rules", "{}"))
	if typeof(rules) == TYPE_DICTIONARY:
		for k in rules:
			Combat.RULES[k] = rules[k]
	var outp = arg("out", "/tmp/descents.jsonl")
	SaveIO.dir = "user://sim_%d" % OS.get_process_id()
	var f = FileAccess.open(outp, FileAccess.WRITE)
	var t0 = Time.get_ticks_msec()
	for i in runs:
		var res = descent(party, door, seed0 + i * 7919)
		f.store_line(JSON.stringify(res))
		f.flush()
	f.close()
	print("done %d descents in %d ms" % [runs, Time.get_ticks_msec() - t0])
	quit()

# ------------------------------------------------------------------ the reference company
func make_company(party: Array, door: int, seed: int) -> void:
	SaveIO.remove(Run.meta_path())
	SaveIO.remove(Run.run_path())
	Run.meta_load()
	seed(seed)
	var ref: Array = REF[door]
	var m: Dictionary = Run.meta
	m.roster = []
	m.party = []
	for key in party:
		var h = Abbey.make_hero(key, "", int(ref[0]))
		h.levels_seen = h.level
		var subs: Array = Data.HEROES[key].subclasses.keys()
		if h.level >= 4:
			h.subclass = subs[seed % subs.size()]
		for lv in range(2, h.level + 1):
			if lv != 4:
				h.talents.append(TALENTS[(lv + seed) % TALENTS.size()])
		# gear of the door's tier, runes in its sockets
		for slot in ["weapon", "armor", "trinket1", "trinket2"]:
			var want_slot: String = "trinket" if slot.begins_with("trinket") else slot
			var cand = []
			for gid in Run.C.gear:
				var g: Dictionary = Run.C.gear[gid]
				if g.slot == want_slot and ref[1].has(g.rarity) and (g.cls == null or g.cls == key):
					cand.append(gid)
			if cand.is_empty():
				continue
			var it = {"id": cand[(seed + slot.length()) % cand.size()], "runes": []}
			var socks = int(Run.C.gear[it.id].get("sockets", 0))
			for k in min(socks, int(ref[2])):
				it.runes.append(Run.C.runes.keys()[(seed + k * 3 + slot.length()) % Run.C.runes.size()])
			h.gear[slot] = it
		m.roster.append(h)
		m.party.append(h.id)
	m.carried = []
	var rl: Array = Run.C.relics.keys()
	for k in int(ref[3]):
		m.carried.append(rl[(seed + k * 5) % rl.size()])

# ------------------------------------------------------------------ one descent
func descent(party: Array, door: int, seed: int) -> Dictionary:
	make_company(party, door, seed)
	var world: String = Data.STORY.order[door - 1]
	var err = Abbey.start_descent("boss", world, seed)
	stats = {"door": door, "world": world, "party": party, "seed": seed, "fights": [], "camps": [], "upgrades": 0, "picked": [],
		"conj": {}, "virtues": [], "afflictions": 0, "err": err}
	if err != "":
		return stats
	var steps = 0
	while Run.r.outcome == "" and steps < 40:
		steps += 1
		take_rewards()
		var nx = Run.next_nodes()
		if nx.is_empty():
			break
		var n = Run.move_to(choose_node(nx))
		match n.type:
			"combat", "elite", "boss":
				fight(n, Run.room_for(n), n.type)
			"waypoint":
				guardian(n)
				if Run.r.outcome == "":
					for h in Run.living():
						h.hp = Run.max_hp(h)
			"event":
				var e = Run.event_for(n)
				for o in e.options:
					if Run.option_ok(o) and not _bad_option(o):
						var res = Run.apply_option(o)
						if res.get("fight", false):
							fight(n, Run.room_for(n), "combat")
						break
			"camp":
				camp()
			"shrine":
				Run.shrine("prayer")
			"merchant":
				merchant()
			"hidden":
				Run.hidden_cache()
	take_rewards()
	stats.outcome = Run.r.outcome if Run.r.outcome != "" else "stalled"
	stats.layer = Run.current_layer()
	stats.alive = Run.living().size()
	stats.heroes = []
	for h in Run.r.heroes:
		stats.heroes.append({"key": h.key, "level": h.level, "hp": h.hp, "max": Run.max_hp(h), "stress": h.stress, "dead": h.dead,
			"deck": h.deck.size(), "aff": h.deck.filter(func(c): return String(c).begins_with("aff_") or c == "dread").size()})
	return stats

func _bad_option(o: Dictionary) -> bool:
	for x in o.outcome:
		if x.t == "fight":
			return true
	return false

## Route policy: rest when hurt, take elites only when healthy, otherwise prefer fights (for cards and gold).
func choose_node(nx: Array) -> String:
	var hpf = 0.0
	for h in Run.living():
		hpf += float(h.hp) / Run.max_hp(h)
	hpf /= max(1, Run.living().size())
	var best = ""
	var best_v = -999.0
	for id in nx:
		var t: String = Run.node(id).type
		var v: float = {"combat": 3.0, "elite": 4.0 if hpf > 0.75 else -3.0, "camp": 6.0 if hpf < 0.6 else 1.0, "event": 2.0,
			"merchant": 2.0, "shrine": 1.5, "hidden": 2.5, "waypoint": 5.0, "boss": 9.0}.get(t, 0.0)
		v += float(hash(id + str(Run.r.seed)) % 100) / 1000.0
		if v > best_v:
			best_v = v
			best = id
	return best

# ------------------------------------------------------------------ fights
func fight(n: Dictionary, idx: int, kind: String, hp_mult = 1.0) -> void:
	var enc: Dictionary = Data.ENCOUNTERS[idx]
	n.tier = "guardian" if kind == "guardian" else enc.tier
	var setup = Run.combat_setup()
	setup.foe_hp = float(setup.foe_hp) * hp_mult * foe_mult
	setup.foe_might = int(setup.foe_might) + foe_might
	var s = Combat.new_state_run(setup, enc.enemies, int(Run.r.seed) + int(Run.r.step) * 31)
	s.sim = false
	var rounds = 0
	var actions = 0
	var hp0 = 0
	var n0: int = s.heroes.size()
	for h in s.heroes:
		hp0 += h.hp
	while s.outcome == "" and rounds < 40:
		Combat.start_round(s)
		rounds += 1
		var plan = SimPlanner.plan_round(s, level_name)
		actions += plan.size()
		for a in plan:
			if a.source == "hand":
				stats.picked.append(a.card)
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
		for ev in s.events:
			if ev.t == "reaction" and ev.text not in ["Phase 2", "Phase 3", "Phase 4", "Broken", "Executed", "Doom", "Shatter"]:
				stats.conj[ev.text] = int(stats.conj.get(ev.text, 0)) + 1
			elif ev.t == "status" and String(ev.get("text", "")).begins_with("VIRTUE"):
				stats.virtues.append(ev.text)
		s.events = []
		s.log = []
	if s.outcome == "":
		s.outcome = "defeat"
	var hp1 = 0
	var dd = 0
	for h in s.heroes:
		hp1 += h.hp
		if h.get("was_dd", false):
			dd += 1
	stats.fights.append({"tier": n.tier, "name": enc.name, "rounds": rounds, "actions": actions, "won": s.outcome == "victory",
		"hp_lost": hp0 - hp1, "dd": dd, "deaths": n0 - s.heroes.size()})
	Run.after_combat(s, n)

## The midpoint guardian (Rules v2, rule 20): an elite fight of this world at 1.25x HP. Legendaries do not exist yet,
## so the reward is the elite's own.
func guardian(n: Dictionary) -> void:
	var cand = []
	for i in Data.ENCOUNTERS.size():
		var e: Dictionary = Data.ENCOUNTERS[i]
		if e.tier == "elite" and e.get("world", "") == Run.r.world:
			cand.append(i)
	if cand.is_empty():
		return
	fight(n, cand[int(Run.r.seed) % cand.size()], "guardian", 1.25)

# ------------------------------------------------------------------ between fights
func take_rewards() -> void:
	while not Run.r.pending.is_empty():
		var p: Dictionary = Run.r.pending.pop_front()
		var h: Dictionary = Run.r.heroes[p.get("hero", 0)]
		match p.kind:
			"card":
				var ch = Run.card_choices(h)
				var pick = draft(h, ch)
				if pick != "":
					h.deck.append(pick)
			"subclass":
				h.subclass = Data.HEROES[h.key].subclasses.keys()[int(Run.r.seed) % 3]
			"talent":
				h.talents.append(TALENTS[(int(p.get("level", 2)) + int(Run.r.seed)) % TALENTS.size()])
			"relic":
				var rl = Run.relic_drop()
				if rl != "":
					Run.r.relics.append(rl)
			"gear":
				var it = Run.gear_drop()
				Run.r.stash.append(it)
				var g: Dictionary = Run.C.gear[it.id]
				for x in Run.living():
					var slot: String = "trinket1" if g.slot == "trinket" else g.slot
					if (g.cls == null or g.cls == x.key) and (x.gear[slot].is_empty() or _rank(Run.C.gear[x.gear[slot].id].rarity) < _rank(g.rarity)):
						Run.equip(x, it)
						break

func _rank(r: String) -> int:
	return {"C": 0, "U": 1, "R": 2}.get(r, 0)

## A simple drafter: the rarest offer, preferring cheap cards, and skipping commons once the deck is past 16 cards.
func draft(h: Dictionary, offers: Array) -> String:
	var best = ""
	var best_v = 0.0
	for id in offers:
		var c: Dictionary = Data.CARDS[id]
		var v: float = {"C": 1.0, "U": 2.0, "R": 3.0, "X": 2.6}.get(c.rarity, 1.0) - 0.3 * max(0, int(c.cost) - 1)
		if c.rarity == "C" and h.deck.size() > 16:
			v -= 2.0
		if v > best_v:
			best_v = v
			best = id
	return best

## Camp (Rules v2, rule 19): rest if the company is hurt, otherwise every hero upgrades its best card.
func camp() -> void:
	var hpf = 0.0
	for h in Run.living():
		hpf += float(h.hp) / Run.max_hp(h)
	hpf /= max(1, Run.living().size())
	if hpf < 0.7:
		Run.field_camp("rest")
		stats.camps.append("rest")
	else:
		for h in Run.living():
			upgrade_one(h)
		stats.camps.append("upgrade")

func upgrade_one(h: Dictionary) -> bool:
	var best = -1
	var best_v = -1.0
	for i in h.deck.size():
		var id: String = h.deck[i]
		if id.ends_with("+") or not Data.CARDS.has(id + "+"):
			continue
		var v: float = {"C": 1.0, "U": 2.0, "R": 3.0, "X": 2.5, "S": 0.5}.get(Data.CARDS[id].rarity, 0.5)
		if v > best_v:
			best_v = v
			best = i
	if best < 0:
		return false
	h.deck[best] = h.deck[best] + "+"
	stats.upgrades += 1
	return true

## Merchant: buy upgrades at 60 gold while the purse allows (one per hero).
func merchant() -> void:
	for h in Run.living():
		if Run.r.gold >= 60 and upgrade_one(h):
			Run.r.gold -= 60
