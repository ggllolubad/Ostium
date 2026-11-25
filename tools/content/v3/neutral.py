"""Shared cards that belong to no calling: Swap, the two curses, the 15 world afflictions and the neutral pool.

Neutral pool: 20 cards, rarity N, offered rarely to any calling (a 10% slot in a reward offer). Themes from the
redesign plan: utility, movement, stress and supply. They must help every calling and never beat a calling's own
cards, so they sit at or a little under the budget for their strength. The checker prices N at 1.0; `arch` marks
the strength the card is budgeted at: neutral_common (1.0), neutral_uncommon (1.15), neutral_rare (1.3).
Names and flavour come from the Abbey of the Threshold and its keepers (art/party/bible/01_company.md, hub_spec.md).
"""
from dsl import *
set_class("shared", [1, 2, 3, 4], [1, 2, 3, 4])

# Swap (the universal move, rules v2 rule 4)
card("swap", "Swap", 1, "K", "adjacent_ally", [SWAP()], "Trade places with an adjacent hero.",
     flavour="In the narrow ways, the company moves as one body.",
     note="Two heroes trading ranks in a flooded nave, one ducking under the other's raised arm.")

# curses
card("dread", "Dread", 0, "Curse", "none", [], "Unplayable. When drawn: lose 1 vigour and draw a replacement.",
     use=[], kw=["Curse", "Unplayable"], on_draw=[EN(-1)],
     flavour="It came back through the door with you.",
     note="A hero frozen on a chapel threshold, one hand gripping the doorframe, unable to step through.")
card("festering", "Festering Wound", 0, "Curse", "none", [],
     "Unplayable. When drawn: lose 2 HP and draw a replacement. Cured at the infirmary.",
     use=[], kw=["Curse", "Unplayable"], on_draw=[SELFDMG(2)],
     flavour='"I\'ve had worse in my bed than you. Most of them died."',
     note="A bandaged forearm laid on Sister Wenna's table, the linen stained through and spreading.")

# afflictions (one per world; rules v2 rule 12)
# Names and effects: combat_rules_v2.md and art/party/bible/afflictions.md. Flavour is the world's rising doom line.
# Art rule: the cards read as wounds and fears, never as abstract penalties.
AK = ["Affliction", "Unplayable"]


def affliction(world, name, text, fx, flavour, note):
    card("aff_" + world, name, 0, "A", "none", [], "Unplayable. When drawn: " + text, use=[], kw=AK, on_draw=fx,
         flavour=flavour, note=note)


affliction("drowned", "Drowning", "gain 2 Soak, then draw a replacement.",
           [A("water", 2, attr="stable", to="self")],
           "The water rises up the nave, pew by pew.",
           "A hero coughing brine into cupped hands, water to the knees in the drowned nave.")
affliction("mire", "Fen Rot", "gain 2 Toxin, then draw a replacement.",
           [A("toxin", 2, attr="stable", to="self")],
           "The fen swells, and the stilts sink.",
           "A hero peeling back a boot to find the skin beneath gone soft and bile green.")
affliction("baths", "Fever", "lose 2 HP and gain 1 Burn, then draw a replacement.",
           [SELFDMG(2), A("fire", 1, attr="stable", to="self")],
           "The steam thickens, and the floors begin to scald.",
           "A hero slumped against a tiled bath wall, skin flushed pink and blistering in the steam.")
affliction("pits", "Black Lung", "gain 1 Toxin and 1 Burn, then draw a replacement.",
           [A("toxin", 1, attr="stable", to="self"), A("fire", 1, attr="stable", to="self")],
           "Gas gathers in the drifts, and the lamps burn green.",
           "A hero doubled over coughing yellow smoke in a mine gallery, a green lamp guttering above.")
affliction("foundry", "Ringing", "gain 2 Static, then draw a replacement.",
           [A("lightning", 2, attr="stable", to="self")],
           "The storm sinks lower, and the anvils strike on their own.",
           "A hero with hands clamped over the ears, hair standing on end, beside a ringing anvil.")
affliction("coast", "False Light", "discard a random card from this hand, then draw a replacement for this card.",
           [DISCARD_RANDOM(to="self")],
           "More false lights burn on the rocks every hour.",
           "A hero turning toward a lantern on the rocks while the company's real light falls behind.")
affliction("fleet", "Frostbite", "gain 2 Weaken, then draw a replacement.",
           [A("frost", 2, attr="stable", to="self")],
           "The ice closes in, hull by hull.",
           "A hero staring at fingertips gone white and grey, breath freezing on a ship's rail.")
affliction("rime", "The Split", "lose 1 Armor for the rest of the fight, then draw a replacement.",
           [LOSE_ARMOR(1, to="self")],
           "The cracks widen, and seams of fire run uphill.",
           "A hero's breastplate cracking down the middle, one half rimed, the other glowing at the seam.")
affliction("barrow", "Barrow Sickness", "gain 1 Toxin; this hero cannot be healed this round. Then draw a replacement.",
           [A("toxin", 1, attr="stable", to="self"), SELF("blight", 1)],
           "The barrow doors unseal, one by one.",
           "A hero pulling up a sleeve to find a grey-green plague sore spreading in the cold.")
affliction("hive", "Venom Tremor", "this hero's next card keeps only its first effect. Then draw a replacement.",
           [SELF("neuro", 1)],
           "The hive wakes, and the spires hum louder.",
           "A hero's sword hand shaking around a swollen sting, the weapon slipping from the fingers.")
affliction("spire", "Stillness", "this hero acts last this round. Then draw a replacement.",
           [SELF("lockdown", 1)],
           "The great clock's hand moves closer to twelve.",
           "A hero caught mid-stride, rime creeping up one leg, while the company moves on around them.")
affliction("silence", "The Hush", "gain 2 Erode, then draw a replacement.",
           [A("void", 2, attr="stable", to="self")],
           "The sound leaves: footsteps first, then voices, then heartbeats.",
           "A hero shouting at a comrade across the snow with no sound coming out at all.")
affliction("pyre", "Ash-Mark", "lose 2 HP, ignoring Block and Armor, then draw a replacement.",
           [SELFDMG(2)],
           "The black flame climbs the walls, and the candles stop giving light.",
           "A hero's palm branded with a black, lightless burn, smoke rising from it without a glow.")
affliction("garden", "The Bloom", "gain 1 Toxin and 1 Erode, then draw a replacement.",
           [A("toxin", 1, attr="stable", to="self"), A("void", 1, attr="stable", to="self")],
           "The blooms open, and the eyes in the leaves turn toward you.",
           "A hero brushing spores from a wrist where a small pale flower has taken root in the skin.")
affliction("sky", "Seen", "become Vulnerable this round, then draw a replacement.",
           [SELF("vulnerable", 1)],
           "The tears in the sky widen, and something leans closer.",
           "A hero looking up into a rent in the clouds, lit by a gaze too large to be seen whole.")

# neutral pool
# Interaction and depth (GATE3_AGENT.md): every neutral card is glue. It reads a state another calling or the foe
# sets up (Mark, Ward, Block, courses, ailments, Death's Door, a foe's intent), cares about the Ordo (Prime, cards
# played, follow-up, a foe moved earlier this round), converts one generic resource into another, or uses rank.
# `arch` = strength + the pairing it serves: neutral_common (1.0), neutral_uncommon (1.15), neutral_rare (1.3).
NC, NU, NR = "neutral_common", "neutral_uncommon", "neutral_rare"

# common strength (8)
card("step_through", "Step Through", 1, "N", "self", [ADV(1), B(4), PRIME(2)], "Advance 1. Gain 4 Block. Prime 2.",
     arch=NC + "+ordo_prime", up={"text": "Advance 1. Gain 5 Block. Prime 3.", "fx": [ADV(1), B(5), PRIME(3)]},
     flavour="The order keeps the doors. The company goes through them.",
     note="A hero stepping across a broken doorway into the front rank, a comrade's blow coming in behind.")
card("fall_back", "Fall Back", 1, "N", "self", [RET(1), B(4), B(3, if_="targeting_me")],
     "Retreat 1. Gain 4 Block, and 3 more if a foe means to hit you.",
     arch=NC + "+rank_foe_intent", up={"text": "Retreat 1. Gain 5 Block, and 4 more if a foe means to hit you.",
                                       "fx": [RET(1), B(5), B(4, if_="targeting_me")]},
     flavour="Give ground, keep breath. There are more doors after this one.",
     note="A hero backing into the rear rank as a foe's blow falls short on the stones.")
card("shoulder_aside", "Shoulder Aside", 1, "N", "enemy", [PUSH(1), D(2), D(3, if_="t.mark")],
     "Push the target back 1. Deal 2, and 3 more if it is Marked.",
     hit=[1, 2], arch=NC + "+duelist_mark",
     up={"text": "Push the target back 1. Deal 3, and 4 more if it is Marked.",
         "fx": [PUSH(1), D(3), D(4, if_="t.mark")]},
     flavour="The marked one goes down first. Everyone in the company knows it.",
     note="A hero driving a shoulder into a marked foe's chest, knocking it into the rank behind.")
card("vinegar_cloth", "Vinegar Cloth", 0, "N", "self", [STRESS(-2, per="ailments", k=-1)],
     "Shed 2 stress, plus 1 per ailment on you.",
     arch=NC + "+foe_ailments", up={"text": "Shed 3 stress, plus 1 per ailment on you.",
                                    "fx": [STRESS(-3, per="ailments", k=-1)]},
     flavour="Sister Wenna's remedy for the smell, and for most other things.",
     note="A course-stained hero pressing a vinegar-soaked cloth to the face between blows.")
card("off_key_hymn", "Off-Key Hymn", 1, "N", "ally", [STRESS(-6, per="played", k=-3)],
     "A hero sheds 6 stress, plus 3 per card you have played this round.",
     arch=NC + "+ordo_played", up={"text": "A hero sheds 8 stress, plus 4 per card you have played this round.",
                                   "fx": [STRESS(-8, per="played", k=-4)]},
     flavour="Mother Hild hums it over the anvil, badly. It helps anyway.",
     note="Two heroes back to back mid-fight, one humming under the breath, the other's shoulders easing.")
card("bandage_roll", "Bandage Roll", 1, "N", "ally", [H(6), STRESS(3)], "A hero heals 6 and gains 3 stress.",
     arch=NC + "+converter_stress_hp", up={"text": "A hero heals 6.", "fx": [H(6)]},
     flavour='"Sit. Bleed quietly."',
     note="A hero winding linen round a comrade's forearm, the roll unspooling into the mud.")
card("candle_bundle", "Candle Bundle", 1, "N", "self", [DRAW(1), DRAW(1, if_="played>=2")],
     "Next round, draw 1 more, and 1 more if you have played 2 or more cards this round.",
     arch=NC + "+ordo_played",
     up={"text": "Gain 3 Block. Next round, draw 1 more, and 1 more if you have played 2 or more cards this round.",
         "fx": [B(3), DRAW(1), DRAW(1, if_="played>=2")]},
     flavour='"Twelve candles. I counted. I\'ll count again when you\'re back."',
     note="A hero lighting a cellar candle from another, the rest tied in a bundle at the belt.")
card("follow_through", "Follow Through", 1, "N", "enemy", [D(3), D(3, if_="same_target"), PUSH(1, if_="same_target")],
     "Deal 3. If the action before this hit the same foe, deal 3 more and push it back 1.",
     arch=NC + "+ordo_follow_up",
     up={"text": "Deal 4. If the action before this hit the same foe, deal 4 more and push it back 1.",
         "fx": [D(4), D(4, if_="same_target"), PUSH(1, if_="same_target")]},
     flavour="Hired hands, not chosen ones. They fight like it.",
     note="A hero stepping into the gap a comrade's blow just opened, driving the foe back a rank.")

# uncommon strength (8)
card("rope_and_hook", "Rope and Hook", 1, "N", "enemy", [D(5, if_="t.moved"), PULL(2)],
     "Deal 5 if the target was moved this round. Pull it forward 2.",
     hit=[3, 4], arch=NU + "+any_movement",
     up={"text": "Deal 7 if the target was moved this round. Pull it forward 2.", "fx": [D(7, if_="t.moved"), PULL(2)]},
     flavour="What hides at the back comes to the front, one way or another.",
     note="A rope snaking over the front rank to hook a staggered back-rank foe and haul it forward.")
card("change_of_watch", "Change of Watch", 1, "N", "adjacent_ally", [SWAP(), B(3), B(3, to="self"), PRIME(1)],
     "Trade places with an adjacent hero. Each of you gains 3 Block. Prime 1.",
     arch=NU + "+rank_swap",
     up={"text": "Trade places with an adjacent hero. Each of you gains 4 Block. Prime 1.",
         "fx": [SWAP(), B(4), B(4, to="self"), PRIME(1)]},
     flavour="Someone always keeps the door. Tonight it is your turn.",
     note="Two heroes passing in the line, shields overlapping as they trade ranks.")
card("the_vigil", "The Vigil", 1, "N", "self", [CONS(s="block", to="self"), STRESS(0, to="all_allies", per="consumed", k=-1)],
     "Spend all your Block. Every hero sheds 1 stress per Block spent.",
     arch=NU + "+bulwark_block",
     up={"text": "Spend all your Block. Every hero sheds 2 stress, plus 1 per Block spent.",
         "fx": [CONS(s="block", to="self"), STRESS(-2, to="all_allies", per="consumed", k=-1)]},
     flavour="Somewhere behind you, the Abbot still kneels at the sealed door, listening.",
     note="A hero lowering a shield for one breath while the company bows heads round a single candle.")
card("round_the_brazier", "Round the Brazier", 2, "N", "all_allies", [STRESS(-4), H(4, if_="t.dd")],
     "Every hero sheds 4 stress. Every hero at Death's Door heals 4.",
     arch=NU + "+deaths_door",
     up={"text": "Every hero sheds 5 stress. Every hero at Death's Door heals 5.", "fx": [STRESS(-5), H(5, if_="t.dd")]},
     flavour="In the garth, one iron brazier burns by the broken cross. Remember it.",
     note="The company crouched round a guttering brazier, a fallen hero dragged close to the coals.")
card("cellar_bread", "Cellar Bread", 1, "N", "self", [STRESS(-4), EN(1, if_="rank>=3")],
     "Shed 4 stress. Next round, +1 vigour if you stand in rank 3 or 4.",
     arch=NU + "+rank_back",
     up={"text": "Shed 4 stress. Next round, +1 vigour if you stand in rank 2, 3 or 4.",
         "fx": [STRESS(-4), EN(1, if_="rank>=2")]},
     flavour='"Bread keeps. People don\'t."',
     note="A back-rank hero tearing dark bread from the cellar stores and passing it forward.")
card("codex_page", "Codex Page", 1, "N", "enemy", [DRAW(1, to="self"), DRAW(1, to="self", if_="m.spectrum>=2")],
     "Next round, draw 1 more, and 1 more if the target bears 2 or more courses.",
     arch=NU + "+elementalist_courses",
     up={"text": "Next round, draw 1 more, and 1 more if the target bears any course.",
         "fx": [DRAW(1, to="self"), DRAW(1, to="self", if_="m.spectrum>=1")]},
     flavour='"I have written you down. Try to stay legible."',
     note="A hero reading a torn Codex page mid-fight, the course-stained foe ahead inked on it.")
card("herb_bundle", "Herb Bundle", 1, "N", "ally", [H(0, per="t.ailments", k=1, max=5), CLEANSE(3)],
     "A hero heals 1 per ailment they carry (up to 5), then is cleansed of 3 ailments.",
     arch=NU + "+foe_ailments",
     up={"text": "A hero heals 1, plus 1 per ailment they carry (up to 6), then is cleansed of 4 ailments.",
         "fx": [H(1, per="t.ailments", k=1, max=6), CLEANSE(4)]},
     flavour="Herbs from the Infirmarium, bound in twine and smelling of vinegar.",
     note="A hero pressing a crushed herb bundle to a comrade's course-stained wound.")
card("touch_the_relic", "Touch the Relic", 1, "N", "ally", [W(2), B(0, per="t.ward", k=2, max=12)],
     "A hero gains 2 Ward, then 2 Block per Ward they have (up to 12).",
     arch=NU + "+elementalist_ward",
     up={"text": "A hero gains 3 Ward, then 2 Block per Ward they have (up to 14).",
         "fx": [W(3), B(0, per="t.ward", k=2, max=14)]},
     flavour='"This one is still cold. It has not forgiven you."',
     note="A hero's bare fingertips on a small cold reliquary, frost spreading into a raised shield.")

# rare strength (4)
card("into_the_doorway", "Into the Doorway", 1, "N", "adjacent_ally",
     [SWAP(), GUARD(), B(2, to="self"), B(3, to="self", if_="m.targeting_me")],
     "Trade places with an adjacent hero and Guard them this round. Gain 2 Block, and 3 more if a foe means to hit them.",
     arch=NR + "+rank_guard",
     up={"text": "Trade places with an adjacent hero and Guard them this round. Gain 3 Block, and 4 more if a foe "
                 "means to hit them.",
         "fx": [SWAP(), GUARD(), B(3, to="self"), B(4, to="self", if_="m.targeting_me")]},
     flavour="Every door needs someone standing in it.",
     note="A hero stepping in front of a threatened comrade to fill a doorway, shield raised.")
card("chalk_the_names", "Chalk the Names", 2, "N", "all_allies", [STRESS(-6), STRESS(-6, if_="hero_dd")],
     "Every hero sheds 6 stress, and 6 more if any hero is at Death's Door.",
     arch=NR + "+deaths_door",
     up={"text": "Every hero sheds 8 stress, and 8 more if any hero is at Death's Door.",
         "fx": [STRESS(-8), STRESS(-8, if_="hero_dd")]},
     flavour="The names of the dead are chalked on the cross. Not yours. Not today.",
     note="A hero chalking a name onto a stone step while a comrade lies at Death's Door beside them.")
card("fenns_alms", "Fenn's Alms", 1, "N", "self", [STRESS(4), EN(2)], "Gain 4 stress. Next round, +2 vigour. Exhaust.",
     kw=["Exhaust"], arch=NR + "+converter_stress_vigour", up={"text": "Next round, +2 vigour. Exhaust.", "fx": [EN(2)]},
     flavour='"Alms are free, friend. The handling is extra."',
     note="A fat purse pressed into a hero's gauntlet, a red entry blotting in a ledger behind.")
card("red_rubric", "Red Rubric", 1, "N", "ally", [GRIT(1), H(6, if_="t.dd")],
     "A hero gains 1 Grit. If they are at Death's Door, they also heal 6.",
     arch=NR + "+deaths_door", up={"text": "A hero gains 1 Grit. If they are at Death's Door, they also heal 8.",
                                   "fx": [GRIT(1), H(8, if_="t.dd")]},
     flavour="A strip of red rubric cloth, tied where it shows: the company's only uniform.",
     note="A hero knotting a red rubric strip round the arm of a comrade at Death's Door.")

NEEDS = []
