"""Hexweaver (the Cunning Folk): Gate 3 card set.

Brief: docs/design/gate2/calling_hexweaver.md. Bible: art/party/bible/01_company.md (Hexweaver).
Archetypes: pactbound (Blood Price), doomsayer (The Knell), mirrorhex (The Cracked Glass); "core" serves all three.
An arch of "a+b" names two archetypes, or an archetype and another calling's setup it pays off."""
from dsl import *

set_class("hexweaver", [2, 3, 4], [1, 2, 3, 4])
T, V, P = "toxin", "void", "physical"
TOUCH = [1, 2, 3]   # Toxin touches and Hag's Finger reach ranks 1 to 3
KNIFE = [2, 3]      # Pactbound knife strikes are made from close behind the line
PB, DS, MH = "pactbound", "doomsayer", "mirrorhex"

# ------------------------------------------------------------------ kit
card("pass_it_on", "Pass It On", 1, "K", "enemy", [TRANSFER("ally_most", n=1), ST("hex", 1, if_="handoff")],
     "Move the largest ailment (every stack of it) off the other hero carrying the most onto the target. A course arrives as Stable stacks. Handoff: apply 1 Hex.",
     cat=V, arch="core",
     flavour="Say the rhyme, tie the knot, and the fever is someone else's.",
     note="The Hexweaver draws a sick hero's rot into a cloth poppet and flings it at a foe.",
     up={"text": "Move the largest ailment (every stack of it) off the other hero carrying the most onto the target. A course arrives as Stable stacks. Handoff: apply 2 Hex.", "fx": [TRANSFER("ally_most", n=1), ST("hex", 2, if_="handoff")]})
card("bloodletting", "Bloodletting", 1, "K", "enemy", [SELFDMG(1), ST("hex", 3), STRESS(-2, to="self")],
     "Lose 1 HP. Apply 3 Hex. Shed 2 stress.", cat=V, sub=PB, arch=PB,
     flavour="The cut is always fresh. The bandage is never clean.",
     note="The Pactbound draws the bone knife along the bandaged forearm over a poppet.",
     up={"text": "Lose 1 HP. Apply 4 Hex. Shed 2 stress.", "fx": [SELFDMG(1), ST("hex", 4), STRESS(-2, to="self")]})
card("ring_the_bell", "Ring the Bell", 1, "K", "all_enemies", [ST("doom", 2, if_="t.hex>0")],
     "Every foe with Hex gains 2 Doom.", cat=V, sub=DS, arch=DS,
     flavour="One stroke for each of you. Count them.",
     note="The Doomsayer rings the handbell once, and every hexed foe looks up.",
     up={"text": "Every foe with Hex gains 3 Doom.", "fx": [ST("doom", 3, if_="t.hex>0")]})
card("glint", "Glint", 1, "K", "ally", [W(2), ST("thorns", 1)],
     "A hero gains 2 Ward and 1 Thorns.", cat=V, sub=MH, arch=MH,
     flavour="Look into the glass. It looks back harder.",
     note="The Mirrorhex tilts the cracked hand mirror and a hero's outline glints in it.",
     up={"text": "A hero gains 2 Ward and 2 Thorns.", "fx": [W(2), ST("thorns", 2)]})

# ------------------------------------------------------------------ starters (10 in the deck)
card("pin_the_poppet", "Pin the Poppet", 1, "S", "enemy", [D(4), ST("hex", 1)],
     "Deal 4. Apply 1 Hex.", cat=V, arch="core",
     flavour="Straw takes the shape you tell it. Then it takes the pin.",
     note="The Hexweaver crouches and drives a long pin through a straw poppet's chest.",
     up={"text": "Deal 5. Apply 2 Hex.", "fx": [D(5), ST("hex", 2)]})
card("knotted_cord", "Knotted Cord", 1, "S", "ally", [B(5), W(1)],
     "A hero gains 5 Block and 1 Ward.", cat=V, arch="core",
     flavour="Seven knots, and nothing gets through the seventh.",
     note="The Hexweaver ties a knotted cord round a hero's wrist and bites it tight.",
     up={"text": "A hero gains 6 Block and 2 Ward.", "fx": [B(6), W(2)]})
card("evil_eye", "Evil Eye", 1, "S", "enemy", [ST("hex", 4)],
     "Apply 4 Hex.", cat=V, arch="core",
     flavour="A look is cheap. This one will cost it.",
     note="Sharp watchful eyes under the ragged hood fix on a foe.",
     up={"text": "Apply 5 Hex.", "fx": [ST("hex", 5)]})
card("graveyard_dirt", "Graveyard Dirt", 1, "S", "enemy", [A(T, 3), A(V, 1)],
     "Apply 3 Toxin and 1 Void.", cat=T, attr="stable", hit=TOUCH, arch="core",
     flavour="Taken from a fresh grave at midnight. It remembers.",
     note="The Hexweaver flings a fistful of graveyard dirt from the belt pouch.",
     up={"text": "Apply 4 Toxin and 1 Void.", "fx": [A(T, 4), A(V, 1)]})
card("blood_price", "Pricked Thumb", 0, "S", "enemy", [SELFDMG(1), ST("hex", 1), PRIME(3)],
     "Lose 1 HP. Apply 1 Hex. Prime 3.", cat=V, arch="pactbound",
     flavour="A drop for the poppet, and the next blow lands true.",
     note="The Hexweaver pricks a thumb and smears blood on a poppet's face.",
     up={"text": "Lose 1 HP. Apply 1 Hex. Prime 4.", "fx": [SELFDMG(1), ST("hex", 1), PRIME(4)]})

# ------------------------------------------------------------------ common: core
card("twist_the_pin", "Twist the Pin", 2, "C", "enemy",
     [CONS(s="hex"), D(4, per="consumed", k=2), D(3, if_="same_target")],
     "Spend the target's Hex. Deal 4, plus 2 per Hex spent. If the action before this one struck the same foe, deal 3 more.",
     cat=V, arch="core",
     flavour="Every knot you tied, I pull at once.",
     note="The Hexweaver twists a pin already deep in a poppet; the foe doubles over.",
     up={"text": "Spend the target's Hex. Deal 4, plus 3 per Hex spent. If the action before this one struck the same "
                 "foe, deal 3 more.", "fx": [CONS(s="hex"), D(4, per="consumed", k=3), D(3, if_="same_target")]})
card("whispered_name", "Whispered Name", 1, "C", "enemy", [ST("hex", 2, per="vigour_left", k=2, max=6), STRESS(-3, to="self")],
     "Apply 2 Hex, plus 2 per vigour left unspent this round, at most 6. Shed 3 stress.", cat=V, arch="core",
     flavour="Everything has a name. Say it into the straw.",
     note="The Hexweaver whispers into a poppet's ear, eyes on the foe.",
     up={"text": "Apply 3 Hex, plus 2 per vigour left unspent this round, at most 7. Shed 4 stress.", "fx": [ST("hex", 3, per="vigour_left", k=2, max=7), STRESS(-4, to="self")]})
card("rotting_word", "Rotting Word", 1, "C", "enemy", [D(2), A(T, 4)],
     "Deal 2. Apply 4 Toxin.", cat=T, attr="stable", hit=TOUCH, arch="core",
     flavour="Touch it once. Let the fen do the rest.",
     note="A knotted, dirt-black hand presses to a foe's flank and the skin greens.",
     up={"text": "Deal 3. Apply 5 Toxin.", "fx": [D(3), A(T, 5)]})
card("sour_milk", "Sour Milk", 1, "C", "enemy", [A(T, 3), A(T, 2, to="adjacent")],
     "Apply 3 Toxin to the target and 2 to each foe beside it.", cat=T, attr="stable", hit=TOUCH, arch="core",
     flavour="The cow went dry, the well went bad, and then it was their turn.",
     note="The Hexweaver spills a clay jug of curdled milk across the foes' line.",
     up={"text": "Apply 4 Toxin to the target and 3 to each foe beside it.", "fx": [A(T, 4), A(T, 3, to="adjacent")]})
card("hags_finger", "Hag's Finger", 1, "C", "enemy", [PULL(1), ST("hex", 2), ST("hex", 2, if_="t.rank<=1")],
     "Pull the target 1 rank forward. Apply 2 Hex, and 2 more if it now stands in rank 1.",
     cat=V, hit=TOUCH, arch="core",
     flavour="Come here, little one. Closer.",
     note="A crooked finger beckons; a foe stumbles forward out of its rank.",
     up={"text": "Pull the target 1 rank forward. Apply 3 Hex, and 3 more if it now stands in rank 1.",
         "fx": [PULL(1), ST("hex", 3), ST("hex", 3, if_="t.rank<=1")]})
card("salt_the_threshold", "Salt the Threshold", 1, "C", "all_allies", [W(1), STRESS(-1)],
     "Every hero gains 1 Ward and sheds 1 stress.", cat=V, arch="core",
     flavour="Nothing crosses a salt line without asking first.",
     note="The Hexweaver pours a line of salt across the floor in front of the company.",
     up={"text": "Every hero gains 1 Ward and sheds 2 stress.", "fx": [W(1), STRESS(-2)]})

# ------------------------------------------------------------------ common: pactbound
card("tithe_of_blood", "Tithe of Blood", 0, "C", "self", [SELFDMG(2), SELF("might", 1)],
     "Lose 2 HP. Gain 1 Might. Exhaust.", cat=V, kw=["Exhaust"], arch=PB, use=[1, 2, 3, 4],
     flavour="The poppets drink first. Then they work.",
     note="The Pactbound lets blood run down the bone knife onto the poppets at the belt.",
     up={"text": "Lose 1 HP. Gain 1 Might. Exhaust.", "fx": [SELFDMG(1), SELF("might", 1)]})
card("spite", "Spite", 1, "C", "enemy", [D(3, per="ailments", k=1)],
     "Deal 3, plus 1 per ailment you carry.", cat=V, arch=PB,
     flavour="Every sore on me is a pin in you.",
     note="The Hexweaver, blistered and green at the lips, spits at a foe.",
     up={"text": "Deal 5, plus 1 per ailment you carry.", "fx": [D(5, per="ailments", k=1)]})
card("drain", "Drain", 1, "C", "enemy", [D(4, lifesteal=50), H(3, to="self", if_="flasks_used")],
     "Deal 4. Heal half the damage dealt. Dosed: heal 3 more.", cat=V, kw=["Dosed"], arch="pactbound+alchemist_flask",
     flavour="What runs out of it runs into me.",
     note="A thread of dark red runs from a foe's wound into the Hexweaver's cupped hands.",
     up={"text": "Deal 6. Heal half the damage dealt. Dosed: heal 3 more.",
         "fx": [D(6, lifesteal=50), H(3, to="self", if_="flasks_used")]})
card("blood_offering", "Blood Offering", 0, "C", "self", [SELFDMG(1), SELFDMG(2, if_="!flasks_used"), EN(1)],
     "Lose 3 HP, or only 1 if Dosed. Next round, +1 vigour. Exhaust.", cat=V, kw=["Exhaust", "Dosed"], arch="pactbound+alchemist_flask",
     flavour="Paid in advance. The debt is never small.",
     note="The Pactbound holds a bleeding palm over a black tallow candle until it flares.",
     up={"text": "Lose 1 HP. Next round, +1 vigour. Exhaust.", "fx": [SELFDMG(1), EN(1)]})
card("take_the_rot", "Take the Rot", 1, "C", "enemy", [TRANSFER("ally_most", to="self"), ST("hex", 3)],
     "Move every ailment off the other hero carrying the most onto yourself. Apply 3 Hex.", cat=V, arch="pactbound+mirrorhex",
     flavour="Give it here. I have carried worse.",
     note="The Hexweaver lays a palm on a sick hero's chest and the green creeps up their own arm.",
     up={"text": "Move every ailment off the other hero carrying the most onto yourself. Apply 4 Hex.",
         "fx": [TRANSFER("ally_most", to="self"), ST("hex", 4)]})
card("martyrs_pin", "Martyr's Pin", 1, "C", "enemy", [SELFDMG(2), ST("hex", 4, per="lost", k=1)],
     "Lose 2 HP. Apply 4 Hex, plus 1 per HP lost.", cat=V, arch="pactbound+doomsayer",
     flavour="Pins go in deeper when they are wet.",
     note="The Pactbound pushes a pin through their own palm and into the poppet beneath.",
     up={"text": "Lose 2 HP. Apply 6 Hex, plus 1 per HP lost.", "fx": [SELFDMG(2), ST("hex", 6, per="lost", k=1)]})

# ------------------------------------------------------------------ common: doomsayer
card("handbell", "Handbell", 1, "C", "all_enemies", [ST("hex", 2)],
     "Apply 2 Hex to every foe.", cat=V, arch=DS,
     flavour="It rings for all of you.",
     note="The Doomsayer swings the handbell high; the foes' line flinches as one.",
     up={"text": "Apply 3 Hex to every foe.", "fx": [ST("hex", 3)]})
card("bad_tidings", "Bad Tidings", 1, "C", "enemy", [ST("doom", 3), ST("doom", 3, if_="t.mark>0")],
     "Apply 3 Doom, and 3 more if the target is Marked.", cat=V, arch="doomsayer+duelist_mark",
     flavour="I don't make it happen. I only say it first.",
     note="The Doomsayer points the bell staff at a marked foe and speaks its end.",
     up={"text": "Apply 4 Doom, and 4 more if the target is Marked.",
         "fx": [ST("doom", 4), ST("doom", 4, if_="t.mark>0")]})
card("corpse_candle", "Corpse Candle", 1, "C", "enemy",
     [ST("doom", 2), A(T, 2), ST("doom", 2, if_="reactions>0")],
     "Apply 2 Doom and 2 Toxin. If the company has set off a Conjunction this round, apply 2 more Doom.",
     cat=T, attr="stable", arch="doomsayer+elementalist_conjoin",
     flavour="The little light walks the road the coffin will take.",
     note="A black tallow candle drifts from the shoulder plate and hangs over a foe.",
     up={"text": "Apply 3 Doom and 2 Toxin. If the company has set off a Conjunction this round, apply 3 more Doom.",
         "fx": [ST("doom", 3), A(T, 2), ST("doom", 3, if_="reactions>0")]})
card("knell", "Knell", 1, "C", "all_enemies", [ST("doom", 0, per="t.hex", k=0.5)],
     "Every foe gains 1 Doom per 2 Hex on it.", cat=V, arch=DS,
     flavour="Slow strokes. One for every year it has left.",
     note="The iron bell on the Doomsayer's staff tolls; hexed foes stagger at each stroke.",
     up={"text": "Apply 1 Hex to every foe. Then every foe gains 1 Doom per 2 Hex on it.",
         "fx": [ST("hex", 1), ST("doom", 0, per="t.hex", k=0.5)]})
card("dirge", "Dirge", 1, "C", "all_enemies", [D(2), D(1, if_="t.hex>0")],
     "Deal 2 to every foe, and 1 more to each foe with Hex.", cat=V, arch=DS,
     flavour="We sing it now so no one has to later.",
     note="The Hexweaver hums low over a ring of candles; the foes' line sags.",
     up={"text": "Deal 3 to every foe, and 1 more to each foe with Hex.", "fx": [D(3), D(1, if_="t.hex>0")]})
card("hasten_the_end", "Hasten the End", 1, "C", "enemy", [D(3, per="t.doom", k=0.5)],
     "Deal 3, plus 1 per 2 Doom on the target.", cat=V, arch=DS,
     flavour="It was always going to happen. Why wait?",
     note="The Doomsayer brings the bell staff down on a doomed foe's head.",
     up={"text": "Deal 5, plus 1 per 2 Doom on the target.", "fx": [D(5, per="t.doom", k=0.5)]})

# ------------------------------------------------------------------ common: mirrorhex
card("mirror_shard", "Mirror Shard", 1, "C", "ally", [ST("thorns", 2), W(1), ST("thorns", 2, if_="t.taunt>0")],
     "A hero gains 2 Thorns and 1 Ward. If it has Taunt, it gains 2 more Thorns.",
     cat=V, arch="mirrorhex+bulwark_taunt",
     flavour="Hit it and the glass bites back.",
     note="The Mirrorhex stitches a shard of mirror onto the Bulwark's door-shield.",
     up={"text": "A hero gains 3 Thorns and 1 Ward. If it has Taunt, it gains 3 more Thorns.",
         "fx": [ST("thorns", 3), W(1), ST("thorns", 3, if_="t.taunt>0")]})
card("silver_lie", "Silver Lie", 1, "C", "enemy", [STEAL(), ST("hex", 2)],
     "Take the target's Block. Apply 2 Hex.", cat=V, arch=MH,
     flavour="Silver backs every mirror. It tells you you're safe.",
     note="The Mirrorhex holds up the cracked glass and a foe's guard slides into it.",
     up={"text": "Take the target's Block. Apply 3 Hex.", "fx": [STEAL(), ST("hex", 3)]})
card("cracked_glass", "Cracked Glass", 1, "C", "enemy", [D(4, per="t.might", k=1)],
     "Deal 4, plus 1 per Might on the target.", cat=V, arch=MH,
     flavour="The stronger it stands, the more glass it sees.",
     note="A foe flexes before the cracked mirror and the crack runs through its arm.",
     up={"text": "Deal 4, plus 2 per Might on the target.", "fx": [D(4, per="t.might", k=2)]})
card("mirror_mirror", "Mirror, Mirror", 1, "C", "enemy", [TURN(), ST("hex", 1)],
     "If the target attacks this round, its attack strikes a foe beside it instead. Apply 1 Hex.", cat=V, arch=MH,
     flavour="Strike, then. Your friend has the face you hate.",
     note="The Mirrorhex flashes the glass and a foe's blow lands on its neighbour.",
     up={"text": "If the target attacks this round, its attack strikes a foe beside it instead. Apply 3 Hex.",
         "fx": [TURN(), ST("hex", 3)]})
card("echoing_hex", "Echoing Hex", 1, "C", "enemy", [ST("hex", 2), W(2, to="self")],
     "Echo. Apply 2 Hex. Gain 2 Ward.", cat=V, kw=["Echo"], arch=MH,
     flavour="Say it once to the foe, once to the glass.",
     note="A curse spoken into the mirror comes back out of it, twice as loud.",
     up={"text": "Echo. Apply 3 Hex. Gain 2 Ward.", "fx": [ST("hex", 3), W(2, to="self")]})
card("hand_it_back", "Hand It Back", 1, "C", "enemy", [TRANSFER("ally_most"), ST("hex", 2)],
     "Move every ailment off the other hero carrying the most onto the target. Apply 2 Hex.", cat=V,
     arch="mirrorhex+pactbound",
     flavour="You dropped this.",
     note="The Mirrorhex wipes a hero's sores onto the glass and turns it toward a foe.",
     up={"text": "Move every ailment off the other hero carrying the most onto the target. Apply 3 Hex.",
         "fx": [TRANSFER("ally_most"), ST("hex", 3)]})

# ------------------------------------------------------------------ uncommon: core
card("bind_the_fear", "Bind the Fear", 1, "U", "enemy", [UNBIND(3), STRESS(-3, to="all_allies")],
     "Unbind: take one affliction card out of the company's decks for this fight. The target suffers its when-drawn "
     "effect and gains 3 Hex. Every hero sheds 3 stress.", cat=V, arch="core+pactbound",
     flavour="Tell the poppet what you dream of. It will dream it for you now.",
     note="The Hexweaver binds a hero's nightmare into a cloth poppet with black cord.",
     up={"text": "Unbind: take one affliction card out of the company's decks for this fight. The target suffers its "
                 "when-drawn effect and gains 4 Hex. Every hero sheds 4 stress.",
         "fx": [UNBIND(4), STRESS(-4, to="all_allies")]})
card("twofold_curse", "Twofold Curse", 1, "U", "enemy", [ST("hex", 2), ST("hex", 0, per="t.hex", k=1, max=5)],
     "Apply 2 Hex. Then the target gains Hex equal to its Hex, at most 5.", cat=V, arch="doomsayer+mirrorhex",
     flavour="Tie the knot. Tie it again. Now it is two knots.",
     note="The Hexweaver loops a second cord over the first round a poppet's neck.",
     up={"text": "Apply 3 Hex. Then the target gains Hex equal to its Hex, at most 6.",
         "fx": [ST("hex", 3), ST("hex", 0, per="t.hex", k=1, max=6)]})
card("contagion", "Contagion", 1, "U", "enemy", [ST("hex", 1), ST("hex", 0, per="m.hex", k=1, to="adjacent")],
     "Apply 1 Hex. Each foe beside the target gains Hex equal to the target's Hex.", cat=V, arch=DS,
     flavour="Curses are like coughs. They want company.",
     note="Black threads run from one hexed foe to the foes on either side.",
     up={"text": "Apply 2 Hex. Each foe beside the target gains Hex equal to the target's Hex.",
         "fx": [ST("hex", 2), ST("hex", 0, per="m.hex", k=1, to="adjacent")]})
card("hedge_charm", "Hedge Charm", 1, "U", "enemy", [CONS(s="hex"), B(1, per="consumed", k=2, to="lowest_ally")],
     "Spend the target's Hex. The hero lowest on health gains 1 Block, plus 2 per Hex spent.", cat=V, arch="core",
     flavour="Unpick the curse, and knit the thread into a coat.",
     note="The Hexweaver pulls a black thread out of a foe and winds it round a wounded hero.",
     up={"text": "Spend the target's Hex. The hero lowest on health gains 4 Block, plus 2 per Hex spent.",
         "fx": [CONS(s="hex"), B(4, per="consumed", k=2, to="lowest_ally")]})
card("blight_bloom", "Blight Bloom", 1, "U", "enemy", [A(T, 2, attr="stable"), A(V, 1, attr="volatile", per="reactions", k=1)],
     "Apply 2 Toxin, then 1 Volatile Void, plus 1 per Conjunction set off this round.", cat=V, arch="core+elementalist_conjunction",
     flavour="Rot and nothing, together. Nothing grows back.",
     note="A black flower opens on a foe's chest where the Hexweaver touched it.",
     up={"text": "Apply 3 Toxin, then 2 Volatile Void, plus 1 per Conjunction set off this round.", "fx": [A(T, 3, attr="stable"), A(V, 2, attr="volatile", per="reactions", k=1)]})
card("rot_from_within", "Rot from Within", 2, "U", "enemy", [D(6, per="t.toxin", k=2), D(4, if_="flasks_used")],
     "Deal 6, plus 2 per Toxin on the target. Dosed: deal 4 more.", kw=["Dosed"], cat=T, arch="core+alchemist_plague",
     flavour="It was already rotten. I only told it so.",
     note="A Toxin-green foe splits along the seams as the Hexweaver closes a fist.",
     up={"text": "Deal 8, plus 2 per Toxin on the target. Dosed: deal 4 more.", "fx": [D(8, per="t.toxin", k=2), D(4, if_="flasks_used")]})
card("weeping_sores", "Weeping Sores", 1, "U", "enemy", [A(T, 2), A(T, 0, per="t.bleed", k=1)],
     "Apply 2 Toxin, plus 1 per Bleed on the target.", cat=T, attr="stable", hit=TOUCH,
     arch="core+duelist_bleed",
     flavour="An open cut is an open door.",
     note="The Hexweaver rubs graveyard dirt into a foe's bleeding wound.",
     up={"text": "Apply 3 Toxin, plus 1 per Bleed on the target.", "fx": [A(T, 3), A(T, 0, per="t.bleed", k=1)]})
card("witchs_ladder", "Witch's Ladder", 1, "U", "enemy", [ST("hex", 1), ST("hex", 0, per="t.spectrum", k=2)],
     "Apply 1 Hex, plus 2 per different course on the target.", cat=V, arch="core+elementalist_spectrum",
     flavour="A feather knotted in for every ill. Count them as you tie.",
     note="The Hexweaver knots a cord of coloured feathers, one for each course on a foe.",
     up={"text": "Apply 2 Hex, plus 2 per different course on the target.",
         "fx": [ST("hex", 2), ST("hex", 0, per="t.spectrum", k=2)]})

# ------------------------------------------------------------------ uncommon: pactbound
card("blood_moon", "Blood Moon", 2, "U", "enemy", [D(6, per="missing_hp", k=0.5)],
     "Costs 1 less once you carry 10 Scars. Deal 6, plus 1 per 2 HP you are missing.", cat=P,
     cost_less={"per": "scars", "k": 0.1, "max": 1}, use=KNIFE, hit=TOUCH, arch=PB,
     flavour="The thinner I bleed, the sharper the knife.",
     note="The Pactbound, pale and swaying, lunges with the bone knife under a red light.",
     up={"text": "Costs 1 less once you carry 10 Scars. Deal 8, plus 1 per 2 HP you are missing.", "fx": [D(8, per="missing_hp", k=0.5)]})
card("spill_the_rot", "Spill the Rot", 2, "U", "enemy", [TRANSFER("self"), D(2, per="consumed", k=2)],
     "Move every ailment you carry onto the target. Deal 2, plus 2 per ailment moved.", cat=V,
     arch="pactbound+mirrorhex",
     flavour="I held it all for you. Here.",
     note="The Hexweaver vomits a black cloud of rot over a foe and straightens up.",
     up={"text": "Move every ailment you carry onto the target. Deal 4, plus 2 per ailment moved.",
         "fx": [TRANSFER("self"), D(4, per="consumed", k=2)]})
card("blood_on_the_poppets", "Blood on the Poppets", 1, "U", "all_enemies", [SELFDMG(3, to="self"), ST("hex", 2), ST("hex", 2, if_="t.bleed")],
     "Lose 3 HP. Apply 2 Hex to every foe, and 2 more to each foe that bleeds.", cat=V, arch="pactbound+duelist_bleed",
     flavour="One for each of them. They all get a taste.",
     note="The Pactbound draws the knife and flicks blood across every poppet on the belt.",
     up={"text": "Lose 3 HP. Apply 3 Hex to every foe, and 2 more to each foe that bleeds.", "fx": [SELFDMG(3, to="self"), ST("hex", 3), ST("hex", 2, if_="t.bleed")]})
card("old_wounds", "Old Wounds", 1, "U", "self", [PRIME(2, per="scars", k=0.5)],
     "Prime 2, plus 1 per 2 Scars you carry.", cat=V, arch="pactbound+oracle_prime",
     flavour="Every scar points somewhere. Follow them.",
     note="The Pactbound unwinds the forearm bandage; the old cuts glow like a map.",
     up={"text": "Prime 4, plus 1 per 2 Scars you carry.", "fx": [PRIME(4, per="scars", k=0.5)]})
card("take_their_wounds", "Take Their Wounds", 1, "U", "ally_other", [GUARD(), ADD("tithe_of_blood")],
     "Guard another hero this round. Next round, a Tithe of Blood is added to their hand.", cat=V, arch="pactbound",
     flavour="Hit me instead. I know what to do with it.",
     note="The Hexweaver steps in front of a fallen hero, arms wide, poppets swinging.",
     up={"text": "Guard another hero this round. Gain 3 Block. Next round, a Tithe of Blood is added to their hand.",
         "fx": [GUARD(), B(3, to="self"), ADD("tithe_of_blood")]})

# ------------------------------------------------------------------ uncommon: doomsayer
card("toll_the_hour", "Toll the Hour", 1, "U", "enemy", [D(3), EXEC(0, per="ordo_pos", k=3)],
     "Deal 3. Execute 3 times this card's place in the Ordo.", cat=V, kw=["Execute"], arch="doomsayer+duelist_execute",
     flavour="The bell does not ask whose hour it is.",
     note="The Doomsayer strikes the staff's iron bell beside a staggering foe.",
     up={"text": "Deal 4. Execute 4 times this card's place in the Ordo.", "fx": [D(4), EXEC(0, per="ordo_pos", k=4)]})
card("passing_bell", "Passing Bell", 2, "U", "all_enemies", [ST("doom", 2), ST("doom", 2, if_="t.delayed"), ST("hex", 1)],
     "Apply 2 Doom and 1 Hex to every foe, and 2 more Doom to each foe that was Delayed this round.", cat=V, arch="doomsayer+oracle_delay",
     flavour="Rung for the dying, so the living know to pray.",
     note="The Doomsayer rings the handbell slowly, walking along the foes' line.",
     up={"text": "Apply 3 Doom and 1 Hex to every foe, and 2 more Doom to each foe that was Delayed this round.", "fx": [ST("doom", 3), ST("doom", 2, if_="t.delayed"), ST("hex", 1)]})
card("lych_gate", "Lych Gate", 2, "U", "enemy", [CONS(s="hex"), D(3), ST("doom", 0, per="consumed", k=2)],
     "Spend the target's Hex. Deal 3. It gains 2 Doom per Hex spent.", cat=V, arch="doomsayer+mirrorhex",
     flavour="Here the coffin waits, and here the curse turns to a promise.",
     note="A hexed foe stands under a roofed churchyard gate as its curse turns to Doom.",
     up={"text": "Spend the target's Hex. Deal 5. It gains 2 Doom per Hex spent, plus 2.",
         "fx": [CONS(s="hex"), D(5), ST("doom", 2, per="consumed", k=2)]})

# ------------------------------------------------------------------ uncommon: mirrorhex
card("borrowed_strength", "Borrowed Strength", 1, "U", "enemy",
     [ST("might", 1, to="lowest_ally", if_="m.might>0"), CLR("might"), ST("hex", 2)],
     "If the target has Might, the hero lowest on health gains 1 Might. The target loses all its Might. Apply 2 Hex.",
     cat=V, arch=MH,
     flavour="You won't miss it. You won't be using it.",
     note="The Mirrorhex catches a foe's strength in the glass and pours it into a hero.",
     up={"text": "If the target has Might, the hero lowest on health gains 2 Might. The target loses all its Might. "
                 "Apply 2 Hex.", "fx": [ST("might", 2, to="lowest_ally", if_="m.might>0"), CLR("might"), ST("hex", 2)]})
card("turn_the_glass", "Face in the Glass", 1, "U", "enemy", [TURN(), ST("vulnerable", 1, if_="t.hex>0")],
     "If the target attacks this round, its attack strikes a foe beside it instead. If the target has Hex, it is "
     "Vulnerable this round.", cat=V, arch="mirrorhex+duelist_strike",
     flavour="Show it its own face. Watch it flinch.",
     note="The Mirrorhex turns the glass on a hexed foe, which recoils from its reflection.",
     up={"text": "If the target attacks this round, its attack strikes a foe beside it instead. If the target has Hex, "
                 "it is Vulnerable for 2 rounds.", "fx": [TURN(), ST("vulnerable", 2, if_="t.hex>0")]})
card("glass_splinters", "Glass Splinters", 1, "U", "enemy", [D(0, per="thorns", k=2), D(2, if_="handoff")],
     "Deal 2 per Thorns you have. Handoff: deal 2 more.", cat=V, arch=MH,
     flavour="Every shard stitched in the hood has a twin.",
     note="The Mirrorhex shakes the hood and the mirror shards fly loose at a foe.",
     up={"text": "Deal 2, plus 2 per Thorns you have. Handoff: deal 2 more.", "fx": [D(2, per="thorns", k=2), D(2, if_="handoff")]})
card("backed_with_silver", "Backed with Silver", 1, "U", "ally", [B(3), ST("thorns", 2), ST("thorns", 0, per="t.block", k=0.25, max=3)],
     "A hero gains 3 Block and 2 Thorns, then 1 more Thorns per 4 Block they have, at most 3.", cat=V, arch="mirrorhex+bulwark_block",
     flavour="A mirror is only glass until you back it.",
     note="The Mirrorhex presses a silvered shard to a hero's breastplate.",
     up={"text": "A hero gains 4 Block and 3 Thorns, then 1 more Thorns per 4 Block they have, at most 3.", "fx": [B(4), ST("thorns", 3), ST("thorns", 0, per="t.block", k=0.25, max=3)]})

# ------------------------------------------------------------------ rare
card("pact_of_bones", "Pact of Bones", 0, "R", "self", [SELFDMG(9), EN(2)],
     "Lose 9 HP. Next round, +2 vigour. Exhaust.", cat=V, kw=["Exhaust"], arch=PB,
     flavour="Sign with the long bone. They always ask for the long bone.",
     note="The Pactbound scratches a mark on a bone with their own blood and snaps it.",
     up={"text": "Lose 7 HP. Next round, +2 vigour. Exhaust.", "fx": [SELFDMG(7), EN(2)]})
card("drink_deep", "Drink Deep", 2, "R", "enemy", [CONS(e=T), D(6, per="consumed", k=2, lifesteal=100), D(4, if_="flasks_used")],
     "Remove all Toxin from the target. Deal 6, plus 2 per Toxin removed. Heal the damage dealt. Dosed: deal 4 more.",
     cat=P, use=KNIFE, hit=TOUCH, arch="pactbound+alchemist_flask",
     flavour="Fen water, blood, it all goes down the same.",
     note="The Pactbound sinks the bone knife in a green-veined foe and drinks from the wound.",
     up={"text": "Remove all Toxin from the target. Deal 8, plus 2 per Toxin removed. Heal the damage dealt. Dosed: deal 4 more.",
         "fx": [CONS(e=T), D(8, per="consumed", k=2, lifesteal=100), D(4, if_="flasks_used")]})
card("sin_eater", "Sin-Eater", 1, "R", "self", [TAKESTRESS(8), TRANSFER("ally_most")],
     "Take up to 8 stress from every other hero. Move every ailment off the other hero carrying the most onto you.",
     cat=V, arch="pactbound+mirrorhex",
     flavour="Bread and salt on the breast of the dead. I eat it all.",
     note="The Hexweaver eats bread from a hero's chest while the company's shadows drain into them.",
     up={"text": "Take up to 10 stress from every other hero. Move every ailment off the other hero carrying the most onto "
                 "you.", "fx": [TAKESTRESS(10), TRANSFER("ally_most")]})
card("blood_debt", "Blood Debt", 1, "R", "enemy", [ST("doom", 0, per="scars", k=0.5)],
     "The target gains 1 Doom per 2 Scars you carry.", cat=V, arch="pactbound+doomsayer",
     flavour="Every drop I lost is written down. You will pay it back.",
     note="The Pactbound presses a bloody hand on a foe's chest and the print turns black.",
     up={"text": "The target gains 2 Doom, plus 1 per 2 Scars you carry.",
         "fx": [ST("doom", 2, per="scars", k=0.5)]})
card("deaths_ledger", "Death's Ledger", 2, "R", "enemy", [ST("doom", 0, per="t.missing_hp", k=1), ST("doom", 3, if_="t.bleed")],
     "The target gains Doom equal to the HP it is missing, and 3 more if it bleeds. Exhaust.", cat=V, kw=["Exhaust"], arch="doomsayer+duelist_bleed",
     flavour="Every wound is a line in the book. I add them up.",
     note="The Doomsayer reads a foe's wounds aloud from a cord of knots.",
     up={"text": "Apply 3 Doom. The target gains Doom equal to the HP it is missing, and 3 more if it bleeds. Exhaust.",
         "fx": [ST("doom", 3), ST("doom", 0, per="t.missing_hp", k=1), ST("doom", 3, if_="t.bleed")]})
card("witching_hour", "Witching Hour", 1, "R", "all_enemies", [ST("hex", 0, per="t.hex", k=1, max=2), ST("hex", 2, if_="last")],
     "Every foe gains Hex equal to its Hex, at most 2. Last in the Ordo: every foe gains 2 more Hex. Exhaust.", cat=V, kw=["Exhaust"], arch="doomsayer+mirrorhex",
     flavour="At this hour every knot pulls twice as tight.",
     note="Every black candle on the shoulder plate flares at once.",
     up={"text": "Every foe gains Hex equal to its Hex, at most 3. Last in the Ordo: every foe gains 2 more Hex. Exhaust.",
         "fx": [ST("hex", 0, per="t.hex", k=1, max=3), ST("hex", 2, if_="last")]})
card("bell_book_candle", "Bell, Book and Candle", 2, "R", "enemy", [ST("hex", 2), ST("doom", 0, per="t.hex", k=2, max=16), ST("doom", 4, if_="t.fire")],
     "Apply 2 Hex. The target gains 2 Doom per Hex on it, at most 16, and 4 more if it has Fire.", cat=V, arch="doomsayer+alchemist_fire",
     flavour="Ring it out, shut it out, snuff it out.",
     note="The Doomsayer rings the bell, slams a cord-bound book and pinches a candle out.",
     up={"text": "Apply 3 Hex. The target gains 2 Doom per Hex on it, at most 20, and 4 more if it has Fire.",
         "fx": [ST("hex", 3), ST("doom", 0, per="t.hex", k=2, max=20), ST("doom", 4, if_="t.fire")]})
card("scapegoat", "Scapegoat", 2, "R", "enemy", [TRANSFER("ally_most"), ST("hex", 5), TURN()],
     "Move every ailment off the other hero carrying the most onto the target. Apply 5 Hex. If it attacks this round, its "
     "attack strikes a foe beside it instead.", cat=V, arch="mirrorhex+pactbound",
     flavour="Lay it all on the goat and drive it out among its own.",
     note="A foe, smeared with the company's sickness, turns snarling on its kin.",
     up={"text": "Move every ailment off the other hero carrying the most onto the target. Apply 7 Hex. If it attacks this "
                 "round, its attack strikes a foe beside it instead.",
         "fx": [TRANSFER("ally_most"), ST("hex", 7), TURN()]})
card("silver_tongue", "Silver Tongue", 2, "R", "all_enemies", [STEAL(), CLR("might"), ST("hex", 1), ST("hex", 1, if_="t.mark")],
     "Take every foe's Block. Every foe loses all its Might. Apply 1 Hex to every foe, and 1 more to each that is Marked.", cat=V, arch="mirrorhex+duelist_mark",
     flavour="Everything you have looks better in my glass.",
     note="The Mirrorhex sweeps the cracked mirror along the foes' line, and it fills.",
     up={"text": "Take every foe's Block. Every foe loses all its Might. Apply 2 Hex to every foe, and 1 more to each that is Marked.",
         "fx": [STEAL(), CLR("might"), ST("hex", 2), ST("hex", 1, if_="t.mark")]})
card("buried_bottle", "Buried Bottle", 1, "R", "self", [],
     "Rite: whenever a foe hits another hero, it gains 1 Hex, and 1 Doom if it has 4 or more Hex. Exhaust.", cat=V,
     kw=["Rite", "Exhaust"],
     rite={"on": "ally_hit", "fx": [ST("hex", 1), ST("doom", 1, if_="t.hex>=4")]}, arch="mirrorhex+bulwark_taunt",
     flavour="Pins, nails and hair in a stoppered bottle, buried under the door.",
     note="The Mirrorhex buries a stoppered bottle of pins under the company's threshold.",
     up={"text": "Rite: whenever a foe hits another hero, it gains 1 Hex and takes 2 damage, and gains 1 Doom if it has "
                 "4 or more Hex. Exhaust.",
         "rite": {"on": "ally_hit", "fx": [ST("hex", 1), D(2), ST("doom", 1, if_="t.hex>=4")]}})
card("malediction", "Malediction", 2, "R", "all_enemies", [ST("hex", 2, per="heroes_before", k=1), A(T, 2)],
     "Apply 2 Hex to every foe, plus 1 per other hero who has acted before this in the Ordo. Apply 2 Toxin to every foe.", cat=V, attr="stable", arch="core+doomsayer",
     flavour="Cursed in your bread, your bed, your breath, your blood.",
     note="The Hexweaver stands, for once, arms wide, cursing the whole line in green-black smoke.",
     up={"text": "Apply 3 Hex to every foe, plus 1 per other hero who has acted before this in the Ordo. Apply 2 Toxin to every foe.", "fx": [ST("hex", 3, per="heroes_before", k=1), A(T, 2)]})
card("burn_the_poppet", "Burn the Poppet", 2, "R", "enemy",
     [CONS(s="hex"), CONS(e="fire"), D(2, per="consumed", k=2), ST("hex", 0, per="consumed", k=1, to="all_enemies", if_="killed")],
     "Spend the target's Hex and Fire. Deal 2, plus 2 per stack spent. If this kills it, every foe gains 1 Hex per stack spent.",
     cat=V, arch="core+alchemist_fire",
     flavour="Into the candle with it. Watch who screams.",
     note="The Hexweaver holds a straw poppet to a black candle and it catches.",
     up={"text": "Spend the target's Hex and Fire. Deal 4, plus 2 per stack spent. If this kills it, every foe gains 1 Hex per stack spent.",
         "fx": [CONS(s="hex"), CONS(e="fire"), D(4, per="consumed", k=2),
                ST("hex", 0, per="consumed", k=1, to="all_enemies", if_="killed")]})

# ------------------------------------------------------------------ path: Pactbound
card("scar_tally", "Scar Tally", 1, "X", "enemy", [D(3), ST("bleed", 0, per="scars", k=0.25, max=4)],
     "Deal 3. Apply 1 Bleed per 4 Scars you carry, at most 4.", cat=P, use=KNIFE, hit=TOUCH, sub=PB, arch="pactbound+duelist_bleed",
     flavour="I keep count on the arm. The knife keeps count on you.",
     note="The Pactbound bares a forearm of tally cuts and slashes a foe.",
     up={"text": "Deal 5. Apply 1 Bleed per 4 Scars you carry, at most 4.", "fx": [D(5), ST("bleed", 0, per="scars", k=0.25, max=4)]})
card("let_it_run", "Let It Run", 0, "X", "self", [SELFDMG(2), DRAW(1)],
     "Lose 2 HP. Next round, draw 1 more.", cat=V, sub=PB, arch=PB,
     flavour="Don't bind it yet. It's telling me things.",
     note="Blood drips from the Pactbound's cut arm onto a row of poppets, which twitch.",
     up={"text": "Lose 1 HP. Next round, draw 1 more.", "fx": [SELFDMG(1), DRAW(1)]})
card("take_the_curse_in", "Take the Curse In", 1, "X", "enemy", [UNBIND(4), PRIME(3)],
     "Unbind: take one affliction card out of the company's decks for this fight. The target suffers its when-drawn effect and gains 4 Hex. Prime 3.", cat=V, sub=PB, arch="pactbound+core",
     flavour="I swallowed your fear. Now I spit it out.",
     note="The Pactbound bites a cloth poppet open and a hero's nightmare pours out at a foe.",
     up={"text": "Unbind: take one affliction card out of the company's decks for this fight. The target suffers its when-drawn effect and gains 5 Hex. Prime 4.", "fx": [UNBIND(5), PRIME(4)]})
card("bear_the_burden", "Bear the Burden", 1, "X", "self", [TRANSFER("ally_most"), SELF("might", 1)],
     "Move every ailment off the other hero carrying the most onto you. Gain 1 Might.", cat=V, sub=PB, arch=PB,
     flavour="The heavier the load, the harder I hit.",
     note="The Pactbound shoulders a hero's sickness like a sack and squares up.",
     up={"text": "Move every ailment off the other hero carrying the most onto you. Gain 2 Might.",
         "fx": [TRANSFER("ally_most"), SELF("might", 2)]})
card("blood_for_blood", "Blood for Blood", 2, "X", "enemy", [D(6, per="ailments", k=2), D(0, per="t.bleed", k=1)],
     "Deal 6, plus 2 per ailment you carry and 1 per Bleed on the target.", cat=P, use=KNIFE, hit=TOUCH, sub=PB, arch="pactbound+duelist_bleed",
     flavour="Every sore you gave me, I give back with an edge.",
     note="A blistered, poisoned Pactbound drives the bone knife in to the hilt.",
     up={"text": "Deal 8, plus 2 per ailment you carry and 1 per Bleed on the target.", "fx": [D(8, per="ailments", k=2), D(0, per="t.bleed", k=1)]})
card("knock_at_the_door", "Knock at the Door", 2, "X", "enemy", [D(8), D(12, if_="dd")],
     "Deal 8. If you are at Death's Door, deal 12 more.", cat=P, use=KNIFE, hit=TOUCH, sub=PB, arch=PB,
     flavour="I've stood on that step. I know who answers.",
     note="The Pactbound, grey-lipped at Death's Door, strikes with everything left.",
     up={"text": "Deal 10. If you are at Death's Door, deal 15 more.", "fx": [D(10), D(15, if_="dd")]})

# ------------------------------------------------------------------ path: Doomsayer
card("prophet_of_doom", "Prophet of Doom", 1, "X", "enemy", [ST("doom", 4), ST("doom", 3, if_="spent_before>=4")],
     "Apply 4 Doom. If 4 or more vigour was spent before this in the Ordo, apply 3 more.", cat=V, sub=DS, arch=DS,
     flavour="Your name is on the bell. I can read it from here.",
     note="The Doomsayer holds the bell staff high and points at a foe.",
     up={"text": "Apply 5 Doom. If 4 or more vigour was spent before this in the Ordo, apply 4 more.", "fx": [ST("doom", 5), ST("doom", 4, if_="spent_before>=4")]})
card("harbinger", "Harbinger", 2, "X", "enemy", [ST("doom", 4), ST("hex", 3), ST("vulnerable", 2, if_="first")],
     "Apply 4 Doom and 3 Hex. First in the Ordo: the target is Vulnerable for 2 rounds.", cat=V, sub=DS, arch="doomsayer+duelist_strike",
     flavour="Before the end comes, it sends a bell ahead of it.",
     note="The Doomsayer walks up to a foe ringing the handbell in its face.",
     up={"text": "Apply 5 Doom and 4 Hex. First in the Ordo: the target is Vulnerable for 2 rounds.",
         "fx": [ST("doom", 5), ST("hex", 4), ST("vulnerable", 2, if_="first")]})
card("the_final_hour", "The Final Hour", 2, "X", "enemy", [D(5), EXEC(6, if_="!last"), EXEC(12, if_="last"), ST("doom", 2, to="all_enemies", if_="killed")],
     "Costs 1 less once 3 cards are in the Ordo. Deal 5. Execute 6, or 12 if this is last in the Ordo. If this kills, "
     "every foe gains 2 Doom.", cat=V, kw=["Execute"], sub=DS, arch=DS, cost_less={"per": "ordo", "k": 0.34, "max": 1},
     flavour="The last stroke of the hour. Then quiet.",
     note="The Doomsayer swings the bell staff and the struck foe falls silent mid-cry.",
     up={"text": "Costs 1 less once 3 cards are in the Ordo. Deal 6. Execute 8, or 15 if this is last in the Ordo. If "
                 "this kills, every foe gains 3 Doom.",
         "fx": [D(6), EXEC(8, if_="!last"), EXEC(15, if_="last"), ST("doom", 3, to="all_enemies", if_="killed")]})
card("death_watch", "Death Watch", 1, "X", "self", [],
     "Rite: whenever a foe dies, every foe gains 3 Doom, and 2 more if the dead foe was Marked. Exhaust.", cat=V,
     kw=["Rite", "Exhaust"], sub=DS,
     rite={"on": "kill", "fx": [ST("doom", 3, to="all_enemies"), ST("doom", 2, to="all_enemies", if_="m.mark")]},
     arch=DS + "+duelist_mark",
     flavour="The beetle in the beam ticks for the next of you.",
     note="The Doomsayer kneels by a fallen foe and listens to the walls.",
     up={"text": "Rite: whenever a foe dies, every foe gains 3 Doom and 1 Hex, and 2 more Doom if the dead foe was "
                 "Marked. Exhaust.",
         "rite": {"on": "kill", "fx": [ST("doom", 3, to="all_enemies"), ST("hex", 1, to="all_enemies"),
                                       ST("doom", 2, to="all_enemies", if_="m.mark")]}})
card("nine_tailors", "Nine Tailors", 2, "X", "all_enemies", [ST("doom", 0, per="t.hex", k=1), BANK(1, to="self")],
     "Every foe gains 1 Doom per Hex on it. Bank 1.", cat=V, sub=DS, arch=DS,
     flavour="Nine strokes for the dead, then one for every year. Count yours.",
     note="The Doomsayer rings the staff bell nine times; the hexed foes kneel.",
     up={"text": "Every foe gains 2 Doom, plus 1 per Hex on it. Bank 1.", "fx": [ST("doom", 2, per="t.hex", k=1), BANK(1, to="self")]})
card("toll_of_bells", "Toll of Bells", 1, "X", "all_enemies", [DBL(s="doom")],
     "Double the Doom on every foe. Exhaust.", cat=V, kw=["Exhaust"], sub=DS, arch=DS,
     flavour="Every bell in the drowned towers answers mine.",
     note="The Doomsayer rings both bells at once and distant bells answer.",
     up={"text": "Apply 2 Doom to every foe, then double the Doom on every foe. Exhaust.",
         "fx": [ST("doom", 2), DBL(s="doom")]})

# ------------------------------------------------------------------ path: Mirrorhex
card("mirror_skin", "Mirror Skin", 2, "X", "all_allies", [ST("thorns", 2), W(1), ST("thorns", 1, if_="t.taunt")],
     "Every hero gains 2 Thorns and 1 Ward. A hero with Taunt gains 1 more Thorns.", cat=V, sub=MH, arch="mirrorhex+bulwark_taunt",
     flavour="Wear the glass on the outside, and they cut themselves.",
     note="Shards from the Mirrorhex's hood swirl out and settle on the company's armour.",
     up={"text": "Every hero gains 3 Thorns and 1 Ward. A hero with Taunt gains 1 more Thorns.", "fx": [ST("thorns", 3), W(1), ST("thorns", 1, if_="t.taunt")]})
card("return_to_sender", "Return to Sender", 1, "X", "enemy", [D(0, per="incoming", k=0.5)],
     "Deal 1 per 2 damage the foes mean to deal this round.", cat=V, sub=MH, arch=MH,
     flavour="Whatever you send, the glass sends half of it home.",
     note="The Mirrorhex angles the cracked glass at the foes as they wind up.",
     up={"text": "Deal 3, plus 1 per 2 damage the foes mean to deal this round.",
         "fx": [D(3, per="incoming", k=0.5)]})
card("crossed_glass", "Crossed Glass", 2, "X", "enemy", [TURN(), TURN(to="adjacent"), ST("hex", 2)],
     "Costs 1 less once 2 heroes are in the Ordo. If the target or a foe beside it attacks this round, that attack "
     "strikes its own neighbour instead. Apply 2 Hex.", cat=V, sub=MH, arch=MH, cost_less={"per": "heroes", "k": 0.5, "max": 1},
     flavour="Two mirrors facing. Nobody knows which one is real.",
     note="The Mirrorhex holds up two shards and the foes in the middle turn on each other.",
     up={"text": "Costs 1 less once 2 heroes are in the Ordo. If the target or a foe beside it attacks this round, "
                 "that attack strikes its own neighbour instead. Apply 4 Hex.", "fx": [TURN(), TURN(to="adjacent"), ST("hex", 4)]})
card("mirrored_curse", "Mirrored Curse", 1, "X", "enemy", [ST("hex", 3), ST("hex", 3, to="adjacent", if_="handoff")],
     "Apply 3 Hex. Handoff: also apply 3 Hex to each foe beside the target.", cat=V, sub=MH, arch="mirrorhex+doomsayer",
     flavour="Curse one, and its reflections take it too.",
     note="A foe's curse sigil appears again on the foes on either side, reversed.",
     up={"text": "Apply 4 Hex. Handoff: also apply 4 Hex to each foe beside the target.", "fx": [ST("hex", 4), ST("hex", 4, to="adjacent", if_="handoff")]})
card("thiefs_glass", "Thief's Glass", 2, "X", "enemy",
     [STEAL(), CONS(s="might"), SELF("might", 0, per="consumed", k=1, max=1), SELF("thrift", 1)],
     "Take the target's Block. The target loses all its Might, and you gain 1 Might if it had any. Gain 1 Thrift.",
     cat=V, sub=MH, arch=MH,
     flavour="It was yours in the mirror. Now it is mine in the world.",
     note="A foe's swagger slides out of it into the glass and into the Mirrorhex.",
     up={"text": "Take the target's Block. The target loses all its Might, and you gain that much Might, at most 2. Gain 1 Thrift.",
         "fx": [STEAL(), CONS(s="might"), SELF("might", 0, per="consumed", k=1, max=2), SELF("thrift", 1)]})
card("doubled_image", "Doubled Image", 1, "X", "ally", [ST("dodge", 1), W(2), ST("dodge", 1, if_="t.taunt")],
     "A hero gains 1 Dodge and 2 Ward. If they Taunt, they gain 1 more Dodge.", cat=V, sub=MH, arch="mirrorhex+bulwark_taunt",
     flavour="Strike the one in the glass. I am standing beside it.",
     note="A hero's reflection steps out of the mirror and takes the blow.",
     up={"text": "A hero gains 1 Dodge and 3 Ward. If they Taunt, they gain 1 more Dodge.", "fx": [ST("dodge", 1), W(3), ST("dodge", 1, if_="t.taunt")]})

# ------------------------------------------------------------------ legendary
card("signed_in_blood", "Signed in Blood", 1, "L", "self", [],
     "Rite: whenever you play a card on a foe, lose 1 HP, deal 4 to that foe plus 1 per HP lost, ignoring Block, and it "
     "gains 1 Bleed. Exhaust.",
     cat=V, kw=["Rite", "Exhaust"], sub=PB, arch="pactbound+duelist_bleed",
     rite={"on": "play", "fx": [SELFDMG(1), D(4, per="lost", k=1, pierce=True), ST("bleed", 1)]},
     flavour="My name, in my blood, on your contract. Every line costs us both.",
     note="The Pactbound signs a long scroll with the bone knife, and a foe bleeds at every stroke.",
     up={"text": "Gain 2 Might. Rite: whenever you play a card on a foe, lose 1 HP, deal 4 to that foe plus 1 per HP "
                 "lost, ignoring Block, and it gains 1 Bleed. Exhaust.",
         "fx": [SELF("might", 2)]})
card("the_open_door", "The Open Door", 1, "L", "self", [GRIT(1, to="self")],
     "Gain 1 Grit. Rite: at the start of each round, if you are at Death's Door, gain 2 Thrift and 1 Grit. Exhaust.",
     cat=V, kw=["Rite", "Exhaust"], sub=PB, arch="pactbound+core",
     rite={"on": "round_start", "if": "dd", "fx": [SELF("thrift", 2), GRIT(1, to="self")]},
     flavour="I have one foot over the step. The other is kicking.",
     note="The Pactbound stands in a doorway of black light, poppets ablaze.",
     up={"text": "Gain 1 Grit. Next round, +1 vigour. Rite: at the start of each round, if you are at Death's Door, "
                 "gain 2 Thrift and 1 Grit. Exhaust.", "fx": [GRIT(1, to="self"), EN(1)]})
card("the_great_bell", "The Great Bell", 2, "L", "self", [],
     "Rite: at round end, every foe gains Doom equal to its Hex, and each foe that was Delayed this round gains 2 more. "
     "Exhaust.", cat=V, kw=["Rite", "Exhaust"], sub=DS,
     arch="doomsayer+oracle_delay", rite={"on": "round_end", "fx": [ST("doom", 0, per="t.hex", k=1, to="all_enemies"),
                                                                   ST("doom", 2, to="all_enemies", if_="t.delayed")]},
     flavour="The great bell has not rung since the flood. It rings for you.",
     note="A drowned tower's great bell swings behind the Doomsayer as the foes fall still.",
     up={"text": "Apply 2 Hex to every foe. Rite: at round end, every foe gains Doom equal to its Hex, and each foe that "
                 "was Delayed this round gains 2 more. Exhaust.",
         "fx": [ST("hex", 2, to="all_enemies")]})
card("death_knell", "Death Knell", 2, "L", "self", [],
     "Rite: when a foe dies, every other foe gains its Hex, Doom and Bleed. Exhaust.", cat=V, kw=["Rite", "Exhaust"],
     sub=DS, arch=DS + "+duelist_bleed",
     rite={"on": "kill", "fx": [ST("hex", 0, per="m.hex", k=1, to="all_enemies"),
                                ST("doom", 0, per="m.doom", k=1, to="all_enemies"),
                                ST("bleed", 0, per="m.bleed", k=1, to="all_enemies")]},
     flavour="When one goes, the bell tolls for the rest of the house.",
     note="A foe falls, and black threads leap from its body to every foe still standing.",
     up={"text": "Apply 3 Doom to every foe. Rite: when a foe dies, every other foe gains its Hex, Doom and Bleed. "
                 "Exhaust.",
         "fx": [ST("doom", 3, to="all_enemies")]})
card("hall_of_mirrors", "Hall of Mirrors", 2, "L", "self", [TURN(to="all_enemies")],
     "Rite: this round and next round, every foe's attack strikes its neighbour instead. Exhaust.",
     cat=V, kw=["Rite", "Exhaust"], sub=MH, arch="mirrorhex+core",
     rite={"on": "round_start", "fx": [TURN(to="all_enemies")], "rounds": 1},
     flavour="A hundred glasses, and in every one, the face you hate.",
     note="The room fills with cracked mirrors and the foes turn on their own reflections.",
     up={"text": "Every hero gains 2 Ward. Rite: this round and next round, every foe's attack strikes "
                 "its neighbour instead. Exhaust.", "fx": [W(2, to="all_allies"), TURN(to="all_enemies")]})
card("the_witchs_glass", "The Witch's Glass", 2, "L", "self", [],
     "Rite: whenever a foe hits another hero, every ailment on the other hero carrying the most moves onto that foe, and it "
     "gains 1 Hex per ailment moved. Exhaust.", cat=V, kw=["Rite", "Exhaust"], sub=MH, arch="mirrorhex+pactbound",
     rite={"on": "ally_hit", "fx": [TRANSFER("ally_most"), ST("hex", 0, per="consumed", k=1)]},
     flavour="Whatever you lay on mine comes home to you, and brings a friend.",
     note="A great cracked mirror stands behind the company; every curse thrown at it flies back.",
     up={"text": "Every hero gains 2 Ward. Rite: whenever a foe hits another hero, every ailment on the other hero "
                 "carrying the most moves onto that foe, and it gains 1 Hex per ailment moved. Exhaust.",
         "fx": [W(2, to="all_allies")]})

ARCHETYPES = {
    PB: ["tithe_of_blood", "spite", "drain", "blood_offering", "take_the_rot", "martyrs_pin"],
    DS: ["handbell", "bad_tidings", "corpse_candle", "knell", "dirge", "hasten_the_end"],
    MH: ["mirror_shard", "silver_lie", "cracked_glass", "mirror_mirror", "echoing_hex", "borrowed_strength"],
}

HERO = {"name": "Hexweaver", "hp": 30, "armor": 0, "grit": 2, "color": "62804f", "kit": ["pass_it_on"],
        "deck": ["pin_the_poppet", "pin_the_poppet", "pin_the_poppet", "knotted_cord", "knotted_cord", "knotted_cord",
                 "evil_eye", "evil_eye", "graveyard_dirt", "blood_price"],
        "subclasses": {"pactbound": "Pactbound", "doomsayer": "Doomsayer", "mirrorhex": "Mirrorhex"},
        "blurb": "Cunning folk of Toxin and Void. Lays Hex that blunts every blow, spends it for payoffs, and hands "
                 "the company's ailments to the foes."}

NEEDS = [
    "pass_it_on: the brief lets the player choose which hero to take the ailment from (a hero picker); written as the "
    "hero carrying the most.",
    "bloodletting: the brief's 'the next Hex you apply this round is doubled' needs a Hex focus status; written as "
    "plain Hex.",
    "glint: the brief's 'the next ailment a foe lays on a hero this round lands on that foe instead' needs an "
    "ailment redirect; written as Ward and Thorns.",
    "hall_of_mirrors: the brief limits it to single-target attacks; TURN has no filter for attacks on every hero, so "
    "the text says every foe's attack.",
    "signed_in_blood: the brief wants 'HP you lose to your own cards is also dealt to a foe as true damage', which needs "
    "a self-damage Rite trigger carrying the HP lost; written on the play trigger against the card's target.",
    "the_witchs_glass: the brief redirects every ailment a foe lays on a hero, doubled; that needs an 'ailment laid' "
    "trigger. Written on ally_hit; 'consumed' must reset for each trigger.",
]
