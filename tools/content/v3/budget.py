"""Card budget points (docs/design/GATE3_SPEC.md, GATE3_VOCAB.md section 6).

A guide, not a judge: it prices plain effects from the table, counts a conditional effect at 70%, and prices a scaled
effect at a typical value of its quantity. Legendaries, Rites, curses and afflictions are not budgeted."""
PTS = {"dmg": 1, "block": 0.85, "self_block": 0.85, "block_target": 0.85, "armor": 6, "ward": 1.5, "heal": 1.2,
       "prime": 0.9, "draw": 4, "energy": 6, "push": 2, "pull": 2, "advance": 1, "retreat": 1, "execute": 0.4,
       "omen": 1.5, "grit": 4, "cleanse": 1, "react": 2.5, "brew": 5, "refill": 4, "improve": 3, "unbind": 1.2,
       "guard": 4, "guard_weakest": 4, "delay": 7, "turn": 5, "steal_block": 3, "bash_stun": 5, "attune": 0.5,
       "attune_to": 1, "apply_missing": 3, "dmg_per_element": 3, "spread": 3, "convert": 2, "double": 4, "transfer": 3,
       "to_front": 2, "swap": 1, "add": 3, "stress_take": 0.5, "cap": 1}
STATUS = {"bleed": 1.6, "mark": 2, "vulnerable": 4, "stun": 9, "might": 5, "thorns": 1.3, "taunt": 3, "dodge": 3,
          "regen": 1.5, "hex": 1.2, "doom": 1.4, "focus": 1, "momentum": 1.5, "riposte": 1.2, "fortify": 2, "anchor": 1,
          "tenacity": 2}
TYPICAL = {"momentum": 3, "consumed": 4, "missing_hp": 14, "scars": 12, "hp_pct": 60, "armor": 3, "block": 8,
           "spectrum": 2, "elements": 2, "el_total": 4, "hex": 4, "doom": 4, "bleed": 4, "mark": 1, "x": 2, "omen": 2,
           "played": 2, "prime_count": 1, "reactions": 1, "enemies": 3, "allies": 4, "total_bleed": 6, "total_hex": 6,
           "total_doom": 6, "total_frost": 3, "ailments": 3, "flasks": 2, "flasks_used": 1, "stress": 40, "thorns": 3,
           "dealt": 8, "incoming": 15, "incoming_me": 8, "attackers": 1, "ward": 2, "focus": 1, "riposte": 2}
MULT = {"S": 0.95, "C": 1.0, "U": 1.15, "R": 1.3, "X": 1.2, "K": 0.7, "N": 1.0, "W": 1.1, "F": 1.0}


def _qty(name):
    n = name.lstrip("!")
    if n[:2] in ("t.", "m."):
        n = n[2:]
    return TYPICAL.get(n, 3)


def fx_points(fxs, card_target):
    total = 0.0
    for f in fxs:
        t = f["t"]
        n = float(f.get("n", 1) or 0)
        if "per" in f:
            n += float(f.get("k", 1)) * _qty(f["per"])
        if "max" in f:
            n = min(n, float(f["max"]))
        if t == "dmg":
            v = n * f.get("times", 1)
        elif t in ("status", "self_status"):
            v = STATUS.get(f.get("s"), 1.5) * max(1, n)
        elif t == "clear":
            v = 1.5
        elif t in ("apply", "apply_attuned", "apply_next"):
            v = n * (2 if f.get("attr") == "volatile" else 1.2)
        elif t == "apply_x":
            v = 0
        elif t == "stress":
            v = -0.5 * n  # negative n sheds stress (worth points); positive stress on a hero is a drawback
        elif t == "self_stress":
            v = -0.5 * n
        elif t == "self_dmg":
            v = -1.0 * n
        elif t in ("consume", "summon", "discard_random", "lose_armor"):
            v = 0
        else:
            v = PTS.get(t, 1) * max(1, n)
        if t == "dmg" and "times_per" in f:
            v *= 1 + _qty(f["times_per"])
        to = f.get("to", "")
        wide = to in ("all_enemies",) or (card_target == "all_enemies" and to in ("", "target"))
        allies = to in ("all_allies", "allies_other") or (card_target == "all_allies" and to in ("", "target"))
        if wide:
            v *= 2.2 if t == "dmg" else 2.5
        elif allies:
            v *= 3
        if "if" in f:
            v *= 0.7
        total += v
    return total


def report(cards):
    rows = []
    for cid, c in cards.items():
        r = c["rarity"]
        if r not in MULT or "Rite" in c.get("kw", []) or c["cls"] == "shared":
            continue
        cost = c["cost"]
        pts = fx_points(c["fx"], c["target"])
        if r == "F":
            want = 5.0   # a flask is free to use; Brew prices it at 5 points (GATE3_VOCAB section 6)
        elif cost == "X" or not isinstance(cost, int):
            want = 0
        elif cost == 0:
            want = 2.5
        else:
            want = 6 * cost * MULT[r]
        if "Exhaust" in c.get("kw", []) and r != "F":
            want *= 1.25
        if "Retain" in c.get("kw", []):
            want *= 0.95
        ratio = pts / want if want else 0
        rows.append({"id": cid, "cls": c["cls"], "rar": r, "cost": cost, "pts": round(pts, 1), "want": round(want, 1),
                     "ratio": round(ratio, 2), "flag": bool(want) and not 0.8 <= ratio <= 1.2})
    return rows


def print_rows(rows):
    for r in sorted(rows, key=lambda r: (r["cls"], r["ratio"])):
        mark = "  <-- " + ("over" if r["ratio"] > 1.2 else "under") if r["flag"] else ""
        print(f"  {r['cls']:12} {r['id']:28} {r['rar']} cost {r['cost']}  {r['pts']:5} / {r['want']:5} = {r['ratio']}{mark}")
