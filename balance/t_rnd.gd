extends SceneTree
func _init() -> void:
	SaveIO.dir = "user://t_room"
	Run.meta_load()
	Abbey.start_descent("boss", "drowned", 4242)
	for i in 3:
		print(Run.r.step, " ", hash(str(Run.r.seed) + ":" + str(Run.r.step)), " ", Run.rnd())
	print(hash("4242:1"), " ", hash("4242:2"), " ", hash("abc"), " ", hash("abd"))
	quit()
