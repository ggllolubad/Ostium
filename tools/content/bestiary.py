"""Drowned Kingdom bestiary: 12 foes, 4 elites, 3 bosses, and the rooms they hold. Writes data/enemies.json and
data/encounters.json. Intent fx use the same effect vocabulary as cards. AI: ordered rules, first match wins
(see scripts/enemy_ai.gd). Display size is canvas height x 0.471 so every sprite shares one scale."""
import json, os
from dsl import D, B, H, ST, A, STRESS, PULL, PUSH, SELFDMG

S = 0.471
def size(w, h): return [round(w * S), round(h * S)]
def I(name, kind, target, fx, text): return {"name": name, "kind": kind, "target": target, "fx": fx, "text": text}
def self_st(s, n): return {"t": "status", "s": s, "n": n, "to": "self"}

E = {}
def enemy(key, name, hp, armor, tier, canvas, intents, ai, lore, armor_note=None):
    E[key] = {"name": name, "hp": hp, "armor": armor, "tier": tier, "art": f"res://assets/art/rigs/{key}/full.png", "size": size(*canvas),
              "feet": round((canvas[1] - 24) / canvas[1], 4), "intents": intents, "ai": ai, "lore": lore}

# ------------------------------------------------------------------ regulars
enemy("thrall", "Drowned Thrall", 34, 0, "foe", (460, 700), {
    "grasp": I("Grasp", "attack", "front", [D(10)], "10 to the front hero"),
    "hook": I("Boat Hook", "attack", "back", [D(7), PULL(1)], "7 to the rearmost hero and drag them forward"),
    "gurgle": I("Gurgle", "debuff", "all_heroes", [STRESS(8), A("water", 1, attr="stable")], "8 stress and 1 Water to every hero"),
}, [{"use": "grasp", "if": "hero_dd"}, {"use": "grasp", "every": 3}, {"use": "hook", "every": 3, "offset": 1}, {"use": "gurgle"}],
    "Sailors who went down with the fleet. They still haul at anything that floats.")
enemy("siren", "Brine Siren", 44, 0, "foe", (460, 700), {
    "mend": I("Mirror Mend", "heal", "ally_lowest", [H(14)], "heals the most wounded foe 14"),
    "song": I("Drowning Song", "debuff", "all_heroes", [STRESS(12)], "12 stress to every hero"),
    "lure": I("Lure", "attack", "back", [D(10), A("void", 1, attr="volatile")], "10 and 1 Volatile Void to the rearmost hero"),
}, [{"use": "mend", "if": "ally_hurt75", "not_twice": True}, {"use": "song", "every": 2, "offset": 1}, {"use": "lure"}],
    "Its song is the last thing the drowned remember. It wants you to remember it too.")
enemy("eelkin", "Eel-kin Biter", 30, 0, "foe", (460, 700), {
    "bite": I("Rasping Bite", "attack", "front", [D(6), ST("bleed", 3)], "6 and 3 Bleed to the front hero"),
    "lash": I("Tail Lash", "attack", "back", [D(5), ST("bleed", 2)], "5 and 2 Bleed to the rearmost hero"),
    "slither": I("Slither", "defend", "self", [B(6), self_st("dodge", 1)], "6 Block; dodges the next hit"),
}, [{"use": "slither", "if": "hp_pct<40", "not_twice": True}, {"use": "bite", "every": 2}, {"use": "lash"}],
    "They feed by latching on and not letting go.")
enemy("bellringer", "Drowned Bell-Ringer", 32, 0, "foe", (460, 700), {
    "toll": I("Toll", "debuff", "all_heroes", [STRESS(10)], "10 stress to every hero"),
    "dirge": I("Dirge", "buff", "all_allies", [ST("might", 2)], "every foe gains 2 Might"),
    "knell": I("Knell", "attack", "front", [D(5), STRESS(6)], "5 and 6 stress to the front hero"),
}, [{"use": "dirge", "every": 3}, {"use": "toll", "every": 3, "offset": 1}, {"use": "knell"}],
    "The bell is rung for the dead. Down here, that is everyone.")
enemy("barnacle_knight", "Barnacle Knight", 52, 5, "foe", (480, 720), {
    "cleave": I("Cleave", "attack", "front", [D(12)], "12 to the front hero"),
    "encrust": I("Encrust", "defend", "self", [B(12), {"t": "guard_weakest"}], "12 Block; guards the weakest foe"),
    "crush": I("Crush", "attack", "front", [D(8), ST("vulnerable", 1)], "8 and Vulnerable to the front hero"),
}, [{"use": "encrust", "if": "ally_hurt", "not_twice": True}, {"use": "crush", "every": 3}, {"use": "cleave"}],
    "Oathbound to a drowned order. The sea has kept his armour on for him.")
enemy("lamprey", "Lamprey Swarm", 26, 0, "foe", (460, 700), {
    "latch": I("Latch", "attack", "front", [D(3, lifesteal=100), ST("bleed", 3)], "3, healing itself, and 3 Bleed to the front hero"),
    "feed": I("Frenzied Feeding", "attack", "back", [D(2, times=3)], "2 three times to the rearmost hero"),
}, [{"use": "feed", "every": 2}, {"use": "latch"}],
    "A knot of mouths. Where one is, the rest follow.")
enemy("bloated", "Bloated Corpse", 40, 0, "foe", (480, 700), {
    "ooze": I("Ooze", "debuff", "all_heroes", [A("toxin", 2, attr="stable")], "2 Toxin to every hero"),
    "heave": I("Heave", "attack", "front", [D(8)], "8 to the front hero"),
    "burst": I("Burst", "attack", "all_heroes", [D(10), A("toxin", 3, attr="stable"), SELFDMG(999)], "bursts: 10 and 3 Toxin to every hero, and dies"),
}, [{"use": "burst", "if": "hp_pct<50"}, {"use": "burst", "if": "round>=4"}, {"use": "ooze", "every": 2}, {"use": "heave"}],
    "Gas swells the dead until the skin will not hold. Do not be close when it fails.")
enemy("hookline", "Hookline Fisher", 34, 1, "foe", (460, 700), {
    "reel": I("Reel In", "attack", "back", [D(6), PULL(2)], "6 to the rearmost hero; drags them forward 2"),
    "gaff": I("Gaff", "attack", "front", [D(9), ST("bleed", 2)], "9 and 2 Bleed to the front hero"),
    "net": I("Cast Net", "debuff", "all_heroes", [ST("anchor", 1), STRESS(4)], "every hero is held in place this round and gains 4 stress"),
}, [{"use": "reel", "every": 3}, {"use": "net", "every": 3, "offset": 1}, {"use": "gaff"}],
    "Still fishing. The catch has changed.")
enemy("weeping_nun", "Weeping Nun", 36, 0, "foe", (460, 700), {
    "weep": I("Salt Tears", "heal", "all_allies", [H(6)], "every foe heals 6"),
    "lament": I("Lament", "debuff", "all_heroes", [STRESS(9)], "9 stress to every hero"),
    "kiss": I("Brine Kiss", "attack", "front", [D(7), A("water", 2, attr="stable")], "7 and 2 Water to the front hero"),
}, [{"use": "weep", "if": "ally_hurt75", "not_twice": True}, {"use": "lament", "every": 2}, {"use": "kiss"}],
    "She weeps for the drowned. Her tears close their wounds.")
enemy("anchor_brute", "Anchor Brute", 64, 2, "foe", (520, 760), {
    "swing": I("Anchor Swing", "attack", "front", [D(14), PUSH(1)], "14 to the front hero; knocks them back 1"),
    "drag": I("Drag Under", "attack", "back", [D(8), PULL(3)], "8 to the rearmost hero; drags them to the front"),
    "brace": I("Set the Anchor", "defend", "self", [B(14)], "14 Block"),
}, [{"use": "brace", "if": "hp_pct<35", "not_twice": True}, {"use": "drag", "every": 3}, {"use": "swing"}],
    "The anchor chain runs through his arm. He has stopped noticing.")
enemy("crab", "Wreck Crab", 38, 6, "foe", (480, 560), {
    "pinch": I("Pinch", "attack", "front", [D(8), ST("bleed", 2)], "8 and 2 Bleed to the front hero"),
    "shell": I("Shell Up", "defend", "self", [B(10)], "10 Block"),
    "scuttle": I("Scuttle", "attack", "back", [D(7)], "7 to the rearmost hero"),
}, [{"use": "shell", "every": 3}, {"use": "scuttle", "every": 3, "offset": 1}, {"use": "pinch"}],
    "It wears what it ate.")
enemy("choirboy", "Drowned Choirboy", 24, 0, "foe", (400, 600), {
    "hymn": I("Hymn", "defend", "all_allies", [B(5)], "every foe gains 5 Block"),
    "wail": I("Endless Wail", "debuff", "all_heroes", [STRESS(11)], "11 stress to every hero"),
    "pray": I("Pray", "heal", "self", [H(6)], "heals itself 6"),
}, [{"use": "pray", "if": "hp_pct<50", "not_twice": True}, {"use": "wail", "every": 2}, {"use": "hymn"}],
    "He has been singing since the water came in. He does not need to breathe to sing.")
# ------------------------------------------------------------------ elites
enemy("warden", "Hollow Tidewarden", 104, 4, "elite", (560, 800), {
    "trident": I("Trident", "attack", "front", [D(18)], "18 to the front hero"),
    "sweep": I("Tidal Sweep", "attack", "all_heroes", [D(7), A("water", 1, attr="stable")], "7 and 1 Water to every hero"),
    "bulwark": I("Barnacle Wall", "defend", "self", [B(14), {"t": "guard_weakest"}], "14 Block; guards a wounded foe"),
}, [{"use": "bulwark", "if": "ally_hurt", "not_twice": True}, {"use": "sweep", "every": 3}, {"use": "trident"}],
    "A temple guard grown into the sea. Something lives in the hole in its chest.")
enemy("abbess", "Abbess of Salt", 96, 2, "elite", (560, 800), {
    "sermon": I("Brine Sermon", "debuff", "all_heroes", [STRESS(14), A("water", 1, attr="stable")], "14 stress and 1 Water to every hero"),
    "salt": I("Salt the Wound", "attack", "front", [D(12), ST("vulnerable", 1)], "12 and Vulnerable to the front hero"),
    "rites": I("Last Rites", "heal", "ally_lowest", [H(20)], "heals the most wounded foe 20"),
}, [{"use": "rites", "if": "ally_hurt", "not_twice": True}, {"use": "sermon", "every": 2, "offset": 1}, {"use": "salt"}],
    "Her mouth is sewn shut. She preaches anyway.")
enemy("kraken_arm", "The Grasping Deep", 120, 2, "elite", (560, 800), {
    "slam": I("Slam", "attack", "front", [D(16)], "16 to the front hero"),
    "constrict": I("Constrict", "attack", "back", [D(8), ST("anchor", 1), STRESS(8)], "8 and 8 stress to the rearmost hero; holds them in place"),
    "drag": I("Drag Below", "attack", "back", [D(6), PULL(3), A("void", 2, attr="stable")], "6 and 2 Void to the rearmost hero; drags them to the front"),
}, [{"use": "drag", "every": 3}, {"use": "constrict", "every": 3, "offset": 1}, {"use": "slam"}],
    "Only one arm reaches up through the floor. Pray it is only one.")
enemy("pearl_diver", "Pearl Diver", 70, 0, "elite", (560, 800), {
    "knife": I("Shucking Knife", "attack", "back", [D(7, times=2)], "7 twice to the rearmost hero"),
    "pearl": I("Black Pearl", "debuff", "back", [A("toxin", 4, attr="stable"), ST("mark", 1)], "4 Toxin to the rearmost hero and Marks them"),
    "vanish": I("Sink from Sight", "defend", "self", [B(8), self_st("dodge", 2)], "8 Block; dodges the next two hits"),
}, [{"use": "vanish", "if": "hp_pct<50", "not_twice": True}, {"use": "pearl", "every": 3}, {"use": "knife"}],
    "It goes for the soft ones at the back. It always has.")
# ------------------------------------------------------------------ bosses
enemy("drowned_king", "The Drowned King", 240, 4, "boss", (700, 900), {
    "decree": I("Tidal Decree", "attack", "all_heroes", [D(10)], "10 to every hero"),
    "regal": I("Regal Strike", "attack", "front", [D(22)], "22 to the front hero"),
    "crown": I("Crown of Tides", "debuff", "all_heroes", [STRESS(16), A("water", 2, attr="stable")], "16 stress and 2 Water to every hero"),
    "drown": I("Drown the Court", "debuff", "all_heroes", [A("void", 2, attr="volatile"), STRESS(6)], "2 Volatile Void and 6 stress to every hero"),
    "feast": I("Royal Feast", "heal", "self", [H(24), self_st("might", 2)], "heals 24 and gains 2 Might"),
}, [{"use": "feast", "if": "hp_pct<40", "not_twice": True}, {"use": "drown", "if": "hp_pct<60", "every": 2}, {"use": "crown", "every": 3}, {"use": "decree", "every": 3, "offset": 1}, {"use": "regal"}],
    "He kept his crown. The sea grew it into him.")
enemy("mother_of_brine", "Mother of Brine", 210, 0, "boss", (700, 900), {
    "lullaby": I("Lullaby", "debuff", "all_heroes", [STRESS(18)], "18 stress to every hero"),
    "embrace": I("Embrace", "attack", "front", [D(14, lifesteal=100)], "14 to the front hero, healing herself"),
    "flood": I("Brine Flood", "attack", "all_heroes", [D(6), A("water", 2, attr="stable")], "6 and 2 Water to every hero"),
    "devour": I("Devour the Weak", "attack", "back", [D(20)], "20 to the rearmost hero"),
}, [{"use": "devour", "if": "hero_dd"}, {"use": "lullaby", "every": 3}, {"use": "flood", "every": 3, "offset": 1}, {"use": "embrace"}],
    "Every siren is her daughter. Every drowned child is hers.")
enemy("bell_below", "The Bell Below", 280, 6, "boss", (700, 900), {
    "toll": I("Toll for the Living", "debuff", "all_heroes", [STRESS(20)], "20 stress to every hero"),
    "resonance": I("Resonance", "attack", "all_heroes", [D(12)], "12 to every hero"),
    "crack": I("Crack of the Bell", "attack", "front", [D(26), STRESS(8)], "26 and 8 stress to the front hero"),
    "reach": I("Reaching Dead", "attack", "back", [D(10), PULL(2)], "10 to the rearmost hero; drags them forward 2"),
}, [{"use": "toll", "every": 4}, {"use": "resonance", "every": 4, "offset": 1}, {"use": "reach", "every": 4, "offset": 2}, {"use": "crack"}],
    "Rung once for every soul that drowned. It has not stopped ringing.")

# boss phases: at each HP threshold (percent) the boss changes its rules. Executes only drop a boss to its next threshold.
E["drowned_king"]["phases"] = [
    {"at": 60, "text": "The King rises from the throne.", "ai": [{"use": "drown", "every": 2}, {"use": "decree", "every": 3}, {"use": "regal"}]},
    {"at": 30, "text": "The King gorges on his court.", "ai": [{"use": "feast", "not_twice": True, "every": 3}, {"use": "drown", "every": 2}, {"use": "regal"}], "might": 2}]
E["mother_of_brine"]["phases"] = [
    {"at": 55, "text": "The Mother's song turns to a scream.", "ai": [{"use": "lullaby", "every": 2}, {"use": "devour", "if": "hero_dd"}, {"use": "embrace"}], "might": 1},
    {"at": 25, "text": "She devours her own.", "ai": [{"use": "devour"}], "heal": 20}]
E["bell_below"]["phases"] = [
    {"at": 50, "text": "The bell cracks. Something inside wakes.", "ai": [{"use": "resonance", "every": 2}, {"use": "reach", "every": 3}, {"use": "crack"}], "might": 2}]
for k in ("kraken_arm", "drowned_king", "mother_of_brine", "bell_below"):
    E[k]["span"] = 2

ROOMS = [
    ("The Flooded Stair", "Two drowned thralls shamble up from the nave.", ["thrall", "thrall"], "stair", "foe"),
    ("The Eel Pools", "Things that bite, and keep biting.", ["eelkin", "lamprey", "eelkin"], "stair", "foe"),
    ("The Drowned Belfry", "A boy still singing, a ringer still ringing.", ["bellringer", "choirboy", "thrall"], "belfry", "foe"),
    ("The Sunken Nave", "The Tidewarden keeps the Siren's song.", ["warden", "siren"], "nave", "elite"),
    ("The Barnacle Gate", "A knight of the drowned order and what lives in his shadow.", ["barnacle_knight", "crab"], "nave", "foe"),
    ("The Ossuary Tide", "Bones, a swollen body, and a fisherman.", ["bloated", "thrall", "hookline"], "ossuary", "foe"),
    ("The Weeping Cloister", "The sisters mourn. The brute keeps the door.", ["anchor_brute", "weeping_nun", "choirboy"], "ossuary", "foe"),
    ("The Abbess Holds Court", "Salt sermon in a drowned chapter house.", ["abbess", "weeping_nun"], "nave", "elite"),
    ("The Grasping Deep", "The floor gives way to something enormous.", ["kraken_arm", "eelkin"], "stair", "elite"),
    ("The Pearl Diver", "It goes for the ones at the back.", ["hookline", "pearl_diver"], "ossuary", "elite"),
    ("The Bell Below", "Boss. The bell that rings for the drowned.", ["bell_below"], "belfry", "boss"),
    ("Mother of Brine", "Boss. The siren-matriarch and her daughter.", ["siren", "mother_of_brine"], "throne", "boss"),
    ("The Drowned King", "Boss. The king, and his last loyal knight.", ["barnacle_knight", "drowned_king"], "throne", "boss"),
]
encounters = [{"name": n, "desc": d, "enemies": e, "room": r, "tier": t, "world": "drowned"} for n, d, e, r, t in ROOMS]
for v in E.values():
    v["world"] = "drowned"
# resistances for the Drowned Kingdom (water + void)
for k, rs in {"thrall": {"water": "resist"}, "siren": {"water": "resist", "lightning": "weak"}, "eelkin": {"water": "resist", "lightning": "weak"},
              "bellringer": {"void": "resist"}, "barnacle_knight": {"physical": "resist", "water": "resist", "lightning": "weak"}, "lamprey": {"water": "resist", "physical": "resist"},
              "bloated": {"toxin": "immune", "water": "resist", "fire": "weak"}, "hookline": {"water": "resist"}, "crab": {"physical": "resist", "water": "immune", "lightning": "weak"},
              "kraken_arm": {"water": "immune", "lightning": "weak"}, "pearl_diver": {"water": "resist", "void": "resist"},
              "drowned_king": {"water": "immune", "void": "resist", "lightning": "weak"}, "mother_of_brine": {"water": "immune", "lightning": "weak"}, "bell_below": {"void": "immune", "physical": "resist", "lightning": "weak"}}.items():
    if k in E:
        E[k]["resist"] = rs
import worlds  # noqa: E402  the fourteen other doors
E.update(worlds.E)
encounters += worlds.ROOMS
WORLDS = {"drowned": {"name": "The Drowned Kingdom", "pair": ["void", "water"], "conjunction": "Drown", "blurb": "A cathedral kingdom at the bottom of the sea. The bells still ring for the drowned.",
                      "rooms": ["stair", "nave", "belfry", "ossuary", "throne"], "foes": [k for k, v in E.items() if v.get("world") == "drowned" and v["tier"] == "foe"],
                      "elites": [k for k, v in E.items() if v.get("world") == "drowned" and v["tier"] == "elite"], "bosses": ["drowned_king", "bell_below", "mother_of_brine"]}}
WORLDS.update(worlds.WORLDS)
# the gauntlet route: seven rooms ending at the king
GAUNTLET = [0, 1, 2, 3, 5, 7, 12]

out = os.path.join(os.path.dirname(__file__), "..", "..", "data")
json.dump(E, open(os.path.join(out, "enemies.json"), "w"), indent=1)
json.dump({"rooms": encounters, "gauntlet": GAUNTLET}, open(os.path.join(out, "encounters.json"), "w"), indent=1)
import story  # noqa: E402  the road through the doors
json.dump(story.apply(WORLDS), open(os.path.join(out, "story.json"), "w"), indent=1)
json.dump(WORLDS, open(os.path.join(out, "worlds.json"), "w"), indent=1)
print("enemies", len(E), "rooms", len(encounters))
for k, v in E.items():
    assert v["ai"][-1].get("if") is None and v["ai"][-1].get("every") is None, k
    for r in v["ai"]:
        assert r["use"] in v["intents"], (k, r)
