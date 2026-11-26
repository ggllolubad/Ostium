"""Oracle (the Anchorite), Gate 3 card set. Brief: docs/design/gate2/calling_oracle.md. Bible: art/party/bible/01_company.md.

Paths: augur (Read the Bones: Omen from answering intents), chronomancer (The Stopped Hour: Delay, banked time, Echo),
fatebinder (The Red Thread: Prime chains read through prime_count). No Doom (DECISIONS row 1).
arch keys: chronomancer, augur, fatebinder, core; hybrids join two with "+"; company reads name the other calling's
resource (for example "fatebinder+duelist_bleed")."""
from dsl import *

set_class("oracle", [2, 3, 4], [1, 2, 3, 4])
V = "void"
CH, AU, FB = "chronomancer", "augur", "fatebinder"

# ------------------------------------------------------------------ kit
card("or_hasten", "Hasten", 1, "K", "self", [PRIME(4), PRIME(2, if_="handoff")], "Prime 4. Handoff: Prime 2 more.", cat=V,
     flavour="The sand falls a little faster for whoever moves next.",
     note="The Oracle tips the wrist hourglass toward an ally; the sand runs bright.",
     arch="core", up={"text": "Prime 5. Handoff: Prime 2 more.", "fx": [PRIME(5), PRIME(2, if_="handoff")]})
card("or_second_hand", "Second Hand", 1, "K", "enemy", [D(2), D(2, if_="last")], "Echo. Deal 2. Last in the Ordo: deal 2 more.",
     cat=V, kw=["Echo"], sub=CH,
     flavour="Turn it over. The same blow falls again.",
     note="The brass clock face on the chest shows two hands where one should be.",
     arch=CH, up={"text": "Echo. Deal 3. Last in the Ordo: deal 2 more.", "fx": [D(3), D(2, if_="last")]})
card("or_read_the_bones", "Read the Bones", 1, "K", "enemy", [OMEN(1), OMEN(1, if_="m.attacking"), OMEN(1, if_="first")],
     "Choose a foe. Gain 1 Omen, 1 more if it means to attack, and 1 more if this is first in the Ordo.", cat=V, sub=AU,
     flavour="Knucklebones on the flagstones. Three fall face down.",
     note="The Augur crouches and casts knucklebones before a raised foe.",
     arch=AU, up={"text": "Choose a foe. Gain 2 Omen, 1 more if it means to attack, and 1 more if this is first in the Ordo.",
                  "fx": [OMEN(2), OMEN(1, if_="m.attacking"), OMEN(1, if_="first")]})
card("or_bind", "Bind", 1, "K", "self", [PRIME(2, per="prime_count", k=2)],
     "Prime 2, plus 2 per Prime spent this round.", cat=V, sub=FB,
     flavour="One knot holds. Two knots bind. Three knots are a promise.",
     note="The Fatebinder ties a red thread between two of the company's wrists.",
     arch=FB, up={"text": "Prime 3, plus 2 per Prime spent this round.", "fx": [PRIME(3, per="prime_count", k=2)]})

# ------------------------------------------------------------------ starters
card("or_void_glimpse", "Void Glimpse", 1, "S", "enemy", [D(5), A(V, 1)], "Deal 5. Apply 1 Void.", cat=V, attr="stable",
     flavour="It points. The robe opens. The stars look back.",
     note="The Oracle points; the robe falls open on its sewn star charts.",
     arch="core", up={"text": "Deal 7. Apply 1 Void.", "fx": [D(7), A(V, 1)]})
card("or_foretelling", "Foretelling", 1, "S", "ally", [W(2), PRIME(3)], "A hero gains 2 Ward. Prime 3.", cat=V,
     flavour="I have heard your blow land already. Make it so.",
     note="The Oracle's long fingers rest on an ally's shoulder; faint stars cling there.",
     arch="core", up={"text": "A hero gains 3 Ward. Prime 4.", "fx": [W(3), PRIME(4)]})
card("or_stall", "Stall", 2, "S", "enemy", [DELAY(), D(4)], "Delay the target. Deal 4.", cat=V,
     flavour="Not yet.",
     note="The Oracle raises one palm; a foe's swing hangs in the air.",
     arch=CH, up={"text": "Delay the target. Deal 6.", "fx": [DELAY(), D(6)]})
card("or_drawn_veil", "Drawn Veil", 1, "S", "ally", [B(5), W(1)], "A hero gains 5 Block and 1 Ward.", cat=V,
     flavour="The linen over my eyes keeps out more than light.",
     note="A fold of violet-black robe drawn across an ally like a curtain.",
     arch="core", up={"text": "A hero gains 7 Block and 1 Ward.", "fx": [B(7), W(1)]})
card("or_time_shear", "Time Shear", 2, "S", "enemy", [D(9), A(V, 1), D(3, if_="last")],
     "Deal 9. Apply 1 Void. Last in the Ordo: deal 3 more.", cat=V, attr="stable",
     flavour="A moment cut out of the day. The foe was standing in it.",
     note="A slice of night opens across a foe, stars showing through the wound.",
     arch="core", up={"text": "Deal 12. Apply 1 Void. Last in the Ordo: deal 3 more.",
                      "fx": [D(12), A(V, 1), D(3, if_="last")]})

# ------------------------------------------------------------------ common: Chronomancer
card("or_hourglass", "Hourglass", 1, "C", "self", [EN(1), BANK(1, to="self")], "Next round, +1 vigour. Bank 1.", cat=V,
     flavour="Turn it, and the hour you did not use comes back to you.",
     note="The Oracle turns the hourglass on its chain; the last grain hangs.",
     arch=CH, up={"text": "Next round, +1 vigour. Bank 2.", "fx": [EN(1), BANK(2, to="self")]})
card("or_glimpse_ahead", "Glimpse Ahead", 0, "C", "self", [DRAW(1), STRESS(3)],
     "Next round, draw 1 more. Gain 3 stress.", cat=V,
     flavour="Seeing tomorrow is easy. Living through today after is not.",
     note="Behind the blindfold, a painted eye seems to open.",
     arch=CH + "+" + AU, up={"text": "Next round, draw 1 more. Gain 1 stress.", "fx": [DRAW(1), STRESS(1)]})
card("or_stutter", "Stutter", 1, "C", "enemy", [D(2, per="vigour_left", k=1, max=5), A(V, 1)],
     "Echo. Deal 2, plus 1 per vigour left unspent this round, at most 5. Apply 1 Void.", cat=V, attr="stable",
     kw=["Echo"],
     flavour="The moment skips, and the foe is struck twice by one blow.",
     note="Two ghost images of the same pointing hand, one a beat behind.",
     arch=CH, up={"text": "Echo. Deal 3, plus 1 per vigour left unspent this round, at most 6. Apply 1 Void.",
                  "fx": [D(3, per="vigour_left", k=1, max=6), A(V, 1)]})
card("or_late_blow", "Late Blow", 1, "C", "enemy", [D(4), D(4, if_="t.delayed")],
     "Deal 4. Deal 4 more if the target was Delayed this round.", cat=V,
     flavour="It waited for you. It should not have.",
     note="A foe frozen mid-step while a second blow arrives from behind it.",
     arch=CH, up={"text": "Deal 5. Deal 6 more if the target was Delayed this round.",
                   "fx": [D(5), D(6, if_="t.delayed")]})
card("or_quicken", "Quicken", 1, "C", "ally_other", [ST("momentum", 2), B(3)],
     "Another hero gains 2 Momentum and 3 Block.", cat=V,
     flavour="Your hour, given early. Spend it well.",
     note="Sand pours from the hourglass into an ally's open palm.",
     arch=CH + "+duelist_momentum", up={"text": "Another hero gains 3 Momentum and 4 Block.",
                                        "fx": [ST("momentum", 3), B(4)]})
card("or_stopped_sand", "Stopped Sand", 1, "C", "enemy", [D(2), DELAY(if_="t.mark")],
     "Deal 2. If the target is Marked, Delay it.", cat=V,
     flavour="The marked one waits longest, and waits open.",
     note="A Marked foe caught in still, glittering sand to the knees.",
     arch=CH + "+bulwark_mark", up={"text": "Deal 4. If the target is Marked, Delay it.",
                                    "fx": [D(4), DELAY(if_="t.mark")]})

# ------------------------------------------------------------------ common: Augur
card("or_knucklebones", "Cast the Knucklebones", 1, "C", "enemy", [D(3), A(V, 1), OMEN(2, if_="m.attacking")],
     "Deal 3. Apply 1 Void. If the target means to attack, gain 2 Omen.", cat=V, attr="stable",
     flavour="The bones fall the way the blow will.",
     note="Knucklebones skitter across the floor toward a foe's raised weapon.",
     arch=AU, up={"text": "Deal 4. Apply 1 Void. If the target means to attack, gain 3 Omen.",
                  "fx": [D(4), A(V, 1), OMEN(3, if_="m.attacking")]})
card("or_forewarn", "Forewarn", 1, "C", "ally", [B(5, per="t.incoming_to", k=0.5)],
     "A hero gains 5 Block, plus 1 per 2 damage the foes mean to deal them this round.", cat=V,
     flavour="Left shoulder. Now.",
     note="The Oracle's hand on an ally's arm, turning them a half step.",
     arch=AU, up={"text": "A hero gains 7 Block, plus 1 per 2 damage the foes mean to deal them this round.",
                  "fx": [B(7, per="t.incoming_to", k=0.5)]})
card("or_bird_bone_ward", "Bird-Bone Ward", 1, "C", "self", [W(1, to="all_allies"), OMEN(1, if_="incoming")],
     "Every hero gains 1 Ward. If any foe means to attack, gain 1 Omen.", cat=V,
     flavour="A wren's skull on a thread. It hears the course before it comes.",
     note="Tiny bird skulls on red thread hang from every hero's belt.",
     arch=AU, up={"text": "Every hero gains 1 Ward. You gain 1 more. If any foe means to attack, gain 1 Omen.",
                  "fx": [W(1, to="all_allies"), W(1, to="self"), OMEN(1, if_="incoming")]})
card("or_entrails", "Entrails", 1, "C", "enemy", [D(5), OMEN(2, if_="killed")], "Deal 5. If it kills, gain 2 Omen.",
     cat=V,
     flavour="The dead say more than the living. Mostly about you.",
     note="The Augur kneels over a fallen foe, reading what spilled.",
     arch=AU + "+" + FB, up={"text": "Deal 7. If it kills, gain 2 Omen.", "fx": [D(7), OMEN(2, if_="killed")]})
card("or_omen_bolt", "Omen Bolt", 1, "C", "enemy", [D(3, per="omen", k=1)], "Deal 3, plus 1 per Omen you hold.", cat=V,
     flavour="What I know, I throw.",
     note="A bolt of violet dark leaves the Augur's feathered hand.",
     arch=AU, up={"text": "Deal 5, plus 1 per Omen you hold.", "fx": [D(5, per="omen", k=1)]})
card("or_ill_omen", "Ill Omen", 1, "C", "enemy",
     [D(3), ST("vulnerable", 1, if_="t.attacking"), OMEN(1, if_="m.attacking")],
     "Deal 3. If the target means to attack, it becomes Vulnerable and you gain 1 Omen.", cat=V,
     flavour="Raise that arm and the stars will mark the gap under it.",
     note="A crow feather lands on a foe's raised arm.",
     arch=AU, up={"text": "Deal 5. If the target means to attack, it becomes Vulnerable and you gain 1 Omen.",
                  "fx": [D(5), ST("vulnerable", 1, if_="t.attacking"), OMEN(1, if_="m.attacking")]})

# ------------------------------------------------------------------ common: Fatebinder
card("or_knot", "Knot", 0, "C", "self", [PRIME(4, if_="handoff"), STRESS(1)], "Handoff: Prime 4. Gain 1 stress.", cat=V,
     flavour="A knot in red thread. Someone's fate just tightened.",
     note="Ink-red fingers pull a small knot tight.",
     arch=FB, up={"text": "Handoff: Prime 5. Gain 1 stress.", "fx": [PRIME(5, if_="handoff"), STRESS(1)]})
card("or_bind_fate", "Bind Fate", 1, "C", "self", [PRIME(6)], "Retain. Prime 6.", cat=V, kw=["Retain"],
     flavour="Written now. Paid when it is needed.",
     note="The Fatebinder writes one red word on the wax tablet and holds it closed.",
     arch=FB, up={"text": "Retain. Prime 8.", "fx": [PRIME(8)]})
card("or_guiding_word", "Guiding Word", 1, "C", "ally_other", [PRIME(4), ST("focus", 2)],
     "Prime 4. Another hero gains 2 Focus.", cat=V,
     flavour="Say it with me, and it lands.",
     note="Red rubric letters drift from the Oracle's lips to an ally's ear.",
     arch=FB + "+elementalist_focus", up={"text": "Prime 5. Another hero gains 3 Focus.",
                                          "fx": [PRIME(5), ST("focus", 3)]})
card("or_red_letter", "Red Letter", 1, "C", "enemy", [D(3, per="prime_count", k=3)],
     "Deal 3, plus 3 per Prime spent this round.", cat=V,
     flavour="Rubric marks the line that matters.",
     note="A single red capital letter burns across a foe's chest.",
     arch=FB, up={"text": "Deal 4, plus 4 per Prime spent this round.", "fx": [D(4, per="prime_count", k=4)]})
card("or_woven_shield", "Woven Shield", 1, "C", "all_allies", [B(1, per="prime_count", k=1, to="all_allies")],
     "Every hero gains 1 Block, plus 1 per Prime spent this round.", cat=V,
     flavour="Every thread pulled tight is a thread that holds.",
     note="A web of red thread strung between the company, catching a blow.",
     arch=FB, up={"text": "Every hero gains 2 Block, plus 1 per Prime spent this round.",
                  "fx": [B(2, per="prime_count", k=1, to="all_allies")]})
card("or_pull_the_thread", "Pull the Thread", 1, "C", "enemy", [PULL(1), D(3), A(V, 1)],
     "Pull the target forward 1. Deal 3. Apply 1 Void.", cat=V, attr="stable",
     flavour="Every fate has a loose end. Pull.",
     note="A red thread from the Fatebinder's quill hooks a back-rank foe forward.",
     arch=FB + "+bulwark_rank", up={"text": "Pull the target forward 1. Deal 5. Apply 1 Void.",
                                    "fx": [PULL(1), D(5), A(V, 1)]})

# ------------------------------------------------------------------ common: core
card("or_void_lance", "Void Lance", 1, "C", "enemy", [D(4), A(V, 1, attr="volatile")], "Deal 4. Apply 1 Volatile Void.",
     cat=V, attr="volatile",
     flavour="The void answers every course you have left in it.",
     note="A shaft of starless dark meets the colours already burning on a foe.",
     arch="core+elementalist_courses", up={"text": "Deal 6. Apply 1 Volatile Void.",
                                           "fx": [D(6), A(V, 1, attr="volatile")]})
card("or_starlit_ward", "Starlit Ward", 1, "C", "ally", [W(3), STRESS(-3)], "A hero gains 3 Ward and sheds 3 stress.",
     cat=V,
     flavour="Stars do not move for the storm. Stand behind them.",
     note="A ring of tiny stars circles an ally's head like a halo.",
     arch="core", up={"text": "A hero gains 4 Ward and sheds 4 stress.", "fx": [W(4), STRESS(-4)]})
card("or_event_horizon", "Event Horizon", 2, "C", "all_enemies", [D(2, per="reactions", k=2), A(V, 1)],
     "Deal 2 to every foe, plus 2 per Conjunction set off this round. Apply 1 Void to every foe.", cat=V,
     attr="stable",
     flavour="Where the courses meet, the door opens wider.",
     note="A dark ring spreads across the floor beneath the foes, stars at its rim.",
     arch="core+elementalist_conjunction",
     up={"text": "Deal 3 to every foe, plus 2 per Conjunction set off this round. Apply 1 Void to every foe.",
         "fx": [D(3, per="reactions", k=2), A(V, 1)]})
card("or_hollow_gaze", "Hollow Gaze", 1, "C", "enemy", [ST("mark"), STRESS(-3, to="all_allies")],
     "Mark the target. Every hero sheds 3 stress.", cat=V,
     flavour="It turns its blindfold on you. The company breathes out.",
     note="The Oracle's blind face turns toward one foe; the others seem to shrink.",
     arch="core", up={"text": "Mark the target. Every hero sheds 5 stress.",
                      "fx": [ST("mark"), STRESS(-5, to="all_allies")]})
card("or_unmaking", "Unmaking", 1, "C", "enemy", [STEAL(), D(4)], "Take the target's Block. Deal 4.", cat=V,
     flavour="What you built, the dark unbuilds, and gives to me.",
     note="A foe's shield crumbles into motes that drift to the Oracle's robe.",
     arch="core", up={"text": "Take the target's Block. Deal 6.", "fx": [STEAL(), D(6)]})
card("or_blind_spot", "Blind Spot", 1, "C", "ally", [ST("dodge", 1), W(1), B(4, if_="t.taunt")],
     "A hero dodges the next hit and gains 1 Ward. If they Taunt, they also gain 4 Block.", cat=V,
     flavour="The blow comes from where you are not looking. So look away.",
     note="An ally steps aside a hair's breadth as a blade passes.",
     arch="core+bulwark_taunt",
     up={"text": "A hero dodges the next hit and gains 2 Ward. If they Taunt, they also gain 5 Block.",
         "fx": [ST("dodge", 1), W(2), B(5, if_="t.taunt")]})

# ------------------------------------------------------------------ uncommon: Chronomancer
card("or_reverse_the_glass", "Reverse the Glass", 2, "U", "all_enemies", [DELAY(if_="t.attacking"), D(2)],
     "Delay every foe that means to attack. Deal 2 to every foe. Exhaust.", cat=V, kw=["Exhaust"],
     flavour="Every raised hand waits its turn. Mine comes first.",
     note="The Chronomancer flips a great hourglass; every foe's weapon slows.",
     arch=CH + "+" + AU, up={"text": "Delay every foe that means to attack. Deal 4 to every foe. Exhaust.",
                             "fx": [DELAY(if_="t.attacking"), D(4)]})
card("or_pendulum", "Pendulum", 2, "U", "enemy", [D(8), A(V, 1), D(4, if_="!vigour_left")],
     "Echo. Deal 8. Apply 1 Void. If no vigour is left unspent this round, deal 4 more.", cat=V,
     attr="stable", kw=["Echo"],
     flavour="It swings out. It swings back. Both ways it hurts.",
     note="The broken pendulum staff swings through a foe, and swings again.",
     arch=CH, up={"text": "Echo. Deal 11. Apply 1 Void. If no vigour is left unspent this round, deal 4 more.",
                  "fx": [D(11), A(V, 1), D(4, if_="!vigour_left")]})
card("or_borrowed_time", "Borrowed Time", 0, "U", "self", [EN(1), STRESS(7)], "Next round, +1 vigour. Gain 7 stress. Exhaust.",
     cat=V, kw=["Exhaust"],
     flavour="Time borrowed from the dark is paid back with interest.",
     note="The Oracle holds out the hourglass; a hand of shadow pours sand in.",
     arch=CH, up={"text": "Next round, +1 vigour. Gain 4 stress. Exhaust.", "fx": [EN(1), STRESS(4)]})
card("or_skipped_tooth", "Skipped Tooth", 2, "U", "all_allies",
     [ST("momentum", 1, to="all_allies"), DRAW(1, to="all_allies", if_="cost<=1")],
     "Every hero gains 1 Momentum. If this cost 1 or less, every hero also draws 1 more next round.", cat=V,
     flavour="The clock skips a tooth, and the whole company is ahead of it.",
     note="The clock face on the Chronomancer's chest spins; the company leans forward.",
     arch=CH + "+duelist_momentum",
     up={"text": "Every hero gains 2 Momentum. If this cost 1 or less, every hero also draws 1 more next round.",
         "fx": [ST("momentum", 2, to="all_allies"), DRAW(1, to="all_allies", if_="cost<=1")]})
card("or_wind_the_spring", "Wind the Spring", 1, "U", "ally_other", [CONS(s="momentum"), PRIME(0, per="consumed", k=2)],
     "Take all of another hero's Momentum. Prime 2 per Momentum taken.", cat=V,
     flavour="Your speed, wound tight, let go all at once.",
     note="The Chronomancer winds a brass key in an ally's back like a clock.",
     arch=CH + "+duelist_momentum", up={"text": "Take all of another hero's Momentum. Prime 3 per Momentum taken.",
                                        "fx": [CONS(s="momentum"), PRIME(0, per="consumed", k=3)]})

# ------------------------------------------------------------------ uncommon: Augur
card("or_fulfil_the_omen", "Fulfil the Omen", 2, "U", "enemy", [CONS(s="omen", to="self"), D(4, per="consumed", k=3)],
     "Spend all your Omen. Deal 4, plus 3 per Omen spent.", cat=V,
     flavour="I told you how it ends. Here is the end.",
     note="Every bone in the pouch flies at once, trailing violet dark.",
     arch=AU, up={"text": "Spend all your Omen. Deal 6, plus 4 per Omen spent.",
                  "fx": [CONS(s="omen", to="self"), D(6, per="consumed", k=4)]})
card("or_unheeded_warning", "Unheeded Warning", 1, "U", "enemy", [D(0, per="incoming", k=0.5)],
     "Deal half the damage the foes mean to deal this round.", cat=V,
     flavour="They were warned. They are always warned.",
     note="A foe's own raised blade turns to smoke and strikes its face.",
     arch=AU, up={"text": "Deal 2, plus half the damage the foes mean to deal this round.",
                  "fx": [D(2, per="incoming", k=0.5)]})
card("or_wheel_turns", "The Wheel Turns", 1, "U", "enemy", [TURN(), OMEN(1, if_="m.attacking")],
     "The target's attack this round strikes the foe beside it instead. If it means to attack, gain 1 Omen.", cat=V,
     flavour="Fate is a wheel. Today you are under it.",
     note="A foe's strike swerves into its neighbour; the Augur's feathers stir.",
     arch=AU, up={"text": "The target's attack this round strikes the foe beside it instead. "
                          "If it means to attack, gain 2 Omen. Deal 2.",
                  "fx": [TURN(), OMEN(2, if_="m.attacking"), D(2)]})
card("or_seen_coming", "Seen Coming", 1, "U", "self", [B(0, per="incoming_me"), OMEN(1, if_="first")],
     "Gain Block equal to the damage the foes mean to deal you. First in the Ordo: gain 1 Omen.", cat=V,
     flavour="I heard your step on the stair a year ago.",
     note="A diving foe meets the Oracle's raised palm and a wall of still stars.",
     arch=AU, up={"text": "Gain 3 Block, plus Block equal to the damage the foes mean to deal you. "
                          "First in the Ordo: gain 1 Omen.",
                  "fx": [B(3, per="incoming_me"), OMEN(1, if_="first")]})
card("or_trade_on_tomorrow", "Trade on Tomorrow", 1, "U", "self",
     [CONS(s="omen"), SELF("thrift", 1), EN(0, per="consumed", k=0.25)],
     "Spend all your Omen. Gain 1 Thrift. Next round, +1 vigour per 4 Omen spent.", cat=V,
     flavour="What I know of tomorrow, I sell to today.",
     note="The Augur pours knucklebones into the Chronomancer's hourglass.",
     arch=AU + "+" + CH, up={"text": "Spend all your Omen. Gain 1 Thrift. Next round, +1 vigour per 3 Omen spent.",
                             "fx": [CONS(s="omen"), SELF("thrift", 1), EN(0, per="consumed", k=0.34)]})

# ------------------------------------------------------------------ uncommon: Fatebinder
card("or_tapestry", "Tapestry", 2, "U", "all_enemies", [D(3, per="prime_count", k=3)],
     "Deal 3 to every foe, plus 3 per Prime spent this round.", cat=V,
     flavour="Every thread in the weave runs through them.",
     note="A red tapestry of the company's deeds unrolls, and the foes are in it.",
     arch=FB, up={"text": "Deal 4 to every foe, plus 4 per Prime spent this round.",
                  "fx": [D(4, per="prime_count", k=4)]})
card("or_red_ink", "Red Ink", 1, "U", "enemy", [PRIME(3, per="m.bleed", k=1)],
     "Choose a foe. Prime 3, plus 1 per Bleed on it.", cat=V,
     flavour="Rubric ink and blood are the same colour. I use both.",
     note="The Fatebinder dips the quill in a foe's wound and writes.",
     arch=FB + "+duelist_bleed", up={"text": "Choose a foe. Prime 4, plus 1 per Bleed on it.",
                                     "fx": [PRIME(4, per="m.bleed", k=1)]})
card("or_gathering_thread", "Gathering Thread", 1, "U", "self", [PRIME(3, per="heroes_before", k=2)],
     "Prime 3, plus 2 per other hero who has acted before this in the Ordo.", cat=V,
     flavour="Each knot tied makes the next one tighter.",
     note="Red thread winds around the Fatebinder's arm in a growing coil.",
     arch=FB, up={"text": "Prime 4, plus 3 per other hero who has acted before this in the Ordo.",
                  "fx": [PRIME(4, per="heroes_before", k=3)]})
card("or_fates_edge", "Fate's Edge", 1, "U", "enemy", [D(5), PRIME(5, if_="killed")],
     "Deal 5. If it kills, Prime 5.", cat=V,
     flavour="One thread cut. The next blow is already falling.",
     note="A foe falls; its red thread whips toward the next in line.",
     arch=FB + "+" + AU, up={"text": "Deal 7. If it kills, Prime 6.", "fx": [D(7), PRIME(6, if_="killed")]})
card("or_cut_the_cord", "Cut the Cord", 1, "U", "enemy", [D(4), EXEC(3, per="prime_count", k=3)],
     "Deal 4. Execute 3, plus 3 per Prime spent this round.", cat=V, kw=["Execute"],
     flavour="Some cords are cut. Some were never tied.",
     note="Scissors of red ink close on a thin thread above a foe's head.",
     arch=FB + "+hexweaver_doom", up={"text": "Deal 5. Execute 4, plus 4 per Prime spent this round.",
                  "fx": [D(5), EXEC(4, per="prime_count", k=4)]})

# ------------------------------------------------------------------ uncommon: core
card("or_cold_star", "Cold Star", 1, "U", "enemy", [D(3), A(V, 2, attr="volatile", if_="t.frost")],
     "Deal 3. If the target has Frost, apply 2 Volatile Void.", cat=V, attr="stable",
     flavour="Cold to cold, dark to dark. Nothing is left between.",
     note="A pale star falls on a rimed foe and the frost goes black.",
     arch="core+elementalist_frost", up={"text": "Deal 4. If the target has Frost, apply 3 Volatile Void.",
                                         "fx": [D(4), A(V, 3, attr="volatile", if_="t.frost")]})
card("or_collapse", "Collapse", 2, "U", "enemy", [CONS(e=V), CONS(e="frost"), D(4, per="consumed", k=2)],
     "Spend all Void and Frost on the target. Deal 4, plus 2 per stack spent.", cat=V,
     flavour="The door was always in it. Now it opens.",
     note="A foe folds inward around a point of starless dark.",
     arch="core+elementalist_frost", up={"text": "Spend all Void and Frost on the target. Deal 5, plus 3 per stack spent.",
                                         "fx": [CONS(e=V), CONS(e="frost"), D(5, per="consumed", k=3)]})
card("or_quiet_hour", "The Quiet Hour", 2, "U", "all_allies",
     [STRESS(-5, to="all_allies"), W(1, to="all_allies"), W(1, to="all_allies", if_="flasks_used")],
     "Every hero sheds 5 stress and gains 1 Ward. Dosed: every hero gains 1 more Ward.", cat=V, kw=["Dosed"],
     flavour="The cell was quiet for years. I bring a little of it with me.",
     note="The company sits in a circle of still candlelight; the Oracle listens.",
     arch="core+alchemist_flask",
     up={"text": "Every hero sheds 7 stress and gains 1 Ward. Dosed: every hero gains 1 more Ward.",
         "fx": [STRESS(-7, to="all_allies"), W(1, to="all_allies"), W(1, to="all_allies", if_="flasks_used")]})
card("or_unwritten", "The Unwritten", 1, "U", "enemy",
     [CONS(s="might"), CONS(s="thorns"), OMEN(0, per="consumed", k=0.5), A(V, 2), D(2)],
     "The target loses its Might and Thorns. Gain 1 Omen per 2 stacks lost. Apply 2 Void. Deal 2.", cat=V, attr="stable",
     flavour="Strength not foretold is strength that never was.",
     note="The Oracle scrapes a line off the wax tablet; a foe's spikes fall away.",
     arch="core", up={"text": "The target loses its Might and Thorns. Gain 1 Omen per 2 stacks lost. Apply 3 Void. Deal 3.",
                            "fx": [CONS(s="might"), CONS(s="thorns"), OMEN(0, per="consumed", k=0.5), A(V, 3), D(3)]})
card("or_dread_vision", "Dread Vision", 1, "U", "enemy", [A(V, 1, if_="t.hex"), D(1, per="t.void", k=2)],
     "If the target has Hex, apply 1 Void. Deal 1, plus 2 per Void on the target.", cat=V, attr="stable",
     flavour="It sees what I see. It does not survive it.",
     note="A foe stares into the Oracle's open robe and the stars stare back.",
     arch="core+hexweaver_hex", up={"text": "If the target has Hex, apply 1 Void. Deal 2, plus 3 per Void on the target.",
                                    "fx": [A(V, 1, if_="t.hex"), D(2, per="t.void", k=3)]})

# ------------------------------------------------------------------ rare
card("or_stop_time", "Stop Time", 3, "R", "all_enemies", [DELAY(), D(4), BANK(2, to="self")],
     "Delay every foe. Deal 4 to each. Bank 2. Exhaust.",
     cat=V, kw=["Exhaust"],
     flavour="Between one grain and the next, I walk among them.",
     note="Every foe hangs motionless in falling sand; the Oracle walks between.",
     arch=CH, up={"text": "Delay every foe. Deal 6 to each. Bank 2. Exhaust.", "fx": [DELAY(), D(6), BANK(2, to="self")]})
card("or_deja_vu", "Deja Vu", 1, "R", "enemy", [D(2, per="ordo_pos", k=2)],
     "Echo. Retain. Deal 2, plus 2 times this card's place in the Ordo.", cat=V, kw=["Echo", "Retain"],
     flavour="This has happened. It will happen again, harder.",
     note="The same red thread strikes a foe twice in the same place.",
     arch=CH + "+" + FB, up={"text": "Echo. Retain. Deal 3, plus 3 times this card's place in the Ordo.",
                             "fx": [D(3, per="ordo_pos", k=3)]})
card("or_stolen_hour", "Stolen Hour", 1, "R", "self",
     [CONS(s="ward"), SELF("thrift", 0, per="consumed", k=0.34, max=3), EN(1)],
     "Spend all your Ward. Gain 1 Thrift per 3 Ward spent, at most 3. Next round, +1 vigour. Exhaust.", cat=V,
     kw=["Exhaust"],
     flavour="The stars that shielded me now count the hours for me.",
     note="Stars peel off the Oracle's robe and become grains in the hourglass.",
     arch=CH, up={"text": "Spend all your Ward. Gain 1 Thrift per 2 Ward spent, at most 3. Next round, +1 vigour. Exhaust.",
                  "fx": [CONS(s="ward"), SELF("thrift", 0, per="consumed", k=0.5, max=3), EN(1)]})
card("or_scatter_the_bones", "Scatter the Bones", 2, "R", "all_enemies",
     [CONS(s="omen", to="self"), D(2, per="consumed", k=1), D(3, if_="t.bleed")],
     "Spend all your Omen. Deal 2 to every foe, plus 1 per Omen spent, and 3 more to each foe that bleeds.", cat=V,
     flavour="Every bone a foe. Every foe a bone.",
     note="The Augur flings the whole pouch; bones strike every foe at once.",
     arch=AU + "+duelist_bleed",
     up={"text": "Spend all your Omen. Deal 4 to every foe, plus 1 per Omen spent, and 3 more to each foe that bleeds.",
         "fx": [CONS(s="omen", to="self"), D(4, per="consumed", k=1), D(3, if_="t.bleed")]})
card("or_forestalled", "Forestalled", 2, "R", "enemy", [D(4), ST("stun", 1, if_="t.attacking"), DELAY(if_="!t.attacking")],
     "Deal 4. If the target means to attack, Stun it. Otherwise, Delay it.", cat=V,
     flavour="The blow you meant is already spent. You just have not felt it.",
     note="A foe's swing stops dead against a hand it never saw.",
     arch=AU + "+" + CH, up={"text": "Deal 7. If the target means to attack, Stun it. Otherwise, Delay it.",
                             "fx": [D(7), ST("stun", 1, if_="t.attacking"), DELAY(if_="!t.attacking")]})
card("or_augury_of_birds", "Augury of Birds", 1, "R", "self", [OMEN(0, per="incoming", k=0.2), DRAW(1)],
     "Rank 4 only. Gain 1 Omen per 5 damage the foes mean to deal this round. Next round, draw 1 more.", cat=V,
     use=[4],
     flavour="Watch which way the crows fly from the battle.",
     note="From the back rank, the Augur watches a flight of black birds.",
     arch=AU, up={"text": "Rank 4 only. Gain 1 Omen per 4 damage the foes mean to deal this round. "
                          "Next round, draw 1 more.",
                  "fx": [OMEN(0, per="incoming", k=0.25), DRAW(1)]})
card("or_rubric_capital", "Rubric Capital", 1, "R", "self", [CONS(s="omen"), PRIME(2, per="consumed", k=2)],
     "Spend all your Omen. Prime 2, plus 2 per Omen spent.", cat=V,
     flavour="What the bones foretold, the rubric writes in red.",
     note="A great red illuminated capital, its knotwork full of knucklebones.",
     arch=FB + "+" + AU, up={"text": "Spend all your Omen. Prime 4, plus 2 per Omen spent.",
                             "fx": [CONS(s="omen"), PRIME(4, per="consumed", k=2)]})
card("or_red_harvest", "Red Harvest", 2, "R", "enemy",
     [D(6, per="prime_count", k=4), D(4, if_="handoff"), PRIME(6, if_="killed")],
     "Deal 6, plus 4 per Prime spent this round. Handoff: deal 4 more. If it kills, Prime 6.", cat=V,
     flavour="Reap one. The thread runs on to the next.",
     note="The Fatebinder's red thread cuts down a foe and snaps toward another.",
     arch=FB, up={"text": "Deal 8, plus 5 per Prime spent this round. Handoff: deal 4 more. If it kills, Prime 8.",
                  "fx": [D(8, per="prime_count", k=5), D(4, if_="handoff"), PRIME(8, if_="killed")]})
card("or_written_ahead", "Written Ahead", 1, "R", "self", [PRIME(3), DRAW(1)],
     "Retain. Prime 3. Next round, draw 1 more.", cat=V, kw=["Retain"],
     flavour="Tomorrow's page is already inked. I only turn it.",
     note="The Fatebinder writes on a page that has not been bound yet.",
     arch=FB + "+" + CH, up={"text": "Retain. Prime 5. Next round, draw 1 more.", "fx": [PRIME(5), DRAW(1)]})
card("or_eclipse", "Eclipse", 2, "R", "all_enemies", [A(V, 1, attr="volatile", per="t.spectrum", k=1)],
     "Apply 1 Volatile Void to every foe, plus 1 per different course on it.", cat=V, attr="volatile",
     flavour="For a moment there are no stars at all.",
     note="Every light in the room goes out; only the courses on the foes glow.",
     arch="core+elementalist_spectrum", up={"text": "Apply 2 Volatile Void to every foe, plus 1 per different course on it.",
                                            "fx": [A(V, 2, attr="volatile", per="t.spectrum", k=1)]})
card("or_rewind", "Rewind", 1, "R", "ally", [CLEANSE(3), H(0, per="t.missing_hp", k=0.5)],
     "A hero is cleansed of 3 ailments, then heals half their missing HP. Exhaust.", cat=V, kw=["Exhaust"],
     flavour="Back. Back. Before the wound. Stay there.",
     note="Sand runs upward in the hourglass; an ally's wound closes.",
     arch="core", up={"text": "A hero is cleansed of 5 ailments, then heals half their missing HP. Exhaust.",
                      "fx": [CLEANSE(5), H(0, per="t.missing_hp", k=0.5)]})
card("or_painted_eye", "Painted Eye", 1, "R", "enemy", [ST("vulnerable", 1), ST("mark"), D(2)],
     "The target becomes Vulnerable and Marked. Deal 2.", cat=V,
     flavour="One eye painted on the blindfold. It never closes.",
     note="The painted eye on the Oracle's blindfold opens wide on one foe.",
     arch="core", up={"text": "The target becomes Vulnerable and Marked. Deal 5.",
                      "fx": [ST("vulnerable", 1), ST("mark"), D(5)]})

# ------------------------------------------------------------------ path: Chronomancer
card("or_stopped_clock", "Stopped Clock", 1, "X", "enemy", [DELAY(), BANK(1, to="self")], "Rank 4 only. Delay the target. Bank 1.",
     cat=V, use=[4], sub=CH,
     flavour="The clock on my chest stopped the day I walled myself in.",
     note="From the back rank, the Chronomancer stops the brass clock's hands with a finger.",
     arch=CH, up={"text": "Rank 4 only. Delay the target. Deal 2. Bank 1.", "fx": [DELAY(), D(2), BANK(1, to="self")]})
card("or_broken_pendulum", "Broken Pendulum", 2, "X", "enemy", [DELAY(), D(5, per="spent_before", k=1, max=11)],
     "Echo. Delay the target. Deal 5, plus 1 per vigour spent before this in the Ordo, at most 11.",
     cat=V, kw=["Echo"], sub=CH,
     flavour="It does not keep time any more. It takes it.",
     note="The broken pendulum staff cracks across a foe, then again a beat later.",
     arch=CH, up={"text": "Echo. Delay the target. Deal 7, plus 1 per vigour spent before this in the Ordo, at most 14.",
                  "fx": [DELAY(), D(7, per="spent_before", k=1, max=14)]})
card("or_accelerate", "Accelerate", 1, "X", "ally_other", [ST("thrift", 1), ST("momentum", 3)],
     "Another hero gains 1 Thrift and 3 Momentum.", cat=V, sub=CH,
     flavour="Your next breath, now.",
     note="The Chronomancer taps an ally's shoulder; their outline blurs forward.",
     arch=CH + "+duelist_momentum", up={"text": "Another hero gains 1 Thrift and 4 Momentum.",
                                        "fx": [ST("thrift", 1), ST("momentum", 4)]})
card("or_clock_face", "Clock Face", 1, "X", "self", [EN(1), W(2, if_="vigour_left")],
     "Next round, +1 vigour. If any vigour is left unspent this round, gain 2 Ward.", cat=V, sub=CH,
     flavour="Twelve hours on the brass. I keep one back for us.",
     note="The brass clock face on the chest glows; one numeral is missing.",
     arch=CH, up={"text": "Gain 1 Ward. Next round, +1 vigour. If any vigour is left unspent this round, gain 2 more Ward.",
                  "fx": [W(1), EN(1), W(2, if_="vigour_left")]})
card("or_repetition", "Repetition", 2, "X", "all_enemies", [D(3, per="played", k=1), A(V, 1)],
     "Echo. Deal 3 to every foe, plus 1 per other card you have played this round. Apply 1 Void to every foe.", cat=V,
     attr="stable", kw=["Echo"], sub=CH,
     flavour="Once. And once. And once.",
     note="A ring of afterimages of the Oracle's pointing hand surrounds the foes.",
     arch=CH, up={"text": "Echo. Deal 4 to every foe, plus 1 per other card you have played this round. "
                          "Apply 1 Void to every foe.", "fx": [D(4, per="played", k=1), A(V, 1)]})
card("or_run_back_the_sand", "Run Back the Sand", 1, "X", "ally", [H(3), DRAW(1)],
     "A hero heals 3. Next round, they draw 1 more.", cat=V, sub=CH,
     flavour="A minute ago you were whole. Go back there.",
     note="Grains of sand rise from an ally's wound back into the hourglass.",
     arch=CH, up={"text": "A hero heals 5. Next round, they draw 1 more.", "fx": [H(5), DRAW(1)]})

# ------------------------------------------------------------------ path: Augur
card("or_read_the_signs", "Read the Signs", 1, "X", "enemy", [D(2), OMEN(2), OMEN(1, if_="m.attacking"), OMEN(1, if_="first")],
     "Rank 4 only. Deal 2. Gain 2 Omen, 1 more if the target means to attack, and 1 more if this is first in the Ordo.",
     cat=V, use=[4], sub=AU,
     flavour="From the back, every raised arm is a sentence I can read.",
     note="From the rear rank, the Augur's feathered head tilts, listening.",
     arch=AU, up={"text": "Rank 4 only. Deal 4. Gain 2 Omen, 1 more if the target means to attack, and 1 more if this "
                          "is first in the Ordo.",
                  "fx": [D(4), OMEN(2), OMEN(1, if_="m.attacking"), OMEN(1, if_="first")]})
card("or_wring_the_bird", "Wring the Bird", 0, "X", "self", [OMEN(2), SELFDMG(1)], "Gain 2 Omen. Lose 1 HP.", cat=V,
     sub=AU,
     flavour="A small life for a long look.",
     note="The Augur's trembling hands over a dead wren, blood on the feathers.",
     arch=AU, up={"text": "Gain 3 Omen. Lose 1 HP.", "fx": [OMEN(3), SELFDMG(1)]})
card("or_foretold_ruin", "Foretold Ruin", 1, "X", "enemy",
     [D(3), D(5, if_="t.targeting_me"), OMEN(1, if_="m.targeting_me")],
     "Deal 3. If the target means to attack you, deal 5 more and gain 1 Omen.", cat=V, sub=AU,
     flavour="You came for the blind one. The blind one saw you first.",
     note="A diving foe reaches the back rank and meets a fistful of bone.",
     arch=AU, up={"text": "Deal 4. If the target means to attack you, deal 7 more and gain 1 Omen.",
                  "fx": [D(4), D(7, if_="t.targeting_me"), OMEN(1, if_="m.targeting_me")]})
card("or_knucklebone_charm", "Knucklebone Charm", 1, "X", "ally", [B(4, per="omen", k=1), W(1)],
     "A hero gains 4 Block, plus 1 per Omen you hold, and 1 Ward.", cat=V, sub=AU,
     flavour="Wear it. The bones know where you will be hit.",
     note="The Augur ties a knucklebone charm around an ally's wrist.",
     arch=AU, up={"text": "A hero gains 6 Block, plus 1 per Omen you hold, and 1 Ward.",
                  "fx": [B(6, per="omen", k=1), W(1)]})
card("or_rebuke_the_seen", "Rebuke the Seen", 2, "X", "all_enemies",
     [D(6, if_="t.attacking"), A(V, 1, if_="t.attacking"), D(3, if_="t.attacking&first")],
     "Deal 6 and apply 1 Void to every foe that means to attack. First in the Ordo: deal 3 more to each of them.", cat=V,
     attr="stable", sub=AU,
     flavour="I saw you raise your hands. All of you.",
     note="Every foe with a raised weapon is struck by a falling star.",
     arch=AU, up={"text": "Deal 8 and apply 1 Void to every foe that means to attack. First in the Ordo: deal 3 more to "
                          "each of them.",
                  "fx": [D(8, if_="t.attacking"), A(V, 1, if_="t.attacking"), D(3, if_="t.attacking&first")]})
card("or_reading_the_knots", "Reading the Knots", 1, "X", "enemy", [D(3), OMEN(1, per="m.hex", k=0.5)],
     "Deal 3. Gain 1 Omen, plus 1 per 2 Hex on the target.", cat=V, sub=AU,
     flavour="The witch's knots are a script. I read it aloud.",
     note="The Augur traces a Hexweaver's knotted cord on a foe like a line of text.",
     arch=AU + "+hexweaver_hex", up={"text": "Deal 5. Gain 1 Omen, plus 1 per 2 Hex on the target.",
                                     "fx": [D(5), OMEN(1, per="m.hex", k=0.5)]})

# ------------------------------------------------------------------ path: Fatebinder
card("or_severance", "Severance", 2, "X", "enemy", [D(8), EXEC(6, per="prime_count", k=6)],
     "Deal 8. Execute 6, plus 6 per Prime spent this round.", cat=V, kw=["Execute"], sub=FB,
     flavour="The thread was always this short. I only showed you.",
     note="The Fatebinder's quill-knife cuts a red thread above a foe; it drops.",
     arch=FB + "+hexweaver_doom", up={"text": "Deal 10. Execute 8, plus 6 per Prime spent this round.",
                  "fx": [D(10), EXEC(8, per="prime_count", k=6)]})
card("or_red_knot", "Red Knot", 0, "X", "self", [PRIME(1, per="heroes_before", k=1), STRESS(2)],
     "Prime 1, plus 1 per other hero who has acted before this in the Ordo. Gain 2 stress.", cat=V, sub=FB,
     flavour="Knot on knot on knot.",
     note="A tight red knot on a thread already full of them.",
     arch=FB, up={"text": "Prime 2, plus 1 per other hero who has acted before this in the Ordo. Gain 2 stress.",
                  "fx": [PRIME(2, per="heroes_before", k=1), STRESS(2)]})
card("or_needle_and_thread", "Needle and Thread", 1, "X", "ally_other", [PRIME(5), ST("focus", 1), B(3)],
     "Prime 5. Another hero gains 1 Focus and 3 Block.", cat=V, sub=FB,
     flavour="Stitched to your fate. Hold still.",
     note="A red needle stitches a line of rubric onto an ally's sleeve.",
     arch=FB + "+elementalist_focus", up={"text": "Prime 6. Another hero gains 2 Focus and 4 Block.",
                                          "fx": [PRIME(6), ST("focus", 2), B(4)]})
card("or_woven_mantle", "Woven Mantle", 2, "X", "all_allies", [B(3, per="heroes_before", k=1, to="all_allies")],
     "Every hero gains 3 Block, plus 1 per other hero who has acted before this in the Ordo.", cat=V, sub=FB,
     flavour="A cloak of every fate we have bent today.",
     note="A red-script mantle settles over the whole company.",
     arch=FB, up={"text": "Every hero gains 4 Block, plus 2 per other hero who has acted before this in the Ordo.",
                  "fx": [B(4, per="heroes_before", k=2, to="all_allies")]})
card("or_scarlet_line", "Scarlet Line", 1, "X", "enemy", [D(2, per="prime_count", k=4), D(3, if_="t.moved")],
     "Deal 2, plus 4 per Prime spent this round. Deal 3 more if the target was moved this round.", cat=V, sub=FB,
     flavour="Pulled out of line, it stands on mine.",
     note="A red line drawn on the floor; a dragged foe stands on it.",
     arch=FB + "+bulwark_rank",
     up={"text": "Deal 3, plus 5 per Prime spent this round. Deal 4 more if the target was moved this round.",
         "fx": [D(3, per="prime_count", k=5), D(4, if_="t.moved")]})
card("or_spill_the_ink", "Spill the Ink", 2, "X", "self", [PRIME(7), EN(1)], "Prime 7. Next round, +1 vigour.", cat=V,
     sub=FB,
     flavour="The ink horn tips. A whole chapter, written at once.",
     note="Red ink floods across the floor and runs toward an ally's feet.",
     arch=FB, up={"text": "Prime 9. Next round, +1 vigour.", "fx": [PRIME(9), EN(1)]})

# ------------------------------------------------------------------ legendary
card("or_the_last_hour", "The Last Hour", 1, "L", "self", [EN(1)],
     "Next round, +1 vigour. Rite: whenever you play an Echo card, Prime 5 and Bank 1. Exhaust.", cat=V,
     kw=["Rite", "Exhaust"], sub=CH,
     rite={"on": "play", "kw": "Echo", "fx": [PRIME(5), BANK(1, to="self")]},
     flavour="The last hour lasts as long as I say.",
     note="The brass clock face cracks; every hand points to the same hour.",
     arch=CH + "+" + FB,
     up={"text": "Next round, +1 vigour. Rite: whenever you play an Echo card, Prime 5, Bank 1 and deal 2 to every foe. "
                 "Exhaust.",
         "rite": {"on": "play", "kw": "Echo", "fx": [PRIME(5), BANK(1, to="self"), D(2, to="all_enemies")]}})
card("or_the_turned_glass", "The Turned Glass", 2, "L", "self", [W(2)],
     "Gain 2 Ward. Rite: at the start of each round, Delay the front foe and gain 1 Omen. Exhaust.", cat=V, kw=["Rite", "Exhaust"], sub=CH,
     rite={"on": "round_start", "fx": [DELAY(to="front_enemy"), OMEN(1)]},
     flavour="I turned the glass once, at the door. It has never run out.",
     note="A giant hourglass stands over the company, its sand frozen mid-fall.",
     arch=CH + "+" + AU,
     up={"text": "Gain 2 Ward. Rite: at the start of each round, Delay the front foe, deal 4 to it, and gain 1 Omen. Exhaust.",
         "rite": {"on": "round_start", "fx": [DELAY(to="front_enemy"), D(4, to="front_enemy"), OMEN(1)]}})
card("or_cassandra", "Cassandra", 1, "L", "self", [OMEN(2)],
     "Gain 2 Omen. Rite: whenever a foe hits another hero, it takes 3, plus 1 per Omen you hold, and becomes Marked. Exhaust.",
     cat=V, kw=["Rite", "Exhaust"], sub=AU,
     rite={"on": "ally_hit", "fx": [D(3, per="omen", k=1), ST("mark", 1)]},
     flavour="I told them all. None of them listened. Every one of them paid.",
     note="A foe strikes the Bulwark and recoils, a bone driven into its own arm.",
     arch=AU + "+duelist_mark",
     up={"text": "Gain 2 Omen. Every foe that means to attack becomes Vulnerable. Rite: whenever a foe hits "
                 "another hero, it takes 3, plus 1 per Omen you hold, and becomes Marked. Exhaust.",
         "fx": [OMEN(2), ST("vulnerable", 1, to="all_enemies", if_="t.attacking")]})
card("or_the_bone_pouch", "The Bone Pouch", 1, "L", "self", [OMEN(3)],
     "Gain 3 Omen. Rite: at the start of each round, every hero gains 1 Block per Omen you hold (at most 8) "
     "and 1 Ward per 2 Omen (at most 4). Exhaust.", cat=V, kw=["Rite", "Exhaust"], sub=AU,
     rite={"on": "round_start", "fx": [B(0, per="omen", k=1, max=8, to="all_allies"),
                                       W(0, per="omen", k=0.5, max=4, to="all_allies")]},
     flavour="Every bone in it once warned someone. Now they warn us.",
     note="The Augur's pouch hangs open; little bones circle the company like moons.",
     arch=AU,
     up={"text": "Gain 3 Omen. Rite: at the start of each round, gain 1 Omen, then every hero gains 1 Block per Omen "
                 "you hold (at most 8) and 1 Ward per 2 Omen (at most 4). Exhaust.",
         "rite": {"on": "round_start", "fx": [OMEN(1), B(0, per="omen", k=1, max=8, to="all_allies"),
                                              W(0, per="omen", k=0.5, max=4, to="all_allies")]}})
card("or_the_rubric", "The Rubric", 1, "L", "self", [PRIME(4)],
     "Prime 4. Rite: whenever you play a card, Prime 1, plus 1 per place that card stands in the Ordo. Exhaust.", cat=V,
     kw=["Rite", "Exhaust"], sub=FB,
     rite={"on": "play", "fx": [PRIME(1, per="ordo_pos", k=1)]},
     flavour="Every line I write in red, the world reads twice.",
     note="Red script crawls off the Fatebinder's arms onto every hero's weapon.",
     arch=FB,
     up={"text": "Prime 4. Rite: whenever you play a card, Prime 1, plus 1 per place that card stands in the Ordo, and "
                 "the most wounded hero gains 2 Block. Exhaust.",
         "rite": {"on": "play", "fx": [PRIME(1, per="ordo_pos", k=1), B(2, to="lowest_ally")]}})
card("or_the_severed_thread", "The Severed Thread", 2, "L", "enemy",
     [D(6, per="prime_count", k=4), EXEC(0, per="dealt", if_="prime_count>=3")],
     "Deal 6, plus 4 per Prime spent this round. If 3 or more Primes have been spent this round, "
     "Execute the target at the damage this dealt.", cat=V, kw=["Execute"], sub=FB,
     flavour="The third knot is the one that cuts.",
     note="Three red threads pulled taut from three heroes meet at one foe's throat.",
     arch=FB,
     up={"text": "Deal 6, plus 4 per Prime spent this round. If 3 or more Primes have been spent this round, "
                 "Execute the target at the damage this dealt. If it kills, Prime 6.",
         "fx": [D(6, per="prime_count", k=4), EXEC(0, per="dealt", if_="prime_count>=3"), PRIME(6, if_="killed")]})

# ------------------------------------------------------------------ hero
HERO = {"name": "Oracle", "hp": 28, "armor": 0, "grit": 2, "color": "6d5a8a", "kit": ["or_hasten"],
        "deck": ["or_void_glimpse", "or_void_glimpse", "or_void_glimpse", "or_foretelling", "or_foretelling",
                 "or_stall", "or_stall", "or_drawn_veil", "or_drawn_veil", "or_time_shear"],
        "subclasses": {AU: "Augur", CH: "Chronomancer", FB: "Fatebinder"},
        "blurb": "The Anchorite. Reads the foes' intents, Delays the blow that matters and Primes the company's best."}

ARCHETYPES = {
    CH: ["or_hourglass", "or_glimpse_ahead", "or_stutter", "or_late_blow", "or_quicken", "or_pendulum"],
    AU: ["or_knucklebones", "or_forewarn", "or_bird_bone_ward", "or_entrails", "or_omen_bolt", "or_fulfil_the_omen"],
    FB: ["or_knot", "or_bind_fate", "or_guiding_word", "or_red_letter", "or_woven_shield", "or_tapestry"],
}

NEEDS = [
    "Bird-Bone Ward: wanted Ward only on heroes a course intent targets, and Omen when a Ward cancels a stack.",
    "Second Hand (Chronomancer kit): wanted 'your next card this round gains Echo'; written as a small Echo hit.",
    "Read the Bones (Augur kit): wanted to reveal one foe's intent for next round as well as gain Omen.",
    "Bind (Fatebinder kit): wanted 'your next Prime also carries to the action after it at half size'.",
    "The Last Hour: wanted Echoes at full power that can echo once more; written as Prime 5 per Echo card played.",
    "The Turned Glass: wanted to Delay the foe with the strongest intent (a to='strongest_intent' target) and void "
    "damage to a foe pushed into next round; written on the front foe. The rite must fire after intents are chosen.",
    "The Rubric: wanted every Prime to also strengthen the action after it; written as Prime 3 per card played.",
    "The Severed Thread: wanted 'the action that spends the round's third Prime resolves twice'; written as an "
    "Execute at the damage dealt once 3 Primes are spent.",
    "prime_count counts actions that spent Prime, so back-to-back Prime cards merge into one and a Block card spends "
    "Prime too. The Fatebinder (Red Letter, Tapestry, Severance, The Severed Thread) wants each Prime placed this "
    "round counted instead.",
]

