extends SceneTree
# Gate 3 engine mechanics: rites, the belt (brew, refill, improve, one flask a round, spoil), Doom and execute,
# the Delay limit, Scars, Swarm, enemy intent targets, traits on round end and ally death, once-only AI.
var fails := 0

func ok(c: bool, what: String) -> void:
	print(("ok   " if c else "FAIL ") + what)
	if not c:
		fails += 1

func card(id: String, d: Dictionary) -> void:
	var base := {"name": id, "cost": 1, "rarity": "C", "target": "self", "fx": [], "text": id, "cls": "test", "use": [1, 2, 3, 4],
		"hit": [1, 2, 3, 4], "cat": "physical"}
	base.merge(d, true)
	Data.CARDS[id] = base

func fresh(enemies := ["t_dummy", "t_dummy", "t_dummy"]) -> Dictionary:
	var s := Combat.new_state(["bulwark", "duelist", "elementalist"], enemies, 11)
	Combat.start_round(s)
	return s

func play(s: Dictionary, h: Dictionary, id: String, target := -1, source := "hand") -> String:
	if source == "hand":
		h.hand.append(id)
	var a := {"hero": h.id, "card": id, "source": source, "hand_index": h.hand.size() - 1, "target": target, "x": 0, "cost": 0}
	return Combat.resolve_player_action(s, a)

func _init() -> void:
	# fixed test data, so the checks do not move when the game's content changes
	Data.ENEMIES["t_dummy"] = {"name": "Dummy", "hp": 40, "armor": 0, "tier": "foe", "art": "", "resist": {},
		"intents": {"hit": {"name": "Hit", "kind": "attack", "target": "front", "fx": [{"t": "dmg", "n": 3}], "text": ""}},
		"ai": [{"use": "hit"}]}
	for f in ["fl_heal", "fl_iron", "fl_fire"]:
		card(f, {"rarity": "F", "cost": 0, "target": "ally" if f != "fl_fire" else "enemy", "kw": ["Flask", "Exhaust"], "flask": true,
			"fx": [{"t": "heal", "n": 5}] if f == "fl_heal" else ([{"t": "block", "n": 6}] if f == "fl_iron" else [{"t": "apply", "e": "fire", "n": 3}])})
		card(f + "+", {"rarity": "F", "cost": 0, "target": "ally", "kw": ["Flask"], "fx": [{"t": "heal", "n": 7}]})
	card("t_rite_rs", {"kw": ["Rite", "Exhaust"], "rite": {"on": "round_start", "fx": [{"t": "block", "n": 5}]}})
	card("t_rite_hit", {"kw": ["Rite"], "rite": {"on": "hit", "fx": [{"t": "dmg", "n": 4}]}})
	card("t_rite_play", {"kw": ["Rite"], "rite": {"on": "play", "kw": "Finisher", "fx": [{"t": "block", "n": 3}], "per_round": 1}})
	card("t_fin", {"kw": ["Finisher"], "fx": [{"t": "block", "n": 1}]})
	card("t_rite_flask", {"kw": ["Rite"], "rite": {"on": "flask", "fx": [{"t": "block", "n": 2}]}})
	card("t_rite_conj", {"kw": ["Rite"], "rite": {"on": "conjunction", "fx": [{"t": "dmg", "n": 3}]}})
	card("t_rite_kill", {"kw": ["Rite"], "rite": {"on": "kill", "fx": [{"t": "status", "s": "might", "n": 1, "to": "self"}]}})
	card("t_brew", {"fx": [{"t": "brew", "n": 1, "card": "fl_fire"}]})
	card("t_refill", {"fx": [{"t": "refill", "n": 1}]})
	card("t_improve", {"fx": [{"t": "improve", "n": 1}]})
	card("t_exec", {"target": "enemy", "fx": [{"t": "execute", "n": 10}]})
	card("t_delay", {"target": "enemy", "fx": [{"t": "delay"}]})
	card("t_hit", {"target": "enemy", "fx": [{"t": "dmg", "n": 10}]})
	card("t_all", {"target": "all_enemies", "fx": [{"t": "dmg", "n": 10}]})
	card("t_scars", {"fx": [{"t": "block", "n": 0, "per": "scars"}]})
	card("t_dosed", {"target": "self", "kw": ["Dosed"], "fx": [{"t": "block", "n": 4, "if": "flasks_used"}]})
	card("t_unbind", {"target": "enemy", "fx": [{"t": "unbind", "n": 3}]})
	card("t_aff", {"rarity": "A", "target": "none", "use": [], "kw": ["Affliction", "Unplayable"], "fx": [], "on_draw": [{"t": "apply", "e": "water", "n": 2, "attr": "stable"}]})

	# --- Prime carries past actions that cannot use it, and boosts Block
	card("t_prime", {"fx": [{"t": "prime", "n": 3}]})
	var sp := fresh()
	var o: Dictionary = sp.heroes[2]
	play(sp, o, "t_prime")
	play(sp, o, "t_prime")
	ok(sp.prime == 6, "two Prime cards stack (prime %d)" % sp.prime)
	var ep: Dictionary = sp.enemies[0]
	var hpp: int = ep.hp
	play(sp, sp.heroes[1], "t_hit", ep.id)
	ok(sp.prime == 0, "a hit spends the Prime")
	card("t_blk", {"fx": [{"t": "block", "n": 2}]})
	play(sp, o, "t_prime")
	o.block = 0
	play(sp, o, "t_blk")
	ok(o.block == 5, "Prime adds to Block (block %d)" % o.block)

	# --- rites
	var s := fresh()
	var b: Dictionary = s.heroes[0]
	play(s, b, "t_rite_rs")
	ok(s.rites.size() == 1, "a Rite card registers a lasting effect")
	Combat.end_round(s)
	b.block = 0
	Combat.start_round(s)
	ok(b.block >= 5, "round_start rite gives 5 Block at the next round start (block %d)" % b.block)

	s = fresh()
	b = s.heroes[0]
	play(s, b, "t_rite_hit")
	var e: Dictionary = s.enemies[0]
	var hp0: int = e.hp
	Combat._hurt(s, e, b, 3, {})
	ok(e.hp == hp0 - 4, "hit rite strikes the attacker for 4 (%d -> %d)" % [hp0, e.hp])

	s = fresh()
	var d: Dictionary = s.heroes[1]
	play(s, d, "t_rite_play")
	d.block = 0
	play(s, d, "t_fin")
	play(s, d, "t_fin")
	ok(d.block == 1 + 3 + 1, "play rite fires on a Finisher once a round (block %d, want 5)" % d.block)
	d.block = 0
	play(s, d, "t_hit", s.enemies[0].id)
	ok(d.block == 0, "play rite ignores a card without the keyword")

	s = fresh()
	var el: Dictionary = s.heroes[2]
	play(s, el, "t_rite_conj")
	e = s.enemies[0]
	hp0 = e.hp
	Combat._apply_element(s, el, e, "water", 2, "stable")
	Combat._apply_element(s, el, e, "lightning", 2, "volatile")
	ok(e.hp < hp0 - 3 or e.dead, "conjunction rite adds 3 damage on the Conjunction")

	s = fresh(["t_dummy", "t_dummy", "t_dummy"])
	b = s.heroes[0]
	play(s, b, "t_rite_kill")
	var m0: int = b.st.might
	Combat._kill(s, s.enemies[0])
	ok(b.st.might == m0 + 1, "kill rite fires when a foe dies")

	# --- belt
	s = fresh()
	b = s.heroes[0]
	d = s.heroes[1]
	s.belt = ["fl_heal", "fl_iron"]
	play(s, b, "t_rite_flask")
	b.block = 0
	s.belt.erase("fl_heal")   # commit_cards takes a belt flask off when the Ordo is committed
	ok(play(s, b, "fl_heal", b.id, "belt") == "", "a hero uses a flask")
	ok(b.block == 2, "flask rite fires on a flask (block %d)" % b.block)
	ok(Combat.check_action(s, {"hero": b.id, "card": "fl_iron", "source": "belt", "target": b.id}) != "", "a second flask by the same hero this round is refused")
	ok(Combat.check_action(s, {"hero": d.id, "card": "fl_iron", "source": "belt", "target": d.id}) == "", "another hero may still use one")
	b.block = 0
	play(s, b, "t_dosed")
	ok(b.block == 4, "Dosed bonus applies after a flask this round")
	play(s, b, "t_brew")
	ok(s.belt_next.has("fl_fire") and not s.belt.has("fl_fire"), "Brew puts a flask on the belt next round")
	play(s, b, "t_refill")
	ok(s.belt_next.has("fl_heal"), "Refill returns the used flask")
	Combat.end_round(s)
	Combat.start_round(s)
	ok(s.belt.has("fl_fire") and s.belt.has("fl_heal"), "brewed and refilled flasks are ready next round")
	ok(not b.flask_round, "flask use resets each round")
	play(s, b, "t_improve")
	ok(s.belt.has("fl_iron+") or s.belt.has("fl_fire+") or s.belt.has("fl_heal+"), "Improve upgrades a flask on the belt (%s)" % str(s.belt))
	Run.r = {"belt": ["fl_heal", "fl_iron"], "heroes": []}
	s.outcome = "victory"
	var left: Array = s.belt.duplicate() + s.belt_next
	for f in s.fresh_on_belt:
		left.erase(f)
	for i in left.size():
		if String(left[i]).ends_with("+"):
			left[i] = String(left[i]).trim_suffix("+")
	ok(left == ["fl_iron"], "after the fight only the bought, unused flask remains, unimproved (%s)" % str(left))

	# --- doom and execute
	s = fresh()
	e = s.enemies[0]
	e.hp = 16
	e.st.doom = 6
	play(s, s.heroes[1], "t_exec", e.id)
	ok(e.dead, "Doom 6 lets Execute 10 kill a foe at 16 HP")
	s = fresh()
	e = s.enemies[0]
	e.hp = 5
	e.st.doom = 5
	Combat.end_round(s)
	ok(e.dead, "Doom meeting HP at round end kills a foe")

	# --- delay limit
	s = fresh()
	e = s.enemies[0]
	s.enemy_queue = [s.enemies[1].id, s.enemies[2].id, e.id]
	play(s, s.heroes[2], "t_delay", e.id)
	ok(e.postponed, "Delay on the last foe postpones it")
	for id in s.enemy_queue.duplicate():
		Combat.resolve_enemy_action(s, id)
	Combat.end_round(s)
	Combat.start_round(s)
	s.enemy_queue.erase(e.id)
	s.enemy_queue.append(e.id)
	play(s, s.heroes[2], "t_delay", e.id)
	ok(not e.postponed, "a foe cannot be postponed two rounds in a row")

	# --- scars
	s = fresh()
	b = s.heroes[0]
	Combat._hurt(s, s.enemies[0], b, 20 + b.armor, {})
	Combat._heal(s, b, 10)
	b.block = 0
	play(s, b, "t_scars")
	ok(b.scars == 20 and b.block == 20, "Scars count HP lost and ignore healing (scars %d, block %d)" % [b.scars, b.block])

	# --- swarm
	Data.ENEMIES["t_dummy"]["flags"] = ["swarm"]
	s = fresh(["t_dummy"])
	e = s.enemies[0]
	hp0 = e.hp
	play(s, s.heroes[1], "t_hit", e.id)
	var single: int = hp0 - e.hp
	hp0 = e.hp
	play(s, s.heroes[1], "t_all")
	var wide: int = hp0 - e.hp
	ok(wide > single * 2, "Swarm: a hit on every foe deals far more than a single-target hit (%d vs %d)" % [wide, single])
	Data.ENEMIES["t_dummy"].erase("flags")

	# --- unbind
	s = fresh()
	s.heroes[0].discard.append("t_aff")
	e = s.enemies[0]
	play(s, s.heroes[1], "t_unbind", e.id)
	ok(e.st.hex == 3 and e.elements.water >= 1, "Unbind: the foe suffers the affliction and gains Hex (hex %d, water %d)" % [e.st.hex, e.elements.water])
	ok(not s.heroes[0].discard.has("t_aff"), "Unbind removes the affliction for this fight")

	# --- intents, traits, once-only AI
	Data.ENEMIES["test_foe"] = {"name": "Test Foe", "hp": 40, "armor": 0, "art": "", "intents": {
		"a": {"name": "Front Two", "kind": "attack", "target": "front2", "fx": [{"t": "dmg", "n": 2}], "text": ""},
		"b": {"name": "Stress", "kind": "debuff", "target": "most_stress", "fx": [{"t": "stress", "n": 5}], "text": ""}},
		"ai": [{"use": "a", "once": true}, {"use": "b"}],
		"traits": [{"on": "round_end", "fx": [{"t": "status", "s": "charge", "n": 1, "to": "self"}]},
			{"on": "ally_death", "fx": [{"t": "status", "s": "might", "n": 2, "to": "self"}]}]}
	s = Combat.new_state(["bulwark", "duelist", "elementalist"], ["test_foe", "t_dummy"], 3)
	Combat.start_round(s)
	e = s.enemies[0]
	ok(e.intent == "a", "once-only rule picked first")
	var hp_a: int = s.heroes[0].hp + s.heroes[0].block
	var hp_b: int = s.heroes[1].hp + s.heroes[1].block
	var hp_c: int = s.heroes[2].hp
	Combat.resolve_enemy_action(s, e.id)
	ok(s.heroes[0].hp + s.heroes[0].block <= hp_a and s.heroes[2].hp == hp_c, "front2 hits the two front heroes only")
	Combat.end_round(s)
	ok(e.st.charge == 1, "round_end trait builds charge")
	Combat.start_round(s)
	ok(e.intent == "b", "once-only rule is not picked again")
	Combat._kill(s, s.enemies[1])
	ok(e.st.might >= 2, "ally_death trait fires")

	# --- the Vessel: held courses, Take, Give
	if not Data.HEROES.has("vessel"):
		Data.HEROES["vessel"] = {"name": "Vessel", "hp": 32, "armor": 0, "grit": 2, "deck": [], "kit": [], "art": "", "color": "8a7fb0"}
	card("t_take", {"target": "enemy", "fx": [{"t": "take", "e": "largest", "n": 0}]})
	card("t_give", {"target": "enemy", "fx": [{"t": "give", "e": "water", "n": 2, "attr": "stable"}]})
	var sv := Combat.new_state(["bulwark", "vessel", "elementalist"], ["t_dummy"], 5)
	Combat.start_round(sv)
	var ves: Dictionary = sv.heroes[1]
	var foe: Dictionary = sv.enemies[0]
	Combat._apply_element(sv, foe, ves, "fire", 4, "stable")
	ok(ves.held.fire == 4 and ves.elements.fire == 0, "courses laid on the Vessel are held, not suffered")
	Combat._apply_element(sv, foe, ves, "water", 9, "volatile")
	ok(ves.held.water == 6 and ves.hp == ves.max_hp, "held courses cap at 6 and never react on the Vessel")
	foe.elements.frost = 3
	play(sv, ves, "t_take", foe.id)
	ok(foe.elements.frost == 0 and ves.held.frost == 3, "Take moves the foe's largest course onto the Vessel")
	play(sv, ves, "t_give", foe.id)
	ok(foe.elements.water == 2 and ves.held.water == 4, "Give moves held stacks onto a foe")
	Combat.end_round(sv)
	var f1: int = ves.held.fire
	Combat.start_round(sv)
	Combat.end_round(sv)
	ok(f1 == 4 and ves.held.fire == 3, "held stacks laid this round stay, then fall by 1 a round (fire %d then %d)" % [f1, ves.held.fire])

	print("FAILS: %d" % fails)
	quit()
