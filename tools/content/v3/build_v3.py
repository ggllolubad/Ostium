"""Gate 3 content build and checks. Usage:

  python3 tools/content/v3/build_v3.py              build everything present, validate, write build/data_v3/
  python3 tools/content/v3/build_v3.py --budget     also print every card's budget points against its cost
  python3 tools/content/v3/build_v3.py --only bulwark,world_rime    check only these modules (plus neutral)
  python3 tools/content/v3/build_v3.py --rooms      list each world's rooms

Modules in this folder: one per calling (bulwark.py ...), neutral.py (Swap, curses, neutral cards, afflictions) and
world_<key>.py (creatures, encounters and the world's 4 cards). See docs/design/GATE3_VOCAB.md."""
import importlib, json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, os.path.join(HERE, ".."))
sys.path.insert(0, HERE)
import dsl  # noqa: E402
import creatures as cr  # noqa: E402

CALLINGS = ["bulwark", "duelist", "elementalist", "alchemist", "oracle", "hexweaver", "vessel"]
WORLDS = json.load(open(os.path.join(ROOT, "data", "worlds.json")))
ROOMS = sorted(f[:-5] for f in os.listdir(os.path.join(ROOT, "data", "rooms")) if f.endswith(".json"))
PREFIX = {"drowned": None, "rime": "rime", "foundry": "foundry", "baths": "baths", "pits": "pits", "pyre": "pyre",
          "spire": "spire", "fleet": "fleet", "barrow": "barrow", "silence": "silence", "coast": "coast", "hive": "hive",
          "sky": "sky", "mire": "mire", "garden": "garden"}
DROWNED_ROOMS = ["stair", "nave", "belfry", "ossuary", "throne", "brine_grotto"]


def world_rooms(w):
    if w == "drowned":
        return DROWNED_ROOMS
    return [r for r in ROOMS if r.startswith(PREFIX[w] + "_")]


def ruler_room(w):
    return "throne" if w == "drowned" else PREFIX[w] + "_boss"


args = sys.argv[1:]
if "--rooms" in args:
    for w, v in WORLDS.items():
        print(f"{w:8} {v['name']:24} ruler room: {ruler_room(w):14} others: {', '.join(r for r in world_rooms(w) if r != ruler_room(w))}")
    sys.exit(0)
only = None
if "--only" in args:
    only = set(args[args.index("--only") + 1].split(","))

mods = []
for f in sorted(os.listdir(HERE)):
    if not f.endswith(".py") or f in ("build_v3.py", "creatures.py", "budget.py") or f.startswith("_"):
        continue
    m = f[:-3]
    if only and m not in only and m != "neutral":
        continue
    mods.append(m)
# neutral first (Swap and curses), then callings, then worlds
mods.sort(key=lambda m: (m != "neutral", m not in CALLINGS, m))

heroes, needs, owner = {}, {}, {}
for m in mods:
    before = set(dsl.CARDS)
    cbefore = set(cr.CREATURES)
    try:
        mod = importlib.import_module(m)
    except Exception as ex:  # a module another agent is still writing must not break your check
        if only and m not in only:
            print(f"(skipped {m}: {type(ex).__name__}: {ex})")
            for cid in set(dsl.CARDS) - before:
                del dsl.CARDS[cid]
            continue
        raise
    for cid in set(dsl.CARDS) - before:
        owner[cid] = m
    for k in set(cr.CREATURES) - cbefore:
        owner["creature:" + k] = m
    if hasattr(mod, "HERO"):
        heroes[m] = dict(mod.HERO)
    needs[m] = list(getattr(mod, "NEEDS", []))

# intent text again now that every creature and card exists (summons and added cards name what they bring)
for _k, _c in cr.CREATURES.items():
    for _it in _c["intents"].values():
        _it["text"] = cr.text_of(_it["fx"], _it["target"], _c.get("charge_name") or "charge")

# ------------------------------------------------------------------ vocabulary
FX = {"dmg", "coup", "dmg_per_element", "block", "self_block", "block_target", "armor", "ward", "status", "self_status", "clear",
      "apply", "apply_x", "apply_attuned", "apply_next", "apply_missing", "react", "attune", "attune_to", "push", "pull", "advance",
      "retreat", "to_front", "swap", "guard", "guard_weakest", "prime", "bash_stun", "heal", "stress", "self_stress", "self_dmg",
      "draw", "energy", "bank", "add", "consume", "double", "spread", "convert", "cleanse", "transfer", "execute", "delay", "turn",
      "steal_block", "omen", "cap", "grit", "kill_self_hp", "stress_take",
      "brew", "refill", "improve", "unbind", "discard_random", "lose_armor", "summon", "take", "give", "even", "lose_hp"}
QG = {"x", "consumed", "dealt", "killed", "prime_count", "reactions", "enemies", "allies", "allies_dd", "same_target", "round",
      "incoming", "incoming_me", "attackers", "elements_all", "total_bleed", "total_frost", "total_hex", "total_doom", "ally_hurt",
      "ally_hurt75", "hero_dd", "hero_stress", "flasks", "flasks_used",
      "vigour_left", "vigour_spent", "vigour_pool", "cost", "ordo_pos", "ordo_len", "ordo_after", "spent_before", "heroes_before",
      "handoff", "first", "last", "lost", "carried", "base_cost"}
STATUS = {"bleed", "stun", "mark", "vulnerable", "might", "focus", "momentum", "riposte", "taunt", "thorns", "dodge", "regen",
          "hex", "doom", "fortify", "anchor", "tenacity", "charge", "blight", "neuro", "lockdown", "empower", "thrift"}
ELS = {"fire", "frost", "lightning", "water", "toxin", "void"}
QU = {"hp", "max_hp", "block", "armor", "ward", "stress", "grit", "omen", "played", "resolve", "missing_hp", "hp_pct", "dd", "rank",
      "elements", "spectrum", "el_total", "el_max", "attuned", "attacking", "targeting_me", "moved", "exhaust", "discard", "hand",
      "draw", "debuffs", "ailments", "scars", "cap", "delayed", "incoming_to", "targeted", "held_total", "held_kinds", "held_max",
      "held_min"} | ELS | STATUS | {"held_" + e for e in ELS}
KW = {"Exhaust", "Retain", "Echo", "Rite", "Finisher", "Execute", "Fresh", "Dosed", "Curse", "Affliction", "Flask",
      "Unplayable", "Temporary"}
RAR = {"S", "C", "U", "R", "X", "L", "K", "F", "N", "W", "A", "Curse", "T"}   # T: a token a card makes (never offered)
TGT = {"enemy", "all_enemies", "self", "ally", "ally_other", "adjacent_ally", "all_allies", "none"}
TO = {"self", "target", "all_enemies", "all_allies", "allies_other", "adjacent", "behind", "in_front", "front_enemy",
      "lowest_ally", "attackers", "front2", "self_adjacent", "killer"}
RITE_ON = {"round_start", "round_end", "play", "flask", "conjunction", "kill", "hit", "ally_hit", "execute"}
CATS = {"physical", "attuned"} | ELS
DASH = re.compile("—|–|--")

bad = []


def err(where, msg):
    bad.append(f"{owner.get(where, '?')}: {where}: {msg}")


def qok(name):
    n = name.lstrip("!")
    if n.startswith("t.") or n.startswith("m."):
        return n[2:] in QU
    return n in QG or n in QU


def check_cond(where, c):
    for part in c.split("&"):
        part = part.strip()
        if not part:
            continue
        for side in re.split(r">=|<=|==|!=|>|<", part):
            side = side.strip()
            if side and not re.match(r"^-?\d+(\.\d+)?$", side) and not qok(side):
                err(where, f"unknown quantity '{side}' in condition '{c}'")


def check_fx(where, fxs, enemy=False):
    for f in fxs:
        t = f.get("t")
        if t not in FX:
            err(where, f"unknown effect '{t}'")
            continue
        if "per" in f and not qok(f["per"]):
            err(where, f"unknown quantity '{f['per']}'")
        if "times_per" in f and not qok(f["times_per"]):
            err(where, f"unknown quantity '{f['times_per']}'")
        if t in ("status", "self_status", "clear") and f.get("s") not in STATUS:
            err(where, f"unknown status '{f.get('s')}'")
        if t in ("apply", "consume", "double", "spread", "convert", "take", "give") and f.get("e") and f["e"] not in ELS | {"all", "largest"}:
            err(where, f"unknown course '{f['e']}'")
        if "to" in f and f["to"] not in TO:
            err(where, f"unknown 'to' target '{f['to']}'")
        if "if" in f:
            check_cond(where, f["if"])
        if t == "add" and f.get("card") not in dsl.CARDS:
            err(where, f"adds unknown card '{f.get('card')}'")
        if t == "brew" and dsl.CARDS.get(f.get("card"), {}).get("rarity") != "F":
            err(where, f"brews '{f.get('card')}', which is not a flask (rarity F)")
        if t == "summon":
            if not enemy:
                err(where, "only creatures summon")
            elif f.get("e") not in cr.CREATURES:
                err(where, f"summons unknown creature '{f.get('e')}'")


def check_text(where, label, s, limit=None):
    if not isinstance(s, str) or not s.strip():
        err(where, f"missing {label}")
        return
    if DASH.search(s):
        err(where, f"{label} uses a dash (style rule)")
    if limit and len(s) > limit:
        err(where, f"{label} is {len(s)} characters (limit {limit})")


# ------------------------------------------------------------------ cards
PLAYER = {"S", "C", "U", "R", "X", "L", "K", "N", "W", "F"}
for cid, c in dsl.CARDS.items():
    if c["rarity"] not in RAR:
        err(cid, f"unknown rarity '{c['rarity']}'")
    if c["target"] not in TGT:
        err(cid, f"unknown target '{c['target']}'")
    if c.get("cat", "physical") not in CATS:
        err(cid, f"unknown cat '{c.get('cat')}'")
    for k in c.get("kw", []):
        if k not in KW:
            err(cid, f"keyword '{k}' is not on the closed list")
    check_fx(cid, c["fx"])
    check_text(cid, "text", c["text"])
    if c["rarity"] in PLAYER | {"A"}:
        check_text(cid, "flavour", c.get("flavour"), 90)
    if c["rarity"] in PLAYER - {"F"} and c["rarity"] != "K" or c["rarity"] == "K" and c["cls"] != "shared":
        check_text(cid, "art note", c.get("note"))
        if not c.get("arch"):
            err(cid, "missing arch")
    if c["rarity"] in PLAYER - {"K"} or (c["rarity"] == "K" and c["cls"] != "shared"):
        up = c.get("up")
        if not up:
            err(cid, "missing upgrade")
        else:
            check_text(cid, "upgrade text", up.get("text"))
            if "fx" in up:
                check_fx(cid + "+", up["fx"])
            if "kw" in up:
                for k in up["kw"]:
                    if k not in KW:
                        err(cid, f"upgrade keyword '{k}' is not on the closed list")
    if c["rarity"] in ("X", "L") and not c.get("sub"):
        err(cid, "path and legendary cards need sub=")
    if c["rarity"] == "W" and c.get("world") not in WORLDS:
        err(cid, f"world card needs world= one of {list(WORLDS)}")
    if c["rarity"] == "A" and not c.get("on_draw"):
        err(cid, "afflictions need on_draw")
    if c.get("on_draw"):
        check_fx(cid, c["on_draw"])
    if c.get("cost_less"):
        cl = c["cost_less"]
        if cl.get("per") not in {"ordo", "heroes", "others", "attacks"} | QU:
            err(cid, "cost_less reads an unknown quantity: %s" % cl.get("per"))
        if not isinstance(c["cost"], int) or c["cost"] < 1:
            err(cid, "cost_less needs a card that costs 1 or more")
    if "Rite" in c.get("kw", []):
        r = c.get("rite")
        if not r or r.get("on") not in RITE_ON:
            err(cid, f"Rite card needs rite={{'on': one of {sorted(RITE_ON)}, 'fx': [...]}}")
        else:
            check_fx(cid, r.get("fx", []))
            if "if" in r:
                check_cond(cid, r["if"])
    elif c.get("rite"):
        err(cid, "has rite= but not the Rite keyword")

# ------------------------------------------------------------------ callings
WANT = {"S": 5, "C": 24, "U": 20, "R": 12, "X": 18, "L": 6}
for h, H in heroes.items():
    cards = {cid: c for cid, c in dsl.CARDS.items() if c["cls"] == h}
    subs = H.get("subclasses", {})
    for r, n in WANT.items():
        got = sum(1 for c in cards.values() if c["rarity"] == r)
        if got != n:
            err(h, f"{got} {r} cards (want {n})")
    for sub in subs:
        for r, n in (("X", 6), ("L", 2)):
            got = sum(1 for c in cards.values() if c["rarity"] == r and c.get("sub") == sub)
            if got != n:
                err(h, f"path {sub}: {got} {r} cards (want {n})")
    for cid, c in cards.items():
        if c.get("sub") and c["sub"] not in subs:
            err(cid, f"sub '{c['sub']}' is not one of {list(subs)}")
    kits = [cid for cid, c in cards.items() if c["rarity"] == "K"]
    if len([k for k in kits if not dsl.CARDS[k].get("sub")]) != 1:
        err(h, f"needs exactly 1 base kit skill, has {kits}")
    if sorted(H.get("kit", [])) != sorted(k for k in kits if not dsl.CARDS[k].get("sub")):
        err(h, "HERO['kit'] must list the base kit skill")
    deck = H.get("deck", [])
    if len(deck) != 10 or any(dsl.CARDS.get(d, {}).get("rarity") != "S" for d in deck):
        err(h, "HERO['deck'] must be 10 starter cards")
    for k in ("name", "hp", "armor", "grit", "color", "subclasses", "blurb"):
        if k not in H:
            err(h, f"HERO missing '{k}'")

# ------------------------------------------------------------------ creatures and encounters
BANDS = {"foe": (28, 52), "elite": (80, 130), "ruler": (220, 320)}  # base numbers; Threat multiplies them
for k, c in cr.CREATURES.items():
    w = "creature:" + k
    if c["world"] not in WORLDS:
        err(w, f"world '{c['world']}' unknown")
    lo, hi = BANDS[c["tier"]]
    if not lo <= c["hp"] <= hi:
        err(w, f"HP {c['hp']} outside the {c['tier']} band {lo} to {hi}")
    if c["span"] not in (1, 2) or (c["tier"] == "foe" and c["span"] != 1):
        err(w, f"span {c['span']} not allowed for a {c['tier']}")
    if c["tier"] == "ruler" and c["span"] != 2:
        err(w, "rulers take 2 ranks")
    if c["tier"] == "ruler" and not 2 <= len(c["phases"]) <= 3:
        err(w, "rulers need 2 or 3 phases")
    nt = len(c["traits"])
    if (c["tier"] == "foe" and nt > 1) or (c["tier"] == "elite" and nt != 1) or (c["tier"] == "ruler" and not 1 <= nt <= 2):
        err(w, f"{nt} traits for a {c['tier']} (foes 0 or 1, elites 1, rulers 1 or 2)")
    if not c["intents"]:
        err(w, "no intents")
    if c["tier"] == "foe" and len(c["intents"]) > 4:
        err(w, "a foe has at most 4 moves")
    for iid, it in c["intents"].items():
        check_fx(w + "." + iid, it["fx"], enemy=True)
    for tr in c["traits"]:
        check_fx(w + " trait", tr["fx"], enemy=True)
    rule_sets = [c["ai"]] + [p.get("ai", []) for p in c["phases"]]
    for rules in rule_sets:
        if not rules:
            continue
        for r in rules:
            if r.get("use") not in c["intents"]:
                err(w, f"AI uses unknown intent '{r.get('use')}'")
            if "if" in r:
                check_cond(w, r["if"])
        last = rules[-1]
        if "if" in last or "every" in last or last.get("once"):
            err(w, "the last AI rule must have no condition")
    if not c["ai"]:
        err(w, "no AI rules")
    check_text(w, "lore", c["lore"])

for w in WORLDS:
    big = [k for k, c in cr.CREATURES.items() if c["world"] == w and c["tier"] == "elite" and c["span"] == 2]
    if len(big) > 1:
        err("world:" + w, f"{len(big)} two-rank elites (at most 1): {big}")
for e in cr.ENCOUNTERS:
    where = f"encounter {e['world']}/{e['key']}"
    owner[where] = "world_" + e["world"]
    spans = 0
    for k in e["enemies"]:
        if k not in cr.CREATURES:
            err(where, f"unknown creature '{k}'")
        else:
            spans += cr.CREATURES[k]["span"]
    if spans > 4:
        err(where, f"takes {spans} ranks (at most 4)")
    if e["room"] not in ROOMS:
        err(where, f"room '{e['room']}' does not exist")
    if e["tier"] == "ruler":
        if e["room"] != ruler_room(e["world"]):
            err(where, f"rulers fight in {ruler_room(e['world'])}")
        if spans != 4:
            err(where, "ruler fights start with all 4 ranks filled")
    if e["tier"] == "foe" and any(cr.CREATURES.get(k, {}).get("span", 1) == 2 for k in e["enemies"]):
        err(where, "a foe group holds a two-rank creature")
for w in WORLDS:
    big = [k for k, c in cr.CREATURES.items() if c["world"] == w and c["tier"] == "elite" and c["span"] == 2]
    if big:
        n = sum(1 for e in cr.ENCOUNTERS if e["world"] == w and big[0] in e["enemies"])
        if n > 1:
            err("world:" + w, f"two-rank elite {big[0]} appears in {n} groups (at most 1)")

# ------------------------------------------------------------------ budget
import budget  # noqa: E402
rows = budget.report(dsl.CARDS)
flagged = [r for r in rows if r["flag"]]

# ------------------------------------------------------------------ write
out = os.path.join(ROOT, "build", "data_v3" if not only else "data_v3_partial_" + "_".join(sorted(only)))   # one folder per module set, so parallel builds do not collide
os.makedirs(out, exist_ok=True)
json.dump(dsl.CARDS, open(os.path.join(out, "cards.json"), "w"), indent=0)
json.dump(heroes, open(os.path.join(out, "heroes.json"), "w"), indent=1)
json.dump(cr.CREATURES, open(os.path.join(out, "creatures.json"), "w"), indent=0)
json.dump(cr.ENCOUNTERS, open(os.path.join(out, "encounters.json"), "w"), indent=0)
json.dump({m: n for m, n in needs.items() if n}, open(os.path.join(out, "needs.json"), "w"), indent=1)

from collections import Counter  # noqa: E402
for h in heroes:
    cnt = Counter(c["rarity"] for c in dsl.CARDS.values() if c["cls"] == h)
    print(f"{h:13} {sum(cnt.values()):3} cards {dict(sorted(cnt.items()))}")
other = Counter(c["rarity"] for c in dsl.CARDS.values() if c["cls"] not in heroes)
if other:
    print(f"{'other':13} {sum(other.values()):3} cards {dict(sorted(other.items()))}")
tiers = Counter((c["world"], c["tier"]) for c in cr.CREATURES.values())
for w in WORLDS:
    if any(k[0] == w for k in tiers):
        enc = Counter(e["tier"] for e in cr.ENCOUNTERS if e["world"] == w)
        print(f"{w:13} creatures foe {tiers[(w, 'foe')]} elite {tiers[(w, 'elite')]} ruler {tiers[(w, 'ruler')]}; "
              f"encounters {dict(enc)}")
if "--budget" in args:
    budget.print_rows(rows)
print(f"budget: {len(flagged)} of {len(rows)} budgeted cards more than 20% off" + (" (--budget lists them)" if flagged else ""))
for m, n in needs.items():
    for line in n:
        print(f"NEEDS {m}: {line}")
# ------------------------------------------------------------------ install into data/ (the game's files)
if "--install" in args and not only:
    if bad:
        print("not installing: fix the validation problems first")
    else:
        FACES = {'bulwark': (440, 700, 190, 60, 80, 100), 'duelist': (520, 700, 226, 150, 100, 120),
                 'elementalist': (460, 700, 206, 110, 104, 124), 'alchemist': (460, 700, 214, 112, 110, 124),
                 'oracle': (460, 700, 206, 92, 96, 116), 'hexweaver': (460, 700, 206, 112, 104, 120),
                 'vessel': (460, 700, 206, 110, 104, 124)}
        data = os.path.join(ROOT, "data")
        hs = {}
        for h, H in heroes.items():
            H = dict(H)
            H["art"] = f"res://assets/art/{h}.png"
            W_, H_, x, y, w, hh = FACES[h]
            H["face"] = [round(x / W_, 3), round(y / H_, 3), round(w / W_, 3), round(hh / H_, 3)]
            hs[h] = H
        CANVAS = {"foe": (460, 700), "elite": (560, 800), "ruler": (700, 900)}
        en = {}
        for k, c in cr.CREATURES.items():
            e = dict(c)
            e["tier"] = "boss" if c["tier"] == "ruler" else c["tier"]
            cw, ch = CANVAS[c["tier"]]
            e["art"] = f"res://assets/art/rigs/{k}/full.png"
            e["size"] = [round(cw * 0.471), round(ch * 0.471)]
            e["feet"] = round((ch - 24 * ch / 700) / ch, 4)
            en[k] = e
        rooms = []
        for e in cr.ENCOUNTERS:
            r = dict(e)
            r["tier"] = "boss" if e["tier"] == "ruler" else e["tier"]
            rooms.append(r)
        gauntlet = [i for i, r in enumerate(rooms) if r["world"] == "drowned" and r["tier"] == "foe"][:4]
        gauntlet += [i for i, r in enumerate(rooms) if r["world"] == "drowned" and r["tier"] == "elite"][:2]
        gauntlet += [i for i, r in enumerate(rooms) if r["world"] == "drowned" and r["tier"] == "boss"][:1]
        worlds = json.load(open(os.path.join(data, "worlds.json")))
        for w, v in worlds.items():
            v["foes"] = [k for k, c in cr.CREATURES.items() if c["world"] == w and c["tier"] == "foe"]
            v["elites"] = [k for k, c in cr.CREATURES.items() if c["world"] == w and c["tier"] == "elite"]
            v["bosses"] = [k for k, c in cr.CREATURES.items() if c["world"] == w and c["tier"] == "ruler"]
        json.dump(dsl.CARDS, open(os.path.join(data, "cards.json"), "w"), indent=0)
        json.dump(hs, open(os.path.join(data, "heroes.json"), "w"), indent=1)
        json.dump(en, open(os.path.join(data, "enemies.json"), "w"), indent=0)
        json.dump({"rooms": rooms, "gauntlet": gauntlet}, open(os.path.join(data, "encounters.json"), "w"), indent=0)
        json.dump(worlds, open(os.path.join(data, "worlds.json"), "w"), indent=1)
        # commissions: the role maps' charge for each ruler, joined to the ruler's creature key by name
        def _n(x):
            return re.sub(r"[^a-z]", "", re.sub(r"\bthe\b", "", x.lower()))
        src = json.load(open(os.path.join(HERE, "commissions_src.json")))
        coms, missing = {}, []
        for w, items in src.items():
            for it in items:
                k = next((k for k, c in cr.CREATURES.items() if c["world"] == w and c["tier"] == "ruler" and _n(c["name"]) == _n(it["name"])), None)
                if k is None:
                    missing.append(f"{w}: {it['name']}")
                    continue
                coms.setdefault(w, []).append({"ruler": k, "name": it["name"], "text": it["text"]})
        json.dump(coms, open(os.path.join(data, "commissions.json"), "w"), indent=1)
        # archetype plans for the build-aware simulator: each path's cards (and hybrids of two paths of one calling)
        RW = {"S": 0, "C": 2, "U": 2.5, "R": 3, "X": 3, "L": 3}
        builds = {}
        for h, H in heroes.items():
            subs = list(H.get("subclasses", {}))
            keyc = getattr(sys.modules.get(h), "ARCHETYPES", {}) or {}
            def plan(tags):
                cards = {}
                for cid, c in dsl.CARDS.items():
                    if c["cls"] != h or c["rarity"] not in RW or not RW[c["rarity"]]:
                        continue
                    tag = set(c.get("arch", "").split("+"))
                    if tag & tags:
                        cards[cid] = RW[c["rarity"]] + (1 if any(cid in keyc.get(t, []) for t in tags) else 0)
                return cards
            for sub in subs:
                builds[f"{h}:{sub}"] = {"cls": h, "sub": sub, "cards": plan({sub}), "key": keyc.get(sub, [])}
            for i in range(len(subs)):
                for j in range(i + 1, len(subs)):
                    builds[f"{h}:{subs[i]}+{subs[j]}"] = {"cls": h, "sub": subs[i], "cards": plan({subs[i], subs[j]}),
                                                         "key": keyc.get(subs[i], []) + keyc.get(subs[j], [])}
        json.dump(builds, open(os.path.join(data, "archetypes.json"), "w"), indent=1)
        if missing:
            print("commissions with no matching ruler:", missing)
        print(f"installed into data/: {len(dsl.CARDS)} cards, {len(hs)} callings, {len(en)} creatures, {len(rooms)} encounters")
print("validation problems:", "none" if not bad else "")
for b in bad:
    print("  " + b)
sys.exit(1 if bad else 0)
