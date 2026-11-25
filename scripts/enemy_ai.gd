class_name EnemyAI
extends RefCounted
## Data-driven intent choice. Each enemy "ai" is an ordered rule list; the first rule that passes wins.
## Rule: {use, if?: condition (enemy is the actor), every?: n, offset?: k, not_twice?: bool, chance-free (no RNG)}.

static func pick(s: Dictionary, e: Dictionary, i: int) -> String:
	var d: Dictionary = Data.ENEMIES[e.key]
	var rules: Array = e.get("ai_override", []) if not e.get("ai_override", []).is_empty() else d.ai
	for r in rules:
		if r.get("not_twice", false) and e.last_intent == r.use:
			continue
		if r.has("every") and (s.round + i + int(r.get("offset", 0))) % int(r.every) != 0:
			continue
		if r.has("if") and not Combat.cond(s, e, {}, r["if"], {}):
			continue
		return r.use
	return rules[-1].use

