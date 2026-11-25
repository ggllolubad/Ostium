"""Run-layer content: gear, runes, relics, belt consumables, injuries, talents, subclass passives, events,
objectives, ascension modifiers and meta unlocks. Writes data/run.json."""
import json, os
from dsl import D, B, AR, W, H, ST, A, STRESS, DRAW, EN, PRIME

# ------------------------------------------------------------------ gear: stats applied at the start of every fight
# stat keys: max_hp, armor, might, focus, thorns, ward, block (start), grit, stress_res (percent), draw (first round),
#            regen, riposte, momentum, dodge (first round), energy (first round, party)
G = {}
def gear(id, name, slot, rar, stats, text, cls=None):
    G[id] = {"name": name, "slot": slot, "rarity": rar, "stats": stats, "text": text, "cls": cls, "sockets": {"C": 0, "U": 1, "R": 2}[rar]}
# weapons
gear("w_rusted_mace", "Rusted Mace", "weapon", "C", {"might": 1}, "+1 Might.", "bulwark")
gear("w_templar_hammer", "Templar's Hammer", "weapon", "U", {"might": 1, "armor": 1}, "+1 Might, +1 Armor.", "bulwark")
gear("w_gatebreaker", "Gatebreaker", "weapon", "R", {"might": 2, "block": 6}, "+2 Might. Begin each fight with 6 Block.", "bulwark")
gear("w_notched_rapier", "Notched Rapier", "weapon", "C", {"momentum": 1}, "Begin each fight with 1 Momentum.", "duelist")
gear("w_stormglass_blade", "Stormglass Blade", "weapon", "U", {"momentum": 1, "might": 1}, "+1 Might; begin with 1 Momentum.", "duelist")
gear("w_widowmaker", "Widowmaker", "weapon", "R", {"might": 2, "riposte": 3}, "+2 Might; begin with Riposte 3.", "duelist")
gear("w_ash_staff", "Ash Staff", "weapon", "C", {"focus": 1}, "Begin each fight with 1 Focus.", "elementalist")
gear("w_drowned_sceptre", "Drowned Sceptre", "weapon", "U", {"focus": 2, "ward": 1}, "Begin with 2 Focus and 1 Ward.", "elementalist")
gear("w_prism_rod", "Prism Rod", "weapon", "R", {"focus": 3, "draw": 1}, "Begin with 3 Focus; draw 1 more on the first round.", "elementalist")
gear("w_cracked_retort", "Cracked Retort", "weapon", "C", {"regen": 2}, "Begin each fight with Regen 2.", "alchemist")
gear("w_brass_alembic", "Brass Alembic", "weapon", "U", {"focus": 1, "regen": 2}, "Begin with 1 Focus and Regen 2.", "alchemist")
gear("w_philosophers_still", "Philosopher's Still", "weapon", "R", {"focus": 2, "draw": 1, "regen": 3}, "Begin with 2 Focus, Regen 3; draw 1 more on the first round.", "alchemist")
gear("w_bone_dice", "Bone Dice", "weapon", "C", {"ward": 2}, "Begin each fight with 2 Ward.", "oracle")
gear("w_seers_lens", "Seer's Lens", "weapon", "U", {"ward": 2, "draw": 1}, "Begin with 2 Ward; draw 1 more on the first round.", "oracle")
gear("w_astrolabe", "Drowned Astrolabe", "weapon", "R", {"ward": 3, "energy": 1}, "Begin with 3 Ward; the company has +1 vigour on the first round.", "oracle")
gear("w_rag_poppet", "Rag Poppet", "weapon", "C", {"might": 1}, "+1 Might.", "hexweaver")
gear("w_coffin_nail", "Coffin Nail", "weapon", "U", {"might": 1, "thorns": 2}, "+1 Might; begin with 2 Thorns.", "hexweaver")
gear("w_witch_skull", "Witch's Skull", "weapon", "R", {"might": 2, "ward": 2, "draw": 1}, "+2 Might, 2 Ward; draw 1 more on the first round.", "hexweaver")
# armour (any class)
gear("a_padded_jack", "Padded Jack", "armor", "C", {"max_hp": 5}, "+5 max HP.")
gear("a_brigandine", "Brigandine", "armor", "C", {"armor": 1}, "+1 Armor.")
gear("a_oilskin", "Oilskin Coat", "armor", "C", {"max_hp": 3, "stress_res": 10}, "+3 max HP; 10% less stress.")
gear("a_hauberk", "Drowned Hauberk", "armor", "U", {"armor": 1, "max_hp": 6}, "+1 Armor, +6 max HP.")
gear("a_pilgrim_robes", "Pilgrim's Robes", "armor", "U", {"stress_res": 20, "ward": 1}, "20% less stress; begin with 1 Ward.")
gear("a_thorned_mail", "Thorned Mail", "armor", "U", {"thorns": 3, "max_hp": 4}, "+4 max HP; begin with 3 Thorns.")
gear("a_saints_plate", "Saint's Plate", "armor", "R", {"armor": 2, "max_hp": 8, "grit": 1}, "+2 Armor, +8 max HP, +1 Grit.")
gear("a_shroud", "Shroud of the Drowned", "armor", "R", {"dodge": 1, "stress_res": 25, "max_hp": 4}, "+4 max HP; 25% less stress; Dodge on the first round.")
# trinkets
gear("t_tooth_charm", "Tooth Charm", "trinket", "C", {"max_hp": 3}, "+3 max HP.")
gear("t_salt_pouch", "Salt Pouch", "trinket", "C", {"stress_res": 10}, "10% less stress.")
gear("t_rosary", "Iron Rosary", "trinket", "C", {"block": 4}, "Begin each fight with 4 Block.")
gear("t_eel_tooth", "Eel's Tooth", "trinket", "U", {"might": 1}, "+1 Might.")
gear("t_candle_stub", "Candle Stub", "trinket", "U", {"draw": 1}, "Draw 1 more on the first round.")
gear("t_grave_moss", "Grave Moss", "trinket", "U", {"regen": 3}, "Begin each fight with Regen 3.")
gear("t_hangmans_knot", "Hangman's Knot", "trinket", "U", {"grit": 1}, "+1 Grit.")
gear("t_pearl_of_ysolde", "Pearl of Saint Ysolde", "trinket", "R", {"ward": 2, "stress_res": 20, "max_hp": 5}, "+5 max HP, 2 Ward, 20% less stress.")
gear("t_kings_ring", "Drowned King's Ring", "trinket", "R", {"might": 2, "energy": 1}, "+2 Might; the company has +1 vigour on the first round.")

RUNES = {
    "r_iron": {"name": "Rune of Iron", "stats": {"armor": 1}, "text": "+1 Armor."},
    "r_blood": {"name": "Rune of Blood", "stats": {"max_hp": 5}, "text": "+5 max HP."},
    "r_wrath": {"name": "Rune of Wrath", "stats": {"might": 1}, "text": "+1 Might."},
    "r_eye": {"name": "Rune of the Eye", "stats": {"focus": 1}, "text": "+1 Focus at the start of each fight."},
    "r_salt": {"name": "Rune of Salt", "stats": {"stress_res": 10}, "text": "10% less stress."},
    "r_ward": {"name": "Rune of Warding", "stats": {"ward": 1}, "text": "+1 Ward at the start of each fight."},
    "r_thorn": {"name": "Rune of Thorns", "stats": {"thorns": 2}, "text": "+2 Thorns at the start of each fight."},
    "r_haste": {"name": "Rune of Haste", "stats": {"momentum": 1}, "text": "+1 Momentum at the start of each fight."},
}
# relics: party-wide. "start" fx run on every hero at fight start; "round" fx on every hero at each round start
RELICS = {
    "rl_bell_clapper": {"name": "Bell Clapper", "text": "The company has +1 vigour on the first round of each fight.", "energy": 1},
    "rl_saints_finger": {"name": "Saint's Finger", "text": "Every hero begins each fight with 5 Block.", "start": [B(5)]},
    "rl_drowned_lantern": {"name": "Drowned Lantern", "text": "Every hero begins each fight with 2 Ward.", "start": [W(2)]},
    "rl_salt_crown": {"name": "Crown of Salt", "text": "Every hero sheds 3 stress at the start of each round.", "round": [STRESS(-3)]},
    "rl_hooked_heart": {"name": "Hooked Heart", "text": "Every hero heals 1 at the start of each round.", "round": [H(1)]},
    "rl_kraken_beak": {"name": "Kraken's Beak", "text": "Every hero begins each fight with 1 Might.", "start": [ST("might", 1, to="self")]},
    "rl_tidestone": {"name": "Tidestone", "text": "Every hero begins each fight with 2 Focus.", "start": [ST("focus", 2, to="self")]},
    "rl_reliquary": {"name": "Reliquary of Bones", "text": "Every hero begins each fight with 3 Thorns.", "start": [ST("thorns", 3, to="self")]},
    "rl_hourglass": {"name": "Cracked Hourglass", "text": "Every hero draws 1 more card on the first round.", "start": [DRAW(1)]},
    "rl_pilgrim_badge": {"name": "Pilgrim's Badge", "text": "Gain 25% more gold.", "gold_mult": 1.25},
    "rl_mourning_veil": {"name": "Mourning Veil", "text": "Heroes gain 15% less stress.", "stress_res": 15},
    "rl_black_pearl": {"name": "Black Pearl", "text": "Every hero begins each fight with Regen 2.", "start": [ST("regen", 2, to="self")]},
    "rl_anchor_link": {"name": "Anchor Link", "text": "Every hero begins each fight with 1 Armor for that fight.", "start": [AR(1)]},
    "rl_eel_skin": {"name": "Eel-skin Gloves", "text": "Every hero begins each fight with 1 Momentum.", "start": [ST("momentum", 1, to="self")]},
}
CONSUMABLES = ["fl_heal", "fl_fire", "fl_brine", "fl_salts", "fl_acid", "fl_blast", "fl_frost", "fl_iron", "fl_rage", "fl_steam"]

INJURIES = {
    "broken_ribs": {"name": "Broken Ribs", "text": "-6 max HP until treated.", "max_hp": -6},
    "festering": {"name": "Festering Wound", "text": "A Festering Wound curse sits in the deck until treated.", "card": "festering"},
    "shaken": {"name": "Shaken", "text": "Gains 25% more stress until treated.", "stress_res": -25},
    "torn_tendon": {"name": "Torn Tendon", "text": "-1 Might until treated.", "might": -1},
}
# level-up talents (offered three at a time, never on the subclass level)
TALENTS = {
    "tough": {"name": "Tough as Old Rope", "text": "+6 max HP.", "stats": {"max_hp": 6}},
    "grit": {"name": "Hard to Kill", "text": "+1 Grit.", "stats": {"grit": 1}},
    "iron_hide": {"name": "Iron Hide", "text": "+1 Armor.", "stats": {"armor": 1}},
    "steady": {"name": "Steady Nerves", "text": "15% less stress.", "stats": {"stress_res": 15}},
    "sharp": {"name": "Killer's Eye", "text": "+1 Might.", "stats": {"might": 1}},
    "studied": {"name": "Studied", "text": "+1 Focus at the start of each fight.", "stats": {"focus": 1}},
    "quick": {"name": "Quick Hands", "text": "Draw 1 more card on the first round.", "stats": {"draw": 1}},
    "cull": {"name": "Cull the Deck", "text": "Remove a card from this hero's deck.", "remove": 1},
}
XP_LEVELS = [0, 20, 45, 75, 110, 150, 195, 245, 300, 360]

# subclass passives: applied at fight start for the hero, by level threshold (4, 7, 10)
SUB = {
    "last_bastion": [[ST("thorns", 0, to="self")], [B(6)], [{"t": "grit", "n": 1, "to": "self"}]],
    "ironwarden": [[A("frost", 1, to="front_enemy", attr="stable")], [B(4), A("frost", 1, to="all_enemies", attr="stable")], [ST("fortify", 1, to="self"), B(8)]],
    "thornguard": [[ST("thorns", 3, to="self")], [ST("thorns", 3, to="self")], [ST("thorns", 4, to="self"), AR(1)]],
    "bladedancer": [[ST("momentum", 1, to="self")], [ST("momentum", 1, to="self"), ST("dodge", 1, to="self")], [ST("momentum", 2, to="self")]],
    "executioner": [[ST("mark", 1, to="front_enemy")], [ST("might", 1, to="self")], [ST("mark", 1, to="all_enemies"), ST("might", 1, to="self")]],
    "bloodletter": [[ST("bleed", 2, to="front_enemy")], [ST("bleed", 2, to="all_enemies")], [ST("bleed", 3, to="all_enemies"), ST("regen", 2, to="self")]],
    "accumulator": [[ST("focus", 1, to="self")], [{"t": "cap", "n": 4}], [ST("focus", 2, to="self"), {"t": "cap", "n": 4}]],
    "catalyst": [[ST("focus", 1, to="self")], [W(2)], [ST("focus", 2, to="self"), W(2)]],
    "prismatic": [[W(1)], [ST("focus", 1, to="self"), W(1)], [{"t": "apply_missing", "n": 1, "to": "front_enemy"}]],
    "transmuter": [[ST("focus", 1, to="self")], [ST("regen", 2, to="self")], [ST("focus", 2, to="self"), W(2)]],
    "plaguewright": [[A("toxin", 1, to="all_enemies", attr="stable")], [A("toxin", 1, to="all_enemies", attr="stable")], [A("toxin", 2, to="all_enemies", attr="stable")]],
    "apothecary": [[ST("regen", 2, to="self")], [ST("regen", 2, to="all_allies")], [H(4, to="all_allies"), ST("regen", 2, to="all_allies")]],
    "chronomancer": [[DRAW(1)], [W(2)], [{"t": "energy", "n": 1}]],
    "augur": [[{"t": "omen", "n": 2}], [{"t": "omen", "n": 2}], [{"t": "omen", "n": 3}, W(2)]],
    "fatebinder": [[PRIME(2)], [PRIME(2)], [PRIME(4)]],
    "pactbound": [[ST("might", 1, to="self")], [ST("regen", 2, to="self")], [ST("might", 1, to="self"), {"t": "grit", "n": 1, "to": "self"}]],
    "doomsayer": [[ST("doom", 3, to="all_enemies")], [ST("doom", 3, to="all_enemies")], [ST("doom", 6, to="all_enemies")]],
    "mirrorhex": [[ST("thorns", 2, to="self")], [W(2)], [ST("riposte", 3, to="self"), ST("thorns", 2, to="self")]],
}
SUB_TEXT = {
    "last_bastion": ["Stands at the Door: each threshold makes Death's Door safer.", "Begin each fight with 6 Block.", "+1 Grit each fight."],
    "ironwarden": ["Apply 1 Frost to the front foe at the start of each fight.", "4 Block, and 1 Frost to every foe.", "Fortify and 8 Block."],
    "thornguard": ["Begin with 3 Thorns.", "+3 more Thorns.", "+4 more Thorns and 1 Armor."],
    "bladedancer": ["Begin with 1 Momentum.", "+1 Momentum and Dodge.", "+2 more Momentum."],
    "executioner": ["Mark the front foe at the start of each fight.", "+1 Might.", "Mark every foe; +1 Might."],
    "bloodletter": ["2 Bleed on the front foe at the start of each fight.", "2 Bleed on every foe.", "3 Bleed on every foe; Regen 2."],
    "accumulator": ["Begin with 1 Focus.", "Conjunctions may grow 4 stronger.", "+2 Focus; Conjunctions may grow 4 stronger again."],
    "catalyst": ["Begin with 1 Focus.", "Begin with 2 Ward.", "+2 Focus and 2 Ward."],
    "prismatic": ["Begin with 1 Ward.", "+1 Focus and 1 Ward.", "The front foe starts bearing one of every element."],
    "transmuter": ["Begin with 1 Focus.", "Begin with Regen 2.", "+2 Focus and 2 Ward."],
    "plaguewright": ["1 Toxin on every foe at the start of each fight.", "+1 Toxin on every foe.", "+2 Toxin on every foe."],
    "apothecary": ["Begin with Regen 2.", "Every hero begins with Regen 2.", "Every hero heals 4 and gains Regen 2."],
    "chronomancer": ["Draw 1 more on the first round.", "Begin with 2 Ward.", "+1 vigour on the first round."],
    "augur": ["Begin with 2 Omen.", "+2 Omen.", "+3 Omen and 2 Ward."],
    "fatebinder": ["The first action of each fight is Primed 2.", "Prime 2 more.", "Prime 4 more."],
    "pactbound": ["+1 Might.", "Regen 2.", "+1 Might and +1 Grit."],
    "doomsayer": ["3 Doom on every foe at the start of each fight.", "+3 Doom on every foe.", "+6 Doom on every foe."],
    "mirrorhex": ["Begin with 2 Thorns.", "Begin with 2 Ward.", "Riposte 3 and 2 more Thorns."],
}
SUB_TEXT["last_bastion"][0] = "Begin each fight with Thorns equal to nothing yet; the Door holds (subclass cards unlocked)."
SUB["last_bastion"][0] = [B(3)]
SUB_TEXT["last_bastion"][0] = "Begin each fight with 3 Block."

# ------------------------------------------------------------------ events
def O(label, outcome, after, req=None):
    o = {"label": label, "outcome": outcome, "after": after}
    if req: o["req"] = req
    return o
EVENTS = [
    {"id": "drowned_chapel", "title": "A Drowned Chapel", "text": "Candles still burn under the water in a side chapel. A saint's reliquary sits on the altar, chained shut. Something knocks from inside it.",
     "options": [O("Break the chains (2 Tools)", [{"t": "supply", "s": "tools", "n": -2}, {"t": "relic"}], "The knocking stops. Inside: a relic, and a smell you will not forget.", {"tools": 2}),
                 O("Pray at the altar", [{"t": "stress", "n": -15, "who": "all"}, {"t": "doom", "n": 1}], "A moment of quiet. The water outside grows darker."),
                 O("Leave it be", [], "Some doors are shut for a reason.")]},
    {"id": "pilgrim_corpse", "title": "The Pilgrim's Corpse", "text": "A pilgrim lies face-down in the silt, pack still on his back. His hand is closed around something.",
     "options": [O("Search the pack", [{"t": "supply", "s": "food", "n": 3}, {"t": "gold", "n": 20}], "Hard bread, a purse, and a letter you choose not to read."),
                 O("Pry open his hand", [{"t": "gear"}, {"t": "stress", "n": 8, "who": "random"}], "The fingers break as you open them. He was holding it very tightly."),
                 O("Give him rites", [{"t": "stress", "n": -10, "who": "all"}], "The company feels a little less alone.")]},
    {"id": "eel_nest", "title": "An Eel Nest", "text": "The passage narrows to a pool thick with eels. On the far side, a glint of gold.",
     "options": [O("Wade through", [{"t": "hp", "n": -8, "who": "all"}, {"t": "gold", "n": 60}], "They bite. You keep walking. The gold is real."),
                 O("Burn them out (1 Light)", [{"t": "supply", "s": "light", "n": -1}, {"t": "gold", "n": 40}], "Oil, fire, screaming water.", {"light": 1}),
                 O("Find another way", [{"t": "doom", "n": 1}], "It costs you time.")]},
    {"id": "singing_well", "title": "The Singing Well", "text": "A well in the floor of the nave. Voices rise out of it, singing your names.",
     "options": [O("Answer them", [{"t": "stress", "n": 20, "who": "all"}, {"t": "xp", "n": 30}], "You learn something no one should know."),
                 O("Drop a coin in (25 gold)", [{"t": "gold", "n": -25}, {"t": "card"}], "The song changes. A gift drifts up on the water.", {"gold": 25}),
                 O("Seal it with stones (1 Tools)", [{"t": "supply", "s": "tools", "n": -1}, {"t": "stress", "n": -10, "who": "all"}], "The singing stops. Mostly.", {"tools": 1})]},
    {"id": "flooded_armory", "title": "A Flooded Armoury", "text": "Racks of weapons and harness, half sunk in brine. Most of it is rust. Not all of it.",
     "options": [O("Dive for the good pieces", [{"t": "gear"}, {"t": "hp", "n": -6, "who": "random"}], "Cold, sharp edges in the dark. Worth it."),
                 O("Salvage what's dry (1 Tools)", [{"t": "supply", "s": "tools", "n": -1}, {"t": "gear"}, {"t": "rune"}], "Careful work pays.", {"tools": 1}),
                 O("Move on", [], "")]},
    {"id": "abbess_ghost", "title": "The Abbess's Confessional", "text": "A confessional booth. Behind the grille, a woman's voice offers absolution, for a price.",
     "options": [O("Confess (lose 6 max HP, one hero)", [{"t": "maxhp", "n": -6, "who": "highest"}, {"t": "stress", "n": -40, "who": "highest"}], "Something is taken. Something heavier is lifted."),
                 O("Buy an indulgence (40 gold)", [{"t": "gold", "n": -40}, {"t": "stress", "n": -25, "who": "all"}], "Coins slide through the grille. The voice laughs.", {"gold": 40}),
                 O("Curse her", [{"t": "curse", "who": "random"}, {"t": "gold", "n": 30}], "She curses you back. She also drops her purse.")]},
    {"id": "starving_survivor", "title": "A Survivor", "text": "A starving man in a dry alcove begs for food. His eyes keep going to your throats.",
     "options": [O("Share food (2 Food)", [{"t": "supply", "s": "food", "n": -2}, {"t": "relic"}], "He presses something into your hand before you go.", {"food": 2}),
                 O("Put him out of his misery", [{"t": "stress", "n": 12, "who": "all"}, {"t": "gold", "n": 15}], "Mercy, of a kind."),
                 O("Walk away", [{"t": "stress", "n": 5, "who": "all"}], "His begging follows you a long way.")]},
    {"id": "tide_shrine", "title": "Tide Shrine", "text": "A shrine to a sea-saint, its offering bowl brimming with black water.",
     "options": [O("Drink from the bowl", [{"t": "hp", "n": 12, "who": "all"}, {"t": "curse", "who": "random"}], "It heals. It also stays with you."),
                 O("Leave an offering (1 Medicine)", [{"t": "supply", "s": "medicine", "n": -1}, {"t": "xp", "n": 25}], "The water stills. You feel steadier.", {"medicine": 1}),
                 O("Pass by", [], "")]},
    {"id": "collapsed_stair", "title": "A Collapsed Stair", "text": "The way down is choked with rubble. You can dig, or you can find another way in the dark.",
     "options": [O("Dig through (1 Tools)", [{"t": "supply", "s": "tools", "n": -1}], "Hard work, but quick.", {"tools": 1}),
                 O("Squeeze through the gap", [{"t": "hp", "n": -5, "who": "all"}, {"t": "stress", "n": 6, "who": "all"}], "Scraped, bruised, through."),
                 O("Take the long way", [{"t": "doom", "n": 2}, {"t": "supply", "s": "food", "n": -1}], "Hours lost in the dark.")]},
    {"id": "corpse_cart", "title": "The Corpse Cart", "text": "An overturned cart of the drowned, bound for a burial that never came. One of them is still moving.",
     "options": [O("End it", [{"t": "fight"}], "It was not the only one moving."),
                 O("Loot the cart", [{"t": "gold", "n": 35}, {"t": "stress", "n": 10, "who": "all"}], "Rings, teeth, buttons. You do not look at the faces."),
                 O("Leave quietly", [], "")]},
    {"id": "lantern_keeper", "title": "The Lantern Keeper", "text": "An old woman tends lanterns on a sunken pier. She trades light for stories, or for blood.",
     "options": [O("Tell her a story", [{"t": "supply", "s": "light", "n": 2}, {"t": "stress", "n": 6, "who": "random"}], "She likes the sad ones best."),
                 O("Give her blood", [{"t": "hp", "n": -10, "who": "highest"}, {"t": "supply", "s": "light", "n": 4}], "She drinks it from a lantern glass."),
                 O("Buy oil (30 gold)", [{"t": "gold", "n": -30}, {"t": "supply", "s": "light", "n": 3}], "A fair trade, for once.", {"gold": 30})]},
    {"id": "bone_scribe", "title": "The Bone Scribe", "text": "A skeleton at a writing desk, quill still in hand. The page is half written. It is about you.",
     "options": [O("Read it", [{"t": "xp", "n": 40}, {"t": "stress", "n": 15, "who": "all"}], "It knows how this ends."),
                 O("Finish it yourself", [{"t": "remove_card"}], "You write a better ending. Something in your deck goes quiet."),
                 O("Burn it (1 Light)", [{"t": "supply", "s": "light", "n": -1}, {"t": "doom", "n": -2}], "The water seems to recede, a little.", {"light": 1})]},
]

# events that only happen in the Drowned Kingdom; the rest of the list can turn up behind any door
for e in EVENTS:
    if e["id"] in ("drowned_chapel", "eel_nest", "singing_well", "flooded_armory", "abbess_ghost", "tide_shrine", "corpse_cart", "lantern_keeper"):
        e["world"] = "drowned"
def EVW(world, id, title, text, options):
    EVENTS.append({"id": id, "title": title, "text": text, "options": options, "world": world})
S_ = lambda s, n: {"t": "supply", "s": s, "n": n}
EVW("rime", "frozen_scout", "The Frozen Scout", "A scout froze mid-stride on the ice, pack still on her back. The ice around her feet is hot to the touch.",
    [O("Chip her free (1 Tools)", [S_("tools", -1), {"t": "gear"}, S_("food", 2)], "Her gear is good. Her face does not thaw.", {"tools": 1}),
     O("Take the pack and run", [{"t": "gold", "n": 30}, {"t": "hp", "n": -6, "who": "all"}], "The ice cracks behind you. Steam scalds your heels."),
     O("Leave her standing", [], "Someone has to keep watch.")])
EVW("rime", "steam_vent", "The Steam Vent", "A vent breathes warm air through the glacier. The company could rest here, if the ground holds.",
    [O("Rest by the vent", [{"t": "hp", "n": 10, "who": "all"}, {"t": "doom", "n": 1}], "Warm for the first time in days."),
     O("Cook a meal over it (2 Food)", [S_("food", -2), {"t": "stress", "n": -15, "who": "all"}], "Hot food. Someone laughs.", {"food": 2}),
     O("Press on", [], "")])
EVW("foundry", "abandoned_anvil", "The Abandoned Anvil", "An anvil still glows on a silent line. A half-forged blade lies across it.",
    [O("Finish the blade (1 Tools)", [S_("tools", -1), {"t": "gear"}, {"t": "rune"}], "The hammer strikes true. The foundry answers, far away.", {"tools": 1}),
     O("Quench your hands in the trough", [{"t": "stress", "n": -10, "who": "all"}, {"t": "hp", "n": -4, "who": "all"}], "It hurts. It also wakes you up."),
     O("Leave it", [], "")])
EVW("foundry", "storm_capacitor", "The Storm Jar", "A glass jar the height of a man holds a captured storm. It hums in your teeth.",
    [O("Smash it", [{"t": "hp", "n": -8, "who": "all"}, {"t": "xp", "n": 35}], "Lightning goes through all of you. Some of it stays."),
     O("Sell the copper fittings", [{"t": "gold", "n": 45}, {"t": "doom", "n": 1}], "It takes time to strip it properly."),
     O("Back away slowly", [], "")])
EVW("baths", "drowned_guest", "A Lingering Guest", "A bather still sits in a pool that has been boiling for a century. He beckons you in.",
    [O("Join him", [{"t": "hp", "n": -10, "who": "random"}, {"t": "relic"}], "He gives you the ring off his finger. The finger comes with it."),
     O("Rob his clothes on the bench", [{"t": "gold", "n": 40}, {"t": "stress", "n": 8, "who": "all"}], "He watches you do it. He does not stop smiling."),
     O("Decline politely", [], "")])
EVW("baths", "towel_cupboard", "The Linen Store", "Clean linen, folded and dry, in a cupboard the steam never reached.",
    [O("Take bandages", [S_("medicine", 2)], "Clean cloth is worth more than gold down here."),
     O("Rest among the linen", [{"t": "stress", "n": -20, "who": "all"}, {"t": "doom", "n": 1}], "It smells of soap. Of before."),
     O("Search the back", [{"t": "gear"}, {"t": "stress", "n": 6, "who": "random"}], "Something was hiding back there. It left this behind.")])
EVW("pits", "canary_cage", "The Last Canary", "A canary in a cage, still alive, still singing. The gas has not reached it yet.",
    [O("Carry it with you", [{"t": "doom", "n": -2}, S_("food", -1)], "It sings when the air turns. You learn to listen."),
     O("Let it go", [{"t": "stress", "n": -12, "who": "all"}], "It flies up the shaft. Someone has to get out."),
     O("Eat it", [S_("food", 1), {"t": "stress", "n": 10, "who": "all"}], "Nobody speaks for a while.")])
EVW("pits", "powder_cache", "A Powder Cache", "Kegs of blasting powder, dry, stacked by a collapsed tunnel.",
    [O("Blast the tunnel (1 Light)", [S_("light", -1), {"t": "gold", "n": 60}, {"t": "hp", "n": -5, "who": "all"}], "The seam behind it glitters.", {"light": 1}),
     O("Pack some for later", [{"t": "card"}], "One of you learns a dangerous trick."),
     O("Keep the lamps well away", [], "")])
EVW("pyre", "unburnt_relic", "The Unburnt Hand", "In a heap of ash, one hand has not burned. It still holds a rosary.",
    [O("Take the rosary", [{"t": "relic"}, {"t": "stress", "n": 10, "who": "all"}], "The hand lets go. It should not have been able to."),
     O("Bury the hand", [{"t": "stress", "n": -15, "who": "all"}, {"t": "doom", "n": 1}], "The black fire flickers, as if insulted."),
     O("Walk on", [], "")])
EVW("pyre", "confession_fire", "The Confession Fire", "A brazier of black flame. A sign reads: SPEAK YOUR SIN AND BE LIGHTER.",
    [O("Confess (one hero)", [{"t": "stress", "n": -35, "who": "highest"}, {"t": "maxhp", "n": -4, "who": "highest"}], "The fire takes the sin, and a little of the sinner."),
     O("Feed it a card", [{"t": "remove_card"}], "Something you knew burns away."),
     O("Douse it (1 Medicine)", [S_("medicine", -1), {"t": "xp", "n": 30}], "It hisses out. You learn what it was guarding.", {"medicine": 1})])
EVW("spire", "stopped_clock", "The Stopped Clock", "A clock face in the wall. The hands are frozen at one minute to twelve. You could move them.",
    [O("Wind it back", [{"t": "doom", "n": -3}, {"t": "stress", "n": 10, "who": "all"}], "Time slips. Your heads ache."),
     O("Wind it forward", [{"t": "xp", "n": 40}, {"t": "doom", "n": 2}], "You see what comes next. It is worse."),
     O("Leave it at one minute to", [], "")])
EVW("spire", "star_chart", "The Star Chart", "A chart of the frozen sky, annotated in a shaking hand.",
    [O("Study it", [{"t": "xp", "n": 30}], "The stars stopped here. You learn where."),
     O("Sell the brass frame", [{"t": "gold", "n": 35}], "Heavy, but worth it."),
     O("Burn it for warmth (1 Light)", [S_("light", -1), {"t": "hp", "n": 8, "who": "all"}], "Warm hands are worth more than stars.", {"light": 1})])
EVW("fleet", "ships_galley", "The Ship's Galley", "A frozen galley, the stores still sealed in ice.",
    [O("Chip out the stores (1 Tools)", [S_("tools", -1), S_("food", 4)], "Salt pork, hard tack, rum.", {"tools": 1}),
     O("Drink the captain's rum", [{"t": "stress", "n": -20, "who": "all"}, {"t": "hp", "n": -3, "who": "all"}], "Courage, of a kind."),
     O("Leave it frozen", [], "")])
EVW("fleet", "figurehead", "The Weeping Figurehead", "A ship's figurehead, a woman carved in oak. She is crying real tears, and they freeze.",
    [O("Collect the tears", [{"t": "relic"}, {"t": "stress", "n": 8, "who": "random"}], "Each tear is a frozen pearl."),
     O("Speak to her", [{"t": "xp", "n": 25}, {"t": "stress", "n": -8, "who": "all"}], "She tells you how the fleet died."),
     O("Pass by", [], "")])
EVW("barrow", "grave_goods", "Grave Goods", "A side tomb, unopened. The seal is old and the cold has kept everything.",
    [O("Open it (1 Tools)", [S_("tools", -1), {"t": "gear"}, {"t": "gold", "n": 30}], "Fine things, and a smell like old meat.", {"tools": 1}),
     O("Leave an offering of food (1 Food)", [S_("food", -1), {"t": "doom", "n": -2}], "The barrow seems to settle.", {"food": 1}),
     O("Leave it sealed", [], "")])
EVW("barrow", "plague_doctor", "The Barrow Physician", "A dead physician in a beaked mask, still holding a bag of cures.",
    [O("Take the bag", [S_("medicine", 2), {"t": "curse", "who": "random"}], "The cures are real. So is what was on them."),
     O("Read his notes", [{"t": "xp", "n": 30}], "He understood the plague. It did not help him."),
     O("Leave him", [], "")])
EVW("silence", "frozen_campfire", "A Frozen Campfire", "A campfire, still burning, frozen in ice. The flames do not move.",
    [O("Thaw it (1 Light)", [S_("light", -1), {"t": "hp", "n": 12, "who": "all"}, {"t": "stress", "n": -10, "who": "all"}], "It burns again. Nobody talks.", {"light": 1}),
     O("Take the frozen flame", [{"t": "relic"}, {"t": "stress", "n": 12, "who": "all"}], "It is cold in the hand."),
     O("Walk on", [], "")])
EVW("silence", "listening_stone", "The Listening Stone", "A standing stone with an ear carved in it. The silence here is complete.",
    [O("Whisper a secret", [{"t": "stress", "n": -20, "who": "random"}], "The stone keeps it."),
     O("Shout", [{"t": "fight"}], "Something heard."),
     O("Keep silent", [{"t": "xp", "n": 20}], "You learn to listen.")])
EVW("coast", "wreck_hold", "A Wreck's Hold", "The hold of a ship the wreckers brought in. The cargo is still aboard.",
    [O("Haul the cargo", [{"t": "gold", "n": 50}, {"t": "doom", "n": 1}], "Silk, spice, a box of teeth."),
     O("Free the survivor in the brig", [S_("food", -1), {"t": "relic"}], "A sailor, half drowned, grateful. She gives you her lucky charm."),
     O("Leave before the tide", [], "")])
EVW("coast", "lightning_rod", "The Lightning Rod", "An iron rod on the cliff, black with strikes. A storm is coming.",
    [O("Stand beneath it", [{"t": "hp", "n": -10, "who": "random"}, {"t": "card"}], "It strikes. One of you learns something."),
     O("Take shelter", [{"t": "doom", "n": 1}, {"t": "stress", "n": -10, "who": "all"}], "The storm passes over."),
     O("Run for it", [], "")])
EVW("hive", "honey_cell", "A Honey Cell", "A cell of dark honey, crackling with static.",
    [O("Eat it", [{"t": "hp", "n": 15, "who": "all"}, {"t": "curse", "who": "random"}], "Sweet. Then numb. Then sweet again."),
     O("Jar it (1 Tools)", [S_("tools", -1), S_("medicine", 2)], "It keeps wounds clean.", {"tools": 1}),
     O("Leave it for the drones", [], "")])
EVW("hive", "cocooned_knight", "The Cocooned Knight", "A knight wrapped in silk, still breathing. His sword hangs outside the cocoon.",
    [O("Cut him free", [{"t": "fight"}], "He is not a knight any more."),
     O("Take the sword", [{"t": "gear"}], "He sighs as you go."),
     O("Leave him", [{"t": "stress", "n": 8, "who": "all"}], "He is still breathing when you leave.")])
EVW("sky", "fallen_feather", "A Fallen Feather", "An angel's feather as long as a spear, lying in the ruins.",
    [O("Take it", [{"t": "relic"}], "It is warm. It hums when lightning is near."),
     O("Pray over it", [{"t": "stress", "n": -15, "who": "all"}, {"t": "xp", "n": 15}], "Nobody answers. It still helps."),
     O("Leave it", [], "")])
EVW("sky", "rift_edge", "The Edge of the Rift", "The ruins end at a tear in the sky. Something on the other side is looking at you.",
    [O("Look back", [{"t": "stress", "n": 20, "who": "all"}, {"t": "xp", "n": 45}], "You see it. It sees you. You both learn something."),
     O("Throw something in (25 gold)", [{"t": "gold", "n": -25}, {"t": "card"}], "Something comes back out.", {"gold": 25}),
     O("Turn away", [], "")])
EVW("mire", "hag_kettle", "The Hag's Kettle", "A kettle bubbling on a stilt-hut porch. The hag is away.",
    [O("Drink the brew", [{"t": "hp", "n": 15, "who": "all"}, {"t": "stress", "n": 10, "who": "all"}], "It heals. It tastes of the bog."),
     O("Steal the kettle's contents", [S_("medicine", 1), {"t": "curse", "who": "random"}], "She will know."),
     O("Leave it simmering", [], "")])
EVW("mire", "bog_offering", "The Bog Offering", "A bog body with a gold torc around its neck. It has been there a thousand years.",
    [O("Take the torc", [{"t": "gold", "n": 60}, {"t": "fight"}], "It was not done being an offering."),
     O("Add an offering (1 Food)", [S_("food", -1), {"t": "doom", "n": -2}], "The fen seems to sigh.", {"food": 1}),
     O("Leave it", [], "")])
EVW("garden", "fairy_ring", "The Fairy Ring", "A perfect ring of pale mushrooms. The air inside is still and sweet.",
    [O("Step inside", [{"t": "stress", "n": -25, "who": "all"}, {"t": "doom", "n": 2}], "You lose an hour. Maybe more."),
     O("Pick the mushrooms", [S_("food", 3), {"t": "curse", "who": "random"}], "Edible. Mostly."),
     O("Walk around it", [], "")])
EVW("garden", "gardeners_journal", "The Gardener's Journal", "A journal left on a bench. The handwriting gets worse as it goes.",
    [O("Read it", [{"t": "xp", "n": 35}, {"t": "stress", "n": 12, "who": "all"}], "By the end it is not his handwriting."),
     O("Tear out the last page", [{"t": "remove_card"}], "Some things should not be learned."),
     O("Leave it", [], "")])

OBJECTIVES = {
    "boss": {"name": "Slay the Drowned King", "text": "Reach the throne and kill the King.", "reward": 50},
    "relic": {"name": "Recover the Pearl of Saint Ysolde", "text": "A relic-keeper elite guards the Pearl deep in the kingdom. Take it and survive the boss.", "reward": 60},
    "purge": {"name": "Purge the Belfry", "text": "Win six fights before facing the boss.", "reward": 50},
    "escort": {"name": "Escort the Pilgrim", "text": "A pilgrim walks with you. Each time a hero falls to Death's Door, the pilgrim loses heart. Reach the boss with the pilgrim alive.", "reward": 70},
}
ASCENSION = [
    {"id": "a_hp", "name": "Swollen Dead", "text": "Foes have 10% more HP."},
    {"id": "a_might", "name": "Grim Tide", "text": "Foes begin fights with 1 Might."},
    {"id": "a_food", "name": "Short Rations", "text": "Start with 3 less Food."},
    {"id": "a_light", "name": "Guttering Lamps", "text": "Start with 2 less Light."},
    {"id": "a_gold", "name": "Thin Purses", "text": "Gold rewards are 25% smaller."},
    {"id": "a_elite", "name": "Hunted", "text": "Elites appear more often."},
    {"id": "a_doom", "name": "Rising Water", "text": "The doom clock advances twice as fast."},
    {"id": "a_stress", "name": "Haunted Company", "text": "Heroes begin the run with 25 stress."},
    {"id": "a_choice", "name": "Meagre Spoils", "text": "Card rewards offer two choices, not three."},
    {"id": "a_boss", "name": "Wrathful King", "text": "Bosses have 15% more HP."},
    {"id": "a_heal", "name": "No Rest", "text": "Field camps heal half as much."},
    {"id": "a_curse", "name": "Marked by the Deep", "text": "Every hero begins the run with a Dread curse."},
    {"id": "a_prices", "name": "Greedy Merchants", "text": "Prices are 25% higher."},
    {"id": "a_injury", "name": "Brittle Bones", "text": "Death's Door always leaves an injury, and Grit is 1 lower."},
    {"id": "a_scaling", "name": "The Deep Remembers", "text": "Foes grow stronger with doom twice as fast."},
]
UNLOCKS = {
    "alchemist": {"name": "The Alchemist", "cost": 80, "kind": "class"},
    "oracle": {"name": "The Oracle", "cost": 120, "kind": "class"},
    "hexweaver": {"name": "The Hexweaver", "cost": 120, "kind": "class"},
    "provisioner": {"name": "Provisioner", "cost": 50, "kind": "hub", "text": "+2 Food at the start of each run."},
    "lamplighter": {"name": "Lamplighter", "cost": 50, "kind": "hub", "text": "+2 Light at the start of each run."},
    "quartermaster": {"name": "Quartermaster", "cost": 70, "kind": "hub", "text": "+40 gold at the start of each run."},
    "surgeon": {"name": "Surgeon", "cost": 60, "kind": "hub", "text": "+1 Medicine at the start of each run."},
    "armourer": {"name": "Armourer", "cost": 90, "kind": "hub", "text": "Every hero starts the run with a common armour."},
    "veterans": {"name": "Veterans", "cost": 160, "kind": "hub", "text": "Heroes start the run at level 2."},
}

out = os.path.join(os.path.dirname(__file__), "..", "..", "data")
json.dump({"gear": G, "runes": RUNES, "relics": RELICS, "consumables": CONSUMABLES, "injuries": INJURIES, "talents": TALENTS, "xp_levels": XP_LEVELS,
           "subclass_passives": SUB, "subclass_text": SUB_TEXT, "events": EVENTS, "objectives": OBJECTIVES, "ascension": ASCENSION, "unlocks": UNLOCKS},
          open(os.path.join(out, "run.json"), "w"), indent=1)
print("gear", len(G), "relics", len(RELICS), "events", len(EVENTS))
