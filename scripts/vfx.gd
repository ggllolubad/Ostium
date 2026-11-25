class_name Vfx
extends RefCounted
## One-shot visual effects built from particles, lines and polygons. Every function spawns nodes on `layer`
## (a Control above the fighters) that free themselves when done.

const EL := {
	"fire": Color("f08a3c"), "frost": Color("bfe0f0"), "lightning": Color("f4dc78"), "water": Color("5f9ac8"),
	"toxin": Color("9ac060"), "void": Color("9a7ac8"), "physical": Color("e8dcc0"), "blood": Color("8a1a12"),
}

static func _free_after(n: Node, t: float) -> void:
	var tw := n.create_tween()
	tw.tween_interval(t)
	tw.tween_callback(n.queue_free)

static func _dot_tex() -> Texture2D:
	var g := GradientTexture2D.new()
	g.width = 32
	g.height = 32
	g.fill = GradientTexture2D.FILL_RADIAL
	g.fill_from = Vector2(0.5, 0.5)
	g.fill_to = Vector2(0.5, 0.0)
	var gr := Gradient.new()
	gr.set_color(0, Color(1, 1, 1, 1))
	gr.set_color(1, Color(1, 1, 1, 0))
	g.gradient = gr
	return g

static var DOT: Texture2D = _dot_tex()

## Generic particle burst.
static func burst(layer: Node, pos: Vector2, col: Color, o := {}) -> CPUParticles2D:
	var p := CPUParticles2D.new()
	p.position = pos
	p.amount = int(o.get("amount", 28))
	p.lifetime = float(o.get("life", 0.7))
	p.one_shot = true
	p.explosiveness = float(o.get("explode", 0.92))
	p.texture = DOT
	p.direction = o.get("dir", Vector2(0, -1))
	p.spread = float(o.get("spread", 180.0))
	p.initial_velocity_min = float(o.get("vmin", 60.0))
	p.initial_velocity_max = float(o.get("vmax", 220.0))
	p.gravity = o.get("gravity", Vector2(0, 260))
	p.scale_amount_min = float(o.get("smin", 0.25))
	p.scale_amount_max = float(o.get("smax", 0.7))
	p.radial_accel_min = float(o.get("radial", 0.0))
	p.radial_accel_max = float(o.get("radial", 0.0))
	p.damping_min = float(o.get("damp", 0.0))
	p.damping_max = float(o.get("damp", 0.0))
	var ramp := Gradient.new()
	ramp.set_color(0, col)
	ramp.set_color(1, Color(col, 0.0))
	p.color_ramp = ramp
	if o.has("emit_r"):
		p.emission_shape = CPUParticles2D.EMISSION_SHAPE_SPHERE
		p.emission_sphere_radius = float(o.emit_r)
	layer.add_child(p)
	p.emitting = true
	_free_after(p, p.lifetime + 0.3)
	return p

static func ring(layer: Node, pos: Vector2, col: Color, r0: float, r1: float, dur := 0.4, width := 4.0) -> void:
	var l := Line2D.new()
	var pts := PackedVector2Array()
	for i in 41:
		var a := TAU * i / 40.0
		pts.append(Vector2(cos(a), sin(a) * 0.55))
	l.points = pts
	l.width = width
	l.default_color = col
	l.position = pos
	l.scale = Vector2(r0, r0)
	l.width = width / max(1.0, r0)
	layer.add_child(l)
	var tw := l.create_tween().set_parallel(true)
	tw.tween_property(l, "scale", Vector2(r1, r1), dur).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
	tw.tween_property(l, "modulate:a", 0.0, dur)
	tw.tween_property(l, "width", width / max(1.0, r1), dur)
	_free_after(l, dur + 0.05)

## Three curved strokes sweeping across the target.
static func slash(layer: Node, pos: Vector2, col: Color, facing: float, big := false) -> void:
	for k in 3:
		var l := Line2D.new()
		var pts := PackedVector2Array()
		var r := (70.0 if big else 52.0) + k * 10
		for i in 13:
			var a: float = lerp(-1.1, 1.1, i / 12.0)
			pts.append(Vector2(-facing * cos(a) * r * 0.4 + facing * 10 * k, sin(a) * r))
		l.points = pts
		l.width = 7.0 - k * 1.8
		var wc := Curve.new()
		wc.add_point(Vector2(0, 0.1))
		wc.add_point(Vector2(0.5, 1))
		wc.add_point(Vector2(1, 0.1))
		l.width_curve = wc
		l.default_color = col if k == 0 else Color("2b1d12", 0.8)
		l.position = pos + Vector2(0, -10)
		l.rotation = facing * 0.5
		l.modulate.a = 0.0
		layer.add_child(l)
		var tw := l.create_tween()
		tw.tween_interval(k * 0.04)
		tw.tween_property(l, "modulate:a", 1.0, 0.04)
		tw.tween_interval(0.12)
		tw.tween_property(l, "modulate:a", 0.0, 0.25)
		_free_after(l, 0.6)

static func bolt(layer: Node, from: Vector2, to: Vector2, col: Color) -> void:
	for flick in 2:
		var l := Line2D.new()
		var pts := PackedVector2Array()
		var n := 10
		for i in n + 1:
			var t := i / float(n)
			var off := Vector2.ZERO if i == 0 or i == n else Vector2(randf_range(-14, 14), randf_range(-14, 14))
			pts.append(from.lerp(to, t) + off)
		l.points = pts
		l.width = 4.0 - flick * 1.5
		l.default_color = col if flick == 0 else Color(1, 1, 1, 0.9)
		layer.add_child(l)
		var tw := l.create_tween()
		tw.tween_interval(0.06 + flick * 0.04)
		tw.tween_property(l, "modulate:a", 0.0, 0.18)
		_free_after(l, 0.35)

## A glowing projectile with a trail; awaitable.
static func projectile(layer: Node, from: Vector2, to: Vector2, col: Color, dur := 0.26) -> void:
	var n := Node2D.new()
	n.position = from
	layer.add_child(n)
	var core := Sprite2D.new()
	core.texture = DOT
	core.modulate = col
	core.scale = Vector2(1.1, 1.1)
	n.add_child(core)
	var hot := Sprite2D.new()
	hot.texture = DOT
	hot.scale = Vector2(0.45, 0.45)
	n.add_child(hot)
	var trail := CPUParticles2D.new()
	trail.amount = 30
	trail.lifetime = 0.35
	trail.texture = DOT
	trail.spread = 25
	trail.initial_velocity_min = 5
	trail.initial_velocity_max = 30
	trail.gravity = Vector2.ZERO
	trail.scale_amount_min = 0.2
	trail.scale_amount_max = 0.5
	var ramp := Gradient.new()
	ramp.set_color(0, col)
	ramp.set_color(1, Color(col, 0))
	trail.color_ramp = ramp
	trail.local_coords = false
	n.add_child(trail)
	var mid := (from + to) / 2 + Vector2(0, -60)
	var tw := n.create_tween()
	tw.tween_method(func(t): n.position = from.lerp(mid, t).lerp(mid.lerp(to, t), t), 0.0, 1.0, dur)
	tw.tween_callback(func(): core.visible = false; hot.visible = false; trail.emitting = false)
	_free_after(n, dur + 0.5)
	await n.get_tree().create_timer(dur).timeout

## Element signature effects.
static func element(layer: Node, pos: Vector2, e: String, big := false) -> void:
	var c: Color = EL.get(e, EL.physical)
	var m := 1.6 if big else 1.0
	match e:
		"fire":
			burst(layer, pos, c, {"amount": int(36 * m), "gravity": Vector2(0, -260), "vmin": 30, "vmax": 160 * m, "dir": Vector2(0, -1), "spread": 70, "smax": 0.9, "life": 0.8})
			burst(layer, pos, Color("f6d27a"), {"amount": int(16 * m), "gravity": Vector2(0, -200), "vmax": 90 * m, "spread": 40, "smax": 0.5})
		"frost":
			burst(layer, pos, c, {"amount": int(30 * m), "gravity": Vector2(0, 320), "vmin": 80, "vmax": 260 * m, "smin": 0.15, "smax": 0.4})
			ring(layer, pos, Color("e8f4f8"), 10, 70 * m, 0.45, 5)
		"lightning":
			for i in int(3 * m):
				bolt(layer, pos + Vector2(randf_range(-40, 40), -120), pos + Vector2(randf_range(-20, 20), randf_range(-10, 30)), c)
			burst(layer, pos, c, {"amount": int(24 * m), "gravity": Vector2.ZERO, "vmin": 120, "vmax": 300 * m, "smin": 0.1, "smax": 0.3, "life": 0.35})
		"water":
			burst(layer, pos, c, {"amount": int(34 * m), "gravity": Vector2(0, 600), "dir": Vector2(0, -1), "spread": 60, "vmin": 150, "vmax": 340 * m, "smax": 0.55})
			ring(layer, pos + Vector2(0, 40), c, 10, 60 * m, 0.5, 4)
		"toxin":
			burst(layer, pos, c, {"amount": int(26 * m), "gravity": Vector2(0, -60), "vmin": 10, "vmax": 80 * m, "smin": 0.3, "smax": 0.9, "life": 1.2, "emit_r": 30.0, "explode": 0.4})
		"void":
			burst(layer, pos, c, {"amount": int(40 * m), "gravity": Vector2.ZERO, "radial": -260.0, "vmin": 0, "vmax": 10, "emit_r": 70.0 * m, "life": 0.6, "smax": 0.6})
			ring(layer, pos, Color("2a1a3a"), 80 * m, 6, 0.55, 6)
		_:
			burst(layer, pos, c, {"amount": int(20 * m)})

static func blood(layer: Node, pos: Vector2, amount := 22) -> void:
	burst(layer, pos, EL.blood, {"amount": amount, "gravity": Vector2(0, 700), "vmin": 80, "vmax": 260, "dir": Vector2(0, -1), "spread": 80, "smin": 0.15, "smax": 0.5})

static func heal(layer: Node, pos: Vector2) -> void:
	burst(layer, pos, Color("c8e0a0"), {"amount": 26, "gravity": Vector2(0, -120), "vmin": 10, "vmax": 60, "emit_r": 40.0, "explode": 0.3, "life": 1.0, "smax": 0.45})
	burst(layer, pos, Color("f6e6a0"), {"amount": 12, "gravity": Vector2(0, -160), "vmin": 10, "vmax": 50, "emit_r": 30.0, "explode": 0.2, "life": 1.0, "smax": 0.3})

static func shield(layer: Node, pos: Vector2, col := Color("93b3da")) -> void:
	ring(layer, pos, col, 20, 90, 0.5, 6)
	ring(layer, pos, Color(1, 1, 1, 0.8), 30, 75, 0.35, 3)

static func stress(layer: Node, pos: Vector2) -> void:
	burst(layer, pos + Vector2(0, -60), Color("3a2a4a", 0.9), {"amount": 24, "gravity": Vector2(0, -50), "vmin": 5, "vmax": 40, "emit_r": 40.0, "explode": 0.3, "life": 1.3, "smin": 0.6, "smax": 1.2})

static func buff(layer: Node, pos: Vector2, col: Color) -> void:
	ring(layer, pos, col, 60, 12, 0.4, 4)
	burst(layer, pos, col, {"amount": 14, "gravity": Vector2(0, -150), "vmin": 10, "vmax": 70, "emit_r": 35.0, "explode": 0.5, "life": 0.7, "smax": 0.4})

static func shake(node: Control, strength := 6.0, dur := 0.25) -> void:
	var base := node.position
	var tw := node.create_tween()
	var steps := int(dur / 0.03)
	for i in steps:
		var k := 1.0 - float(i) / steps
		tw.tween_property(node, "position", base + Vector2(randf_range(-1, 1), randf_range(-1, 1)) * strength * k, 0.03)
	tw.tween_property(node, "position", base, 0.03)

