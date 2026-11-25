class_name Data
extends RefCounted
## Static content for the combat slice: elements, heroes, cards, enemies, encounters.

const ELEMENTS := ["fire", "frost", "lightning", "water", "toxin", "void"]
const ELEMENT_STATUS := {"fire": "Burn", "frost": "Weaken", "lightning": "Static", "water": "Soak", "toxin": "Toxin", "void": "Erode"}
const ELEMENT_COLOR := {
	"fire": Color("c4573f"), "frost": Color("5a78a6"), "lightning": Color("a9822f"),
	"water": Color("3f6fa0"), "toxin": Color("62804f"), "void": Color("6d5a8a"), "physical": Color("6f5036"),
}

# Conjunction table keyed by sorted pair "a+b" (alphabetical).
const REACTIONS := {
	"fire+frost": {"name": "Thermal Shock", "desc": "Shreds Armor and deals damage."},
	"fire+lightning": {"name": "Plasma", "desc": "Heavy damage; splashes Burn to adjacent ranks."},
	"fire+water": {"name": "Scald", "desc": "Damage and Vulnerable for 1 round."},
	"fire+toxin": {"name": "Combust", "desc": "Toxin detonates as damage."},
	"fire+void": {"name": "Hollow Flame", "desc": "Burn becomes unremovable and ignores Ward."},
	"frost+lightning": {"name": "Lockdown", "desc": "Target's action is delayed to the end of the queue."},
	"frost+water": {"name": "Freeze", "desc": "Target skips its next action. Next physical hit shatters for bonus damage."},
	"frost+toxin": {"name": "Cryo-rot", "desc": "Max HP reduced for the fight."},
	"frost+void": {"name": "Absolute Zero", "desc": "Executes a weakened foe. A hero is cast to Death's Door."},
	"lightning+water": {"name": "Electrocute", "desc": "Damage chains to every Soaked unit."},
	"lightning+toxin": {"name": "Neurotoxin", "desc": "Target's next action loses its secondary effects."},
	"lightning+void": {"name": "Discharge", "desc": "True damage, ignoring Block and Armor."},
	"toxin+water": {"name": "Toxic Pool", "desc": "Rank hazard: 1 Toxin to its occupant each round for 3 rounds."},
	"void+water": {"name": "Drown", "desc": "Silence: next action is only a basic attack. Heroes take stress."},
	"toxin+void": {"name": "Blight", "desc": "No healing or Block for 2 rounds (heroes: no healing)."},
}

const KEYWORDS := {
	"Block": "Absorbs damage. Clears at the start of each round.",
	"Armor": "Reduces each hit by its value. Persists.",
	"Ward": "Negates the next N element stacks applied.",
	"Conjunction": "Two different elements meeting on one target. Each pair has its own effect (Thermal Shock, Plasma, Freeze...).",
	"Resist": "Resistant foes take half the stacks of that element (rounded down) and halve Conjunctions with it. Physical resistance cuts physical hits by 30%.",
	"Weak": "Weak foes take 50% more stacks of that element, Conjunctions with it are 50% stronger, and physical weakness adds 30% to physical hits.",
	"Immune": "Immune foes ignore that element entirely.",
	"Stable": "Element stacks pile up; never forms a Conjunction on its own.",
	"Volatile": "On hit, forms a Conjunction at once with every other element on the target.",
	"Burn": "Fire. Takes damage equal to stacks at round end (less any Soak).",
	"Weaken": "Frost. Each stack reduces this unit's hit damage by 1.",
	"Static": "Lightning. Takes damage equal to stacks whenever it acts.",
	"Soak": "Water. Conducts and feeds Conjunctions; dampens Burn.",
	"Toxin": "Reduces healing received and Armor by its stacks.",
	"Erode": "Void. Reduces Block and Ward gained by its stacks.",
	"Bleed": "Takes damage equal to stacks at round end, then -1.",
	"Stun": "Skips its next action. Grants Tenacity after.",
	"Tenacity": "Immune to Stun and Freeze for this round.",
	"Mark": "Marked targets take extra effects from mark cards.",
	"Vulnerable": "Takes 50% more damage.",
	"Might": "Each stack adds 1 damage to hits.",
	"Focus": "Each stack adds 1 to the next element application, then is spent.",
	"Momentum": "Gained when the same hero acts twice in a row. Spent by finishers.",
	"Riposte": "When hit by an attack, strike back for its stacks; -1 per trigger.",
	"Taunt": "Enemy single-target attacks must target this hero.",
	"Guard": "Attacks aimed at the guarded ally hit the guardian instead.",
	"Prime": "Empowers the next action in the queue, from any hero.",
	"Echo": "Replays at half power at the end of your plan.",
	"Exhaust": "Removed for the rest of the fight when played.",
	"Retain": "Stays in hand at round end.",
	"Death's Door": "At 0 HP. Each further hit spends 1 Grit; at 0 Grit the next hit is fatal.",
	"Grit": "Hits a hero can survive at Death's Door. Refreshes each fight.",
	"Thorns": "An attacker takes this much damage each time it hits. Halves at round end.",
	"Fortify": "Block does not clear at the start of the round while Fortify lasts.",
	"Anchor": "Cannot be moved while Anchor lasts.",
	"Dodge": "Avoids the next hit. Each stack is one hit; clears at round end.",
	"Attuned": "The Elementalist's current course. Attuned cards apply it.",
	"Hex": "Deals 1 less damage per 2 Hex. Never fades. Hexweaver cards spend it.",
	"Doom": "Never fades. Every execute check treats this foe's HP as lower by its Doom. At round end, if Doom meets its HP, it dies (a ruler drops to its next phase).",
	"Execute": "A foe at that much HP or less dies. A ruler with phases left drops to its next phase instead.",
	"Scars": "HP this hero has lost this fight. Healing does not lower it.",
	"Shatter": "A Frozen unit hit by a physical attack takes bonus damage, and the Freeze ends.",
	"Finisher": "Spends all your Momentum for its effect.",
	"Conjoin": "One Stable stack on the target turns Volatile, so its Conjunctions happen now.",
	"Spectrum": "The number of different courses on a unit.",
	"Ailment": "Any harmful status or course stack on a hero.",
	"Fresh": "A brewed or refilled flask. It spoils when the fight ends.",
	"Dosed": "Its bonus applies if any hero has used a flask this round before it resolves.",
	"Omen": "The Augur's stored foresight, spent by Fulfil cards.",
	"Rite": "Sets a lasting effect for the rest of the fight. Exhausts.",
	"Delay": "The foe acts last this round; if it already acts last, it waits until next round (never twice in a row).",
	"Swarm": "Takes half damage from single-target hits and 50% more from hits on every foe.",
	"Charge": "A visible count building toward something. Watch the intent.",
	"Flask": "A belt item. Free to use, at most one per hero a round.",
}

# Heroes and cards are generated by tools/content/build.py into data/*.json.
static var HEROES: Dictionary = _load_json("res://data/heroes.json")
static var CARDS: Dictionary = _load_json("res://data/cards.json")
static var _UPGRADES_MADE: bool = _make_upgrades()

## Upgraded cards (Rules v2, rule 19) live beside their base card as "<id>+". A card's "up" block overrides its fields
## (usually "fx", "cost", "text"). Cards with no "up" block get a provisional upgrade for the balance sim only: every
## positive amount up by a third, rounded up. Stage 3 writes the real upgrades.
static func _make_upgrades() -> bool:
	for id in CARDS.keys():
		var c: Dictionary = CARDS[id]
		if id.ends_with("+") or c.rarity in ["Curse", "Affliction", "A"] or c.target == "none":
			continue
		var u: Dictionary = c.duplicate(true)
		if c.has("up"):
			for k in c.up:
				u[k] = c.up[k]
		else:
			for f in u.fx:
				if typeof(f.get("n", null)) == TYPE_INT and int(f.n) > 0 and f.t != "add":
					f.n = int(ceil(f.n * 4 / 3.0))
			u.provisional = true
		u.name = c.name + "+"
		u.erase("up")
		u.base = id
		CARDS[id + "+"] = u
	return true
const CLASS_ORDER := ["bulwark", "duelist", "elementalist", "alchemist", "oracle", "hexweaver"]

static func _load_json(path: String) -> Dictionary:
	var f := FileAccess.open(path, FileAccess.READ)
	if f == null:
		push_error("missing " + path)
		return {}
	var v = JSON.parse_string(f.get_as_text())
	return _ints(v)

## JSON numbers arrive as floats; turn integral ones back into ints so rank lists and costs compare cleanly.
static func _ints(v):
	match typeof(v):
		TYPE_FLOAT:
			return int(v) if v == floor(v) else v
		TYPE_ARRAY:
			var o := []
			for x in v:
				o.append(_ints(x))
			return o
		TYPE_DICTIONARY:
			var o := {}
			for k in v:
				o[k] = _ints(v[k])
			return o
	return v

## Cards a class can be offered as rewards (optionally including one subclass).
static func pool(cls: String, sub := "") -> Array:
	var o := []
	for id in CARDS:
		var c: Dictionary = CARDS[id]
		if c.cls != cls or id.ends_with("+"):
			continue
		if c.rarity in ["C", "U", "R"] or (c.rarity == "X" and c.get("sub", "") == sub and sub != ""):
			o.append(id)
	return o

# Enemies and rooms are generated by tools/content/bestiary.py.
static var ENEMIES: Dictionary = _load_json("res://data/enemies.json")
static var _ROOMS: Dictionary = _load_json("res://data/encounters.json")
static var ENCOUNTERS: Array = _ROOMS.rooms
static var GAUNTLET: Array = _ROOMS.gauntlet
static var WORLDS: Dictionary = _load_json("res://data/worlds.json")
## The road through the doors: fixed story order, five acts of three, and the finale line.
static var STORY: Dictionary = _load_json("res://data/story.json")
const WORLD_ORDER := ["drowned", "rime", "foundry", "baths", "pits", "pyre", "spire", "fleet", "barrow", "silence", "coast", "hive", "sky", "mire", "garden"]

