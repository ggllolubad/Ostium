"""Applies Combat Rules v2 (2026-11-25 draft) to scripts/combat.gd. Run once on the baseline file."""
p = 'scripts/combat.gd'
s = open(p).read()

def rep(a, b):
    global s
    assert s.count(a) == 1, (a[:70], s.count(a))
    s = s.replace(a, b)

rep("const TRIGGER_LIMIT := 5\n", """const TRIGGER_LIMIT := 5
## Combat Rules v2 switches (2026-11-25). The balance sim flips these to compare variants; the game uses the defaults.
static var RULES := {"vigour_per": 2, "vigour_flat": 0, "draw": 4, "hand_cap": 10, "hex": true, "az_v2": true, "drown_cap": 20,
	"virtues": true, "afflictions": true, "traits": true}
const VIRTUES := ["steadfast", "stalwart", "vigilant", "rallying", "unbowed"]
""")
rep("""	for h in s.heroes:
		h.draw = h.deck.duplicate()
		_shuffle(s, h.draw)
	return s
""", """	for h in s.heroes:
		h.draw = h.deck.duplicate()
		_shuffle(s, h.draw)
	s.vigour_base = int(RULES.vigour_per) * s.heroes.size() + int(RULES.vigour_flat)   # fixed for the fight (Rules v2, rule 1)
	return s
""")
rep("""	var alive := 0
	for h in s.heroes:
		alive += 1
		h.kit_used = {}
		h.played = 0
	s.energy = 2 * alive + s.bonus_energy""", """	for h in s.heroes:
		h.kit_used = {}
		h.played = 0
	s.energy = int(s.get("vigour_base", 2 * s.heroes.size())) + s.bonus_energy""")
rep("""	for h in s.heroes:
		_draw(s, h, 4 + h.bonus_draw)
		h.bonus_draw = 0""", """	for h in s.heroes:
		_draw(s, h, int(RULES.draw) + h.bonus_draw + (1 if h.get("virtue", "") == "vigilant" else 0))
		h.bonus_draw = 0
		if h.get("virtue", "") == "stalwart":
			_gain_block(s, h, 6)""")
rep("""	choose_intents(s)
	_log(s, "— Round %d —" % s.round)""", """	choose_intents(s)
	if RULES.traits:
		for e in s.enemies.duplicate():
			_trait(s, e, "round_start", [e])
	_log(s, "— Round %d —" % s.round)""")
rep("""		if c == "festering":""", """		var cd: Dictionary = Data.CARDS.get(c, {})
		if cd.has("on_draw"):
			h.discard.append(c)
			_exec(s, h, {"name": cd.name, "cat": "physical", "fx": cd.on_draw}, [h], {"x": 0, "half": false, "prime": 0}, false)
			_log(s, "%s draws %s." % [h.name, cd.name])
			continue
		if c == "festering":""")
rep("""	var d: int = base + src.st.might - src.elements.frost
	d = max(0, d)""", """	var d: int = base + src.st.might - src.elements.frost
	if RULES.hex:
		d -= int(src.st.get("hex", 0) / 2)   # Hex: 1 less damage per 2 stacks (Rules v2, rule 9)
	d = max(0, d)""")
rep("""	_lose_hp(s, t, d)
	if t.dead and src != null and src.get("side", "") == "hero":
		add_resolve(src, 12)
	return d""", """	_lose_hp(s, t, d)
	if t.dead and src != null and src.get("side", "") == "hero":
		add_resolve(src, 12)
	if RULES.traits and d > 0 and not t.dead and t.side == "enemy" and src != null and src.get("side", "") == "hero" and _trigger(s, "trait_hit_%d" % t.id):
		_trait(s, t, "hit", [src])
	return d""")
rep("""static func _kill(s: Dictionary, u: Dictionary) -> void:
	u.dead = true""", """static func _kill(s: Dictionary, u: Dictionary) -> void:
	if u.dead:
		return
	u.dead = true
	if RULES.traits and u.side == "enemy":
		var proxy: Dictionary = u.duplicate(false)
		proxy.dead = false
		_trait(s, proxy, "death", [proxy])""")
rep("""		"frost+void":
			if t.side == "enemy":
				if t.hp <= p * 4:
					_kill(s, t)
				else:
					_hurt(s, src, t, p, {})
			else:
				t.hp = 0
				t.deaths_door = true
				_ev(s, {"t": "dd", "unit": t.id})""", """		"frost+void":
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
				if t.hp <= p * 2 and _next_threshold_hp(t) > 0:
					t.hp = _next_threshold_hp(t)
					_check_phase(s, t)
				elif t.hp <= p * 2:
					_kill(s, t)
				else:
					_hurt(s, src, t, p, {})
			else:
				_hurt(s, src, t, 2 * p, {"pierce": true})""")
rep("""			else:
				t.stress = min(200, t.stress + p * 5)
				_ev(s, {"t": "stress", "unit": t.id, "n": p * 5})""", """			else:
				var sn: int = min(p * 3, int(RULES.drown_cap))   # Rules v2, rule 7
				t.stress = min(200, t.stress + sn)
				_ev(s, {"t": "stress", "unit": t.id, "n": sn})""")
rep("""		for cid in h.hand:
			if card(cid).get("kw", []).has("Retain"):
				keep.append(cid)""", """		for cid in h.hand:
			if card(cid).get("kw", []).has("Retain") and keep.size() < int(RULES.hand_cap):
				keep.append(cid)""")
rep("""	if h.resolve >= 50:
		h.stress = 50
		h.st.might += 2
		_heal(s, h, 6)
		_ev(s, {"t": "status", "unit": h.id, "text": "VIRTUE: Steadfast"})
		_log(s, "%s's resolve is tested... Steadfast! (+2 Might, heal 6)" % h.name)
	else:
		h.stress = 60
		h.discard.append("dread")""", """	if h.resolve >= 50:
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
		h.discard.append(aff)""")
rep("""		"stress_take":""", """		"summon":
			_summon(s, actor, fx)
		"discard_random":
			if t.side == "hero" and not t.hand.is_empty():
				var i: int = _rand(s) % t.hand.size()
				t.discard.append(t.hand[i])
				t.hand.remove_at(i)
		"lose_armor":
			t.armor = max(0, t.armor - max(1, n))
		"stress_take":""")
rep("""# ------------------------------------------------------------------ end of round""", """# ------------------------------------------------------------------ traits and summons (Rules v2, rules 14 and 15)
## An enemy trait: {"on": "round_start" | "hit" | "death", "fx": [...], "name", "text"}. Targets: the trait's fx "to",
## else `base` (the enemy itself at round start and on death, the hero that hit it on "hit").
static func _trait(s: Dictionary, e: Dictionary, on: String, base: Array) -> void:
	for tr in Data.ENEMIES[e.key].get("traits", []):
		if tr.get("on", "") != on:
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
	s.enemies.append(u)
	_ev(s, {"t": "summon", "unit": u.id, "by": actor.id, "text": u.name})
	_log(s, "%s calls %s." % [actor.name, u.name])

# ------------------------------------------------------------------ end of round""")
rep("""	s.setup = setup
	s.belt = setup.get("belt", []).duplicate()""", """	s.setup = setup
	s.world = setup.get("world", "")
	s.belt = setup.get("belt", []).duplicate()""")
open(p, 'w').write(s)
print('rules v2 applied')
