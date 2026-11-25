"""Rules v2 data changes for testing (2026-11-25): one kit skill per calling, the 15 world afflictions, the XP rescale.
Card and enemy content is otherwise unchanged until Stage 3/4."""
import json
H = json.load(open('data/heroes.json')); C = json.load(open('data/cards.json')); R = json.load(open('data/run.json'))
KIT = {'bulwark': 'k_challenge', 'duelist': 'k_slash', 'elementalist': 'k_attune', 'alchemist': 'k_brew', 'oracle': 'k_foresee', 'hexweaver': 'k_hex'}
for k, kid in KIT.items():
    H[k]['kit'] = [kid]
def st(s, n=1): return {"t": "status", "n": n, "s": s, "to": "self"}
def ap(e, n): return {"t": "apply", "n": n, "e": e, "attr": "stable", "to": "self"}
AFF = {
 'drowned': ('Drowning', 'Gain 2 Soak.', [ap('water', 2)]),
 'mire': ('Fen Rot', 'Gain 2 Toxin.', [ap('toxin', 2)]),
 'baths': ('Fever', 'Lose 2 HP. Gain 1 Burn.', [{"t": "self_dmg", "n": 2}, ap('fire', 1)]),
 'pits': ('Black Lung', 'Gain 1 Toxin and 1 Burn.', [ap('toxin', 1), ap('fire', 1)]),
 'foundry': ('Ringing', 'Gain 2 Static.', [ap('lightning', 2)]),
 'coast': ('False Light', 'Discard a random card from this hand.', [{"t": "discard_random", "to": "self"}]),
 'fleet': ('Frostbite', 'Gain 2 Weaken.', [ap('frost', 2)]),
 'rime': ('The Split', 'Lose 1 Armor for the rest of the fight.', [{"t": "lose_armor", "n": 1, "to": "self"}]),
 'barrow': ('Barrow Sickness', 'Gain 1 Toxin. This hero cannot be healed this round.', [ap('toxin', 1), st('blight')]),
 'hive': ('Venom Tremor', "This hero's next card loses its secondary effects.", [st('neuro')]),
 'spire': ('Stillness', 'This hero acts last this round.', [st('lockdown')]),
 'silence': ('The Hush', 'Gain 2 Erode.', [ap('void', 2)]),
 'pyre': ('Ash-Mark', 'Take 2 damage that ignores Block and Armor.', [{"t": "self_dmg", "n": 2}]),
 'garden': ('The Bloom', 'Gain 1 Toxin and 1 Erode.', [ap('toxin', 1), ap('void', 1)]),
 'sky': ('Seen', 'This hero is Vulnerable this round.', [st('vulnerable')]),
}
for w, (nm, txt, fx) in AFF.items():
    C['aff_' + w] = {"name": nm, "cost": 0, "rarity": "Affliction", "target": "none", "fx": [], "on_draw": fx,
                     "text": "Unplayable. When drawn: " + txt, "cls": "shared", "use": [1, 2, 3, 4], "cat": "physical", "kw": ["Curse"], "art": "aff_" + w, "world": w}
R['xp_levels'] = [0, 60, 140, 240, 360, 500, 660, 840, 1040, 1260]
json.dump(H, open('data/heroes.json', 'w'), indent=1); json.dump(C, open('data/cards.json', 'w'), indent=1); json.dump(R, open('data/run.json', 'w'), indent=1)
print('data v2 applied')
