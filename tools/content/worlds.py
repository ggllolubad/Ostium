"""The fourteen door worlds beyond the Drowned Kingdom: one per element pair. Each world has five foes, two elites,
a boss, three rooms and its encounter list. Intent text is generated from the effects so it always matches.
Imported by bestiary.py, which merges everything into data/enemies.json and data/encounters.json."""
from dsl import D, B, H, ST, A, STRESS, PULL, PUSH, SELFDMG

S = 0.471
CANVAS = {"foe": (460, 700), "elite": (560, 800), "boss": (700, 900)}
EL = {"fire": "Burn", "frost": "Weaken", "lightning": "Static", "water": "Soak", "toxin": "Toxin", "void": "Erode"}
TGT = {"front": "the front hero", "back": "the rearmost hero", "all_heroes": "every hero", "self": "itself", "ally_lowest": "the most wounded foe", "all_allies": "every foe"}


def _txt(fx, target):
    head, tail = [], []
    for f in fx:
        t, n = f["t"], f.get("n")
        if t == "dmg":
            s = f"{n}"
            if f.get("times"):
                s += f" {['', 'once', 'twice', 'three times', 'four times'][f['times']]}"
            if f.get("pierce"):
                s += " (ignores Block)"
            if f.get("true"):
                s += " true damage"
            head.append(s)
            if f.get("lifesteal"):
                tail.append("healing itself")
        elif t == "apply":
            head.append(f"{n} {EL[f['e']]}" if f.get("attr") != "volatile" else f"{n} Volatile {EL[f['e']]}")
        elif t == "stress":
            head.append(f"{n} stress")
        elif t == "status" and f.get("to") == "self":
            tail.append({"dodge": f"dodges the next {'hit' if n == 1 else f'{n} hits'}", "regen": f"regenerates {n}", "thorns": f"gains {n} Thorns", "might": f"gains {n} Might", "taunt": "taunts", "fortify": "keeps its Block", "riposte": f"ripostes for {n}"}.get(f["s"], f"gains {n} {f['s'].capitalize()}"))
        elif t == "status":
            head.append({"stun": "Stun", "mark": "Mark", "vulnerable": "Vulnerable", "anchor": "Anchored", "hex": f"{n} Hex", "doom": f"Doom {n}", "bleed": f"{n} Bleed", "might": f"{n} Might", "regen": f"{n} Regen", "dodge": "Dodge"}.get(f["s"], f"{n} {f['s']}"))
        elif t == "block":
            tail.append(f"{n} Block" if target != "self" else f"gains {n} Block")
        elif t == "heal":
            tail.append(f"heals {n}")
        elif t == "pull":
            tail.append(f"drags them forward {n}")
        elif t == "push":
            tail.append(f"shoves them back {n}")
        elif t == "self_dmg":
            tail.append("dies" if n >= 999 else f"loses {n} HP")
        elif t == "guard_weakest":
            tail.append("guards the weakest foe")
    who = TGT[target]
    if head:
        s = " and ".join([", ".join(head[:-1]), head[-1]] if len(head) > 1 else head) + f" to {who}"
        return s + ("; " + ", ".join(tail) if tail else "")
    return (who.capitalize() + ": " if target not in ("self",) else "") + ", ".join(tail)


def I(name, kind, target, fx):
    return {"name": name, "kind": kind, "target": target, "fx": fx, "text": _txt(fx, target)}


def me(s, n): return {"t": "status", "s": s, "n": n, "to": "self"}


def EV(n, **k): return {"every": n, **k}


WORLDS, E, ROOMS = {}, {}, []


def world(key, name, pair, conj, blurb, rooms):
    WORLDS[key] = {"name": name, "pair": pair, "conjunction": conj, "blurb": blurb, "rooms": rooms, "foes": [], "elites": [], "bosses": []}


def foe(w, key, name, hp, armor, tier, intents, ai, lore, resist=None, phases=None, personality=None):
    cw, ch = CANVAS[tier]
    e = {"name": name, "hp": hp, "armor": armor, "tier": tier, "art": f"res://assets/art/rigs/{key}/full.png", "size": [round(cw * S), round(ch * S)],
         "feet": round((ch - 24 * ch / 700) / ch, 4), "intents": intents, "ai": ai, "lore": lore, "world": w, "resist": resist or {}}
    if tier == "boss":
        e["span"] = 2
        e["phases"] = phases or []
    if personality:
        e["personality"] = personality
    E[key] = e
    WORLDS[w]["foes" if tier == "foe" else ("elites" if tier == "elite" else "bosses")].append(key)


def room(w, name, desc, enemies, rm, tier):
    ROOMS.append({"name": name, "desc": desc, "enemies": enemies, "room": rm, "tier": tier, "world": w})


# ================================================================== FIRE + FROST: THERMAL SHOCK
W_ = "rime"
world(W_, "The Sundered Rime", ["fire", "frost"], "Thermal Shock", "A glacier split open by the fire beneath. Everything here is half frozen and half burning, and it cracks.", ["rime_glacier", "rime_hall", "rime_crevasse"])
foe(W_, "rime_thrall", "Rimeburnt Thrall", 32, 0, "foe", {
    "pick": I("Ice Pick", "attack", "front", [D(9)]),
    "chip": I("Chip Away", "attack", "front", [D(5), ST("vulnerable", 1)]),
    "shiver": I("Shiver", "debuff", "back", [A("frost", 2, attr="stable")]),
}, [{"use": "chip", "every": 3}, {"use": "shiver", "every": 3, "offset": 1}, {"use": "pick"}], "Miners who dug too deep and met the fire coming up. The ice kept what the fire left.", {"frost": "resist", "fire": "weak"})
foe(W_, "magma_hound", "Magma Hound", 30, 1, "foe", {
    "maul": I("Molten Maul", "attack", "front", [D(7), A("fire", 1, attr="stable")]),
    "lunge": I("Lunge", "attack", "back", [D(8)]),
    "howl": I("Steam Howl", "debuff", "all_heroes", [STRESS(6)]),
}, [{"use": "lunge", "if": "round==1"}, {"use": "howl", "every": 4, "offset": 2}, {"use": "maul"}], "Its skin is cooling rock. Its insides are not.", {"fire": "immune", "frost": "weak"})
foe(W_, "obsidian_maiden", "Obsidian Shieldmaiden", 46, 4, "foe", {
    "cut": I("Glass Edge", "attack", "front", [D(10), ST("bleed", 2)]),
    "wall": I("Shield Wall", "defend", "all_allies", [B(8)]),
    "bash": I("Shield Bash", "attack", "front", [D(6), PUSH(1)]),
}, [{"use": "wall", "if": "ally_hurt", "not_twice": True}, {"use": "bash", "every": 3}, {"use": "cut"}], "Her armour is the volcano's glass. It cuts her as often as it cuts you.", {"physical": "resist", "fire": "resist"})
foe(W_, "steam_wraith", "Steam Wraith", 26, 0, "foe", {
    "scald": I("Scalding Touch", "attack", "front", [D(6), A("fire", 2, attr="stable")]),
    "chill": I("Breath of the Deep Ice", "debuff", "all_heroes", [A("frost", 1, attr="stable"), STRESS(4)]),
    "fade": I("Dissipate", "defend", "self", [me("dodge", 2)]),
}, [{"use": "fade", "if": "hp_pct<50", "not_twice": True}, {"use": "chill", "every": 2}, {"use": "scald"}], "What rises when fire meets ice. It remembers being a man.", {"physical": "resist", "fire": "resist", "frost": "resist", "lightning": "weak"})
foe(W_, "fissure_worm", "Fissure Worm", 40, 1, "foe", {
    "burst": I("Burst from the Ice", "attack", "back", [D(11)]),
    "gnaw": I("Gnaw", "attack", "front", [D(4, times=2), ST("bleed", 1)]),
    "burrow": I("Burrow", "defend", "self", [B(10), me("dodge", 1)]),
}, [{"use": "burst", "if": "round==1"}, {"use": "burrow", "every": 3, "offset": 2}, {"use": "gnaw"}], "It swims through glacier like water. The ice closes behind it.", {"frost": "resist"})
foe(W_, "jotun_thane", "Jötun Thane", 110, 3, "elite", {
    "maul": I("Glacier Maul", "attack", "front", [D(18)]),
    "quake": I("Quake", "attack", "all_heroes", [D(7), A("frost", 1, attr="stable")]),
    "roar": I("Roar of the Thane", "debuff", "all_heroes", [STRESS(10)]),
    "brace": I("Brace", "defend", "self", [B(14), me("might", 1)]),
}, [{"use": "brace", "if": "hp_pct<50", "not_twice": True}, {"use": "quake", "every": 3}, {"use": "roar", "every": 4, "offset": 2}, {"use": "maul"}], "A giant of the old ice. The fire in the deep has driven him mad with heat.", {"frost": "immune", "fire": "weak", "physical": "resist"})
foe(W_, "twin_seeress", "Twinflame Seeress", 76, 0, "elite", {
    "flame": I("Flame Half", "attack", "back", [D(6), A("fire", 3, attr="stable")]),
    "rime": I("Rime Half", "attack", "front", [D(6), A("frost", 3, attr="stable")]),
    "shock": I("Thermal Prophecy", "attack", "all_heroes", [A("fire", 1, attr="volatile"), A("frost", 1, attr="volatile")]),
    "ward": I("Two Faces", "heal", "ally_lowest", [H(14)]),
}, [{"use": "ward", "if": "ally_hurt75", "not_twice": True}, {"use": "shock", "every": 3}, {"use": "rime", "every": 2}, {"use": "flame"}], "One face burns. The other has frozen solid. Both speak at once.", {"fire": "resist", "frost": "resist", "void": "weak"})
foe(W_, "riven_jarl", "The Riven Jarl", 250, 4, "boss", {
    "cleave": I("Riven Cleave", "attack", "front", [D(22)]),
    "fissure": I("Open the Fissure", "attack", "all_heroes", [D(9), A("fire", 2, attr="stable")]),
    "hoarfrost": I("Hoarfrost Crown", "debuff", "all_heroes", [A("frost", 2, attr="stable"), STRESS(10)]),
    "shatter": I("Shatter", "attack", "back", [D(14), ST("vulnerable", 1)]),
    "temper": I("Temper", "defend", "self", [B(20), me("might", 2)]),
}, [{"use": "temper", "if": "hp_pct<40", "not_twice": True}, {"use": "hoarfrost", "every": 3}, {"use": "fissure", "every": 3, "offset": 1}, {"use": "cleave"}],
    "Half his body froze in the fall, half burned. He rules the split between.", {"fire": "resist", "frost": "resist", "physical": "resist"},
    [{"at": 60, "text": "The Jarl's frozen half cracks away. Fire pours out.", "ai": [{"use": "fissure", "every": 2}, {"use": "shatter", "every": 3}, {"use": "cleave"}], "might": 2},
     {"at": 25, "text": "The Jarl burns and freezes at once.", "ai": [{"use": "hoarfrost", "every": 2}, {"use": "fissure"}], "might": 2}])
room(W_, "The Cracked Floe", "Thralls hacking at the ice. Something moves beneath it.", ["rime_thrall", "fissure_worm"], "rime_glacier", "foe")
room(W_, "Vent Hounds", "The hounds nest where the magma breathes.", ["magma_hound", "magma_hound", "rime_thrall"], "rime_crevasse", "foe")
room(W_, "The Glass Gate", "A shieldmaiden holds the hall. The steam behind her is watching.", ["obsidian_maiden", "steam_wraith"], "rime_hall", "foe")
room(W_, "Steam and Stone", "Rising heat, falling ice.", ["steam_wraith", "rime_thrall", "fissure_worm"], "rime_crevasse", "foe")
room(W_, "The Thane's Hall", "A giant at the hearth, and his shieldmaiden.", ["obsidian_maiden", "jotun_thane"], "rime_hall", "elite")
room(W_, "Two-Faced Oracle", "She speaks in fire and frost.", ["magma_hound", "twin_seeress"], "rime_glacier", "elite")
room(W_, "The Riven Jarl", "Boss. The lord of the split glacier.", ["obsidian_maiden", "riven_jarl"], "rime_hall", "boss")

# ================================================================== FIRE + LIGHTNING: PLASMA
W_ = "foundry"
world(W_, "The Storm Foundry", ["fire", "lightning"], "Plasma", "A forge built inside a thunderhead. The smiths hammer lightning into bronze and do not stop to eat or sleep.", ["foundry_floor", "foundry_roof", "foundry_mould"])
foe(W_, "slag_slave", "Slag Slave", 34, 0, "foe", {
    "hammer": I("Forge Hammer", "attack", "front", [D(10)]),
    "slag": I("Throw Slag", "attack", "back", [D(5), A("fire", 2, attr="stable")]),
}, [{"use": "slag", "every": 3}, {"use": "hammer"}], "Chained at the neck to the anvil line. The cage on its head is for its own protection, they say.", {"fire": "resist"})
foe(W_, "bronze_automaton", "Bronze Automaton", 44, 5, "foe", {
    "piston": I("Piston Fist", "attack", "front", [D(11)]),
    "discharge": I("Discharge Core", "attack", "all_heroes", [D(4), A("lightning", 1, attr="stable")]),
    "reset": I("Reset", "defend", "self", [B(12)]),
}, [{"use": "reset", "if": "hp_pct<40", "not_twice": True}, {"use": "discharge", "every": 3}, {"use": "piston"}], "Wound by hand, powered by storm. It does not tire, and it does not stop.", {"physical": "resist", "lightning": "immune", "water": "weak"})
foe(W_, "arc_smith", "Arc-Smith", 38, 2, "foe", {
    "strike": I("Charged Strike", "attack", "front", [D(8), A("lightning", 2, attr="stable")]),
    "temper": I("Temper the Line", "buff", "all_allies", [ST("might", 1)]),
    "arc": I("Arc Weld", "attack", "back", [D(6), A("fire", 1, attr="volatile")]),
}, [{"use": "temper", "every": 3}, {"use": "arc", "every": 3, "offset": 1}, {"use": "strike"}], "It welds with its hammer. It welds with you, too.", {"lightning": "resist", "fire": "resist"})
foe(W_, "bellows_imp", "Bellows Imp", 24, 0, "foe", {
    "peck": I("Peck", "attack", "back", [D(5, times=2)]),
    "fan": I("Fan the Flames", "debuff", "all_heroes", [A("fire", 1, attr="stable")]),
    "flit": I("Flit", "defend", "self", [me("dodge", 1)]),
}, [{"use": "flit", "if": "hp_pct<50", "not_twice": True}, {"use": "fan", "every": 2}, {"use": "peck"}], "Small, winged and full of hot air. They keep the forges breathing.", {"fire": "immune", "physical": "weak"})
foe(W_, "spark_swarm", "Spark Swarm", 22, 0, "foe", {
    "sting": I("Sting of Sparks", "attack", "front", [D(2, times=3)]),
    "storm": I("Spark Storm", "attack", "all_heroes", [A("lightning", 1, attr="stable"), A("fire", 1, attr="stable")]),
}, [{"use": "storm", "every": 2}, {"use": "sting"}], "Struck from the anvil and never cooled.", {"physical": "resist", "water": "weak"})
foe(W_, "cyclops_smith", "Cyclops Smith", 120, 2, "elite", {
    "hammer": I("Anvil Blow", "attack", "front", [D(20)]),
    "brand": I("Brand", "attack", "back", [D(8), A("fire", 3, attr="stable"), ST("mark", 1)]),
    "bellow": I("Bellow", "debuff", "all_heroes", [STRESS(10)]),
    "quench": I("Quench", "defend", "self", [B(16), me("might", 1)]),
}, [{"use": "quench", "if": "hp_pct<50", "not_twice": True}, {"use": "brand", "every": 3}, {"use": "bellow", "every": 4, "offset": 2}, {"use": "hammer"}], "The master smith. It has one eye and it is never off the work.", {"fire": "resist", "physical": "resist"})
foe(W_, "talos_sentinel", "Talos Sentinel", 96, 6, "elite", {
    "stomp": I("Stomp", "attack", "all_heroes", [D(8)]),
    "grip": I("Bronze Grip", "attack", "front", [D(12), ST("anchor", 1)]),
    "ichor": I("Ichor Vein", "attack", "back", [D(6), A("fire", 2, attr="stable"), A("lightning", 2, attr="stable")]),
}, [{"use": "ichor", "every": 3}, {"use": "stomp", "every": 3, "offset": 1}, {"use": "grip"}], "A guardian of hollow bronze, filled with molten ichor. One vein in the heel holds it all.", {"physical": "resist", "lightning": "resist", "water": "weak"})
foe(W_, "anvil_titan", "The Anvil Titan", 270, 6, "boss", {
    "forge": I("Forge Blow", "attack", "front", [D(24)]),
    "plasma": I("Plasma Furnace", "attack", "all_heroes", [D(8), A("fire", 1, attr="volatile"), A("lightning", 1, attr="stable")]),
    "thunder": I("Thunderclap", "debuff", "all_heroes", [STRESS(14), A("lightning", 1, attr="stable")]),
    "anvil": I("Become the Anvil", "defend", "self", [B(24), me("fortify", 1)]),
    "rivet": I("Rivet", "attack", "back", [D(12), ST("anchor", 1)]),
}, [{"use": "anvil", "every": 4, "offset": 3}, {"use": "plasma", "every": 3}, {"use": "thunder", "every": 4, "offset": 1}, {"use": "forge"}],
    "The foundry's first work. Its makers built it to strike the anvil forever. It found something softer.", {"physical": "resist", "fire": "resist", "lightning": "resist", "water": "weak"},
    [{"at": 50, "text": "The Titan's core splits. Lightning spills from the seams.", "ai": [{"use": "plasma", "every": 2}, {"use": "rivet", "every": 3}, {"use": "forge"}], "might": 3}])
room(W_, "The Anvil Line", "Slaves at the hammers, sparks everywhere.", ["slag_slave", "spark_swarm", "slag_slave"], "foundry_floor", "foe")
room(W_, "Bronze Watch", "An automaton and the smith who keeps it running.", ["bronze_automaton", "arc_smith"], "foundry_floor", "foe")
room(W_, "The Bellows Roof", "Imps working the great bellows under the storm.", ["bellows_imp", "bellows_imp", "arc_smith"], "foundry_roof", "foe")
room(W_, "The Casting Pit", "Molten bronze and the things that tend it.", ["spark_swarm", "bronze_automaton", "slag_slave"], "foundry_mould", "foe")
room(W_, "The Master Smith", "The cyclops at its great anvil.", ["arc_smith", "cyclops_smith"], "foundry_mould", "elite")
room(W_, "Talos at the Gate", "A bronze giant, with its heel to the wall.", ["bellows_imp", "talos_sentinel"], "foundry_roof", "elite")
room(W_, "The Anvil Titan", "Boss. The foundry's first and worst work.", ["bronze_automaton", "anvil_titan"], "foundry_floor", "boss")

# ================================================================== FIRE + WATER: SCALD
W_ = "baths"
world(W_, "The Boiling Baths", ["fire", "water"], "Scald", "A temple of baths where the nobility came to be cleansed. The water never stopped heating.", ["baths_pool", "baths_furnace", "baths_cistern"])
foe(W_, "scalded_attendant", "Scalded Attendant", 30, 0, "foe", {
    "hook": I("Towel Hook", "attack", "back", [D(6), PULL(1)]),
    "pour": I("Pour", "attack", "front", [D(5), A("water", 1, attr="stable"), A("fire", 1, attr="stable")]),
    "scrub": I("Scrub", "attack", "front", [D(8)]),
}, [{"use": "hook", "every": 3}, {"use": "pour", "every": 2}, {"use": "scrub"}], "It still brings towels. Its skin comes away on them.", {"fire": "resist", "water": "resist"})
foe(W_, "kettle_crab", "Kettle Crab", 36, 4, "foe", {
    "pinch": I("Boiled Pinch", "attack", "front", [D(9)]),
    "vent": I("Vent Steam", "attack", "all_heroes", [A("fire", 1, attr="stable"), A("water", 1, attr="stable")]),
    "shell": I("Hard Shell", "defend", "self", [B(10)]),
}, [{"use": "shell", "if": "hp_pct<50", "not_twice": True}, {"use": "vent", "every": 3}, {"use": "pinch"}], "Cooked alive in the pools and somehow still walking.", {"physical": "resist", "fire": "immune", "frost": "weak"})
foe(W_, "boiled_brute", "Boiled Brute", 48, 0, "foe", {
    "grab": I("Grab", "attack", "front", [D(12)]),
    "dunk": I("Dunk", "attack", "front", [D(7), A("water", 3, attr="stable"), STRESS(4)]),
}, [{"use": "dunk", "every": 3}, {"use": "grab"}], "A bath guard who stayed in the water too long. He is very soft now, and very strong.", {"water": "resist", "physical": "weak"})
foe(W_, "steam_nymph", "Steam Nymph", 28, 0, "foe", {
    "veil": I("Veil of Steam", "buff", "all_allies", [ST("dodge", 1)]),
    "kiss": I("Scalding Kiss", "attack", "back", [D(6), A("fire", 2, attr="stable")]),
    "sigh": I("Sigh", "debuff", "all_heroes", [STRESS(8)]),
}, [{"use": "veil", "every": 3}, {"use": "sigh", "every": 3, "offset": 1}, {"use": "kiss"}], "It drifts over the pools and sings to the drowned.", {"physical": "resist", "fire": "resist", "lightning": "weak"})
foe(W_, "bath_leech", "Bath Leech", 26, 0, "foe", {
    "latch": I("Latch", "attack", "front", [D(4, lifesteal=100), ST("bleed", 2)]),
    "drain": I("Drain", "attack", "back", [D(3, times=2, lifesteal=100)]),
}, [{"use": "drain", "every": 2}, {"use": "latch"}], "Grown fat on the bathers.", {"water": "resist", "fire": "weak"})
foe(W_, "bath_mistress", "The Bath-Mistress", 82, 0, "elite", {
    "censer": I("Scalding Censer", "attack", "all_heroes", [D(5), A("fire", 2, attr="stable")]),
    "baptism": I("Baptism", "attack", "front", [D(8), A("water", 2, attr="volatile")]),
    "attend": I("Attend", "heal", "ally_lowest", [H(16)]),
    "scold": I("Scold", "debuff", "back", [STRESS(12), ST("mark", 1)]),
}, [{"use": "attend", "if": "ally_hurt75", "not_twice": True}, {"use": "censer", "every": 3}, {"use": "scold", "every": 3, "offset": 1}, {"use": "baptism"}], "She keeps the water hot and the guests clean.", {"fire": "resist", "water": "resist", "toxin": "weak"})
foe(W_, "cauldron_bearer", "Cauldron Bearer", 118, 2, "elite", {
    "tip": I("Tip the Cauldron", "attack", "all_heroes", [D(8), A("water", 1, attr="stable"), A("fire", 1, attr="stable")]),
    "mace": I("Ladle", "attack", "front", [D(18)]),
    "stoke": I("Stoke", "buff", "self", [me("might", 2), B(8)]),
}, [{"use": "stoke", "every": 4, "offset": 3}, {"use": "tip", "every": 3}, {"use": "mace"}], "It carries the boiling water from the furnace to the pools. It carries other things, too.", {"fire": "resist", "physical": "resist"})
foe(W_, "simmering_matron", "The Simmering Matron", 240, 2, "boss", {
    "boil": I("Bring to the Boil", "attack", "all_heroes", [D(8), A("fire", 2, attr="stable")]),
    "reap": I("Reaping Ladle", "attack", "front", [D(20), ST("bleed", 3)]),
    "steep": I("Steep", "debuff", "all_heroes", [A("water", 2, attr="stable"), STRESS(12)]),
    "feast": I("Taste the Broth", "heal", "self", [H(26)]),
    "scald": I("Scald", "attack", "back", [D(10), A("water", 1, attr="volatile"), A("fire", 1, attr="stable")]),
}, [{"use": "feast", "if": "hp_pct<40", "not_twice": True}, {"use": "steep", "every": 3}, {"use": "boil", "every": 3, "offset": 1}, {"use": "reap"}],
    "The matron of the baths. She has been simmering for a hundred years and is nearly ready.", {"fire": "resist", "water": "resist", "frost": "weak"},
    [{"at": 55, "text": "The Matron rises from the pool, skin sloughing in sheets.", "ai": [{"use": "scald", "every": 2}, {"use": "boil", "every": 3}, {"use": "reap"}], "might": 2},
     {"at": 20, "text": "She boils over.", "ai": [{"use": "boil", "every": 2}, {"use": "reap"}], "might": 2}])
room(W_, "The Tepidarium", "Attendants still tending guests who will not leave.", ["scalded_attendant", "scalded_attendant", "bath_leech"], "baths_pool", "foe")
room(W_, "The Hot Pools", "Crabs boiling in the shallows, a brute in the deep end.", ["kettle_crab", "boiled_brute"], "baths_pool", "foe")
room(W_, "The Steam Rooms", "Nymphs in the steam. You hear them before you see them.", ["steam_nymph", "scalded_attendant", "steam_nymph"], "baths_furnace", "foe")
room(W_, "The Drained Cistern", "Leeches in the sludge, and the brute who fed them.", ["bath_leech", "boiled_brute", "bath_leech"], "baths_cistern", "foe")
room(W_, "The Mistress Receives", "The Bath-Mistress and her attendant.", ["scalded_attendant", "bath_mistress"], "baths_pool", "elite")
room(W_, "The Furnace Stair", "The bearer comes up from the furnace.", ["kettle_crab", "cauldron_bearer"], "baths_furnace", "elite")
room(W_, "The Simmering Matron", "Boss. The matron in her great pool.", ["steam_nymph", "simmering_matron"], "baths_pool", "boss")

# ================================================================== FIRE + TOXIN: COMBUST
W_ = "pits"
world(W_, "The Sulphur Pits", ["fire", "toxin"], "Combust", "Brimstone mines where the air itself will burn. The miners stopped breathing long ago.", ["pits_shaft", "pits_vent", "pits_chapel"])
foe(W_, "gas_miner", "Gas-Lung Miner", 34, 1, "foe", {
    "pick": I("Pick", "attack", "front", [D(9)]),
    "cough": I("Cough", "debuff", "all_heroes", [A("toxin", 1, attr="stable")]),
    "lamp": I("Swing the Lamp", "attack", "back", [D(5), A("fire", 2, attr="stable")]),
}, [{"use": "cough", "every": 3}, {"use": "lamp", "every": 3, "offset": 1}, {"use": "pick"}], "Its lungs are full of yellow gas. Keep it away from the lamp.", {"toxin": "resist"})
foe(W_, "brimstone_toad", "Brimstone Toad", 38, 0, "foe", {
    "spit": I("Sulphur Spit", "attack", "back", [D(4), A("toxin", 3, attr="stable")]),
    "tongue": I("Tongue", "attack", "back", [D(6), PULL(2)]),
    "swell": I("Swell", "defend", "self", [B(10), me("thorns", 3)]),
}, [{"use": "swell", "if": "hp_pct<50", "not_twice": True}, {"use": "tongue", "every": 3}, {"use": "spit"}], "Its skin sweats brimstone. Do not lick it.", {"toxin": "immune", "fire": "weak"})
foe(W_, "fuse_imp", "Fuse Imp", 20, 0, "foe", {
    "light": I("Light the Fuse", "attack", "back", [D(4), A("fire", 1, attr="volatile")]),
    "blow": I("Blow Up", "attack", "all_heroes", [D(12), A("fire", 2, attr="stable"), SELFDMG(999)]),
    "scamper": I("Scamper", "defend", "self", [me("dodge", 1)]),
}, [{"use": "blow", "if": "round>=3"}, {"use": "blow", "if": "hp_pct<40"}, {"use": "scamper", "every": 2, "offset": 1}, {"use": "light"}], "It carries a lit torch into a gas mine. On purpose.", {"fire": "immune", "physical": "weak"})
foe(W_, "pit_crawler", "Pit Crawler", 36, 2, "foe", {
    "bite": I("Venom Bite", "attack", "front", [D(6), A("toxin", 2, attr="stable")]),
    "coil": I("Coil", "attack", "front", [D(8), ST("anchor", 1)]),
}, [{"use": "coil", "every": 3}, {"use": "bite"}], "A centipede as long as a mine cart, and much hungrier.", {"toxin": "resist"})
foe(W_, "canary_priest", "Canary Priest", 30, 0, "foe", {
    "censer": I("Yellow Censer", "debuff", "all_heroes", [A("toxin", 2, attr="stable")]),
    "hymn": I("Hymn of the Shaft", "buff", "all_allies", [ST("might", 1)]),
    "bless": I("Bless the Gas", "heal", "ally_lowest", [H(10)]),
}, [{"use": "bless", "if": "ally_hurt", "not_twice": True}, {"use": "hymn", "every": 3}, {"use": "censer"}], "They sing to the gas the way miners once listened to canaries. The gas listens.", {"toxin": "resist", "fire": "weak"})
foe(W_, "powder_ogre", "Powder Ogre", 126, 2, "elite", {
    "smash": I("Smash", "attack", "front", [D(20)]),
    "keg": I("Hurl the Keg", "attack", "all_heroes", [D(8), A("fire", 2, attr="stable")]),
    "gorge": I("Gorge on Sulphur", "heal", "self", [H(18), me("might", 1)]),
}, [{"use": "gorge", "if": "hp_pct<40", "not_twice": True}, {"use": "keg", "every": 3}, {"use": "smash"}], "It eats blasting powder. It burps fire.", {"physical": "resist", "fire": "weak"})
foe(W_, "miasma_matriarch", "Miasma Matriarch", 90, 0, "elite", {
    "breath": I("Choking Breath", "attack", "all_heroes", [D(4), A("toxin", 2, attr="stable")]),
    "gaze": I("Swollen Gaze", "debuff", "back", [STRESS(14), ST("vulnerable", 1)]),
    "spores": I("Spore Bloom", "buff", "all_allies", [ST("regen", 3)]),
}, [{"use": "spores", "every": 3}, {"use": "gaze", "every": 3, "offset": 1}, {"use": "breath"}], "A head swollen with gas, drifting through the galleries.", {"toxin": "immune", "physical": "resist", "fire": "weak"})
foe(W_, "burning_lung", "The Burning Lung", 260, 2, "boss", {
    "exhale": I("Exhale", "attack", "all_heroes", [D(7), A("toxin", 2, attr="stable")]),
    "ignite": I("Ignite", "attack", "all_heroes", [A("fire", 2, attr="volatile")]),
    "crush": I("Crushing Bulk", "attack", "front", [D(22)]),
    "swallow": I("Swallow", "attack", "back", [D(14), PULL(3), STRESS(8)]),
    "inhale": I("Inhale", "defend", "self", [B(18), H(12)]),
}, [{"use": "inhale", "if": "hp_pct<50", "not_twice": True}, {"use": "ignite", "every": 3, "offset": 2}, {"use": "exhale", "every": 3}, {"use": "crush"}],
    "The mine's first breath, grown into a toad the size of a chapel. Every breath it takes is fire.", {"toxin": "immune", "fire": "resist", "frost": "weak"},
    [{"at": 50, "text": "The Lung's skin splits. The gas inside catches.", "ai": [{"use": "ignite", "every": 2}, {"use": "swallow", "every": 3}, {"use": "crush"}], "might": 2}])
room(W_, "The Upper Gallery", "Miners still working the seam.", ["gas_miner", "gas_miner", "pit_crawler"], "pits_shaft", "foe")
room(W_, "Toad Pool", "Toads in the sulphur, and an imp with a torch.", ["brimstone_toad", "fuse_imp"], "pits_vent", "foe")
room(W_, "The Canary Chapel", "The priests sing to the gas.", ["canary_priest", "gas_miner", "fuse_imp"], "pits_chapel", "foe")
room(W_, "The Deep Seam", "Crawlers in the dark, toads in the vents.", ["pit_crawler", "brimstone_toad", "pit_crawler"], "pits_vent", "foe")
room(W_, "The Powder Store", "An ogre among the kegs.", ["fuse_imp", "powder_ogre"], "pits_shaft", "elite")
room(W_, "The Choking Chapel", "The matriarch hangs over the altar.", ["canary_priest", "miasma_matriarch"], "pits_chapel", "elite")
room(W_, "The Burning Lung", "Boss. The mine breathes.", ["gas_miner", "burning_lung"], "pits_vent", "boss")

# ================================================================== FIRE + VOID: HOLLOW FLAME
W_ = "pyre"
world(W_, "The Black Pyre", ["fire", "void"], "Hollow Flame", "A cathedral where the saints were burned and refused to finish. The fire here is black and gives no light.", ["pyre_nave", "pyre_stake", "pyre_crypt"])
foe(W_, "ash_penitent", "Ash Penitent", 30, 0, "foe", {
    "flail": I("Chain Flail", "attack", "front", [D(4, times=2)]),
    "penance": I("Penance", "debuff", "back", [STRESS(8), A("void", 1, attr="stable")]),
}, [{"use": "penance", "every": 3}, {"use": "flail"}], "It whips itself with the chain between swings at you. It does not notice the difference.", {"fire": "resist"})
foe(W_, "cinder_hound", "Cinder Hound", 30, 0, "foe", {
    "maul": I("Black Maul", "attack", "front", [D(7), A("fire", 1, attr="stable")]),
    "hunt": I("Hunt the Weak", "attack", "back", [D(9)]),
}, [{"use": "hunt", "if": "hero_dd"}, {"use": "hunt", "every": 3}, {"use": "maul"}], "It runs on ash and smells the dying.", {"fire": "resist", "void": "resist", "water": "weak"})
foe(W_, "censer_deacon", "Censer Deacon", 34, 1, "foe", {
    "smoke": I("Black Smoke", "debuff", "all_heroes", [A("void", 1, attr="stable"), STRESS(4)]),
    "swing": I("Censer Swing", "attack", "front", [D(7), A("fire", 1, attr="stable")]),
    "rite": I("Last Rite", "heal", "ally_lowest", [H(12)]),
}, [{"use": "rite", "if": "ally_hurt", "not_twice": True}, {"use": "smoke", "every": 2}, {"use": "swing"}], "Its censer burns something that was once a saint.", {"void": "resist", "fire": "resist", "lightning": "weak"})
foe(W_, "candle_wraith", "Candle Wraith", 22, 0, "foe", {
    "gutter": I("Gutter", "attack", "back", [D(4), A("fire", 1, attr="volatile")]),
    "hollow": I("Hollow Glow", "debuff", "all_heroes", [A("void", 1, attr="stable")]),
}, [{"use": "hollow", "every": 2}, {"use": "gutter"}], "A skull in a black flame. Blow it out and it lights again.", {"physical": "resist", "fire": "immune", "water": "weak"})
foe(W_, "pyre_knight", "Pyre Knight", 50, 4, "foe", {
    "axe": I("Executioner's Axe", "attack", "front", [D(13)]),
    "brand": I("Brand the Heretic", "attack", "front", [D(6), ST("mark", 1), A("fire", 2, attr="stable")]),
    "guard": I("Guard the Pyre", "defend", "all_allies", [B(6)]),
}, [{"use": "guard", "if": "ally_hurt", "not_twice": True}, {"use": "brand", "every": 3}, {"use": "axe"}], "He lit the pyre. He stands guard so it is never put out.", {"physical": "resist", "fire": "resist"})
foe(W_, "unburnt_inquisitor", "The Unburnt Inquisitor", 88, 1, "elite", {
    "accuse": I("Accuse", "debuff", "back", [STRESS(14), ST("mark", 1)]),
    "torch": I("To the Stake", "attack", "back", [D(10), A("fire", 3, attr="stable")]),
    "verdict": I("Verdict", "attack", "front", [D(16), A("void", 1, attr="volatile")]),
    "absolve": I("Absolve", "heal", "all_allies", [H(8)]),
}, [{"use": "absolve", "if": "ally_hurt75", "not_twice": True}, {"use": "accuse", "every": 3}, {"use": "torch", "every": 3, "offset": 1}, {"use": "verdict"}], "He burned a thousand saints and never caught alight himself. He wonders why.", {"fire": "immune", "void": "weak"})
foe(W_, "pyre_seraph", "Pyre Seraph", 84, 0, "elite", {
    "spear": I("Spear of Black Flame", "attack", "front", [D(12), A("void", 2, attr="stable")]),
    "wings": I("Ash Wings", "attack", "all_heroes", [D(5), A("fire", 1, attr="stable")]),
    "rise": I("Rise", "defend", "self", [me("dodge", 2), B(8)]),
}, [{"use": "rise", "if": "hp_pct<50", "not_twice": True}, {"use": "wings", "every": 3}, {"use": "spear"}], "An angel sent to put out the pyre. It went in to look.", {"fire": "resist", "void": "resist", "physical": "resist", "lightning": "weak"})
foe(W_, "saint_unending", "The Saint Unending", 250, 2, "boss", {
    "pyre": I("Pyre of the Faithful", "attack", "all_heroes", [D(8), A("fire", 2, attr="stable")]),
    "hollow": I("Hollow Flame", "attack", "front", [D(14), A("fire", 1, attr="volatile"), A("void", 1, attr="stable")]),
    "martyr": I("Martyr's Gaze", "debuff", "all_heroes", [STRESS(16)]),
    "chains": I("Chains of Devotion", "attack", "back", [D(10), ST("anchor", 1), PULL(2)]),
    "burn": I("Burn Brighter", "buff", "self", [me("might", 2), H(16)]),
}, [{"use": "burn", "if": "hp_pct<45", "not_twice": True}, {"use": "martyr", "every": 3}, {"use": "pyre", "every": 3, "offset": 1}, {"use": "hollow"}],
    "She was burned for heresy. She has been burning for nine hundred years, and she has not stopped praying.", {"fire": "immune", "void": "resist", "water": "weak"},
    [{"at": 60, "text": "The Saint's flame turns black.", "ai": [{"use": "hollow", "every": 2}, {"use": "chains", "every": 3}, {"use": "pyre"}], "might": 1},
     {"at": 25, "text": "Nothing is left of her but the fire.", "ai": [{"use": "pyre", "every": 2}, {"use": "hollow"}], "might": 3}])
room(W_, "The Penitents' Walk", "They flog themselves down the nave.", ["ash_penitent", "ash_penitent", "censer_deacon"], "pyre_nave", "foe")
room(W_, "The Stake Field", "Hounds sniff the ashes of the burned.", ["cinder_hound", "cinder_hound", "ash_penitent"], "pyre_stake", "foe")
room(W_, "Candle Crypt", "A knight keeps the candles burning.", ["candle_wraith", "pyre_knight", "candle_wraith"], "pyre_crypt", "foe")
room(W_, "The Black Choir", "The deacon swings its censer; the knight keeps time.", ["pyre_knight", "censer_deacon"], "pyre_nave", "foe")
room(W_, "The Tribunal", "The inquisitor reads your names aloud.", ["pyre_knight", "unburnt_inquisitor"], "pyre_crypt", "elite")
room(W_, "The Fallen Seraph", "It came to put out the fire.", ["candle_wraith", "pyre_seraph"], "pyre_stake", "elite")
room(W_, "The Saint Unending", "Boss. She is still burning.", ["censer_deacon", "saint_unending"], "pyre_nave", "boss")

# ================================================================== FROST + LIGHTNING: LOCKDOWN
W_ = "spire"
world(W_, "The Stilled Spire", ["frost", "lightning"], "Lockdown", "An observatory where the astronomers tried to stop time. They succeeded, mostly. The clocks still tick inside the ice.", ["spire_orrery", "spire_stair", "spire_top"])
foe(W_, "stopped_pilgrim", "Stopped Pilgrim", 30, 0, "foe", {
    "staff": I("Frozen Staff", "attack", "front", [D(8)]),
    "stillness": I("Stillness", "debuff", "back", [A("frost", 2, attr="stable"), STRESS(4)]),
}, [{"use": "stillness", "every": 2}, {"use": "staff"}], "It came to see the stars stop. It has not blinked since.", {"frost": "resist", "fire": "weak"})
foe(W_, "clock_sentry", "Clock Sentry", 42, 5, "foe", {
    "tick": I("Tick", "attack", "front", [D(6)]),
    "tock": I("Tock", "attack", "front", [D(12)]),
    "wind": I("Wind Down", "defend", "self", [B(12)]),
}, [{"use": "wind", "if": "hp_pct<40", "not_twice": True}, {"use": "tock", "every": 2, "offset": 1}, {"use": "tick"}], "Tick, then tock. Always in that order. Plan for it.", {"physical": "resist", "lightning": "resist", "water": "weak"})
foe(W_, "gear_spider", "Gear Spider", 28, 2, "foe", {
    "bite": I("Static Bite", "attack", "back", [D(5), A("lightning", 2, attr="stable")]),
    "web": I("Copper Web", "attack", "front", [D(3), ST("anchor", 1)]),
}, [{"use": "web", "every": 3}, {"use": "bite"}], "It repairs the orrery. It considers you a fault.", {"lightning": "immune", "water": "weak"})
foe(W_, "aurora_moth", "Aurora Moth", 24, 0, "foe", {
    "dust": I("Aurora Dust", "debuff", "all_heroes", [A("lightning", 1, attr="stable"), A("frost", 1, attr="stable")]),
    "flutter": I("Flutter", "defend", "self", [me("dodge", 1)]),
    "dazzle": I("Dazzle", "debuff", "front", [STRESS(8)]),
}, [{"use": "flutter", "if": "hp_pct<50", "not_twice": True}, {"use": "dust", "every": 2}, {"use": "dazzle"}], "Drawn to the frozen stars. Its wings carry the northern lights.", {"physical": "weak", "frost": "resist"})
foe(W_, "frozen_halberdier", "Frozen Halberdier", 44, 3, "foe", {
    "thrust": I("Halberd Thrust", "attack", "back", [D(9)]),
    "hook": I("Hook and Haul", "attack", "back", [D(5), PULL(1)]),
    "brace": I("Brace", "defend", "all_allies", [B(6)]),
}, [{"use": "brace", "if": "ally_hurt", "not_twice": True}, {"use": "hook", "every": 3}, {"use": "thrust"}], "A guard frozen mid-patrol. It finishes the patrol now.", {"frost": "resist", "physical": "resist", "fire": "weak"})
foe(W_, "horologist", "The Horologist", 80, 0, "elite", {
    "stop": I("Stop the Hour", "debuff", "front", [A("frost", 2, attr="stable"), A("lightning", 1, attr="volatile")]),
    "rewind": I("Rewind", "heal", "all_allies", [H(10)]),
    "spark": I("Escapement Spark", "attack", "back", [D(10), A("lightning", 2, attr="stable")]),
    "chime": I("Chime", "debuff", "all_heroes", [STRESS(10)]),
}, [{"use": "rewind", "if": "ally_hurt75", "not_twice": True}, {"use": "stop", "every": 3}, {"use": "chime", "every": 4, "offset": 2}, {"use": "spark"}], "The last astronomer. He keeps the hours from moving.", {"lightning": "resist", "frost": "resist", "toxin": "weak"})
foe(W_, "rime_colossus", "Rime Colossus", 124, 5, "elite", {
    "slam": I("Glacial Slam", "attack", "front", [D(18)]),
    "freeze": I("Freezing Grip", "attack", "front", [D(8), A("frost", 3, attr="stable")]),
    "shards": I("Shard Storm", "attack", "all_heroes", [D(6)]),
}, [{"use": "freeze", "every": 3}, {"use": "shards", "every": 3, "offset": 1}, {"use": "slam"}], "An ice statue of the founder. Someone wound it up.", {"frost": "immune", "physical": "resist", "fire": "weak"})
foe(W_, "last_hour", "The Last Hour", 260, 5, "boss", {
    "strike": I("Strike the Hour", "attack", "front", [D(22)]),
    "stop": I("Stop All Clocks", "debuff", "all_heroes", [A("frost", 2, attr="stable"), A("lightning", 1, attr="stable"), STRESS(8)]),
    "toll": I("Midnight", "attack", "all_heroes", [D(10)]),
    "wind": I("Wind the Spring", "defend", "self", [B(20), me("might", 2)]),
    "pendulum": I("Pendulum", "attack", "back", [D(14), PUSH(1)]),
}, [{"use": "wind", "every": 4, "offset": 3}, {"use": "stop", "every": 3}, {"use": "toll", "every": 4, "offset": 1}, {"use": "strike"}],
    "The great clock at the top of the spire. When it strikes twelve, the world stops. It is one minute to.", {"lightning": "resist", "frost": "resist", "physical": "resist", "water": "weak"},
    [{"at": 50, "text": "The Last Hour's hands begin to spin backwards.", "ai": [{"use": "toll", "every": 2}, {"use": "pendulum", "every": 3}, {"use": "strike"}], "might": 2}])
room(W_, "The Observatory Floor", "Pilgrims stand frozen before the orrery.", ["stopped_pilgrim", "stopped_pilgrim", "gear_spider"], "spire_orrery", "foe")
room(W_, "The Clockwork Stair", "Sentries mark time on every landing.", ["clock_sentry", "frozen_halberdier"], "spire_stair", "foe")
room(W_, "Aurora Gallery", "Moths drawn to the frozen stars.", ["aurora_moth", "aurora_moth", "stopped_pilgrim"], "spire_top", "foe")
room(W_, "The Gear Loft", "Spiders mending the works.", ["gear_spider", "clock_sentry", "gear_spider"], "spire_orrery", "foe")
room(W_, "The Horologist's Study", "He has been waiting for you, for ever.", ["frozen_halberdier", "horologist"], "spire_stair", "elite")
room(W_, "The Founder Stands", "Someone wound up the statue.", ["aurora_moth", "rime_colossus"], "spire_top", "elite")
room(W_, "The Last Hour", "Boss. One minute to midnight.", ["clock_sentry", "last_hour"], "spire_top", "boss")

# ================================================================== FROST + WATER: FREEZE
W_ = "fleet"
world(W_, "The Icebound Fleet", ["frost", "water"], "Freeze", "A war fleet frozen into a white sea, mid-battle. The crews are still at their posts.", ["fleet_deck", "fleet_hold", "fleet_ice"])
foe(W_, "frozen_whaler", "Frozen Whaler", 34, 1, "foe", {
    "harpoon": I("Harpoon", "attack", "back", [D(8), PULL(1)]),
    "flense": I("Flense", "attack", "front", [D(6), ST("bleed", 3)]),
}, [{"use": "harpoon", "every": 2}, {"use": "flense"}], "It still hunts whales. Anything large and slow will do.", {"frost": "resist", "fire": "weak"})
foe(W_, "rime_gulls", "Rime Gulls", 22, 0, "foe", {
    "peck": I("Peck the Eyes", "attack", "back", [D(2, times=3)]),
    "mob": I("Mob", "debuff", "front", [STRESS(6), ST("vulnerable", 1)]),
}, [{"use": "mob", "every": 3}, {"use": "peck"}], "They followed the fleet out and froze with it. They thawed first.", {"physical": "weak", "frost": "resist"})
foe(W_, "ice_eel", "Ice Eel", 30, 0, "foe", {
    "bite": I("Frostbite", "attack", "front", [D(6), A("frost", 2, attr="stable")]),
    "dive": I("Dive Under the Ice", "defend", "self", [me("dodge", 2)]),
    "wrap": I("Wrap", "attack", "front", [D(4), A("water", 2, attr="stable")]),
}, [{"use": "dive", "if": "hp_pct<50", "not_twice": True}, {"use": "wrap", "every": 2}, {"use": "bite"}], "It hunts through holes in the ice.", {"frost": "resist", "water": "resist", "lightning": "weak"})
foe(W_, "deck_hand", "Drowned Deckhand", 36, 0, "foe", {
    "axe": I("Boarding Axe", "attack", "front", [D(11)]),
    "shanty": I("Shanty", "buff", "all_allies", [ST("might", 1)]),
}, [{"use": "shanty", "every": 3}, {"use": "axe"}], "Still ready to board. Still singing.", {"water": "resist"})
foe(W_, "walrus_brute", "Walrus Brute", 52, 2, "foe", {
    "tusk": I("Tusk", "attack", "front", [D(12)]),
    "crush": I("Belly Crush", "attack", "front", [D(7), ST("stun", 1)]),
    "blubber": I("Blubber", "defend", "self", [B(14)]),
}, [{"use": "blubber", "if": "hp_pct<50", "not_twice": True}, {"use": "crush", "every": 4, "offset": 2}, {"use": "tusk"}], "It hauled out on the ice beside the ships and never left.", {"frost": "immune", "physical": "resist", "fire": "weak"})
foe(W_, "icewed_captain", "The Ice-Wed Captain", 100, 3, "elite", {
    "sabre": I("Sabre", "attack", "front", [D(14)]),
    "order": I("All Hands", "buff", "all_allies", [ST("might", 2)]),
    "lantern": I("Drowned Lantern", "debuff", "all_heroes", [A("water", 2, attr="stable"), STRESS(6)]),
    "keelhaul": I("Keelhaul", "attack", "back", [D(8), PULL(2), A("frost", 2, attr="stable")]),
}, [{"use": "order", "every": 4, "offset": 1}, {"use": "keelhaul", "every": 3}, {"use": "lantern", "every": 4, "offset": 3}, {"use": "sabre"}], "Married to the sea, and the sea froze at the wedding.", {"frost": "resist", "water": "resist", "lightning": "weak"})
foe(W_, "frost_selkie", "Frost Selkie", 78, 0, "elite", {
    "claw": I("Raking Claws", "attack", "front", [D(6, times=2), ST("bleed", 2)]),
    "song": I("Sealskin Song", "debuff", "all_heroes", [STRESS(12)]),
    "slip": I("Slip the Skin", "defend", "self", [me("dodge", 2), H(10)]),
}, [{"use": "slip", "if": "hp_pct<50", "not_twice": True}, {"use": "song", "every": 3}, {"use": "claw"}], "She lost her skin to a sailor. She took his in return.", {"water": "immune", "frost": "resist", "lightning": "weak"})
foe(W_, "leviathan_ice", "The Leviathan in the Ice", 280, 3, "boss", {
    "breach": I("Breach", "attack", "all_heroes", [D(10), A("water", 2, attr="stable")]),
    "swallow": I("Swallow Whole", "attack", "front", [D(24), STRESS(8)]),
    "freeze": I("White Breath", "debuff", "all_heroes", [A("frost", 2, attr="stable"), A("water", 1, attr="volatile")]),
    "thrash": I("Thrash", "attack", "back", [D(12), PUSH(1)]),
    "sound": I("Sound the Depths", "defend", "self", [B(22), me("regen", 6)]),
}, [{"use": "sound", "if": "hp_pct<45", "not_twice": True}, {"use": "freeze", "every": 3}, {"use": "breach", "every": 3, "offset": 1}, {"use": "swallow"}],
    "The fleet sailed to kill it. It froze the sea around them all.", {"frost": "immune", "water": "resist", "lightning": "weak"},
    [{"at": 55, "text": "The ice cracks. The Leviathan rises out of the sea.", "ai": [{"use": "breach", "every": 2}, {"use": "thrash", "every": 3}, {"use": "swallow"}], "might": 2},
     {"at": 20, "text": "It drags the whole fleet down with it.", "ai": [{"use": "freeze", "every": 2}, {"use": "swallow"}], "might": 2}])
room(W_, "The Frozen Deck", "Whalers at their stations, frozen to the rails.", ["frozen_whaler", "deck_hand", "frozen_whaler"], "fleet_deck", "foe")
room(W_, "Gull Rookery", "The gulls have the rigging.", ["rime_gulls", "rime_gulls", "deck_hand"], "fleet_deck", "foe")
room(W_, "The Ice Holes", "Eels under the ice, a walrus on top.", ["ice_eel", "walrus_brute"], "fleet_ice", "foe")
room(W_, "The Orlop Deck", "Down in the hold, the crew is still at work.", ["deck_hand", "ice_eel", "frozen_whaler"], "fleet_hold", "foe")
room(W_, "The Captain's Cabin", "The captain and his wife, the sea.", ["deck_hand", "icewed_captain"], "fleet_hold", "elite")
room(W_, "The Selkie's Floe", "She is singing on the ice.", ["rime_gulls", "frost_selkie"], "fleet_ice", "elite")
room(W_, "The Leviathan in the Ice", "Boss. The sea itself is frozen around it.", ["frozen_whaler", "leviathan_ice"], "fleet_ice", "boss")

# ================================================================== FROST + TOXIN: CRYO-ROT
W_ = "barrow"
world(W_, "The Hollow Barrow", ["frost", "toxin"], "Cryo-rot", "Burial mounds of a plague-struck kingdom, kept fresh by the cold. The dead are not rotten. They are preserved, plague and all.", ["barrow_mound", "barrow_tomb", "barrow_hall"])
foe(W_, "barrow_draugr", "Barrow Draugr", 40, 2, "foe", {
    "axe": I("Grave Axe", "attack", "front", [D(11)]),
    "grip": I("Cold Grip", "attack", "front", [D(6), A("frost", 2, attr="stable")]),
}, [{"use": "grip", "every": 3}, {"use": "axe"}], "Buried with its axe so it could keep fighting. It does.", {"frost": "resist", "toxin": "resist", "fire": "weak"})
foe(W_, "plague_wolf", "Plague Wolf", 30, 0, "foe", {
    "bite": I("Plague Bite", "attack", "front", [D(6), A("toxin", 2, attr="stable")]),
    "pack": I("Pack Hunt", "attack", "back", [D(8)]),
    "howl": I("Howl", "debuff", "all_heroes", [STRESS(6)]),
}, [{"use": "howl", "every": 4, "offset": 3}, {"use": "pack", "every": 2}, {"use": "bite"}], "The barrow wolves carry the old plague in their teeth.", {"toxin": "resist", "frost": "resist", "fire": "weak"})
foe(W_, "frostbit_leper", "Frostbitten Leper", 28, 0, "foe", {
    "bell": I("Leper's Bell", "debuff", "all_heroes", [STRESS(8)]),
    "touch": I("Unclean Touch", "attack", "front", [D(5), A("toxin", 2, attr="stable"), A("frost", 1, attr="stable")]),
}, [{"use": "bell", "every": 2}, {"use": "touch"}], "It rings its bell to warn you. You should have listened.", {"toxin": "immune", "fire": "weak"})
foe(W_, "mold_wight", "Mould Wight", 30, 0, "foe", {
    "claw": I("Mouldy Claw", "attack", "back", [D(7), A("toxin", 1, attr="stable")]),
    "spores": I("Spore Shroud", "buff", "all_allies", [ST("regen", 2)]),
    "chill": I("Grave Chill", "debuff", "front", [A("frost", 3, attr="stable")]),
}, [{"use": "spores", "every": 3}, {"use": "chill", "every": 3, "offset": 1}, {"use": "claw"}], "The mould grew a shape in the dark, and the shape grew hungry.", {"physical": "resist", "toxin": "immune", "fire": "weak"})
foe(W_, "grave_worm", "Grave Worm", 36, 0, "foe", {
    "burrow": I("Burrow Up", "attack", "back", [D(10)]),
    "feed": I("Feed", "attack", "front", [D(5, lifesteal=100), A("toxin", 1, attr="stable")]),
}, [{"use": "burrow", "if": "round==1"}, {"use": "burrow", "every": 4}, {"use": "feed"}], "It eats the dead. It has eaten so many that it has started to look like them.", {"toxin": "resist"})
foe(W_, "barrow_thane", "Barrow Thane", 110, 4, "elite", {
    "blade": I("Grave Blade", "attack", "front", [D(16)]),
    "oath": I("Oath of the Barrow", "buff", "all_allies", [ST("might", 1), B(6)]),
    "rot": I("Rotting Cut", "attack", "front", [D(8), A("toxin", 2, attr="stable"), A("frost", 2, attr="stable")]),
}, [{"use": "oath", "every": 3}, {"use": "rot", "every": 3, "offset": 1}, {"use": "blade"}], "A lord buried with his household. He still keeps them in line.", {"frost": "resist", "toxin": "resist", "physical": "resist", "fire": "weak"})
foe(W_, "rot_witch", "Rot Witch", 74, 0, "elite", {
    "hex": I("Rot Hex", "debuff", "back", [A("toxin", 3, attr="stable"), ST("hex", 2)]),
    "frost": I("Frost Nail", "attack", "front", [D(8), A("frost", 2, attr="stable")]),
    "raise": I("Raise the Dead", "heal", "all_allies", [H(10)]),
    "curse": I("Wasting Curse", "debuff", "all_heroes", [STRESS(10), A("toxin", 1, attr="volatile")]),
}, [{"use": "raise", "if": "ally_hurt75", "not_twice": True}, {"use": "curse", "every": 3}, {"use": "hex", "every": 3, "offset": 1}, {"use": "frost"}], "She keeps the barrow's dead from rotting, and their plague from dying.", {"toxin": "immune", "frost": "resist", "fire": "weak"})
foe(W_, "barrow_king", "The Barrow King", 260, 4, "boss", {
    "axe": I("Royal Axe", "attack", "front", [D(22)]),
    "plague": I("Plague of Kings", "attack", "all_heroes", [D(6), A("toxin", 2, attr="stable")]),
    "winter": I("Long Winter", "debuff", "all_heroes", [A("frost", 2, attr="stable"), STRESS(12)]),
    "shield": I("Barrow Shield", "defend", "self", [B(20), me("thorns", 4)]),
    "court": I("Summon the Court", "buff", "all_allies", [ST("might", 2), ST("regen", 4)]),
}, [{"use": "shield", "if": "hp_pct<40", "not_twice": True}, {"use": "winter", "every": 3}, {"use": "plague", "every": 3, "offset": 1}, {"use": "axe"}],
    "He sealed his kingdom in the barrow to stop the plague. The plague was already inside.", {"frost": "immune", "toxin": "resist", "physical": "resist", "fire": "weak"},
    [{"at": 60, "text": "The King's court wakes in their graves.", "ai": [{"use": "court", "every": 4}, {"use": "plague", "every": 2}, {"use": "axe"}], "might": 1},
     {"at": 25, "text": "The King's flesh splits. The plague pours out.", "ai": [{"use": "plague", "every": 2}, {"use": "axe"}], "might": 3}])
room(W_, "The Mound Road", "Wolves among the grave mounds.", ["plague_wolf", "plague_wolf", "barrow_draugr"], "barrow_mound", "foe")
room(W_, "The Leper Path", "Bells in the snow.", ["frostbit_leper", "barrow_draugr", "frostbit_leper"], "barrow_mound", "foe")
room(W_, "The Mould Vault", "Wights and worms in the grave-rot.", ["mold_wight", "grave_worm"], "barrow_tomb", "foe")
room(W_, "The Burial Hall", "The household, still at the table.", ["barrow_draugr", "mold_wight", "frostbit_leper"], "barrow_hall", "foe")
room(W_, "The Thane's Barrow", "A lord with his household.", ["barrow_draugr", "barrow_thane"], "barrow_hall", "elite")
room(W_, "The Witch's Tomb", "She is tending the dead.", ["grave_worm", "rot_witch"], "barrow_tomb", "elite")
room(W_, "The Barrow King", "Boss. The king of the sealed kingdom.", ["barrow_draugr", "barrow_king"], "barrow_hall", "boss")

# ================================================================== FROST + VOID: ABSOLUTE ZERO
W_ = "silence"
world(W_, "The White Silence", ["frost", "void"], "Absolute Zero", "A tundra under a black star. Nothing makes a sound here. Nothing warm has ever lived.", ["silence_tundra", "silence_shrine", "silence_rift"])
foe(W_, "hollow_wanderer", "Hollow Wanderer", 32, 0, "foe", {
    "spear": I("Bone Spear", "attack", "back", [D(9)]),
    "empty": I("Emptiness", "debuff", "front", [A("void", 2, attr="stable"), STRESS(4)]),
}, [{"use": "empty", "every": 3}, {"use": "spear"}], "It walks the tundra looking for its face.", {"void": "resist", "frost": "resist", "lightning": "weak"})
foe(W_, "silence_stag", "Silence Stag", 40, 1, "foe", {
    "gore": I("Gore", "attack", "front", [D(12)]),
    "stamp": I("Stamp", "attack", "front", [D(6), ST("stun", 1)]),
    "bell": I("Antler Bell", "debuff", "all_heroes", [STRESS(8)]),
}, [{"use": "stamp", "every": 4, "offset": 2}, {"use": "bell", "every": 3}, {"use": "gore"}], "It makes no sound when it runs. It makes no sound when it kills.", {"frost": "immune", "fire": "weak"})
foe(W_, "starless_eye", "Starless Eye", 26, 0, "foe", {
    "stare": I("Starless Stare", "debuff", "back", [STRESS(10), A("void", 1, attr="stable")]),
    "blink": I("Blink", "defend", "self", [me("dodge", 1)]),
    "ray": I("Cold Ray", "attack", "front", [D(7), A("frost", 1, attr="stable")]),
}, [{"use": "blink", "if": "hp_pct<50", "not_twice": True}, {"use": "stare", "every": 2}, {"use": "ray"}], "An eye that fell from the black star. It is still looking for the rest of the face.", {"void": "immune", "lightning": "weak"})
foe(W_, "frozen_saint", "Frozen Saint", 38, 2, "foe", {
    "prayer": I("Silent Prayer", "heal", "all_allies", [H(6)]),
    "litany": I("Frozen Litany", "attack", "front", [D(6), A("frost", 2, attr="stable")]),
    "halo": I("Cold Halo", "defend", "all_allies", [B(6)]),
}, [{"use": "prayer", "if": "ally_hurt", "not_twice": True}, {"use": "halo", "every": 3}, {"use": "litany"}], "It prayed for warmth. The black star answered.", {"frost": "resist"})
foe(W_, "rime_shade", "Rime Shade", 28, 0, "foe", {
    "reap": I("Reap", "attack", "front", [D(9), ST("bleed", 2)]),
    "cold": I("Absolute Cold", "attack", "back", [D(4), A("frost", 1, attr="volatile")]),
}, [{"use": "cold", "every": 3}, {"use": "reap"}], "A shadow cast by nothing.", {"physical": "resist", "void": "resist", "fire": "weak"})
foe(W_, "pale_hunter", "The Pale Hunter", 86, 1, "elite", {
    "spear": I("Hunting Spear", "attack", "back", [D(14)]),
    "mark": I("Mark the Prey", "debuff", "back", [ST("mark", 1), ST("vulnerable", 1)]),
    "claws": I("Rend", "attack", "front", [D(6, times=2), ST("bleed", 2)]),
    "track": I("Track", "defend", "self", [me("dodge", 1), me("might", 1)]),
}, [{"use": "mark", "every": 3}, {"use": "track", "every": 4, "offset": 2}, {"use": "spear", "every": 2}, {"use": "claws"}], "It hunts the warm. There are not many left.", {"frost": "resist", "void": "resist", "fire": "weak"})
foe(W_, "void_mammoth", "Void Mammoth", 130, 3, "elite", {
    "trample": I("Trample", "attack", "all_heroes", [D(9)]),
    "tusk": I("Tusk", "attack", "front", [D(18)]),
    "trumpet": I("Trumpet of the Void", "debuff", "all_heroes", [STRESS(12), A("void", 1, attr="stable")]),
}, [{"use": "trumpet", "every": 4, "offset": 1}, {"use": "trample", "every": 3}, {"use": "tusk"}], "Its herd died out an age ago. It did not notice.", {"frost": "immune", "physical": "resist", "lightning": "weak"})
foe(W_, "cold_star", "The Cold Star", 250, 2, "boss", {
    "zero": I("Absolute Zero", "attack", "all_heroes", [A("frost", 2, attr="stable"), A("void", 1, attr="volatile")]),
    "gaze": I("Black Gaze", "debuff", "all_heroes", [STRESS(16)]),
    "lance": I("Star Lance", "attack", "back", [D(18), A("void", 2, attr="stable")]),
    "collapse": I("Collapse", "attack", "front", [D(24)]),
    "dim": I("Dim", "defend", "self", [B(18), me("dodge", 1)]),
}, [{"use": "dim", "if": "hp_pct<40", "not_twice": True}, {"use": "zero", "every": 3}, {"use": "gaze", "every": 3, "offset": 1}, {"use": "collapse"}],
    "The black star came down to see what was making all the noise.", {"void": "immune", "frost": "resist", "lightning": "weak"},
    [{"at": 50, "text": "The Cold Star opens wider.", "ai": [{"use": "zero", "every": 2}, {"use": "lance", "every": 3}, {"use": "collapse"}], "might": 2}])
room(W_, "The Open Tundra", "Wanderers in the snow.", ["hollow_wanderer", "hollow_wanderer", "rime_shade"], "silence_tundra", "foe")
room(W_, "The Stag's Path", "It makes no sound.", ["silence_stag", "hollow_wanderer"], "silence_tundra", "foe")
room(W_, "The Frozen Shrine", "Saints and the eyes that watch them.", ["frozen_saint", "starless_eye", "frozen_saint"], "silence_shrine", "foe")
room(W_, "The Rift Edge", "Shades at the edge of the rift.", ["rime_shade", "starless_eye", "rime_shade"], "silence_rift", "foe")
room(W_, "The Hunt", "It found you first.", ["silence_stag", "pale_hunter"], "silence_tundra", "elite")
room(W_, "The Last Herd", "The mammoth and its shade.", ["rime_shade", "void_mammoth"], "silence_rift", "elite")
room(W_, "The Cold Star", "Boss. The black star comes down.", ["frozen_saint", "cold_star"], "silence_shrine", "boss")

# ================================================================== LIGHTNING + WATER: ELECTROCUTE
W_ = "coast"
world(W_, "The Stormwrack Coast", ["lightning", "water"], "Electrocute", "Cliffs where the storm never ends, and the wreckers light false lights to bring the ships in.", ["coast_cliffs", "coast_cove", "coast_light"])
foe(W_, "wrecker", "Wrecker", 32, 0, "foe", {
    "hook": I("Wrecking Hook", "attack", "back", [D(7), PULL(1)]),
    "cosh": I("Cosh", "attack", "front", [D(9)]),
    "lure": I("False Light", "debuff", "all_heroes", [STRESS(6)]),
}, [{"use": "lure", "every": 3, "offset": 2}, {"use": "hook", "every": 2}, {"use": "cosh"}], "It lights a lamp on the cliff and waits for the ships to come in.", {"water": "resist"})
foe(W_, "shock_eel", "Shock Eel", 30, 0, "foe", {
    "jolt": I("Jolt", "attack", "front", [D(6), A("lightning", 2, attr="stable")]),
    "discharge": I("Discharge", "attack", "all_heroes", [A("lightning", 1, attr="volatile")]),
}, [{"use": "discharge", "every": 3}, {"use": "jolt"}], "It lives in the shallows where the wrecks are. It is why there are no survivors.", {"lightning": "immune", "water": "resist", "toxin": "weak"})
foe(W_, "storm_harpy", "Storm Harpy", 28, 0, "foe", {
    "rake": I("Rake", "attack", "back", [D(5, times=2)]),
    "shriek": I("Storm Shriek", "debuff", "all_heroes", [STRESS(8)]),
    "snatch": I("Snatch", "attack", "back", [D(6), PULL(2)]),
}, [{"use": "snatch", "every": 3}, {"use": "shriek", "every": 3, "offset": 1}, {"use": "rake"}], "It rides the storm down onto the wrecks.", {"lightning": "resist", "physical": "weak"})
foe(W_, "tide_crab", "Tide Crab", 38, 4, "foe", {
    "pinch": I("Pinch", "attack", "front", [D(9)]),
    "shell": I("Shell Up", "defend", "self", [B(12)]),
    "spray": I("Brine Spray", "debuff", "all_heroes", [A("water", 1, attr="stable")]),
}, [{"use": "shell", "if": "hp_pct<50", "not_twice": True}, {"use": "spray", "every": 3}, {"use": "pinch"}], "It picks the wrecks clean. You are a wreck.", {"physical": "resist", "water": "immune", "lightning": "weak"})
foe(W_, "drowned_bosun", "Drowned Bosun", 46, 1, "foe", {
    "chain": I("Anchor Chain", "attack", "front", [D(12)]),
    "lash": I("Lash", "attack", "back", [D(6), ST("bleed", 2)]),
    "haul": I("Haul Away", "attack", "back", [D(4), PULL(2)]),
}, [{"use": "haul", "every": 4, "offset": 1}, {"use": "lash", "every": 3}, {"use": "chain"}], "The wreckers' last catch. He signed on.", {"water": "resist", "lightning": "weak"})
foe(W_, "lighthouse_keeper", "The Lighthouse Keeper", 80, 1, "elite", {
    "beam": I("False Beam", "attack", "back", [D(10), A("lightning", 2, attr="stable")]),
    "fog": I("Sea Fog", "debuff", "all_heroes", [A("water", 2, attr="stable")]),
    "log": I("Ship's Log", "buff", "all_allies", [ST("might", 1), ST("dodge", 1)]),
    "storm": I("Call the Storm", "attack", "all_heroes", [D(4), A("lightning", 1, attr="volatile")]),
}, [{"use": "log", "every": 4, "offset": 3}, {"use": "fog", "every": 3}, {"use": "storm", "every": 3, "offset": 1}, {"use": "beam"}], "He keeps the light burning in the wrong place.", {"lightning": "resist", "water": "resist", "toxin": "weak"})
foe(W_, "harpy_matron", "Harpy Matron", 92, 0, "elite", {
    "talons": I("Talons", "attack", "front", [D(8, times=2)]),
    "dive": I("Dive from the Storm", "attack", "back", [D(14), A("lightning", 2, attr="stable")]),
    "brood": I("Call the Brood", "buff", "all_allies", [ST("might", 2)]),
    "screech": I("Screech", "debuff", "all_heroes", [STRESS(12)]),
}, [{"use": "brood", "every": 4, "offset": 1}, {"use": "screech", "every": 3, "offset": 2}, {"use": "dive", "every": 2}, {"use": "talons"}], "The mother of the storm harpies, crowned with a drowned queen's circlet.", {"lightning": "resist", "physical": "resist", "frost": "weak"})
foe(W_, "thunder_whale", "The Thunder Whale", 280, 3, "boss", {
    "breach": I("Breach", "attack", "all_heroes", [D(10), A("water", 2, attr="stable")]),
    "thunder": I("Thunder Song", "attack", "all_heroes", [A("lightning", 2, attr="volatile")]),
    "ram": I("Ram the Cliff", "attack", "front", [D(24)]),
    "spout": I("Spout", "debuff", "back", [A("water", 3, attr="stable"), PUSH(1)]),
    "dive": I("Sound", "defend", "self", [B(20), me("regen", 6)]),
}, [{"use": "dive", "if": "hp_pct<40", "not_twice": True}, {"use": "thunder", "every": 3, "offset": 2}, {"use": "breach", "every": 3}, {"use": "ram"}],
    "The storm on the coast is its song.", {"lightning": "immune", "water": "resist", "toxin": "weak"},
    [{"at": 50, "text": "The Whale sings. The storm answers.", "ai": [{"use": "thunder", "every": 2}, {"use": "spout", "every": 3}, {"use": "ram"}], "might": 2}])
room(W_, "The Wreckers' Cliff", "The lamps are lit.", ["wrecker", "wrecker", "drowned_bosun"], "coast_cliffs", "foe")
room(W_, "The Eel Shallows", "Things that bite and things that shock.", ["shock_eel", "tide_crab", "shock_eel"], "coast_cove", "foe")
room(W_, "The Harpy Rocks", "They ride the storm down.", ["storm_harpy", "storm_harpy", "wrecker"], "coast_cliffs", "foe")
room(W_, "The Wreck", "The bosun and his new crew.", ["drowned_bosun", "tide_crab"], "coast_cove", "foe")
room(W_, "The Lighthouse", "The keeper tends the false light.", ["wrecker", "lighthouse_keeper"], "coast_light", "elite")
room(W_, "The Matron's Roost", "The crowned harpy and her brood.", ["storm_harpy", "harpy_matron"], "coast_cliffs", "elite")
room(W_, "The Thunder Whale", "Boss. The storm sings.", ["shock_eel", "thunder_whale"], "coast_cove", "boss")

# ================================================================== LIGHTNING + TOXIN: NEUROTOXIN
W_ = "hive"
world(W_, "The Venom Spires", ["lightning", "toxin"], "Neurotoxin", "Hive towers on a lightning-struck plain. The insects that build them sting with venom that stops the heart.", ["hive_spires", "hive_comb", "hive_brood"])
foe(W_, "spire_wasps", "Spire Wasps", 24, 0, "foe", {
    "sting": I("Sting", "attack", "front", [D(2, times=3), A("toxin", 1, attr="stable")]),
    "swarm": I("Swarm", "debuff", "all_heroes", [STRESS(6)]),
}, [{"use": "swarm", "every": 3}, {"use": "sting"}], "A cloud of stings.", {"physical": "resist", "toxin": "immune", "fire": "weak"})
foe(W_, "venom_spider", "Venom Spider", 32, 1, "foe", {
    "fang": I("Venom Fang", "attack", "front", [D(6), A("toxin", 3, attr="stable")]),
    "web": I("Web", "attack", "back", [D(3), ST("anchor", 1)]),
}, [{"use": "web", "every": 3}, {"use": "fang"}], "It weaves between the spires and waits for the lightning to bring it food.", {"toxin": "immune", "fire": "weak"})
foe(W_, "puppet_host", "Puppet Host", 36, 0, "foe", {
    "flail": I("Jerk and Flail", "attack", "front", [D(10)]),
    "spores": I("Release Spores", "debuff", "all_heroes", [A("toxin", 1, attr="stable"), STRESS(4)]),
}, [{"use": "spores", "every": 2}, {"use": "flail"}], "A traveller the hive has hollowed out and filled with larvae. It moves when they do.", {"toxin": "resist", "fire": "weak"}, personality="mindless")
foe(W_, "galvanic_beetle", "Galvanic Beetle", 40, 5, "foe", {
    "charge": I("Galvanic Charge", "attack", "front", [D(9), A("lightning", 2, attr="stable")]),
    "carapace": I("Carapace", "defend", "self", [B(12)]),
}, [{"use": "carapace", "if": "hp_pct<50", "not_twice": True}, {"use": "carapace", "every": 4, "offset": 3}, {"use": "charge"}], "It stores lightning in its shell.", {"lightning": "immune", "physical": "resist", "water": "weak"})
foe(W_, "hive_drone", "Hive Drone", 26, 0, "foe", {
    "nectar": I("Nectar", "heal", "ally_lowest", [H(10)]),
    "dust": I("Venom Dust", "debuff", "back", [A("toxin", 2, attr="stable")]),
}, [{"use": "nectar", "if": "ally_hurt", "not_twice": True}, {"use": "dust"}], "It feeds the hive. Everything feeds the hive.", {"toxin": "resist", "physical": "weak"})
foe(W_, "mantis_duelist", "Mantis Duelist", 84, 1, "elite", {
    "scythe": I("Scythe Arms", "attack", "front", [D(7, times=2)]),
    "lunge": I("Lunge", "attack", "back", [D(12), A("toxin", 2, attr="stable")]),
    "stance": I("Praying Stance", "defend", "self", [me("riposte", 8), B(8)]),
    "paralyse": I("Paralysing Strike", "attack", "front", [D(6), A("lightning", 1, attr="volatile"), A("toxin", 1, attr="stable")]),
}, [{"use": "stance", "if": "hp_pct<50", "not_twice": True}, {"use": "paralyse", "every": 3}, {"use": "lunge", "every": 3, "offset": 1}, {"use": "scythe"}], "It bows before every duel. It eats the loser.", {"toxin": "resist", "lightning": "resist", "fire": "weak"})
foe(W_, "brood_mother", "Brood Mother", 118, 2, "elite", {
    "bite": I("Brood Bite", "attack", "front", [D(14), A("toxin", 2, attr="stable")]),
    "hatch": I("Hatch", "buff", "all_allies", [ST("might", 1), ST("regen", 3)]),
    "web": I("Web the Rear", "attack", "back", [D(6), ST("anchor", 1), STRESS(6)]),
}, [{"use": "hatch", "every": 3}, {"use": "web", "every": 3, "offset": 1}, {"use": "bite"}], "The spiders' queen. Her back crawls with young.", {"toxin": "immune", "fire": "weak"})
foe(W_, "hive_queen", "The Hive Queen", 260, 4, "boss", {
    "sting": I("Royal Sting", "attack", "front", [D(16), A("toxin", 3, attr="stable")]),
    "neuro": I("Neurotoxin", "attack", "all_heroes", [A("lightning", 1, attr="volatile"), A("toxin", 1, attr="stable")]),
    "drone": I("Drone of the Hive", "debuff", "all_heroes", [STRESS(14)]),
    "royal": I("Royal Jelly", "heal", "self", [H(24), me("might", 1)]),
    "swarm": I("Swarm the Rear", "attack", "back", [D(6, times=2)]),
}, [{"use": "royal", "if": "hp_pct<40", "not_twice": True}, {"use": "neuro", "every": 3}, {"use": "drone", "every": 3, "offset": 1}, {"use": "sting"}],
    "The heart of the spires. Every sting on the plain is hers.", {"toxin": "immune", "lightning": "resist", "fire": "weak"},
    [{"at": 55, "text": "The Queen takes wing.", "ai": [{"use": "swarm", "every": 2}, {"use": "neuro", "every": 3}, {"use": "sting"}], "might": 2}])
room(W_, "The Outer Spires", "Wasps drifting between the towers.", ["spire_wasps", "puppet_host", "spire_wasps"], "hive_spires", "foe")
room(W_, "The Web Fields", "Spiders wait where the lightning falls.", ["venom_spider", "venom_spider", "galvanic_beetle"], "hive_spires", "foe")
room(W_, "The Comb", "Drones and the hosts they feed.", ["hive_drone", "puppet_host", "hive_drone"], "hive_comb", "foe")
room(W_, "The Beetle Gallery", "Beetles crackling in the comb.", ["galvanic_beetle", "venom_spider"], "hive_comb", "foe")
room(W_, "The Duelling Ground", "The mantis bows.", ["hive_drone", "mantis_duelist"], "hive_spires", "elite")
room(W_, "The Brood Chamber", "Something enormous with something small on its back.", ["venom_spider", "brood_mother"], "hive_brood", "elite")
room(W_, "The Hive Queen", "Boss. The heart of the hive.", ["spire_wasps", "hive_queen"], "hive_brood", "boss")

# ================================================================== LIGHTNING + VOID: DISCHARGE
W_ = "sky"
world(W_, "The Torn Sky", ["lightning", "void"], "Discharge", "A heaven torn open by a war of gods. The ruins float in the storm, and through the tears something looks in.", ["sky_ruins", "sky_gate", "sky_choir"])
foe(W_, "fallen_angel", "Fallen Angel", 36, 1, "foe", {
    "sword": I("Fallen Sword", "attack", "front", [D(11)]),
    "smite": I("Smite", "attack", "back", [D(6), A("lightning", 2, attr="stable")]),
}, [{"use": "smite", "every": 3}, {"use": "sword"}], "It fell in the war and kept fighting it.", {"lightning": "resist", "void": "weak"})
foe(W_, "rift_hound", "Rift Hound", 30, 0, "foe", {
    "phase": I("Phase Bite", "attack", "back", [D(8), A("void", 1, attr="stable")]),
    "maul": I("Maul", "attack", "front", [D(9)]),
    "blink": I("Blink", "defend", "self", [me("dodge", 1)]),
}, [{"use": "blink", "every": 4, "offset": 3}, {"use": "phase", "every": 2}, {"use": "maul"}], "It comes through the tears in the sky. Things that should not be followed it.", {"void": "immune", "lightning": "weak"})
foe(W_, "storm_shade", "Storm Shade", 24, 0, "foe", {
    "arc": I("Arc", "attack", "back", [D(4), A("lightning", 1, attr="volatile")]),
    "static": I("Static Shroud", "debuff", "all_heroes", [A("lightning", 1, attr="stable")]),
}, [{"use": "static", "every": 2}, {"use": "arc"}], "Lightning that forgot to stop.", {"physical": "resist", "lightning": "immune", "water": "weak"})
foe(W_, "choir_of_eyes", "Choir of Eyes", 30, 0, "foe", {
    "gaze": I("Hundredfold Gaze", "debuff", "all_heroes", [STRESS(8)]),
    "weep": I("Weep", "debuff", "back", [A("void", 2, attr="stable")]),
}, [{"use": "weep", "every": 2}, {"use": "gaze"}], "The eyes of the dead god, singing its last hymn.", {"void": "resist", "physical": "weak"})
foe(W_, "skywreck_knight", "Skywreck Knight", 48, 4, "foe", {
    "mace": I("Mace", "attack", "front", [D(12)]),
    "shield": I("Aegis", "defend", "all_allies", [B(6)]),
    "charge": I("Thunder Charge", "attack", "front", [D(7), ST("stun", 1)]),
}, [{"use": "shield", "if": "ally_hurt", "not_twice": True}, {"use": "charge", "every": 4, "offset": 2}, {"use": "mace"}], "A knight of the heavenly host, his armour fused in the fall.", {"physical": "resist", "lightning": "resist", "water": "weak"})
foe(W_, "thunder_seraph", "Thunder Seraph", 90, 2, "elite", {
    "spear": I("Spear of Heaven", "attack", "back", [D(14), A("lightning", 2, attr="stable")]),
    "wings": I("Storm Wings", "attack", "all_heroes", [D(6)]),
    "judgement": I("Judgement", "attack", "front", [D(8), A("lightning", 1, attr="volatile"), A("void", 1, attr="stable")]),
    "hymn": I("Hymn", "buff", "all_allies", [ST("might", 1), B(6)]),
}, [{"use": "hymn", "every": 4, "offset": 3}, {"use": "judgement", "every": 3}, {"use": "wings", "every": 3, "offset": 1}, {"use": "spear"}], "It holds the sky together with its spear. It is losing.", {"lightning": "immune", "physical": "resist", "void": "weak"})
foe(W_, "rift_leviathan", "Rift Leviathan", 120, 1, "elite", {
    "swallow": I("Swallow", "attack", "front", [D(18)]),
    "tear": I("Tear the Sky", "attack", "all_heroes", [D(6), A("void", 2, attr="stable")]),
    "coil": I("Coil Through the Rift", "defend", "self", [B(14), me("dodge", 1)]),
}, [{"use": "coil", "if": "hp_pct<50", "not_twice": True}, {"use": "tear", "every": 3}, {"use": "swallow"}], "It swims in the space between the stars.", {"void": "immune", "lightning": "weak"})
foe(W_, "shattered_god", "The Shattered God", 260, 2, "boss", {
    "discharge": I("Discharge", "attack", "front", [D(16, true=True)]),
    "storm": I("Storm of Heaven", "attack", "all_heroes", [D(8), A("lightning", 2, attr="stable")]),
    "void": I("Gaze of the Void", "debuff", "all_heroes", [A("void", 2, attr="stable"), STRESS(14)]),
    "wrath": I("Divine Wrath", "attack", "back", [D(18)]),
    "mend": I("Mend the Cracks", "heal", "self", [H(26)]),
}, [{"use": "mend", "if": "hp_pct<40", "not_twice": True}, {"use": "void", "every": 3}, {"use": "storm", "every": 3, "offset": 1}, {"use": "discharge"}],
    "A god broken in the war of heaven. The void is leaking out through its cracks.", {"lightning": "immune", "void": "resist", "toxin": "weak"},
    [{"at": 60, "text": "The God's cracks open. The void looks out.", "ai": [{"use": "void", "every": 2}, {"use": "wrath", "every": 3}, {"use": "discharge"}], "might": 1},
     {"at": 25, "text": "The God shatters, and keeps fighting.", "ai": [{"use": "storm", "every": 2}, {"use": "discharge"}], "might": 3}])
room(W_, "The Floating Steps", "Angels guard what is left of the stair.", ["fallen_angel", "storm_shade", "fallen_angel"], "sky_ruins", "foe")
room(W_, "The Tear", "Hounds come through the rift.", ["rift_hound", "rift_hound", "choir_of_eyes"], "sky_gate", "foe")
room(W_, "The Broken Choir", "The eyes are singing.", ["choir_of_eyes", "skywreck_knight"], "sky_choir", "foe")
room(W_, "The Host's Last Stand", "A knight and the lightning he serves.", ["skywreck_knight", "storm_shade", "fallen_angel"], "sky_ruins", "foe")
room(W_, "The Seraph's Watch", "It is holding the sky together.", ["fallen_angel", "thunder_seraph"], "sky_choir", "elite")
room(W_, "Between the Stars", "Something swims through the tear.", ["rift_hound", "rift_leviathan"], "sky_gate", "elite")
room(W_, "The Shattered God", "Boss. A god, broken.", ["skywreck_knight", "shattered_god"], "sky_ruins", "boss")

# ================================================================== TOXIN + WATER: TOXIC POOL
W_ = "mire"
world(W_, "The Rotmire", ["toxin", "water"], "Toxic Pool", "A drowned fen where the water is poison and the bodies in it do not rot. The hags keep house on stilts.", ["mire_bog", "mire_hut", "mire_drown"])
foe(W_, "bog_body", "Bog Body", 36, 0, "foe", {
    "drag": I("Drag Under", "attack", "front", [D(8), A("water", 2, attr="stable")]),
    "claw": I("Peat Claw", "attack", "front", [D(10)]),
}, [{"use": "drag", "every": 3}, {"use": "claw"}], "Tanned by the bog. Leather now, and hungry.", {"water": "resist", "toxin": "resist", "fire": "weak"}, personality="mindless")
foe(W_, "fen_hag", "Fen Hag", 30, 0, "foe", {
    "curse": I("Fen Curse", "debuff", "back", [A("toxin", 2, attr="stable"), STRESS(6)]),
    "brew": I("Bog Brew", "heal", "ally_lowest", [H(12)]),
    "staff": I("Rot Staff", "attack", "front", [D(7)]),
}, [{"use": "brew", "if": "ally_hurt", "not_twice": True}, {"use": "curse", "every": 2}, {"use": "staff"}], "She knows the safe path through the fen. She does not share it.", {"toxin": "immune", "fire": "weak"})
foe(W_, "mire_toad", "Mire Toad", 34, 0, "foe", {
    "spit": I("Toxic Spit", "attack", "back", [D(4), A("toxin", 2, attr="stable")]),
    "tongue": I("Tongue", "attack", "back", [D(6), PULL(1)]),
    "puff": I("Puff Up", "defend", "self", [B(8), me("thorns", 2)]),
}, [{"use": "puff", "if": "hp_pct<50", "not_twice": True}, {"use": "tongue", "every": 3}, {"use": "spit"}], "Fat on the fen's poison.", {"toxin": "immune", "water": "resist", "fire": "weak"})
foe(W_, "leech_swarm", "Leech Swarm", 26, 0, "foe", {
    "latch": I("Latch On", "attack", "front", [D(3, lifesteal=100), ST("bleed", 3)]),
    "feed": I("Feed", "attack", "back", [D(2, times=3)]),
}, [{"use": "feed", "every": 2}, {"use": "latch"}], "The fen's own. They wait in the warm shallows.", {"water": "resist", "physical": "resist", "fire": "weak"})
foe(W_, "fen_lurker", "Fen Lurker", 44, 2, "foe", {
    "jaws": I("Death Roll", "attack", "front", [D(13)]),
    "ambush": I("Ambush", "attack", "back", [D(10)]),
    "sink": I("Sink", "defend", "self", [B(10), me("dodge", 1)]),
}, [{"use": "ambush", "if": "round==1"}, {"use": "sink", "every": 4, "offset": 3}, {"use": "jaws"}], "A log in the water. Then not.", {"water": "immune", "physical": "resist", "lightning": "weak"})
foe(W_, "bog_troll", "Bog Troll", 130, 2, "elite", {
    "club": I("Club", "attack", "front", [D(18)]),
    "wade": I("Wade Through", "attack", "all_heroes", [D(7), A("water", 1, attr="stable")]),
    "regrow": I("Regrow", "defend", "self", [me("regen", 8), B(8)]),
}, [{"use": "regrow", "if": "hp_pct<60", "not_twice": True}, {"use": "wade", "every": 3}, {"use": "club"}], "Moss, mud and muscle. It heals faster than you can cut.", {"toxin": "immune", "water": "resist", "fire": "weak"})
foe(W_, "coven_mother", "Coven Mother", 84, 0, "elite", {
    "pool": I("Toxic Pool", "attack", "all_heroes", [A("toxin", 1, attr="stable"), A("water", 1, attr="volatile")]),
    "hex": I("Mother's Hex", "debuff", "back", [ST("hex", 3), STRESS(8)]),
    "brew": I("Coven Brew", "heal", "all_allies", [H(10)]),
    "censer": I("Rot Censer", "attack", "front", [D(10), A("toxin", 2, attr="stable")]),
}, [{"use": "brew", "if": "ally_hurt75", "not_twice": True}, {"use": "pool", "every": 3}, {"use": "hex", "every": 3, "offset": 1}, {"use": "censer"}], "She leads the hags of the fen. Her antlers are not hers.", {"toxin": "immune", "water": "resist", "fire": "weak"})
foe(W_, "mire_mother", "The Mire Mother", 260, 1, "boss", {
    "swallow": I("Swallow", "attack", "front", [D(22)]),
    "flood": I("Poison Flood", "attack", "all_heroes", [D(6), A("toxin", 2, attr="stable"), A("water", 1, attr="stable")]),
    "lullaby": I("Bog Lullaby", "debuff", "all_heroes", [STRESS(16)]),
    "weed": I("Drowning Weed", "attack", "back", [D(10), ST("anchor", 1), PULL(2)]),
    "bloat": I("Bloat", "heal", "self", [H(24), me("regen", 4)]),
}, [{"use": "bloat", "if": "hp_pct<40", "not_twice": True}, {"use": "lullaby", "every": 3}, {"use": "flood", "every": 3, "offset": 1}, {"use": "swallow"}],
    "The fen's oldest drowned head, swollen to the size of a house. The hags call her Mother.", {"toxin": "immune", "water": "immune", "fire": "weak"},
    [{"at": 55, "text": "The Mother rises from the fen.", "ai": [{"use": "weed", "every": 2}, {"use": "flood", "every": 3}, {"use": "swallow"}], "might": 2}])
room(W_, "The Sunken Path", "Bodies in the peat.", ["bog_body", "bog_body", "leech_swarm"], "mire_bog", "foe")
room(W_, "The Hag's Porch", "A hag and her pets.", ["mire_toad", "fen_hag"], "mire_hut", "foe")
room(W_, "The Still Water", "A log in the water.", ["fen_lurker", "leech_swarm"], "mire_drown", "foe")
room(W_, "The Peat Cutting", "The hags put their dead to work.", ["bog_body", "fen_hag", "mire_toad"], "mire_bog", "foe")
room(W_, "Under the Bridge", "Something heavy in the mud.", ["leech_swarm", "bog_troll"], "mire_bog", "elite")
room(W_, "The Coven", "The hags gather.", ["fen_hag", "coven_mother"], "mire_hut", "elite")
room(W_, "The Mire Mother", "Boss. The fen's mother.", ["bog_body", "mire_mother"], "mire_drown", "boss")

# ================================================================== TOXIN + VOID: BLIGHT
W_ = "garden"
world(W_, "The Blighted Garden", ["toxin", "void"], "Blight", "A fey garden gone to rot. The spores grow minds, and the minds grow wrong.", ["garden_grove", "garden_hedge", "garden_heart"])
foe(W_, "fungal_husk", "Fungal Husk", 32, 0, "foe", {
    "lurch": I("Lurch", "attack", "front", [D(9)]),
    "burst": I("Spore Burst", "debuff", "all_heroes", [A("toxin", 1, attr="stable")]),
}, [{"use": "burst", "every": 2}, {"use": "lurch"}], "A gardener the mushrooms grew into.", {"toxin": "resist", "fire": "weak"}, personality="mindless")
foe(W_, "spore_deer", "Spore Deer", 34, 0, "foe", {
    "antler": I("Antler Rake", "attack", "front", [D(10)]),
    "shake": I("Shake the Spores", "debuff", "all_heroes", [A("toxin", 1, attr="stable"), STRESS(4)]),
    "bolt": I("Bolt", "defend", "self", [me("dodge", 1)]),
}, [{"use": "bolt", "if": "hp_pct<50", "not_twice": True}, {"use": "shake", "every": 3}, {"use": "antler"}], "The fungus grows from its antlers. It is not the deer making the decisions now.", {"toxin": "resist", "fire": "weak"})
foe(W_, "thorn_knight", "Thorn Knight", 48, 4, "foe", {
    "blade": I("Thorn Blade", "attack", "front", [D(10), ST("bleed", 2)]),
    "briar": I("Briar Guard", "defend", "self", [B(10), me("thorns", 3)]),
}, [{"use": "briar", "every": 3}, {"use": "blade"}], "Sworn to guard the garden. The garden grew through his armour.", {"physical": "resist", "toxin": "resist", "fire": "weak"})
foe(W_, "moth_witch", "Moth Witch", 28, 0, "foe", {
    "dust": I("Void Dust", "debuff", "all_heroes", [A("void", 1, attr="stable")]),
    "eyes": I("Wing Eyes", "debuff", "back", [STRESS(10)]),
    "flit": I("Flit", "defend", "self", [me("dodge", 1)]),
}, [{"use": "flit", "if": "hp_pct<50", "not_twice": True}, {"use": "eyes", "every": 2}, {"use": "dust"}], "The eyes on her wings are real. They blink.", {"void": "resist", "physical": "weak"})
foe(W_, "root_horror", "Root Horror", 38, 1, "foe", {
    "grasp": I("Root Grasp", "attack", "back", [D(6), ST("anchor", 1)]),
    "maw": I("Root Maw", "attack", "front", [D(11)]),
}, [{"use": "grasp", "every": 3}, {"use": "maw"}], "The garden's roots grew a mouth.", {"toxin": "resist", "fire": "weak"})
foe(W_, "the_gardener", "The Gardener", 124, 2, "elite", {
    "scythe": I("Pruning Scythe", "attack", "front", [D(16), ST("bleed", 3)]),
    "sow": I("Sow Blight", "attack", "all_heroes", [A("toxin", 1, attr="stable"), A("void", 1, attr="stable")]),
    "tend": I("Tend the Garden", "heal", "all_allies", [H(10)]),
}, [{"use": "tend", "if": "ally_hurt75", "not_twice": True}, {"use": "sow", "every": 3}, {"use": "scythe"}], "He keeps the garden. He prunes what grows wrong. You are growing wrong.", {"toxin": "resist", "void": "resist", "physical": "resist", "fire": "weak"})
foe(W_, "blight_dryad", "Blight Dryad", 82, 0, "elite", {
    "claws": I("Bark Claws", "attack", "front", [D(7, times=2)]),
    "blight": I("Blight", "attack", "back", [D(6), A("toxin", 1, attr="volatile"), A("void", 1, attr="stable")]),
    "seed": I("Seed of Rot", "debuff", "all_heroes", [STRESS(10), A("toxin", 1, attr="stable")]),
    "root": I("Take Root", "defend", "self", [B(12), me("regen", 4)]),
}, [{"use": "root", "if": "hp_pct<50", "not_twice": True}, {"use": "seed", "every": 3}, {"use": "blight", "every": 2}, {"use": "claws"}], "She was the spirit of an oak. The oak is dead. She is not.", {"toxin": "immune", "void": "resist", "fire": "weak"})
foe(W_, "antlered_mother", "The Antlered Mother", 260, 2, "boss", {
    "gore": I("Gore", "attack", "front", [D(22)]),
    "bloom": I("Blight Bloom", "attack", "all_heroes", [D(6), A("toxin", 2, attr="stable"), A("void", 1, attr="stable")]),
    "gaze": I("Hundred Eyes", "debuff", "all_heroes", [STRESS(14)]),
    "trample": I("Trample", "attack", "back", [D(14), PUSH(1)]),
    "renew": I("Renewal", "heal", "self", [H(22), me("regen", 4)]),
}, [{"use": "renew", "if": "hp_pct<40", "not_twice": True}, {"use": "gaze", "every": 3}, {"use": "bloom", "every": 3, "offset": 1}, {"use": "gore"}],
    "The garden's heart: a great stag grown through with fungus and eyes. She is the garden now.", {"toxin": "immune", "void": "resist", "fire": "weak"},
    [{"at": 55, "text": "The Mother's eyes open, all of them.", "ai": [{"use": "bloom", "every": 2}, {"use": "trample", "every": 3}, {"use": "gore"}], "might": 2},
     {"at": 20, "text": "The fungus takes her whole.", "ai": [{"use": "bloom", "every": 2}, {"use": "gore"}], "might": 2}])
room(W_, "The Overgrown Path", "Husks among the mushrooms.", ["fungal_husk", "fungal_husk", "root_horror"], "garden_grove", "foe")
room(W_, "The Deer Glade", "They graze on the spores.", ["spore_deer", "spore_deer", "moth_witch"], "garden_grove", "foe")
room(W_, "The Hedge Maze", "A knight guards the turning.", ["thorn_knight", "moth_witch"], "garden_hedge", "foe")
room(W_, "The Root Cellar", "The roots have mouths.", ["root_horror", "fungal_husk", "thorn_knight"], "garden_heart", "foe")
room(W_, "The Gardener's Shed", "He is pruning.", ["fungal_husk", "the_gardener"], "garden_hedge", "elite")
room(W_, "The Dead Oak", "Her oak is dead. She is not.", ["spore_deer", "blight_dryad"], "garden_grove", "elite")
room(W_, "The Antlered Mother", "Boss. The garden's heart.", ["thorn_knight", "antlered_mother"], "garden_heart", "boss")


# baseline tuning: door-world bosses start level with the Drowned Kingdom's (sim parity); playtesting tunes from here
for k, v in E.items():
    if v["tier"] == "boss":
        v["hp"] = int(round(v["hp"] * 0.86 / 5.0)) * 5
        for ph in v["phases"]:
            ph["might"] = max(0, ph.get("might", 0) - 1)
        for it in v["intents"].values():
            for fx in it["fx"]:
                if fx["t"] == "dmg" and fx.get("n", 0) >= 20 and it["target"] != "all_heroes":
                    fx["n"] -= 3
            it["text"] = _txt(it["fx"], it["target"])
for k, v in E.items():
    assert v["ai"][-1].get("if") is None and v["ai"][-1].get("every") is None, k
    for r in v["ai"]:
        assert r["use"] in v["intents"], (k, r)
    for ph in v.get("phases", []):
        for r in ph["ai"]:
            assert r["use"] in v["intents"], (k, ph)
        assert ph["ai"][-1].get("if") is None and ph["ai"][-1].get("every") is None, k
for r in ROOMS:
    for k in r["enemies"]:
        assert k in E, r
