extends SceneTree
# Drives the real UI through whole fights (gauntlet) to catch runtime errors in playback.
func _initialize() -> void:
	Engine.time_scale = 10.0
	root.size = Vector2i(1600, 1000)
	var m = load("res://scenes/main.tscn").instantiate()
	root.add_child(m)
	await process_frame
	m.gauntlet = true
	m.carry = {}
	m.gauntlet_pos = 0
	m._start_encounter(Data.GAUNTLET[0])
	var fights := 0
	var rounds := 0
	while fights < 7 and rounds < 200:
		await process_frame
		if m.overlay != null:
			print("fight %d: %s in %d rounds" % [m.encounter_idx, m.s.outcome, m.s.round])
			if m.s.outcome != "victory" or m.gauntlet_pos >= Data.GAUNTLET.size() - 1:
				break
			m._gauntlet_next()
			fights += 1
			continue
		rounds += 1
		# greedy: each hero, each card, first legal target; also try one kit skill
		for h in m.s.heroes.duplicate():
			m.set_active(h.id)
			for i in h.hand.size():
				var before: int = m.plan.size()
				m.on_card_clicked(h.id, i)
				if not m.targeting.is_empty():
					m.on_unit_clicked(m.valid_targets[(i + rounds) % m.valid_targets.size()])
				if m.plan.size() > before and m.preview.reasons.size() > 0 and m.preview.reasons[m.preview.ordered.find(m.plan[-1])] != "":
					m.remove_slot(m.plan.size() - 1)
			if m.energy_left() > 0:
				m.on_kit_clicked(h.id, h.kit[rounds % h.kit.size()])
				if not m.targeting.is_empty():
					m.on_unit_clicked(m.valid_targets[0])
		if m.plan.size() > 1:
			m.move_slot(0, m.plan.size() - 1)
		print("round ", rounds, " plan ", m.plan.size(), " enc ", m.encounter_idx)
		m._commit()
		var guard := 0
		while m.resolving and guard < 20000:
			await process_frame
			guard += 1
	print("done rounds=", rounds)
	quit()

