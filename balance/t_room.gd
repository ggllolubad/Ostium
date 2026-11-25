extends SceneTree
func _init() -> void:
	SaveIO.dir = "user://t_room"
	Run.meta_load()
	Abbey.start_descent("boss", "drowned", 4242)
	var c := {}
	for i in 60:
		var n := {"type": "combat", "layer": 5 + (i % 6)}
		var k := Run.room_for(n)
		c[k] = c.get(k, 0) + 1
	print(c)
	var xs := []
	for i in 10:
		xs.append(snappedf(Run.rnd(), 0.001))
	print(xs)
	quit()
