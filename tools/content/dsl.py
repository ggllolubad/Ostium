"""Compact card-definition DSL. Each class module calls card(...) and kit(...); build.py writes data/*.json.

fx helpers return effect dicts understood by Combat._fx1. Common optional keys on every effect:
  to   : target override (self, target, all_enemies, all_allies, allies_other, adjacent, behind, in_front,
         front_enemy, lowest_ally, attackers)
  if_  : condition string (see Combat.cond), e.g. "t.mark>0", "dd", "!moved", "t.hp_pct<50&t.bleed>2"
  per,k: scaling n + k*quantity ; max caps
"""
CARDS = {}
ORDER = []
CLS = {"name": None, "use": [1, 2, 3, 4], "hit": [1, 2, 3, 4]}


def set_class(name, use, hit):
    CLS.update(name=name, use=use, hit=hit)


def _fx(t, n=None, **kw):
    d = {"t": t}
    if n is not None:
        d["n"] = n
    if "if_" in kw:
        kw["if"] = kw.pop("if_")
    d.update({k: v for k, v in kw.items() if v is not None})
    return d


# damage and defence
def D(n, **kw): return _fx("dmg", n, **kw)
def B(n, **kw): return _fx("block", n, **kw)
def AR(n, **kw): return _fx("armor", n, **kw)
def W(n, **kw): return _fx("ward", n, **kw)
def H(n, **kw): return _fx("heal", n, **kw)
def ST(s, n=1, **kw): return _fx("status", n, s=s, **kw)
def SELF(s, n=1, **kw): return _fx("status", n, s=s, to="self", **kw)
def CLR(s, **kw): return _fx("clear", s=s, **kw)
def A(e, n, attr=None, **kw): return _fx("apply", n, e=e, attr=attr, **kw)
def AT(n, attr=None, **kw): return _fx("apply_attuned", n, attr=attr, **kw)
def AN(n, attr=None, **kw): return _fx("apply_next", n, attr=attr, **kw)
def AX(e, attr="volatile", **kw): return _fx("apply_x", e=e, attr=attr, **kw)
def STRESS(n, **kw): return _fx("stress", n, **kw)
def SELFDMG(n, **kw): return _fx("self_dmg", n, **kw)
def DRAW(n=1, **kw): return _fx("draw", n, **kw)
def EN(n=1, **kw): return _fx("energy", n, **kw)
def ADD(card, n=1, **kw): return _fx("add", n, card=card, **kw)
def PUSH(n=1, **kw): return _fx("push", n, **kw)
def PULL(n=1, **kw): return _fx("pull", n, **kw)
def ADV(n=1, **kw): return _fx("advance", n, **kw)
def RET(n=1, **kw): return _fx("retreat", n, **kw)
def FRONT(**kw): return _fx("to_front", **kw)
def SWAP(**kw): return _fx("swap", **kw)
def GUARD(**kw): return _fx("guard", **kw)
def PRIME(n, **kw): return _fx("prime", n, **kw)
def CONS(s=None, e=None, **kw): return _fx("consume", s=s, e=e, **kw)
def DBL(s=None, e=None, **kw): return _fx("double", s=s, e=e, **kw)
def SPREAD(e="all", n=0, **kw): return _fx("spread", n, e=e, **kw)
def CONV(frm, to_e, **kw): return _fx("convert", e=to_e, **{"from": frm}, **kw)
def CLEANSE(n, **kw): return _fx("cleanse", n, **kw)
def TRANSFER(frm="self", **kw): return _fx("transfer", **{"from": frm}, **kw)
def EXEC(n, **kw): return _fx("execute", n, **kw)
def DELAY(**kw): return _fx("delay", **kw)
def TURN(**kw): return _fx("turn", **kw)
def STEAL(**kw): return _fx("steal_block", **kw)
def OMEN(n, **kw): return _fx("omen", n, **kw)
def CAP(n, **kw): return _fx("cap", n, **kw)
def GRIT(n, **kw): return _fx("grit", n, **kw)
def ATTUNE(n=1, **kw): return _fx("attune", n, **kw)
def ATTUNE_TO(e, **kw): return _fx("attune_to", e=e, **kw)
def REACT(n=1, **kw): return _fx("react", n, **kw)
def MISSING(n=1, **kw): return _fx("apply_missing", n, **kw)
def HP2BLOCK(k=1, **kw): return _fx("kill_self_hp", k=k, **kw)
def TAKESTRESS(n, **kw): return _fx("stress_take", n, **kw)
def BASHSTUN(**kw): return _fx("bash_stun", **kw)
def SWAPFX(**kw): return _fx("swap", **kw)
# Gate 3 additions (docs/design/GATE3_VOCAB.md)
def BREW(flask, n=1, **kw): return _fx("brew", n, card=flask, **kw)
def REFILL(n=1, **kw): return _fx("refill", n, **kw)
def IMPROVE(n=1, **kw): return _fx("improve", n, **kw)
def UNBIND(n=1, **kw): return _fx("unbind", n, **kw)
def DISCARD_RANDOM(**kw): return _fx("discard_random", **kw)
def LOSE_ARMOR(n=1, **kw): return _fx("lose_armor", n, **kw)
def LOSE_HP(n, **kw): return _fx("lose_hp", n, **kw)
def TAKE(e="largest", n=0, **kw): return _fx("take", n, e=e, **kw)
def GIVE(e="largest", n=0, attr="stable", **kw): return _fx("give", n, e=e, attr=attr, **kw)
def EVEN(**kw): return _fx("even", **kw)
def SUMMON(key, max=2, front=None, **kw): return _fx("summon", e=key, max=max, front=front, **kw)


def card(id, name, cost, rar, tgt, fx, text, use=None, hit=None, cat="physical", attr=None, kw=None, sub=None, art=None, flask=False,
         up=None, flavour=None, note=None, arch=None, rite=None, on_draw=None, world=None):
    """up: the upgrade, a dict of overriding fields (text is required; cost, fx, kw ... as needed).
    flavour: one line in the lore's voice. note: the art note (the chronicle moment the card art shows).
    arch: the archetype the card serves (for the sheets and the build-aware simulator)."""
    assert id not in CARDS, id
    c = {"name": name, "cost": cost, "rarity": rar, "target": tgt, "fx": fx, "text": text, "cls": CLS["name"],
         "use": use or CLS["use"], "cat": cat}
    if tgt in ("enemy", "all_enemies"):
        c["hit"] = hit or CLS["hit"]
    if attr:
        c["attr"] = attr
    if kw:
        c["kw"] = kw
    if sub:
        c["sub"] = sub
    c["art"] = art or id
    if flask:
        c["flask"] = True
    if up:
        assert "text" in up, (id, "upgrade needs its text")
        c["up"] = up
    if flavour:
        c["flavour"] = flavour
    if note:
        c["note"] = note
    if arch:
        c["arch"] = arch
    if rite:
        c["rite"] = rite
    if on_draw:
        c["on_draw"] = on_draw
    if world:
        c["world"] = world
    CARDS[id] = c
    ORDER.append(id)
    return id
