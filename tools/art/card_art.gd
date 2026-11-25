extends SceneTree
## Card art from the Living Ink rigs and rooms: a room backdrop, the calling's figure (its path variant for path cards)
## caught at the moment of the card, its target (a creature of the card's world, an ally, or the company), and an ink
## effect layer coloured by the card's course. Writes assets/art/cards/<art>.jpg at 560 x 306.
## Usage (needs a display: xvfb-run):
##   godot --path . --rendering-driver opengl3 --resolution 1120x612 --script res://tools/art/card_art.gd -- [ids=a,b] [cls=bulwark] [force]

const W := 1120
const H := 612
const OUT := Vector2i(560, 306)
const COURSE := {"fire": Color(0.85, 0.32, 0.12), "frost": Color(0.55, 0.78, 0.92), "lightning": Color(0.95, 0.82, 0.3),
	"water": Color(0.18, 0.42, 0.72), "toxin": Color(0.45, 0.62, 0.2), "void": Color(0.42, 0.2, 0.55),
	"physical": Color(0.12, 0.09, 0.07), "attuned": Color(0.42, 0.2, 0.55)}
const CASTERS := ["elementalist", "oracle", "hexweaver", "alchemist"]
const ARM_F := ["upperarm_f", "forearm_f", "hand_f"]
const ARM_N := ["upperarm_n", "forearm_n", "hand_n"]
const REACH := ["arm", "claw", "jaw", "tail", "tentacle", "wing", "neck", "head", "pincer", "hand", "fist", "weapon"]

var stage: Control
var creatures_by_world := {}
var name_keys: Array = []   # [lowercase name without "the", creature key], longest first, for reading art notes
var rooms_by_world := {}

func arg(name: String, dflt: String) -> String:
	for a in OS.get_cmdline_user_args():
		if a == name:
			return "1"
		if a.begins_with(name + "="):
			return a.substr(name.length() + 1)
	return dflt

func _initialize() -> void:
	root.size = Vector2i(W, H)
	root.content_scale_mode = Window.CONTENT_SCALE_MODE_DISABLED   # draw 1:1, not the game's stretched 1600 x 1000
	for k in Data.ENEMIES:
		var e: Dictionary = Data.ENEMIES[k]
		if BoneRig.has_rig(k):
			if not creatures_by_world.has(e.get("world", "")):
				creatures_by_world[e.get("world", "")] = {"foe": [], "elite": [], "boss": []}
			creatures_by_world[e.world][e.tier].append(k)
	for k in Data.ENEMIES:
		if BoneRig.has_rig(k):
			name_keys.append([String(Data.ENEMIES[k].name).to_lower().replace("the ", ""), k])
	name_keys.sort_custom(func(a, b): return a[0].length() > b[0].length())
	for w in Data.WORLDS:
		var rs: Array = []
		for r in Data.WORLDS[w].get("rooms", []):
			if ResourceLoader.exists("res://assets/art/rooms/%s_far.webp" % r):
				rs.append(r)
		rooms_by_world[w] = rs
	var only := arg("ids", "")
	var cls := arg("cls", "")
	var force := arg("force", "") != ""
	var ids := []
	for id in Data.CARDS:
		var c: Dictionary = Data.CARDS[id]
		if id.ends_with("+") or c.rarity in ["Curse"]:
			continue
		if only != "" and not only.split(",").has(id):
			continue
		if cls != "" and c.cls != cls:
			continue
		var art: String = c.get("art", id)
		if not force and FileAccess.file_exists("res://assets/art/cards/%s.jpg" % art):
			continue
		ids.append(id)
	print("card art: %d to draw" % ids.size())
	var t0 := Time.get_ticks_msec()
	for id in ids:
		_compose(id)
		await process_frame
		await process_frame
		var img := root.get_texture().get_image()
		img.resize(OUT.x, OUT.y, Image.INTERPOLATE_LANCZOS)
		img.save_jpg(ProjectSettings.globalize_path("res://assets/art/cards/%s.jpg" % Data.CARDS[id].get("art", id)), 0.88)
	print("done in %d ms" % (Time.get_ticks_msec() - t0))
	quit()

func _h(s: String) -> int:
	return abs(hash(s))

## The card's world: its own for world cards and afflictions, else one chosen from its id.
## The creature the art note names, if any ("onto a Drowned Thrall's skull").
func _noted(c: Dictionary) -> String:
	var note := String(c.get("note", "")).to_lower()
	for nk in name_keys:
		if nk[0].length() >= 4 and note.contains(nk[0]):
			return nk[1]
	return ""

func _world(id: String, c: Dictionary) -> String:
	if c.get("world", "") != "":
		return c.world
	var nk := _noted(c)
	if nk != "":
		return String(Data.ENEMIES[nk].get("world", "drowned"))
	if id.begins_with("aff_") or id.begins_with("t_"):
		var w := id.split("_")[1]
		if Data.WORLDS.has(w):
			return w
	var ws: Array = Data.WORLDS.keys()
	return ws[_h(id + "w") % ws.size()]

func _hero_key(c: Dictionary) -> String:
	var k: String = c.cls
	if not Data.HEROES.has(k):
		k = ["bulwark", "duelist", "elementalist", "alchemist", "oracle", "hexweaver"][_h(c.name) % 6]
	if c.get("sub", "") != "" and BoneRig.has_rig("%s__%s" % [k, c.sub]):
		return "%s__%s" % [k, c.sub]
	return k

func _kind(c: Dictionary) -> String:
	var dmg := false
	var blk := false
	for f in c.fx:
		if f.t in ["dmg", "coup", "dmg_per_element", "execute"]:
			dmg = true
		if f.t in ["block", "armor", "ward", "guard", "status"] and f.get("s", "") in ["", "taunt", "thorns", "fortify", "riposte", "dodge"]:
			blk = true
	if c.target in ["enemy", "all_enemies"]:
		return "cast" if (c.get("cat", "physical") != "physical" or String(c.cls) in CASTERS) and not (dmg and String(c.cls) in ["bulwark", "duelist"]) else "swing"
	if blk:
		return "block"
	return "cast"

func _compose(id: String) -> void:
	if stage != null:
		stage.queue_free()
	stage = Control.new()
	stage.size = Vector2(W, H)
	root.add_child(stage)
	var c: Dictionary = Data.CARDS[id]
	var w := _world(id, c)
	var rooms: Array = rooms_by_world.get(w, [])
	if rooms.is_empty():
		rooms = rooms_by_world.drowned
	var room: String = rooms[_h(id + "r") % rooms.size()]
	var note := String(c.get("note", "")).to_lower()
	for r in rooms:
		var word: String = String(r).split("_")[-1]
		if word.length() >= 4 and note.contains(word):
			room = r
	# the camera: the room is 2960 x 960 with the fighters' feet at y 860; show a band around the fight
	var zoom := 1.22 + 0.06 * (_h(id + "z") % 4)
	var cx := 1480.0 + float(_h(id + "x") % 240) - 120.0
	var feet_w := 860.0
	var origin := Vector2(W / 2.0 - cx * zoom, H * 0.95 - feet_w * zoom)
	for layer in ["far", "mid"]:
		var tr := TextureRect.new()
		tr.texture = load("res://assets/art/rooms/%s_%s.webp" % [room, layer])
		tr.position = origin
		tr.size = Vector2(2960, 960) * zoom
		tr.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		stage.add_child(tr)
	var kind := _kind(c)
	var col: Color = COURSE.get(String(c.get("cat", "physical")), COURSE.physical)
	var hero := _rig(_hero_key(c), Vector2(cx - (300 if c.target == "all_enemies" else 215), feet_w), origin, zoom, kind, 1.0, String(c.get("cat", "")))
	var targets := []
	match c.target:
		"enemy":
			var named := _noted(c)
			targets.append(_rig(named if named != "" else _foe(w, id, 0), Vector2(cx + 230, feet_w), origin, zoom, "hit", 1.0, ""))
		"all_enemies":
			for i in 3:
				targets.append(_rig(_foe(w, id, i), Vector2(cx + 150 + i * 170, feet_w - i * 10), origin, zoom, "hit", 0.74, ""))
		"ally", "ally_other", "adjacent_ally", "all_allies":
			var other := ["bulwark", "duelist", "elementalist", "alchemist", "oracle", "hexweaver"]
			other.erase(String(c.cls))
			var ally: String = other[_h(id + "a") % other.size()]
			for o in other:
				if String(c.get("note", "")).to_lower().contains(o):
					ally = o
			targets.append(_rig(ally, Vector2(cx + 110, feet_w), origin, zoom, "block", 1.0, ""))
	var fore := TextureRect.new()
	fore.texture = load("res://assets/art/rooms/%s_fore.webp" % room)
	fore.position = origin
	fore.size = Vector2(2960, 960) * zoom
	fore.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	stage.add_child(fore)
	var fx := InkFx.new()
	fx.size = Vector2(W, H)
	fx.col = col
	fx.kind = kind
	fx.seed = _h(id)
	fx.from = hero.position + hero.bone_point("hand_f") if hero.bones().has("hand_f") else hero.position + Vector2(160, 160) * zoom
	fx.to = []
	for t in targets:
		fx.to.append(t.position + t.bone_point("torso") if t.bones().has("torso") else t.position + Vector2(150, 220) * zoom)
	fx.wide = c.target == "all_enemies"
	fx.rarity = String(c.rarity)
	stage.add_child(fx)

func _foe(w: String, id: String, i: int) -> String:
	var pool: Dictionary = creatures_by_world.get(w, creatures_by_world.get("drowned", {}))
	var arr: Array = pool.get("foe", [])
	if arr.is_empty():
		arr = creatures_by_world.drowned.foe
	return arr[(_h(id + "f") + i * 3) % arr.size()]

## A posed rig whose feet stand at `feet` (room pixels). kind: swing, cast, block (the actor) or hit (a target).
func _rig(key: String, feet: Vector2, origin: Vector2, zoom: float, kind: String, fig: float, cat: String) -> BoneRig:
	var b := BoneRig.new()
	var j: Dictionary = Data._load_json(BoneRig.path_for(key))
	var ds := zoom * fig
	b.setup(key, Vector2(j.canvas[0], j.canvas[1]) * ds)
	if j.has("variants") and COURSE.has(cat) and cat not in ["physical", "attuned"]:
		b.set_variant(cat)
	var foot := Vector2(j.canvas[0] * 0.5, float(j.ground)) * ds
	b.position = origin + feet * zoom - foot
	var ang := {}
	var B: Dictionary = b.bones()
	match kind:
		"swing":
			for i in ARM_F.size():
				if B.has(ARM_F[i]):
					ang[ARM_F[i]] = 70.0 * [1.0, 0.45, 0.2][i]
			ang["torso"] = 7.0
			b.lean = 4.0
		"cast":
			for i in ARM_F.size():
				if B.has(ARM_F[i]):
					ang[ARM_F[i]] = -55.0 / (1 + i)
			ang["head"] = -5.0
		"block":
			for bb in ARM_N + ARM_F:
				if B.has(bb):
					ang[bb] = -16.0
			b.lean = -2.0
		"hit":
			ang["torso"] = 6.0
			ang["head"] = 9.0
			b.lean = 4.0
			for bb in B:
				for r in REACH:
					if String(bb).contains(r):
						ang[bb] = ang.get(bb, 0.0) + 8.0
						break
	b.angles = ang
	stage.add_child(b)
	b.queue_redraw()
	return b

class InkFx extends Control:
	var col := Color.BLACK
	var kind := "swing"
	var seed := 0
	var from := Vector2.ZERO
	var to: Array = []
	var wide := false
	var rarity := "C"

	func _r(i: int) -> float:
		return float(abs(hash(seed + i * 7919)) % 1000) / 1000.0

	func _draw() -> void:
		var ink := Color(0.08, 0.06, 0.05)
		# a wash of the course over the scene, stronger at the point of the card
		var focus: Vector2 = to[0] if not to.is_empty() else from + Vector2(140, -60)
		for i in 9:
			var rr := 380.0 - i * 38.0
			draw_circle(focus, rr, Color(col, 0.035 + i * 0.012))
		match kind:
			"swing":
				for t in to:
					for k in 3:
						var a0 := -2.4 + k * 0.18 + _r(k) * 0.2
						var pts := PackedVector2Array()
						for s in 14:
							var a := a0 + s * 0.11
							pts.append(t + Vector2(cos(a), sin(a)) * (110.0 + k * 16.0))
						draw_polyline(pts, ink if col == Color(0.12, 0.09, 0.07) else col.darkened(0.2), 7.0 - k * 2.0, true)
			"cast":
				for t in to:
					var pts := PackedVector2Array()
					for s in 18:
						var p := from.lerp(t, s / 17.0)
						p.y += sin(s * 0.9 + _r(1) * 6.0) * 16.0 * (1.0 - abs(s - 8.5) / 9.0)
						pts.append(p)
					draw_polyline(pts, col.darkened(0.25), 9.0, true)
					draw_polyline(pts, col.lightened(0.35), 3.0, true)
					for k in 7:
						draw_circle(t + Vector2(_r(k) * 120 - 60, _r(k + 20) * 120 - 60), 4.0 + _r(k + 40) * 9.0, Color(col.lightened(0.2), 0.8))
				if to.is_empty():
					for k in 12:
						var p := from + Vector2(_r(k) * 220 - 60, -_r(k + 9) * 260)
						draw_circle(p, 3.0 + _r(k + 3) * 7.0, Color(col.lightened(0.3), 0.75))
			"block":
				var c := from + Vector2(90, -40)
				for k in 3:
					draw_arc(c, 150.0 + k * 14.0, -1.2, 1.2, 28, Color(col.lightened(0.1), 0.7 - k * 0.2), 6.0 - k * 1.5, true)
		# rare and higher: a gilt rule along the bottom edge (an illuminator's mark)
		if rarity in ["R", "L", "X"]:
			draw_rect(Rect2(0, size.y - 10, size.x, 10), Color(0.72, 0.56, 0.22, 0.85))
