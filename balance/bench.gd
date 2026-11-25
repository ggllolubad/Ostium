extends SceneTree
func _init() -> void:
	var s := Combat.new_state(["bulwark", "duelist", "elementalist"], Data.ENCOUNTERS[20].enemies, 7)
	Combat.start_round(s)
	var t0 := Time.get_ticks_usec()
	for i in 500:
		var r := Combat.simulate(s, [], true)
	print("simulate us: ", (Time.get_ticks_usec() - t0) / 500.0)
	t0 = Time.get_ticks_usec()
	for i in 500:
		var c: Dictionary = s.duplicate(true)
	print("dup us: ", (Time.get_ticks_usec() - t0) / 500.0)
	quit()
