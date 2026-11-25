"""Gate 3 creature DSL. See docs/design/GATE3_VOCAB.md section 5.

Every creature is written at Threat 0; Run.THREAT_HP and Run.THREAT_DMG scale it. Intent text is generated from the
effects, so it always matches what the creature does."""
CREATURES, ENCOUNTERS, WORLD_NEEDS = {}, [], []

TIERS = ("foe", "elite", "ruler")
KINDS = ("attack", "defend", "buff", "debuff", "heal", "summon", "charge")
TARGETS = ("front", "back", "rank2", "rank3", "front2", "back2", "random", "weakest", "most_stress", "all_heroes", "self",
           "ally_lowest", "all_allies", "ally_front", "marked", "most_cards", "heaviest", "healthiest", "most_burn",
           "most_played", "acted_last", "first_actor")
TRAIT_ON = ("round_start", "round_end", "hit", "death", "ally_death", "phase", "moved", "course", "lost_action")
PERSONALITY = ("mindless", "cruel", "cunning", "steadfast")
FLAGS = ("immovable", "unstunnable", "swarm")
RESIST = ("immune", "resist", "weak")
EL = {"fire": "Burn", "frost": "Weaken", "lightning": "Static", "water": "Soak", "toxin": "Toxin", "void": "Erode"}
WHO = {"front": "the front hero", "back": "the rearmost hero", "rank2": "the hero in rank 2", "rank3": "the hero in rank 3",
       "front2": "the two front heroes", "back2": "the two rear heroes", "random": "a random hero",
       "weakest": "the most wounded hero", "most_stress": "the most stressed hero", "all_heroes": "every hero",
       "self": "itself", "ally_lowest": "the most wounded foe", "all_allies": "every foe", "ally_front": "the front foe",
       "marked": "the Marked hero", "most_cards": "the hero holding the most cards", "heaviest": "the most armoured hero",
       "healthiest": "the healthiest hero", "most_burn": "the most burnt hero", "most_played": "the busiest hero",
       "acted_last": "the hero who acted last", "first_actor": "the hero who led the last Ordo"}
TIMES = ["", "once", "twice", "three times", "four times", "five times"]
STATUS_WORD = {"stun": "Stun", "mark": "Mark", "vulnerable": "Vulnerable", "anchor": "Anchored", "taunt": "Taunt"}
SELF_WORD = {"dodge": "dodges the next {n} hits", "regen": "regenerates {n}", "thorns": "gains {n} Thorns",
             "might": "gains {n} Might", "taunt": "taunts", "fortify": "keeps its Block", "riposte": "strikes back for {n}",
             "charge": "builds {n} {charge}", "tenacity": "cannot be Stunned", "ward": "gains {n} Ward"}


def _n_hits(n):
    return "the next hit" if n == 1 else f"the next {n} hits"


COND_WORD = {"hp_pct": "HP", "round": "round", "charge": "charge", "allies": "foes standing", "enemies": "heroes standing",
             "ally_hurt": "an ally is badly hurt", "hero_dd": "a hero is at Death's Door", "moved": "moved", "block": "Block",
             "armor": "Armor", "stress": "stress", "dd": "at Death's Door", "spectrum": "different courses"}


def humanize(c):
    """A short reading of a condition for intent text: 't.mark>0' -> 'if Marked', 'hp_pct<50' -> 'below 50% HP'."""
    import re as _re
    out = []
    for part in c.split("&"):
        part = part.strip()
        neg = part.startswith("!")
        m = _re.match(r"^!?(t\.|m\.)?([a-z_]+)\s*(>=|<=|==|!=|>|<)?\s*(-?\d+)?$", part)
        if not m:
            out.append(part)
            continue
        who, q, op, v = m.groups()
        word = EL.get(q, COND_WORD.get(q, q.replace("_", " ").capitalize()))
        if q == "mark" and op in (None, ">") and (v in (None, "0")):
            out.append(("unless " if neg else "if ") + ("Marked" if who else "it is Marked"))
            continue
        subj = "the target" if who else "it"
        if q == "hp_pct" and op in ("<", "<="):
            out.append(f"{'their' if who else 'its'} HP below {v}%")
        elif q == "hp_pct":
            out.append(f"{'their' if who else 'its'} HP above {v}%")
        elif q == "round" and op in (">", ">="):
            out.append(f"from round {int(v) + (1 if op == '>' else 0)}")
        elif op is None:
            out.append(f"if {subj} {'has no' if neg else 'has'} {word}" if q not in ("hero_dd", "ally_hurt", "dd", "moved") else ("unless " if neg else "if ") + word)
        elif op in (">", ">=") and v is not None:
            n = int(v) + (1 if op == ">" else 0)
            out.append(f"if {subj} has {word}" if n == 1 else (f"if {subj} has {n}+ {word}" if who else f"at {n}+ {word}"))
        elif op in ("<", "<=") and v is not None:
            n = int(v) - (1 if op == "<" else 0)
            out.append(f"at {n} or less {word}")
        else:
            out.append(part)
    return ", ".join(out)


def text_of(fx, target, charge="charge"):
    """Plain intent text from effects. Kept short: the panel shows it beside the intent icon."""
    head, tail = [], []
    for f in fx:
        t, n = f["t"], f.get("n")
        to = f.get("to")
        if t == "dmg":
            s = f"{n}"
            if f.get("times"):
                s += f" {TIMES[f['times']]}"
            if f.get("pierce"):
                s += " through Block"
            head.append(s)
            if f.get("lifesteal"):
                tail.append("heals itself")
        elif t == "apply":
            head.append(f"{n} {'Volatile ' if f.get('attr') == 'volatile' else ''}{EL[f['e']]}")
        elif t == "stress":
            head.append(f"{n} stress")
        elif t == "status" and to == "self":
            s = f["s"]
            if s == "dodge":
                tail.append(f"dodges {_n_hits(n)}")
            else:
                tail.append(SELF_WORD.get(s, "gains {n} " + s.capitalize()).format(n=n, charge=charge))
        elif t == "status":
            s = f["s"]
            head.append(STATUS_WORD.get(s, f"{n} {s.capitalize()}") if n in (None, 1) or s in STATUS_WORD else f"{n} {s.capitalize()}")
        elif t == "clear" and f.get("s") == "charge":
            tail.append(f"spends its {charge}")
        elif t == "block":
            tail.append(f"gains {n} Block" if target == "self" or to == "self" else f"{n} Block")
        elif t == "armor":
            tail.append(f"gains {n} Armor")
        elif t == "ward":
            tail.append(f"{n} Ward")
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
        elif t == "guard":
            tail.append("guards an ally")
        elif t == "summon":
            tail.append(f"calls {CREATURES.get(f['e'], {}).get('name', f['e'])}")
        elif t == "add":
            import dsl
            tail.append(f"puts {dsl.CARDS.get(f['card'], {}).get('name', f['card'])} in their hand")
        elif t == "discard_random":
            tail.append("makes them discard a card")
        elif t == "lose_armor":
            tail.append(f"strips {n} Armor")
        elif t == "cleanse":
            tail.append(f"cleanses {n}")
        elif t == "steal_block":
            tail.append("takes their Block")
        elif t == "delay":
            tail.append("delays them")
        elif t == "consume":
            what = EL.get(f.get("e", ""), f.get("s", "") or "").replace("_", " ")
            tail.append(f"strips their {what.capitalize() if what else 'courses'}")
        elif t == "double":
            tail.append(f"doubles their {EL.get(f.get('e', ''), f.get('s', ''))}")
        elif t == "spread":
            tail.append("spreads courses to their neighbours")
        elif t == "transfer":
            tail.append("passes its ailments on")
        elif t == "stress_take":
            tail.append("feeds on stress")
        elif t == "execute":
            tail.append(f"kills a hero at {n} HP or less")
        else:
            tail.append(t.replace("_", " "))
        if "if" in f and (head or tail):
            cond = humanize(f["if"])
            if head and t in ("dmg", "apply", "stress", "status") and to != "self":
                head[-1] += f" ({cond})"
            elif tail:
                tail[-1] += f" ({cond})"
    who = WHO[target]
    if head:
        s = (", ".join(head[:-1]) + " and " + head[-1] if len(head) > 1 else head[0]) + f" to {who}"
        return s + ("; " + ", ".join(tail) if tail else "")
    return (who[0].upper() + who[1:] + ": " if target != "self" else "") + ", ".join(tail)


def I(name, kind, target, fx):
    assert kind in KINDS, (name, kind)
    assert target in TARGETS, (name, target)
    return {"name": name, "kind": kind, "target": target, "fx": fx}


def T(on, name, text, fx, e=None):
    """e: for on="course", only that course triggers it."""
    assert on in TRAIT_ON, (name, on)
    t = {"on": on, "name": name, "text": text, "fx": fx}
    if e:
        t["e"] = e
    return t


def P(at, text, ai=None, might=0, fx=None):
    p = {"at": at, "text": text}
    if ai:
        p["ai"] = ai
    if might:
        p["might"] = might
    if fx:
        p["fx"] = fx
    return p


def me(s, n=1):
    return {"t": "status", "s": s, "n": n, "to": "self"}


def creature(key, name, tier, hp, armor=0, span=1, ranks=None, resist=None, intents=None, ai=None, traits=None,
             phases=None, personality="steadfast", flags=None, charge_name=None, lore="", world="", role="attacker"):
    assert key not in CREATURES, key
    assert tier in TIERS, (key, tier)
    assert personality in PERSONALITY, (key, personality)
    for f in flags or []:
        assert f in FLAGS, (key, f)
    for k, v in (resist or {}).items():
        assert k in list(EL) + ["physical"] and v in RESIST, (key, k, v)
    its = {}
    for iid, it in (intents or {}).items():
        it = dict(it)
        it["text"] = text_of(it["fx"], it["target"], charge_name or "charge")
        its[iid] = it
    CREATURES[key] = {"name": name, "tier": tier, "hp": hp, "armor": armor, "span": span, "ranks": ranks or [1, 2, 3, 4],
                      "resist": resist or {}, "intents": its, "ai": ai or [], "traits": traits or [], "phases": phases or [],
                      "personality": personality, "flags": flags or [], "lore": lore, "world": world, "role": role}
    if charge_name:
        CREATURES[key]["charge_name"] = charge_name
    return key


def encounter(world, key, name, desc, creatures, room, tier, idea="", props=None):
    e = {"key": key, "name": name, "desc": desc, "enemies": creatures, "room": room, "tier": tier, "world": world,
         "idea": idea}
    if props:
        e["props"] = props
    ENCOUNTERS.append(e)
    return key
