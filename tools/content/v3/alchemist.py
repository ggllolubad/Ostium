"""Alchemist, the Brewer: Gate 3 card set and the company's flasks (brief: docs/design/gate2/calling_alchemist.md).

Archetypes (arch keys match the path keys):
  transmuter    Reagents: Stable Fire and Water laid on foes, turned into the course that completes a Conjunction,
                then set off. Payoffs read Conjunctions this round, Spectrum and the stacks a card consumes.
  plaguewright  Contagion: Toxin on a foe and its neighbours, spread and ripened. Two payoffs: Combust from a
                Volatile Fire, and damage per Toxin.
  apothecary    Full Belt: brewed and refilled flasks for the whole company. Payoffs: Dosed cards (a flask used
                this round) and Improved flasks.
Hybrids: Putrefaction, Fen Water, Flash Pan and Miasmatic Cloud join Transmuter and Plaguewright; Rectify,
Quintessence and Catalytic Still join Transmuter and Apothecary; Leech Jar and Draw the Venom join Plaguewright
and Apothecary.

Flasks (rarity F) live on the company belt: any hero uses one for no vigour, at most one per hero per round
(DECISIONS row 8). Brewed and refilled copies are Fresh and spoil at fight end."""
from dsl import *

set_class("alchemist", [2, 3, 4], [1, 2, 3, 4])
ALL = [1, 2, 3, 4]
FRONT2 = [1, 2]
F, FR, LI, WA, T, V = "fire", "frost", "lightning", "water", "toxin", "void"
TR, PW, AP = "transmuter", "plaguewright", "apothecary"
FK = ["Flask", "Exhaust"]
RITE = ["Rite", "Exhaust"]
DOSED = "flasks_used"
FRONT = "t.rank<=2"

# ------------------------------------------------------------------ flasks (belt items; 0 cost, Exhaust, never in card rewards)
# Basic brewed flasks (the brief's fire pot, brine jar and plain draught)
card("fl_firepot", "Fire Pot", 0, "F", "enemy", [D(3), A(F, 2, attr="stable")], "Deal 3. Apply 2 Fire. Exhaust.",
     use=ALL, hit=ALL, cat=F, attr="stable", kw=FK, flask=True, arch=TR,
     flavour="Pitch in a clay pot, a lit rag for a cork.",
     note="A hero takes a smoking clay pot from the belt and lobs it at a drowned thrall on the stair.",
     up={"text": "Deal 4. Apply 3 Fire. Exhaust.", "fx": [D(4), A(F, 3, attr="stable")]})
card("fl_brinejar", "Brine Jar", 0, "F", "enemy", [A(WA, 3, attr="stable"), A(WA, 1, attr="stable", to="adjacent")],
     "Apply 3 Water to the target and 1 to the foes beside it. Exhaust.",
     use=ALL, hit=ALL, cat=WA, attr="stable", kw=FK, flask=True, arch=TR,
     flavour="Sea salt boiled down in the abbey kitchen. It clings.",
     note="A waxed jar bursts on a crab's shell in the brine grotto, spraying its neighbours.",
     up={"text": "Apply 4 Water to the target and 2 to the foes beside it. Exhaust.",
         "fx": [A(WA, 4, attr="stable"), A(WA, 2, attr="stable", to="adjacent")]})
card("fl_draught", "Plain Draught", 0, "F", "ally", [H(3), STRESS(-3)], "A hero heals 3 and sheds 3 stress. Exhaust.",
     use=ALL, kw=FK, flask=True, arch=AP,
     flavour="Small beer, honey and willow bark. It does what it can.",
     note="The Duelist uncorks a plain brown bottle from the belt and drinks without looking away from the foe.",
     up={"text": "A hero heals 4 and sheds 5 stress. Exhaust.", "fx": [H(4), STRESS(-5)]})
# The ten run flasks (shop, provisions), rebalanced for brewing
card("fl_fire", "Fire Flask", 0, "F", "enemy", [A(F, 4, attr="stable")], "Apply 4 Fire. Exhaust.",
     use=ALL, hit=ALL, cat=F, attr="stable", kw=FK, flask=True, arch=TR,
     flavour="Amber glass, warm to the touch even when the fire is out.",
     note="An amber flask shatters on a barnacle knight's helm and runs burning down the plate.",
     up={"text": "Deal 2. Apply 5 Fire. Exhaust.", "fx": [D(2), A(F, 5, attr="stable")]})
card("fl_brine", "Brine Flask", 0, "F", "enemy", [A(WA, 4, attr="stable")], "Apply 4 Water. Exhaust.",
     use=ALL, hit=ALL, cat=WA, attr="stable", kw=FK, flask=True, arch=TR,
     flavour="Drawn from the Drowned Kingdom's own tide. It remembers.",
     note="A green bottle of seawater breaks over an eelkin in the nave and soaks it through.",
     up={"text": "Apply 6 Water. Exhaust.", "fx": [A(WA, 6, attr="stable")]})
card("fl_heal", "Healing Draught", 0, "F", "ally", [H(4)], "A hero heals 4. Exhaust.",
     use=ALL, kw=FK, flask=True, arch=AP,
     flavour="Sister Wenna's recipe. She will not say what is in it.",
     note="The Bulwark lifts his helm an inch and drinks a red draught from the belt.",
     up={"text": "A hero heals 6. Exhaust.", "fx": [H(6)]})
card("fl_salts", "Smelling Salts", 0, "F", "ally", [STRESS(-10)], "A hero sheds 10 stress. Exhaust.",
     use=ALL, kw=FK, flask=True, arch=AP,
     flavour="Hartshorn and vinegar. Nobody faints twice.",
     note="The Alchemist holds a small open vial under the Oracle's nose in the dark ossuary.",
     up={"text": "A hero sheds 14 stress. Exhaust.", "fx": [STRESS(-14)]})
card("fl_acid", "Acid Flask", 0, "F", "enemy", [A(T, 4, attr="stable")], "Apply 4 Toxin. Exhaust.",
     use=ALL, hit=ALL, cat=T, attr="stable", kw=FK, flask=True, arch=PW,
     flavour="Green vitriol. Keep the cork waxed and the flask upright.",
     note="A green flask smokes as it eats into an anchor brute's chain mail.",
     up={"text": "Apply 5 Toxin. The target loses 1 Armor. Exhaust.",
         "fx": [A(T, 5, attr="stable"), AR(-1, to="target")]})
card("fl_blast", "Blasting Powder", 0, "F", "all_enemies", [D(3, if_=FRONT)],
     "Deal 3 to each foe in ranks 1 and 2. Exhaust.", use=ALL, hit=FRONT2, kw=FK, flask=True, arch="core",
     flavour="Saltpetre, charcoal and sulphur, packed tight. Throw it far.",
     note="A powder flask bursts between two hooklines at the front, throwing them apart.",
     up={"text": "Deal 4 to each foe in ranks 1 and 2. Exhaust.", "fx": [D(4, if_=FRONT)]})
card("fl_frost", "Frost Phial", 0, "F", "enemy", [A(FR, 4, attr="stable")], "Apply 4 Frost. Exhaust.",
     use=ALL, hit=ALL, cat=FR, attr="stable", kw=FK, flask=True, arch=TR,
     flavour="Packed in snow from the Icebound Fleet. Frost blooms on the glass.",
     note="A pale blue phial cracks on a siren and rime spreads across her scales.",
     up={"text": "Apply 6 Frost. Exhaust.", "fx": [A(FR, 6, attr="stable")]})
card("fl_iron", "Ironbark Tincture", 0, "F", "ally", [B(6)], "A hero gains 6 Block. Exhaust.",
     use=ALL, kw=FK, flask=True, arch=AP,
     flavour="Oak bark steeped in iron water. It tastes like a door.",
     note="The Bulwark drinks a dark tincture and sets his feet behind the church door.",
     up={"text": "A hero gains 8 Block. Exhaust.", "fx": [B(8)]})
card("fl_rage", "Bloodrage Draught", 0, "F", "ally", [ST("empower", 3)],
     "A hero gains Empower 3. Exhaust.", use=ALL, kw=FK, flask=True, arch=AP,
     flavour="Red wine, black pepper and something from a bull. It burns going down.",
     note="The Duelist throws back a red draught and grins, sword already lifting.",
     up={"text": "A hero gains Empower 4. Exhaust.", "fx": [ST("empower", 4)]})
card("fl_steam", "Steam Flask", 0, "F", "enemy", [A(WA, 2, attr="stable"), A(F, 2, attr="stable")],
     "Apply 2 Water and 2 Fire. Exhaust.", use=ALL, hit=ALL, cat=F, attr="stable", kw=FK, flask=True,
     arch=TR, flavour="Two chambers and a wax wall between them. Do not shake it.",
     note="A double flask breaks on a bloated foe, soaking it in hot brine and burning oil at once.",
     up={"text": "Apply 3 Water and 2 Fire. Exhaust.",
         "fx": [A(WA, 3, attr="stable"), A(F, 2, attr="stable")]})
# Flasks that cards brew
card("fl_haste", "Haste Draught", 0, "F", "ally", [ST("momentum", 3)], "A hero gains 3 Momentum. Exhaust.",
     use=ALL, kw=FK, flask=True, arch=AP,
     flavour="Strong coffee from the south and a pinch of something worse.",
     note="The Bladedancer bites the cork out of a small flask mid-step.",
     up={"text": "A hero gains 4 Momentum. Exhaust.", "fx": [ST("momentum", 4)]})
card("fl_focus", "Clarity Draught", 0, "F", "ally", [ST("focus", 5)], "A hero gains 5 Focus. Exhaust.",
     use=ALL, kw=FK, flask=True, arch=TR,
     flavour="Rosemary and cold water. The scholars drink it by the jug.",
     note="The Elementalist sips a clear flask, stained fingers steady on the glass.",
     up={"text": "A hero gains 7 Focus. Exhaust.", "fx": [ST("focus", 7)]})
card("fl_simple", "Garden Simple", 0, "F", "ally", [H(2), B(2), STRESS(-2)], "A hero heals 2, gains 2 Block and sheds 2 stress. Exhaust.",
     use=ALL, kw=FK, flask=True, arch=AP,
     flavour="One herb, one use. Simples are what the garden gives.",
     note="A small green bottle tied with a sprig of sage hangs from the Apothecary's belt.",
     up={"text": "A hero heals 3, gains 3 Block and sheds 3 stress. Exhaust.", "fx": [H(3), B(3), STRESS(-3)]})

# ------------------------------------------------------------------ kit
card("al_brew", "Brew", 1, "K", "self",
     [BREW("fl_firepot", if_="!ally_hurt"), BREW("fl_draught", if_="ally_hurt")],
     "Brew a Fire Pot, or a Plain Draught if another hero is below half HP.", use=ALL, arch="core",
     flavour="The still-coil on the back is never quite cold.",
     note="The Alchemist kneels at rank 4 and decants a bubbling coil into a fresh bottle.",
     up={"text": "Brew a Fire Pot, or a Plain Draught if another hero is below half HP. Gain 2 Block.",
         "fx": [BREW("fl_firepot", if_="!ally_hurt"), BREW("fl_draught", if_="ally_hurt"), B(2)]})
card("al_transmute", "Transmute", 1, "K", "enemy", [D(3), CONV(F, FR)],
     "Deal 3. Turn all Fire on the target into Frost.", cat=FR, sub=TR, arch=TR,
     flavour="Quench the burning thing and it hardens. Iron knows this. So do foes.",
     note="The Transmuter swings a crucible on its chain and the fire on a thrall goes white with frost.",
     up={"text": "Deal 5. Turn all Fire on the target into Frost.", "fx": [D(5), CONV(F, FR)]})
card("al_lance_the_boil", "Lance the Boil", 1, "K", "enemy", [D(2), SPREAD(T, 1)],
     "Deal 2. Copy 1 of the target's Toxin onto each foe beside it.", cat=T, sub=PW, arch=PW,
     flavour="What is let out must go somewhere.",
     note="The Plaguewright jabs the pointer cane into a swollen foe; green mist leaks to its neighbours.",
     up={"text": "Deal 3. Copy up to 2 of the target's Toxin onto each foe beside it.", "fx": [D(3), SPREAD(T, 2)]})
card("al_refill", "Refill", 1, "K", "self", [REFILL(1)], "Refill 1 flask.",
     use=ALL, sub=AP, arch=AP,
     flavour="Rinse, steep, cork, wax. The hands know it in the dark.",
     note="The Apothecary refills an empty bottle from a herb-stuffed jar at the back of the line.",
     up={"text": "Refill 1 flask. Gain 3 Block.", "fx": [REFILL(1), B(3)]})

# ------------------------------------------------------------------ starters (deck: 3 Hurled Pitch, 2 Brine Splash,
# 2 Quicklime, 2 Clean Linen, 1 Decant)
card("al_hurled_pitch", "Hurled Pitch", 1, "S", "enemy", [D(4), A(F, 1, attr="stable")], "Deal 4. Apply 1 Fire.",
     cat=F, attr="stable", arch=TR,
     flavour="Pitch, a rag and a steady arm. The rest is aim.",
     note="An overarm throw from rank 3: a burning pot arcs over the Bulwark's door at a thrall.",
     up={"text": "Deal 5. Apply 2 Fire.", "fx": [D(5), A(F, 2, attr="stable")]})
card("al_brine_splash", "Brine Splash", 1, "S", "enemy",
     [D(2), A(WA, 2, attr="stable"), A(WA, 1, attr="stable", to="adjacent")],
     "Deal 2. Apply 2 Water to the target and 1 to the foes beside it.", cat=WA, attr="stable", arch=TR,
     flavour="Wet things burn badly and boil well.",
     note="A jar of brine bursts against a crab and showers the two foes beside it.",
     up={"text": "Deal 3. Apply 3 Water to the target and 1 to the foes beside it.",
         "fx": [D(3), A(WA, 3, attr="stable"), A(WA, 1, attr="stable", to="adjacent")]})
card("al_quicklime", "Quicklime", 1, "S", "enemy", [D(3), A(F, 1, attr="volatile")],
     "Deal 3. Apply 1 Volatile Fire.", cat=F, attr="volatile", arch=TR,
     flavour="Burnt lime flares when it meets water. Soak them first.",
     note="A paper twist of white lime bursts into flame on a soaked pearl diver.",
     up={"text": "Deal 4. Apply 2 Volatile Fire.", "fx": [D(4), A(F, 2, attr="volatile")]})
card("al_clean_linen", "Clean Linen", 1, "S", "ally", [H(4), STRESS(-2)], "A hero heals 4 and sheds 2 stress.",
     use=ALL, arch=AP,
     flavour="Boiled twice, rolled tight. Most of medicine is clean cloth.",
     note="The Alchemist binds the Duelist's forearm with a fresh linen roll between blows.",
     up={"text": "A hero heals 5 and sheds 4 stress.", "fx": [H(5), STRESS(-4)]})
card("al_decant", "Decant", 1, "S", "self", [BREW("fl_brinejar")], "Brew a Brine Jar.", use=ALL, arch=AP,
     flavour="Pour slow. The sediment stays in the bottom.",
     note="The Alchemist pours brine from a stoneware jug into a waxed jar on the bandolier.",
     up={"text": "Brew a Brine Jar. Gain 3 Block.", "fx": [BREW("fl_brinejar"), B(3)]})

# ------------------------------------------------------------------ common
# Transmuter
card("al_greek_fire", "Greek Fire", 1, "C", "enemy", [D(3), D(3, if_="t.water"), A(F, 1, attr="stable")],
     "Deal 3, and 3 more if the target has Water. Apply 1 Fire.", cat=F, attr="stable", arch=TR,
     flavour="It burns on water. The old recipe says so, and the old recipe is right.",
     note="Fire runs across the soaked flank of an eelkin in the brine grotto.",
     up={"text": "Deal 4, and 4 more if the target has Water. Apply 1 Fire.",
         "fx": [D(4), D(4, if_="t.water"), A(F, 1, attr="stable")]})
card("al_salt_spray", "Salt Spray", 1, "C", "enemy", [A(WA, 3, attr="stable"), A(WA, 2, attr="stable", to="behind")],
     "Apply 3 Water to the target and 2 to the foe behind it.", cat=WA, attr="stable", arch=TR,
     flavour="Throw it high and the second rank gets the worst of it.",
     note="A long arc of brine soaks a hookline and the bellringer standing behind him.",
     up={"text": "Apply 4 Water to the target and 3 to the foe behind it.",
         "fx": [A(WA, 4, attr="stable"), A(WA, 3, attr="stable", to="behind")]})
card("al_lye_splash", "Lye Splash", 1, "C", "enemy", [AR(-1, to="target"), A(WA, 1, attr="stable")],
     "The target loses 1 Armor. Apply 1 Water.", cat=WA, attr="stable", arch=TR,
     flavour="Wood ash and water. It eats rust, leather and the skin beneath.",
     note="Caustic grey water hisses on a barnacle knight's plate and the barnacles let go.",
     up={"text": "The target loses 2 Armor. Apply 2 Water.", "fx": [AR(-2, to="target"), A(WA, 2, attr="stable")]})
card("al_base_to_gold", "Base to Gold", 1, "C", "enemy", [D(4), CONV(WA, LI)],
     "Deal 4. Turn all Water on the target into Lightning.", cat=LI, arch=TR,
     flavour="Lead to gold, they promised the abbot. This is the gold you get.",
     note="Water on a drowned thrall crackles yellow as the Alchemist's alembic flashes.",
     up={"text": "Deal 6. Turn all Water on the target into Lightning.", "fx": [D(6), CONV(WA, LI)]})
card("al_reagent", "Reagent", 1, "C", "enemy", [REACT(2)], "Conjoin 2.", cat=F,
     arch=TR + "+elementalist_courses",
     flavour="One drop of the right thing and the whole flask goes.",
     note="A single drop from a pipette falls on a foe layered in courses, and it erupts.",
     up={"text": "Conjoin 3.", "fx": [REACT(3)]})
card("al_powder_pot", "Powder Pot", 1, "C", "all_enemies", [D(3, if_=FRONT), A(F, 1, attr="stable", if_=FRONT)],
     "Deal 3 and apply 1 Fire to each foe in ranks 1 and 2.", hit=FRONT2, cat=F, attr="stable", arch=TR,
     flavour="Aim for the front line. The front line is always there.",
     note="A fat clay pot lands between the two front foes on the nave stair and bursts in flame.",
     up={"text": "Deal 4 and apply 2 Fire to each foe in ranks 1 and 2.",
         "fx": [D(4, if_=FRONT), A(F, 2, attr="stable", if_=FRONT)]})
# Plaguewright
card("al_plague_flask", "Plague Flask", 1, "C", "enemy",
     [D(2), A(T, 3, attr="stable"), A(T, 1, attr="stable", to="adjacent")],
     "Deal 2. Apply 3 Toxin, and 1 to the foes beside it.", cat=T, attr="stable", arch=PW,
     flavour="Corked with wax, sealed with pitch, labelled with a skull for the careless.",
     note="A green flask bursts on a lamprey and a sick mist drifts over the foes on either side.",
     up={"text": "Deal 2. Apply 4 Toxin, and 2 to the foes beside it.",
         "fx": [D(2), A(T, 4, attr="stable"), A(T, 2, attr="stable", to="adjacent")]})
card("al_miasma_jar", "Miasma Jar", 1, "C", "all_enemies", [D(1, if_=FRONT), A(T, 2, attr="stable", if_=FRONT)],
     "Deal 1 and apply 2 Toxin to each foe in ranks 1 and 2.", hit=FRONT2, cat=T, attr="stable", arch=PW,
     flavour="Bad air sinks. Lob it at the front and let it settle.",
     note="A jar of grey fog breaks at the feet of the two front foes in the ossuary.",
     up={"text": "Deal 2 and apply 3 Toxin to each foe in ranks 1 and 2.",
         "fx": [D(2, if_=FRONT), A(T, 3, attr="stable", if_=FRONT)]})
card("al_sour_wick", "Sour Wick", 1, "C", "enemy",
     [D(1), A(F, 3, attr="volatile", if_="t.toxin"), A(F, 1, attr="volatile", if_="!t.toxin")],
     "Deal 1. Apply 3 Volatile Fire if the target has Toxin, or 1 if it has none.", cat=F, attr="volatile", arch=PW,
     flavour="Marsh gas in a bottle and a wick soaked in it. Stand back.",
     note="A wick-stoppered bottle spits green flame against a bloated foe and it goes up.",
     up={"text": "Deal 2. Apply 4 Volatile Fire if the target has Toxin, or 1 if it has none.",
         "fx": [D(2), A(F, 4, attr="volatile", if_="t.toxin"), A(F, 1, attr="volatile", if_="!t.toxin")]})
card("al_black_bile", "Black Bile", 1, "C", "enemy", [D(1, per="t.toxin", k=2)],
     "Deal 1, plus 2 per Toxin on the target.", cat=T, arch=PW,
     flavour="The melancholy humour. Too much of it and the body turns on itself.",
     note="The beaked Plaguewright points the cane; a sick foe doubles over, black at the mouth.",
     up={"text": "Deal 3, plus 2 per Toxin on the target.", "fx": [D(3, per="t.toxin", k=2)]})
card("al_fume_hood", "Fume Hood", 1, "C", "self", [W(3), B(4, if_="rank>=3")],
     "Gain 3 Ward, and 4 Block if you are in rank 3 or 4.", use=ALL, arch=PW,
     flavour="Cloth over the mouth, vinegar in the cloth, distance from the pot.",
     note="The Alchemist ties the cloth over the mouth at the back of the line as green fog rolls in.",
     up={"text": "Gain 4 Ward, and 5 Block if you are in rank 3 or 4.", "fx": [W(4), B(5, if_="rank>=3")]})
card("al_fen_water", "Fen Water", 1, "C", "enemy", [A(WA, 1, attr="volatile"), A(T, 3, attr="stable")],
     "Apply 1 Volatile Water, then 3 Toxin.", cat=WA, attr="volatile", arch=PW + "+" + TR,
     flavour="Rotmire water, bottled warm. The ground it lands on remembers.",
     note="Brown fen water splashes around a foe's feet and the flagstones of the nave go green.",
     up={"text": "Apply 2 Volatile Water, then 4 Toxin.", "fx": [A(WA, 2, attr="volatile"), A(T, 4, attr="stable")]})
card("al_infect_the_wound", "Infect the Wound", 1, "C", "enemy", [A(T, 1, attr="stable", per="t.bleed", k=1)],
     "Apply 1 Toxin, plus 1 per Bleed on the target.", cat=T, attr="stable", arch=PW + "+duelist_bleed",
     flavour="An open cut is a door. Plague doctors know every door.",
     note="The Plaguewright flicks green dust into the gash the Bloodletter just opened.",
     up={"text": "Apply 2 Toxin, plus 1 per Bleed on the target.",
         "fx": [A(T, 2, attr="stable", per="t.bleed", k=1)]})
# Apothecary
card("al_field_dressing", "Field Dressing", 1, "C", "ally", [H(4), H(2, if_=DOSED)],
     "A hero heals 4. Dosed: they heal 2 more.", use=ALL, kw=["Dosed"], arch=AP,
     flavour="Pad, bind, tie. Then the draught, while they are still listening.",
     note="The Apothecary kneels by the Bulwark, packing a wound under the gambeson.",
     up={"text": "A hero heals 5. Dosed: they heal 3 more.", "fx": [H(5), H(3, if_=DOSED)]})
card("al_tincture", "Tincture", 1, "C", "ally", [B(4), STRESS(-3), B(2, if_=DOSED)],
     "A hero gains 4 Block and sheds 3 stress. Dosed: they gain 2 more Block.", use=ALL, kw=["Dosed"], arch=AP,
     flavour="Three drops under the tongue. Not four.",
     note="The Alchemist counts drops from a brown dropper onto the Oracle's tongue.",
     up={"text": "A hero gains 5 Block and sheds 4 stress. Dosed: they gain 3 more Block.",
         "fx": [B(5), STRESS(-4), B(3, if_=DOSED)]})
card("al_steady_hand", "Steady Hand", 0, "C", "self", [IMPROVE(1)], "Improve 1 flask on the belt.",
     use=ALL, arch=AP,
     flavour="Hired for a steady hand. Paid for it, too.",
     note="Spectacles down, the Alchemist adds one careful drop to a flask held up to the light.",
     up={"text": "Retain. Improve 1 flask on the belt.", "kw": ["Retain"]})
card("al_bandolier", "Bandolier", 2, "C", "self", [BREW("fl_firepot"), BREW("fl_draught"), B(2)],
     "Brew a Fire Pot and a Plain Draught. Gain 2 Block.", use=ALL, arch=AP,
     flavour="Every loop filled before the door opens. Every loop.",
     note="The Alchemist slots two fresh bottles into the bandolier, corks still warm.",
     up={"text": "Brew a Fire Pot and a Plain Draught. Gain 2 Block.", "cost": 1})
card("al_poultice", "Poultice", 1, "C", "ally", [ST("regen", 1, per="t.ailments", k=1), CLEANSE(1)],
     "A hero gains Regen 1, plus 1 per ailment on them. Remove 1 ailment from them.", use=ALL,
     arch=AP, flavour="Bread, milk and comfrey, hot as they can bear. It draws the bad out.",
     note="The Apothecary presses a steaming cloth onto the Hexweaver's blackened arm.",
     up={"text": "A hero gains Regen 2, plus 1 per ailment on them. Remove 2 ailments from them.",
         "fx": [ST("regen", 2, per="t.ailments", k=1), CLEANSE(2)]})
card("al_hartshorn", "Hartshorn", 1, "C", "ally", [STRESS(-3), BREW("fl_salts")],
     "A hero sheds 3 stress. Brew Smelling Salts.", use=ALL, arch=AP,
     flavour="Shavings of stag's horn, distilled. The sharpest thing in the bag.",
     note="The Alchemist grinds horn in a brass mortar while the company holds the stair.",
     up={"text": "A hero sheds 6 stress. Brew Smelling Salts.", "fx": [STRESS(-6), BREW("fl_salts")]})
card("al_quench", "Quench", 1, "C", "ally", [CONS(e=F), CONS(e=FR), H(1, per="consumed", k=1)],
     "Remove all Fire and Frost from a hero. They heal 1, plus 1 per stack removed.", use=ALL, cat=WA, arch=AP,
     flavour="Cold for the burn, warm for the frost. Old advice. Still good.",
     note="The Alchemist pours cool water over the Elementalist's scorched, rimed hands.",
     up={"text": "Remove all Fire and Frost from a hero. They heal 3, plus 1 per stack removed.",
         "fx": [CONS(e=F), CONS(e=FR), H(3, per="consumed", k=1)]})
card("al_chaser", "Chaser", 1, "C", "enemy", [D(5), D(3, if_=DOSED)], "Deal 5. Dosed: deal 3 more.",
     kw=["Dosed"], arch=AP,
     flavour="One for the hero, one for the foe. Both thrown hard.",
     note="Right after the Duelist drinks, the Alchemist hurls the empty bottle at the same foe.",
     up={"text": "Deal 6. Dosed: deal 4 more.", "fx": [D(6), D(4, if_=DOSED)]})
# Core
card("al_waxed_apron", "Waxed Apron", 1, "C", "self", [B(5), B(3, if_="incoming_me")],
     "Gain 5 Block, and 3 more if a foe means to strike you.", use=ALL, arch="core",
     flavour="Waxed leather to the shin. Acid runs off it. So do most things.",
     note="The Alchemist turns a shoulder and a claw skids off the long waxed apron.",
     up={"text": "Gain 6 Block, and 5 more if a foe means to strike you.", "fx": [B(6), B(5, if_="incoming_me")]})
card("al_overarm_throw", "Overarm Throw", 1, "C", "enemy", [D(4), D(4, if_="t.moved")],
     "Deal 4, and 4 more if the target moved this round.", arch="core+duelist_drag",
     flavour="A foe dragged into the open is a foe in range.",
     note="The Executioner hauls a foe forward and the Alchemist's bottle meets it on arrival.",
     up={"text": "Deal 5, and 5 more if the target moved this round.", "fx": [D(5), D(5, if_="t.moved")]})
card("al_cauterize", "Cauterize", 1, "C", "ally", [H(5), A(F, 1, attr="stable")],
     "A hero heals 5 and gains 1 Fire.", use=ALL, cat=F, attr="stable", arch=AP + "+hexweaver_transfer",
     flavour="A hot iron closes what a bandage cannot. It leaves its own mark.",
     note="The Apothecary presses a glowing spatula to the Duelist's cut; smoke rises from the sleeve.",
     up={"text": "A hero heals 7 and gains 1 Fire.", "fx": [H(7), A(F, 1, attr="stable")]})

# ------------------------------------------------------------------ uncommon
# Transmuter
card("al_rectify", "Rectify", 1, "U", "enemy", [IMPROVE(1), A(F, 2, attr="stable"), A(WA, 1, attr="stable")],
     "Improve 1 flask on the belt. Apply 2 Fire and 1 Water.", cat=F, attr="stable", arch=TR + "+" + AP,
     flavour="Distil it again. And again. Purity is patience.",
     note="The Transmuter runs a flask back through the alembic while flicking the dregs at a foe.",
     up={"text": "Improve 1 flask on the belt. Apply 3 Fire and 2 Water.",
         "fx": [IMPROVE(1), A(F, 3, attr="stable"), A(WA, 2, attr="stable")]})
card("al_putrefaction", "Putrefaction", 1, "U", "enemy", [D(2), CONV(WA, T), A(F, 2, attr="stable")],
     "Deal 2. Turn all Water on the target into Toxin. Apply 2 Fire.", cat=T, attr="stable", arch=TR + "+" + PW,
     flavour="Every great work begins in rot. The books agree on that much.",
     note="The water soaking a foe turns green and sour as the Transmuter's crucible smokes.",
     up={"text": "Deal 3. Turn all Water on the target into Toxin. Apply 3 Fire.",
         "fx": [D(3), CONV(WA, T), A(F, 3, attr="stable")]})
card("al_fulminating_gold", "Fulminating Gold", 1, "U", "enemy",
     [D(2), D(3, if_="reactions"), A(LI, 2, attr="volatile")],
     "Deal 2, and 3 more if a Conjunction has been set off this round. Apply 2 Volatile Lightning.",
     cat=LI, attr="volatile", arch=TR + "+elementalist_conjunction",
     flavour="Gold that explodes. The Transmuter is very proud of it.",
     note="A pinch of yellow powder cracks like a bolt over a soaked choirboy; the spark leaps foe to foe.",
     up={"text": "Deal 3, and 4 more if a Conjunction has been set off this round. Apply 3 Volatile Lightning.",
         "fx": [D(3), D(4, if_="reactions"), A(LI, 3, attr="volatile")]})
card("al_aqua_fortis", "Aqua Fortis", 1, "U", "enemy",
     [CONS(s="block"), CONS(s="ward"), A(WA, 2, attr="stable", per="consumed", k=1, max=8)],
     "Strip the target's Block and Ward. Apply 2 Water, plus 1 per point stripped (8 at most).",
     cat=WA, attr="stable", arch=TR,
     flavour="Strong water. It parts silver from gold and wards from the warded.",
     note="Fuming acid eats through the abbess's shimmering ward and runs down her robes.",
     up={"text": "Strip the target's Block and Ward. Apply 3 Water, plus 1 per point stripped (10 at most).",
         "fx": [CONS(s="block"), CONS(s="ward"), A(WA, 3, attr="stable", per="consumed", k=1, max=10)]})
card("al_boiling_flood", "Boiling Flood", 2, "U", "all_enemies",
     [D(2), A(F, 1, attr="volatile", if_="t.water"), A(WA, 2, attr="stable")],
     "Deal 2 to every foe. Apply 1 Volatile Fire to each foe with Water, then 2 Water to every foe.",
     cat=F, attr="volatile", arch=TR,
     flavour="A cauldron's worth, tipped from the high step.",
     note="The Alchemist tips a cauldron down the belfry stair and steam swallows the foes below.",
     up={"text": "Deal 3 to every foe. Apply 1 Volatile Fire to each foe with Water, then 3 Water to every foe.",
         "fx": [D(3), A(F, 1, attr="volatile", if_="t.water"), A(WA, 3, attr="stable")]})
card("al_alkahest", "Alkahest", 1, "U", "enemy", [D(1, per="t.spectrum", k=3)],
     "Deal 1, plus 3 per course on the target (its Spectrum).", arch=TR + "+elementalist_spectrum",
     flavour="The universal solvent. Nothing holds it, so it is kept in nothing.",
     note="A clear drop lands on a foe striped in six courses and each colour bites at once.",
     up={"text": "Deal 2, plus 4 per course on the target (its Spectrum).", "fx": [D(2, per="t.spectrum", k=4)]})
# Plaguewright
card("al_rat_bag", "Rat Bag", 1, "U", "enemy", [A(T, 2, attr="stable")],
     "Apply 2 Toxin. Rite: whenever a foe with Toxin dies, the foe in rank 1 gains its Toxin. Exhaust.",
     cat=T, attr="stable", kw=RITE, arch=PW,
     rite={"on": "kill", "if": "m.toxin", "fx": [A(T, 0, attr="stable", per="m.toxin", k=1, to="front_enemy")]},
     flavour="The rats leave the dead first. Then they go next door.",
     note="A sack of plague rats splits open on a lamprey and the rats pour along the line.",
     up={"text": "Apply 4 Toxin. Rite: whenever a foe with Toxin dies, the foe in rank 1 gains its Toxin. Exhaust.",
         "fx": [A(T, 4, attr="stable")]})
card("al_fester", "Fester", 1, "U", "enemy", [A(T, 2, attr="stable"), DBL(e=T)],
     "Apply 2 Toxin, then double the target's Toxin.", cat=T, attr="stable", arch=PW,
     flavour="Leave it a day and see. Leave it two and stand back.",
     note="The Plaguewright watches through glass eyes as a foe's sores swell and split.",
     up={"text": "Apply 3 Toxin, then double the target's Toxin.", "fx": [A(T, 3, attr="stable"), DBL(e=T)]})
card("al_foul_bellows", "Foul Bellows", 1, "U", "enemy", [A(T, 3, attr="stable"), SPREAD(T)],
     "Apply 3 Toxin, then copy the target's Toxin onto the foes beside it.", cat=T, attr="stable", arch=PW,
     flavour="Pump the sick air sideways. Nobody in the line is spared.",
     note="The Plaguewright works a leather bellows and green fog rolls out from one foe to the next.",
     up={"text": "Apply 4 Toxin, then copy the target's Toxin onto the foes beside it.",
         "fx": [A(T, 4, attr="stable"), SPREAD(T)]})
card("al_flash_pan", "Flash Pan", 1, "U", "enemy", [A(F, 3, attr="volatile")], "Apply 3 Volatile Fire.",
     cat=F, attr="volatile", arch=PW + "+" + TR,
     flavour="Sulphur on a brass pan. The flash is the point.",
     note="A brass pan of powder flares white against a foe already green with sickness.",
     up={"text": "Apply 4 Volatile Fire.", "fx": [A(F, 4, attr="volatile")]})
card("al_leech_jar", "Leech Jar", 1, "U", "enemy", [D(1), A(T, 2, attr="stable"), TRANSFER(frm="ally_most")],
     "Deal 1. Apply 2 Toxin. Move every ailment from the hero with the most onto the target.",
     cat=T, attr="stable", arch=PW + "+" + AP,
     flavour="The leeches take the sickness. Then you throw the leeches.",
     note="The Plaguewright lifts a fat leech off the Oracle and flings the jar at a weeping nun.",
     up={"text": "Deal 3. Apply 3 Toxin. Move every ailment from the hero with the most onto the target.",
         "fx": [D(3), A(T, 3, attr="stable"), TRANSFER(frm="ally_most")]})
card("al_wormwood", "Wormwood", 1, "U", "enemy", [D(2), A(T, 2, attr="stable"), A(T, 2, attr="stable", if_="t.hex")],
     "Deal 2. Apply 2 Toxin, and 2 more if the target has Hex.", cat=T, attr="stable", arch=PW + "+hexweaver_hex",
     flavour="The bitterest herb in the bag. Cursed flesh drinks it gladly.",
     note="A bitter grey draught spatters a hexed foe and the cunning-sign on it blackens.",
     up={"text": "Deal 3. Apply 3 Toxin, and 3 more if the target has Hex.",
         "fx": [D(3), A(T, 3, attr="stable"), A(T, 3, attr="stable", if_="t.hex")]})
# Apothecary
card("al_restock", "Restock", 1, "U", "self", [REFILL(1), DRAW(1)], "Refill 1 flask. Draw 1 more card next round.",
     use=ALL, arch=AP,
     flavour="The empty ones go back in the bag. Nothing is wasted that can be boiled.",
     note="The Apothecary snatches an empty bottle from the floor and fills it at the coil.",
     up={"text": "Refill 1 flask. Draw 1 more card next round. Gain 3 Block.", "fx": [REFILL(1), DRAW(1), B(3)]})
card("al_alembic", "Alembic", 1, "U", "self", [BREW("fl_iron"), B(2)], "Brew an Ironbark Tincture. Gain 2 Block.",
     use=ALL, arch=AP + "+bulwark_taunt",
     flavour="Copper, glass and patience. The front rank will need it by the third round.",
     note="An alembic drips dark tincture into a flask while the Bulwark holds the door ahead.",
     up={"text": "Brew an Ironbark Tincture. Gain 4 Block.", "fx": [BREW("fl_iron"), B(4)]})
card("al_liquid_courage", "Liquid Courage", 1, "U", "ally", [STRESS(-4), BREW("fl_rage")],
     "A hero sheds 4 stress. Brew a Bloodrage Draught.", use=ALL, arch=AP + "+duelist_strike",
     flavour="For the one who has to go first. Drink it on the way.",
     note="The Alchemist presses a red bottle into the Duelist's free hand at the foot of the stair.",
     up={"text": "A hero sheds 7 stress. Brew a Bloodrage Draught.", "fx": [STRESS(-7), BREW("fl_rage")]})
card("al_round_of_tonic", "Round of Tonic", 1, "U", "self",
     [B(2, to="all_allies"), STRESS(-3, to="all_allies", if_=DOSED)],
     "Every hero gains 2 Block. Dosed: every hero sheds 3 stress.", use=ALL, kw=["Dosed"], arch=AP,
     flavour="One bottle passed down the line. Everyone takes a mouthful.",
     note="A single brown bottle goes hand to hand down the company in the dark nave.",
     up={"text": "Every hero gains 3 Block. Dosed: every hero sheds 4 stress.",
         "fx": [B(3, to="all_allies"), STRESS(-4, to="all_allies", if_=DOSED)]})
card("al_tasting_spoon", "Tasting Spoon", 1, "U", "self", [DRAW(1), DRAW(1, if_=DOSED)],
     "Draw 1 more card next round. Dosed: draw 1 more.", use=ALL, kw=["Dosed"], arch=AP,
     flavour="Taste every batch. The one you skip is the one that kills.",
     note="The Alchemist touches a horn spoon to the lip of a used flask and frowns, thinking.",
     up={"text": "Draw 1 more card next round. Dosed: draw 1 more. Gain 3 Block.",
         "fx": [DRAW(1), DRAW(1, if_=DOSED), B(3)]})
card("al_ironbark_rub", "Ironbark Rub", 1, "U", "ally", [B(4), B(4, if_="t.taunt")],
     "A hero gains 4 Block, and 4 more if they have Taunt.", use=ALL, arch=AP + "+bulwark_taunt",
     flavour="Rubbed into the joints of the one who calls the blows.",
     note="The Apothecary works dark salve into the Bulwark's shoulder as he roars at the foes.",
     up={"text": "A hero gains 5 Block, and 6 more if they have Taunt.", "fx": [B(5), B(6, if_="t.taunt")]})
# Core
card("al_stink_pot", "Stink Pot", 1, "U", "enemy", [D(2), A(T, 2, attr="stable"), PUSH(1)],
     "Deal 2. Apply 2 Toxin. Push the target back 1.", hit=FRONT2, cat=T, attr="stable", arch="core",
     flavour="Nothing stands in that smell. Not even the drowned.",
     note="A foe in rank 1 reels back from a cracked pot of yellow reek, gagging.",
     up={"text": "Deal 3. Apply 3 Toxin. Push the target back 1.", "fx": [D(3), A(T, 3, attr="stable"), PUSH(1)]})
card("al_powder_charge", "Powder Charge", 1, "U", "enemy", [D(4, per="prime_count", k=3)],
     "Deal 4, plus 3 per Prime spent this round.", arch="core+oracle_prime",
     flavour="The Oracle says when. The Alchemist only lights the fuse.",
     note="On the Fatebinder's word, the Alchemist throws a packed charge into the bellringer's tower.",
     up={"text": "Deal 6, plus 3 per Prime spent this round.", "fx": [D(6, per="prime_count", k=3)]})

# ------------------------------------------------------------------ rare
# Transmuter
card("al_superheat", "Superheat", 1, "R", "enemy", [DBL(e=F), DBL(e=WA)], "Double the Fire and Water on the target.",
     cat=F, arch=TR + "+elementalist_courses",
     flavour="Water above its boiling, held there by the glass alone.",
     note="The Transmuter heats a sealed flask until it glows, then hurls it at a steaming foe.",
     up={"text": "Deal 4. Double the Fire and Water on the target.", "fx": [D(4), DBL(e=F), DBL(e=WA)]})
card("al_athanor", "Athanor", 1, "R", "self", [],
     "Rite: at the start of each round, apply 1 Fire and 1 Water to the foe in rank 1. Exhaust.",
     use=ALL, cat=F, kw=RITE, arch=TR,
     rite={"on": "round_start", "fx": [A(F, 1, attr="stable", to="front_enemy"),
                                       A(WA, 1, attr="stable", to="front_enemy")]},
     flavour="The philosopher's furnace. Once lit it is never let go out.",
     note="The Transmuter sets a squat brass furnace on the flagstones; its mouth faces the front foe.",
     up={"text": "Rite: at the start of each round, apply 1 Fire and 1 Water to each foe in ranks 1 and 2. Exhaust.",
         "rite": {"on": "round_start", "fx": [A(F, 1, attr="stable", to="all_enemies", if_=FRONT),
                                              A(WA, 1, attr="stable", to="all_enemies", if_=FRONT)]}})
card("al_prima_materia", "Prima Materia", 1, "R", "enemy", [REACT(1, per="t.spectrum", k=1)],
     "Conjoin 1, plus 1 per course on the target (its Spectrum).", cat=F, arch=TR + "+elementalist_spectrum",
     flavour="The first matter, from which all six courses came. A spoonful is plenty.",
     note="A spoon of grey paste hits a foe striped in courses and every colour on it flares at once.",
     up={"text": "Conjoin 2, plus 1 per course on the target (its Spectrum).",
         "fx": [REACT(2, per="t.spectrum", k=1)]})
card("al_catalytic_still", "Catalytic Still", 1, "R", "self", [],
     "Rite: the first time each round the company sets off a Conjunction, Brew a Steam Flask. Exhaust.",
     use=ALL, kw=RITE, arch=TR + "+" + AP,
     rite={"on": "conjunction", "per_round": 1, "fx": [BREW("fl_steam")]},
     flavour="Every reaction gives off heat. The still catches it.",
     note="A coil on the Transmuter's back fogs and drips each time a foe across the nave bursts.",
     up={"text": "Rite: the first two times each round the company sets off a Conjunction, Brew a Steam Flask. "
                 "Exhaust.",
         "rite": {"on": "conjunction", "per_round": 2, "fx": [BREW("fl_steam")]}})
# Plaguewright
card("al_miasmatic_cloud", "Miasmatic Cloud", 2, "R", "all_enemies",
     [D(1), A(T, 3, attr="stable"), A(T, 2, attr="stable", if_="t.water")],
     "Deal 1 and apply 3 Toxin to every foe, and 2 more Toxin to each foe with Water.", cat=T, attr="stable",
     arch=PW + "+" + TR,
     flavour="Damp air carries plague best. Every physician knows it.",
     note="A cloud of green fog sinks over the brine grotto and clings to every wet foe.",
     up={"text": "Deal 2 and apply 4 Toxin to every foe, and 2 more Toxin to each foe with Water.",
         "fx": [D(2), A(T, 4, attr="stable"), A(T, 2, attr="stable", if_="t.water")]})
card("al_black_rot", "Black Rot", 1, "R", "all_enemies", [DBL(e=T)], "Double the Toxin on every foe. Exhaust.",
     cat=T, kw=["Exhaust"], arch=PW,
     flavour="It was green yesterday. It is black today. Tomorrow there is no tomorrow.",
     note="Every sick foe in the ossuary darkens at once as the Plaguewright taps the cane.",
     up={"text": "Apply 1 Toxin to every foe, then double the Toxin on every foe. Exhaust.",
         "fx": [A(T, 1, attr="stable"), DBL(e=T)]})
card("al_buboes_burst", "Buboes Burst", 2, "R", "all_enemies", [D(1, per="t.toxin", k=2)],
     "Every foe takes 1, plus 2 per Toxin on it.", cat=T, arch=PW,
     flavour="The swellings ripen together and break together.",
     note="Along the line every sick foe convulses as its swellings split.",
     up={"text": "Every foe takes 1, plus 2 per Toxin on it.", "cost": 1})
card("al_draw_the_venom", "Draw the Venom", 1, "R", "enemy",
     [CONS(e=T), D(0, per="consumed", k=1), H(0, per="consumed", k=1, to="lowest_ally")],
     "Remove all Toxin from the target. It takes 1 and the most wounded hero heals 1 per stack removed.",
     cat=T, arch=PW + "+" + AP,
     flavour="Every venom is a cure in the right glass. Theriac begins with vipers.",
     note="The Plaguewright draws green smoke out of a foe into a flask and hands it to the wounded Duelist.",
     up={"text": "Remove all Toxin from the target. It takes 2 and the most wounded hero heals 1 per stack removed.",
         "fx": [CONS(e=T), D(0, per="consumed", k=2), H(0, per="consumed", k=1, to="lowest_ally")]})
# Apothecary
card("al_magnum_opus", "Magnum Opus", 2, "R", "self", [BREW("fl_blast"), BREW("fl_heal"), BREW("fl_rage")],
     "Brew Blasting Powder, a Healing Draught and a Bloodrage Draught.", use=ALL, arch=AP,
     flavour="The whole bandolier in one sitting. The coil glows red.",
     note="Three new flasks stand steaming in a row on the flagstones beside the kneeling Alchemist.",
     up={"text": "Brew Blasting Powder, a Healing Draught and a Bloodrage Draught.", "cost": 1})
card("al_elixir_of_life", "Elixir of Life", 1, "R", "ally", [GRIT(1), H(3), H(3, if_=DOSED)],
     "A hero gains 1 Grit and heals 3. Dosed: they heal 3 more. Exhaust.", use=ALL, kw=["Dosed", "Exhaust"],
     arch=AP, flavour="Not forever. Just long enough.",
     note="A golden flask tipped to the lips of a hero at Death's Door on the throne room floor.",
     up={"text": "A hero gains 1 Grit and heals 5. Dosed: they heal 4 more. Exhaust.",
         "fx": [GRIT(1), H(5), H(4, if_=DOSED)]})
card("al_hippocras", "Hippocras", 1, "R", "self", [],
     "Rite: whenever a hero uses a flask, they gain 3 Block, and 2 Thorns if they have Taunt. Exhaust.",
     use=ALL, kw=RITE, arch=AP + "+bulwark_taunt",
     rite={"on": "flask", "fx": [B(3), ST("thorns", 2, if_="t.taunt")]},
     flavour="Spiced wine through a sleeve of cloth. Courage for the ones in front.",
     note="The company drinks from the belt and each bottle leaves a hero squarer behind the door.",
     up={"text": "Rite: whenever a hero uses a flask, they gain 4 Block, and 3 Thorns if they have Taunt. Exhaust.",
         "rite": {"on": "flask", "fx": [B(4), ST("thorns", 3, if_="t.taunt")]}})
card("al_panacea", "Panacea", 2, "R", "ally", [CLEANSE(5), H(6), STRESS(-5)],
     "Remove 5 ailments from a hero. They heal 6 and shed 5 stress.",
     use=ALL, arch=AP,
     flavour="The cure for all things. It cures most of them.",
     note="The Apothecary kneels and tips a blue phial into a poisoned, burning hero's mouth.",
     up={"text": "Remove 5 ailments from a hero. They heal 6 and shed 5 stress.", "cost": 1})

# ------------------------------------------------------------------ path: Transmuter
card("al_red_work", "The Red Work", 1, "X", "enemy", [A(F, 2, attr="stable"), REACT(2)],
     "Apply 2 Fire, then Conjoin 2.", cat=F, attr="stable", sub=TR, arch=TR,
     flavour="Rubedo, the last stage. The matter reddens and is done.",
     note="The Transmuter's crucible glows red on its chain as a foe flares from within.",
     up={"text": "Apply 3 Fire, then Conjoin 3.", "fx": [A(F, 3, attr="stable"), REACT(3)]})
card("al_white_work", "The White Work", 1, "X", "enemy",
     [A(WA, 2, attr="stable"), A(WA, 1, attr="stable", to="adjacent"), REACT(1)],
     "Apply 2 Water to the target and 1 to the foes beside it, then Conjoin 1.", cat=WA, attr="stable",
     sub=TR, arch=TR,
     flavour="Albedo. The washing. What is left afterwards is ready to change.",
     note="The Transmuter pours a silvery stream across the front of the line from the alembic.",
     up={"text": "Apply 3 Water to the target and 2 to the foes beside it, then Conjoin 2.",
         "fx": [A(WA, 3, attr="stable"), A(WA, 2, attr="stable", to="adjacent"), REACT(2)]})
card("al_black_work", "The Black Work", 1, "X", "enemy", [D(5), CONV(WA, V)],
     "Deal 5. Turn all Water on the target into Void.", cat=V, sub=TR, arch=TR,
     flavour="Nigredo. First the matter must be blackened, then it can be made.",
     note="The water on a foe goes black as ink while the Transmuter's crucible smokes.",
     up={"text": "Deal 7. Turn all Water on the target into Void.", "fx": [D(7), CONV(WA, V)]})
card("al_quintessence", "Quintessence", 1, "X", "self", [BREW("fl_focus"), IMPROVE(1)],
     "Brew a Clarity Draught. Improve 1 flask on the belt.", use=ALL, sub=TR, arch=TR + "+" + AP,
     flavour="The fifth essence, drawn off the top. It sharpens whoever drinks it.",
     note="The Transmuter lifts a thin clear flask from the alembic's beak and holds it to the light.",
     up={"text": "Brew a Clarity Draught. Improve 2 flasks on the belt.", "fx": [BREW("fl_focus"), IMPROVE(2)]})
card("al_calcination", "Calcination", 1, "X", "enemy", [CONS(s="elements"), D(1, per="consumed", k=2)],
     "Remove every course from the target. Deal 1, plus 2 per stack removed. Exhaust.", cat=F, kw=["Exhaust"],
     sub=TR, arch=TR,
     flavour="Burn it to ash and the ash tells you what it was.",
     note="Every colour on a foe boils off at once into white ash as the crucible swings.",
     up={"text": "Remove every course from the target. Deal 2, plus 3 per stack removed. Exhaust.",
         "fx": [CONS(s="elements"), D(2, per="consumed", k=3)]})
card("al_spagyric_rain", "Spagyric Rain", 2, "X", "all_enemies", [A(F, 2, attr="stable"), A(WA, 2, attr="stable")],
     "Apply 2 Fire and 2 Water to every foe.", cat=F, attr="stable", sub=TR, arch=TR,
     flavour="Separate, then rejoin. Rain and ember fall together.",
     note="A rain of hot droplets and brine falls from the belfry ropes onto every foe below.",
     up={"text": "Apply 2 Fire and 2 Water to every foe.", "cost": 1})

# ------------------------------------------------------------------ path: Plaguewright
card("al_beak_mask", "Beak Mask", 1, "X", "self", [W(3), CLEANSE(1, to="all_allies")],
     "Gain 3 Ward. Remove 1 ailment from every hero.", use=ALL, sub=PW, arch=PW,
     flavour="Herbs in the beak, glass in the eyes. The plague never sees your face.",
     note="The Plaguewright pulls the beaked mask down; dried herbs crumble from the beak.",
     up={"text": "Gain 4 Ward. Remove 2 ailments from every hero.", "fx": [W(4), CLEANSE(2, to="all_allies")]})
card("al_diagnosis", "Diagnosis", 1, "X", "enemy",
     [D(3), A(T, 2, attr="stable"), ST("vulnerable", 1, if_="t.toxin>=5")],
     "Deal 3. Apply 2 Toxin. If the target has 5 or more Toxin, it is Vulnerable 1 round.", cat=T, attr="stable",
     sub=PW, arch=PW,
     flavour="The cane points. The company follows it.",
     note="The Plaguewright points the cane at the sickest foe and the company turns to it.",
     up={"text": "Deal 4. Apply 3 Toxin. If the target has 5 or more Toxin, it is Vulnerable 1 round.",
         "fx": [D(4), A(T, 3, attr="stable"), ST("vulnerable", 1, if_="t.toxin>=5")]})
card("al_ripen", "Ripen", 1, "X", "enemy", [DBL(e=T), SPREAD(T, 1)],
     "Double the target's Toxin, then copy 1 of it onto each foe beside it.", cat=T, sub=PW, arch=PW,
     flavour="Patience. A plague is a harvest.",
     note="A foe's sores bloom and its neighbours begin to cough.",
     up={"text": "Double the target's Toxin, then copy up to 2 of it onto each foe beside it.",
         "fx": [DBL(e=T), SPREAD(T, 2)]})
card("al_kindle_the_rot", "Kindle the Rot", 1, "X", "enemy", [D(0, per="t.toxin", k=1), A(F, 2, attr="volatile")],
     "Deal 1 per Toxin on the target, then apply 2 Volatile Fire.", cat=F, attr="volatile", sub=PW, arch=PW,
     flavour="Rot burns. Ask anyone who has lived near a fen.",
     note="The Plaguewright touches a lit taper to a foe's green breath and it ignites.",
     up={"text": "Deal 1 per Toxin on the target, then apply 3 Volatile Fire.",
         "fx": [D(0, per="t.toxin", k=1), A(F, 3, attr="volatile")]})
card("al_rat_swarm", "Rat Swarm", 1, "X", "enemy", [A(T, 1, attr="stable", to="all_enemies"), A(T, 3, attr="stable")],
     "Apply 1 Toxin to every foe, then 3 more to the target.", cat=T, attr="stable", sub=PW, arch=PW,
     flavour="One rat finds them all. The rest follow.",
     note="Black rats boil out of the Plaguewright's coat and run the length of the enemy line.",
     up={"text": "Apply 1 Toxin to every foe, then 4 more to the target.",
         "fx": [A(T, 1, attr="stable", to="all_enemies"), A(T, 4, attr="stable")]})
card("al_marsh_lights", "Marsh Lights", 1, "X", "all_enemies", [D(1), A(F, 2, attr="volatile", if_="t.toxin")],
     "Deal 1 to every foe. Apply 2 Volatile Fire to every foe with Toxin. Exhaust.", cat=F, attr="volatile",
     kw=["Exhaust"], sub=PW, arch=PW,
     flavour="Marsh lights rise over the dead. Here they rise over the dying.",
     note="Pale flames gutter up from every sick foe in the line at once.",
     up={"text": "Deal 1 to every foe. Apply 3 Volatile Fire to every foe with Toxin. Exhaust.",
         "fx": [D(1), A(F, 3, attr="volatile", if_="t.toxin")]})

# ------------------------------------------------------------------ path: Apothecary
card("al_herb_bag", "Herb Bag", 1, "X", "ally", [H(3), BREW("fl_draught")], "A hero heals 3. Brew a Plain Draught.",
     use=ALL, sub=AP, arch=AP,
     flavour="Yarrow, sage, willow, comfrey. Picked at dawn, dried in the cellarium.",
     note="The Apothecary pulls a bundle of dried herbs from the belt and crushes it into a bottle.",
     up={"text": "A hero heals 5. Brew a Plain Draught.", "fx": [H(5), BREW("fl_draught")]})
card("al_triage", "Triage", 2, "X", "self", [H(8, to="lowest_ally"), H(2, to="all_allies")],
     "The most wounded hero heals 8. Every hero heals 2.", use=ALL, sub=AP, arch=AP,
     flavour="The worst first. Then everyone. Then the worst again.",
     note="The Apothecary moves down the line, kneeling longest by the hero who is bleeding most.",
     up={"text": "The most wounded hero heals 8. Every hero heals 2.", "cost": 1})
card("al_snatch_from_the_door", "Snatch from the Door", 1, "X", "ally", [H(3), H(5, if_="t.dd")],
     "A hero heals 3. If they are at Death's Door, they heal 5 more.", use=ALL, sub=AP, arch=AP,
     flavour="Not yet. Not on my watch, and not on this floor.",
     note="The Apothecary drags a fallen hero back from the edge of the throne room dais.",
     up={"text": "A hero heals 4. If they are at Death's Door, they heal 8 more.", "fx": [H(4), H(8, if_="t.dd")]})
card("al_measured_dose", "Measured Dose", 1, "X", "ally", [B(4), DRAW(1, to="self", if_=DOSED)],
     "A hero gains 4 Block. Dosed: you draw 1 more card next round.", use=ALL, kw=["Dosed"], sub=AP, arch=AP,
     flavour="The right amount at the right time. That is the whole of the craft.",
     note="The Apothecary marks a line on a flask with a thumbnail and hands it forward.",
     up={"text": "A hero gains 6 Block. Dosed: you draw 1 more card next round.",
         "fx": [B(6), DRAW(1, to="self", if_=DOSED)]})
card("al_war_tonics", "War Tonics", 2, "X", "self", [BREW("fl_rage"), BREW("fl_haste"), IMPROVE(1)],
     "Brew a Bloodrage Draught and a Haste Draught. Improve 1 flask on the belt.", use=ALL, sub=AP,
     arch=AP + "+duelist_momentum",
     flavour="For the killers. Keep them fed and keep them standing.",
     note="A red flask and a black one go into the bandolier loops nearest the Duelist.",
     up={"text": "Brew a Bloodrage Draught and a Haste Draught. Improve 1 flask on the belt.", "cost": 1})
card("al_second_dose", "Second Dose", 1, "X", "self", [REFILL(1), REFILL(1, if_=DOSED)],
     "Refill 1 flask. Dosed: refill 1 more.", use=ALL, kw=["Dosed"], sub=AP, arch=AP,
     flavour="If it worked once it will work again. Fill it.",
     note="The Apothecary catches an empty bottle tossed back down the line and fills it.",
     up={"text": "Refill 1 flask. Dosed: refill 1 more. Gain 3 Block.",
         "fx": [REFILL(1), REFILL(1, if_=DOSED), B(3)]})

# ------------------------------------------------------------------ legendary (win conditions, not budgeted)
card("al_the_great_work", "The Great Work", 2, "L", "self", [],
     "Rite: the first two times each round the company sets off a Conjunction, Conjoin that foe 2 and Improve "
     "1 flask on the belt. Exhaust.",
     use=ALL, kw=RITE, sub=TR, arch=TR + "+" + AP,
     rite={"on": "conjunction", "per_round": 2, "fx": [REACT(2), IMPROVE(1)]},
     flavour="The stone is not a thing you find. It is a thing that keeps happening.",
     note="In the throne room the Transmuter's crucible blazes gold as one reaction births the next.",
     up={"text": "Rite: the first two times each round the company sets off a Conjunction, Conjoin that foe 2, "
                 "Improve 1 flask on the belt, then apply 1 Fire and 1 Water to that foe. Exhaust.",
         "rite": {"on": "conjunction", "per_round": 2,
                  "fx": [REACT(2), IMPROVE(1), A(F, 1, attr="stable"), A(WA, 1, attr="stable")]}})
card("al_solve_et_coagula", "Solve et Coagula", 2, "L", "enemy",
     [CONS(s="elements", to="all_enemies"), A(F, 0, attr="stable", per="consumed", k=1)],
     "Remove every course from every foe. Apply that many Fire to the target. Exhaust.", cat=F, attr="stable",
     kw=["Exhaust"], sub=TR, arch=TR,
     flavour="Dissolve, then bind. Everything they carry, poured into one.",
     note="Every colour streams off the line of foes into the Transmuter's crucible, then onto one.",
     up={"text": "Remove every course from every foe. Apply that many Fire to the target, then 1 Volatile Water. "
                 "Exhaust.",
         "fx": [CONS(s="elements", to="all_enemies"), A(F, 0, attr="stable", per="consumed", k=1),
                A(WA, 1, attr="volatile")]})
card("al_black_death", "Black Death", 2, "L", "self", [],
     "Rite: at the end of each round, every foe with Toxin gains 1 Toxin. Then, from rank 1 back, each foe with "
     "Toxin copies 1 onto each foe beside it, so one sick foe can pass it down the line. Exhaust.",
     use=ALL, kw=RITE, sub=PW, arch=PW,
     rite={"on": "round_end", "fx": [A(T, 1, attr="stable", to="all_enemies", if_="t.toxin"),
                                     SPREAD(T, 1, to="all_enemies")]},
     flavour="It does not end. It only moves on.",
     note="The Plaguewright stands still among the dying as the black spreads foe to foe.",
     up={"text": "Apply 2 Toxin to every foe. Rite: at the end of each round, every foe with Toxin gains 1 Toxin. "
                 "Then, from rank 1 back, each foe with Toxin copies 1 onto each foe beside it, so one sick foe can pass "
                 "it down the line. Exhaust.",
         "fx": [A(T, 2, attr="stable", to="all_enemies")]})
card("al_firedamp", "Firedamp", 1, "L", "self", [],
     "Rite: whenever a foe with Toxin dies, every foe takes 1 per Toxin it had. Exhaust.",
     use=ALL, cat=F, kw=RITE, sub=PW, arch=PW,
     rite={"on": "kill", "if": "m.toxin", "fx": [D(0, per="m.toxin", k=1, to="all_enemies")]},
     flavour="Mine gas gathers in the dead. A spark finds it.",
     note="A dying foe bursts in green flame and the blast rolls down the whole line.",
     up={"text": "Rite: whenever a foe with Toxin dies, every foe takes 1 per Toxin it had, then the foe in rank 1 "
                 "gains its Toxin. Exhaust.",
         "rite": {"on": "kill", "if": "m.toxin", "fx": [D(0, per="m.toxin", k=1, to="all_enemies"),
                                                       A(T, 0, attr="stable", per="m.toxin", k=1, to="front_enemy")]}})
card("al_the_physick_garden", "The Physick Garden", 2, "L", "self", [],
     "Rite: at the start of each round, Brew a Garden Simple and Improve 1 flask on the belt. Exhaust.",
     use=ALL, kw=RITE, sub=AP, arch=AP,
     rite={"on": "round_start", "fx": [BREW("fl_simple"), IMPROVE(1)]},
     flavour="Every bed a cure. The garden grows faster than the company can bleed.",
     note="Pots of herbs sprout along the back rank as the Apothecary waters them between blows.",
     up={"text": "Rite: at the start of each round, Brew a Garden Simple, Improve 1 flask on the belt and every "
                 "hero sheds 2 stress. Exhaust.",
         "rite": {"on": "round_start", "fx": [BREW("fl_simple"), IMPROVE(1), STRESS(-2, to="all_allies")]}})
card("al_theriac", "Theriac", 1, "L", "self", [],
     "Rite: whenever a hero uses a flask, Prime 3. Exhaust.",
     use=ALL, kw=RITE, sub=AP, arch=AP + "+oracle_prime",
     rite={"on": "flask", "fx": [PRIME(3)]},
     flavour="Sixty-four ingredients and a viper. It cures everything, including hesitation.",
     note="Each hero drinks in turn and strikes harder, the Apothecary pouring for the next.",
     up={"text": "Rite: whenever a hero uses a flask, Prime 3 and they shed 2 stress. Exhaust.",
         "rite": {"on": "flask", "fx": [PRIME(3), STRESS(-2)]}})

# ------------------------------------------------------------------ hero
HERO = {"name": "Alchemist", "hp": 32, "armor": 0, "grit": 2, "color": "a8653b", "kit": ["al_brew"],
        "deck": ["al_hurled_pitch", "al_hurled_pitch", "al_hurled_pitch", "al_brine_splash", "al_brine_splash",
                 "al_quicklime", "al_quicklime", "al_clean_linen", "al_clean_linen", "al_decant"],
        "subclasses": {AP: "Apothecary", PW: "Plaguewright", TR: "Transmuter"},
        "blurb": "The Brewer. Throws Stable Fire and Water for anyone's Volatile to set off, and keeps the "
                 "company's belt full of flasks."}

# Each archetype's six key cards for the build-aware simulator (all common or uncommon).
ARCHETYPES = {
    TR: ["al_greek_fire", "al_salt_spray", "al_lye_splash", "al_base_to_gold", "al_reagent", "al_rectify"],
    PW: ["al_plague_flask", "al_miasma_jar", "al_sour_wick", "al_black_bile", "al_rat_bag", "al_fume_hood"],
    AP: ["al_field_dressing", "al_tincture", "al_steady_hand", "al_bandolier", "al_poultice", "al_hartshorn"],
}

NEEDS = [
    "al_brew: the brief lets the player choose the basic flask (Fire Pot, Brine Jar or Plain Draught). Written as "
    "a Plain Draught when another hero is below half HP, otherwise a Fire Pot (a picker).",
    "al_solve_et_coagula: pour the removed stacks as a course the player chooses; written as Fire (a picker).",
    "al_the_physick_garden: brew an Improved flask of the player's choice; written as a Garden Simple (an "
    "all-purpose flask) plus Improve 1 (a picker).",
    "al_steady_hand: the brief wanted 'the next flask used this round counts as Improved'; written as Improve 1.",
]
