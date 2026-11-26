"""Bulwark, the Iron Vow: Gate 3 card set (brief: docs/design/gate2/calling_bulwark.md).

Archetypes (arch keys match the path keys):
  last_bastion  The Wound Holds: Taunt and Guard, oaths paid in HP, payoffs that read Scars and Death's Door.
  ironwarden    Winter Wall: Fortified Block, Frost on the foes that mean to strike him, Block turned into blows.
  thornguard    Penance: Thorns, Taunt and self-harm; blows that add or spend his Thorns.
Each archetype's six key cards (ARCHETYPES below) are commons and uncommons; rares, path cards and legendaries
accelerate them. Riposte is the Duelist's (DECISIONS row 2); the one Bleed card is Barbs Left In (row 3)."""
from dsl import *

set_class("bulwark", [1, 2], [1, 2])
ALL = [1, 2, 3, 4]
COVER = [1, 2, 3]
BACK = [3, 4]
SB, IW, TG = "last_bastion", "ironwarden", "thornguard"

# ------------------------------------------------------------------ kit
card("bw_k_bar_the_door", "Bar the Door", 1, "K", "ally_other", [GUARD(), BANK(1, to="self", if_="m.targeted")],
     "Guard another hero this round. If a foe means to strike them, Bank 1.", use=COVER, arch="core",
     flavour="A door is for keeping things out. He keeps it shut.",
     note="The Bulwark steps across the nave and sets the church door in front of the Oracle.",
     up={"text": "Guard another hero this round. If a foe means to strike them, gain 2 Block and Bank 1.",
         "fx": [GUARD(), B(2, to="self", if_="m.targeted"), BANK(1, to="self", if_="m.targeted")]})
card("bw_k_come_on_then", "Come On, Then", 1, "K", "self", [SELF("taunt"), STRESS(-4)], "Taunt. Shed 4 stress.",
     sub=SB, arch=SB,
     flavour="He has been hit by worse. He says so, through the slit.",
     note="The bandaged Bulwark bangs the mace on the cracked door, calling the drowned to him.",
     up={"text": "Taunt. Shed 7 stress.", "fx": [SELF("taunt"), STRESS(-7)]})
card("bw_k_bank_the_cold", "Bank the Cold", 1, "K", "self", [B(2), SELF("fortify"), BANK(1)],
     "Gain 2 Block. Fortify. Bank 1.",
     use=ALL, sub=IW, cat="frost", arch=IW,
     flavour="In the north they let the snow drift high against the wall. It holds.",
     note="Frost creeps across the pine door's windward planks as the Ironwarden settles behind it.",
     up={"text": "Gain 4 Block. Fortify. Bank 1.", "fx": [B(4), SELF("fortify"), BANK(1)]})
card("bw_k_scourge", "Scourge", 1, "K", "self", [SELFDMG(1), SELF("thorns", 4)], "Lose 1 HP. Gain 4 Thorns.",
     use=ALL, sub=TG, arch=TG,
     flavour="One stroke for the tower. One for the ones inside it.",
     note="The Thornguard lashes his own shoulder with the flagellant's cord; the barbs on his arms stand up.",
     up={"text": "Lose 1 HP. Gain 6 Thorns.", "fx": [SELFDMG(1), SELF("thorns", 6)]})

# ------------------------------------------------------------------ starter (deck: 3 Brace, 3 Mace Blow, 2 Interpose,
# 1 Hold the Line, 1 Over the Rim)
card("bw_brace", "Brace", 1, "S", "self", [B(6)], "Gain 6 Block.", use=ALL, arch="core",
     flavour="Feet wide, knees bent, weight into the door.",
     note="The Bulwark settles behind the church door on the drowned stair, mace resting on its rim.",
     up={"text": "Gain 8 Block.", "fx": [B(8)]})
card("bw_mace_blow", "Mace Blow", 1, "S", "enemy", [D(6)], "Deal 6.", arch="core",
     flavour="Short step. Over the top edge. Again.",
     note="The flanged mace comes over the door's top edge onto a Drowned Thrall's skull.",
     up={"text": "Deal 8.", "fx": [D(8)]})
card("bw_interpose", "Interpose", 1, "S", "ally_other", [GUARD(), B(2, to="self")],
     "Guard another hero this round. Gain 2 Block.", use=COVER, arch="core",
     flavour="Get behind the door. All of you.",
     note="The Bulwark shoulders in front of the Elementalist as a spear comes out of the dark.",
     up={"text": "Guard another hero this round. Gain 4 Block.", "fx": [GUARD(), B(4, to="self")]})
card("bw_hold_the_line", "Hold the Line", 1, "S", "self", [SELF("taunt"), B(4)], "Taunt. Gain 4 Block.", arch="core",
     flavour="He stood in the gate once. He is standing in it still.",
     note="The Bulwark plants the door in the nave aisle; every drowned head turns toward him.",
     up={"text": "Taunt. Gain 6 Block.", "fx": [SELF("taunt"), B(6)]})
card("bw_over_the_rim", "Over the Rim", 2, "S", "enemy", [D(7, per="block", k=0.5, max=15)],
     "Deal 7, plus half your Block, up to 15.",
     arch="core",
     flavour="The door takes the blow. The mace gives it back.",
     note="Braced behind the door, the Bulwark brings the mace down over the rim in a full overhead blow.",
     up={"text": "Deal 10, plus half your Block, up to 18.", "fx": [D(10, per="block", k=0.5, max=18)]})

# ------------------------------------------------------------------ common: Last Bastion (The Wound Holds)
card("bw_draw_their_eyes", "Draw Their Eyes", 0, "C", "self", [SELF("taunt"), STRESS(3), B(2, if_="first")],
     "Taunt. Gain 3 stress. First in the Ordo: gain 2 Block.",
     arch=SB + "+" + TG,
     flavour="Look at me. Not at them.",
     note="The Bulwark raps the mace on the door's ring handle; the belfry's foes turn from the back rank.",
     up={"text": "Taunt. Gain 2 stress. First in the Ordo: gain 4 Block.",
         "fx": [SELF("taunt"), STRESS(2), B(4, if_="first")]})
card("bw_scar_tissue", "Scar Tissue", 1, "C", "self", [B(3, per="scars", k=0.34)], "Gain 3 Block, plus 1 for every 3 Scars.",
     use=ALL, arch=SB,
     flavour="Every scar on him is a place where something failed to finish the job.",
     note="Blood runs from under the Bulwark's helm as he sets his shoulder harder into the door.",
     up={"text": "Gain 4 Block, plus 1 for every 2 Scars.", "fx": [B(4, per="scars", k=0.5)]})
card("bw_toll_of_the_tower", "Toll of the Tower", 2, "C", "enemy",
     [D(6, per="scars", k=0.5), STRESS(-6, to="self", if_="killed")],
     "Deal 6, plus 1 for every 2 Scars. If this kills the target, shed 6 stress.", arch=SB,
     flavour="The tower fell. He did not. Someone has to pay for that.",
     note="A bloodied Bulwark swings the mace two-handed, the door hanging from his forearm, in the ossuary.",
     up={"text": "Deal 9, plus 1 for every 2 Scars. If this kills the target, shed 6 stress.",
         "fx": [D(9, per="scars", k=0.5), STRESS(-6, to="self", if_="killed")]})
card("bw_blood_for_iron", "Blood for Iron", 1, "C", "self", [SELFDMG(2), AR(1), B(3)],
     "Lose 2 HP. Gain 1 Armor for the fight and 3 Block. Exhaust.", use=ALL, kw=["Exhaust"], arch=SB,
     flavour="The garrison oath: my blood for the wall, the wall for the ones behind it.",
     note="The Bulwark draws his palm across the breastplate's lead patch, leaving a red smear.",
     up={"text": "Lose 2 HP. Gain 1 Armor for the fight and 6 Block. Exhaust.", "fx": [SELFDMG(2), AR(1), B(6)]})
card("bw_still_standing", "Still Standing", 1, "C", "self", [B(3), B(7, if_="dd")],
     "Retain. Gain 3 Block. At Death's Door, gain 7 more.", use=ALL, kw=["Retain"], arch=SB,
     flavour="He should be dead. He has been told so, by better men than you.",
     note="On one knee behind the door, the Bulwark pushes himself back up on the mace haft.",
     up={"text": "Retain. Gain 4 Block. At Death's Door, gain 10 more.", "fx": [B(4), B(10, if_="dd")]})
card("bw_grit_your_teeth", "Grit Your Teeth", 1, "C", "self", [STRESS(-6), B(2), B(4, if_="flasks_used")],
     "Shed 6 stress. Gain 2 Block. Dosed: gain 4 more Block.", use=ALL, kw=["Dosed"], arch=SB + "+alchemist_flask",
     flavour="Breathe. Count the hinges. Three. Still three.",
     note="Behind the door, the Bulwark lays his gauntlet on the iron hinges and breathes.",
     up={"text": "Shed 8 stress. Gain 3 Block. Dosed: gain 5 more Block.",
         "fx": [STRESS(-8), B(3), B(5, if_="flasks_used")]})

# ------------------------------------------------------------------ common: Ironwarden (Winter Wall)
card("bw_rime_coat", "Rime Coat", 1, "C", "self", [B(5), A("frost", 1, to="attackers")],
     "Gain 5 Block. Apply 1 Frost to each foe that means to strike you.", use=ALL, cat="frost", attr="stable",
     arch=IW,
     flavour="Strike the door and the cold goes up your arm.",
     note="White rime races across the door's face as two foes raise their weapons at it.",
     up={"text": "Gain 6 Block. Apply 2 Frost to each foe that means to strike you.",
         "fx": [B(6), A("frost", 2, to="attackers")]})
card("bw_hold_through_the_night", "Hold Through the Night", 1, "C", "self",
     [B(4, per="vigour_left", k=1, max=6), SELF("fortify")],
     "Gain 4 Block, plus 1 per vigour left unspent, up to 6. Fortify.", use=ALL, arch=IW,
     flavour="In the north the watch is all night, and the night is half the year.",
     note="The Ironwarden stands his door in the snow and does not move as the light goes.",
     up={"text": "Gain 5 Block, plus 1 per vigour left unspent, up to 8. Fortify.",
         "fx": [B(5, per="vigour_left", k=1, max=8), SELF("fortify")]})
card("bw_hoarfrost_blow", "Hoarfrost Blow", 1, "C", "enemy",
     [D(5), A("frost", 1, attr="stable"), A("frost", 1, attr="stable", if_="same_target")],
     "Deal 5. Apply 1 Frost. If this follows an action on the same foe, apply 1 more.", arch=IW,
     flavour="The mace hangs on the windward side. It comes off cold.",
     note="A frost-furred mace head strikes a foe's shoulder and leaves a white star of rime.",
     up={"text": "Deal 6. Apply 2 Frost. If this follows an action on the same foe, apply 1 more.",
         "fx": [D(6), A("frost", 2, attr="stable"), A("frost", 1, attr="stable", if_="same_target")]})
card("bw_windward_shield", "Windward Shield", 1, "C", "ally_other", [B(5), A("frost", 1, attr="stable", to="front_enemy")],
     "Another hero gains 5 Block. Apply 1 Frost to the front foe.", use=ALL, arch=IW,
     flavour="Stand on my lee side. The wind is mine to take.",
     note="The Ironwarden turns the pine door into the wind so the Duelist stands in its lee.",
     up={"text": "Another hero gains 7 Block. Apply 1 Frost to the front foe.",
         "fx": [B(7), A("frost", 1, attr="stable", to="front_enemy")]})
card("bw_cold_iron", "Cold Iron", 1, "C", "self", [B(4, per="total_frost", k=1, max=14)],
     "Gain 4 Block, plus 1 for each Frost on all foes, up to 14.", use=ALL, cat="frost", arch=IW,
     flavour="Iron in the cold does not bend. It waits.",
     note="Frost climbs the door's iron straps while the foes beyond it slow and stiffen.",
     up={"text": "Gain 6 Block, plus 1 for each Frost on all foes, up to 16.", "fx": [B(6, per="total_frost", k=1, max=16)]})
card("bw_break_the_ice", "Break the Ice", 1, "C", "enemy", [D(0, per="block", k=0.5, max=8), D(3, if_="reactions")],
     "Deal damage equal to half your Block, up to 8. If a Conjunction has gone off this round, hit it again for 3.",
     arch=IW + "+elementalist_conjunction",
     flavour="The door is the weight. The mace only tells it where to go.",
     note="The Ironwarden drives the rimed door's edge into a frozen foe and the ice cracks.",
     up={"text": "Deal damage equal to half your Block, up to 10. If a Conjunction has gone off this round, hit it "
                 "again for 5.",
         "fx": [D(0, per="block", k=0.5, max=10), D(5, if_="reactions")]})

# ------------------------------------------------------------------ common: Thornguard (Penance)
card("bw_barbed_plate", "Barbed Plate", 1, "C", "self", [SELF("thorns", 3), B(3)], "Gain 3 Thorns and 3 Block.",
     use=ALL, arch=TG,
     flavour="He welded every barb himself. One for each name.",
     note="The Thornguard braces his barbed forearm across the door's face.",
     up={"text": "Gain 4 Thorns and 4 Block.", "fx": [SELF("thorns", 4), B(4)]})
card("bw_hair_shirt", "Hair Shirt", 0, "C", "self", [SELFDMG(3), SELF("thorns", 4)], "Lose 3 HP. Gain 4 Thorns.",
     use=ALL, arch=TG + "+" + SB,
     flavour="Penance is worn against the skin, where only he can feel it.",
     note="The Thornguard tugs the hair shirt tight at his neck; blood spots the collar.",
     up={"text": "Lose 3 HP. Gain 6 Thorns.", "fx": [SELFDMG(3), SELF("thorns", 6)]})
card("bw_come_and_take_it", "Come and Take It", 1, "C", "self", [SELF("taunt"), SELF("thorns", 2)],
     "Taunt. Gain 2 Thorns.", arch=TG,
     flavour="Strike me. I want you to.",
     note="The Thornguard spreads his barbed arms wide from behind the door, inviting the blow.",
     up={"text": "Taunt. Gain 4 Thorns.", "fx": [SELF("taunt"), SELF("thorns", 4)]})
card("bw_spiked_boss", "Spiked Boss", 1, "C", "enemy", [D(4), SELF("thorns", 1, per="attackers", k=1)],
     "Deal 4. Gain 1 Thorns, plus 1 for each foe that means to strike you.", use=[1], hit=[1], arch=TG,
     flavour="The ring handle is still on the door. Now there is a spike through it.",
     note="The Thornguard rams the spiked door into the front foe from rank 1.",
     up={"text": "Deal 5. Gain 2 Thorns, plus 1 for each foe that means to strike you.",
         "fx": [D(5), SELF("thorns", 2, per="attackers", k=1)]})
card("bw_thorn_hedge", "Thorn Hedge", 1, "C", "ally_other", [ST("thorns", 2), ST("empower", 3)],
     "Another hero gains 2 Thorns, and their next hit deals 3 more.", use=ALL, arch=TG,
     flavour="He ties a barbed cord round the scholar's wrist. Just in case.",
     note="The Thornguard knots a strip of barbed cord around the Hexweaver's arm.",
     up={"text": "Another hero gains 3 Thorns, and their next hit deals 4 more.", "fx": [ST("thorns", 3), ST("empower", 4)]})
card("bw_penitents_blow", "Penitent's Blow", 1, "C", "enemy", [D(3, per="thorns", k=1)], "Deal 3, plus your Thorns.",
     arch=TG,
     flavour="Every barb he wears, he puts into you.",
     note="The Thornguard swings his barbed forearm and mace together into a foe's ribs.",
     up={"text": "Deal 5, plus your Thorns.", "fx": [D(5, per="thorns", k=1)]})

# ------------------------------------------------------------------ common: the company's wall
card("bw_keep_the_back_rank", "Keep the Back Rank", 1, "C", "ally_other", [GUARD(), B(4, if_="t.rank>=3")],
     "Guard another hero this round. If they stand in rank 3 or 4, they gain 4 Block.", use=COVER, arch="core",
     flavour="The ones at the back are the ones who know what we are fighting.",
     note="The Bulwark backs up the stair to stand over the kneeling Oracle.",
     up={"text": "Guard another hero this round. If they stand in rank 3 or 4, they gain 6 Block.",
         "fx": [GUARD(), B(6, if_="t.rank>=3")]})
card("bw_hook_and_drag", "Hook and Drag", 1, "C", "enemy", [PULL(1), D(4)], "Pull the target forward 1, then deal 4.",
     hit=BACK, arch="core",
     flavour="The flanges catch. Whatever they catch comes forward.",
     note="The Bulwark hooks the mace's flanges into a caster's robe and hauls it out of the back rank.",
     up={"text": "Pull the target forward 1, then deal 6.", "fx": [PULL(1), D(6)]})
card("bw_shield_rim", "Shield Rim", 1, "C", "enemy", [D(3), B(3, to="self", per="m.hex", k=1, if_="m.targeting_me")],
     "Deal 3. If the target means to strike you, gain 3 Block, plus 1 for each Hex on it.",
     arch="core+hexweaver_hex",
     flavour="Meet the blow with the edge, not the face. A cursed arm swings slow.",
     note="The door's iron-bound edge cracks into a foe's raised arm mid-swing.",
     up={"text": "Deal 4. If the target means to strike you, gain 5 Block, plus 1 for each Hex on it.",
         "fx": [D(4), B(5, to="self", per="m.hex", k=1, if_="m.targeting_me")]})
card("bw_ring_the_helm", "Ring the Helm", 2, "C", "enemy", [D(9), BASHSTUN()],
     "Deal 9. Stun the target if it is Marked or was moved this round. Exhaust.", kw=["Exhaust"],
     arch="core+duelist_mark",
     flavour="Strike a helm hard enough and the head inside rings like a bell.",
     note="The mace lands on a dragged foe's helm and the belfry bell answers it.",
     up={"text": "Deal 12. Stun the target if it is Marked or was moved this round. Exhaust.", "fx": [D(12), BASHSTUN()]})
card("bw_hunker", "Hunker", 1, "C", "self", [B(4), SELF("anchor"), BANK(1)],
     "Gain 4 Block. You cannot be moved this round. Bank 1.",
     use=ALL, arch="core",
     flavour="Sabatons in the mud. Let them try.",
     note="The Bulwark drops his weight low, iron sabatons sunk in the stair's silt.",
     up={"text": "Gain 6 Block. You cannot be moved this round. Bank 1.", "fx": [B(6), SELF("anchor"), BANK(1)]})
card("bw_into_the_breach", "Into the Breach", 1, "C", "adjacent_ally", [SWAP(), B(5, to="self"), B(3, to="self", if_="handoff")],
     "Swap with an adjacent hero. Gain 5 Block. Handoff: gain 3 more.", use=ALL, arch="core",
     flavour="Something came through the breach once. He was not standing in it. Never again.",
     note="The Bulwark shoulders past the Duelist to put the door back in the front rank.",
     up={"text": "Swap with an adjacent hero. Gain 7 Block. Handoff: gain 4 more.",
         "fx": [SWAP(), B(7, to="self"), B(4, to="self", if_="handoff")]})

# ------------------------------------------------------------------ uncommon: Last Bastion
card("bw_unbroken", "Unbroken", 1, "U", "self", [B(5), SELF("might", 1, if_="dd")],
     "Gain 5 Block. At Death's Door, gain 1 Might.", use=ALL, arch=SB,
     flavour="On his knees, he is still taller than the door.",
     note="At the foot of the throne, the Bulwark rises from a kneel with the door before him.",
     up={"text": "Gain 7 Block. At Death's Door, gain 1 Might.", "fx": [B(7), SELF("might", 1, if_="dd")]})
card("bw_bleed_for_them", "Bleed for Them", 1, "U", "ally_other",
     [ST("thrift", 1, if_="hp>=5"), SELFDMG(4), H(6), H(3, if_="flasks_used")],
     "If you have 5 or more HP, another hero gains 1 Thrift. Lose 4 HP. They heal 6. Dosed: they heal 3 more.",
     use=ALL, kw=["Dosed"],
     arch=SB + "+alchemist_flask",
     flavour="He has more blood than the scholar. He has done the sums.",
     note="The Bulwark presses his own bandage to the Duelist's wound and takes the cut meant for her.",
     up={"text": "If you have 5 or more HP, another hero gains 1 Thrift. Lose 4 HP. They heal 8 and gain 3 Block. "
                 "Dosed: they heal 3 more.",
         "fx": [ST("thrift", 1, if_="hp>=5"), SELFDMG(4), H(8), B(3), H(3, if_="flasks_used")]})
card("bw_answer_the_blow", "Answer the Blow", 1, "U", "enemy", [D(3, per="attackers", k=1), D(6, if_="dd")],
     "Deal 3, plus 1 for each foe that means to strike you. At Death's Door, hit it again for 6.", arch=SB,
     flavour="The last thing the tower's breakers saw was a dead man getting up.",
     note="A bloodied Bulwark, down to his last breath, brings the mace up from the floor.",
     up={"text": "Deal 4, plus 2 for each foe that means to strike you. At Death's Door, hit it again for 8.",
         "fx": [D(4, per="attackers", k=2), D(8, if_="dd")]})
card("bw_shoulder_their_burden", "Shoulder Their Burden", 1, "U", "self",
     [TAKESTRESS(8), B(1, per="heroes_before", k=1, max=4)],
     "Take up to 8 stress from every other hero onto yourself. Gain 1 Block, plus 1 for each other hero who acted "
     "before this, up to 4.", use=ALL, arch=SB,
     flavour="Give it here. He has carried a door this far.",
     note="The Bulwark lays a gauntlet on the trembling Alchemist's shoulder at the nave's edge.",
     up={"text": "Take up to 12 stress from every other hero onto yourself. Gain 2 Block, plus 2 for each other hero "
                 "who acted before this, up to 8.",
         "fx": [TAKESTRESS(12), B(2, per="heroes_before", k=2, max=8)]})
card("bw_tithe_of_blood", "Tithe of Blood", 0, "U", "self", [SELFDMG(3), EN(1)],
     "Lose 3 HP. Next round, +1 vigour. Exhaust.", use=ALL, kw=["Exhaust"], arch=SB,
     flavour="The abbey pays in ostia. He pays in what he has.",
     note="The Bulwark tightens the bandage under his helm until it reddens through.",
     up={"text": "Lose 2 HP. Next round, +1 vigour. Exhaust.", "fx": [SELFDMG(2), EN(1)]})

# ------------------------------------------------------------------ uncommon: Ironwarden
card("bw_winter_vigil", "Winter Vigil", 2, "U", "self", [B(4, to="all_allies"), A("frost", 1, to="all_enemies")],
     "Every hero gains 4 Block. Apply 1 Frost to every foe.", use=ALL, cat="frost", attr="stable", arch=IW,
     flavour="The chapel bell rang through the long night. None of them slept. All of them lived.",
     note="The company huddles in the lee of the pine door as frost sweeps over the foes.",
     up={"text": "Every hero gains 5 Block. Apply 2 Frost to every foe.",
         "fx": [B(5, to="all_allies"), A("frost", 2, to="all_enemies")]})
card("bw_shed_the_rime", "Shed the Rime", 1, "U", "self",
     [CONS(s="block", to="self"), A("frost", 0, per="consumed", k=0.5, max=4, to="all_enemies")],
     "Lose all your Block. Apply 1 Frost to every foe for every 2 Block lost, up to 4.", use=ALL, cat="frost",
     attr="stable", arch=IW,
     flavour="Everything the door has taken, thrown back as cold.",
     note="The Ironwarden shakes the rime off his door and it scatters over the foes as frost.",
     up={"text": "Lose all your Block. Apply 1 Frost to every foe for every 2 Block lost, up to 6.",
         "fx": [CONS(s="block", to="self"), A("frost", 0, per="consumed", k=0.5, max=6, to="all_enemies")]})
card("bw_glacier_wall", "Glacier Wall", 2, "U", "self",
     [B(8, per="total_frost", k=1, max=14), B(0, per="reactions", k=3, max=6), SELF("fortify")],
     "Gain 8 Block, plus 1 for each Frost on all foes, up to 14. Gain 3 Block for each Conjunction set off this "
     "round, up to 6. Fortify.", use=ALL, cat="frost", arch=IW + "+elementalist_conjunction",
     flavour="A glacier does not hurry. It does not stop, either.",
     note="Ice thickens in layers over the pine door until it stands like a wall of the north.",
     up={"text": "Gain 11 Block, plus 1 for each Frost on all foes, up to 17. Gain 3 Block for each Conjunction set "
                 "off this round, up to 9. Fortify.",
         "fx": [B(11, per="total_frost", k=1, max=17), B(0, per="reactions", k=3, max=9), SELF("fortify")]})
card("bw_numbing_cold", "Numbing Cold", 1, "U", "all_enemies", [A("frost", 2), A("frost", 1, if_="t.water")],
     "Apply 2 Frost to every foe, and 1 more to each foe with Soak.", hit=ALL, cat="frost", attr="stable",
     arch=IW + "+elementalist_water",
     flavour="The chapel's cold came with the door. Wet things freeze first.",
     note="The Ironwarden breathes out behind the door and frost spreads across the floor to every foe.",
     up={"text": "Apply 3 Frost to every foe, and 1 more to each foe with Soak.",
         "fx": [A("frost", 3), A("frost", 1, if_="t.water")]})
card("bw_brittle", "Brittle", 1, "U", "enemy", [A("frost", 1, attr="stable", if_="handoff"), D(1, per="t.frost", k=2, max=12)],
     "Handoff: apply 1 Frost first. Deal 1, plus 2 for each Frost on the target, up to 12.",
     arch=IW,
     flavour="Cold iron breaks. So does everything else.",
     note="The mace strikes a rimed foe and frost-cracks spider across its armour.",
     up={"text": "Handoff: apply 1 Frost first. Deal 3, plus 2 for each Frost on the target, up to 14.",
         "fx": [A("frost", 1, attr="stable", if_="handoff"), D(3, per="t.frost", k=2, max=14)]})

# ------------------------------------------------------------------ uncommon: Thornguard
card("bw_rake_of_thorns", "Rake of Thorns", 1, "U", "enemy",
     [CONS(s="thorns", to="self"), D(2, per="consumed", k=1, max=14), PRIME(0, per="consumed", k=0.5, max=4)],
     "Lose all your Thorns. Deal 2, plus 1 for each Thorns lost, up to 14. Prime 1 for every 2 Thorns lost, up to 4.",
     arch=TG,
     flavour="Penance ends. The barbs come out. Not gently.",
     note="The Thornguard drags his barbed forearm across a foe, tearing every spike loose.",
     up={"text": "Lose all your Thorns. Deal 4, plus 1 for each Thorns lost, up to 16. Prime 1 for every 2 Thorns "
                 "lost, up to 5.",
         "fx": [CONS(s="thorns", to="self"), D(4, per="consumed", k=1, max=16), PRIME(0, per="consumed", k=0.5, max=5)]})
card("bw_barbs_left_in", "Barbs Left In", 1, "U", "enemy", [CONS(s="thorns", to="self"), ST("bleed", 0, per="consumed", k=1)],
     "Lose all your Thorns. Apply 1 Bleed for each Thorns lost.", arch=TG,
     flavour="The barber-surgeons taught him this one. He did not ask how they knew.",
     note="The Thornguard snaps his barbs off in a foe's hide and leaves them there.",
     up={"text": "Lose all your Thorns. Apply 2 Bleed, plus 1 for each Thorns lost.",
         "fx": [CONS(s="thorns", to="self"), ST("bleed", 2, per="consumed", k=1)]})
card("bw_spiteful_guard", "Spiteful Guard", 1, "U", "ally_other", [GUARD(), SELF("thorns", 3)],
     "Guard another hero this round. Gain 3 Thorns.", use=COVER, arch=TG,
     flavour="Go on. Reach past him for the scholar.",
     note="The barbed door swings in front of the Elementalist; a foe's claw catches on the spikes.",
     up={"text": "Guard another hero this round. Gain 5 Thorns.", "fx": [GUARD(), SELF("thorns", 5)]})
card("bw_flagellants_cord", "Flagellant's Cord", 1, "U", "self", [SELFDMG(3), SELF("taunt"), SELF("thorns", 5)],
     "Lose 3 HP. Taunt. Gain 5 Thorns.", arch=TG + "+" + SB,
     flavour="Every stroke is a name. He is not near the end of the list.",
     note="The Thornguard lashes the cord across his back in full view of the foes.",
     up={"text": "Lose 3 HP. Taunt. Gain 7 Thorns.", "fx": [SELFDMG(3), SELF("taunt"), SELF("thorns", 7)]})
card("bw_bramble_wall", "Bramble Wall", 2, "U", "self", [SELF("taunt"), B(8), SELF("thorns", 0, per="attackers", k=2)],
     "Taunt. Gain 8 Block, and 2 Thorns for each foe that means to strike you.", arch=TG + "+" + IW,
     flavour="Come at the door and the door comes at you.",
     note="Three foes close on the barbed door at once; the Thornguard does not step back.",
     up={"text": "Taunt. Gain 10 Block, and 3 Thorns for each foe that means to strike you.",
         "fx": [SELF("taunt"), B(10), SELF("thorns", 0, per="attackers", k=3)]})

# ------------------------------------------------------------------ uncommon: the company's wall
card("bw_under_the_door", "Under the Door", 1, "U", "ally", [B(2), W(1, per="t.ailments", k=1)],
     "A hero gains 2 Block and 1 Ward, plus 1 Ward for each ailment on them.", use=ALL, arch="core",
     flavour="The rubric strip on the ring handle was blessed. He has never asked by whom.",
     note="The Bulwark tilts the door over the Alchemist; the red rubric strip flutters on its ring.",
     up={"text": "A hero gains 3 Block and 2 Ward, plus 1 Ward for each ailment on them.",
         "fx": [B(3), W(2, per="t.ailments", k=1)]})
card("bw_weight_of_the_door", "Weight of the Door", 2, "U", "enemy",
     [D(6, per="block", k=1, max=24), CONS(s="block", to="self"), PUSH(1, if_="vigour_spent>=6")],
     "Deal 6, plus your Block, up to 24. Lose all your Block. If 6 or more vigour was spent this round, push the "
     "target back 1.",
     arch=SB + "+" + IW,
     flavour="Oak, three hinges and a man behind it. Enough to break a gate.",
     note="The Bulwark charges behind the door and slams its full face into a foe.",
     up={"text": "Deal 9, plus your Block, up to 27. Lose all your Block. If 6 or more vigour was spent this round, "
                 "push the target back 1.",
         "fx": [D(9, per="block", k=1, max=27), CONS(s="block", to="self"), PUSH(1, if_="vigour_spent>=6")]})
card("bw_counterweight", "Counterweight", 1, "U", "enemy", [PULL(2), PRIME(3)],
     "Pull the target forward 2. Prime 3.", hit=BACK, arch="core+duelist_followup",
     flavour="Out of the back rank. Into the blade's reach.",
     note="The Bulwark hauls a back-rank caster forward on the mace's flanges, straight onto the Duelist's line.",
     up={"text": "Pull the target forward 2. Prime 5.", "fx": [PULL(2), PRIME(5)]})
card("bw_close_ranks", "Close Ranks", 1, "U", "all_allies", [B(2), B(1, if_="t.ailments")],
     "Every hero gains 2 Block, and 1 more if they have an ailment.", use=ALL, arch="core",
     flavour="Shoulder to shoulder. The garrison way.",
     note="The company presses in behind the church door, shoulder to shoulder on the stair.",
     up={"text": "Every hero gains 3 Block, and 1 more if they have an ailment.", "fx": [B(3), B(1, if_="t.ailments")]})
card("bw_dig_in", "Dig In", 1, "U", "self", [B(5), B(5, if_="!moved")],
     "Gain 5 Block. Gain 5 more if you have not moved this round.", arch="core",
     flavour="The front rank is his. It has been since the tower.",
     note="The Bulwark grinds the door's lower edge into the flagstones at the front of the line.",
     up={"text": "Gain 6 Block. Gain 6 more if you have not moved this round.", "fx": [B(6), B(6, if_="!moved")]})

# ------------------------------------------------------------------ rare
card("bw_undying_watch", "Undying Watch", 1, "R", "self",
     [GRIT(1), B(0, per="scars", k=0.34), STRESS(-2, to="allies_other")],
     "Gain 1 Grit, and 1 Block for every 3 Scars. Every other hero sheds 2 stress. Exhaust.", use=ALL, kw=["Exhaust"],
     arch=SB,
     flavour="The last watch of the tower never ended. He is still standing it.",
     note="The Bulwark stands alone in the ossuary doorway, plate patched with lead, as bones stir.",
     up={"text": "Gain 2 Grit, and 1 Block for every 3 Scars. Every other hero sheds 3 stress. Exhaust.",
         "fx": [GRIT(2), B(0, per="scars", k=0.34), STRESS(-3, to="allies_other")]})
card("bw_martyrdom", "Martyrdom", 1, "R", "self", [SELF("taunt"), B(0, per="incoming", k=0.5, max=20), STRESS(2)],
     "Taunt. Gain Block equal to half the damage the foes mean to deal this round, up to 20. Gain 2 stress.",
     arch=SB + "+" + IW,
     flavour="All of it. Send all of it to me.",
     note="Every foe in the throne room turns its weapon on the Bulwark at once.",
     up={"text": "Taunt. Gain 4 Block, plus half the damage the foes mean to deal this round, up to 24. Gain 2 stress.",
         "fx": [SELF("taunt"), B(4, per="incoming", k=0.5, max=24), STRESS(2)]})
card("bw_vengeance", "Vengeance", 2, "R", "enemy", [D(3, per="scars", k=1, max=30), GRIT(1, to="self", if_="killed")],
     "Deal 3, plus 1 for each Scar, up to 30. If this kills the target, gain 1 Grit.", arch=SB,
     flavour="He keeps a tally on the door. This is where he settles it.",
     note="Beside the kill tally scratched into the planks, the Bulwark's mace falls on a ruler's guard.",
     up={"text": "Deal 7, plus 1 for each Scar, up to 34. If this kills the target, gain 1 Grit.",
         "fx": [D(7, per="scars", k=1, max=34), GRIT(1, to="self", if_="killed")]})
card("bw_deep_winter", "Deep Winter", 2, "R", "self", [B(9), SELF("fortify"), A("frost", 3, to="attackers"), BANK(2)],
     "Gain 9 Block. Fortify. Apply 3 Frost to each foe that means to strike you. Bank 2.", use=ALL, cat="frost",
     attr="stable", arch=IW,
     flavour="The northern chapel stood in snow to its eaves, and the door still held.",
     note="Snow drifts against the Ironwarden's door as the foes before it slow to a crawl.",
     up={"text": "Gain 12 Block. Fortify. Apply 4 Frost to each foe that means to strike you. Bank 2.",
         "fx": [B(12), SELF("fortify"), A("frost", 4, to="attackers"), BANK(2)]})
card("bw_shatterguard", "Shatterguard", 2, "R", "enemy",
     [D(0, per="block", max=20), D(0, per="t.frost", k=3, max=15), CONS(s="block", to="self")],
     "Deal damage equal to your Block, up to 20. Hit it again for 3 per Frost on it, up to 15. Lose all your Block.",
     arch=IW,
     flavour="The wall comes down on you. All of the winter with it.",
     note="The Ironwarden brings the ice-thick door down on a frozen foe and both shatter white.",
     up={"text": "Deal damage equal to your Block, up to 20. Hit it again for 4 per Frost on it, up to 20. Lose all "
                 "your Block.",
         "fx": [D(0, per="block", max=20), D(0, per="t.frost", k=4, max=20), CONS(s="block", to="self")]})
card("bw_frozen_bulwark", "Frozen Bulwark", 1, "R", "all_allies", [B(0, per="total_frost", k=1, max=10)],
     "Every hero gains 1 Block for each Frost on all foes, up to 10.", use=ALL, cat="frost", arch=IW,
     flavour="The cold on them is a wall around us.",
     note="A ring of frost spreads from the Ironwarden's feet and rimes the company's shields.",
     up={"text": "Every hero gains 2 Block, plus 1 for each Frost on all foes, up to 12.",
         "fx": [B(2, per="total_frost", k=1, max=12)]})
card("bw_iron_maiden", "Iron Maiden", 1, "R", "self", [SELF("thorns", 3, per="total_bleed", k=0.5)],
     "Gain 3 Thorns, plus 1 for every 2 Bleed on all foes.", use=ALL, arch=TG + "+duelist_bleed",
     flavour="He has made himself into the thing they lock sinners in. Their blood feeds it.",
     note="The Thornguard closes his barbed arms around himself; spikes stand from every plate.",
     up={"text": "Gain 5 Thorns, plus 1 for every 2 Bleed on all foes.",
         "fx": [SELF("thorns", 5, per="total_bleed", k=0.5)]})
card("bw_rose_of_iron", "Rose of Iron", 0, "R", "self", [SELFDMG(1), DBL(s="thorns", to="self")],
     "Lose 1 HP. Double your Thorns. Exhaust.", use=ALL, kw=["Exhaust"], arch=TG,
     flavour="It blooms where he bleeds.",
     note="New barbs split open along the Thornguard's arms like iron petals.",
     up={"text": "Double your Thorns. Exhaust.", "fx": [DBL(s="thorns", to="self")]})
card("bw_hedge_of_spikes", "Hedge of Spikes", 2, "R", "all_allies", [ST("thorns", 3), B(2)],
     "Every hero gains 3 Thorns and 2 Block.",
     use=ALL, arch=TG,
     flavour="He hands out penance like bread. Everyone gets some.",
     note="The Thornguard lashes barbed cord around the whole company's arms in the nave.",
     up={"text": "Every hero gains 4 Thorns and 3 Block.", "fx": [ST("thorns", 4), B(3)]})
card("bw_aegis_of_the_door", "Aegis of the Door", 2, "R", "all_allies", [W(2), B(5)],
     "Every hero gains 2 Ward and 5 Block. Exhaust.", use=ALL, kw=["Exhaust"], arch="core",
     flavour="It was a church door before it was a shield. It remembers.",
     note="The church door stands upright in the nave and its keyhole plate glows faintly over the company.",
     up={"text": "Every hero gains 3 Ward and 7 Block. Exhaust.", "fx": [W(3), B(7)]})
card("bw_vanguard", "Vanguard", 1, "R", "self", [FRONT(), SELF("taunt"), B(3), PRIME(2, if_="first")],
     "Move to rank 1. Taunt. Gain 3 Block. First in the Ordo: Prime 2.",
     use=ALL, arch="core",
     flavour="Whatever pushed him back, he walks back through it.",
     note="The Bulwark wades back to the front of the line through the brine grotto's shallows.",
     up={"text": "Move to rank 1. Taunt. Gain 6 Block. First in the Ordo: Prime 3.",
         "fx": [FRONT(), SELF("taunt"), B(6), PRIME(3, if_="first")]})
card("bw_the_door_swings", "The Door Swings", 2, "R", "enemy", [D(8, per="t.armor", k=2), ST("stun")],
     "Deal 8, plus 2 for each Armor on the target. Stun the target. Exhaust.", kw=["Exhaust"], arch="core",
     flavour="A door opens both ways. This way hurts, and the heavier you are, the worse.",
     note="The Bulwark swings the whole church door on its hinge side into an armoured foe's face.",
     up={"text": "Deal 11, plus 2 for each Armor on the target. Stun the target. Exhaust.",
         "fx": [D(11, per="t.armor", k=2), ST("stun")]})

# ------------------------------------------------------------------ path: Last Bastion
card("bw_deathless", "Deathless", 2, "X", "self", [B(4, per="scars", k=1, max=30), SELF("fortify", 1, if_="dd")],
     "Gain 4 Block, plus 1 for each Scar, up to 30. At Death's Door, Fortify.",
     use=ALL, sub=SB, arch=SB + "+" + IW,
     flavour="Lead in the plate and rope round the door. Still here.",
     note="The Last Bastion, roped door and lead-patched plate, stands in a ring of fallen foes.",
     up={"text": "Gain 4 Block, plus 1 for each Scar, up to 30. At Death's Door, Fortify.", "cost": 1})
card("bw_patched_with_lead", "Patched with Lead", 1, "X", "self", [AR(1), AR(1, if_="scars>=15")],
     "Gain 1 Armor for the fight. If you have 15 or more Scars, gain 1 more. Exhaust.", use=ALL, kw=["Exhaust"],
     sub=SB, arch=SB,
     flavour="Where the plate broke, he poured lead. Where he broke, he did the same.",
     note="The Last Bastion hammers a lead patch over a fresh breach in his breastplate.",
     up={"text": "Gain 1 Armor for the fight. If you have 10 or more Scars, gain 1 more. Exhaust.",
         "fx": [AR(1), AR(1, if_="scars>=10")]})
card("bw_bound_with_rope", "Bound with Rope", 1, "X", "self", [H(3), B(2, per="vigour_left", k=1, max=5)],
     "Heal 3. Gain 2 Block, plus 1 per vigour left unspent, up to 5.", use=ALL, sub=SB,
     arch=SB,
     flavour="Rope for the door, linen for the man. Both hold, mostly.",
     note="The Last Bastion lashes the cracked door together with rope between blows.",
     up={"text": "Heal 5. Gain 3 Block, plus 1 per vigour left unspent, up to 7.",
         "fx": [H(5), B(3, per="vigour_left", k=1, max=7)]})
card("bw_still_here", "Still Here", 1, "X", "self",
     [B(5), GRIT(1, if_="dd"), ST("thrift", 1, to="allies_other", if_="dd")],
     "Gain 5 Block. At Death's Door, gain 1 Grit, and every other hero gains 1 Thrift. Exhaust.", use=ALL,
     kw=["Exhaust"], sub=SB, arch=SB,
     flavour="Sister Wenna gave him a week. That was eleven doors ago.",
     note="The Last Bastion, on his feet with no right to be, raises the roped door again.",
     up={"text": "Gain 8 Block. At Death's Door, gain 1 Grit, and every other hero gains 1 Thrift. Exhaust.",
         "fx": [B(8), GRIT(1, if_="dd"), ST("thrift", 1, to="allies_other", if_="dd")]})
card("bw_come_and_finish_it", "Come and Finish It", 1, "X", "enemy", [D(0, per="scars", k=0.34), SELF("taunt")],
     "Deal 1 for every 3 Scars. Taunt.", sub=SB, arch=SB,
     flavour="You have nearly killed him. Nearly is the worst place to stop.",
     note="Blood running from the helm's slit, the Last Bastion beckons the ruler on with the mace.",
     up={"text": "Deal 1 for every 2 Scars. Taunt.", "fx": [D(0, per="scars", k=0.5), SELF("taunt")]})
card("bw_defiance", "Defiance", 1, "X", "self", [STRESS(0, per="scars", k=-0.5), SELF("might", 1, if_="dd")],
     "Shed 1 stress for every 2 Scars, rounded up. At Death's Door, gain 1 Might.", use=ALL, sub=SB, arch=SB,
     flavour="Pain is only the body's argument. He stopped listening at the tower.",
     note="The Last Bastion laughs behind his split helm as blood pools at his feet.",
     up={"text": "Shed 1 stress for each Scar. At Death's Door, gain 1 Might.",
         "fx": [STRESS(0, per="scars", k=-1), SELF("might", 1, if_="dd")]})

# ------------------------------------------------------------------ path: Ironwarden
card("bw_pine_and_iron", "Pine and Iron", 2, "X", "self",
     [B(8, per="vigour_left", k=1, max=11), SELF("fortify"), A("frost", 1, to="all_enemies")],
     "Gain 8 Block, plus 1 per vigour left unspent, up to 11. Fortify. Apply 1 Frost to every foe.", use=ALL,
     cat="frost", attr="stable", sub=IW, arch=IW,
     flavour="The northern chapel's door: iron-bound pine, and colder than the snow it kept out.",
     note="The Ironwarden sets the iron-bound pine door down and frost runs out across the floor.",
     up={"text": "Gain 8 Block, plus 1 per vigour left unspent, up to 11. Fortify. Apply 1 Frost to every foe.",
         "cost": 1})
card("bw_frostbite_bash", "Frostbite Bash", 1, "X", "enemy",
     [D(5), A("frost", 2, attr="stable"), A("frost", 1, attr="stable", if_="t.water")],
     "Deal 5. Apply 2 Frost, and 1 more if the target has Soak.", sub=IW, arch=IW + "+elementalist_water",
     flavour="The frost in his beard is on the mace now. Soon it is in you.",
     note="The Ironwarden's rimed mace strikes and frost blooms across the foe's face.",
     up={"text": "Deal 7. Apply 3 Frost, and 1 more if the target has Soak.",
         "fx": [D(7), A("frost", 3, attr="stable"), A("frost", 1, attr="stable", if_="t.water")]})
card("bw_shatter_the_line", "Shatter the Line", 2, "X", "all_enemies",
     [D(3, per="t.frost", k=1), A("frost", 1, attr="stable", if_="last")],
     "Deal 3 to every foe, plus 1 for each Frost on it. Last in the Ordo: then apply 1 Frost to every foe.", hit=ALL,
     sub=IW, arch=IW,
     flavour="Cold makes a line of foes into a line of glass.",
     note="The Ironwarden sweeps the door across the frozen front rank and ice flies.",
     up={"text": "Deal 5 to every foe, plus 1 for each Frost on it. Last in the Ordo: then apply 1 Frost to every foe.",
         "fx": [D(5, per="t.frost", k=1), A("frost", 1, attr="stable", if_="last")]})
card("bw_fur_mantle", "Fur Mantle", 1, "X", "self", [B(4), W(2), SELF("fortify")], "Gain 4 Block and 2 Ward. Fortify.",
     use=ALL, cat="frost", sub=IW, arch=IW,
     flavour="The north gave him the mantle and the cold under it.",
     note="The Ironwarden pulls the fur mantle tight over his rimed windward shoulder.",
     up={"text": "Gain 6 Block and 2 Ward. Fortify.", "fx": [B(6), W(2), SELF("fortify")]})
card("bw_breath_of_the_north", "Breath of the North", 1, "X", "self", [A("frost", 3, to="attackers"), B(3)],
     "Apply 3 Frost to each foe that means to strike you. Gain 3 Block.", use=ALL, cat="frost", attr="stable", sub=IW, arch=IW,
     flavour="He breathes out. Whatever raised a hand to him feels it in the bone.",
     note="The Ironwarden's breath smokes white through the helm slit; the foes facing him rime over.",
     up={"text": "Apply 4 Frost to each foe that means to strike you. Gain 4 Block.",
         "fx": [A("frost", 4, to="attackers"), B(4)]})
card("bw_windbreak", "Windbreak", 1, "X", "ally_other", [GUARD(), A("frost", 1, to="all_enemies", if_="t.attacking")],
     "Guard another hero this round. Apply 1 Frost to every foe that means to attack.", use=COVER, cat="frost",
     attr="stable", sub=IW, arch=IW,
     flavour="Behind him the wind drops. In front of him it bites.",
     note="The Ironwarden stands his door before the Oracle as a gale of frost meets the foes.",
     up={"text": "Guard another hero this round. Apply 2 Frost to every foe that means to attack.",
         "fx": [GUARD(), A("frost", 2, to="all_enemies", if_="t.attacking")]})

# ------------------------------------------------------------------ path: Thornguard
card("bw_briar_mail", "Briar Mail", 1, "X", "self", [SELF("thorns", 3), B(3), SELF("thorns", 2, if_="handoff")],
     "Gain 3 Thorns and 3 Block. Handoff: gain 2 more Thorns.", use=ALL,
     sub=TG, arch=TG,
     flavour="Barbs out, hair shirt in. Penance on both sides of the plate.",
     note="The Thornguard's penitent armour, barbs welded outward, catches the torchlight.",
     up={"text": "Gain 4 Thorns and 4 Block. Handoff: gain 3 more Thorns.",
         "fx": [SELF("thorns", 4), B(4), SELF("thorns", 3, if_="handoff")]})
card("bw_barbed_haft", "Barbed Haft", 1, "X", "enemy", [D(0, per="thorns", k=1, times=2), ST("bleed", 1, if_="t.bleed")],
     "Deal damage equal to your Thorns, twice. If the target has Bleed, apply 1 more Bleed.", sub=TG,
     arch=TG + "+duelist_bleed",
     flavour="He wrapped the mace haft in barbed wire. His palms remember.",
     note="The Thornguard's wire-wrapped mace strikes twice, the second blow tearing.",
     up={"text": "Deal 1, plus your Thorns, twice. If the target has Bleed, apply 2 more Bleed.",
         "fx": [D(1, per="thorns", k=1, times=2), ST("bleed", 2, if_="t.bleed")]})
card("bw_welded_barbs", "Welded Barbs", 1, "X", "self", [SELFDMG(4), SELF("thorns", 8)], "Lose 4 HP. Gain 8 Thorns.",
     use=ALL, sub=TG, arch=TG,
     flavour="Mother Hild welded the first barb. He did the rest, still wearing the plate.",
     note="Sparks fly as the Thornguard welds a new barb to his arm, the plate still on him.",
     up={"text": "Lose 2 HP. Gain 8 Thorns.", "fx": [SELFDMG(2), SELF("thorns", 8)]})
card("bw_scourged_back", "Scourged Back", 1, "X", "self", [SELF("thorns", 2, per="scars", k=0.34)],
     "Gain 2 Thorns, plus 1 for every 3 Scars.", use=ALL, sub=TG, arch=TG + "+" + SB,
     flavour="His back is a ledger of penance. Every line of it bites.",
     note="Through the torn gambeson, the Thornguard's scourged back is a lattice of old cuts.",
     up={"text": "Gain 4 Thorns, plus 1 for every 3 Scars.", "fx": [SELF("thorns", 4, per="scars", k=0.34)]})
card("bw_punishing_wall", "Punishing Wall", 2, "X", "self", [SELF("taunt"), B(6), SELF("thorns", 5)],
     "Taunt. Gain 6 Block and 5 Thorns.", sub=TG, arch=TG,
     flavour="Strike the door if you must. It was made for sinners.",
     note="The barbed door fills the nave's aisle and every foe turns on it.",
     up={"text": "Taunt. Gain 6 Block and 5 Thorns.", "cost": 1})
card("bw_barbed_shove", "Barbed Shove", 1, "X", "enemy", [D(4), PUSH(1), SELF("thorns", 2)],
     "Deal 4. Push the target back 1. Gain 2 Thorns.", use=[1], hit=[1], sub=TG, arch=TG,
     flavour="Back. Back, and take some of the barbs with you.",
     note="The Thornguard drives the spiked door forward and the front foe stumbles back.",
     up={"text": "Deal 5. Push the target back 1. Gain 3 Thorns.", "fx": [D(5), PUSH(1), SELF("thorns", 3)]})

# ------------------------------------------------------------------ legendary (win conditions, not budgeted)
card("bw_the_door_does_not_fall", "The Door Does Not Fall", 1, "L", "self", [GRIT(1)],
     "Gain 1 Grit. Rite: the first two times each round a foe strikes you while you are at Death's Door, gain 1 "
     "Might and 4 Block. Exhaust.",
     use=ALL, kw=["Rite", "Exhaust"], sub=SB, arch=SB,
     rite={"on": "hit", "if": "dd", "per_round": 2, "fx": [SELF("might", 1), B(4, to="self")]},
     flavour="The tower fell. The door did not. It never will again.",
     note="At the throne's foot the Last Bastion stands with no HP left, door raised, and the ruler hesitates.",
     up={"text": "Gain 1 Grit and 8 Block. Rite: the first two times each round a foe strikes you while you are "
                 "at Death's Door, gain 1 Might and 4 Block. Exhaust.",
         "fx": [GRIT(1), B(8)]})
card("bw_the_ledger_of_wounds", "The Ledger of Wounds", 2, "L", "enemy",
     [D(0, per="scars", k=2, max=60), EN(2, if_="killed")],
     "Retain. Deal 2 for each Scar, up to 60. If this kills the target, +2 vigour next round. Exhaust.",
     kw=["Retain", "Exhaust"], sub=SB, arch=SB,
     flavour="Brother Lucan writes down every death. He keeps the other ledger, and it is due.",
     note="The Last Bastion swings once, and every scar on the door's planks seems to open with the blow.",
     up={"text": "Retain. Deal 2 for each Scar, up to 60. Gain 1 Block for each Scar, up to 30. If this kills the "
                 "target, +2 vigour next round. Exhaust.",
         "fx": [D(0, per="scars", k=2, max=60), B(0, to="self", per="scars", k=1, max=30), EN(2, if_="killed")]})
card("bw_winter_without_end", "Winter Without End", 2, "L", "self", [B(8), SELF("fortify"), BANK(2)],
     "Gain 8 Block. Fortify. Bank 2. Rite: at the start of each round, Fortify and gain 1 Block for each Frost on all "
     "foes, up to 12. Exhaust.",
     use=ALL, cat="frost", kw=["Rite", "Exhaust"], sub=IW, arch=IW,
     rite={"on": "round_start", "fx": [SELF("fortify"), B(0, to="self", per="total_frost", k=1, max=12)]},
     flavour="Spring does not come to the northern chapel. He brought the winter with him.",
     note="The Ironwarden's door is a cliff of blue ice; the foes before it are rimed to the knee.",
     up={"text": "Gain 8 Block. Fortify. Bank 2. Apply 1 Frost to every foe. Rite: at the start of each round, "
                 "Fortify and gain 1 Block for each Frost on all foes, up to 12. Exhaust.",
         "fx": [B(8), SELF("fortify"), BANK(2), A("frost", 1, attr="stable", to="all_enemies")]})
card("bw_the_long_night", "The Long Night", 1, "L", "self", [B(5), A("frost", 1, attr="stable", to="attackers")],
     "Gain 5 Block. Apply 1 Frost to each foe that means to strike you. Rite: each time a foe strikes you, apply 1 "
     "Frost to it; then, if it has 4 or more Frost, apply 1 Volatile Water to it. Exhaust.",
     use=ALL, cat="frost", kw=["Rite", "Exhaust"], sub=IW, arch=IW,
     rite={"on": "hit", "fx": [A("frost", 1, attr="stable"), A("water", 1, attr="volatile", if_="t.frost>=4")]},
     flavour="The night in the north lasts half the year. Whatever strikes him stays in it.",
     note="One by one the foes that struck the Ironwarden stand frozen solid before his door.",
     up={"text": "Gain 5 Block. Fortify. Apply 1 Frost to each foe that means to strike you. Rite: each time a foe "
                 "strikes you, apply 1 Frost to it; then, if it has 4 or more Frost, apply 1 Volatile Water to it. "
                 "Exhaust.",
         "fx": [B(5), SELF("fortify"), A("frost", 1, attr="stable", to="attackers")]})
card("bw_crown_of_iron_thorns", "Crown of Iron Thorns", 1, "L", "self", [SELF("thorns", 4), ST("thorns", 1, to="allies_other")],
     "Gain 4 Thorns. Every other hero gains 1 Thorns. Rite: each time a foe strikes another hero, deal damage equal "
     "to your Thorns to it. Exhaust.",
     use=ALL, kw=["Rite", "Exhaust"], sub=TG, arch=TG,
     rite={"on": "ally_hit", "fx": [D(0, per="thorns", k=1)]},
     flavour="He wears the crown for all of them. Strike any one of them and it bites.",
     note="A crown of welded barbs sits on the Thornguard's helm; a foe that struck the Duelist reels, torn.",
     up={"text": "Gain 6 Thorns. Every other hero gains 2 Thorns. Rite: each time a foe strikes another hero, deal "
                 "damage equal to your Thorns to it. Exhaust.",
         "fx": [SELF("thorns", 6), ST("thorns", 2, to="allies_other")]})
card("bw_the_scourged_hand", "The Scourged Hand", 1, "L", "self", [SELF("thorns", 5)],
     "Gain 5 Thorns. Rite: each time you play a card on a foe that means to attack, deal damage equal to your Thorns "
     "to it. Exhaust.",
     use=ALL, kw=["Rite", "Exhaust"], sub=TG, arch=TG,
     rite={"on": "play", "if": "t.attacking", "fx": [D(0, per="thorns", k=1)]},
     flavour="Penance was the wound. Now it is the weapon.",
     note="The Thornguard's mace hand, wrapped in barbed cord to the elbow, comes down bloody.",
     up={"text": "Gain 5 Thorns and 6 Block. Rite: each time you play a card on a foe that means to attack, deal "
                 "damage equal to your Thorns to it. Exhaust.",
         "fx": [SELF("thorns", 5), B(6)]})

# ------------------------------------------------------------------ hero
HERO = {"name": "Bulwark", "hp": 48, "armor": 2, "grit": 3, "color": "7f9cc6", "kit": ["bw_k_bar_the_door"],
        "deck": ["bw_brace", "bw_brace", "bw_brace", "bw_mace_blow", "bw_mace_blow", "bw_mace_blow", "bw_interpose", "bw_interpose",
                 "bw_hold_the_line", "bw_over_the_rim"],
        "subclasses": {SB: "Last Bastion", IW: "Ironwarden", TG: "Thornguard"},
        "blurb": "The Iron Vow. A church door for a shield: he stands where the blow is going, covers the company "
                 "with Guard and Taunt, and makes every blow cost the foe."}

# Each archetype's six key cards for the build-aware simulator (all common or uncommon).
ARCHETYPES = {
    SB: ["bw_draw_their_eyes", "bw_scar_tissue", "bw_toll_of_the_tower", "bw_blood_for_iron", "bw_still_standing", "bw_unbroken"],
    IW: ["bw_rime_coat", "bw_hold_through_the_night", "bw_hoarfrost_blow", "bw_cold_iron", "bw_break_the_ice", "bw_brittle"],
    TG: ["bw_barbed_plate", "bw_hair_shirt", "bw_come_and_take_it", "bw_penitents_blow", "bw_spiked_boss", "bw_rake_of_thorns"],
}

NEEDS = [
    "bw_the_scourged_hand: the brief's 'his Thorns no longer fall' needs a way to stop the round-end Thorns halving, "
    "and a 'play' rite filter for attack cards; the rite fires on any card played on a foe that means to attack.",
    "bw_the_long_night: a direct 'Freeze the target' effect at a Frost threshold. Written as 1 Volatile Water at 4 Frost, "
    "which sets off the Freeze Conjunction with the Frost already on the foe.",
    "budget.py: Thrift falls to the default 1.5 points a stack, though a stack is worth about a vigour (5 to 6), and Bank "
    "to 1 a point. Bleed for Them and Still Here keep their Thrift behind a condition so they are not overpriced in play.",
    "budget.py: an X cost (-1) gives a negative target, so every X card is flagged. Wanted one Ironwarden X card ('Gain "
    "4 Block per X; at X 4 or more, also Fortify'); not written.",
    "Self-harm stops at 1 HP, so Hair Shirt, Scourge, Welded Barbs and Flagellant's Cord cost nothing at 1 HP or at "
    "Death's Door. Bleed for Them gates its Thrift on 'hp>=5'. Wanted: a quantity for HP actually lost by this card.",
    "bw_k_bar_the_door: 'targeted' reads intents as aimed, so a foe a Taunt has pulled onto him still counts as meaning "
    "to strike the ally.",
]
