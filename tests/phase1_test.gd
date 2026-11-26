extends SceneTree
# Release fixes, phase 1: crash-safe saves, save versions, a fight that resumes exactly (and cannot be save-scummed),
# selling (runes back, tempering paid for, no gold-to-ostia farming), the resolve cap, and the doom readout.
# Usage: godot --path . --rendering-driver opengl3 --script res://tests/phase1_test.gd   (art may be placeholders)

var fails := 0

func ok(c: bool, what: String) -> void:
	print(("ok   " if c else "FAIL ") + what)
	if not c:
		fails += 1

func wait(n := 3) -> void:
	for i in n:
		await process_frame

func _initialize() -> void:
	SaveIO.dir = "user://test_saves"
	_saves()
	_versions()
	_resume_logic()
	_selling()
	_resolve_cap()
	await _resume_ui()
	print("FAILS: %d" % fails)
	quit(1 if fails > 0 else 0)

func _fresh() -> void:
	SaveIO.remove(Run.meta_path())
	SaveIO.remove(Run.run_path())
	Run.r = {}
	Run.meta_load()

# ------------------------------------------------------------------ crash-safe files
func _saves() -> void:
	var p := SaveIO.path("io_probe.json")
	SaveIO.remove(p)
	ok(SaveIO.write_json(p, {"a": 1}), "write a save")
	ok(SaveIO.write_json(p, {"a": 2}), "overwrite it")
	ok(int(SaveIO.read_json(p).get("a", 0)) == 2, "read back the newest")
	ok(not FileAccess.file_exists(p + ".tmp") and not FileAccess.file_exists(p + ".bak"), "no leftovers after a clean write")
	# a crash between setting the old file aside and moving the new one in: only the .bak is left
	DirAccess.rename_absolute(ProjectSettings.globalize_path(p), ProjectSettings.globalize_path(p + ".bak"))
	ok(int(SaveIO.read_json(p).get("a", 0)) == 2, "recover from .bak when the save is missing")
	ok(SaveIO.exists(p), "a .bak alone still counts as a save")
	# a torn main file next to a good .bak
	var f := FileAccess.open(p, FileAccess.WRITE)
	f.store_string("{\"a\": 3, \"tru")
	f.close()
	ok(int(SaveIO.read_json(p).get("a", 0)) == 2, "a torn save falls back to .bak")
	SaveIO.remove(p)
	ok(not SaveIO.exists(p), "remove clears the save and its leftovers")
	ok(SaveIO.read_json(p).is_empty(), "no save reads as empty")
	# pack keeps int keys and types
	var v := {1: [2, 3.5, "x"], "k": {7: true}}
	ok(SaveIO.unpack(SaveIO.pack(v)) == v, "pack round-trips int keys and types")
	ok(SaveIO.unpack("not base64 at all") == null, "a broken blob unpacks to nothing")

# ------------------------------------------------------------------ versions and migration
func _versions() -> void:
	_fresh()
	Run.meta_save()
	ok(int(SaveIO.read_json(Run.meta_path()).get("version", 0)) == Run.SAVE_VERSION, "meta save carries its version")
	# a run saved before the Gate 3 card set (versions 0 and 1) holds cards that no longer exist: refused, and not offered
	SaveIO.write_json(Run.run_path(), {"seed": 5, "step": 0, "heroes": [], "at": "", "fight": {"idx": 0, "blob": "x"}})
	ok(not Run.load_run() and not Run.has_save(), "a version-0 run is refused and not offered")
	SaveIO.write_json(Run.run_path(), {"seed": 5, "step": 0, "heroes": [], "at": "", "version": 1})
	ok(not Run.load_run() and not Run.has_save(), "a version-1 run is refused and not offered")
	SaveIO.write_json(Run.run_path(), {"seed": 5, "step": 0, "heroes": [], "at": "", "version": Run.SAVE_VERSION})
	ok(Run.load_run() and Run.has_save(), "a current-version run loads")
	# saved heroes keep only the cards that still exist; a stripped hero gets the starting deck back
	var m := Run._migrate_meta({"version": 1, "roster": [{"id": 1, "key": "bulwark", "deck": ["gone_card", "dread"]}]})
	var dk: Array = m.roster[0].deck
	ok(dk.all(func(c): return Data.CARDS.has(c)) and dk.size() >= Data.HEROES["bulwark"].deck.size(), "an old hero's deck is rebuilt from cards that exist")
	SaveIO.write_json(Run.run_path(), {"seed": 5, "heroes": [], "version": Run.SAVE_VERSION + 1})
	ok(not Run.load_run(), "a run from a newer game is refused, not misread")
	SaveIO.remove(Run.run_path())
	# the playtest switch unlocks every calling while on, and nothing while off
	_fresh()
	UiStyle.settings["playtest_all"] = false
	ok(not Run.class_unlocked("vessel") and Run.class_unlocked("bulwark"), "playtest off: locked callings stay locked")
	UiStyle.settings["playtest_all"] = true
	ok(Data.CLASS_ORDER.all(func(k): return Run.class_unlocked(k)), "playtest on: every calling is unlocked")
	ok(Data.STORY.order.all(func(w): return Run.door_open(w)), "debug on: every door is open")
	UiStyle.settings["playtest_all"] = false
	ok(not Run.door_open(Data.STORY.order[Data.STORY.order.size() - 1]) or Run.meta.cleared.size() == Data.STORY.order.size(), "debug off: the last door is sealed again")
	UiStyle.settings["playtest_all"] = true
	UiStyle.settings.erase("playtest_all")
	# settings go through the same path
	UiStyle.settings["probe"] = 7
	UiStyle.save_settings()
	UiStyle.settings = {}
	UiStyle.load_settings()
	ok(int(UiStyle.settings.get("probe", 0)) == 7, "settings save and load")
	UiStyle.settings.erase("probe")
	UiStyle.save_settings()

# ------------------------------------------------------------------ a fight saved and resumed (logic only)
func _greedy_plan(s: Dictionary) -> Array:
	var plan := []
	var energy: int = s.energy
	for h in s.heroes:
		for i in h.hand.size():
			var cid: String = h.hand[i]
			var c: Dictionary = Data.CARDS[cid]
			var cost: int = c.cost if c.cost >= 0 else energy
			if cost > energy or c.target == "none" or (cost == 0 and c.cost < 0):
				continue
			var a := {"hero": h.id, "card": cid, "source": "hand", "hand_index": i, "target": -1, "x": cost, "cost": cost}
			if c.target in ["enemy", "ally", "ally_other", "adjacent_ally"]:
				var st: Dictionary = Combat.simulate(s, plan, false).state
				var pool: Array = s.enemies if c.target == "enemy" else s.heroes
				for u in pool:
					var a2 := a.duplicate()
					a2.target = u.id
					if Combat.check_action(st, a2) == "":
						a = a2
						break
			var sim := Combat.simulate(s, plan + [a], false)
			if sim.reasons[-1] == "":
				plan.append(a)
				energy -= cost
	return plan

func _play_round(s: Dictionary, plan: Array) -> void:
	Combat.commit_cards(s, plan)
	for a in Combat.order_plan(s, plan):
		Combat.resolve_player_action(s, a)
		if s.outcome != "":
			return
	Combat.resolve_echoes(s)
	for id in s.enemy_queue.duplicate():
		if s.outcome != "":
			return
		Combat.resolve_enemy_action(s, id)
	if s.outcome == "":
		Combat.end_round(s)

func _finish(s: Dictionary) -> String:
	var guard := 0
	while s.outcome == "" and guard < 40:
		guard += 1
		_play_round(s, _greedy_plan(s))
		if s.outcome == "":
			Combat.start_round(s)
	return JSON.stringify([s.outcome, s.round, s.heroes, s.enemies])

func _resume_logic() -> void:
	_fresh()
	ok(Abbey.start_descent("boss", "drowned", 4242) == "", "descent for the fight tests")
	var setup := Run.combat_setup()
	var enc: Array = Data.ENCOUNTERS[2].enemies
	var a := Combat.new_state_run(setup, enc, 99)
	Combat.start_round(a)
	_play_round(a, _greedy_plan(a))
	Combat.start_round(a)
	# save at the top of round 2, through the real run save file
	Run.r.at = "probe"
	Run.save_fight(2, a, [])
	ok(Run.load_run(), "run with a fight reloads")
	var f := Run.saved_fight()
	ok(not f.is_empty() and int(f.idx) == 2, "the saved fight is found")
	var b: Dictionary = f.s
	ok(JSON.stringify(a) == JSON.stringify(b), "resumed round 2 matches: hands, intents, rng")
	ok(_finish(a) == _finish(b), "the resumed fight plays out exactly as the original")
	# the committed-round save: the Ordo is kept with the state from before it was played
	var c := Combat.new_state_run(setup, enc, 7)
	Combat.start_round(c)
	var plan := _greedy_plan(c)
	Run.save_fight(2, c.duplicate(true), plan.duplicate(true))
	_play_round(c, plan)
	Run.load_run()
	var g := Run.saved_fight()
	ok(g.plan.size() == plan.size() and g.plan.size() > 0, "a committed Ordo is saved with the round")
	var d: Dictionary = g.s
	_play_round(d, g.plan)
	ok(JSON.stringify(c) == JSON.stringify(d), "replaying the committed Ordo reaches the same state: no re-planning a round")
	Run.r.at = "elsewhere"
	ok(Run.saved_fight().is_empty(), "a saved fight only resumes in its own room")
	Run.clear_fight()
	Run.save()
	Run.load_run()
	ok(not Run.r.has("fight"), "a finished fight is gone from the save")
	Run.end_run()

# ------------------------------------------------------------------ selling
func _selling() -> void:
	_fresh()
	var m: Dictionary = Run.meta
	m.ostia = 1000
	var it := {"id": "a_hauberk", "runes": []}
	m.armoury.append(it)
	var plain := Abbey.sell_value(it)
	ok(plain == int(round(Abbey.gear_price(it) * float(Abbey.A.almonry.sell_rate))), "plain sale at the sell rate (%d)" % plain)
	Abbey.temper(it)
	Abbey.temper(it)
	var paid := int(it.get("temper_paid", 0))
	ok(paid == int(Abbey.A.smithy.temper.price[0]) + int(Abbey.A.smithy.temper.price[1]), "tempering spend is recorded (%d)" % paid)
	ok(Abbey.sell_value(it) == plain + int(round(paid * float(Abbey.A.almonry.sell_rate))), "a tempered item sells for its tempering too (%d)" % Abbey.sell_value(it))
	Abbey.cut_socket(it)
	m.runes.append("r_iron")
	Abbey.set_rune(it, "r_iron")
	ok(it.runes.has("r_iron") and not m.runes.has("r_iron"), "rune set")
	var o0 := int(m.ostia)
	var v := Abbey.sell_value(it)
	var msg := Abbey.sell(it)
	ok(m.runes.has("r_iron"), "selling returns the rune to the pouch: " + msg)
	ok(int(m.ostia) == o0 + v and not m.armoury.has(it), "paid and gone from the armoury")
	ok(v < paid + Abbey.gear_price(it), "temper then sell never profits")
	# an item tempered before spend was recorded is valued at list price
	var old := {"id": "w_rusted_mace", "runes": [], "temper": 1}
	ok(Abbey.temper_paid(old) == int(Abbey.A.smithy.temper.price[0]), "older tempered items count at list price")
	# gear bought with gold on the road cannot be turned into more ostia than the gold
	var road := {"id": "t_kings_ring", "runes": [], "paid_gold": 140}
	ok(Abbey.sell_value(road) <= 140 / int(Abbey.A.gold_rate), "road-bought gear sells for no more than its gold (%d)" % Abbey.sell_value(road))
	var found := {"id": "t_kings_ring", "runes": []}
	ok(Abbey.sell_value(found) > Abbey.sell_value(road), "found gear still sells at the full rate")
	# every in-run merchant item, at every rarity and the price vow, stays at or below its gold
	for rar in ["C", "U", "R"]:
		for mult in [1.0, 1.25]:
			var price := int(round({"C": 50, "U": 85, "R": 140}[rar] * mult))
			var id: String = Run.C.gear.keys().filter(func(k): return Run.C.gear[k].rarity == rar)[0]
			var x := {"id": id, "runes": [], "paid_gold": price}
			if Abbey.sell_value(x) * int(Abbey.A.gold_rate) > price:
				ok(false, "merchant %s at %d gold sells for %d ostia" % [rar, price, Abbey.sell_value(x)])
	ok(true, "no merchant gear sells above its gold")

# ------------------------------------------------------------------ resolve
func _resolve_cap() -> void:
	var h := {"resolve": 20}
	for i in 50:
		Combat.add_resolve(h, 12)
	ok(int(h.resolve) == 20 + Combat.RESOLVE_PER_FIGHT, "resolve earned in one fight is capped (%d)" % h.resolve)
	var k := {"resolve": 95}
	Combat.add_resolve(k, 12)
	ok(int(k.resolve) == 100, "resolve never passes 100")

# ------------------------------------------------------------------ the real screens: leave mid-fight, continue
func _resume_ui() -> void:
	_fresh()
	root.size = Vector2i(1600, 1000)
	var m = load("res://scenes/main.tscn").instantiate()
	root.add_child(m)
	await wait(5)
	m.open_church()
	await wait()
	m.run_ui.show_prepare()
	await wait()
	ok(Abbey.start_descent("boss", "drowned", 31337) == "", "a descent with a fixed seed")
	m.run_ui.show_map()
	await wait()
	# walk to the first fight on the map
	var n: Dictionary = {}
	var guard := 0
	while guard < Run.LAYERS and n.is_empty():
		guard += 1
		var nx := Run.next_nodes()
		if nx.is_empty():
			break
		var pick: String = nx[0]
		for id in nx:
			if Run.node(id).type in ["combat", "elite", "boss"]:
				pick = id
		var got := Run.move_to(pick)
		if got.type in ["combat", "elite", "boss"]:
			n = got
	ok(not n.is_empty(), "reached a fight on the map")
	m.run_ui._enter(n)
	await wait(5)
	ok(m.run_mode and not m.s.is_empty(), "the fight is on")
	ok(m.round_l.text.contains("doom"), "the fight header shows the real doom: " + m.round_l.text)
	ok(not Run.saved_fight().is_empty(), "the fight is in the save from its first round")
	# play one round through the real commit
	for a in _greedy_plan(m.s):
		m.plan.append(a)
	var committed: Array = m.plan.duplicate(true)
	m._commit()
	ok(m.leave_btn.disabled, "Leave is locked while the round plays out")
	var mid := Run.saved_fight()
	ok(mid.plan.size() == committed.size() and committed.size() > 0, "the committed Ordo is in the save before it plays")
	var t0 := Time.get_ticks_msec()
	while m.resolving and Time.get_ticks_msec() - t0 < 60000:
		await process_frame
	if m.s.outcome != "":
		ok(true, "fight ended in one round; resume of round 2 not exercised")
		m.queue_free()
		return
	ok(not m.leave_btn.disabled, "Leave unlocked after the round")
	var snap := JSON.stringify(m.s)
	ok(Run.saved_fight().plan.is_empty(), "between rounds the save holds no Ordo")
	# plan something, then leave: the uncommitted plan is not kept, the round is
	for a in _greedy_plan(m.s):
		m.plan.append(a)
	m._leave()
	await wait(3)
	ok(m.hub.visible, "left for the abbey")
	# a cold start: wipe the in-memory run and continue from disk
	Run.r = {}
	m.continue_run()
	await wait(5)
	ok(m.run_mode and JSON.stringify(m.s) == snap, "Continue resumes the same round, hands and foes")
	ok(m.plan.is_empty(), "the round resumes with an empty Ordo")
	# commit, then 'crash' at once: the replay must equal what the commit produces
	for a in _greedy_plan(m.s):
		m.plan.append(a)
	m._commit()
	var pending := Run.saved_fight()
	t0 = Time.get_ticks_msec()
	while m.resolving and Time.get_ticks_msec() - t0 < 60000:
		await process_frame
	var after_real := JSON.stringify([m.s.heroes, m.s.enemies, m.s.round])
	var replay: Dictionary = pending.s.duplicate(true)
	_play_round(replay, pending.plan.duplicate(true))
	if replay.outcome == "":
		Combat.start_round(replay)
	ok(JSON.stringify([replay.heroes, replay.enemies, replay.round]) == after_real, "a round committed before a crash replays to the same result")
	# and through the real Continue: put the mid-round save back, cold start, let the committed round replay itself
	if m.s.outcome == "":
		var after_full := JSON.stringify(m.s.heroes) + JSON.stringify(m.s.enemies)
		Run.save_fight(int(pending.idx), pending.s, pending.plan)
		m._show_menu()
		await wait(3)
		Run.r = {}
		m.continue_run()
		await wait(3)
		ok(m.resolving, "Continue replays a committed round at once")
		t0 = Time.get_ticks_msec()
		while m.resolving and Time.get_ticks_msec() - t0 < 60000:
			await process_frame
		var got := JSON.stringify(m.s.heroes) + JSON.stringify(m.s.enemies)
		ok(got == after_full, "the replayed round ends exactly where it did before the crash")
	m.queue_free()
	await wait(2)

