"""Builds data/cards.json and data/heroes.json from the class modules."""
import json, os, sys, importlib
sys.path.insert(0, os.path.dirname(__file__))
import dsl
CLASSES = ["bulwark", "duelist", "elementalist", "alchemist", "oracle", "hexweaver"]
heroes = {}
FACES = {'bulwark': (440, 700, 190, 60, 80, 100), 'duelist': (520, 700, 226, 150, 100, 120), 'elementalist': (460, 700, 206, 110, 104, 124), 'alchemist': (460, 700, 214, 112, 110, 124), 'oracle': (460, 700, 206, 92, 96, 116), 'hexweaver': (460, 700, 206, 112, 104, 120)}
import shared  # noqa
for c in CLASSES:
    m = importlib.import_module(c)
    h = dict(m.HERO)
    h["art"] = f"res://assets/art/{c}.png"
    W, H, x, y, w, hh = FACES[c]
    h["face"] = [round(x / W, 3), round(y / H, 3), round(w / W, 3), round(hh / H, 3)]
    heroes[c] = h
out = os.path.join(os.path.dirname(__file__), "..", "..", "data")
os.makedirs(out, exist_ok=True)
json.dump(dsl.CARDS, open(os.path.join(out, "cards.json"), "w"), indent=0)
json.dump(heroes, open(os.path.join(out, "heroes.json"), "w"), indent=1)
# summary
from collections import Counter
cnt = Counter((v["cls"], v["rarity"]) for v in dsl.CARDS.values())
for c in CLASSES:
    row = {r: cnt[(c, r)] for r in ["K", "S", "C", "U", "R", "X", "F"] if cnt[(c, r)]}
    print(c, sum(row.values()), row)
print("total", len(dsl.CARDS))
# sanity: decks reference real cards
for c, h in heroes.items():
    for cid in h["deck"] + h["kit"]:
        assert cid in dsl.CARDS, (c, cid)
# static validation of effect types and quantity names
FX = {"dmg", "coup", "dmg_per_element", "block", "self_block", "block_target", "armor", "ward", "status", "self_status", "clear", "apply", "apply_x",
      "apply_attuned", "apply_next", "apply_missing", "react", "attune", "attune_to", "push", "pull", "advance", "retreat", "to_front", "swap", "guard",
      "guard_weakest", "prime", "bash_stun", "heal", "stress", "self_stress", "self_dmg", "draw", "energy", "add", "consume", "double", "spread",
      "convert", "cleanse", "transfer", "execute", "delay", "turn", "steal_block", "omen", "cap", "grit", "kill_self_hp", "stress_take"}
QG = {"x", "consumed", "dealt", "killed", "prime_count", "reactions", "enemies", "allies", "allies_dd", "same_target", "round", "incoming", "incoming_me",
      "attackers", "elements_all", "total_bleed", "total_frost", "total_hex", "ally_hurt", "ally_hurt75", "hero_dd", "hero_stress"}
QU = {"hp", "max_hp", "block", "armor", "ward", "stress", "grit", "omen", "played", "resolve", "missing_hp", "hp_pct", "dd", "rank", "elements", "el_total",
      "el_max", "attuned", "attacking", "targeting_me", "moved", "exhaust", "discard", "hand", "draw", "debuffs",
      "fire", "frost", "lightning", "water", "toxin", "void",
      "bleed", "stun", "mark", "vulnerable", "might", "focus", "momentum", "riposte", "taunt", "thorns", "dodge", "regen", "hex", "doom", "fortify", "anchor", "cap"}
STATUS = {"bleed", "stun", "mark", "vulnerable", "might", "focus", "momentum", "riposte", "taunt", "thorns", "dodge", "regen", "hex", "doom", "fortify", "anchor"}
import re
def qok(name):
    n = name.lstrip("!")
    if n.startswith("t.") or n.startswith("m."):
        return n[2:] in QU
    return n in QG or n in QU
bad = []
for cid, c in dsl.CARDS.items():
    for f in c["fx"]:
        if f["t"] not in FX: bad.append((cid, "fx", f["t"]))
        if "per" in f and not qok(f["per"]): bad.append((cid, "per", f["per"]))
        if "times_per" in f and not qok(f["times_per"]): bad.append((cid, "times_per", f["times_per"]))
        if f["t"] in ("status", "self_status", "clear") and f.get("s") not in STATUS: bad.append((cid, "status", f.get("s")))
        for part in f.get("if", "").split("&"):
            part = part.strip()
            if not part: continue
            m = re.split(r">=|<=|==|!=|>|<", part)
            for side in m:
                side = side.strip()
                if side and not re.match(r"^-?\d+(\.\d+)?$", side) and not qok(side): bad.append((cid, "if", side))
        if f["t"] == "add" and f["card"] not in dsl.CARDS: bad.append((cid, "add", f["card"]))
print("validation problems:", bad if bad else "none")
import bestiary  # noqa
