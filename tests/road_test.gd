extends SceneTree
# Checks the road through the doors: one door unseals per clear, in story order, then Cast Lots opens.
func _init() -> void:
	var fails := 0
	Run.meta = {"ostia": 0, "unlocked": [], "wins": 0, "runs": 0, "best_depth": 0, "doors": ["drowned"], "cleared": []}
	var order: Array = Data.STORY.order
	for i in order.size():
		var w: String = order[i]
		for j in order.size():
			var expect := j <= i
			if Run.door_open(order[j]) != expect:
				print("FAIL step %d: %s open=%s" % [i, order[j], Run.door_open(order[j])]); fails += 1
		if i > 0 and not (Data.WORLDS[order[i - 1]].pair.any(func(e): return Data.WORLDS[w].pair.has(e))):
			print("FAIL road breaks between %s and %s" % [order[i - 1], w]); fails += 1
		if Run.all_cleared():
			print("FAIL all_cleared too early at %s" % w); fails += 1
		Run.meta.cleared.append(w)
		var opened := Run.open_doors_from(w)
		var want: Array = [order[i + 1]] if i + 1 < order.size() else []
		if opened != want:
			print("FAIL clearing %s opened %s, want %s" % [w, opened, want]); fails += 1
		if String(Data.WORLDS[w].get("lead", "")) == "":
			print("FAIL %s has no lead" % w); fails += 1
	if not Run.all_cleared():
		print("FAIL road not complete"); fails += 1
	for k in order:
		if not Run.door_open(k):
			print("FAIL %s closed after the road" % k); fails += 1
	Run.meta.last_world = "sky"
	for t in 200:
		if Run.cast_lots() == "sky":
			print("FAIL cast_lots repeated the last world"); fails += 1
			break
	print("road: %s (%d worlds, %d fails)" % ["PASS" if fails == 0 else "FAIL", order.size(), fails])
	quit(1 if fails else 0)

