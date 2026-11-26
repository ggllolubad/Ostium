"""Duelist, the Quick Blade: Gate 3 card set (brief: docs/design/gate2/calling_duelist.md).

Archetypes (arch keys match the path keys):
  bladedancer  The Measure: Momentum from back-to-back actions and 0-cost cuts, Dodge to live in rank 1; payoffs that
               read Momentum without spending it, Echo, and Finishers that sweep ranks 1 and 2 or strike once per stack.
  executioner  The Sentence: Mark, pulls that drag foes into reach, heavy strokes; payoffs on Marked and wounded foes,
               and Execute checks that Momentum, Bleed and the Hexweaver's Doom all lower.
  bloodletter  The Barber's Bowl: Bleed on one foe then the line; payoffs that double it, heal from it, read it as
               damage, and turn Momentum and Riposte into more of it.
Mark and Follow-up cards are "core" and serve all three. Riposte is the Duelist's alone (DECISIONS row 2). The lightning
thread is five cards (row 3): Arc Cut, Thunder Lunge, Charged Point, Forked Blade, Ride the Lightning.
Finishers spend all Momentum (CONS on the Duelist, then per="consumed")."""
from dsl import *

set_class("duelist", [1, 2, 3], [1, 2])
ALL = [1, 2, 3, 4]
THRUST = [1, 2, 3]
FAR = [2, 3, 4]
L = "lightning"
BD, EX, BL = "bladedancer", "executioner", "bloodletter"


def FIN():
    """Spend all Momentum; later effects scale with per="consumed"."""
    return CONS(s="momentum", to="self")


# ------------------------------------------------------------------ kit
card("du_find_the_gap", "Find the Gap", 1, "K", "enemy", [ST("mark"), SELF("momentum", 1)],
     "Mark the target. Gain 1 Momentum.", hit=ALL, arch="core",
     flavour="Every guard has a gap. The trade is seeing it first.",
     note="The Duelist's blade tip stops circling and settles on one foe's open flank.",
     up={"text": "Mark the target for 2 rounds. Gain 1 Momentum.", "fx": [ST("mark", 2), SELF("momentum", 1)]})
card("du_quickstep", "Quickstep", 1, "K", "adjacent_ally", [SWAP(), SELF("momentum", 1), SELF("dodge", 1, if_="handoff")],
     "Swap with an adjacent hero. Gain 1 Momentum. Handoff: Dodge the next hit this round.", use=ALL, sub=BD, arch=BD,
     flavour="Never where the blow lands. Always where the next one starts.",
     note="The Bladedancer spins past the Bulwark's door-shield, both blades trailing.",
     up={"text": "Swap with an adjacent hero. Gain 1 Momentum. Dodge the next hit this round.",
         "fx": [SWAP(), SELF("momentum", 1), SELF("dodge", 1)]})
card("du_drag_to_the_block", "Drag to the Block", 1, "K", "enemy", [PULL(1), ST("mark")],
     "Pull the target forward 1. Mark it.", hit=[3, 4], sub=EX, arch=EX,
     flavour="The condemned do not walk to the block. They are brought.",
     note="The hooded Executioner hooks a back-rank foe by the collar and hauls it up the nave.",
     up={"text": "Pull the target forward 1. Mark it for 2 rounds.", "fx": [PULL(1), ST("mark", 2)]})
card("du_staunch", "Staunch", 1, "K", "enemy", [H(0, per="m.bleed", k=1, max=6, to="lowest_ally")],
     "The most wounded hero heals 1 per Bleed on the target (not spent), up to 6.", hit=ALL, sub=BL, arch=BL,
     flavour="What runs out of them can be put back into us. Barber's arithmetic.",
     note="The Bloodletter tips the bloodied bowl over a hero's wound; the cut closes.",
     up={"text": "The most wounded hero heals 1 per Bleed on the target (not spent), up to 9.",
         "fx": [H(0, per="m.bleed", k=1, max=9, to="lowest_ally")]})

# ------------------------------------------------------------------ starter (deck: 2 of each)
card("du_first_touch", "First Touch", 0, "S", "enemy", [D(1), SELF("momentum", 1)],
     "Deal 1. Gain 1 Momentum.", hit=THRUST, arch="core",
     flavour="The first touch is never meant to kill. It is meant to be answered.",
     note="The Duelist flicks the rapier's point against a foe's guard; a white-gold spark jumps.",
     up={"text": "Deal 2. Gain 1 Momentum. First in the Ordo: gain 1 more.",
         "fx": [D(2), SELF("momentum", 1), SELF("momentum", 1, if_="first")]})
card("du_lunge", "Lunge", 1, "S", "enemy", [ADV(1), D(5)],
     "Advance 1. Deal 5.", use=[2, 3], arch="core",
     flavour="Back foot, front foot, and the blade arrives before the body.",
     note="The Duelist lunges almost flat across the flooded stair, sash streaming behind.",
     up={"text": "Advance 1. Deal 7.", "fx": [ADV(1), D(7)]})
card("du_sighting_cut", "Sighting Cut", 1, "S", "enemy", [D(4), ST("mark")],
     "Deal 4. Mark the target.", hit=THRUST, arch="core",
     flavour="A nick on the wrist. Now the whole company knows where to look.",
     note="A thin red line opens on a foe's sword arm; the Duelist's eyes stay on it.",
     up={"text": "Deal 6. Mark the target.", "fx": [D(6), ST("mark")]})
card("du_parry", "Parry", 1, "S", "self", [SELF("riposte", 2), SELF("dodge", 1)],
     "Gain Riposte 2. Dodge the next hit this round.", use=ALL, arch="core",
     flavour="Steel meets steel, and the answer is already on its way.",
     note="The swept hilt turns a hook aside; the rapier's point is back in line at once.",
     up={"text": "Gain Riposte 3. Dodge the next hit this round.", "fx": [SELF("riposte", 3), SELF("dodge", 1)]})
card("du_close_the_measure", "Close the Measure", 2, "S", "enemy",
     [FIN(), D(4, per="consumed", k=1), D(4, per="consumed", k=1, if_="t.mark>0")],
     "Finisher. Deal 4, plus 1 per Momentum spent. If the target is Marked, hit it again for the same.",
     hit=THRUST, kw=["Finisher"], arch="core",
     flavour="Distance is the whole art. Close it once, and finish.",
     note="The Duelist steps inside a foe's reach and drives the rapier home to the swept hilt.",
     up={"text": "Finisher. Deal 4, plus 1 per Momentum spent. If the target is Marked, hit it again for the same.", "cost": 1})

# ------------------------------------------------------------------ common: Bladedancer
card("du_feather_cut", "Feather Cut", 0, "C", "enemy", [D(1), SELF("momentum", 1)],
     "Retain. Deal 1. Gain 1 Momentum.", hit=THRUST, kw=["Retain"], arch=BD,
     flavour="Held back for the beat when it matters. Then light as a feather.",
     note="The Duelist's point barely grazes a foe's cheek in passing.",
     up={"text": "Retain. Deal 2. Gain 1 Momentum.", "fx": [D(2), SELF("momentum", 1)]})
card("du_two_step", "Two-Step", 1, "C", "enemy", [D(3, times=2), SELF("momentum", 1, if_="same_target")],
     "Deal 3 twice. Follow-up: gain 1 Momentum.", arch=BD,
     flavour="One for the guard, one for what the guard was hiding.",
     note="Two quick cuts cross on a foe's chest in the belfry's light.",
     up={"text": "Deal 4 twice. Follow-up: gain 1 Momentum.",
         "fx": [D(4, times=2), SELF("momentum", 1, if_="same_target")]})
card("du_light_feet", "Light Feet", 1, "C", "self", [SELF("dodge", 1), SELF("momentum", 2), SELF("momentum", 1, if_="first")],
     "Dodge the next hit this round. Gain 2 Momentum. First in the Ordo: gain 1 more.", use=ALL, arch=BD,
     flavour="The floor is wet, the foe is heavy, and neither matters to the feet.",
     note="The Duelist skips back from a falling boat hook on the balls of the feet.",
     up={"text": "Dodge the next 2 hits this round. Gain 2 Momentum. First in the Ordo: gain 1 more.",
         "fx": [SELF("dodge", 2), SELF("momentum", 2), SELF("momentum", 1, if_="first")]})
card("du_turn_of_the_wrist", "Turn of the Wrist", 1, "C", "enemy", [D(1, per="momentum", k=2, max=13)],
     "Deal 1, plus 2 per Momentum (not spent), up to 13.", arch=BD,
     flavour="The cut is in the wrist. The wrist is in the rhythm.",
     note="A small circle of the rapier's tip, and a foe's guard comes apart.",
     up={"text": "Deal 3, plus 2 per Momentum (not spent), up to 15.", "fx": [D(3, per="momentum", k=2, max=15)]})
card("du_sweep", "Sweep", 1, "C", "all_enemies", [D(4, if_="t.rank<=2")],
     "Deal 4 to each foe in ranks 1 and 2.", hit=ALL, arch=BD,
     flavour="Two foes in reach is one foe too many. For them.",
     note="The Duelist's blade cuts a flat arc across the front of the nave.",
     up={"text": "Deal 5 to each foe in ranks 1 and 2.", "fx": [D(5, if_="t.rank<=2")]})
card("du_arc_cut", "Arc Cut", 1, "C", "enemy", [D(5), A(L, 1)],
     "Deal 5. Apply 1 Lightning.", attr="stable", arch=BD,
     flavour="The lightning-touched schools leave the spark in the steel.",
     note="A white-gold spark runs down the scorched blade into the foe it cuts.",
     up={"text": "Deal 6. Apply 2 Lightning.", "fx": [D(6), A(L, 2)]})

# ------------------------------------------------------------------ common: Executioner
card("du_pronounce_sentence", "Pronounce Sentence", 0, "C", "enemy", [ST("mark")],
     "Mark the target.", hit=ALL, arch=EX,
     flavour="The sentence is spoken once. It does not need repeating.",
     note="The Executioner points the square-tipped sword down the nave at one foe.",
     up={"text": "Mark the target for 2 rounds.", "fx": [ST("mark", 2)]})
card("du_measure_the_neck", "Measure the Neck", 1, "C", "enemy",
     [D(2, per="t.mark", k=3, max=5), D(3, if_="t.moved")],
     "Deal 2, or 5 if the target is Marked. If it was moved this round, hit it again for 3.",
     arch=EX + "+bulwark_hook",
     flavour="Dragged in, stumbling, neck bare. The headsman has waited for exactly this.",
     note="The Bulwark's hook drags a foe forward and the Executioner's blade is already falling.",
     up={"text": "Deal 3, or 6 if the target is Marked. If it was moved this round, hit it again for 4.",
         "fx": [D(3, per="t.mark", k=3, max=6), D(4, if_="t.moved")]})
card("du_haul_forward", "Haul Forward", 1, "C", "enemy", [D(2), PULL(1), ST("mark")],
     "Deal 2. Pull the target forward 1 and Mark it.", hit=FAR, arch=EX,
     flavour="No one hides at the back of a queue for the block.",
     note="The Executioner reaches past the front rank and drags a caster out by its robe.",
     up={"text": "Deal 2. Pull the target forward 2 and Mark it.", "fx": [D(2), PULL(2), ST("mark")]})
card("du_heading_stroke", "Heading Stroke", 2, "C", "enemy", [D(11, per="vigour_left", k=1, max=14)],
     "Deal 11, plus 1 per vigour left unspent, up to 14.", use=[1, 2], arch=EX,
     flavour="Both hands, full swing. The old way.",
     note="The broad heading sword comes down two-handed in the ossuary's gloom.",
     up={"text": "Deal 14, plus 1 per vigour left unspent, up to 18.", "fx": [D(14, per="vigour_left", k=1, max=18)]})
card("du_the_crowd_watches", "The Crowd Watches", 1, "C", "enemy",
     [D(4), STRESS(-3, to="all_allies", if_="killed")],
     "Deal 4. If it kills, every hero sheds 3 stress.", arch=EX,
     flavour="A clean kill is a mercy to everyone watching.",
     note="A foe falls under the black hood's stroke; behind it the company breathes out.",
     up={"text": "Deal 6. If it kills, every hero sheds 4 stress.",
         "fx": [D(6), STRESS(-4, to="all_allies", if_="killed")]})
card("du_weigh_the_wound", "Weigh the Wound", 1, "C", "enemy", [D(3, per="t.missing_hp", k=0.25, max=12)],
     "Deal 3, plus 1 per 4 HP the target is missing, up to 12.", arch=EX,
     flavour="The worse the wound, the lighter the work.",
     note="The Executioner sizes up a staggering foe before the stroke.",
     up={"text": "Deal 5, plus 1 per 4 HP the target is missing, up to 15.",
         "fx": [D(5, per="t.missing_hp", k=0.25, max=15)]})

# ------------------------------------------------------------------ common: Bloodletter
card("du_lancet", "Lancet", 1, "C", "enemy", [D(3), ST("bleed", 2)],
     "Deal 3. Apply 2 Bleed.", hit=THRUST, arch=BL,
     flavour="A barber's first lesson: a small blade in the right place.",
     note="The Bloodletter's short curved blade flicks out and a thin red line follows.",
     up={"text": "Deal 4. Apply 3 Bleed.", "fx": [D(4), ST("bleed", 3)]})
card("du_open_the_vein", "Open the Vein", 1, "C", "enemy", [ST("bleed", 4)],
     "Apply 4 Bleed.", hit=ALL, arch=BL,
     flavour="Let it run. The bowl is patient.",
     note="A lancet from the belt case flies to a back-rank foe and sticks in its arm.",
     up={"text": "Apply 5 Bleed.", "fx": [ST("bleed", 5)]})
card("du_letting_cut", "Letting Cut", 1, "C", "enemy", [D(3), ST("bleed", 3, if_="same_target")],
     "Deal 3. Follow-up: apply 3 Bleed.", arch=BL,
     flavour="Someone else opened the door. The barber only widens it.",
     note="The Bloodletter cuts into the wound the Bulwark's mace has just made.",
     up={"text": "Deal 4. Follow-up: apply 4 Bleed.", "fx": [D(4), ST("bleed", 4, if_="same_target")]})
card("du_bloodmist", "Bloodmist", 2, "C", "all_enemies", [ST("bleed", 3)],
     "Apply 3 Bleed to every foe.", hit=ALL, arch=BL,
     flavour="A spray of cuts, too quick to count. They will count them later.",
     note="The Bloodletter whirls through the line and a red mist hangs over the nave.",
     up={"text": "Apply 4 Bleed to every foe.", "fx": [ST("bleed", 4)]})
card("du_cupping_glass", "Cupping Glass", 1, "C", "enemy", [H(1, per="m.bleed", k=1, to="lowest_ally")],
     "The most wounded hero heals 1, plus 1 per Bleed on the target (not spent).", hit=ALL, arch=BL,
     flavour="Draw the bad blood out of them. Put the good back into us.",
     note="A warm glass cup set on a hero's wound fills with light while a foe bleeds.",
     up={"text": "The most wounded hero heals 3, plus 1 per Bleed on the target (not spent).",
         "fx": [H(3, per="m.bleed", k=1, to="lowest_ally")]})
card("du_deep_cut", "Deep Cut", 1, "C", "enemy", [ST("bleed", 2), ST("vulnerable", 1, if_="t.bleed>=6")],
     "Apply 2 Bleed. Then, if the target has 6 or more Bleed, it becomes Vulnerable.", hit=THRUST, arch=BL,
     flavour="Past a certain depth the body stops defending itself.",
     note="The Bloodletter's curved blade sinks to the hilt in an already bloodied foe.",
     up={"text": "Apply 3 Bleed. Then, if the target has 6 or more Bleed, it becomes Vulnerable.",
         "fx": [ST("bleed", 3), ST("vulnerable", 1, if_="t.bleed>=6")]})

# ------------------------------------------------------------------ common: core (Mark, Follow-up, Riposte, rank)
card("du_follow_through", "Press the Opening", 1, "C", "enemy", [D(3), D(4, if_="same_target")],
     "Deal 3. Follow-up: hit it again for 4.", arch="core",
     flavour="Strike where the last blow landed. It is still open.",
     note="The Duelist's rapier enters the gap the Elementalist's frost just cracked open.",
     up={"text": "Deal 4. Follow-up: hit it again for 5.", "fx": [D(4), D(5, if_="same_target")]})
card("du_en_garde", "En Garde", 1, "C", "self", [SELF("riposte", 3), B(3)],
     "Gain Riposte 3. Gain 3 Block.", use=ALL, arch="core",
     flavour="Come, then. The blade is waiting for you.",
     note="The Duelist sinks into the side-on stance, rapier level, rear arm back.",
     up={"text": "Gain Riposte 4. Gain 4 Block.", "fx": [SELF("riposte", 4), B(4)]})
card("du_give_ground", "Give Ground", 1, "C", "self", [RET(1), B(5), BANK(1)],
     "Retreat 1. Gain 5 Block. Bank 1.", use=[1, 2], arch="core",
     flavour="A fencing master yields a step to keep the measure. Never more.",
     note="The Duelist steps back behind the Bulwark's door, blade still up.",
     up={"text": "Retreat 1. Gain 7 Block. Bank 1.", "fx": [RET(1), B(7), BANK(1)]})
card("du_slip_and_cut", "Slip and Cut", 1, "C", "enemy",
     [SELF("dodge", 1), D(2), D(3, if_="t.targeting_me")],
     "Dodge the next hit this round. Deal 2. If the target means to attack you, hit it again for 3.", arch="core",
     flavour="Let it come. Be somewhere else. Cut what is left reaching.",
     note="A drowned thrall's swing passes through the space the Duelist just left.",
     up={"text": "Dodge the next hit this round. Deal 3. If the target means to attack you, hit it again for 4.",
         "fx": [SELF("dodge", 1), D(3), D(4, if_="t.targeting_me")]})
card("du_thunder_lunge", "Thunder Lunge", 1, "C", "enemy", [ADV(1), D(3), A(L, 2)],
     "Advance 1. Deal 3. Apply 2 Lightning.", use=[2, 3], hit=THRUST, attr="stable", arch=BD,
     flavour="The schools teach the lunge and the strike as one thing.",
     note="The Duelist crosses two ranks in one lunge, sparks branching up the blade.",
     up={"text": "Advance 1. Deal 4. Apply 3 Lightning.", "fx": [ADV(1), D(4), A(L, 3)]})
card("du_second_intention", "Second Intention", 1, "C", "enemy",
     [D(3), SELF("momentum", 1), SELF("momentum", 1, if_="handoff")],
     "Deal 3. Gain 1 Momentum. Handoff: gain 1 more.", arch="core",
     flavour="The first attack is a question. The second is the point.",
     note="A feint at the face; the real line goes low while the foe is still answering.",
     up={"text": "Deal 5. Gain 1 Momentum. Handoff: gain 1 more.",
         "fx": [D(5), SELF("momentum", 1), SELF("momentum", 1, if_="handoff")]})

# ------------------------------------------------------------------ uncommon: Bladedancer
card("du_closing_whirl", "Closing Whirl", 2, "U", "all_enemies", [FIN(), D(2, per="consumed", k=2, if_="t.rank<=2")],
     "Finisher. Deal 2, plus 2 per Momentum spent, to each foe in ranks 1 and 2.", hit=ALL, kw=["Finisher"], arch=BD,
     flavour="Every step of the dance was the windup. This is the swing.",
     note="The Bladedancer turns a full circle at the front of the nave, both blades out.",
     up={"text": "Finisher. Deal 2, plus 2 per Momentum spent, to each foe in ranks 1 and 2.", "cost": 1})
card("du_quick_hands", "Quick Hands", 1, "U", "enemy", [D(1, per="spent_before", k=1, times=2, max=6)],
     "Twice: deal 1, plus 1 per vigour spent before it this round, up to 6.", arch=BD + "+alchemist_might",
     flavour="Two cuts in the time of one. Three, when the blood is up.",
     note="The Duelist's sword hand blurs; two red lines appear on a foe's guard.",
     up={"text": "Twice: deal 2, plus 1 per vigour spent before it this round, up to 7.",
         "fx": [D(2, per="spent_before", k=1, times=2, max=7)]})
card("du_catch_the_rhythm", "Catch the Rhythm", 0, "U", "self",
     [SELF("momentum", 1), SELF("momentum", 1, if_="played>=2")],
     "Gain 1 Momentum. If you have played 2 or more cards this round, gain 1 more.", use=ALL, arch=BD,
     flavour="One. Two. Now the feet know the tune.",
     note="The Duelist's blade tip circles faster, keeping time with the bell overhead.",
     up={"text": "Gain 1 Momentum. If you have played a card this round, gain 1 more.",
         "fx": [SELF("momentum", 1), SELF("momentum", 1, if_="played>=1")]})
card("du_serrated_rhythm", "Serrated Rhythm", 1, "U", "self", [ST("bleed", 1, to="front_enemy")],
     "Apply 1 Bleed to the foe in rank 1. Rite: for the rest of the fight, each physical card you play on a foe also "
     "applies 1 Bleed to it, up to 3 times a round. Exhaust.",
     use=ALL, kw=["Rite", "Exhaust"], arch=BD + "+" + BL,
     rite={"on": "play", "cat": "physical", "per_round": 3, "fx": [ST("bleed", 1)]},
     flavour="Notch the edge. Every touch after that leaves something behind.",
     note="The Bladedancer draws a file along the second blade; its edge comes up toothed.",
     up={"text": "Apply 1 Bleed to the foe in rank 1. Rite: for the rest of the fight, each physical card you play on "
                 "a foe also applies 1 Bleed to it, up to 5 times a round. Exhaust.",
         "rite": {"on": "play", "cat": "physical", "per_round": 5, "fx": [ST("bleed", 1)]}})
card("du_shatter_point", "Shatter Point", 1, "U", "enemy", [D(4, per="t.frost", k=1, max=8)],
     "Deal 4, plus 1 per Weaken on the target, up to 8.", arch=BD + "+elementalist_frost",
     flavour="Cold steel, colder foe. Strike the frost and it breaks.",
     note="The rapier's point cracks the rime on a frozen foe and the ice falls away in plates.",
     up={"text": "Deal 5, plus 2 per Weaken on the target, up to 11.", "fx": [D(5, per="t.frost", k=2, max=11)]})
# ------------------------------------------------------------------ uncommon: Executioner
card("du_carry_out_the_sentence", "Carry Out the Sentence", 1, "U", "enemy",
     [FIN(), D(3), EXEC(4, per="consumed", k=3, if_="t.mark>0")],
     "Finisher. Deal 3. Then, if the target is Marked, Execute 4, plus 3 per Momentum spent.",
     hit=THRUST, kw=["Finisher", "Execute"], arch=EX,
     flavour="Sentence was passed. All that remains is the stroke.",
     note="The black hood bows once over a kneeling, Marked foe; the heading sword rises.",
     up={"text": "Finisher. Deal 5. Then, if the target is Marked, Execute 4, plus 3 per Momentum spent.",
         "fx": [FIN(), D(5), EXEC(4, per="consumed", k=3, if_="t.mark>0")]})
card("du_condemned", "Condemned", 1, "U", "all_enemies", [ST("mark", 2, if_="t.hp_pct<50")],
     "Mark every foe below half HP for 2 rounds.", hit=ALL, arch=EX,
     flavour="The wounded are named first. It saves time.",
     note="The Executioner walks the line and taps each bleeding foe with the flat of the blade.",
     up={"text": "Mark every foe below half HP for 2 rounds. Gain 1 Momentum.",
         "fx": [ST("mark", 2, if_="t.hp_pct<50"), SELF("momentum", 1)]})
card("du_second_stroke", "Second Stroke", 2, "U", "enemy", [D(6, per="t.missing_hp", k=0.5, max=20)],
     "Deal 6, plus 1 per 2 HP the target is missing, up to 20.", arch=EX,
     flavour="A bad headsman needs a second stroke. A good one plans for it.",
     note="The heading sword falls again on a foe the company has already broken.",
     up={"text": "Deal 6, plus 1 per 2 HP the target is missing, up to 20.", "cost": 1})
card("du_next_in_line", "Next in Line", 1, "U", "enemy", [D(5), SELF("thrift", 1, if_="killed")],
     "Deal 5. If it kills, gain 1 Thrift.", arch=EX,
     flavour="One down. The block is cleaned. Next.",
     note="The Executioner steps over a fallen foe toward the one behind it.",
     up={"text": "Deal 7. If it kills, gain 1 Thrift.", "fx": [D(7), SELF("thrift", 1, if_="killed")]})
card("du_bled_pale", "Bled Pale", 1, "U", "enemy", [D(3), EXEC(2, per="t.bleed", k=2)],
     "Deal 3. Then Execute 2, plus 2 per Bleed on the target.", hit=THRUST, kw=["Execute"], arch=EX + "+" + BL,
     flavour="White as linen, light as straw. The stroke barely needs the sword.",
     note="A foe stands grey-faced over a red pool; the hood leans in and finishes it.",
     up={"text": "Deal 4. Then Execute 3, plus 2 per Bleed on the target.",
         "fx": [D(4), EXEC(3, per="t.bleed", k=2)]})

# ------------------------------------------------------------------ uncommon: Bloodletter
card("du_drain_the_bowl", "Drain the Bowl", 2, "U", "enemy",
     [CONS(s="bleed"), D(0, per="consumed", k=2), H(0, per="consumed", k=1, to="lowest_ally")],
     "Consume the target's Bleed. Deal 2 per stack. The most wounded hero heals 1 per stack.", hit=THRUST, arch=BL,
     flavour="Every barber's bowl is emptied in the end. Into someone.",
     note="The Bloodletter tips the full bowl; the red runs from the foe to a wounded hero.",
     up={"text": "Consume the target's Bleed. Deal 3 per stack. The most wounded hero heals 1 per stack.",
         "fx": [CONS(s="bleed"), D(0, per="consumed", k=3), H(0, per="consumed", k=1, to="lowest_ally")]})
card("du_haemorrhage", "Haemorrhage", 1, "U", "enemy", [ST("bleed", 2), DBL(s="bleed")],
     "Apply 2 Bleed, then double the target's Bleed. Exhaust.", hit=ALL, kw=["Exhaust"], arch=BL,
     flavour="There is a vessel in the thigh no barber touches. This barber does.",
     note="A foe looks down at the dark spreading flood under its legs.",
     up={"text": "Apply 3 Bleed, then double the target's Bleed. Exhaust.", "fx": [ST("bleed", 3), DBL(s="bleed")]})
card("du_foul_blood", "Foul Blood", 1, "U", "enemy", [D(3), ST("bleed", 0, per="t.toxin", k=1)],
     "Deal 3. Apply Bleed equal to the target's Toxin.", hit=THRUST, arch=BL + "+alchemist_toxin",
     flavour="Poisoned blood wants out. The barber obliges.",
     note="The Plaguewright's toxin blackens a foe's veins; the Bloodletter's blade opens them.",
     up={"text": "Deal 3. Apply 1 Bleed, plus 1 per Toxin on the target.",
         "fx": [D(3), ST("bleed", 1, per="t.toxin", k=1)]})
card("du_red_hands", "Red Hands", 1, "U", "enemy", [D(0, per="t.bleed", k=2)],
     "Deal 2 per Bleed on the target (not spent).", arch=BL,
     flavour="The barber does not wash between patients. It saves time.",
     note="The Bloodletter's striped sleeve is red to the elbow as the blade goes in.",
     up={"text": "Deal 3, plus 2 per Bleed on the target (not spent).", "fx": [D(3, per="t.bleed", k=2)]})
card("du_barbers_trade", "Barber's Trade", 1, "U", "enemy",
     [ST("bleed", 2), H(2, per="vigour_left", k=1, max=4, to="lowest_ally")],
     "Apply 2 Bleed. The most wounded hero heals 2, plus 1 per vigour left unspent, up to 4.", hit=THRUST, arch=BL,
     flavour="Cut here, bind there. The trade has always run both ways.",
     note="One hand lances a foe, the other presses a bandage to a hero's side.",
     up={"text": "Apply 3 Bleed. The most wounded hero heals 3, plus 1 per vigour left unspent, up to 6.",
         "fx": [ST("bleed", 3), H(3, per="vigour_left", k=1, max=6, to="lowest_ally")]})

# ------------------------------------------------------------------ uncommon: core
card("du_charged_point", "Charged Point", 1, "U", "enemy", [D(2, per="t.lightning", k=2)],
     "Deal 2, plus 2 per Lightning on the target (not spent).", hit=THRUST, arch=BD + "+elementalist_static",
     flavour="Where the storm has already been, the blade finds the way.",
     note="Branching scorch marks on a foe flare white as the rapier's point touches them.",
     up={"text": "Deal 4, plus 2 per Lightning on the target (not spent).", "fx": [D(4, per="t.lightning", k=2)]})
card("du_forked_blade", "Forked Blade", 1, "U", "enemy", [D(3), A(L, 2), A(L, 1, to="adjacent")],
     "Deal 3. Apply 2 Lightning to the target and 1 to each foe beside it.", attr="stable", arch=BD,
     flavour="The spark does not stop at one. It never has.",
     note="Lightning forks from the Duelist's blade into the foes on either side.",
     up={"text": "Deal 4. Apply 2 Lightning to the target and 2 to each foe beside it.",
         "fx": [D(4), A(L, 2), A(L, 2, to="adjacent")]})
card("du_answering_steel", "Answering Steel", 1, "U", "enemy", [SELF("riposte", 1), D(0, per="riposte", k=3, max=15)],
     "Gain Riposte 1. Deal 3 per Riposte you hold (not spent), up to 15.", arch="core",
     flavour="A parry held long enough becomes an attack.",
     note="The Duelist uncoils from a deep guard, the rapier striking from where it parried.",
     up={"text": "Gain Riposte 2. Deal 3 per Riposte you hold (not spent), up to 18.",
         "fx": [SELF("riposte", 2), D(0, per="riposte", k=3, max=18)]})
card("du_open_guard", "Open Guard", 1, "U", "self", [SELF("taunt"), SELF("riposte", 4)],
     "Taunt. Gain Riposte 4.", use=[1, 2], arch="core",
     flavour="Here. Right here. Aim for it.",
     note="The Duelist lowers the blade in rank 1 and beckons the drowned forward.",
     up={"text": "Taunt. Gain Riposte 6.", "fx": [SELF("taunt"), SELF("riposte", 6)]})
card("du_in_the_wake", "In the Wake", 1, "U", "enemy",
     [D(4), D(4, if_="same_target"), SELF("momentum", 1, if_="handoff")],
     "Deal 4. Follow-up: hit it again for 4. Handoff: gain 1 Momentum.", arch="core+bulwark_cover",
     flavour="The Bulwark knocks the guard aside. The point is already there.",
     note="The Duelist's lunge lands in the dent the Bulwark's mace has just left.",
     up={"text": "Deal 5. Follow-up: hit it again for 5. Handoff: gain 1 Momentum.",
         "fx": [D(5), D(5, if_="same_target"), SELF("momentum", 1, if_="handoff")]})
# ------------------------------------------------------------------ rare
card("du_hundred_touches", "A Hundred Touches", 2, "R", "enemy",
     [FIN(), D(3, times=1, times_per="consumed"), D(3, if_="vigour_spent>=6")],
     "Finisher. Deal 3, once plus once per Momentum spent. If 6 or more vigour was spent this round, hit once more "
     "for 3.", kw=["Finisher"], arch=BD + "+alchemist_might",
     flavour="No single cut matters. That is the point. All of them do.",
     note="The Bladedancer is a blur of two blades; a foe's coat comes apart in ribbons.",
     up={"text": "Finisher. Deal 4, once plus once per Momentum spent. If 6 or more vigour was spent this round, hit "
                 "once more for 4.",
         "fx": [FIN(), D(4, times=1, times_per="consumed"), D(4, if_="vigour_spent>=6")]})
card("du_ride_the_lightning", "Ride the Lightning", 1, "R", "enemy",
     [ADV(1), A(L, 2, attr="volatile"), SELF("momentum", 2)],
     "Advance 1. Apply 2 Volatile Lightning. Gain 2 Momentum.", use=[2, 3], hit=THRUST, cat=L, attr="volatile",
     arch=BD + "+elementalist_conjunction",
     flavour="The schools say the bolt chooses the blade. Some blades choose back.",
     note="The Duelist comes down the stair inside a fork of lightning, point first.",
     up={"text": "Advance 1. Apply 3 Volatile Lightning. Gain 2 Momentum.",
         "fx": [ADV(1), A(L, 3, attr="volatile"), SELF("momentum", 2)]})
card("du_counter_time", "Counter-Time", 1, "R", "self",
     [SELF("dodge", 1), SELF("riposte", 2, per="attackers", k=2)],
     "Dodge the next hit this round. Gain Riposte 2, plus 2 per foe that means to attack you.", use=ALL, arch="core",
     flavour="Read the attack, step through it, and be the answer it did not expect.",
     note="Three foes swing at once; the Duelist is already behind the first of them.",
     up={"text": "Dodge the next hit this round. Gain Riposte 3, plus 2 per foe that means to attack you.",
         "fx": [SELF("dodge", 1), SELF("riposte", 3, per="attackers", k=2)]})
card("du_duellists_eye", "The Duelist's Eye", 2, "R", "all_enemies",
     [ST("mark"), ST("vulnerable", 1, if_="t.bleed>0"), SELF("momentum", 2)],
     "Mark every foe. Each foe with Bleed also becomes Vulnerable. Gain 2 Momentum.", hit=ALL,
     arch=EX + "+" + BL,
     flavour="Every wound is a lesson in where the next one goes.",
     note="The Duelist stands still in the nave and looks along the whole bleeding line.",
     up={"text": "Mark every foe. Each foe with Bleed also becomes Vulnerable. Gain 2 Momentum.", "cost": 1})
card("du_final_judgment", "Final Judgment", 1, "R", "enemy", [FIN(), EXEC(5, per="consumed", k=4)],
     "Finisher. Execute 5, plus 4 per Momentum spent.", hit=THRUST, kw=["Finisher", "Execute"],
     arch=EX + "+hexweaver_doom",
     flavour="No appeal is heard on this side of the door.",
     note="The Doomsayer's bell tolls and the Executioner's sword falls on the same beat.",
     up={"text": "Finisher. Execute 7, plus 4 per Momentum spent.", "fx": [FIN(), EXEC(7, per="consumed", k=4)]})
card("du_make_an_example", "Make an Example", 1, "R", "enemy",
     [D(4), ST("mark", 1, to="all_enemies", if_="killed"), PRIME(2, if_="killed")],
     "Deal 4. If it kills, Mark every foe and Prime 2.", arch=EX,
     flavour="One falls in front of the others. Now they all know their turn is coming.",
     note="A foe drops at the Executioner's feet; the rest of the line flinches.",
     up={"text": "Deal 6. If it kills, Mark every foe and Prime 3.",
         "fx": [D(6), ST("mark", 1, to="all_enemies", if_="killed"), PRIME(3, if_="killed")]})
card("du_open_every_vein", "Open Every Vein", 2, "R", "all_enemies",
     [ST("bleed", 2), ST("vulnerable", 1, if_="t.bleed>=5")],
     "Apply 2 Bleed to every foe. Then each foe with 5 or more Bleed becomes Vulnerable.", hit=ALL, arch=BL,
     flavour="The whole line is one patient now.",
     note="The Bloodletter runs the length of the line, the curved blade touching every foe once.",
     up={"text": "Apply 3 Bleed to every foe. Then each foe with 5 or more Bleed becomes Vulnerable.",
         "fx": [ST("bleed", 3), ST("vulnerable", 1, if_="t.bleed>=5")]})
card("du_bowl_passed_round", "The Bowl Passed Round", 1, "R", "all_allies", [H(0, per="total_bleed", k=0.5)],
     "Every hero heals 1 per 2 Bleed on all foes. Exhaust.", use=ALL, kw=["Exhaust"], arch=BL,
     flavour="Drink. It was theirs. Now it is ours.",
     note="The bloodied bowl goes hand to hand around the company in the brine grotto.",
     up={"text": "Every hero heals 3, plus 1 per 2 Bleed on all foes. Exhaust.", "fx": [H(3, per="total_bleed", k=0.5)]})
card("du_echo_of_steel", "Echo of Steel", 1, "R", "enemy", [D(3, times=2), ST("bleed", 2, if_="same_target")],
     "Echo. Deal 3 twice. Follow-up: apply 2 Bleed.", kw=["Echo"], arch=BD + "+" + BL,
     flavour="Strike, and strike, and the stone walls strike back with the sound of it.",
     note="The Bladedancer's two blades ring in the belfry and the ringing cuts again.",
     up={"text": "Echo. Deal 4 twice. Follow-up: apply 2 Bleed.",
         "fx": [D(4, times=2), ST("bleed", 2, if_="same_target")]})
card("du_oath_of_the_salle", "Oath of the Salle", 1, "R", "self", [FIN(), SELF("might", 0, per="consumed", k=0.5)],
     "Finisher. Gain 1 Might per 2 Momentum spent. Exhaust.", use=ALL, kw=["Finisher", "Exhaust"], arch=BD,
     flavour="Sworn on the blade at the fencing hall. Every cut since keeps the vow.",
     note="The Duelist kisses the swept hilt, and the scorch lines on the sword hand glow.",
     up={"text": "Finisher. Gain 1 Might, plus 1 per 2 Momentum spent. Exhaust.",
         "fx": [FIN(), SELF("might", 1, per="consumed", k=0.5)]})
card("du_fall_back_in_guard", "Fall Back in Guard", 1, "R", "self", [RET(1), SELF("dodge", 2), ST("thrift", 1, to="in_front")],
     "Retreat 1. Dodge the next 2 hits this round. The hero in front of you then gains 1 Thrift.", use=[1, 2],
     arch="core",
     flavour="Retreat is a step of the dance. The blade never leaves the line.",
     note="The Duelist backs up the stair, parrying two blows on the way.",
     up={"text": "Retreat 1. Dodge the next 2 hits this round. The hero in front of you then gains 1 Thrift and 4 "
                 "Block.",
         "fx": [RET(1), SELF("dodge", 2), ST("thrift", 1, to="in_front"), B(4, to="in_front")]})
card("du_killing_thrust", "Killing Thrust", 2, "R", "enemy",
     [FIN(), D(3, per="consumed", k=3), EXEC(6, if_="t.mark>0")],
     "Finisher. Deal 3, plus 3 per Momentum spent. Then Execute 6 if the target is Marked.",
     hit=THRUST, kw=["Finisher", "Execute"], arch=BD + "+" + EX,
     flavour="The whole fight was spent arriving at this one inch of steel.",
     note="The rapier goes through a Marked foe to the swept hilt; the Duelist does not look back.",
     up={"text": "Finisher. Deal 3, plus 3 per Momentum spent. Then Execute 10 if the target is Marked.",
         "fx": [FIN(), D(3, per="consumed", k=3), EXEC(10, if_="t.mark>0")]})

# ------------------------------------------------------------------ path: Bladedancer
card("du_second_blade", "Second Blade", 1, "X", "enemy",
     [D(2, times=3), SELF("momentum", 1), SELF("momentum", 1, if_="same_target")],
     "Deal 2 three times. Gain 1 Momentum. Follow-up: gain 1 more.", sub=BD, arch=BD,
     flavour="The off hand was never idle. It was waiting for its turn.",
     note="The Bladedancer draws the second blade mid-turn and both cut together.",
     up={"text": "Deal 3 three times. Gain 1 Momentum. Follow-up: gain 1 more.",
         "fx": [D(3, times=3), SELF("momentum", 1), SELF("momentum", 1, if_="same_target")]})
card("du_encore", "Encore", 1, "X", "enemy", [D(4, per="vigour_spent", k=0.5, max=8), SELF("momentum", 1)],
     "Echo. Deal 4, plus 1 for every 2 vigour spent this round, up to 8. Gain 1 Momentum.", kw=["Echo"], sub=BD,
     arch=BD,
     flavour="The crowd is dead and drowned. The dancer bows anyway, and goes again.",
     note="The Bladedancer finishes a pass, bows, and comes straight back through.",
     up={"text": "Echo. Deal 6, plus 1 for every 2 vigour spent this round, up to 10. Gain 1 Momentum.",
         "fx": [D(6, per="vigour_spent", k=0.5, max=10), SELF("momentum", 1)]})
card("du_blade_wheel", "Blade Wheel", 2, "X", "all_enemies", [FIN(), D(2, per="consumed", k=1), D(2, if_="t.mark>0")],
     "Finisher. Deal 2, plus 1 per Momentum spent, to every foe. Hit each Marked foe again for 2.", hit=ALL,
     kw=["Finisher"], sub=BD, arch=BD + "+" + EX,
     flavour="Two blades, one turn, and nobody in the room is out of reach.",
     note="The Bladedancer spins down the whole line, open shirt flaring, blades flat out.",
     up={"text": "Finisher. Deal 2, plus 1 per Momentum spent, to every foe. Hit each Marked foe again for 2.",
         "cost": 1})
card("du_untouchable", "Untouchable", 1, "X", "self", [SELF("dodge", 2), SELF("momentum", 1)],
     "Dodge the next 2 hits this round. Gain 1 Momentum.", use=ALL, sub=BD, arch=BD,
     flavour="They have been swinging at the dancer all night. They are tired. The dancer is not.",
     note="Two blows close on the Bladedancer and meet only each other.",
     up={"text": "Dodge the next 2 hits this round. Gain 2 Momentum.", "fx": [SELF("dodge", 2), SELF("momentum", 2)]})
card("du_drink_and_dance", "Drink and Dance", 1, "X", "enemy", [D(5), SELF("momentum", 2, if_="flasks_used")],
     "Deal 5. Dosed: gain 2 Momentum.", kw=["Dosed"], sub=BD, arch=BD + "+alchemist_flask",
     flavour="The Alchemist's Haste goes down like cold wine and comes out through the feet.",
     note="The Bladedancer catches a thrown flask, drinks, and is already moving.",
     up={"text": "Deal 7. Dosed: gain 2 Momentum.", "fx": [D(7), SELF("momentum", 2, if_="flasks_used")]})
card("du_cut_between_beats", "Cut Between Beats", 0, "X", "enemy", [D(1, per="played", k=1)],
     "Deal 1, plus 1 per card you played before it this round.", sub=BD, arch=BD,
     flavour="There is always room for one more cut between two others.",
     note="A third blade-flash lands between the Bladedancer's first two.",
     up={"text": "Deal 2, plus 1 per card you played before it this round.", "fx": [D(2, per="played", k=1)]})

# ------------------------------------------------------------------ path: Executioner
card("du_square_tip", "The Square Tip", 2, "X", "enemy", [D(11, per="t.mark", k=4, max=15), EXEC(6, if_="last")],
     "Deal 11, or 15 if the target is Marked. Last in the Ordo: then Execute 6.", use=[1, 2], kw=["Execute"],
     sub=EX, arch=EX,
     flavour="A heading sword has no point. It was never made to fight. Only to finish.",
     note="The broad square-tipped blade comes down two-handed on a Marked foe.",
     up={"text": "Deal 15, or 20 if the target is Marked. Last in the Ordo: then Execute 8.",
         "fx": [D(15, per="t.mark", k=5, max=20), EXEC(8, if_="last")]})
card("du_drag_them_up", "Drag Them Up", 1, "X", "enemy", [PULL(2), ST("mark", 2)],
     "Pull the target forward 2. Mark it for 2 rounds.", hit=FAR, sub=EX, arch=EX,
     flavour="Up the steps. Kneel. Hood or no hood, they all kneel.",
     note="The Executioner drags a back-rank foe by the hair to the front of the throne room.",
     up={"text": "Pull the target forward 2. Mark it for 3 rounds.", "fx": [PULL(2), ST("mark", 3)]})
card("du_hanging_day", "Hanging Day", 1, "X", "all_enemies", [FIN(), EXEC(4, per="consumed", k=2, if_="t.mark>0")],
     "Finisher. Execute 4, plus 2 per Momentum spent, on every Marked foe.", hit=ALL,
     kw=["Finisher", "Execute"], sub=EX, arch=EX,
     flavour="Not one sentence today. All of them, in a row.",
     note="The Executioner walks the Marked line and the sword falls once for each.",
     up={"text": "Finisher. Execute 6, plus 2 per Momentum spent, on every Marked foe.",
         "fx": [FIN(), EXEC(6, per="consumed", k=2, if_="t.mark>0")]})
card("du_wipe_the_blade", "Wipe the Blade", 1, "X", "self", [B(5), STRESS(-2, to="all_allies"), BANK(1)],
     "Gain 5 Block. Every hero sheds 2 stress. Bank 1.", use=ALL, sub=EX, arch=EX,
     flavour="The apron takes the blood. The company takes a breath.",
     note="The Executioner wipes the heading sword on the leather apron, unhurried.",
     up={"text": "Gain 7 Block. Every hero sheds 3 stress. Bank 1.", "fx": [B(7), STRESS(-3, to="all_allies"), BANK(1)]})
card("du_mercy_stroke", "Mercy Stroke", 1, "X", "enemy", [D(5), EXEC(6, per="t.hex", k=1, max=12, if_="t.mark>0")],
     "Deal 5. Then, if the target is Marked, Execute 6, plus 1 per Hex on it, up to 12.", kw=["Execute"], sub=EX,
     arch=EX + "+hexweaver_hex",
     flavour="A headsman's kindness is a single stroke.",
     note="A Marked foe sags to its knees; the hooded figure ends it cleanly.",
     up={"text": "Deal 6. Then, if the target is Marked, Execute 8, plus 1 per Hex on it, up to 15.",
         "fx": [D(6), EXEC(8, per="t.hex", k=1, max=15, if_="t.mark>0")]})
card("du_heavy_sentence", "Heavy Sentence", 1, "X", "enemy", [D(4, per="t.doom", k=1)],
     "Deal 4, plus 1 per Doom on the target.", sub=EX, arch=EX + "+hexweaver_doom",
     flavour="The bell has rung for it. The sword only keeps the appointment.",
     note="The Doomsayer's handbell rings and the Executioner strikes on the toll.",
     up={"text": "Deal 6, plus 1 per Doom on the target.", "fx": [D(6, per="t.doom", k=1)]})

# ------------------------------------------------------------------ path: Bloodletter
card("du_nick_the_vein", "Nick the Vein", 0, "X", "enemy", [ST("bleed", 1), ST("bleed", 1, if_="same_target")],
     "Apply 1 Bleed. Follow-up: apply 1 more.", hit=ALL, sub=BL, arch=BL,
     flavour="A barber can bleed a man without him feeling it.",
     note="A lancet's tip touches a foe's wrist in passing; a bead of red follows.",
     up={"text": "Apply 2 Bleed. Follow-up: apply 1 more.", "fx": [ST("bleed", 2), ST("bleed", 1, if_="same_target")]})
card("du_bleed_the_line", "Bleed the Line", 1, "X", "enemy", [ST("bleed", 3), ST("bleed", 2, to="adjacent")],
     "Apply 3 Bleed to the target and 2 to each foe beside it.", hit=THRUST, sub=BL, arch=BL,
     flavour="One cut, and the bowl fills from three sides.",
     note="The Bloodletter's curved blade passes through one foe and catches the two beside it.",
     up={"text": "Apply 4 Bleed to the target and 3 to each foe beside it.",
         "fx": [ST("bleed", 4), ST("bleed", 3, to="adjacent")]})
card("du_let_the_fever_out", "Let the Fever Out", 1, "X", "ally", [ST("thrift", 1, if_="t.ailments>=3"), CLEANSE(2), H(4)],
     "If the target hero has 3 or more ailment stacks, they gain 1 Thrift. They lose 2 ailment stacks and heal 4.",
     use=ALL, sub=BL, arch=BL,
     flavour="Bad humours out, good blood in. The oldest cure there is.",
     note="The Bloodletter opens a vein in a fevered hero's arm over the bowl, gently.",
     up={"text": "If the target hero has 3 or more ailment stacks, they gain 1 Thrift. They lose 3 ailment stacks and "
                 "heal 6.",
         "fx": [ST("thrift", 1, if_="t.ailments>=3"), CLEANSE(3), H(6)]})
card("du_arterial_cut", "Arterial Cut", 2, "X", "enemy", [D(6), ST("bleed", 4, per="vigour_spent", k=0.5, max=8)],
     "Deal 6. Apply 4 Bleed, plus 1 for every 2 vigour spent this round, up to 8.", sub=BL, arch=BL,
     flavour="There is a place on every body where the barber stops being gentle.",
     note="A bright red arc leaps from a foe's throat across the nave's flagstones.",
     up={"text": "Deal 6. Apply 4 Bleed, plus 1 for every 2 vigour spent this round, up to 8.", "cost": 1})
card("du_turn_the_parry", "Turn the Parry", 1, "X", "enemy",
     [CONS(s="riposte", to="self"), ST("bleed", 1, per="consumed", k=1)],
     "Spend all your Riposte. Apply 1 Bleed, plus 1 per Riposte spent.", hit=THRUST, sub=BL, arch=BL + "+core",
     flavour="Every blade it sent at you comes back as a cut it cannot close.",
     note="The Bloodletter turns a foe's blade along its own arm and opens it to the elbow.",
     up={"text": "Spend all your Riposte. Apply 3 Bleed, plus 1 per Riposte spent.",
         "fx": [CONS(s="riposte", to="self"), ST("bleed", 3, per="consumed", k=1)]})
card("du_full_letting", "Full Letting", 2, "X", "enemy", [FIN(), ST("bleed", 2, per="consumed", k=2)],
     "Finisher. Apply 2 Bleed, plus 2 per Momentum spent.", hit=ALL, kw=["Finisher"], sub=BL,
     arch=BL + "+" + BD,
     flavour="Not a nick. Not a lancing. The full letting, the way the old barbers did it.",
     note="The Bloodletter's blade moves in a long practised line and the bowl overflows.",
     up={"text": "Finisher. Apply 2 Bleed, plus 2 per Momentum spent.", "cost": 1})

# ------------------------------------------------------------------ legendary (win conditions, not budgeted)
card("du_the_endless_measure", "The Endless Measure", 1, "L", "self", [SELF("momentum", 1)],
     "Gain 1 Momentum. Rite: for the rest of the fight, each physical card you play on a foe after your second card "
     "in a round also deals 3 to it. Exhaust.",
     use=ALL, kw=["Rite", "Exhaust"], sub=BD, arch=BD,
     rite={"on": "play", "cat": "physical", "if": "played>=3", "fx": [D(3)]},
     flavour="The music never stops. The dancer stopped counting long ago.",
     note="The Bladedancer moves through the whole throne room in one unbroken phrase of cuts.",
     up={"text": "Gain 1 Momentum. Rite: for the rest of the fight, each physical card you play on a foe after your "
                 "second card in a round also deals 3 to it and applies 1 Bleed to it. Exhaust.",
         "rite": {"on": "play", "cat": "physical", "if": "played>=3", "fx": [D(3), ST("bleed", 1)]}})
card("du_two_blades_one_heart", "Two Blades, One Heart", 1, "L", "self", [SELF("momentum", 2)],
     "Gain 2 Momentum. Rite: for the rest of the fight, each Finisher you play also deals 5 to each foe in ranks 1 "
     "and 2, and you Dodge the next hit this round. Exhaust.",
     use=ALL, kw=["Rite", "Exhaust"], sub=BD, arch=BD,
     rite={"on": "play", "kw": "Finisher",
           "fx": [D(5, to="all_enemies", if_="t.rank<=2"), SELF("dodge", 1)]},
     flavour="One blade to guard, one to answer, and one heart keeping time for both.",
     note="The Bladedancer stands untouched in rank 1 as both blades sweep the front of the line.",
     up={"text": "Gain 2 Momentum. Rite: for the rest of the fight, each Finisher you play also deals 5 to each foe "
                 "in ranks 1 and 2, you Dodge the next hit this round, and you gain 1 Momentum. Exhaust.",
         "rite": {"on": "play", "kw": "Finisher",
                  "fx": [D(5, to="all_enemies", if_="t.rank<=2"), SELF("dodge", 1), SELF("momentum", 1)]}})
card("du_the_headsmans_round", "The Headsman's Round", 1, "L", "enemy", [ST("mark")],
     "Mark the target. Rite: for the rest of the fight, each time an Execute kills or breaks a foe, +1 vigour next "
     "round and deal 6 to every Marked foe, at most twice a round. Exhaust.",
     hit=ALL, kw=["Rite", "Exhaust"], sub=EX, arch=EX,
     rite={"on": "execute", "per_round": 2, "fx": [EN(1), D(6, to="all_enemies", if_="t.mark>0")]},
     flavour="The cart is full. The headsman works through the list without looking up.",
     note="The Executioner moves down a kneeling, Marked line, one stroke for each.",
     up={"text": "Mark the target. Rite: for the rest of the fight, each time an Execute kills or breaks a foe, +1 "
                 "vigour next round, deal 6 to every Marked foe and Mark the foe in rank 1, at most twice a round. "
                 "Exhaust.",
         "rite": {"on": "execute", "per_round": 2,
                  "fx": [EN(1), D(6, to="all_enemies", if_="t.mark>0"), ST("mark", 1, to="front_enemy")]}})
card("du_the_long_sentence", "The Long Sentence", 1, "L", "enemy", [ST("mark", 99)],
     "Mark the target for the rest of the fight. Rite: for the rest of the fight, each card you play gives that foe "
     "2 Doom. Exhaust.",
     hit=ALL, kw=["Rite", "Exhaust"], sub=EX, arch=EX + "+hexweaver_doom",
     rite={"on": "play", "allies": True, "fx": [ST("doom", 2, to="all_enemies", if_="t.mark>=50")]},
     flavour="Some sentences take a single stroke. This one takes the whole fight.",
     note="The Executioner names a ruler from across the throne room and begins the count.",
     up={"text": "Mark the target for the rest of the fight. Rite: for the rest of the fight, each card you play "
                 "gives that foe 2 Doom and deals 2 to it. Exhaust.",
         "rite": {"on": "play", "allies": True, "fx": [ST("doom", 2, to="all_enemies", if_="t.mark>=50"),
                                                       D(2, to="all_enemies", if_="t.mark>=50")]}})
card("du_red_tide", "Red Tide", 1, "L", "self", [ST("bleed", 2, to="all_enemies")],
     "Apply 2 Bleed to every foe. Rite: for the rest of the fight, when a foe dies, every foe gains Bleed equal to "
     "the Bleed it had, and you gain 1 Thrift. Exhaust.",
     use=ALL, kw=["Rite", "Exhaust"], sub=BL, arch=BL,
     rite={"on": "kill", "fx": [ST("bleed", 0, per="m.bleed", k=1, to="all_enemies"), SELF("thrift", 1)]},
     flavour="The bowl was never big enough. Let the floor hold it.",
     note="The nave floor runs red from wall to wall, and the Bloodletter wades through it.",
     up={"text": "Apply 2 Bleed to every foe. Rite: for the rest of the fight, when a foe dies, every foe gains Bleed "
                 "equal to the Bleed it had, plus 2, and you gain 1 Thrift. Exhaust.",
         "rite": {"on": "kill", "fx": [ST("bleed", 2, per="m.bleed", k=1, to="all_enemies"), SELF("thrift", 1)]}})
card("du_the_bowl_runs_over", "The Bowl Runs Over", 1, "L", "self",
     [H(0, per="total_bleed", k=1, to="lowest_ally")],
     "The most wounded hero heals 1 per Bleed on all foes. Rite: at the end of each round, the most wounded hero "
     "heals 1 per Bleed on all foes. Exhaust.",
     use=ALL, kw=["Rite", "Exhaust"], sub=BL, arch=BL,
     rite={"on": "round_end", "fx": [H(0, per="total_bleed", k=1, to="lowest_ally")]},
     flavour="Whatever they spill, the company drinks. The fight can last forever now.",
     note="The bloodied bowl hangs brimming from its cord, and the company's wounds close as foes pale.",
     up={"text": "The most wounded hero heals 1 per Bleed on all foes. Rite: at the end of each round, the most "
                 "wounded hero heals 1 per Bleed on all foes and every hero sheds 2 stress. Exhaust.",
         "rite": {"on": "round_end", "fx": [H(0, per="total_bleed", k=1, to="lowest_ally"),
                                            STRESS(-2, to="all_allies")]}})

# ------------------------------------------------------------------ hero
HERO = {"name": "Duelist", "hp": 34, "armor": 0, "grit": 2, "color": "8aa271", "kit": ["du_find_the_gap"],
        "deck": ["du_first_touch", "du_first_touch", "du_lunge", "du_lunge", "du_sighting_cut", "du_sighting_cut", "du_parry", "du_parry",
                 "du_close_the_measure", "du_close_the_measure"],
        "subclasses": {BD: "Bladedancer", BL: "Bloodletter", EX: "Executioner"},
        "blurb": "The Quick Blade. Chains actions back to back for Momentum, picks a foe with Mark, cuts in right "
                 "after the company's blows, and spends it all on a Finisher."}

# Each archetype's six key cards for the build-aware simulator (5 common or uncommon, 1 rare or path accelerant).
ARCHETYPES = {
    BD: ["du_feather_cut", "du_two_step", "du_light_feet", "du_turn_of_the_wrist", "du_sweep", "du_closing_whirl"],
    EX: ["du_pronounce_sentence", "du_measure_the_neck", "du_haul_forward", "du_weigh_the_wound", "du_carry_out_the_sentence",
         "du_bled_pale"],
    BL: ["du_lancet", "du_open_the_vein", "du_letting_cut", "du_deep_cut", "du_haemorrhage", "du_drain_the_bowl"],
}

NEEDS = [
    "du_the_endless_measure: wanted each cut after the second to repeat at half power (an Echo per card). Written as "
    "a flat 3 damage to the card's target.",
    "du_two_blades_one_heart: the brief's 'while holding 3+ Momentum, Dodge the first blow each round' is a second "
    "trigger (round_start, if momentum>=3); a rite has one. The Dodge rides on the Finisher trigger instead.",
    "du_the_headsmans_round: wanted the Execute to refund its vigour this round and strike only the next Marked foe. "
    "Written as +1 vigour next round and 6 to every Marked foe, twice a round at most.",
    "du_the_long_sentence: wanted its own Sentence counter fed by every hero's hits on one foe. Written as Doom (the "
    "Hexweaver's status) from this hero's plays, with Mark 99 tagging the sentenced foe (rite reads t.mark>=50). "
    "Needs a 'hit by any hero' rite trigger and a way to name one foe for a rite.",
    "du_red_tide: the brief's 'Bleed stops falling' is a second rite (round_end) beside the kill rite; and the dying "
    "foe's Bleed goes to every foe, as there is no 'neighbours of the dead foe' target.",
    "budget.py: Thrift falls to the default 1.5 points a stack (worth about a vigour), and an X cost (-1) gives a "
    "negative target, so no X card was written. Wanted: a Bladedancer X Finisher ('hit X times; at X 4 or more, "
    "double the Momentum spent').",
    "du_fall_back_in_guard: wanted 'the hero who takes your place'. Written as the hero in front of you after the "
    "Retreat (to='in_front'), which is the same hero whenever the Retreat lands.",
    "A 'cost' read only sees Thrift's discount (nothing raises a cost), so no Duelist card reads 'cost'. Wanted: a "
    "quantity for Momentum gained this round, so Handoff and back-to-back chains could be paid off together.",
]
