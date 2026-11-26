"""Elementalist, the Conjoiner: Gate 3 card set (brief: docs/design/gate2/calling_elementalist.md).

Archetypes (arch keys match the path keys):
  accumulator  The Great Working: banked Focus and deep stacks of the attuned course; payoffs read the stacks
               (damage per stack) or spend them in one large Conjunction (a Volatile strike of the next course,
               or Conjoin fed by Focus). The path raises the Conjunction cap.
  catalyst     Chain Reaction: two cheap courses on several foes, 0-cost Volatile sparks and Conjoin; payoffs count
               the Conjunctions so far this round (Block, Ward, damage, draw, vigour).
  prismatic    All Six: many different courses held apart; payoffs read Spectrum (courses on one foe) and the
               courses across all foes (damage, Ward, Focus).
Hybrids: Focus and Conjoin join the Accumulator and the Catalyst; two-course cards and Spread join the Catalyst and
the Prismatic; Conflux and the largest-course readers join the Accumulator and the Prismatic.

Vigour and the Ordo (Gate 3 interaction pass, docs/design/GATE3_INTERACTION.md):
  accumulator  restraint and release: Bank and "for each vigour left unspent" in quiet rounds (Turn the Ring, Hold
               the Breath, Wax the Mouth, Tip the Vessel, Stored Breath, Brass Bands, Pressure, The Brass Reservoir),
               then "if the company spent all its vigour" and "spent before this card" on the release (Pour Out,
               Heavy Pour, Conflux) and the X card Full Measure, which doubles its stacks at X 4 or more. Weigh the
               Stacks wants to be last.
  catalyst     relay and cascade: Handoff (Strike the Wet Ink, Feedback, Chain of Ink, Chain of Sigils), late in a
               heavy Ordo (Cascade, Backdraft last), and Thrift from Conjunctions (Double Flick, The Quickened Hand).
  prismatic    reads the company's colours: "for each other hero who acted before this" (Sixth Ink, Fill the Gaps,
               Every Colour at Once); paints first (Turn the Page, Full Ring) and strikes last (Strike the Ring).
Restraint readers count vigour still unspent when they resolve, so a Bank earlier in the Ordo lowers them.

Text words: "attuned course" is the course the Elementalist is attuned to; "the next course" is the one after it in
the ring (fire, frost, lightning, water, toxin, void, then fire again). Conjoin n: one Stable stack of the target's
largest course becomes n Volatile, setting off its Conjunctions now.

Card ids carry the prefix el_. Cards that apply the attuned course use cat="attuned"."""
from dsl import *

set_class("elementalist", [2, 3, 4], [1, 2, 3, 4])
ALL = [1, 2, 3, 4]
CLOSE = [1, 2]
BACK = [3, 4]
F, FR, L, WA, T, V = "fire", "frost", "lightning", "water", "toxin", "void"
ATT = "attuned"
AC, CA, PR = "accumulator", "catalyst", "prismatic"
VOL = "volatile"

# ------------------------------------------------------------------ kit
card("el_turn_the_ring", "Turn the Ring", 1, "K", "self", [ATTUNE(1), SELF("focus", 1), BANK(1)],
     "Attune to the next course. Gain 1 Focus. Bank 1.", use=ALL, cat=ATT, arch="core",
     flavour="Six sigils on a copper ring. Turn it, and the hand turns with it.",
     note="The Elementalist spins the copper sigil ring at the belt; the ink on one finger brightens.",
     up={"text": "Attune to the next course. Gain 2 Focus. Bank 1.", "fx": [ATTUNE(1), SELF("focus", 2), BANK(1)]})
card("el_stopper_the_jar", "Wax the Mouth", 1, "K", "enemy",
     [AT(1, if_="t.attuned>0"), SELF("focus", 2, per="vigour_left", k=1, max=4)],
     "If the target has your attuned course, apply 1 more of it (this uses your Focus), so it does not fall this "
     "round. Then gain 2 Focus, plus 1 for each vigour left unspent, up to 4.",
     sub=AC, cat=ATT, arch=AC,
     flavour="What is poured in stays in. That is the whole art of the brass.",
     note="The Accumulator presses a wax stopper into the brass vessel on its back; the foe's ink stays wet.",
     up={"text": "If the target has your attuned course, apply 1 more of it (this uses your Focus), so it does not "
                 "fall this round. Then gain 3 Focus, plus 1 for each vigour left unspent, up to 5.",
         "fx": [AT(1, if_="t.attuned>0"), SELF("focus", 3, per="vigour_left", k=1, max=5)]})
card("el_conjoin", "Strike the Wet Ink", 1, "K", "enemy", [REACT(1), REACT(1, if_="handoff")],
     "Conjoin 1. Handoff: Conjoin 1 again.", sub=CA, cat=ATT, arch=CA,
     flavour="One ink laid down. A second struck across it. Then the meeting.",
     note="The Catalyst draws one stroke across a foe's settled ink and the two colours flare together.",
     up={"text": "Conjoin 2. Handoff: Conjoin 1 again.", "fx": [REACT(2), REACT(1, if_="handoff")]})
card("el_sixth_ink", "Sixth Ink", 1, "K", "enemy",
     [AN(1, per="heroes_before", k=1, max=2), MISSING(1, if_="t.spectrum>=5")],
     "Apply 1 of the next course, or 2 if another hero acted before this. Then, if the target holds 5 courses, "
     "apply 1 of the one it lacks.",
     sub=PR, cat=ATT, arch=PR,
     flavour="Five pots stand open. The sixth is the one the Mother kept.",
     note="The Prismatic dips the last unstained finger and touches it to a foe already wearing five colours.",
     up={"text": "Apply 2 of the next course, or 3 if another hero acted before this. Then, if the target holds 5 "
                 "courses, apply 1 of the one it lacks.",
         "fx": [AN(2, per="heroes_before", k=1, max=3), MISSING(1, if_="t.spectrum>=5")]})

# ------------------------------------------------------------------ starters (deck: 3 Ink Bolt, 2 Sigil Flick,
# 2 Wet the Nib, 2 Ward Sigil, 1 Strike Across)
card("el_ink_bolt", "Ink Bolt", 1, "S", "enemy", [D(3), AT(2)], "Deal 3. Apply 2 of your attuned course.",
     cat=ATT, attr="stable", arch="core",
     flavour="The first lesson: lay the ink down and let it settle.",
     note="The Elementalist flicks a bead of ink from a stained finger onto a Drowned Thrall's chest.",
     up={"text": "Deal 4. Apply 3 of your attuned course.", "fx": [D(4), AT(3)]})
card("el_sigil_flick", "Sigil Flick", 1, "S", "enemy", [D(3), AT(1, attr=VOL)],
     "Deal 3. Apply 1 Volatile of your attuned course.", cat=ATT, arch="core",
     flavour="The second lesson: strike across, and do not flinch.",
     note="A casting flick; the sigil ring spins and a hot spark of ink cracks against a foe.",
     up={"text": "Deal 4. Apply 2 Volatile of your attuned course.", "fx": [D(4), AT(2, attr=VOL)]})
card("el_wet_the_nib", "Wet the Nib", 1, "S", "ally", [ST("focus", 3), B(3, to="self")],
     "A hero gains 3 Focus. Gain 3 Block.", use=ALL, cat=ATT, arch="core",
     flavour="A dry pen scratches. A wet one writes.",
     note="The Elementalist touches an inked finger to the Duelist's blade; the steel drinks the colour.",
     up={"text": "A hero gains 4 Focus. Gain 4 Block.", "fx": [ST("focus", 4), B(4, to="self")]})
card("el_ward_sigil", "Ward Sigil", 1, "S", "ally", [W(2), B(3)], "A hero gains 2 Ward and 3 Block.",
     use=ALL, cat=ATT, arch="core",
     flavour="Drawn on the skin, a sigil turns a course aside like a hand turns rain.",
     note="The Elementalist paints a ward sigil on the Bulwark's gauntlet as brine spits from the dark.",
     up={"text": "A hero gains 3 Ward and 4 Block.", "fx": [W(3), B(4)]})
card("el_strike_across", "Strike Across", 1, "S", "enemy", [REACT(1), D(2), D(2, if_="handoff")],
     "Conjoin 1. Deal 2. Handoff: deal 2 more.",
     cat=ATT, arch="core",
     flavour="Half the chapter calls this heresy. The other half takes notes.",
     note="One stroke of ink across another on a foe's hide; the meeting flashes white.",
     up={"text": "Conjoin 2. Deal 2. Handoff: deal 2 more.", "fx": [REACT(2), D(2), D(2, if_="handoff")]})

# ------------------------------------------------------------------ common: The Great Working
card("el_lay_the_ground", "Lay the Ground", 1, "C", "enemy", [AT(4), B(2, to="self")],
     "Apply 4 of your attuned course. Gain 2 Block.", cat=ATT, attr="stable", arch=AC,
     flavour="A working is built from the ground coat up.",
     note="The Elementalist lays a thick wash of one ink over a foe, brush strokes still visible.",
     up={"text": "Apply 5 of your attuned course. Gain 3 Block.", "fx": [AT(5), B(3, to="self")]})
card("el_hold_the_breath", "Hold the Breath", 1, "C", "self", [SELF("focus", 3), BANK(1)],
     "Retain. Gain 3 Focus. Bank 1.", use=ALL, cat=ATT, kw=["Retain"], arch=AC,
     flavour="Not yet. Not yet. Now.",
     note="The Elementalist stands still in the nave, stained hand raised, lips pressed shut.",
     up={"text": "Retain. Gain 4 Focus and 2 Block. Bank 1.", "fx": [SELF("focus", 4), B(2), BANK(1)]})
card("el_steep", "Steep", 1, "C", "enemy", [AT(2, per="t.attuned", k=1, max=6)],
     "Apply 2 of your attuned course, plus 1 for each already on the target, up to 6.",
     cat=ATT, attr="stable", arch=AC,
     flavour="Ink sinks into ink. The second coat goes deeper than the first.",
     note="A foe's skin darkens where the same colour is laid over itself, again and again.",
     up={"text": "Apply 3 of your attuned course, plus 1 for each already on the target, up to 8.",
         "fx": [AT(3, per="t.attuned", k=1, max=8)]})
card("el_seal_the_jar", "Seal the Jar", 1, "C", "enemy", [AT(1), SELF("focus", 2), B(3, to="self")],
     "Apply 1 of your attuned course (this uses your Focus), so it does not fall this round. Then gain 2 Focus "
     "and 3 Block.",
     cat=ATT, attr="stable", arch=AC,
     flavour="Wax over the mouth, a thumb pressed in it. The scholar's seal.",
     note="The Elementalist thumbs a wax seal onto a foe's brow; the ink beneath it stays glossy.",
     up={"text": "Apply 1 of your attuned course (this uses your Focus), so it does not fall this round. Then gain 3 "
                 "Focus and 4 Block.",
         "fx": [AT(1), SELF("focus", 3), B(4, to="self")]})
card("el_pour_out", "Pour Out", 1, "C", "enemy", [AN(2, attr=VOL), D(0, per="spent_before", k=1, max=4)],
     "Apply 2 Volatile of the next course. Deal 1 for each vigour spent before this card this round, up to 4.", cat=ATT, arch=AC + "+" + CA,
     flavour="Everything held, let go at once.",
     note="The Elementalist tips a second ink over the first and the foe disappears in a flare.",
     up={"text": "Apply 3 Volatile of the next course. Deal 1 for each vigour spent before this card this round, "
                 "up to 4.", "fx": [AN(3, attr=VOL), D(0, per="spent_before", k=1, max=4)]})

# ------------------------------------------------------------------ common: Chain Reaction
card("el_spark", "Spark", 0, "C", "enemy", [AT(1, attr=VOL)], "Apply 1 Volatile of your attuned course.",
     cat=ATT, arch=CA,
     flavour="A spark is cheap. What it lands on is not.",
     note="A single bright fleck leaves the Elementalist's fingernail and finds the ink already on a foe.",
     up={"text": "Retain. Apply 1 Volatile of your attuned course.", "kw": ["Retain"]})
card("el_twin_sigil", "Twin Sigil", 1, "C", "enemy", [AT(2), AN(2, attr=VOL)],
     "Apply 2 of your attuned course, then 2 Volatile of the next course.", cat=ATT, arch=CA,
     flavour="Two sigils, one stroke. The chapter still argues which came first.",
     note="Both of the Elementalist's hands sign at once; two colours cross on a foe's breast and burst.",
     up={"text": "Apply 3 of your attuned course, then 3 Volatile of the next course.",
         "fx": [AT(3), AN(3, attr=VOL)]})
card("el_scatter_ink", "Scatter Ink", 1, "C", "all_enemies", [AT(2)],
     "Apply 2 of your attuned course to every foe.", cat=ATT, attr="stable", arch=CA,
     flavour="Shake the pen and the whole page is spotted.",
     note="The Elementalist flings a wet brush down the line of foes, spattering each one.",
     up={"text": "Apply 3 of your attuned course to every foe.", "fx": [AT(3)]})
card("el_flung_ink", "Flung Ink", 1, "C", "all_enemies", [AT(1, attr=VOL)],
     "Apply 1 Volatile of your attuned course to every foe.", cat=ATT, arch=CA,
     flavour="Every blot on the page catches at once.",
     note="A spray of bright ink arcs over the line and each foe it touches flashes in turn.",
     up={"text": "Deal 2 to every foe. Apply 1 Volatile of your attuned course to every foe.",
         "fx": [D(2), AT(1, attr=VOL)]})

# ------------------------------------------------------------------ common: All Six
card("el_second_ink", "Second Ink", 1, "C", "enemy", [AT(2), ATTUNE(1), AT(2)],
     "Apply 2 of your attuned course. Attune to the next course and apply 2 of it.",
     cat=ATT, attr="stable", arch=PR,
     flavour="One finger, then the next. The hand remembers the order.",
     note="Two stained fingers touch a foe one after the other, leaving two colours side by side.",
     up={"text": "Apply 3 of your attuned course. Attune to the next course and apply 3 of it.",
         "fx": [AT(3), ATTUNE(1), AT(3)]})
card("el_split_nib", "Split Nib", 1, "C", "enemy", [D(3), AT(1), AN(1)],
     "Deal 3. Apply 1 of your attuned course and 1 of the next course.",
     cat=ATT, attr="stable", arch=PR + "+" + CA,
     flavour="A split nib draws two lines. Keep them apart, or do not.",
     note="A cut nib scores a foe with two thin lines of different ink that do not quite touch.",
     up={"text": "Deal 4. Apply 2 of your attuned course and 2 of the next course.", "fx": [D(4), AT(2), AN(2)]})
card("el_spectrum_bolt", "Spectrum Bolt", 1, "C", "enemy", [D(3), AT(2), ATTUNE(1)],
     "Deal 3. Apply 2 of your attuned course, then Attune to the next course.", cat=ATT, attr="stable", arch=PR,
     flavour="Each bolt leaves the ring a sigil further round.",
     note="A bolt of one colour leaves the hand; the copper ring clicks round to the next sigil.",
     up={"text": "Deal 4. Apply 3 of your attuned course, then Attune to the next course.",
         "fx": [D(4), AT(3), ATTUNE(1)]})
card("el_turn_the_page", "Turn the Page", 1, "C", "self", [ATTUNE(1), SELF("focus", 2), DRAW(1, if_="first")],
     "Attune to the next course. Gain 2 Focus. If this is first in the Ordo, draw 1 more next round.", use=ALL, cat=ATT, arch=PR + "+" + AC,
     flavour="Every page of the satchel is a different colour. Read them in order.",
     note="The Elementalist turns a page in the air with stained fingers; a new colour wells on the next one.",
     up={"text": "Attune to the next course. Gain 3 Focus. If this is first in the Ordo, draw 1 more next round.",
         "fx": [ATTUNE(1), SELF("focus", 3), DRAW(1, if_="first")]})

# ------------------------------------------------------------------ common: core and company
card("el_lend_the_nib", "Lend the Nib", 1, "U", "ally_other", [ST("focus", 3), DRAW(1)],
     "Another hero gains 3 Focus and draws 1 more next round.", use=ALL, cat=ATT, arch="core",
     flavour="Any hand can carry a course. It writes better with a scholar's ink on it.",
     note="The Elementalist presses a stained thumb to the Alchemist's flask; the glass takes the colour.",
     up={"text": "Another hero gains 4 Focus and draws 1 more next round.", "fx": [ST("focus", 4), DRAW(1)]})
card("el_wet_the_line", "Wet the Line", 1, "C", "all_enemies", [A(WA, 2)], "Apply 2 Water to every foe.",
     cat=WA, attr="stable", arch=CA,
     flavour="Soak them all. The Duelist's blade will find the rest.",
     note="Deep-blue ink sheets down the line of foes and pools at their feet on the drowned stair.",
     up={"text": "Apply 3 Water to every foe.", "fx": [A(WA, 3)]})
card("el_frost_the_swing", "Frost the Swing", 1, "C", "all_enemies", [A(FR, 2, if_="t.attacking"), B(2, to="self")],
     "Apply 2 Frost to every foe that means to attack. Gain 2 Block.", use=ALL, cat=FR, attr="stable",
     arch="core+bulwark_taunt",
     flavour="Cold the arm before it falls. The Bulwark will thank you, after.",
     note="Pale-blue ink rimes the raised arms of three foes as they swing at the Bulwark's door.",
     up={"text": "Apply 3 Frost to every foe that means to attack. Gain 2 Block.",
         "fx": [A(FR, 3, if_="t.attacking"), B(2, to="self")]})
card("el_gall_ink", "Gall Ink", 1, "C", "enemy", [A(T, 2, per="t.armor", k=1, max=5)],
     "Apply 2 Toxin, plus 1 for each Armor the target has, up to 5.", cat=T, attr="stable",
     arch="core+duelist_flurry",
     flavour="Oak-gall ink eats parchment. It eats plate faster.",
     note="Sick-green ink runs into the seams of a foe's armour and the rivets bubble.",
     up={"text": "Apply 3 Toxin, plus 1 for each Armor the target has, up to 7.",
         "fx": [A(T, 3, per="t.armor", k=1, max=7)]})
card("el_sulphur_match", "Sulphur Match", 1, "C", "enemy", [D(5, if_="!t.toxin"), A(F, 1, attr=VOL)],
     "If the target has no Toxin, deal 5. Apply 1 Volatile Fire.", cat=F, arch="core+alchemist_toxin",
     flavour="The Plaguewright lays the poison. The scholar brings the light.",
     note="A vermilion spark drops onto a foe sweating green and the poison goes up in one bright bloom.",
     up={"text": "If the target has no Toxin, deal 7. Apply 1 Volatile Fire.",
         "fx": [D(7, if_="!t.toxin"), A(F, 1, attr=VOL)]})
card("el_blotting_sand", "Blotting Sand", 1, "C", "self", [B(4), W(1), B(3, if_="rank<=2")],
     "Gain 4 Block and 1 Ward. If you stand in rank 1 or 2, gain 3 more Block.", use=ALL, cat=ATT, arch="core",
     flavour="Sand on wet ink. Nothing runs, nothing smears.",
     note="The Elementalist throws a fistful of blotting sand and the spray of foul course dries mid-air.",
     up={"text": "Gain 5 Block and 1 Ward. If you stand in rank 1 or 2, gain 4 more Block.",
         "fx": [B(5), W(1), B(4, if_="rank<=2")]})
card("el_sigil_on_the_door", "Sigil on the Door", 1, "C", "ally", [W(3), W(2, if_="t.rank<=1")],
     "A hero gains 3 Ward. If they stand in rank 1, they gain 2 more.", use=ALL, cat=ATT,
     arch="core+bulwark_front",
     flavour="Paint the ward where the blows land. That is always the door.",
     note="The Elementalist reaches past the Bulwark and paints a sigil on the church door's oak.",
     up={"text": "A hero gains 4 Ward. If they stand in rank 1, they gain 3 more.",
         "fx": [W(4), W(3, if_="t.rank<=1")]})
card("el_draw_the_tide", "Draw the Tide", 1, "C", "enemy", [A(WA, 3), PULL(1)],
     "Apply 3 Water. Pull the target forward 1.", hit=[2, 3, 4], cat=WA, attr="stable", arch="core+bulwark_front",
     flavour="Water runs downhill. So does anything soaked in it.",
     note="A rope of deep-blue ink drags a back-rank foe stumbling toward the Bulwark's mace.",
     up={"text": "Apply 4 Water. Pull the target forward 1.", "fx": [A(WA, 4), PULL(1)]})
card("el_ink_dart", "Ink Dart", 1, "C", "enemy", [D(4), AT(1), AT(2, if_="same_target")],
     "Deal 4. Apply 1 of your attuned course. Follow-up: apply 2 more.", cat=ATT, attr="stable", arch="core",
     flavour="Strike where the last blow landed. The skin is already open.",
     note="A dart of ink follows the Duelist's thrust into the same wound.",
     up={"text": "Deal 5. Apply 2 of your attuned course. Follow-up: apply 2 more.",
         "fx": [D(5), AT(2), AT(2, if_="same_target")]})
card("el_cross_stroke", "Cross Stroke", 1, "U", "enemy", [REACT(1), REACT(1, if_="t.moved"), D(2)],
     "Conjoin 1. If the target was moved this round, Conjoin 1 again. Deal 2.", cat=ATT,
     arch=CA + "+bulwark_moves",
     flavour="Ink that has been shaken mixes readier.",
     note="A foe knocked back by the Bulwark's door staggers, and its two inks flare where they slosh together.",
     up={"text": "Conjoin 1. If the target was moved this round, Conjoin 2. Deal 3.",
         "fx": [REACT(1), REACT(2, if_="t.moved"), D(3)]})
card("el_open_palm", "Open Palm", 1, "C", "enemy", [AT(3, attr=VOL)], "Apply 3 Volatile of your attuned course.",
     use=CLOSE, hit=CLOSE, cat=ATT, arch=CA + "+" + AC,
     flavour="Lecturing distance. Close enough to touch the page.",
     note="Pulled to the front, the Elementalist slaps an open, stained palm flat against a foe.",
     up={"text": "Apply 4 Volatile of your attuned course.", "fx": [AT(4, attr=VOL)]})

# ------------------------------------------------------------------ uncommon: The Great Working
card("el_weigh_the_stacks", "Weigh the Stacks", 1, "U", "enemy",
     [D(0, per="t.attuned", k=2, max=20), D(3, if_="last")],
     "Deal 2 for each of your attuned course on the target, up to 20. If this is last in the Ordo, deal 3 more.",
     cat=ATT, arch=AC,
     flavour="Measure twice. The scale does the rest.",
     note="The brass vessel tilts; the foe sags under the weight of its own ink.",
     up={"text": "Deal 2 for each of your attuned course on the target, up to 22. If this is last in the Ordo, deal "
                 "5 more.", "fx": [D(0, per="t.attuned", k=2, max=22), D(5, if_="last")]})
card("el_tip_the_vessel", "Tip the Vessel", 1, "U", "enemy",
     [SELF("focus", 0, per="vigour_left", k=1, max=3), REACT(2)],
     "Gain 1 Focus for each vigour left unspent, up to 3. Then Conjoin 2.", cat=ATT, arch=AC + "+" + CA,
     flavour="All the held breath goes into one stroke.",
     note="The Accumulator stoops and the brass vessel pours its stored light down the arm into a foe.",
     up={"text": "Gain 1 Focus, plus 1 for each vigour left unspent, up to 4. Then Conjoin 2.",
         "fx": [SELF("focus", 1, per="vigour_left", k=1, max=4), REACT(2)]})
card("el_full_measure", "Full Measure", -1, "U", "enemy",
     [D(0, per="x", k=3), AT(0, per="x", k=2), AT(0, per="x", k=2, if_="x>=4")],
     "Deal 3 per X. Apply 2 of your attuned course per X. If X is 4 or more, apply as many again.", use=BACK,
     cat=ATT, attr="stable", arch=AC,
     flavour="Fill it to the line. Then fill the line.",
     note="From the back rank the Elementalist empties a whole pot of one ink over a single foe.",
     up={"text": "Deal 4 per X. Apply 2 of your attuned course per X. If X is 4 or more, apply as many again.",
         "fx": [D(0, per="x", k=4), AT(0, per="x", k=2), AT(0, per="x", k=2, if_="x>=4")]})
card("el_spend_the_breath", "Spend the Breath", 1, "U", "enemy",
     [CONS(s="focus", to="self"), D(0, per="consumed", k=2)],
     "Spend all your Focus. Deal 2 for each Focus spent.", cat=ATT, arch=AC,
     flavour="If the working will not come, the breath behind it still can.",
     note="The Elementalist exhales; a gust of raw colour hits a foe like a thrown brick.",
     up={"text": "Spend all your Focus. Deal 2, plus 2 for each Focus spent.",
         "fx": [CONS(s="focus", to="self"), D(2, per="consumed", k=2)]})

# ------------------------------------------------------------------ uncommon: Chain Reaction
card("el_warding_sigil", "Warding Sigil", 1, "U", "ally", [W(1, per="reactions", k=2), B(2)],
     "A hero gains 2 Block and 1 Ward, plus 2 Ward for each Conjunction so far this round.", use=ALL, cat=ATT,
     arch=CA,
     flavour="Every flare lights the sigil brighter.",
     note="Ward sigils inked on the Catalyst's forearms glow, and the same sigil blooms on the Oracle's brow.",
     up={"text": "A hero gains 3 Block and 2 Ward, plus 2 Ward for each Conjunction so far this round.",
         "fx": [W(2, per="reactions", k=2), B(3)]})
card("el_reaction_shield", "Reaction Shield", 1, "C", "self", [B(4, per="reactions", k=4)],
     "Gain 4 Block, plus 4 for each Conjunction so far this round.", use=ALL, cat=ATT, arch=CA,
     flavour="The heat of the meeting, caught and turned outward.",
     note="The light of a Conjunction folds around the Catalyst like a cloak.",
     up={"text": "Gain 5 Block, plus 5 for each Conjunction so far this round.",
         "fx": [B(5, per="reactions", k=5)]})
card("el_feedback", "Feedback", 1, "U", "enemy", [D(0, per="reactions", k=4), D(3, if_="handoff")],
     "Deal 4 for each Conjunction so far this round. Handoff: deal 3 more.", cat=ATT, arch=CA,
     flavour="It comes back down the line. Aim it.",
     note="Lines of light from three flaring foes converge in the Catalyst's palm and leap at a fourth.",
     up={"text": "Deal 5 for each Conjunction so far this round. Handoff: deal 4 more.",
         "fx": [D(0, per="reactions", k=5), D(4, if_="handoff")]})
card("el_second_spark", "Second Spark", 0, "U", "enemy", [AN(1, attr=VOL)],
     "Apply 1 Volatile of the next course.", cat=ATT, arch=CA,
     flavour="The first spark lit nothing. The second never misses.",
     note="A second fleck of a different colour follows the first across the nave.",
     up={"text": "Retain. Apply 1 Volatile of the next course.", "kw": ["Retain"]})
card("el_cascade", "Cascade", 1, "U", "enemy", [REACT(1), REACT(1, if_="spent_before>=3"), D(2)],
     "Conjoin 1. If 3 or more vigour was spent before this card this round, Conjoin 1 again. Deal 2.", cat=ATT, arch=CA,
     flavour="One meeting wakes the next.",
     note="Two flares chase each other across one foe's inked hide.",
     up={"text": "Conjoin 1. If 3 or more vigour was spent before this card this round, Conjoin 1 again. Deal 4.",
         "fx": [REACT(1), REACT(1, if_="spent_before>=3"), D(4)]})
card("el_blot_spread", "Blot Spread", 1, "U", "enemy", [SPREAD("all", 0), D(3)],
     "Copy every course on the target to the foes beside it. Deal 3.", cat=ATT, arch=CA + "+" + PR,
     flavour="Blot one line and the page beneath drinks it too.",
     note="The ink on one foe bleeds sideways into its neighbours like a blot through vellum.",
     up={"text": "Copy every course on the target to the foes beside it. Deal 5.", "fx": [SPREAD("all", 0), D(5)]})

# ------------------------------------------------------------------ uncommon: All Six
card("el_count_the_colours", "Count the Colours", 1, "C", "enemy", [D(1, per="t.spectrum", k=3)],
     "Deal 1, plus 3 for each course in the target's Spectrum.", cat=ATT, arch=PR,
     flavour="One, two, three. The Mother had six. Count on.",
     note="The Prismatic's clouded eye fixes on a foe painted in four colours; each colour cracks open.",
     up={"text": "Deal 1, plus 4 for each course in the target's Spectrum.", "fx": [D(1, per="t.spectrum", k=4)]})
card("el_prism_ward", "Prism Ward", 1, "U", "ally", [B(3), W(0, per="elements_all", k=1)],
     "A hero gains 3 Block and 1 Ward for each different course on the foes.", use=ALL, cat=ATT, arch=PR,
     flavour="Every colour on the field is a colour the ward has learned.",
     note="A ward of six thin bands rings the Bulwark like light through a cracked window.",
     up={"text": "A hero gains 5 Block and 1 Ward for each different course on the foes.",
         "fx": [B(5), W(0, per="elements_all", k=1)]})
card("el_wash_of_colour", "Wash of Colour", 2, "U", "all_enemies", [AT(2), ATTUNE(1), AT(2)],
     "Apply 2 of your attuned course to every foe. Attune to the next course and apply 2 of it to every foe.",
     cat=ATT, attr="stable", arch=PR + "+" + CA,
     flavour="Two washes over the whole page, one wet on the other.",
     note="Two broad washes of colour roll down the line of foes, one after the other.",
     up={"text": "Apply 2 of your attuned course to every foe. Attune to the next course and apply 2 of it to "
                 "every foe.", "cost": 1})
card("el_fill_the_gaps", "Fill the Gaps", 1, "U", "enemy",
     [D(2, per="heroes_before", k=2, max=6), MISSING(1, if_="t.spectrum>=3")],
     "Deal 2, plus 2 for each other hero who acted before this, up to 6. Then, if the target holds 3 or more "
     "courses, apply 1 of each course it lacks.", cat=ATT, arch=PR,
     flavour="Where the ring is broken, ink it whole.",
     note="The Prismatic dabs the missing colours onto a foe's hide until a full ring of six shows.",
     up={"text": "Deal 4, plus 2 for each other hero who acted before this, up to 8. Then, if the target holds 3 or "
                 "more courses, apply 1 of each course it lacks.",
         "fx": [D(4, per="heroes_before", k=2, max=8), MISSING(1, if_="t.spectrum>=3")]})
card("el_read_the_colours", "Read the Colours", 1, "U", "self", [SELF("focus", 0, per="elements_all", k=1), B(4)],
     "Gain 1 Focus for each different course on the foes. Gain 4 Block.", use=ALL, cat=ATT, arch=PR + "+" + AC,
     flavour="The field is a page. Every colour on it is a word.",
     note="The Prismatic pauses mid-fight, eyes moving over the painted foes as if reading a line.",
     up={"text": "Gain 1 Focus for each different course on the foes. Gain 6 Block.",
         "fx": [SELF("focus", 0, per="elements_all", k=1), B(6)]})

# ------------------------------------------------------------------ uncommon: core and company
card("el_strip_the_plate", "Strip the Plate", 1, "U", "enemy",
     [A(F, 1), A(FR, 1, attr=VOL, per="t.armor", k=1, max=3)],
     "Apply 1 Fire, then 1 Volatile Frost, plus 1 for each Armor the target has, up to 3.", cat=FR, attr="stable", arch="core+duelist_flurry",
     flavour="Hot, then cold. Iron forgets what shape it was.",
     note="Vermilion then pale-blue ink: a foe's breastplate cracks and falls before the Duelist's lunge.",
     up={"text": "Apply 2 Fire, then 1 Volatile Frost, plus 1 for each Armor the target has, up to 4.",
         "fx": [A(F, 2), A(FR, 1, attr=VOL, per="t.armor", k=1, max=4)]})
card("el_rime_and_brine", "Rime and Brine", 1, "U", "enemy", [A(WA, 1), A(FR, 2, attr=VOL), PRIME(2)],
     "Apply 1 Water, then 2 Volatile Frost. Prime 2.", cat=FR, attr="stable", arch="core+duelist_shatter",
     flavour="Soak it, then still it. Let someone with a blade finish it.",
     note="A foe glazed in ice stands frozen mid-step as the Bulwark's mace comes over the door.",
     up={"text": "Apply 2 Water, then 3 Volatile Frost. Prime 2.", "fx": [A(WA, 2), A(FR, 3, attr=VOL), PRIME(2)]})
card("el_ground_the_arc", "Ground the Arc", 1, "U", "enemy", [A(WA, 1, attr=VOL, per="t.lightning", k=1, max=4)],
     "Apply 1 Volatile Water, plus 1 for each Lightning on the target, up to 4.", cat=WA,
     arch=CA + "+duelist_lightning",
     flavour="The Duelist leaves the sparks. Water gives them somewhere to go.",
     note="Deep-blue ink splashes a foe still crackling from the Duelist's cuts, and the spark runs everywhere.",
     up={"text": "Apply 2 Volatile Water, plus 1 for each Lightning on the target, up to 5.",
         "fx": [A(WA, 2, attr=VOL, per="t.lightning", k=1, max=5)]})
card("el_cold_for_the_void", "Cold for the Void", 1, "U", "enemy", [A(FR, 1, attr=VOL, per="t.void", k=1, max=4)],
     "Apply 1 Volatile Frost, plus 1 for each Void on the target, up to 4.", cat=FR, arch=AC + "+oracle_void",
     flavour="The Augur opens the hole. Frost is what falls into it.",
     note="Pale-blue ink meets the violet-black the Oracle laid, and a foe goes still as a carving.",
     up={"text": "Apply 2 Volatile Frost, plus 1 for each Void on the target, up to 5.",
         "fx": [A(FR, 2, attr=VOL, per="t.void", k=1, max=5)]})
card("el_deep_cold", "Deep Cold", 1, "U", "enemy",
     [CONV(WA, FR), B(3, to="self"), B(4, to="self", if_="flasks_used")],
     "Turn all Water on the target into Frost. Gain 3 Block. Dosed: gain 4 more.", cat=FR, kw=["Dosed"],
     arch="core+alchemist_brine",
     flavour="Brine does not freeze easily. Ask it nicely, in the right ink.",
     note="The Transmuter's brine on a foe turns to rime under the Elementalist's touch.",
     up={"text": "Turn all Water on the target into Frost. Gain 5 Block. Dosed: gain 4 more.",
         "fx": [CONV(WA, FR), B(5, to="self"), B(4, to="self", if_="flasks_used")]})

# ------------------------------------------------------------------ rare
card("el_brass_gauge", "Brass Gauge", 1, "R", "self", [SELF("focus", 2), BANK(2)],
     "Gain 2 Focus. Bank 2. Rite: at the start of each round, gain 1 Focus, then Block equal to your Focus, up to 8. "
     "Exhaust.",
     use=ALL, cat=ATT, kw=["Rite", "Exhaust"], arch=AC,
     rite={"on": "round_start", "fx": [SELF("focus", 1), B(0, to="self", per="focus", k=1, max=8)]},
     flavour="The needle on the brass climbs. So does the wall around the one who carries it.",
     note="A brass gauge on the Accumulator's vessel ticks upward; a faint shell of light thickens round them.",
     up={"text": "Gain 4 Focus. Bank 2. Rite: at the start of each round, gain 1 Focus, then Block equal to your "
                 "Focus, up to 8. Exhaust.", "fx": [SELF("focus", 4), BANK(2)]})
card("el_weight_and_measure", "Weight and Measure", 2, "R", "enemy", [D(2, per="t.el_max", k=4, max=42)],
     "Deal 2, plus 4 for each stack of the target's largest course, up to 42.", cat=ATT, arch=AC + "+alchemist_throws",
     flavour="It does not matter whose ink it was. It all weighs the same.",
     note="A foe drenched in the Alchemist's fire buckles as the Elementalist closes a stained fist.",
     up={"text": "Deal 4, plus 5 for each stack of the target's largest course, up to 54.",
         "fx": [D(4, per="t.el_max", k=5, max=54)]})
card("el_stored_breath", "Stored Breath", 1, "R", "self",
     [SELF("focus", 2, per="vigour_left", k=2, max=6), DBL(s="focus", to="self")],
     "Retain. Gain 2 Focus, plus 2 for each vigour left unspent, up to 6. Then double your Focus. Exhaust.", use=ALL, cat=ATT, kw=["Retain", "Exhaust"], arch=AC,
     flavour="The brass holds more than the lungs ever could.",
     note="The Accumulator breathes into the brass vessel and its seams glow white.",
     up={"text": "Retain. Gain 4 Focus, plus 2 for each vigour left unspent, up to 8. Then double your Focus. "
                 "Exhaust.", "fx": [SELF("focus", 4, per="vigour_left", k=2, max=8), DBL(s="focus", to="self")]})
card("el_chain_of_ink", "Chain of Ink", 2, "R", "all_enemies",
     [AT(2), AN(1, attr=VOL, per="handoff", k=1, max=2)],
     "Apply 2 of your attuned course to every foe, then 1 Volatile of the next course to every foe, or 2 on a "
     "Handoff.", cat=ATT,
     arch=CA + "+" + PR,
     flavour="Write the same two words down the whole line, and read it aloud.",
     note="Down the whole line of foes, two colours cross and flare one after another like lit wicks.",
     up={"text": "Apply 3 of your attuned course to every foe, then 1 Volatile of the next course to every foe, or "
                 "2 on a Handoff.", "fx": [AT(3), AN(1, attr=VOL, per="handoff", k=1, max=2)]})
card("el_spark_shower", "Spark Shower", 0, "R", "enemy", [AT(1, attr=VOL)],
     "Retain. Echo. Apply 1 Volatile of your attuned course.", cat=ATT, kw=["Retain", "Echo"], arch=CA,
     flavour="Nervous fingers, quick sigils, sparks everywhere.",
     note="The Catalyst's fingers twitch and a shower of tiny sparks patters across a foe.",
     up={"text": "Retain. Echo. Apply 2 Volatile of your attuned course.", "fx": [AT(2, attr=VOL)]})
card("el_afterglow", "Afterglow", 1, "R", "self", [DRAW(0, per="reactions", k=1, max=3), EN(1, if_="reactions>=2")],
     "Next round, draw 1 more for each Conjunction so far this round, up to 3. If there were 2 or more, gain 1 "
     "vigour next round.", use=ALL, cat=ATT, arch=CA,
     flavour="The light fades slowly. Work by it while it lasts.",
     note="The company's faces are lit from below by the glow of three foes still smouldering.",
     up={"text": "Next round, draw 1 more for each Conjunction so far this round, up to 4. If there were 2 or more, "
                 "gain 1 vigour next round.",
         "fx": [DRAW(0, per="reactions", k=1, max=4), EN(1, if_="reactions>=2")]})
card("el_full_ring", "Full Ring", 1, "R", "enemy", [D(5), MISSING(1, if_="!first"), MISSING(2, if_="first")],
     "Deal 5. Apply 1 of each course the target lacks, or 2 of each if this is first in the Ordo. Exhaust.", cat=ATT, kw=["Exhaust"], arch=PR,
     flavour="All six at once. The abbey forbade it. The abbey is not here.",
     note="The Prismatic presses all six stained fingers to a foe; a ring of six colours sears into it.",
     up={"text": "Deal 8. Apply 1 of each course the target lacks, or 2 of each if this is first in the Ordo. "
                 "Exhaust.", "fx": [D(8), MISSING(1, if_="!first"), MISSING(2, if_="first")]})
card("el_strike_the_ring", "Strike the Ring", 1, "R", "enemy",
     [D(0, per="t.spectrum", k=2), D(0, per="t.spectrum", k=2, if_="last"), AT(1, attr=VOL)],
     "Deal 2 for each course in the target's Spectrum. If this is last in the Ordo, deal 2 more for each. Then "
     "apply 1 Volatile of your attuned course.", cat=ATT,
     arch=PR + "+" + CA,
     flavour="Paint the whole ring, then strike it like a bell.",
     note="A foe painted in five colours rings like struck bronze as the Prismatic's stroke lands.",
     up={"text": "Deal 3 for each course in the target's Spectrum. If this is last in the Ordo, deal 2 more for "
                 "each. Then apply 1 Volatile of your attuned course.",
         "fx": [D(0, per="t.spectrum", k=3), D(0, per="t.spectrum", k=2, if_="last"), AT(1, attr=VOL)]})
card("el_bright_margin", "Bright Margin", 1, "R", "enemy", [D(3), EN(1, if_="t.spectrum>=4")],
     "Deal 3. If the target holds 4 or more courses, gain 1 vigour next round.", cat=ATT, arch=PR,
     flavour="Brother Lucan illuminates the margins. This scholar illuminates foes.",
     note="A foe outlined in four bright inks glows like an illuminated capital on the page.",
     up={"text": "Deal 5. If the target holds 4 or more courses, gain 1 vigour next round.",
         "fx": [D(5), EN(1, if_="t.spectrum>=4")]})
card("el_conflux", "Conflux", 2, "R", "enemy",
     [CONS(s="elements"), D(0, per="consumed", k=3), D(0, per="consumed", k=1, if_="vigour_spent>=vigour_pool")],
     "Remove every course from the target. Deal 3 for each stack removed. If the company spent all its vigour "
     "this round, deal 1 more for each.", cat=ATT, arch=AC + "+" + PR,
     flavour="Every ink on the page, drawn back into the pen at once.",
     note="Every colour on a foe streams back into the Elementalist's raised hand, and the foe crumples.",
     up={"text": "Remove every course from the target. Deal 2, plus 3 for each stack removed. If the company spent "
                 "all its vigour this round, deal 1 more for each.",
         "fx": [CONS(s="elements"), D(2, per="consumed", k=3),
                D(0, per="consumed", k=1, if_="vigour_spent>=vigour_pool")]})
card("el_draw_the_ink_out", "Draw the Ink Out", 1, "R", "enemy", [TRANSFER(frm="ally_most"), REACT(1), D(3)],
     "Move every ailment from the hero who has the most onto the target. Conjoin 1. Deal 3.", cat=ATT,
     arch=CA + "+foe_ailments",
     flavour="A course on a friend is a wound. On a foe, it is a sentence half written.",
     note="The Elementalist pulls a thread of brine out of the Duelist's lungs and lashes a foe with it.",
     up={"text": "Move every ailment from the hero who has the most onto the target. Conjoin 2. Deal 3.",
         "fx": [TRANSFER(frm="ally_most"), REACT(2), D(3)]})
card("el_shared_pot", "The Shared Pot", 1, "R", "self", [ST("focus", 1, to="all_allies"),
                                                          ST("focus", 2, to="all_allies", if_="flasks_used")],
     "Every hero gains 1 Focus. Dosed: every hero gains 2 more.", use=ALL, cat=ATT, kw=["Dosed"],
     arch="core+alchemist_flasks",
     flavour="One pot of ink, every pen in the company dipped in it.",
     note="The company crowd round the Elementalist's open ink pot as the Alchemist uncorks a flask.",
     up={"text": "Every hero gains 2 Focus. Dosed: every hero gains 2 more.",
         "fx": [ST("focus", 2, to="all_allies"), ST("focus", 2, to="all_allies", if_="flasks_used")]})

# ------------------------------------------------------------------ path: Accumulator
card("el_brass_bands", "Brass Bands", 1, "X", "self", [CAP(4), SELF("focus", 3, per="vigour_left", k=2, max=7)],
     "Raise your Conjunction cap by 4 for this fight. Gain 3 Focus, plus 2 for each vigour left unspent, up to 7. "
     "Exhaust.", use=ALL, cat=ATT,
     kw=["Exhaust"], sub=AC, arch=AC,
     flavour="Band the vessel in brass and it will hold what would split clay.",
     note="The Accumulator hammers a new brass band round the vessel on its back.",
     up={"text": "Raise your Conjunction cap by 4 for this fight. Gain 5 Focus, plus 2 for each vigour left "
                 "unspent, up to 9. Exhaust.", "fx": [CAP(4), SELF("focus", 5, per="vigour_left", k=2, max=9)]})
card("el_pressure", "Pressure", 1, "X", "enemy",
     [DBL(s="largest"), B(3, to="self", per="vigour_left", k=2, max=7)],
     "Double the target's largest course. Gain 3 Block, plus 2 for each vigour left unspent, up to 7. Exhaust.", cat=ATT, kw=["Exhaust"], sub=AC, arch=AC + "+" + PR,
     flavour="Squeeze the jar and the ink climbs the neck.",
     note="The Accumulator clenches a stained fist and a foe's ink swells darker, thicker.",
     up={"text": "Double the target's largest course. Gain 5 Block, plus 2 for each vigour left unspent, up to 9. "
                 "Exhaust.", "fx": [DBL(s="largest"), B(5, to="self", per="vigour_left", k=2, max=9)]})
card("el_heavy_pour", "Heavy Pour", 2, "X", "enemy",
     [AN(4, attr=VOL), D(4), D(4, if_="vigour_spent>=vigour_pool")],
     "Apply 4 Volatile of the next course. Deal 4. If the company spent all its vigour this round, deal 4 more.", use=BACK, cat=ATT, sub=AC, arch=AC,
     flavour="The great working is one gesture. Everything before it was the ink.",
     note="Bent double, the Accumulator upends the brass vessel and a torrent of colour drowns one foe.",
     up={"text": "Apply 4 Volatile of the next course. Deal 4. If the company spent all its vigour this round, deal "
                 "4 more.", "cost": 1})
card("el_under_the_weight", "Under the Weight", 1, "X", "self",
     [SELF("focus", 2), B(4, per="focus", k=1, max=12), B(3, if_="incoming_me")],
     "Gain 2 Focus, then 4 Block plus 1 for each Focus you hold, up to 12. If a foe means to strike you, gain 3 "
     "more Block.", use=ALL, cat=ATT, sub=AC, arch=AC,
     flavour="Bent under the brass. Nothing gets past that much weight.",
     note="The Accumulator kneels behind the brass vessel and blows glance off its curve.",
     up={"text": "Gain 3 Focus, then 5 Block plus 1 for each Focus you hold, up to 14. If a foe means to strike "
                 "you, gain 3 more Block.",
         "fx": [SELF("focus", 3), B(5, per="focus", k=1, max=14), B(3, if_="incoming_me")]})
card("el_brim_over", "Brim Over", 1, "X", "enemy", [AT(2), SPREAD("all", 2)],
     "Apply 2 of your attuned course. Copy up to 2 of each course on the target to the foes beside it.",
     cat=ATT, attr="stable", sub=AC, arch=AC + "+" + CA,
     flavour="A full jar spills. Let it spill where you meant.",
     note="Ink overflows one drenched foe and runs down onto the two beside it.",
     up={"text": "Apply 3 of your attuned course. Copy up to 3 of each course on the target to the foes beside it.",
         "fx": [AT(3), SPREAD("all", 3)]})
card("el_weight_of_the_vessel", "Weight of the Vessel", 1, "X", "enemy",
     [D(3, per="focus", k=2, max=13), D(0, per="vigour_left", k=1, max=3)],
     "Deal 3, plus 2 for each Focus you hold, up to 13. Deal 1 more for each vigour left unspent, up to 3. Your "
     "Focus is not spent.", cat=ATT, sub=AC, arch=AC,
     flavour="It need not be poured. Swung is enough.",
     note="The Accumulator swings round and the brass vessel on its back strikes a foe full in the chest.",
     up={"text": "Deal 5, plus 2 for each Focus you hold, up to 15. Deal 1 more for each vigour left unspent, up to "
                 "3. Your Focus is not spent.", "fx": [D(5, per="focus", k=2, max=15), D(0, per="vigour_left", k=1, max=3)]})

# ------------------------------------------------------------------ path: Catalyst
card("el_hair_trigger", "Hair Trigger", 0, "X", "enemy", [REACT(1)], "Conjoin 1.", cat=ATT, sub=CA, arch=CA,
     flavour="It wanted to go off. It only needed asking.",
     note="The Catalyst barely flicks a finger and the ink on a foe goes up.",
     up={"text": "Retain. Conjoin 1.", "kw": ["Retain"]})
card("el_sigils_on_the_skin", "Sigils on the Skin", 1, "X", "self",
     [W(0, per="reactions", k=1, to="all_allies"), B(3)],
     "Every hero gains 1 Ward for each Conjunction so far this round. Gain 3 Block.", use=ALL, cat=ATT, sub=CA,
     arch=CA,
     flavour="Ink the ward on the skin and every flare feeds it.",
     note="The sigils on the Catalyst's face and forearms burn bright and copy themselves onto the company.",
     up={"text": "Every hero gains 1 Ward for each Conjunction so far this round. Gain 5 Block.",
         "fx": [W(0, per="reactions", k=1, to="all_allies"), B(5)]})
card("el_backdraft", "Backdraft", 2, "X", "all_enemies", [D(3, per="reactions", k=3), D(2, if_="last")],
     "Deal 3 to every foe, plus 3 for each Conjunction so far this round. If this is last in the Ordo, deal 2 more "
     "to every foe.", cat=ATT, sub=CA, arch=CA,
     flavour="Every fire breathes in before it roars.",
     note="The air in the vault sucks inward, then the whole line of foes is thrown back in a wall of light.",
     up={"text": "Deal 3 to every foe, plus 3 for each Conjunction so far this round. If this is last in the Ordo, "
                 "deal 2 more to every foe.", "cost": 1})
card("el_nervous_hands", "Nervous Hands", 0, "X", "self", [DRAW(1, if_="reactions>=1")],
     "If there has been a Conjunction this round, draw 1 more next round.", use=ALL, cat=ATT, sub=CA, arch=CA,
     flavour="The hands never stop. Neither do the pages.",
     note="The Catalyst riffles through the satchel of scrolls with shaking, ink-wet fingers.",
     up={"text": "If there has been a Conjunction this round, draw 2 more next round.",
         "fx": [DRAW(2, if_="reactions>=1")]})
card("el_double_flick", "Double Flick", 1, "X", "enemy",
     [AT(1, attr=VOL), AN(1, attr=VOL), SELF("thrift", 1, if_="reactions>=1")],
     "Apply 1 Volatile of your attuned course, then 1 Volatile of the next course. If there has been a "
     "Conjunction this round, gain 1 Thrift.", cat=ATT, sub=CA,
     arch=CA,
     flavour="Left hand, right hand. Two sparks before the foe can blink.",
     note="Both the Catalyst's hands flick at once and two coloured sparks cross in the air.",
     up={"text": "Apply 2 Volatile of your attuned course, then 1 Volatile of the next course. If there has been a "
                 "Conjunction this round, gain 1 Thrift.",
         "fx": [AT(2, attr=VOL), AN(1, attr=VOL), SELF("thrift", 1, if_="reactions>=1")]})
card("el_steady_nerves", "Steady Nerves", 1, "X", "self", [STRESS(-4, per="reactions", k=-4), B(3)],
     "Shed 4 stress, plus 4 for each Conjunction so far this round. Gain 3 Block.", use=ALL, cat=ATT, sub=CA,
     arch=CA,
     flavour="Every flare is a breath let out.",
     note="Amid the smoke the Catalyst's shaking hands go still for a moment.",
     up={"text": "Shed 5 stress, plus 5 for each Conjunction so far this round. Gain 4 Block.",
         "fx": [STRESS(-5, per="reactions", k=-5), B(4)]})

# ------------------------------------------------------------------ path: Prismatic
card("el_prism_lance", "Prism Lance", 1, "X", "enemy", [D(1, per="elements_all", k=2), D(2, if_="heroes_before")],
     "Deal 1, plus 2 for each different course on the foes. If another hero acted before this, deal 2 more.", cat=ATT, sub=PR, arch=PR,
     flavour="White light, split six ways, gathered back to a point.",
     note="Six thin rays leave the Prismatic's hood halo and meet on one foe.",
     up={"text": "Deal 3, plus 2 for each different course on the foes. If another hero acted before this, deal 2 "
                 "more.", "fx": [D(3, per="elements_all", k=2), D(2, if_="heroes_before")]})
card("el_ring_turn", "Read the Halo", 1, "X", "enemy", [D(4), SELF("focus", 0, per="m.spectrum", k=1), ATTUNE(1)],
     "Deal 4. Gain 1 Focus for each course in the target's Spectrum. Attune to the next course.", cat=ATT, sub=PR,
     arch=PR + "+" + AC,
     flavour="Every colour a foe wears is a lesson. Read it, then turn the page.",
     note="The Prismatic strikes a painted foe and the hood's sigil halo brightens one band per colour.",
     up={"text": "Deal 6. Gain 1 Focus for each course in the target's Spectrum. Attune to the next course.",
         "fx": [D(6), SELF("focus", 0, per="m.spectrum", k=1), ATTUNE(1)]})
card("el_six_inks", "Six Inks", 1, "X", "enemy", [AT(1), ATTUNE(1), AT(1), ATTUNE(1), AT(1), ATTUNE(1), AT(1),
                                                  ATTUNE(1), SELF("focus", 2, if_="first")],
     "Four times: apply 1 of your attuned course, then Attune to the next course. If this is first in the Ordo, "
     "gain 2 Focus.", cat=ATT, attr="stable",
     sub=PR, arch=PR,
     flavour="Finger by finger, round the hand.",
     note="The Prismatic drags all four fingers down a foe, each leaving a different colour.",
     up={"text": "Five times: apply 1 of your attuned course, then Attune to the next course. If this is first in "
                 "the Ordo, gain 2 Focus.",
         "fx": [AT(1), ATTUNE(1), AT(1), ATTUNE(1), AT(1), ATTUNE(1), AT(1), ATTUNE(1), AT(1), ATTUNE(1),
                SELF("focus", 2, if_="first")]})
card("el_glass_halo", "Glass Halo", 2, "X", "self", [W(0, per="elements_all", k=1, to="all_allies")],
     "Every hero gains 1 Ward for each different course on the foes.", use=ALL, cat=ATT, sub=PR, arch=PR,
     flavour="She held all six in one body. A halo is a smaller thing to hold.",
     note="The six sigils embroidered on the Prismatic's hood light up and ring every hero.",
     up={"text": "Every hero gains 1 Ward for each different course on the foes.", "cost": 1})
card("el_every_colour", "Every Colour at Once", 2, "X", "all_enemies",
     [D(0, per="t.spectrum", k=3), D(0, per="t.spectrum", k=1, if_="heroes_before")],
     "Every foe takes 3 for each course in its Spectrum. If another hero acted before this, each takes 1 more for "
     "each course.", cat=ATT, sub=PR, arch=PR,
     flavour="Each colour a foe wears is a colour it can burn in.",
     note="Across the line, every painted foe flares in all the colours it carries.",
     up={"text": "Every foe takes 4 for each course in its Spectrum. If another hero acted before this, each takes "
                 "1 more for each course.",
         "fx": [D(0, per="t.spectrum", k=4), D(0, per="t.spectrum", k=1, if_="heroes_before")]})
card("el_clouded_sight", "Clouded Sight", 1, "X", "self",
     [SELF("focus", 0, per="elements_all", k=1), DRAW(1)],
     "Gain 1 Focus for each different course on the foes. Next round, draw 1 more.", use=ALL, cat=ATT, sub=PR,
     arch=PR + "+" + AC,
     flavour="The clouded eye sees the colours better than the clear one.",
     note="The Prismatic closes the clear eye; the white one looks over a field painted in courses.",
     up={"text": "Gain 1 Focus for each different course on the foes, plus 1. Next round, draw 1 more.",
         "fx": [SELF("focus", 1, per="elements_all", k=1), DRAW(1)]})

# ------------------------------------------------------------------ legendary
card("el_brass_reservoir", "The Brass Reservoir", 2, "L", "enemy",
     [SELF("focus", 0, per="vigour_left", k=1), CAP(99), AN(3, attr=VOL), CAP(-99)],
     "Gain 1 Focus for each vigour left unspent. Apply 3 Volatile of the next course. Its Conjunctions have no "
     "cap. Exhaust.", cat=ATT, kw=["Exhaust"],
     sub=AC, arch=AC,
     flavour="Years of held breath in one brass vessel, opened once.",
     note="The Accumulator unseals the brass vessel and a column of colour swallows the ruler.",
     up={"text": "Gain 3 Focus, plus 1 for each vigour left unspent. Apply 3 Volatile of the next course. Its "
                 "Conjunctions have no cap. Exhaust.",
         "fx": [SELF("focus", 3, per="vigour_left", k=1), CAP(99), AN(3, attr=VOL), CAP(-99)]})
card("el_perpetual_working", "The Perpetual Working", 1, "L", "self", [SELF("focus", 2)],
     "Gain 2 Focus. Rite: twice a round, when the company sets off a Conjunction on a foe, apply 3 of your attuned "
     "course to it. Exhaust.", use=ALL, cat=ATT, kw=["Rite", "Exhaust"], sub=AC, arch=AC + "+" + CA,
     rite={"on": "conjunction", "per_round": 2, "fx": [AT(3, attr="stable")]},
     flavour="The working that consumes itself and is whole again by morning.",
     note="A foe's spent ink seeps back into its skin as fast as the Conjunctions burn it off.",
     up={"text": "Gain 2 Focus. Rite: twice a round, when the company sets off a Conjunction on a foe, apply 3 of "
                 "your attuned course to it, then gain 1 Focus. Exhaust.",
         "rite": {"on": "conjunction", "per_round": 2, "fx": [AT(3, attr="stable"), SELF("focus", 1)]}})
card("el_chain_of_sigils", "Chain of Sigils", 1, "L", "enemy", [AT(1, attr=VOL, per="handoff", k=1, max=2)],
     "Apply 1 Volatile of your attuned course, or 2 on a Handoff. Rite: three times a round, when the company sets off a Conjunction "
     "on a foe, apply 1 Volatile of your attuned course to the foes beside it. Exhaust.",
     cat=ATT, kw=["Rite", "Exhaust"], sub=CA, arch=CA + "+" + PR,
     rite={"on": "conjunction", "per_round": 3, "fx": [AT(1, attr=VOL, to="adjacent")]},
     flavour="One sigil drawn, the next draws itself, and the next.",
     note="A flare on one foe leaps sigil to sigil down the whole line like a lit fuse.",
     up={"text": "Apply 1 Volatile of your attuned course, or 2 on a Handoff. Rite: three times a round, when the "
                 "company sets off a Conjunction on a foe, deal 2 to it and apply 1 Volatile of your attuned course to the foes beside "
                 "it. Exhaust.",
         "rite": {"on": "conjunction", "per_round": 3, "fx": [D(2), AT(1, attr=VOL, to="adjacent")]}})
card("el_quickened_hand", "The Quickened Hand", 1, "L", "self", [SELF("focus", 1)],
     "Gain 1 Focus. Rite: the first two times each round the company sets off a Conjunction, gain 1 Thrift. "
     "Exhaust.", use=ALL, cat=ATT, kw=["Rite", "Exhaust"], sub=CA, arch=CA,
     rite={"on": "conjunction", "per_round": 2, "fx": [SELF("thrift", 1)]},
     flavour="Faster than the eye. Faster than the chapter can object.",
     note="The Catalyst's hands blur; cards and sigils leave them faster than the flares can follow.",
     up={"text": "Gain 1 Focus. Rite: the first two times each round the company sets off a Conjunction, gain 1 "
                 "Thrift and draw 1 more next round. Exhaust.",
         "rite": {"on": "conjunction", "per_round": 2, "fx": [SELF("thrift", 1), DRAW(1, to="self")]}})
card("el_sixfold_ring", "The Sixfold Ring", 2, "L", "enemy", [MISSING(1), REACT(3, per="last", k=2)],
     "Apply 1 of each course the target lacks, then Conjoin 3, or 5 if this is last in the Ordo. Exhaust.", cat=ATT, kw=["Exhaust"], sub=PR,
     arch=PR + "+" + CA,
     flavour="She held all six apart. Let them meet, and see what she was holding back.",
     note="All six colours on one foe meet at once and the Prismatic's clouded eye reflects a white star.",
     up={"text": "Deal 3 for each course in the target's Spectrum. Apply 1 of each course the target lacks, then "
                 "Conjoin 3, or 5 if this is last in the Ordo. Exhaust.",
         "fx": [D(0, per="t.spectrum", k=3), MISSING(1), REACT(3, per="last", k=2)]})
card("el_clouded_eye_saw", "What the Clouded Eye Saw", 2, "L", "self", [W(1, to="all_allies")],
     "Every hero gains 1 Ward. Rite: at the end of each round, if the foes hold 4 or more different courses between "
     "them, every foe takes 2 for each. Exhaust.", use=ALL, cat=ATT, kw=["Rite", "Exhaust"], sub=PR, arch=PR,
     rite={"on": "round_end", "if": "elements_all>=4", "fx": [D(0, per="elements_all", k=2, to="all_enemies")]},
     flavour="The eye went white at the gate. It has seen every colour since.",
     note="The Prismatic stands with the white eye open, and every painted foe cracks along its colours.",
     up={"text": "Every hero gains 1 Ward. Rite: at the end of each round, if the foes hold 4 or more different "
                 "courses between them, every foe takes 2 for each and every hero gains 1 Ward. Exhaust.",
         "rite": {"on": "round_end", "if": "elements_all>=4",
                  "fx": [D(0, per="elements_all", k=2, to="all_enemies"), W(1, to="all_allies")]}})

HERO = {"name": "Elementalist", "hp": 30, "armor": 0, "grit": 1, "color": "8e7aa6", "attuned": 0, "kit": ["el_turn_the_ring"],
        "deck": ["el_ink_bolt", "el_ink_bolt", "el_ink_bolt", "el_sigil_flick", "el_sigil_flick", "el_wet_the_nib",
                 "el_wet_the_nib", "el_ward_sigil", "el_ward_sigil", "el_strike_across"],
        "subclasses": {AC: "Accumulator", CA: "Catalyst", PR: "Prismatic"},
        "blurb": "The Conjoiner. Lays one course on a foe and strikes another across it, and sets off what the "
                 "company leaves behind."}

# Each archetype's six key cards for the build-aware simulator (all common or uncommon).
ARCHETYPES = {
    AC: ["el_lay_the_ground", "el_hold_the_breath", "el_steep", "el_seal_the_jar", "el_pour_out",
         "el_weigh_the_stacks"],
    CA: ["el_spark", "el_twin_sigil", "el_scatter_ink", "el_warding_sigil", "el_reaction_shield", "el_feedback"],
    PR: ["el_second_ink", "el_split_nib", "el_spectrum_bolt", "el_turn_the_page", "el_count_the_colours",
         "el_prism_ward"],
}

NEEDS = [
    "el_turn_the_ring: the brief's 'Attune to a course you choose' needs a course picker for ATTUNE_TO. Written as a "
    "one-step ATTUNE, which cannot dodge a resisted course quickly.",
    "el_stopper_the_jar, el_seal_the_jar: the brief's 'the target's stacks do not fall this round / next round' without "
    "applying (applying spends Focus). Wanted a seal status on a foe's course. Written as applying 1, which marks the "
    "stacks fresh.",
    "Hold Apart (Prismatic key common in the brief: the target's courses cannot conjoin this round) has no effect; "
    "left out, el_read_the_colours takes its slot.",
    "el_sixth_ink: the brief's 'apply 1 Stable of a course the target lacks' (one course, chosen). Written as the next "
    "course plus a fill when the target holds 5.",
    "el_perpetual_working: the brief's 'Conjunctions leave the Stable stacks behind'. Written as a Rite re-laying 3 "
    "attuned stacks on each Conjunction (twice a round).",
    "el_quickened_hand: the brief's 'the next course card this round costs 0'. Written with Thrift (1 less, twice a "
    "round); a full cost-to-0 effect would match the brief exactly.",
    "el_clouded_eye_saw: the brief's 'no course on the foes falls' half needs a no-decay rite effect; written with the "
    "damage half only.",
    "el_brass_reservoir: 'no cap' is written as CAP(99) before the strike and CAP(-99) after; a one-card cap effect "
    "would be cleaner.",
    "Hover text for 'the next course' (the one after the attuned course in the ring).",
    "Heavy Pour, Conflux: the release reads 'if the company spent all its vigour' (vigour_spent>=vigour_pool). A "
    "quantity for vigour carried into this round (Bank and EN) would let the Accumulator pay off 'spent more than "
    "the company's base', which absolute numbers cannot say for companies of 2 to 4.",
    "Restraint readers (Wax the Mouth, Tip the Vessel, Stored Breath, Brass Bands, Pressure, Weight of the Vessel, "
    "The Brass Reservoir) read vigour_left, which a Bank earlier in the Ordo lowers. The Ordo preview should show "
    "the number each reader will see.",
]
