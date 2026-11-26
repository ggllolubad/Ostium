"""Vessel, the secret seventh calling: Gate 3 card set.

Brief: docs/design/gate2/calling_vessel.md. Bible: art/party/bible/hero_vessel.md. Decisions: DECISIONS.md rows 10
and 11 (held courses fall by 1 a round like any course, at most 6 per course, all clear when a fight ends; Hearth,
Mouth and Whole approved as proposed). Engine words: GATE3_VOCAB.md section 8 (TAKE, GIVE, EVEN, held_ quantities).

Body rule: every course laid on the Vessel, by foe or hero, is held on its skin and never harms it or reacts.

Archetypes (arch keys match the path keys):
  hearth  The Warm Room: lift courses off heroes (Takes from heroes) and catch the blows that carry them (Guard,
          Taunt, Mantle). Payoffs: Block and Regen for the heroes beside the Vessel, healing, and damage equal to the
          weight held.
  mouth   The Conduit: swallow courses from foes, lay them Stable on the foe that carries the partner course, then
          Spit a Volatile stack to set off the Conjunction. Payoffs count the Conjunctions so far this round.
  whole   Holds All Six: gather one of each course (self-holds, copies, Takes of one of every course, the belt).
          Payoffs read the number of different courses held, evenness, and the Whole check (all six).
Hybrids: hero Takes and Unclench join Hearth and Mouth; Takes of one of every course and gives of every course join
Mouth and Whole; Block and Regen per different course join Hearth and Whole.

Vigour and the Ordo (interaction pass, GATE3_INTERACTION.md): each path reads the company's round as well as its skin.
  hearth  restraint: vigour left unspent pays (Warm Room, Full Weight), Bank keeps it (Banked Coals, Heavy Air), and
          the Hearth hands neighbours Thrift (Warm Room, Keep Watch when last).
  mouth   the relay: a Handoff (the card just before was another hero's) turns gives Volatile (Breathe Out, Conduit,
          Split Tongue) or adds damage (Chew, Lend Weight); big turns flood the line (Flood the Line, Speak to All);
          Lay It Down sets it all off when last.
  whole   the whole company: payoffs for heroes who acted before it (The Weighing, Six Rays), position (Illuminated
          Initial first, Balanced Hands in the middle), Bank (Weigh, Still Centre, Keep the Hours) and Thrift when
          Whole (Gilt Edge, The Whole Conjunction).

Text words: "hold n Fire" puts n Fire on the Vessel's skin; "your largest held course" is the course with the most
held stacks; "different courses you hold" is held_kinds; "Whole" means holding all six courses.
Card ids carry the prefix ve_. An arch of "a+b" names two archetypes, or an archetype and another calling's setup."""
from dsl import *

set_class("vessel", [2, 3], [1, 2, 3])
ALL = [1, 2, 3, 4]      # Hearth guards, Block and Takes from heroes work from any rank
FAR = [1, 2, 3, 4]      # a few Mouth cards reach rank 4
BACKREACH = [2, 3, 4]
FI, FR, LI, WA, TX, VO = "fire", "frost", "lightning", "water", "toxin", "void"
ELS = [FI, FR, LI, WA, TX, VO]
HE, MO, WH = "hearth", "mouth", "whole"
VOL = "volatile"
WHOLE = "held_kinds>=6"
EVENQ = "held_kinds>=2&held_max<=held_min"


def lack(n=1, cond=None):
    """Hold n stacks of each course the Vessel does not hold (optionally only if cond)."""
    return [A(e, n, to="self", if_="!held_" + e + ("&" + cond if cond else "")) for e in ELS]


def copy_main():
    """Hold 1 stack of each course the card's target carries (it keeps its own)."""
    return [A(e, 1, to="self", if_="m." + e + ">0") for e in ELS]


# ------------------------------------------------------------------ kit
card("ve_draw_breath", "Draw Breath", 1, "K", "ally",
     [TAKE("largest", 1), TAKE("largest", 1, to="front_enemy", if_="!consumed"), B(2, to="self")],
     "Take 1 stack of a hero's largest course. If it carried none, take 1 stack of the front foe's largest course "
     "instead. Gain 2 Block.", use=ALL, arch="core",
     flavour="In through the open hand. Whatever burns them settles here.",
     note="The Vessel breathes in, palm turned to a hero, and a bead of fire crosses onto the vermilion band.",
     up={"text": "Take up to 2 stacks of a hero's largest course. If it carried none, take up to 2 stacks of the front "
                 "foe's largest course instead. Gain 2 Block.",
         "fx": [TAKE("largest", 2), TAKE("largest", 2, to="front_enemy", if_="!consumed"), B(2, to="self")]})
card("ve_shelter", "Shelter", 1, "K", "adjacent_ally", [GUARD()],
     "Guard an adjacent hero this round.", use=ALL, sub=HE, arch=HE,
     flavour="Stand behind me. It cannot hurt me the way it hurts you.",
     note="The Hearth Vessel steps half a pace aside, long sleeve raised before a hunched hero.",
     up={"text": "Guard an adjacent hero this round. Gain 2 Block.", "fx": [GUARD(), B(2, to="self")]})
card("ve_breathe_out", "Breathe Out", 1, "K", "enemy",
     [GIVE("largest", 1, if_="!handoff"), GIVE("largest", 1, attr=VOL, if_="handoff"), D(3)],
     "Give 1 stack of your largest held course to the target, Volatile on a Handoff. Deal 3.", sub=MO, arch=MO,
     flavour="The breath goes out, and what it carried goes with it.",
     note="The Mouth Vessel exhales toward a foe; a bead of deep blue leaves the band and crosses.",
     up={"text": "Give 1 stack of your largest held course to the target, Volatile on a Handoff. Deal 5.",
         "fx": [GIVE("largest", 1, if_="!handoff"), GIVE("largest", 1, attr=VOL, if_="handoff"), D(5)]})
card("ve_weigh", "Weigh", 1, "K", "self", [EVEN(), B(1), BANK(1, to="self")],
     "Even out your held stacks across the courses you hold. Gain 1 Block. Bank 1.", use=ALL, sub=WH, arch=WH,
     flavour="Six pans on one beam. None of them may sink.",
     note="The Whole Vessel holds both palms level; the seals on the bands slide until they match.",
     up={"text": "Even out your held stacks across the courses you hold. Gain 3 Block. Bank 1.",
         "fx": [EVEN(), B(3), BANK(1, to="self")]})

# ------------------------------------------------------------------ starters (deck: 3 Open Hand, 2 Bear It,
# 2 Take Into Me, 2 Give Back, 1 Six Breaths)
card("ve_open_hand", "Open Hand", 1, "S", "enemy", [D(5), GIVE("largest", 1)],
     "Deal 5. Give 1 stack of your largest held course to the target.", arch="core",
     flavour="An open hand, lifted. What it held crosses over.",
     note="The Vessel lifts an open inked palm toward a foe and a bead of vermilion leaves the skin.",
     up={"text": "Deal 7. Give 1 stack of your largest held course to the target.", "fx": [D(7), GIVE("largest", 1)]})
card("ve_bear_it", "Bear It", 1, "S", "self", [B(4, per="held_kinds", k=1)],
     "Gain 4 Block, plus 1 per different course you hold.", use=ALL, arch=HE,
     flavour="It settles on the skin and waits. So do I.",
     note="A blow lands on the upright Vessel; the seals on the bands do not stir.",
     up={"text": "Gain 6 Block, plus 1 per different course you hold.", "fx": [B(6, per="held_kinds", k=1)]})
card("ve_take_into_me", "Take Into Me", 1, "S", "ally", [TAKE("largest", 4), H(2)],
     "Take up to 4 stacks of a hero's largest course. That hero heals 2.", use=ALL, arch=HE,
     flavour="What would burn you only settles on me.",
     note="The Vessel lays a palm on a scorched hero's shoulder; the burn climbs into the vermilion band.",
     up={"text": "Take up to 5 stacks of a hero's largest course. That hero heals 3.",
         "fx": [TAKE("largest", 5), H(3)]})
card("ve_give_back", "Give Back", 1, "S", "enemy", [GIVE("largest", 4), B(2, to="self")],
     "Give up to 4 stacks of your largest held course to the target. Gain 2 Block.", arch=MO,
     flavour="It was yours before it was mine. Take it home.",
     note="The Vessel turns a palm outward and the deep blue band empties onto a foe as a skin of water.",
     up={"text": "Give up to 5 stacks of your largest held course to the target. Gain 3 Block.",
         "fx": [GIVE("largest", 5), B(3, to="self")]})
card("ve_six_breaths", "Six Breaths", 1, "S", "self", lack() + [B(2)],
     "Hold 1 stack of each course you do not hold. Gain 2 Block. Exhaust.", use=ALL, kw=["Exhaust"], arch=WH,
     flavour="Six breaths, one for each ink. On the sixth the body is whole.",
     note="The Vessel breathes in slowly and all six bands brighten, from the fingertips to the jaw.",
     up={"text": "Hold 1 stack of each course you do not hold. Gain 2 Block.", "kw": []})

# ------------------------------------------------------------------ common: Hearth
card("ve_lift", "Lift", 1, "C", "adjacent_ally", [TAKE("largest"), B(2, per="consumed", k=1)],
     "Take all of an adjacent hero's largest course. That hero gains 2 Block, plus 1 per stack taken.",
     use=ALL, arch=HE,
     flavour="Lean on me. Give me the heavy part.",
     note="The Vessel slips an arm under a stooped hero; rime lifts from their mail onto the pale blue band.",
     up={"text": "Take all of an adjacent hero's largest course. That hero gains 4 Block, plus 1 per stack taken.",
         "fx": [TAKE("largest"), B(4, per="consumed", k=1)]})
card("ve_stand_near", "Stand Near", 1, "C", "adjacent_ally", [GUARD(), B(3, to="self")],
     "Guard an adjacent hero this round. Gain 3 Block.", use=ALL, arch=HE,
     flavour="Whatever is thrown at you, throw it at me.",
     note="The Vessel stands at a hero's shoulder as a foe's spit of fire bends toward the inked arm.",
     up={"text": "Guard an adjacent hero this round. Gain 5 Block.", "fx": [GUARD(), B(5, to="self")]})
card("ve_banked_coals", "Banked Coals", 1, "C", "self", [B(1, per="held_total", k=1, max=8), BANK(1, to="self")],
     "Gain 1 Block, plus 1 per stack you hold, at most 8 in all. Bank 1.", use=ALL, arch="hearth+whole",
     flavour="Banked coals keep the house warm all night.",
     note="The Vessel stands still while the held seals glow under the robe like coals under ash.",
     up={"text": "Gain 2 Block, plus 1 per stack you hold, at most 12 in all. Bank 2.",
         "fx": [B(2, per="held_total", k=1, max=12), BANK(2, to="self")]})
card("ve_weight_of_it", "The Weight of It", 1, "C", "enemy", [D(2, per="held_total", k=1, max=12)],
     "Deal 2, plus 1 per stack you hold, at most 12 in all.", arch=HE,
     flavour="You laid all of this on them. Feel what it weighs.",
     note="The Vessel lowers one open palm onto a foe and the foe sags as if under a millstone.",
     up={"text": "Deal 3, plus 1 per stack you hold, at most 16 in all.",
         "fx": [D(3, per="held_total", k=1, max=16)]})
card("ve_hearthstone", "Hearthstone", 1, "C", "adjacent_ally", [B(3), ST("regen", 1, per="held_kinds", k=0.5)],
     "An adjacent hero gains 3 Block and Regen 1, plus 1 Regen per 2 different courses you hold.",
     use=ALL, arch="hearth+whole",
     flavour="Sit by me. The stone keeps the heat long after the fire.",
     note="A hero warms raw hands at the Vessel's banded forearm as at a hearthstone.",
     up={"text": "An adjacent hero gains 4 Block and Regen 2, plus 1 Regen per 2 different courses you hold.",
         "fx": [B(4), ST("regen", 2, per="held_kinds", k=0.5)]})
card("ve_warm_hands", "Warm Hands", 1, "C", "ally", [TAKE("all", 1), H(1, per="consumed", k=1)],
     "Take 1 stack of every course on a hero. That hero heals 1, plus 1 per stack taken.", use=ALL, arch=HE,
     flavour="Every sickness has a colour. I take a little of each.",
     note="The Vessel cups a hero's face in both hands; thin threads of six inks run up the wrists.",
     up={"text": "Take 1 stack of every course on a hero. That hero heals 3, plus 1 per stack taken.",
         "fx": [TAKE("all", 1), H(3, per="consumed", k=1)]})
card("ve_shoulder_it", "Shoulder It", 1, "C", "adjacent_ally",
     [TAKE("largest"), B(3, to="self"), B(4, if_="t.taunt>0")],
     "Take all of an adjacent hero's largest course. Gain 3 Block. If that hero has Taunt, it gains 4 Block.",
     use=ALL, arch="hearth+bulwark_taunt",
     flavour="You hold the door. I will hold what comes through it.",
     note="The Vessel stands at the Bulwark's back, drawing a green rot off the door-shield into the skin.",
     up={"text": "Take all of an adjacent hero's largest course. Gain 4 Block. If that hero has Taunt, it gains 6 "
                 "Block.", "fx": [TAKE("largest"), B(4, to="self"), B(6, if_="t.taunt>0")]})
card("ve_come_to_me", "Come to Me", 1, "C", "self", [SELF("taunt", 1), B(4)],
     "Gain Taunt and 4 Block.", use=ALL, arch=HE,
     flavour="Here. Lay it on me. I am the only one it cannot hurt.",
     note="The Vessel opens both arms in the orans pose and every foe turns toward the inked palms.",
     up={"text": "Gain Taunt and 6 Block.", "fx": [SELF("taunt", 1), B(6)]})

# ------------------------------------------------------------------ common: Mouth
card("ve_spit", "Spit", 0, "C", "enemy", [GIVE("largest", 1, attr=VOL), D(2)],
     "Give 1 Volatile stack of your largest held course to the target. Deal 2.", arch=MO,
     flavour="A drop is enough, if it lands on the right ink.",
     note="The Vessel flicks two fingers and one bright bead flies from the band into a foe's settled ink.",
     up={"text": "Give 1 Volatile stack of your largest held course to the target. Deal 3.",
         "fx": [GIVE("largest", 1, attr=VOL), D(3)]})
card("ve_swallow", "Swallow", 1, "C", "enemy", [TAKE("largest"), B(2, per="consumed", k=1, to="self")],
     "Take all of the target's largest course. Gain 2 Block, plus 1 per stack taken.", arch="mouth+hearth",
     flavour="Courses settle on me and wait. Yours will wait too.",
     note="A foe's steam drains off its hide and settles as seals along the Vessel's forearm.",
     up={"text": "Take all of the target's largest course. Gain 4 Block, plus 1 per stack taken.",
         "fx": [TAKE("largest"), B(4, per="consumed", k=1, to="self")]})
card("ve_mouthful", "Mouthful", 1, "C", "enemy", [TAKE("all", 1), D(2, per="consumed", k=1)],
     "Take 1 stack of every course on the target. Deal 2, plus 1 per stack taken.", arch="mouth+whole",
     flavour="A taste of each. The body remembers every one.",
     note="The Vessel touches a many-coloured foe and a thread of each colour follows the hand back.",
     up={"text": "Take 1 stack of every course on the target. Deal 4, plus 1 per stack taken.",
         "fx": [TAKE("all", 1), D(4, per="consumed", k=1)]})
card("ve_retch", "Retch", 1, "C", "enemy", [GIVE("largest", 3), GIVE("largest", 2, to="adjacent")],
     "Give up to 3 stacks of your largest held course to the target, then up to 2 stacks of your largest held course "
     "to each foe beside it.", arch=MO,
     flavour="Too much at once. It goes back where it came from, and further.",
     note="The Vessel's open hand sweeps along the foes' line and green rot spatters across three of them.",
     up={"text": "Give up to 4 stacks of your largest held course to the target, then up to 3 stacks of your largest "
                 "held course to each foe beside it.",
         "fx": [GIVE("largest", 4), GIVE("largest", 3, to="adjacent")]})
card("ve_taste", "Taste", 1, "C", "enemy",
     [DRAW(1, to="self", if_="m.spectrum>=2"), TAKE("largest", 2), D(2)],
     "If the target carries 2 or more different courses, draw 1 more card next round. Take up to 2 stacks of its "
     "largest course. Deal 2.", arch="mouth+elementalist_courses",
     flavour="Salt, smoke, copper. I know what you are made of now.",
     note="The Vessel touches a fingertip to a foe's stained hide, then to its own unclenched lips.",
     up={"text": "If the target carries 2 or more different courses, draw 1 more card next round. Take up to 2 stacks "
                 "of its largest course. Deal 4.",
         "fx": [DRAW(1, to="self", if_="m.spectrum>=2"), TAKE("largest", 2), D(4)]})
card("ve_other_half", "The Other Half", 1, "C", "enemy", [GIVE("largest", 2, attr=VOL), D(5, if_="reactions>0")],
     "Give up to 2 Volatile stacks of your largest held course to the target. If the company has set off a "
     "Conjunction this round, deal 5.", arch=MO,
     flavour="Every course is half of something. I carry the missing half.",
     note="A foe wears a skin of water; the Vessel's gold band empties onto it and the water lights.",
     up={"text": "Give up to 3 Volatile stacks of your largest held course to the target. If the company has set off "
                 "a Conjunction this round, deal 6.", "fx": [GIVE("largest", 3, attr=VOL), D(6, if_="reactions>0")]})
card("ve_soak_the_mark", "Soak the Mark", 1, "C", "enemy",
     [D(3), GIVE(WA, 2), GIVE(WA, 2, attr=VOL, if_="t.mark>0")],
     "Deal 3. Give up to 2 Water to the target. If it is Marked, also give it up to 2 Volatile Water.",
     arch="mouth+duelist_mark",
     flavour="Wet the place the blade will find. Lightning loves water.",
     note="The Vessel lays a wet palm on the spot the Duelist marked; the deep blue band runs dry.",
     up={"text": "Deal 4. Give up to 3 Water to the target. If it is Marked, also give it up to 3 Volatile Water.",
         "fx": [D(4), GIVE(WA, 3), GIVE(WA, 3, attr=VOL, if_="t.mark>0")]})
card("ve_second_mouthful", "Second Mouthful", 1, "C", "enemy",
     [D(3), GIVE("largest", 2), GIVE("largest", 2, attr=VOL, if_="same_target")],
     "Deal 3. Give up to 2 stacks of your largest held course to the target. If the action before this one struck "
     "the same foe, also give it up to 2 Volatile stacks of your largest held course.", arch=MO,
     flavour="The first lays the table. The second lights it.",
     note="The Vessel's second palm follows the first onto the same foe, and the inks meet.",
     up={"text": "Deal 4. Give up to 3 stacks of your largest held course to the target. If the action before this "
                 "one struck the same foe, also give it up to 2 Volatile stacks of your largest held course.",
         "fx": [D(4), GIVE("largest", 3), GIVE("largest", 2, attr=VOL, if_="same_target")]})
card("ve_bitter_gift", "Bitter Gift", 1, "C", "enemy", [GIVE(TX, 2), GIVE(VO, 2), D(0, per="t.hex", k=0.5)],
     "Give up to 2 Toxin and up to 2 Void to the target. Deal 1 per 2 Hex on it.", cat=TX,
     arch="mouth+hexweaver_hex",
     flavour="Rot and hollow, laid on a cursed thing. It will not mend.",
     note="Green and violet-black drip from the Vessel's palm onto a foe already bound in the Hexweaver's knots.",
     up={"text": "Give up to 3 Toxin and up to 3 Void to the target. Deal 1 per 2 Hex on it.",
         "fx": [GIVE(TX, 3), GIVE(VO, 3), D(0, per="t.hex", k=0.5)]})

# ------------------------------------------------------------------ common: Whole
card("ve_ink_band", "Ink Band", 1, "C", "self", lack(),
     "Hold 1 stack of each course you do not hold.", use=ALL, arch=WH,
     flavour="Vermilion, pale blue, gold, deep blue, green, violet-black. In that order.",
     note="A bare band on the Vessel's arm fills with ink, edged in a hairline of gold.",
     up={"text": "Hold 1 stack of each course you do not hold. Gain 3 Block.", "fx": lack() + [B(3)]})
card("ve_rule_line", "Rule Line", 1, "C", "enemy", [D(1, per="held_kinds", k=2)],
     "Deal 1, plus 2 per different course you hold.", arch=WH,
     flavour="Straight as a scribe's rule. Each line a colour, each colour a cut.",
     note="The Vessel draws a level hand across a foe and six thin lines of ink open on its hide.",
     up={"text": "Deal 3, plus 2 per different course you hold.", "fx": [D(3, per="held_kinds", k=2)]})
card("ve_balance_the_scale", "Balance the Scale", 1, "C", "self", [EVEN(), DRAW(1)],
     "Even out your held stacks across the courses you hold. Draw 1 more card next round.", use=ALL, arch=WH,
     flavour="Too much of one, too little of another. She kept them level.",
     note="The Vessel holds both palms out, level, and the seals drift along the bands to match.",
     up={"text": "Even out your held stacks across the courses you hold. Gain 3 Block. Draw 1 more card next round.",
         "fx": [EVEN(), B(3), DRAW(1)]})
card("ve_nimbus", "Nimbus", 1, "C", "self", [B(4), W(1, to="allies_other", if_=EVENQ)],
     "Gain 4 Block. If you hold 2 or more courses, all in equal stacks, every other hero gains 1 Ward.",
     use=ALL, arch=WH,
     flavour="A broken ring of six arcs. When they are equal, it closes.",
     note="The six-part ink ring behind the Vessel's head brightens arc by arc over the company.",
     up={"text": "Gain 5 Block. If you hold 2 or more courses, all in equal stacks, every other hero gains 2 Ward.",
         "fx": [B(5), W(2, to="allies_other", if_=EVENQ)]})
card("ve_illumination", "Illumination", 0, "C", "self", [PRIME(1, per="held_kinds", k=1, max=5, if_="handoff")],
     "Handoff: Prime 1, plus 1 per different course you hold, at most 5 in all.", use=ALL, arch=WH,
     flavour="Gold on the margin, so the eye goes where it must.",
     note="Faint script in the Vessel's bands lights up, and a hero's blade catches the colours.",
     up={"text": "Prime 1. Handoff: Prime 1 more, plus 1 per different course you hold, at most 5 more.",
         "fx": [PRIME(1), PRIME(1, per="held_kinds", k=1, max=5, if_="handoff")]})
card("ve_copy_the_page", "Copy the Page", 1, "C", "enemy", [D(2)] + copy_main(),
     "Deal 2. Hold 1 stack of each course the target carries.", arch="whole+elementalist_courses",
     flavour="A scholar's habit. Read it once and it is written in you.",
     note="The Vessel studies a foe's stained hide; the same colours write themselves onto the bands.",
     up={"text": "Deal 4. Hold 1 stack of each course the target carries.", "fx": [D(4)] + copy_main()})
card("ve_drink_the_dregs", "Drink the Dregs", 1, "C", "self", [B(2)] + lack(cond="flasks_used"),
     "Gain 2 Block. Dosed: hold 1 stack of each course you do not hold.", use=ALL, kw=["Dosed"],
     arch="whole+alchemist_flask",
     flavour="Whatever the healer left in the cup, I will hold.",
     note="The Vessel drains the last of an Alchemist's flask and the empty bands fill with colour.",
     up={"text": "Gain 4 Block. Dosed: hold 1 stack of each course you do not hold.",
         "fx": [B(4)] + lack(cond="flasks_used")})

# ------------------------------------------------------------------ uncommon: Hearth
card("ve_sponge", "Sponge", 1, "U", "all_allies", [TAKE("all"), B(0, per="consumed", k=1, max=10, to="self")],
     "Take every course stack from every hero. Gain 1 Block per stack taken, at most 10.", use=ALL, arch=HE,
     flavour="Wring it out of them. Let it soak into me.",
     note="Colour drains off every hero at once and runs up the Vessel's bands like water up a cloth.",
     up={"text": "Take every course stack from every hero. Gain 2 Block, plus 1 per stack taken, at most 14 in all.",
         "fx": [TAKE("all"), B(2, per="consumed", k=1, max=14, to="self")]})
card("ve_unclench", "Unclench", 2, "U", "enemy",
     [GIVE("all"), H(0, per="consumed", k=0.5, max=5, to="all_allies"), STRESS(-4, to="all_allies")],
     "Give everything you hold to the target. Every hero heals 1 per 2 stacks given, at most 5, and sheds 4 stress.",
     arch="hearth+mouth",
     flavour="Let go. It was never mine to keep.",
     note="The Vessel opens a clenched fist for the first time; every seal flies off the skin toward a foe.",
     up={"text": "Give everything you hold to the target. Every hero heals 1 per 2 stacks given, at most 5, and sheds "
                 "4 stress.", "cost": 1})
card("ve_warm_room", "The Warm Room", 1, "U", "self",
     [B(1, per="held_kinds", k=1, to="self_adjacent"), ST("thrift", 1, to="self_adjacent", if_="vigour_left>=2")],
     "Each hero beside you gains 1 Block, plus 1 per different course you hold. If 2 or more vigour is left unspent "
     "this round, each of them also gains 1 Thrift.",
     use=ALL, arch="hearth+whole",
     flavour="One room in the Guesthouse is always warm. The Vessel stands in it.",
     note="The heroes on either side lean in toward the Vessel as toward a stove in a cold room.",
     up={"text": "Each hero beside you gains 2 Block, plus 1 per different course you hold. Gain 3 Block. If 2 or more "
                 "vigour is left unspent this round, each hero beside you also gains 1 Thrift.",
         "fx": [B(2, per="held_kinds", k=1, to="self_adjacent"), B(3),
                ST("thrift", 1, to="self_adjacent", if_="vigour_left>=2")]})
card("ve_heavy_air", "Heavy Air", 1, "U", "all_enemies", [D(0, per="held_total", k=0.5, max=5), BANK(1, to="self")],
     "Deal 1 per 2 stacks you hold to every foe, at most 5 each. Bank 1.", arch=HE,
     flavour="The room grows heavy with everything I carry.",
     note="The air around the still Vessel thickens with colour and the foes' line bows under it.",
     up={"text": "Deal 1, plus 1 per 2 stacks you hold, to every foe, at most 6 each. Bank 1.",
         "fx": [D(1, per="held_total", k=0.5, max=6), BANK(1, to="self")]})
card("ve_keep_watch", "Keep Watch", 1, "U", "adjacent_ally", [GUARD(), TAKE("all"), BANK(1, to="self", if_="last")],
     "Guard an adjacent hero this round and take every course stack on it. If this is last in the Ordo, Bank 1.", use=ALL, arch=HE,
     flavour="Sleep. I sleep standing, and I will stand here.",
     note="The Vessel stands asleep beside a resting hero, drawing the fever off them in thin threads.",
     up={"text": "Guard an adjacent hero this round and take every course stack on it. Gain 3 Block. If this is last "
                 "in the Ordo, Bank 1.",
         "fx": [GUARD(), TAKE("all"), B(3, to="self"), BANK(1, to="self", if_="last")]})
card("ve_bare_skin", "Bare Skin", 1, "U", "self", [SELF("taunt", 1), SELF("thorns", 1, per="held_kinds", k=1)],
     "Gain Taunt, and 1 Thorns plus 1 per different course you hold.", use=ALL, arch="hearth+whole",
     flavour="Strike the inked skin if you like. Every band bites back.",
     note="A foe's claw rakes the Vessel's sleeve and comes away stained in six colours.",
     up={"text": "Gain Taunt and 4 Block, and 1 Thorns plus 1 per different course you hold.",
         "fx": [SELF("taunt", 1), B(4), SELF("thorns", 1, per="held_kinds", k=1)]})
card("ve_pass_through", "Pass Through", 1, "U", "ally", [TAKE("largest"), H(2), GIVE("largest", 3, to="front_enemy")],
     "Take all of a hero's largest course. That hero heals 2. Give up to 3 stacks of your largest held course to the "
     "front foe.", use=ALL, arch="hearth+mouth",
     flavour="In through one hand, out through the other. I am only the door.",
     note="One palm rests on a hero, the other opens at the front foe; the colour runs between them.",
     up={"text": "Take all of a hero's largest course. That hero heals 3. Give up to 3 Volatile stacks of your largest "
                 "held course to the front foe.",
         "fx": [TAKE("largest"), H(3), GIVE("largest", 3, attr=VOL, to="front_enemy")]})

# ------------------------------------------------------------------ uncommon: Mouth
card("ve_exhale", "Exhale", 1, "U", "enemy", [GIVE("all", 1, attr=VOL), D(3, per="reactions", k=2)],
     "Give 1 Volatile stack of every course you hold to the target, one course after another. Then deal 3, plus 2 "
     "per Conjunction the company has set off this round.", arch="mouth+whole",
     flavour="One long breath, and every colour in it.",
     note="The Vessel breathes out and a ribbon of six inks crosses to a foe, flaring where they meet.",
     up={"text": "Give 1 Volatile stack of every course you hold to the target, one course after another. Then deal 4, "
                 "plus 2 per Conjunction the company has set off this round.",
         "fx": [GIVE("all", 1, attr=VOL), D(4, per="reactions", k=2)]})
card("ve_open_palm", "Open Palm", 1, "U", "enemy", [D(5), GIVE("largest", 2, attr=VOL, if_="prime_count>0")],
     "Deal 5. If a Primed action has resolved this round, this one included, give up to 2 Volatile stacks of your "
     "largest held course to the target.", arch="mouth+oracle_prime",
     flavour="Told where to strike, the hand does not hesitate.",
     note="The Vessel's palm strikes where the Oracle's thread points, and the held ink bursts on contact.",
     up={"text": "Deal 6. If a Primed action has resolved this round, this one included, give up to 3 Volatile stacks "
                 "of your largest held course to the target.",
         "fx": [D(6), GIVE("largest", 3, attr=VOL, if_="prime_count>0")]})
card("ve_conduit", "Conduit", 1, "U", "enemy",
     [D(3), TAKE("all"), GIVE("largest", 3, to="adjacent", if_="!handoff"),
      GIVE("largest", 3, attr=VOL, to="adjacent", if_="handoff")],
     "Deal 3. Take every course stack on the target, then give up to 3 stacks of your largest held course to each foe "
     "beside it, Volatile on a Handoff.", arch=MO,
     flavour="From one to another, through me. I keep nothing.",
     note="Colour drains from one foe up the Vessel's arm and pours out of the other palm onto its neighbours.",
     up={"text": "Deal 4. Take every course stack on the target, then give up to 4 stacks of your largest held course "
                 "to each foe beside it, Volatile on a Handoff.",
         "fx": [D(4), TAKE("all"), GIVE("largest", 4, to="adjacent", if_="!handoff"),
                GIVE("largest", 4, attr=VOL, to="adjacent", if_="handoff")]})
card("ve_draw_it_out", "Draw It Out", 1, "U", "enemy", [PULL(1), TAKE("largest", 3), D(3)],
     "Pull the target 1 rank forward. Take up to 3 stacks of its largest course. Deal 3.", hit=FAR, arch=MO,
     flavour="Come closer. What you carry is too heavy for the back of the line.",
     note="The Vessel beckons and a rear foe stumbles forward, its colour trailing toward the open hand.",
     up={"text": "Pull the target 1 rank forward. Take up to 3 stacks of its largest course. Deal 5.",
         "fx": [PULL(1), TAKE("largest", 3), D(5)]})
card("ve_spit_through", "Spit Through", 1, "U", "enemy", [CONS(s="ward"), D(3), GIVE("largest", 3)],
     "Strip the target's Ward. Deal 3. Give up to 3 stacks of your largest held course to the target.", arch=MO,
     flavour="A ward keeps out what is thrown. This is poured.",
     note="A foe's glimmering ward cracks under the Vessel's palm and the held ink runs through.",
     up={"text": "Strip the target's Ward. Deal 4. Give up to 4 stacks of your largest held course to the target.",
         "fx": [CONS(s="ward"), D(4), GIVE("largest", 4)]})
card("ve_split_tongue", "Split Tongue", 1, "U", "all_enemies",
     [GIVE("largest", 1, if_="!handoff"), GIVE("largest", 1, attr=VOL, if_="handoff"), D(2)],
     "Give 1 stack of your largest held course to each foe, Volatile on a Handoff. Deal 2 to every foe.", arch=MO,
     flavour="One word, said to all of them at once.",
     note="The Vessel speaks a single syllable and a bead of colour lands on every foe in the line.",
     up={"text": "Give 1 stack of your largest held course to each foe, Volatile on a Handoff. Deal 3 to every foe.",
         "fx": [GIVE("largest", 1, if_="!handoff"), GIVE("largest", 1, attr=VOL, if_="handoff"), D(3)]})
card("ve_bite", "Bite", 1, "U", "enemy", [REACT(1), TAKE("largest", 2), D(2)],
     "Conjoin the target. Take up to 2 stacks of its largest course. Deal 2.", arch="mouth+elementalist_courses",
     flavour="Two inks laid side by side. One touch, and they wake.",
     note="The Vessel pinches the seam where two of a foe's colours meet and they flare together.",
     up={"text": "Conjoin the target. Take up to 2 stacks of its largest course. Deal 4.",
         "fx": [REACT(1), TAKE("largest", 2), D(4)]})

# ------------------------------------------------------------------ uncommon: Whole
card("ve_open_page", "The Open Page", 1, "U", "self", [DRAW(1), EN(1, if_=WHOLE)],
     "Draw 1 more card next round. If you are Whole, also gain 1 vigour next round.", use=ALL, arch=WH,
     flavour="The page lies open. Every colour is on it, and none has run.",
     note="The Vessel stands with one palm turned up like a lectern, six inks bright on the wrist.",
     up={"text": "Draw 2 more cards next round. If you are Whole, also gain 1 vigour next round.",
         "fx": [DRAW(2), EN(1, if_=WHOLE)]})
card("ve_balanced_hands", "Balanced Hands", 1, "U", "enemy", [D(3), D(5, if_=EVENQ), D(2, if_="!first&!last")],
     "Deal 3. If you hold 2 or more courses, all in equal stacks, deal 5 more. If this is neither first nor last in "
     "the Ordo, deal 2 more.", arch=WH,
     flavour="Neither hand heavier. Neither hand slower.",
     note="Both of the Vessel's palms meet a foe at once, the bands on each arm exactly matched.",
     up={"text": "Deal 4. If you hold 2 or more courses, all in equal stacks, deal 6 more. If this is neither first "
                 "nor last in the Ordo, deal 3 more.",
         "fx": [D(4), D(6, if_=EVENQ), D(3, if_="!first&!last")]})
card("ve_even_breath", "Even Breath", 1, "U", "self",
     [EVEN(), B(2, per="held_kinds", k=1), B(0, per="vigour_left", k=1, max=3)],
     "Even out your held stacks across the courses you hold. Gain 2 Block, plus 1 per different course you hold. "
     "Gain 1 more Block per vigour left unspent this round, at most 3.",
     use=ALL, arch=WH,
     flavour="In for six. Hold for six. Out for six.",
     note="The Vessel's breath slows and the seals on every band settle to the same size.",
     up={"text": "Even out your held stacks across the courses you hold. Gain 4 Block, plus 1 per different course "
                 "you hold. Gain 1 more Block per vigour left unspent this round, at most 4.",
         "fx": [EVEN(), B(4, per="held_kinds", k=1), B(0, per="vigour_left", k=1, max=4)]})
card("ve_gather_the_inks", "Gather the Inks", 1, "U", "all_enemies",
     [TAKE("all", 1), B(0, per="consumed", k=1, max=8, to="self"), PRIME(2, to="self", if_="consumed>=4")],
     "Take 1 stack of every course on every foe. Gain 1 Block per stack taken, at most 8. If you took 4 or more, "
     "Prime 2.", arch="whole+mouth",
     flavour="A drop from every pot on the scribe's table.",
     note="Thin threads of colour rise from every foe and gather into the Vessel's open hands.",
     up={"text": "Take 1 stack of every course on every foe. Gain 2 Block, plus 1 per stack taken, at most 12 in all. "
                 "If you took 4 or more, Prime 2.",
         "fx": [TAKE("all", 1), B(2, per="consumed", k=1, max=12, to="self"), PRIME(2, to="self", if_="consumed>=4")]})
card("ve_gilt_edge", "Gilt Edge", 1, "U", "ally_other",
     [ST("focus", 1, per="held_kinds", k=0.5), ST("thrift", 1, if_="held_kinds>=4")],
     "Another hero gains 1 Focus, plus 1 per 2 different courses you hold. If you hold 4 or more different courses, "
     "it also gains 1 Thrift.",
     use=ALL, arch=WH,
     flavour="Gild the edge of their page, and their next word lands true.",
     note="The Vessel traces a gold hairline along a hero's sigil and it brightens.",
     up={"text": "Another hero gains 2 Focus, plus 1 per 2 different courses you hold, and draws 1 more card next "
                 "round. If you hold 4 or more different courses, it also gains 1 Thrift.",
         "fx": [ST("focus", 2, per="held_kinds", k=0.5), DRAW(1), ST("thrift", 1, if_="held_kinds>=4")]})
card("ve_upright", "Upright", 1, "U", "self",
     [B(4), SELF("anchor", 1), PRIME(1, per="held_kinds", k=1, if_="!moved")],
     "Gain 4 Block and 1 Anchor. If you have not moved this round, Prime 1, plus 1 per different course you hold.",
     use=ALL, arch=WH,
     flavour="The only one in the company who does not stoop.",
     note="The Vessel stands straight as a column among hunched heroes, feet bare and planted.",
     up={"text": "Gain 6 Block and 1 Anchor. If you have not moved this round, Prime 1, plus 1 per different course "
                 "you hold.", "fx": [B(6), SELF("anchor", 1), PRIME(1, per="held_kinds", k=1, if_="!moved")]})

# ------------------------------------------------------------------ rare
card("ve_the_weighing", "The Weighing", 2, "R", "enemy",
     [EVEN(), D(0, per="held_kinds", k=2), D(0, per="held_kinds", k=2, if_=WHOLE), D(0, per="heroes_before", k=2)],
     "Even out your held stacks across the courses you hold. Deal 2 per different course you hold. If you are Whole, "
     "deal 12 more. Deal 2 more per other hero who has acted before this card this round.", arch=WH,
     flavour="She weighed every course against the others. None was found wanting.",
     note="The Vessel holds a level palm over a foe and six inks press down on it with equal weight.",
     up={"text": "Even out your held stacks across the courses you hold. Deal 2 per different course you hold. If you "
                 "are Whole, deal 12 more. Deal 2 more per other hero who has acted before this card this round.",
         "cost": 1})
card("ve_mantle", "Mantle", 1, "R", "self", [TAKE("all", to="allies_other"), B(4)],
     "Take every course stack from every other hero. Gain 4 Block. Rite: at the end of this round and the next, take "
     "every course stack from every other hero. Exhaust.", use=ALL, kw=["Rite", "Exhaust"], arch=HE,
     rite={"on": "round_end", "fx": [TAKE("all", to="allies_other")], "rounds": 1},
     flavour="Under the robe there is room for all of it.",
     note="The Vessel's undyed robe spreads like a mantle over the company and their colours run onto it.",
     up={"text": "Take every course stack from every other hero. Gain 7 Block. Rite: at the end of this round and the "
                 "next, take every course stack from every other hero. Exhaust.",
         "fx": [TAKE("all", to="allies_other"), B(7)]})
card("ve_lay_it_down", "Lay It Down", 1, "R", "enemy",
     [D(2, per="held_total", k=1, max=15), GIVE("all", 2, if_="!last"), GIVE("all", 2, attr=VOL, if_="last")],
     "Deal 2, plus 1 per stack you hold, at most 15 in all. Then give up to 2 stacks of every course you hold to the "
     "target, Volatile if this is last in the Ordo.", arch="hearth+mouth",
     flavour="I carried it this far. Here is where I set it down.",
     note="The Vessel kneels for the first time and presses both palms to a fallen foe; the bands pale.",
     up={"text": "Deal 3, plus 1 per stack you hold, at most 18 in all. Then give up to 2 stacks of every course you "
                 "hold to the target, Volatile if this is last in the Ordo.",
         "fx": [D(3, per="held_total", k=1, max=18), GIVE("all", 2, if_="!last"), GIVE("all", 2, attr=VOL, if_="last")]})
card("ve_six_seals", "Six Seals", 2, "R", "all_allies", [B(2, per="held_kinds", k=1)],
     "Every hero gains 2 Block, plus 1 per different course you hold.", use=ALL, arch="hearth+whole",
     flavour="A seal for each course, pressed over each of them.",
     note="Six coloured seals lift off the Vessel's bands and settle on the company's armour.",
     up={"text": "Every hero gains 3 Block, plus 1 per different course you hold.", "fx": [B(3, per="held_kinds", k=1)]})
card("ve_drink_the_spill", "Drink the Spill", 1, "R", "self", [],
     "Rite: the first two times each round the company sets off a Conjunction on a foe, take 1 stack of every course "
     "left on it. Exhaust.", use=ALL, kw=["Rite", "Exhaust"], arch="mouth+elementalist_conjunction",
     rite={"on": "conjunction", "per_round": 2, "fx": [TAKE("all", 1)]},
     flavour="When the inks meet and burst, something always spills. I drink it.",
     note="A Conjunction flares on a foe, and the leftover colour streams off it into the Vessel's palm.",
     up={"text": "Hold 1 stack of each course you do not hold. Rite: the first two times each round the company sets "
                 "off a Conjunction on a foe, take 1 stack of every course left on it. Exhaust.", "fx": lack()})
card("ve_return_it", "Return It", 1, "R", "self", [B(4)],
     "Gain 4 Block. Rite: the first two times each round a foe hits you, give it 1 Volatile stack of your largest "
     "held course. Exhaust.", use=ALL, kw=["Rite", "Exhaust"], arch="hearth+mouth",
     rite={"on": "hit", "per_round": 2, "fx": [GIVE("largest", 1, attr=VOL)]},
     flavour="Strike me and you touch every course I hold.",
     note="A foe's blow lands on the inked forearm and a bright seal leaps back along its arm.",
     up={"text": "Gain 4 Block. Rite: the first two times each round a foe hits you, give it 2 Volatile stacks of "
                 "your largest held course. Exhaust.",
         "rite": {"on": "hit", "per_round": 2, "fx": [GIVE("largest", 2, attr=VOL)]}})
card("ve_illuminated_initial", "Illuminated Initial", 1, "R", "enemy",
     [D(1, per="held_kinds", k=1), D(2, if_="first"), PRIME(0, per="dealt", k=0.5)],
     "Deal 1, plus 1 per different course you hold. If this is first in the Ordo, deal 2 more. Prime half the damage "
     "dealt.", arch=WH,
     flavour="The first letter of the page, in every colour. The rest follows from it.",
     note="The Vessel's strike leaves a great illuminated letter on a foe, and a hero reads the gap.",
     up={"text": "Deal 2, plus 1 per different course you hold. If this is first in the Ordo, deal 3 more. Prime half "
                 "the damage dealt.",
         "fx": [D(2, per="held_kinds", k=1), D(3, if_="first"), PRIME(0, per="dealt", k=0.5)]})
card("ve_take_their_place", "Take Their Place", 1, "R", "adjacent_ally",
     [SWAP(), TAKE("all"), SELF("taunt", 1), B(4, to="self")],
     "Swap places with an adjacent hero and take every course stack on it. Gain Taunt and 4 Block.", use=ALL, arch=HE,
     flavour="Step back. This place is mine now.",
     note="The Vessel steps into a wounded hero's place in the line, arms open, as the foes turn.",
     up={"text": "Swap places with an adjacent hero and take every course stack on it. Gain Taunt and 7 Block.",
         "fx": [SWAP(), TAKE("all"), SELF("taunt", 1), B(7, to="self")]})
card("ve_speak_to_all", "Speak to All", 1, "R", "all_enemies", [GIVE("all", 1), D(1, per="vigour_spent", k=0.34)],
     "Give 1 stack of every course you hold to each foe. Deal 1 to every foe, plus 1 per 3 vigour spent this round.",
     arch="mouth+whole",
     flavour="She spoke once, and every course in the world answered.",
     note="The Vessel speaks with both palms out and each foe takes a different set of colours.",
     up={"text": "Give 1 stack of every course you hold to each foe. Deal 3 to every foe, plus 1 per 3 vigour spent "
                 "this round.", "fx": [GIVE("all", 1), D(3, per="vigour_spent", k=0.34)]})
card("ve_sealed_skin", "Sealed Skin", 1, "R", "self",
     [B(2, per="held_total", k=1, max=14), SELF("thorns", 0, per="held_kinds", k=1)],
     "Gain 2 Block, plus 1 per stack you hold, at most 14 in all. Gain 1 Thorns per different course you hold.",
     use=ALL, arch="hearth+whole",
     flavour="Every seal on the skin is a ward and a warning.",
     note="The held seals on the Vessel's bands stand up like rivets as a foe closes.",
     up={"text": "Gain 3 Block, plus 1 per stack you hold, at most 18 in all. Gain 1 Thorns per different course you "
                 "hold.", "fx": [B(3, per="held_total", k=1, max=18), SELF("thorns", 0, per="held_kinds", k=1)]})
card("ve_swallow_whole", "Swallow Whole", 1, "R", "enemy", [TAKE("all"), D(4), EXEC(0, per="consumed", k=2)],
     "Take every course stack on the target. Deal 4. Execute 2 per stack taken.", kw=["Execute"],
     arch="mouth+hexweaver_doom",
     flavour="Take every course out of it, and nothing is left to hold it up.",
     note="Every colour drains out of a doomed foe into the Vessel, and the grey husk folds.",
     up={"text": "Take every course stack on the target. Deal 6. Execute 2 per stack taken.",
         "fx": [TAKE("all"), D(6), EXEC(0, per="consumed", k=2)]})
card("ve_keep_the_hours", "Keep the Hours", 1, "R", "self", [EVEN(), B(2, per="held_kinds", k=1)],
     "Even out your held stacks across the courses you hold. Gain 2 Block, plus 1 per different course you hold. "
     "Rite: at the end of each round, even out your held stacks, then Bank 1. Exhaust.", use=ALL,
     kw=["Rite", "Exhaust"], arch="whole+hearth",
     rite={"on": "round_end", "fx": [EVEN(), BANK(1, to="self")]},
     flavour="Every hour of the night, the same six breaths, the same six inks.",
     note="The Vessel sleeps standing through the night watch while the bands brighten in turn, hour by hour.",
     up={"text": "Even out your held stacks across the courses you hold. Gain 4 Block, plus 1 per different course you "
                 "hold. Rite: at the end of each round, even out your held stacks, then Bank 1. Exhaust.",
         "fx": [EVEN(), B(4, per="held_kinds", k=1)]})

# ------------------------------------------------------------------ path: Hearth
card("ve_carry_them", "Carry Them", 2, "X", "all_allies", [TAKE("all"), B(0, per="consumed", k=1, max=6)],
     "Take every course stack from every hero. Every hero gains 1 Block per stack taken, at most 6.",
     use=ALL, sub=HE, arch=HE,
     flavour="All of you. Every colour you wear, I will carry home.",
     note="The Hearth Vessel draws the whole company's colours up the bands in one long breath.",
     up={"text": "Take every course stack from every hero. Every hero gains 1 Block per stack taken, at most 6.",
         "cost": 1})
card("ve_stoke", "Stoke", 0, "X", "self", [A(FI, 1, to="self"), B(3, to="self_adjacent", if_="vigour_left")],
     "Hold 1 Fire. If any vigour is left unspent this round, each hero beside you gains 3 Block.", use=ALL, cat=FI,
     sub=HE, arch="hearth+whole",
     flavour="A hearth needs a coal. I keep one lit.",
     note="A single bead of fire wakes on the vermilion band and the heroes beside it lean closer.",
     up={"text": "Hold 1 Fire. If any vigour is left unspent this round, each hero beside you gains 4 Block.",
         "fx": [A(FI, 1, to="self"), B(4, to="self_adjacent", if_="vigour_left")]})
card("ve_lend_weight", "Lend Weight", 1, "X", "self", [PRIME(3, per="held_total", k=1, max=12), PRIME(2, if_="handoff")],
     "Prime 3, plus 1 per stack you hold, at most 12 in all. Handoff: Prime 2 more.", use=ALL, sub=HE, arch=HE,
     flavour="Lean your blow on me. I am heavier than I look.",
     note="The Hearth Vessel sets a palm on a hero's back as the hero swings, the bands dimming as they lend.",
     up={"text": "Prime 4, plus 1 per stack you hold, at most 14 in all. Handoff: Prime 3 more.",
         "fx": [PRIME(4, per="held_total", k=1, max=14), PRIME(3, if_="handoff")]})
card("ve_spread_arms", "Spread Arms", 1, "X", "self", [GUARD(to="self_adjacent"), B(3)],
     "Guard both heroes beside you this round. Gain 3 Block.", use=ALL, sub=HE, arch=HE,
     flavour="Arms open, palms out. Everything aimed at them comes to me.",
     note="The Hearth Vessel stands in the orans pose between two heroes, the long sleeves over both.",
     up={"text": "Guard both heroes beside you this round. Gain 5 Block.", "fx": [GUARD(to="self_adjacent"), B(5)]})
card("ve_warm_breath", "Warm Breath", 1, "X", "all_allies", [H(0, per="held_kinds", k=0.5), STRESS(-2)],
     "Every hero heals 1 per 2 different courses you hold and sheds 2 stress.", use=ALL, sub=HE,
     arch="hearth+whole",
     flavour="A slow breath, warm as a kitchen. Even the frightened ones sleep.",
     note="The Hearth Vessel breathes out over the company and faint colour warms their faces.",
     up={"text": "Every hero heals 1, plus 1 per 2 different courses you hold, and sheds 3 stress.",
         "fx": [H(1, per="held_kinds", k=0.5), STRESS(-3)]})
card("ve_full_weight", "Full Weight", 1, "X", "enemy",
     [D(2, per="held_total", k=1, max=12), D(3, if_="vigour_left>=2")],
     "Deal 2, plus 1 per stack you hold, at most 12 in all. If 2 or more vigour is left unspent this round, deal 3 "
     "more.", sub=HE, arch=HE,
     flavour="Everything you laid on them, all at once.",
     note="The Hearth Vessel presses a palm to a foe and every seal on the bands bears down with it.",
     up={"text": "Deal 4, plus 1 per stack you hold, at most 16 in all. If 2 or more vigour is left unspent this round, "
                 "deal 4 more.", "fx": [D(4, per="held_total", k=1, max=16), D(4, if_="vigour_left>=2")]})

# ------------------------------------------------------------------ path: Mouth
card("ve_chew", "Chew", 1, "X", "enemy", [D(3), TAKE("largest"), GIVE("largest", 3, attr=VOL), D(2, if_="handoff")],
     "Deal 3. Take all of the target's largest course, then give it up to 3 Volatile stacks of your largest held "
     "course. Handoff: deal 2 more.", sub=MO, arch=MO,
     flavour="Taken in, turned over, given back. It never tastes the same twice.",
     note="The Mouth Vessel draws a foe's colour into the palm and pushes it straight back, flaring.",
     up={"text": "Deal 4. Take all of the target's largest course, then give it up to 4 Volatile stacks of your "
                 "largest held course. Handoff: deal 2 more.",
         "fx": [D(4), TAKE("largest"), GIVE("largest", 4, attr=VOL), D(2, if_="handoff")]})
card("ve_double_spit", "Double Spit", 0, "X", "enemy",
     [GIVE("largest", 1, attr=VOL), GIVE("largest", 1, attr=VOL)],
     "Give 1 Volatile stack of your largest held course to the target, twice.", sub=MO, arch=MO,
     flavour="Once to wake it. Once to finish it.",
     note="Two bright beads leave the Mouth Vessel's fingertips one after the other.",
     up={"text": "Give 1 Volatile stack of your largest held course to the target, twice. Deal 2.",
         "fx": [GIVE("largest", 1, attr=VOL), GIVE("largest", 1, attr=VOL), D(2)]})
card("ve_far_spit", "Far Spit", 1, "X", "enemy", [GIVE("largest", 2, attr=VOL), D(4), D(2, if_="t.rank>=3")],
     "Give up to 2 Volatile stacks of your largest held course to the target. Deal 4, and 2 more if it stands in rank "
     "3 or 4.", hit=BACKREACH, sub=MO, arch=MO,
     flavour="The back of the line is not far enough.",
     note="A bead of colour arcs over the front foes and bursts on the one hiding at the back.",
     up={"text": "Give up to 2 Volatile stacks of your largest held course to the target. Deal 6, and 2 more if it "
                 "stands in rank 3 or 4.", "fx": [GIVE("largest", 2, attr=VOL), D(6), D(2, if_="t.rank>=3")]})
card("ve_chain_word", "Chain Word", 1, "X", "enemy",
     [D(2), GIVE("largest", 2, attr=VOL), DRAW(1, to="self", if_="reactions>=2")],
     "Deal 2. Give up to 2 Volatile stacks of your largest held course to the target. If the company has set off 2 "
     "or more Conjunctions this round, draw 1 more card next round.", sub=MO, arch=MO,
     flavour="One word sets off the next, and the next, down the line.",
     note="The Mouth Vessel speaks, and flare after flare runs across the foes like a lit fuse.",
     up={"text": "Deal 4. Give up to 2 Volatile stacks of your largest held course to the target. If the company has "
                 "set off 2 or more Conjunctions this round, draw 1 more card next round.",
         "fx": [D(4), GIVE("largest", 2, attr=VOL), DRAW(1, to="self", if_="reactions>=2")]})
card("ve_flood_the_line", "Flood the Line", 2, "X", "all_enemies",
     [GIVE("largest", 2, if_="vigour_spent<6"), GIVE("largest", 2, attr=VOL, if_="vigour_spent>=6"), D(3)],
     "Give up to 2 stacks of your largest held course to each foe, Volatile if 6 or more vigour was spent this round. "
     "Deal 3 to every foe.", sub=MO, arch=MO,
     flavour="What I held for one, I pour out for all.",
     note="The Mouth Vessel tips both open palms and one colour floods the whole line of foes.",
     up={"text": "Give up to 2 stacks of your largest held course to each foe, Volatile if 6 or more vigour was spent "
                 "this round. Deal 3 to every foe.", "cost": 1})
card("ve_gorge", "Gorge", 1, "X", "enemy",
     [TAKE("all"), B(0, per="consumed", k=1, max=10, to="self"), ADD("ve_spit", to="self")],
     "Take every course stack on the target. Gain 1 Block per stack taken, at most 10. Put a Spit into your next hand.",
     sub=MO, arch="mouth+whole",
     flavour="Every course it carried, swallowed. It stands there grey.",
     note="A foe's colours pour off it into the Mouth Vessel, leaving it the grey of old ash.",
     up={"text": "Take every course stack on the target. Gain 2 Block, plus 1 per stack taken, at most 14 in all. Put "
                 "a Spit into your next hand.",
         "fx": [TAKE("all"), B(2, per="consumed", k=1, max=14, to="self"), ADD("ve_spit", to="self")]})

# ------------------------------------------------------------------ path: Whole
card("ve_keep_her_quiet", "Keep Her Quiet", 1, "X", "enemy",
     [GIVE(WA, 1), GIVE(VO, 6, attr=VOL), ST("neuro", 1, if_="consumed>=3")],
     "Give 1 Water to the target, then all your held Void, Volatile. If you gave 3 or more stacks in all, its next "
     "action keeps only its first effect.", cat=VO, sub=WH, arch="whole+mouth",
     flavour="She was loud once. The whole world heard her. Keep her quiet.",
     note="The Whole Vessel lays a violet-black palm over a foe's mouth and the hollow spreads.",
     up={"text": "Give 1 Water to the target, then all your held Void, Volatile. Its next action keeps only its first "
                 "effect.", "fx": [GIVE(WA, 1), GIVE(VO, 6, attr=VOL), ST("neuro", 1)]})
card("ve_six_bands", "Six Bands", 1, "X", "self", lack() + [DRAW(1, if_=WHOLE)],
     "Hold 1 stack of each course you do not hold. Then, if you are Whole, draw 1 more card next round.",
     use=ALL, sub=WH, arch=WH,
     flavour="Fingertip to jaw, six bands, and every one of them full.",
     note="The Whole Vessel's six bands fill one after another, from the fingertips to the jaw.",
     up={"text": "Hold 1 stack of each course you do not hold. Gain 3 Block. Then, if you are Whole, draw 1 more card "
                 "next round.", "fx": lack() + [B(3), DRAW(1, if_=WHOLE)]})
card("ve_level_hands", "Level Hands", 1, "X", "self", [EVEN(), PRIME(3, per="held_kinds", k=1)],
     "Even out your held stacks across the courses you hold. Prime 3, plus 1 per different course you hold.",
     use=ALL, sub=WH, arch=WH,
     flavour="A level hand gives a level blow.",
     note="The Whole Vessel holds both palms level and a hero's weapon catches all six colours.",
     up={"text": "Even out your held stacks across the courses you hold. Prime 5, plus 1 per different course you "
                 "hold.", "fx": [EVEN(), PRIME(5, per="held_kinds", k=1)]})
card("ve_six_rays", "Six Rays", 2, "X", "all_enemies",
     [D(1, per="held_kinds", k=1), D(3, if_=WHOLE), D(2, if_="heroes_before>=2")],
     "Deal 1, plus 1 per different course you hold, to every foe. If you are Whole, deal 3 more to every foe. If 2 or "
     "more other heroes have acted before this card this round, deal 2 more to every foe.",
     sub=WH, arch=WH,
     flavour="Six rays from a broken ring. The god had them. So does the Vessel.",
     note="The broken nimbus behind the Whole Vessel's head throws six thin rays of ink across the foes.",
     up={"text": "Deal 2, plus 1 per different course you hold, to every foe. If you are Whole, deal 4 more to every "
                 "foe. If 2 or more other heroes have acted before this card this round, deal 3 more to every foe.",
         "fx": [D(2, per="held_kinds", k=1), D(4, if_=WHOLE), D(3, if_="heroes_before>=2")]})
card("ve_gilded_page", "Gilded Page", 1, "X", "enemy", [GIVE("all", 1), D(3, per="t.spectrum", k=1)],
     "Give 1 stack of every course you hold to the target. Deal 3, plus 1 per different course on it.",
     sub=WH, arch="whole+mouth",
     flavour="Write every colour on it, then read it aloud.",
     note="The Whole Vessel presses an inked palm to a foe and leaves a print in all six colours.",
     up={"text": "Give 1 stack of every course you hold to the target. Deal 4, plus 2 per different course on it.",
         "fx": [GIVE("all", 1), D(4, per="t.spectrum", k=2)]})
card("ve_still_centre", "Still Centre", 1, "X", "self", [B(0, per="held_min", k=2), BANK(1, to="self")],
     "Gain 2 Block per stack of the course you hold least. Bank 1.", use=ALL, sub=WH, arch=WH,
     flavour="The scale is still when every pan is full.",
     note="The Whole Vessel stands at the still centre of the fight, every band filled to the same line.",
     up={"text": "Gain 2 Block, plus 2 per stack of the course you hold least. Bank 1.",
         "fx": [B(2, per="held_min", k=2), BANK(1, to="self")]})

# ------------------------------------------------------------------ legendary
card("ve_hearth_kept", "The Hearth Kept", 2, "L", "self", [],
     "Rite: at the start of each round, take every course stack from every other hero, then every other hero gains "
     "2 Block per stack taken, at most 10. Exhaust.", use=ALL, kw=["Rite", "Exhaust"], sub=HE, arch="hearth+core",
     rite={"on": "round_start",
           "fx": [TAKE("all", to="allies_other"), B(0, per="consumed", k=2, max=10, to="allies_other")]},
     flavour="The fire is banked, the door is barred, and nothing burns in this house but me.",
     note="The Hearth Vessel stands at the Guesthouse hearth at dawn, drawing the night's ills off the sleepers.",
     up={"text": "Every other hero gains 1 Ward. Rite: at the start of each round, take every course stack from every "
                 "other hero, then every other hero gains 2 Block per stack taken, at most 10. Exhaust.",
         "fx": [W(1, to="allies_other")]})
card("ve_weight_of_the_world", "The Weight of the World", 1, "L", "self", [],
     "Rite: the first time each round a foe hits another hero, deal 1 per stack you hold to that foe. Exhaust.",
     use=ALL, kw=["Rite", "Exhaust"], sub=HE, arch="hearth+whole",
     rite={"on": "ally_hit", "per_round": 1, "fx": [D(0, per="held_total", k=1)]},
     flavour="She carried the world's courses once. Now I do, and it is heavy.",
     note="The Hearth Vessel lifts one palm and the front foe is crushed flat under six colours of weight.",
     up={"text": "Gain 6 Block. Rite: the first time each round a foe hits another hero, deal 1 per stack you hold to "
                 "that foe. Exhaust.", "fx": [B(6)]})
card("ve_unstopped_mouth", "The Unstopped Mouth", 2, "L", "self", [],
     "Rite: at the end of each round, take every course stack from every other hero, then give up to 3 Volatile "
     "stacks of your largest held course to the front foe. Exhaust.", use=ALL, kw=["Rite", "Exhaust"], sub=MO,
     arch="mouth+hearth",
     rite={"on": "round_end",
           "fx": [TAKE("all", to="allies_other"), GIVE("largest", 3, attr=VOL, to="front_enemy")]},
     flavour="Whatever they spit at you, I swallow, and spit back hotter.",
     note="The Mouth Vessel stands behind the company as every course on them streams through it at the foes.",
     up={"text": "Take every course stack from every other hero. Rite: at the end of each round, take every course "
                 "stack from every other hero, then give up to 3 Volatile stacks of your largest held course to the "
                 "front foe. Exhaust.", "fx": [TAKE("all", to="allies_other")]})
card("ve_mothers_tongue", "The Mother's Tongue", 1, "L", "self", [],
     "Rite: three times a round, when the company sets off a Conjunction on a foe, give 1 Volatile stack of your "
     "largest held course to each foe beside it. Exhaust.", use=ALL, kw=["Rite", "Exhaust"], sub=MO,
     arch="mouth+elementalist_conjunction",
     rite={"on": "conjunction", "per_round": 3, "fx": [GIVE("largest", 1, attr=VOL, to="adjacent")]},
     flavour="She spoke the first word, and the courses answered in every mouth at once.",
     note="A Conjunction flares on one foe and the Mouth Vessel's speech carries it to the foes on either side.",
     up={"text": "Hold 1 stack of each course you do not hold. Rite: three times a round, when the company sets off a "
                 "Conjunction on a foe, give 1 Volatile stack of your largest held course to each foe beside it. "
                 "Exhaust.", "fx": lack()})
card("ve_whole_conjunction", "The Whole Conjunction", 2, "L", "enemy",
     [D(8, if_=WHOLE), ST("thrift", 1, to="allies_other", if_=WHOLE), GIVE("all", 1), GIVE("all", 0, attr=VOL)],
     "If you are Whole, deal 8 and every other hero gains 1 Thrift. Give 1 stack of every course you hold to the "
     "target, then everything else you hold, Volatile.", sub=WH, arch="whole+mouth",
     flavour="All six in one body, without letting them fuse. Until now.",
     note="The Whole Vessel opens both palms and all six bands pour into one foe in a single blinding knot.",
     up={"text": "If you are Whole, deal 8 and every other hero gains 1 Thrift. Give 1 stack of every course you hold "
                 "to the target, then everything else you hold, Volatile. Then hold 1 stack of each course you do not "
                 "hold.",
         "fx": [D(8, if_=WHOLE), ST("thrift", 1, to="allies_other", if_=WHOLE), GIVE("all", 1),
                GIVE("all", 0, attr=VOL)] + lack()})
card("ve_mothers_place", "The Mother's Place", 2, "L", "self", [],
     "Rite: three times a round, when the company sets off a Conjunction on a foe, hold 1 stack of each course you "
     "do not hold, then, if you are Whole, deal 5 to that foe. Exhaust.", use=ALL, kw=["Rite", "Exhaust"], sub=WH,
     arch="whole+elementalist_conjunction",
     rite={"on": "conjunction", "per_round": 3, "fx": lack() + [D(5, if_=WHOLE)]},
     flavour="She held every course apart and let none of them fuse. The seat is taken again.",
     note="The Whole Vessel stands where the Mother of Courses stood, the broken nimbus closing behind its head.",
     up={"text": "Hold 1 stack of each course you do not hold. Rite: three times a round, when the company sets off a "
                 "Conjunction on a foe, hold 1 stack of each course you do not hold, then, if you are Whole, deal 5 "
                 "to that foe. Exhaust.", "fx": lack()})

HERO = {"name": "Vessel", "hp": 32, "armor": 0, "grit": 2, "color": "8a7fb0", "kit": ["ve_draw_breath"],
        "deck": ["ve_open_hand", "ve_open_hand", "ve_open_hand", "ve_bear_it", "ve_bear_it", "ve_take_into_me",
                 "ve_take_into_me", "ve_give_back", "ve_give_back", "ve_six_breaths"],
        "subclasses": {HE: "Hearth", MO: "Mouth", WH: "Whole"},
        "blurb": "The Prismatic who took the Mother's place, come back to the gate. Courses settle on its skin and "
                 "wait: it takes them off the company and from foes, and gives them back where they hurt most."}

# Each archetype's six key cards for the build-aware simulator (five or six common or uncommon).
ARCHETYPES = {
    HE: ["ve_lift", "ve_stand_near", "ve_banked_coals", "ve_weight_of_it", "ve_hearthstone", "ve_sponge"],
    MO: ["ve_spit", "ve_swallow", "ve_mouthful", "ve_retch", "ve_exhale", "ve_conduit"],
    WH: ["ve_ink_band", "ve_rule_line", "ve_balance_the_scale", "ve_nimbus", "ve_illumination", "ve_the_weighing"],
}

NEEDS = [
    "ve_draw_breath, ve_take_into_me: the brief lets one card take from a hero or a foe; a card has one target side. "
    "Draw Breath takes from a hero and falls back on the front foe; Take Into Me reaches heroes only.",
    "ve_shelter, ve_stand_near, ve_mantle: the brief redirects the next course aimed at another hero onto the Vessel "
    "(redirect is not in the engine). Written as Guard (the guarded blow and its course come to the Vessel) and, for "
    "Mantle, a round-end Take from every other hero for two rounds.",
    "ve_unclench: wanted to release held stacks into nothing; GIVE needs a target, so it gives them to a foe.",
    "ve_weigh: the brief moves one stack from the largest course to the smallest; written as EVEN (evens them all).",
    "ve_ink_band: the brief holds 1 of the course held least; no held-course picker, so it holds 1 of each course "
    "not held.",
    "ve_taste: the brief draws if the target carries a course you hold; no matching read, so it checks Spectrum 2+.",
    "ve_keep_her_quiet: 'lays no courses' written as Neuro (next action keeps only its first effect).",
    "ve_hearth_kept: the brief gives each hero Block for the stacks taken from that hero; 'consumed' totals every "
    "hero, so each gets Block for the total (capped at 10).",
    "ve_weight_of_the_world: the brief adds the held weight to the Vessel's next hit on a foe. A play rite now lands on "
    "the played card's target, but on a card with no foe target it lands on the owner, so a play-rite hit would strike "
    "the Vessel itself. Written as an ally_hit rite on the foe that hits another hero (interaction pass).",
    "Interaction pass: a rite's context has no handoff, cost or heroes_before (they read 0), so rites can only use the "
    "round-wide vigour and Ordo quantities (vigour_left, vigour_spent, ordo_pos, first, last).",
    "Interaction pass: Thrift is spent by the next hand card even when that card already costs 0 (cost_of floors at 0 "
    "but resolve still takes a stack), so a Spit or Double Spit wastes a Thrift the Hearth gave. Spend Thrift only on "
    "a card it discounted.",
    "ve_unstopped_mouth: wanted a 'course laid on a hero' trigger to spit each one back at the foe that laid it; "
    "written as a round-end Take from every other hero and a Volatile give to the front foe.",
    "ve_mothers_place: the brief makes every Conjunction full power while Whole; needs a power modifier. Written as a "
    "Conjunction rite that refills missing courses and deals 5 while Whole.",
    "Alchemist hook: the brief has the Vessel drink course flasks from the belt as held stock; a flask's course goes "
    "to the flask's target. Written as Dosed self-holds (ve_drink_the_dregs).",
    "budget.py prices TAKE and GIVE at 1 point per stack whatever the attribute, and 1 point for 'all' (n=0); the "
    "Vessel's numbers were set by hand where the guide under-prices them.",
]
