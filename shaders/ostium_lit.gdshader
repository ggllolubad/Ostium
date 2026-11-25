// Ostium lighting: one shader for every lit thing (backgrounds, props, heroes, foes).
// lit = albedo * (ambient(N) + sum_i light_i(P, N)) + emissive, then exposure, vignette, a filmic curve with crushed blacks.
// The maths mirrors the reference renderer in the art repo (grim/light/lightrender.py); look values live in
// res://data/lighting.json and are pushed here by the Lighting autoload, as are the scene's camera and lights.
// World space: X right, Y up, Z away from the camera; the camera sits at (0, eye, 0) looking down +Z.
shader_type canvas_item;
render_mode unshaded;

// the albedo is read raw from its own sampler: TEXTURE may arrive already linearized on some renderers and drivers,
// so the shader does its own sRGB decode and gets the same numbers everywhere
uniform sampler2D albedo_map : filter_linear, hint_default_white;
uniform bool has_albedo = false;
uniform sampler2D normal_map : filter_linear, hint_default_white;    // x right, y up, z toward viewer, 0.5-biased
uniform sampler2D emissive_map : filter_linear, hint_default_black;
uniform sampler2D depth_map : filter_nearest, hint_default_black;    // RG: distance in cm (16 bit), B: sky
uniform sampler2D pillow_map : filter_linear, hint_default_black;    // R: rounded surface (props, cloth, flesh); G: emissive coverage
uniform bool has_normal = false;
uniform bool has_emissive = false;
uniform bool has_depth = false;
uniform bool is_sprite = false;     // sprites: rounded everywhere, depth = sprite_z
uniform float sprite_z = 5.0;
uniform bool flip_h = false;
uniform int debug_view = 0;      // 1 depth, 2 normals, 3 light only (tools)

// scene camera and lights (set by Lighting)
uniform vec4 cam = vec4(3.0, 760.0, 300.0, 800.0);      // eye height m, focal px, horizon px, centre x px
uniform vec2 screen = vec2(1600.0, 1000.0);
uniform int light_count = 0;
uniform vec4 light_pos[64];     // xyz, range
uniform vec4 light_col[64];     // rgb, intensity

// the look (set by Lighting from data/lighting.json)
uniform vec3 ambient_col = vec3(0.62, 0.66, 0.74);
uniform float ambient_sky = 0.07;
uniform float ambient_fill = 0.035;
uniform vec3 key_dir = vec3(-0.55, 0.62, -0.56);
uniform vec3 key_col = vec3(0.70, 0.74, 0.82);
uniform float key_int = 0.05;
uniform float exposure = 1.7;
uniform float toe = 0.012;
uniform float emissive_gain = 1.0;
uniform float sky_gain = 0.22;
uniform float vignette = 0.55;
uniform float bounce = 0.075;
uniform vec3 bounce_col = vec3(1.0, 0.78, 0.58);
uniform float wrap = 0.18;

uniform vec2 scene_shift = vec2(0.0);   // a pan of the whole scene (title screen) without moving its lights
varying vec2 scene_px;
varying vec4 vcol;     // modulate only: in fragment() COLOR already holds texture * modulate

void vertex() {
	scene_px = (MODEL_MATRIX * vec4(VERTEX, 0.0, 1.0)).xy - scene_shift;
	vcol = COLOR;
}

vec3 to_lin(vec3 c) { return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(vec3(0.04045), c)); }
vec3 to_srgb(vec3 c) { c = clamp(c, 0.0, 1.0); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c)); }
vec3 filmic(vec3 x) { return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }

void fragment() {
	vec4 alb = (has_albedo ? texture(albedo_map, UV) : texture(TEXTURE, UV)) * vcol;
	vec3 albl = to_lin(alb.rgb);
	vec3 ns = has_normal ? texture(normal_map, UV).rgb * 2.0 - 1.0 : vec3(0.0, 0.0, 1.0);
	if (flip_h) { ns.x = -ns.x; }
	vec3 N = normalize(vec3(ns.x, ns.y, -ns.z));
	vec3 dep = has_depth ? texture(depth_map, UV).rgb : vec3(0.0);
	bool sky = has_depth && dep.b > 0.5;
	float t = sprite_z;
	if (has_depth && !is_sprite) { t = max((dep.r * 255.0 * 256.0 + dep.g * 255.0) / 100.0, 0.5); }
	vec3 d = vec3((scene_px.x - cam.w) / cam.y, -(scene_px.y - cam.z) / cam.y, 1.0);
	vec3 P = vec3(0.0, cam.x, 0.0) + d * t;
	vec4 pm = texture(pillow_map, UV);
	float wr = (is_sprite || pm.r > 0.5) ? wrap : 0.0;

	vec3 acc = ambient_col * (ambient_fill + ambient_sky * (0.5 + 0.5 * N.y));
	acc += key_col * key_int * max(dot(N, normalize(key_dir)), 0.0);
	acc += bounce_col * bounce * max(-N.z, 0.0);
	for (int i = 0; i < light_count; i++) {
		vec3 v = light_pos[i].xyz - P;
		float dd = length(v) + 1e-4;
		float rng = light_pos[i].w;
		float win = pow(clamp(1.0 - pow(dd / rng, 4.0), 0.0, 1.0), 2.0);
		float att = light_col[i].w * win / (1.0 + pow(dd / (rng * 0.3), 2.0));
		float ndl = max((dot(N, v) / dd + wr) / (1.0 + wr), 0.0);
		acc += light_col[i].rgb * att * ndl;
	}
	vec3 lit = albl * acc * (1.0 - (is_sprite ? 0.0 : pm.g));   // emissive covers the lit surface by its coverage
	if (has_emissive) { lit += to_lin(texture(emissive_map, UV).rgb) * emissive_gain; }
	if (sky) { lit = albl * sky_gain; }
	vec2 q = (scene_px - vec2(screen.x * 0.5, screen.y * 0.55)) / (screen * 0.62);
	float vig = 1.0 - vignette * pow(clamp((length(q) - 0.55) / 0.6, 0.0, 1.0), 1.6);
	vec3 x = max(lit * exposure * vig - toe, vec3(0.0));
	COLOR = vec4(to_srgb(filmic(x)), alb.a);
	if (debug_view == 1) { COLOR = vec4(vec3(t / 40.0), alb.a); }
	if (debug_view == 2) { COLOR = vec4(ns * 0.5 + 0.5, alb.a); }
	if (debug_view == 3) { COLOR = vec4(to_srgb(filmic(acc * exposure)), alb.a); }
	if (debug_view == 5) { COLOR = vec4(alb.rgb, alb.a); }
	if (debug_view == 6) { COLOR = vec4(to_srgb(filmic(albl * acc * exposure)), 1.0); }
	if (debug_view == 4) { COLOR = vec4(float(light_count) / 64.0, light_pos[10].w / 10.0, light_col[40].w / 4.0, 1.0); }
}

