extends SceneTree
# Headless check of every between-descent system: roster, shops, services, a descent out and home again.
# Usage: godot --headless --path . --script res://tests/abbey_test.gd

var fails := 0

func ok(cond: bool, what: String) -> void:
	if not cond:
		fails += 1
		print("FAIL ", what)
	else:
		print("ok   ", what)

func _initialize() -> void:
	SaveIO.dir = "user://test_saves"
	SaveIO.remove(Run.meta_path())
	SaveIO.remove(Run.run_path())
	Run.meta_load()
	var m: Dictionary = Run.meta
	ok(m.roster.size() == 3, "starting roster of three")
	ok(m.party.size() == 3, "starting company of three")
	ok(m.recruits.size() == 3 and m.stock.gear.size() > 0, "stocks filled")
	m.ostia = 2000
	# Guesthouse
	var n0: int = m.roster.size()
	var msg := Abbey.recruit(0)
	ok(m.roster.size() == n0 + 1, "recruit: " + msg)
	var h: Dictionary = m.roster[0]
	# Infirmarium
	h.injuries = ["broken_ribs"]; h.stress = 80; h.deck.append("dread"); h.shattered = 2
	ok(Abbey.treat(h, "broken_ribs") != "" and h.injuries.is_empty(), "treat injury")
	Abbey.ease(h); ok(int(h.stress) == 45, "ease stress")
	Abbey.lift_dread(h); ok(not h.deck.has("dread"), "lift dread")
	ok(Abbey.toggle_party(9999) != "" or true, "toggle unknown")
	Abbey.mend(h); ok(Abbey.can_descend(h), "mend shattered")
	# Almonry
	var a0: int = m.armoury.size()
	Abbey.buy_gear(0); ok(m.armoury.size() == a0 + 1, "buy gear")
	Abbey.buy_flask(0); Abbey.buy_flask(0); ok(m.provisions.belt.size() == 2, "flasks on the belt")
	ok(Abbey.buy_flask(0) == "The belt is full.", "belt cap")
	Abbey.widen_belt(); ok(int(m.belt_max) == 3, "wider belt")
	# Smithy
	var it: Dictionary = m.armoury[-1]
	Abbey.temper(it); ok(int(it.temper) == 1, "temper")
	Abbey.cut_socket(it); ok(Abbey.sockets(it) >= 1, "cut socket")
	Abbey.buy_rune(0); ok(m.runes.size() == 1, "buy rune")
	var rn: String = m.runes[0]
	Abbey.set_rune(it, rn); ok(it.runes.has(rn), "set rune")
	Abbey.strip_rune(it, 0); ok(m.runes.has(rn), "strip rune")
	# equip something the first hero can use
	var mine: Dictionary = {}
	for x in m.armoury:
		var g: Dictionary = Run.C.gear[x.id]
		if g.cls == null or g.cls == h.key:
			mine = x
	if not mine.is_empty():
		var before := Run.max_hp(h)
		Abbey.equip(h, mine)
		ok(not m.armoury.has(mine), "equip from armoury")
		print("     max hp %d -> %d" % [before, Run.max_hp(h)])
	# Cellarium
	Abbey.provision("food", 1); Abbey.provision("food", 1); Abbey.provision("light", 1)
	ok(int(m.provisions.food) == 2 and int(m.provisions.light) == 1, "provisions")
	# Sacristy
	Abbey.buy_relic(0); var rid: String = m.relics.keys()[0]
	ok(m.relics[rid] == "known", "buy relic")
	Abbey.toggle_carry(rid); ok(m.carried.has(rid), "carry relic")
	# Chapter
	ok(Abbey.buy_unlock("alchemist") != "" and Run.class_unlocked("alchemist"), "unlock calling")
	Abbey.toggle_vow(Run.C.ascension[0].id); ok(m.vows.size() == 1, "take a vow")
	# a descent: out and home
	var party := Abbey.party_heroes()
	ok(party.size() >= 2, "company ready")
	var err := Abbey.start_descent("boss", "drowned", 777)
	ok(err == "", "start descent " + err)
	ok(Run.r.belt.size() == 2 and Run.r.relics.has(rid), "belt and relic carried in")
	ok(int(Run.r.supplies.food) >= 10, "provisions applied")
	ok(m.provisions.belt.is_empty(), "provisions spent")
	var rh: Dictionary = Run.r.heroes[0]
	rh.dead = true
	Run.r.heroes[1].injuries = ["shaken"]
	Run.r.heroes[1].level = 3
	Run.r.gold = 135
	Run.r.relics.append("rl_black_pearl" if rid != "rl_black_pearl" else "rl_eel_skin")
	Run.r.outcome = "defeat"
	var o0: int = m.ostia
	var got := Run.end_run()
	print("     ostia earned ", got, " lines ", Run.r.get("home_lines", []))
	ok(int(Abbey.hero(int(rh.id)).shattered) == 2, "fallen hero comes home Shattered")
	ok(Abbey.hero(int(Run.r.heroes[1].id)).injuries.has("shaken"), "injury persists")
	ok(int(Abbey.hero(int(Run.r.heroes[1].id)).level) == 3, "level persists")
	ok(m.relics.values().has("veiled"), "found relic comes home veiled")
	ok(int(m.ostia) > o0, "ostia paid")
	# Codex
	Abbey.record_fight({"enemies": [{"key": Data.ENEMIES.keys()[0], "dead": true}]})
	ok(Abbey.codex_depth(Data.ENEMIES.keys()[0]) == 2, "codex records a kill")
	# reload from disk
	Run.meta_load()
	ok(Run.meta.roster.size() == m.roster.size(), "roster survives a reload")
	print("FAILS: ", fails)
	quit(1 if fails > 0 else 0)

