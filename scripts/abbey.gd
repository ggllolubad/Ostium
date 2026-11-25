class_name Abbey
extends RefCounted
## Everything that lives between descents: the persistent roster (Guesthouse), the armoury and runes (Smithy),
## stock and the belt (Almonry), provisions (Cellarium), relics and Teeth (Sacristy), the Codex (Scriptorium),
## unlocks and vows (Chapter House), and the company chosen at the cross. State lives in Run.meta and is saved with it.
## Wounds persist and no one dies for good: a hero who falls on a descent comes home Shattered and must be mended
## at the Infirmarium (or rest for a couple of descents) before going out again.

static var A: Dictionary = Data._load_json("res://data/abbey.json")

# ================================================================== state
## Fills in any abbey state an older save lacks. Called after every meta load.
static func ensure() -> void:
	var m: Dictionary = Run.meta
	if not m.has("roster"):
		m.roster = []
		m.next_id = 1
		for pair in A.roster_start:
			m.roster.append(make_hero(pair[0], pair[1]))
		m.ostia = int(m.get("ostia", 0)) + int(A.start_ostia)
	for k in ["armoury", "runes", "vows", "party", "recruits"]:
		if not m.has(k):
			m[k] = []
	for k in ["relics", "stock"]:
		if not m.has(k):
			m[k] = {}
	if not m.has("provisions"):
		m.provisions = {"food": 0, "light": 0, "medicine": 0, "tools": 0, "belt": []}
	if not m.has("belt_max"):
		m.belt_max = int(A.almonry.belt.base)
	if not m.has("carried"):
		m.carried = []
	if not m.has("codex"):
		m.codex = {"foes": {}, "cards": [], "studied": []}
	if m.party.is_empty():
		for h in m.roster.slice(0, 3):
			m.party.append(h.id)
	if m.recruits.is_empty() or m.stock.is_empty():
		refresh_stocks()

static func save() -> void:
	Run.meta_save()

static func rnd() -> float:
	return randf()

static func pick(arr: Array):
	return arr[randi() % arr.size()]

# ================================================================== heroes
static func make_hero(key: String, reason: String, level := 1) -> Dictionary:
	var d: Dictionary = Data.HEROES[key]
	# a first name nobody in the book or at the gate already answers to
	var taken := []
	for o in Run.meta.get("roster", []):
		taken.append(String(o.name).split(" ")[0])
	for c in Run.meta.get("recruits", []):
		taken.append(String(c.hero.name).split(" ")[0])
	var pool: Array = A.names[key].filter(func(n): return not taken.has(n))
	if pool.is_empty():
		pool = A.names[key]
	var nm: String = pick(pool)
	if rnd() < 0.5:
		nm += " " + pick(A.epithets)
	var id := int(Run.meta.get("next_id", 1))
	Run.meta.next_id = id + 1
	var h := {"id": id, "key": key, "name": nm, "reason": reason, "level": 1, "xp": 0, "hp": d.hp, "base_hp": d.hp, "stress": 0, "resolve": 0,
		"deck": d.deck.duplicate(), "gear": {"weapon": {}, "armor": {}, "trinket1": {}, "trinket2": {}}, "subclass": "", "talents": [],
		"injuries": [], "dead": false, "shattered": 0, "descents": 0, "levels_seen": 1}
	if level > 1:
		h.xp = int(Run.C.xp_levels[level - 1])
		h.level = level
	return h

static func hero(id: int) -> Dictionary:
	for h in Run.meta.roster:
		if int(h.id) == id:
			return h
	return {}

static func beds() -> int:
	return int(A.beds) + (2 if Run.meta.unlocked.has("beds") else 0)

static func can_descend(h: Dictionary) -> bool:
	return int(h.get("shattered", 0)) <= 0

static func reason_rule(h: Dictionary) -> String:
	return A.reasons.get(h.get("reason", ""), {}).get("rule", "")

## Stat bonuses that come from who the hero is (their Reason) rather than what they carry.
static func reason_stats(h: Dictionary) -> Dictionary:
	return A.reasons.get(h.get("reason", ""), {}).get("stats", {})

static func xp_mult(h: Dictionary) -> float:
	return float(A.reasons.get(h.get("reason", ""), {}).get("xp", 1.0))

# ------------------------------------------------------------------ Guesthouse
static func recruit(i: int) -> String:
	var c: Dictionary = Run.meta.recruits[i]
	if Run.meta.roster.size() >= beds():
		return "Every bed is taken."
	if not Run.class_unlocked(c.hero.key):
		return "The Chapter has not sanctioned that calling."
	if not _pay(int(c.price)):
		return "Not enough ostia."
	Run.meta.roster.append(c.hero)
	Run.meta.recruits.remove_at(i)
	save()
	return "The Hosteller writes %s into the book. Reason: %s." % [c.hero.name, c.hero.reason]

static func dismiss(id: int) -> String:
	var h := hero(id)
	if h.is_empty():
		return ""
	if Run.meta.roster.size() <= int(A.party_min):
		return "The abbey cannot spare another."
	for slot in Run.SLOTS:
		if not h.gear[slot].is_empty():
			Run.meta.armoury.append(h.gear[slot])
	Run.meta.roster.erase(h)
	Run.meta.party.erase(id)
	save()
	return "%s leaves by the gate. Their gear stays." % h.name

static func toggle_party(id: int) -> String:
	var p: Array = Run.meta.party
	if p.has(id):
		p.erase(id)
		save()
		return ""
	var h := hero(id)
	if h.is_empty():
		return ""
	if not can_descend(h):
		return "%s is Shattered. Sister Wenna must mend them first." % h.name
	if p.size() >= int(A.party_max):
		return "Four is the most the door will take."
	p.append(id)
	save()
	return ""

static func party_heroes() -> Array:
	var o := []
	for id in Run.meta.party:
		var h := hero(int(id))
		if not h.is_empty() and can_descend(h):
			o.append(h)
	return o

# ------------------------------------------------------------------ Infirmarium
static func treat(h: Dictionary, inj: String) -> String:
	if not h.injuries.has(inj):
		return ""
	if not _pay(int(A.infirmarium.treat.price)):
		return "Not enough ostia."
	h.injuries.erase(inj)
	save()
	return "Wenna sets %s's %s." % [h.name, Run.C.injuries[inj].name.to_lower()]

static func ease(h: Dictionary) -> String:
	if int(h.stress) <= 0:
		return "%s is as calm as anyone here." % h.name
	if not _pay(int(A.infirmarium.ease.price)):
		return "Not enough ostia."
	h.stress = max(0, int(h.stress) - int(A.infirmarium.ease.n))
	save()
	return "Vinegar and smoke. %s breathes easier." % h.name

static func lift_dread(h: Dictionary) -> String:
	if not h.deck.has("dread"):
		return "%s carries no Dread." % h.name
	if not _pay(int(A.infirmarium.dread.price)):
		return "Not enough ostia."
	h.deck.erase("dread")
	save()
	return "Wenna draws the Dread out of %s." % h.name

static func mend(h: Dictionary) -> String:
	if can_descend(h):
		return ""
	if not _pay(int(A.infirmarium.mend.price)):
		return "Not enough ostia."
	h.shattered = 0
	save()
	return "%s walks out of the Infirmarium on their own feet." % h.name

# ------------------------------------------------------------------ Smithy
static func slot_kind(it: Dictionary) -> String:
	return Run.C.gear[it.id].slot

static func sockets(it: Dictionary) -> int:
	return int(Run.C.gear[it.id].sockets) + int(it.get("sockets_extra", 0))

static func temper_stats(it: Dictionary) -> Dictionary:
	var t := int(it.get("temper", 0))
	var o := {}
	if t <= 0:
		return o
	var per: Dictionary = A.smithy.temper.stats[slot_kind(it)]
	for k in per:
		o[k] = int(per[k]) * t
	return o

static func item_name(it: Dictionary) -> String:
	var t := int(it.get("temper", 0))
	var n: String = Run.C.gear[it.id].name
	return (A.smithy.temper.names[t] + " " + n) if t > 0 else n

static func temper_price(it: Dictionary) -> int:
	var p := int(A.smithy.temper.price[min(int(it.get("temper", 0)), 1)])
	return int(round(p * (0.67 if Run.meta.unlocked.has("bellows") else 1.0)))

static func temper(it: Dictionary) -> String:
	if int(it.get("temper", 0)) >= int(A.smithy.temper.max):
		return "Hild can do no more with it."
	var cost := temper_price(it)
	var paid := temper_paid(it)
	if not _pay(cost):
		return "Not enough ostia."
	it.temper_paid = paid + cost
	it.temper = int(it.get("temper", 0)) + 1
	save()
	return "Hild folds the steel. %s." % item_name(it)

static func cut_socket(it: Dictionary) -> String:
	if sockets(it) >= int(A.smithy.socket.max):
		return "No room on it for another letter."
	if not _pay(int(A.smithy.socket.price)):
		return "Not enough ostia."
	it.sockets_extra = int(it.get("sockets_extra", 0)) + 1
	save()
	return "A new socket is cut into %s." % item_name(it)

static func set_rune(it: Dictionary, rune: String) -> String:
	if not it.has("runes"):
		it.runes = []
	if it.runes.size() >= sockets(it):
		return "No free socket."
	if not Run.meta.runes.has(rune):
		return ""
	if not _pay(int(A.smithy.set.price)):
		return "Not enough ostia."
	Run.meta.runes.erase(rune)
	it.runes.append(rune)
	save()
	return "%s is cut into %s." % [Run.C.runes[rune].name, item_name(it)]

static func strip_rune(it: Dictionary, i: int) -> String:
	var rn: String = it.runes[i]
	it.runes.remove_at(i)
	Run.meta.runes.append(rn)
	save()
	return "%s is prised out and kept." % Run.C.runes[rn].name

static func buy_rune(i: int) -> String:
	var rn: String = Run.meta.stock.runes[i]
	if not _pay(int(A.smithy.rune_price)):
		return "Not enough ostia."
	Run.meta.stock.runes.remove_at(i)
	Run.meta.runes.append(rn)
	save()
	return "%s is yours to set." % Run.C.runes[rn].name

## Puts an armoury item on a hero. Anything already in that slot goes back to the armoury.
static func equip(h: Dictionary, it: Dictionary, slot := "") -> String:
	var g: Dictionary = Run.C.gear[it.id]
	if g.cls != null and g.cls != h.key:
		return "Only the %s can use that." % Data.HEROES[g.cls].name
	if slot == "":
		slot = g.slot
		if slot == "trinket":
			slot = "trinket1" if h.gear.trinket1.is_empty() else ("trinket2" if h.gear.trinket2.is_empty() else "trinket1")
	var old: Dictionary = h.gear[slot]
	h.gear[slot] = it
	Run.meta.armoury.erase(it)
	if not old.is_empty():
		Run.meta.armoury.append(old)
	save()
	return "%s takes up %s." % [h.name, item_name(it)]

static func unequip(h: Dictionary, slot: String) -> String:
	var it: Dictionary = h.gear[slot]
	if it.is_empty():
		return ""
	Run.meta.armoury.append(it)
	h.gear[slot] = {}
	save()
	return "%s is hung back in the armoury." % item_name(it)

# ------------------------------------------------------------------ Almonry
static func gear_price(it: Dictionary) -> int:
	return int(A.almonry.gear_price[Run.C.gear[it.id].rarity])

static func buy_gear(i: int) -> String:
	var g: Dictionary = Run.meta.stock.gear[i]
	if not _pay(int(g.price)):
		return "Not enough ostia."
	Run.meta.stock.gear.remove_at(i)
	Run.meta.armoury.append(g.item)
	save()
	return "Fenn enters %s in the ledger. It waits in the armoury." % item_name(g.item)

## Ostia paid to temper an item. Items tempered before this was recorded count at the list price.
static func temper_paid(it: Dictionary) -> int:
	if it.has("temper_paid"):
		return int(it.temper_paid)
	return _list_temper(int(it.get("temper", 0)))

static func _list_temper(levels: int) -> int:
	var t := 0
	for i in levels:
		t += int(A.smithy.temper.price[min(i, A.smithy.temper.price.size() - 1)])
	return t

## What Fenn pays: the sell rate on the item's price and on what its tempering cost. Gear bought with gold on a
## descent never fetches more ostia than that gold was worth, so the road's merchants cannot be farmed.
static func sell_value(it: Dictionary) -> int:
	var rate := float(A.almonry.sell_rate)
	var base := int(round(gear_price(it) * rate))
	if it.has("paid_gold"):
		base = min(base, int(it.paid_gold) / int(A.gold_rate))
	return base + int(round(temper_paid(it) * rate))

## Sells an armoury item. Runes set in it go back to the pouch first.
static func sell(it: Dictionary) -> String:
	var v := sell_value(it)
	var kept := []
	for rn in it.get("runes", []):
		Run.meta.runes.append(rn)
		kept.append(Run.C.runes[rn].name)
	it.runes = []
	Run.meta.armoury.erase(it)
	Run.meta.ostia = int(Run.meta.ostia) + v
	save()
	var t := "Fenn takes %s for %d ostia, and smiles." % [item_name(it), v]
	if not kept.is_empty():
		t += " %s back in your pouch." % (", ".join(kept) + (" goes" if kept.size() == 1 else " go"))
	return t

static func buy_flask(i: int) -> String:
	var prov: Dictionary = Run.meta.provisions
	if prov.belt.size() >= int(Run.meta.belt_max):
		return "The belt is full."
	var fl: String = Run.meta.stock.flasks[i]
	if not _pay(int(A.almonry.flask_price)):
		return "Not enough ostia."
	Run.meta.stock.flasks.remove_at(i)
	prov.belt.append(fl)
	save()
	return "%s goes on the belt." % Data.CARDS[fl].name

static func belt_price() -> int:
	var step := int(Run.meta.belt_max) - int(A.almonry.belt.base)
	return int(A.almonry.belt.price[min(step, 1)])

static func widen_belt() -> String:
	if int(Run.meta.belt_max) >= int(A.almonry.belt.max):
		return "No belt has more loops than that."
	if not _pay(belt_price()):
		return "Not enough ostia."
	Run.meta.belt_max = int(Run.meta.belt_max) + 1
	save()
	return "A wider belt. %d flasks now." % int(Run.meta.belt_max)

# ------------------------------------------------------------------ Cellarium
static func provision(k: String, n: int) -> String:
	var c: Dictionary = A.cellarium[k]
	var have := int(Run.meta.provisions[k])
	if n > 0:
		if have >= int(c.cap):
			return "Godric will not let more %s leave the cellar." % c.name.to_lower()
		if not _pay(int(c.price)):
			return "Not enough ostia."
		Run.meta.provisions[k] = have + 1
	else:
		if have <= 0:
			return ""
		Run.meta.provisions[k] = have - 1
		Run.meta.ostia = int(Run.meta.ostia) + int(c.price)
	save()
	return ""

# ------------------------------------------------------------------ Sacristy
static func teeth() -> Array:
	return Run.meta.get("cleared", [])

static func carry_cap() -> int:
	return int(A.sacristy.carry_base) + teeth().size() / int(A.sacristy.carry_per_teeth) + (1 if Run.meta.unlocked.has("altar") else 0)

static func identify(id: String) -> String:
	if Run.meta.relics.get(id, "") != "veiled":
		return ""
	if not _pay(int(A.sacristy.identify)):
		return "Not enough ostia."
	Run.meta.relics[id] = "known"
	save()
	return "Ide turns it in her hands. \"%s.\"" % Run.C.relics[id].name

static func toggle_carry(id: String) -> String:
	var c: Array = Run.meta.carried
	if c.has(id):
		c.erase(id)
	else:
		if Run.meta.relics.get(id, "") != "known":
			return "Ide will not let an unknown thing through the door."
		if c.size() >= carry_cap():
			return "The company can carry %d relic%s." % [carry_cap(), "" if carry_cap() == 1 else "s"]
		c.append(id)
	save()
	return ""

static func buy_relic(i: int) -> String:
	var rl: Dictionary = Run.meta.stock.relics[i]
	if not _pay(int(rl.price)):
		return "Not enough ostia."
	Run.meta.stock.relics.remove_at(i)
	Run.meta.relics[rl.id] = "known"
	save()
	return "%s is laid in the case." % Run.C.relics[rl.id].name

# ------------------------------------------------------------------ Scriptorium
static func codex_foe(key: String) -> Array:
	return Run.meta.codex.foes.get(key, [0, 0])

## How much of a foe the Codex shows: 0 unknown, 1 seen (name, world), 2 slain (lore), 3 known (resistances).
static func codex_depth(key: String) -> int:
	var f := codex_foe(key)
	if Run.meta.codex.studied.has(key):
		return 3
	if int(f[1]) >= int(A.scriptorium.reveal_kills):
		return 3
	if int(f[1]) > 0:
		return 2
	return 1 if int(f[0]) > 0 else 0

static func study(key: String) -> String:
	if codex_depth(key) >= 3 or codex_depth(key) == 0:
		return ""
	if not _pay(int(A.scriptorium.study)):
		return "Not enough ostia."
	Run.meta.codex.studied.append(key)
	save()
	return "Lucan writes out everything the order knows of the %s." % Data.ENEMIES[key].name

static func record_fight(s: Dictionary) -> void:
	if Run.meta.is_empty():
		return
	var foes: Dictionary = Run.meta.get("codex", {}).get("foes", {})
	for e in s.get("enemies", []):
		var f: Array = foes.get(e.key, [0, 0])
		f[0] = int(f[0]) + 1
		if e.get("dead", false) or int(e.get("hp", 1)) <= 0:
			f[1] = int(f[1]) + 1
		foes[e.key] = f
	if Run.meta.has("codex"):
		Run.meta.codex.foes = foes

# ------------------------------------------------------------------ Chapter House
static func all_unlocks() -> Dictionary:
	var o: Dictionary = Run.C.unlocks.duplicate()
	o.merge(A.hub_unlocks)
	return o

static func buy_unlock(id: String) -> String:
	var u: Dictionary = all_unlocks()[id]
	if Run.meta.unlocked.has(id):
		return ""
	if not _pay(int(u.cost)):
		return "Not enough ostia."
	Run.meta.unlocked.append(id)
	save()
	return "Aldric signs it into the charter: %s." % u.name

static func toggle_vow(id: String) -> String:
	var v: Array = Run.meta.vows
	if v.has(id):
		v.erase(id)
	else:
		var idx := -1
		for i in Run.C.ascension.size():
			if Run.C.ascension[i].id == id:
				idx = i
		if idx >= Run.asc_max():
			return "The Prior will not take that vow from an untried company."
		v.append(id)
	save()
	return ""

# ================================================================== stocks
## Fresh faces, goods, runes and relics. Called once after every descent.
static func refresh_stocks() -> void:
	var m: Dictionary = Run.meta
	var classes: Array = Data.CLASS_ORDER.filter(func(k): return Run.class_unlocked(k))
	m.recruits = []
	for i in int(A.recruits.count):
		var vet: bool = rnd() < float(A.recruits.veteran_chance)
		var lvl := 2 if (vet or m.unlocked.has("veterans")) else 1
		var h := make_hero(pick(classes), pick(A.reasons.keys()), lvl)
		m.recruits.append({"hero": h, "price": int(A.recruits.price[1 if lvl > 1 else 0])})
	var gear := []
	var keys: Array = Run.C.gear.keys()
	var want_cls := []
	for h in m.roster:
		want_cls.append(h.key)
	var guard := 0
	while gear.size() < int(A.almonry.gear_stock) and guard < 200:
		guard += 1
		var id: String = pick(keys)
		var g: Dictionary = Run.C.gear[id]
		if g.cls != null and not want_cls.has(g.cls):
			continue
		if g.rarity == "R" and rnd() < 0.6:
			continue
		if gear.any(func(x): return x.item.id == id):
			continue
		var it := {"id": id, "runes": []}
		gear.append({"item": it, "price": gear_price(it)})
	var flasks := []
	for i in int(A.almonry.flask_stock):
		flasks.append(pick(Run.C.consumables))
	var runes := []
	for i in int(A.smithy.rune_stock):
		runes.append(pick(Run.C.runes.keys()))
	var relics := []
	var free: Array = Run.C.relics.keys().filter(func(k): return not m.relics.has(k))
	free.shuffle()
	for id in free.slice(0, int(A.sacristy.relic_stock)):
		relics.append({"id": id, "price": int(A.sacristy.relic_price[0]) + randi() % (int(A.sacristy.relic_price[1]) - int(A.sacristy.relic_price[0]) + 1)})
	m.stock = {"gear": gear, "flasks": flasks, "runes": runes, "relics": relics}

# ================================================================== the descent
static func start_descent(objective: String, world: String, seed: int) -> String:
	var party := party_heroes()
	if party.size() < int(A.party_min):
		return "The door takes no fewer than %d." % int(A.party_min)
	Run.new_run_roster(party, objective, Run.meta.vows.filter(func(v): return _vow_index(v) < Run.asc_max()), seed, world)
	return ""

static func _vow_index(id: String) -> int:
	for i in Run.C.ascension.size():
		if Run.C.ascension[i].id == id:
			return i
	return 99

## The company comes home: wounds, levels, decks and gear go back into the roster, finds go into the abbey,
## heroes who stayed behind rest. Returns ostia earned on top of the descent's own reward, plus lines for the end screen.
static func return_home() -> Dictionary:
	var m: Dictionary = Run.meta
	var r: Dictionary = Run.r
	var out := {"ostia": 0, "lines": []}
	var went := []
	for rh in r.get("heroes", []):
		var h := hero(int(rh.get("id", -1)))
		if h.is_empty():
			continue
		went.append(int(h.id))
		for k in ["level", "xp", "deck", "gear", "subclass", "talents", "injuries", "levels_seen", "base_hp"]:
			if rh.has(k):
				h[k] = rh[k]
		h.stress = min(200, int(rh.stress))
		h.descents = int(h.get("descents", 0)) + 1
		if rh.dead:
			h.shattered = int(A.shattered_runs)
			out.lines.append("%s comes home Shattered." % h.name)
		else:
			var debt := int(A.reasons.get(h.reason, {}).get("ostia", 0))
			if debt > 0:
				out.ostia += debt
				out.lines.append("%s is paid their debt: %d ostia." % [h.name, debt])
		for c in h.deck:
			if not m.codex.cards.has(c):
				m.codex.cards.append(c)
	for h in m.roster:
		if not went.has(int(h.id)):
			h.stress = max(0, int(h.stress) - int(A.rest_stress))
			if int(h.get("shattered", 0)) > 0:
				h.shattered = int(h.shattered) - 1
				if h.shattered == 0:
					out.lines.append("%s is on their feet again." % h.name)
	for it in r.get("stash", []):
		m.armoury.append(it)
	for rn in r.get("runes", []):
		m.runes.append(rn)
	for id in r.get("relics", []):
		if not m.relics.has(id):
			m.relics[id] = "veiled"
			out.lines.append("A veiled relic is brought to Sister Ide.")
	m.carried = m.carried.filter(func(id): return m.relics.has(id))
	var g := int(r.get("gold", 0)) / int(A.gold_rate)
	if g > 0:
		out.ostia += g
		out.lines.append("Fenn melts %d gold into %d ostia." % [int(r.gold), g])
	m.provisions = {"food": 0, "light": 0, "medicine": 0, "tools": 0, "belt": []}
	refresh_stocks()
	return out

# ================================================================== helpers
static func _pay(n: int) -> bool:
	if int(Run.meta.ostia) < n:
		return false
	Run.meta.ostia = int(Run.meta.ostia) - n
	return true

