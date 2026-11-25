
# Ostium: Combat Rules v2 (draft)
·
This is Gate 1 of the card and enemy redesign: the rules every card and enemy will be built on. Items marked Decided come from Cole's answers; Proposed items need his approval; To test items get a simulator verdict before they are final.
Gate 1 decision (2026-11-25): Cole approved every Proposed change for testing. Each one goes into the game and the simulator, is checked against the effect it was meant to have, and is revisited if it misses.

## Every change at a glance
| # | Rule | Today | v2 | Status |
| 1 | Vigour | 2 per living hero; shrinks when a hero falls | Fixed at the fight's start: 2 per hero (4, 6, 8); never shrinks | Decided; size to test |
| 2 | Draw | 4 per hero | 4 per hero; Retain capped at a 10-card hand | Proposed |
| 3 | Kit skills | 3 per calling, always available | 1 per calling, plus 1 more from the path at level 4 | Decided (1 to 2); split proposed |
| 4 | Swap | A shared kit skill | A universal move: 1 vigour, once per hero per round | Decided |
| 5 | Follow-up | Used on cards but undefined | Keyword: stronger when it targets the same foe as the action just before it | Proposed |
| 6 | Absolute Zero | Kills a foe at 4x power HP or less; casts a hero to Death's Door | Kills a foe at 2x power or less (rulers drop to their next phase); a hero loses 2x power HP | Proposed; to test |
| 7 | Drown on a hero | 5 stress per power (up to 60) | 3 stress per power, at most 20 | Proposed |
| 8 | Freeze on a hero | Kit only for 2 rounds | Kit only for 1 round | Proposed |
| 9 | Hex | No effect of its own | A foe deals 1 less damage per 2 Hex; Hex lasts until spent | Decided |
| 10 | Weaken | Frost: -1 damage per stack, fades 1 a round | Unchanged, so it stays distinct from Hex | Decided |
| 11 | Virtues | Steadfast only | 5 virtues | Decided; list proposed |
| 12 | Afflictions | Dread everywhere | One affliction per world; Dread in practice rooms and the finale | Decided |
| 13 | Enemy moves | 2 to 5 each | By turns alive and role: foes 3, elites 4 to 5, rulers 6 to 8 | Proposed |
| 14 | Enemy traits | None | Round start, on hit or on death effects | Proposed |
| 15 | Summons | None | Some foes and rulers fill empty ranks | Decided; rules proposed |
| 16 | Fight length | Foes 3.5 rounds, elites 4.7, rulers 9.1 (strong play) | Foes 4 to 6, elites 6 to 8, rulers 8 to 12 | Decided |
| 17 | Decks | Persist between descents | Reset each descent | Decided |
| 18 | Rewards | Card offers queued per fight | Every hero is offered 3 after each won fight; skip allowed | Decided |
| 19 | Upgrades | None | Camps, shrines, events and merchants | Decided; prices proposed |
| 20 | Legendaries | None | Midpoint guardian at layer 7: each hero picks 1 of 3 | Decided |
| 21 | Levelling | About 210 XP per descent; level 10 after 2 descents | About 95 XP per descent; level 10 near door 13 | Proposed |
| 22 | Descent time | Not tracked | 60 to 90 minutes | Decided |

## What the baseline showed
The simulator played all 111 current encounters 5 times each, with the starting company (Bulwark, Duelist, Elementalist) on starter decks at full HP, under two planners. Single fights only; damage does not carry between fights yet.
| Tier | Strong planner wins | Rounds | Company HP lost | Weak planner wins | Weak planner rounds |
| Foe (310 fights) | 100% | 3.5 | 12% | 88% | 11.9 |
| Elite (160) | 100% | 4.7 | 21% | 78% | 17.4 |
| Ruler (85) | 100% | 9.1 | 67%, about 1 hero at Death's Door | 12% | 20.4 |
What each finding changes:
Foes and elites end too fast and cost too little. A strong player loses 12% HP to a foe in 3.5 rounds, against a target of 4 to 6 rounds with real attrition. Enemy HP, Block and damage rise in Stage 4 (rule 16).
Kit skills dominate play. The Duelist's kit Slash was the most-used action of all (1,822 uses, about 3 a fight) and the Bulwark's Shield Up was fourth (886). Always-available skills crowd out the hand, which supports cutting kits to 1 (rule 3).
Skill swings the result hugely. The strong planner beats every ruler; the weak one beats 2 of 17. The 50% target must name the player it is measured for, so the planner is calibrated against Cole's first playtest.
Stress pressure is light. A strong player gains about 3 stress per foe fight, 5 per elite and 27 per ruler, about 70 a descent. That is below the target of one resolve test (100 stress) per hero per descent (see Enemies).
Levelling is far too fast. Every surviving hero gets the fight's full XP: about 210 per successful descent, enough for level 7. Level 10 comes after two descents, so the power curve is flat from the third door onward (rule 21).
Pacing. A strong player takes about 5 actions a round. At roughly 10 seconds per action plus a review of the plan, a round is about a minute, which puts the target descent near 80 minutes (see The descent).

## Vigour, draw, kits, Swap and the Ordo
The round structure stays: each hero draws, the company plans every action, then the Ordo resolves them in order and the foes act.
Vigour (rule 1). The pool is set when the fight starts and never shrinks when a hero falls.
Starting size: 2 per hero (4 for two heroes, 6 for three, 8 for four).
To test: a flatter 3 plus 1 per hero (5, 6, 7). The simulator keeps whichever holds two- and four-hero companies within 15 points of three.
Unspent vigour is lost at the end of the round, as now. Cards that grant vigour next round stay.
Draw (rule 2). Each hero draws 4 a round from its own deck. Retained cards stay, but a hand never holds more than 10. Draw 3 and draw 5 are tested against the new fight lengths.
Kit skills (rule 3).
Each calling starts with 1 kit skill: its signature move, tied to its core mechanic.
Choosing a path at level 4 adds a second kit skill for that path.
A kit skill costs 1 vigour, works once per round, and is worth about 70% of a common card. It is always there, so it must never be the best play by default.
Swap (rule 4). Any hero may Swap with an adjacent hero once per round for 1 vigour. Both heroes count as moved. Anchored heroes cannot Swap.
The Ordo. Unchanged:
Momentum: a hero acting twice in a row gains 1.
Prime: the next action, from any hero, gets stronger.
Echo: the card replays at half power at the end of the plan.
Locked-down heroes act last.
Keywords (rule 5). Every keyword is underlined on the card with a hover definition.
Exhaust, Retain, Echo and Prime: unchanged.
Follow-up (new definition): stronger when it targets the same foe as the action just before it in the Ordo.
Legendary (new): a build capstone; at most one per hero per descent.
Upgraded (+) (new): the card's improved version.

## Courses and Conjunctions
The course system stays as it is; three Conjunctions are softened because one application can decide a fight outright.
Unchanged rules.
Stable stacks pile up; a Volatile application reacts at once with every other course on the target.
Stacks fall by 1 at the end of each round, except stacks applied that round.
Focus adds to the next application; Ward cancels incoming stacks.
A Conjunction's power is capped at 12; the Accumulator path raises the cap.
The 15 Conjunctions (power = the stacks applied plus the stacks consumed, up to the cap):
| Conjunction | Courses | On a foe | On a hero | v2 |
| Thermal Shock | fire + frost | Damage = power; strips Armor | Same | Keep |
| Plasma | fire + lightning | 2x power, ignores Block; Burn splashes to neighbours | Same | Keep |
| Scald | fire + water | 2x power; Vulnerable 1 round | Same | Keep |
| Combust | fire + toxin | 3x power | Same | Keep; watch, highest multiplier |
| Hollow Flame | fire + void | Burn that cannot fade or be dampened | Same | Keep |
| Lockdown | frost + lightning | Acts last this round (once per foe per round) | Acts last for 2 rounds | Keep |
| Freeze | frost + water | Loses its next action; next physical hit shatters for bonus damage | Kit only for 2 rounds | Hero: 1 round (rule 8) |
| Cryo-rot | frost + toxin | Max HP cut by power for the fight | Same | Keep |
| Absolute Zero | frost + void | Killed outright at 4x power HP or less | Cast to Death's Door | Foe: killed at 2x power or less; rulers drop to their next phase. Hero: loses 2x power HP through Block (rule 6) |
| Electrocute | lightning + water | 2x power; chains to every Soaked unit | Same | Keep |
| Neurotoxin | lightning + toxin | Next action loses its secondary effects | Same | Keep |
| Discharge | lightning + void | 2x power true damage | Same | Keep |
| Toxic Pool | toxin + water | The rank poisons its occupant for 3 rounds | Same | Keep |
| Drown | void + water | Next action is only a basic blow | 5 stress per power | Hero: 3 stress per power, at most 20 (rule 7) |
| Blight | toxin + void | No healing or Block for 2 rounds | No healing | Keep |
Why these three. At power 12, Absolute Zero kills any foe at 48 HP or less, which is most foes in one card. On a hero it skips all of their HP. Drown on a hero adds 60 stress, more than half a resolve test. Freeze takes a hero out of two whole rounds. The simulator will log every Conjunction's frequency and effect size in the descent runs, so the others get a verdict too.

## Statuses, defence, Death's Door and stress
Hex (rule 9). A hexed foe deals 1 less damage per 2 Hex, and Hex does not fade. Hexweaver cards spend Hex for payoffs. Weaken (rule 10) is unchanged: -1 damage per stack, fading by 1 a round. Weaken is a quick, wide cut from frost; Hex is a slow, lasting curse that is built up and cashed in.
Statuses. All 25 stay available to the card design. Any status that no redesigned card or enemy uses is cut at Gate 3. Tenacity, Lockdown, Freeze, Neurotoxin, Drown and Blight stay as Conjunction results.
Defence. Block clears at the start of each round unless Fortified. Armor cuts every hit and persists; Toxin lowers it. Ward cancels incoming course stacks. To test: whether stacked hero Armor (gear, runes and cards together) makes multi-hit foes useless late, with a cap of 5 as the fallback.
Death's Door. Unchanged: at 0 HP each further hit costs 1 Grit, and at 0 Grit the next hit kills. Healing brings a hero back. Grit stays per calling.
Stress. Unchanged: at 100 stress a hero is tested. With 50 or more resolve, the hero gains a virtue; otherwise the world's affliction joins its deck.
Virtues (rule 11). Each lasts the rest of the fight, and stress falls to 40. The calling weights which virtue comes up.
| Virtue | Effect |
| Steadfast | +2 Might; heal 6 (today's virtue) |
| Stalwart | Gain 6 Block at the start of each round |
| Vigilant | Draw 1 more card each round |
| Rallying | Every other hero sheds 15 stress and gains 4 Block |
| Unbowed | +2 Grit; heal 10 |
Afflictions (rule 12). An unplayable curse card that acts when drawn. Values start from the lore doc. Soak, Weaken, Static and Erode are the existing course statuses of water, frost, lightning and void, so most afflictions reuse code that already exists.
| World | Affliction | When drawn |
| I Drowned Kingdom | Drowning | Gain 2 Soak |
| II Rotmire | Fen Rot | Gain 2 Toxin |
| III Boiling Baths | Fever | Lose 2 HP; gain 1 Burn |
| IV Sulphur Pits | Black Lung | Gain 1 Toxin and 1 Burn |
| V Storm Foundry | Ringing | Gain 2 Static |
| VI Stormwrack Coast | False Light | Discard a random card from this hand (new effect) |
| VII Icebound Fleet | Frostbite | Gain 2 Weaken |
| VIII Sundered Rime | The Split | Lose 1 Armor for the fight |
| IX Hollow Barrow | Barrow Sickness | Gain 1 Toxin; cannot be healed this round (Blight) |
| X Venom Spires | Venom Tremor | Next card loses its secondary effects (Neurotoxin) |
| XI Stilled Spire | Stillness | Acts last this round (Lockdown) |
| XII White Silence | The Hush | Gain 2 Erode |
| XIII Black Pyre | Ash-Mark | Take 2 damage through Block and Armor |
| XIV Blighted Garden | The Bloom | Gain 1 Toxin and 1 Erode |
| XV Torn Sky | Seen | Vulnerable this round |

## Enemies
Every enemy keeps today's model (visible intents, a fixed rule list that picks them, phases for rulers) and gains traits and summons.
Move counts (rule 13). Set by how many times an enemy acts, adjusted by its role:
| Tier | Acts per fight | Moves | Adjusted by role |
| Foe | 4 to 6 | 3 | 2 for a swarm or brute; 4 for a caster, support or summoner |
| Elite | 6 to 8 | 4 to 5 | Leads its fight; at least one move that answers the company's setup |
| Ruler | 8 to 12 | 6 to 8 over 2 or 3 phases | Its world's Conjunction made large as the signature move |
Each move does a distinct job: hit, guard, apply a course, stress, aid an ally, set up, or summon. A regular foe never has more than 4, so a fight of 3 or 4 foes stays readable. The simulator logs which moves appear in each fight and which move decides it.
Traits (rule 14). A passive with one trigger: at round start, when hit, or on death. Examples: Thorns; spilling 2 Soak on every hero when it dies; gaining Block when an ally falls. Foes have 0 or 1, elites 1, rulers 1 or 2. Traits are shown on the enemy's info panel like statuses.
Summons (rule 15).
A summon is a visible intent that names what it calls.
The summoned enemy enters the rearmost empty rank. Enemies fill at most 4 ranks, with large enemies taking 2.
It shows no intent and does not act until the next round. It gives no XP or gold.
Each summoner has a cap per fight.
The planning preview must show the summon exactly; the existing preview test is extended to cover it.
Toughness (rule 16). HP, damage, Armor and Block come from a budget per tier and door, measured against that door's reference company (see The descent). Today's strong-play baseline (foes 3.5 rounds, elites 4.7) means foes need roughly 50% more staying power at the first door.
Stress pressure. Each world's 12 foes include 2 to 4 that deal stress. Target: a strong player's heroes reach about 100 stress once per descent, against about 70 today.
Resistances. The lore rules apply to every foe: immune only to the courses it is made of; resistant to the courses it lives in; weak to the course that undoes it. Holy and light foes become weak to void, and creatures of heat and haste to frost.

## The descent
A descent stays 13 layers, ending at the ruler, with a guardian fight added at the midpoint.
Deck reset (rule 17). Every hero starts each descent on its calling's starter deck. Level, path, talents, gear and runes stay with the hero. Talents that edit the deck (Cull the Deck) are replaced; removals bought or found during the descent still work.
Card rewards (rule 18). After each won fight, every living hero is offered 3 cards and may skip (a skip pays 10 gold).
| Fight | Common | Uncommon | Rare |
| Foe | 60% | 32% | 8% |
| Elite | 35% | 45% | 20% |
Path cards join the pool once the hero has a path. In each offer, one slot has a 10% chance to be a neutral card, and inside a world a 20% chance to be one of that world's 4 cards.
Upgrades (rule 19).
Field camp: the company either rests (each hero heals 30% of max HP) or each hero upgrades 1 card.
Merchant: an upgrade costs 60 gold; a card removal costs 75.
Some shrines and events offer an upgrade as a reward or a bargain.
Legendaries (rule 20). The waypoint at layer 7 is guarded: an elite-plus fight against a rival claimant or the ruler's herald. Winning it offers each hero 3 legendaries for its calling, of which it keeps 1. The waypoint's healing follows the fight.
Levelling (rule 21). XP per fight falls to foe 4, elite 10, guardian 16, ruler 24 (about 95 for a cleared descent). New level thresholds: 0, 60, 140, 240, 360, 500, 660, 840, 1,040, 1,260. A hero who survives every descent reaches level 4 (the path) on about the third descent and level 10 on about the fourteenth. Path passives stay at levels 4, 7 and 10.
Reference companies. The 50% target is measured against these three-hero companies, one per door in story order. They are first values, to be checked against the abbey's ostia income.
| Doors | Worlds | Level | Path | Gear | Runes per hero | Relics carried |
| 1 to 3 | Drowned Kingdom, Rotmire, Boiling Baths | 1 to 3 | None | Common | 0 | 0 to 1 |
| 4 to 6 | Sulphur Pits, Storm Foundry, Stormwrack Coast | 4 to 5 | Yes | Common and uncommon | 1 | 1 |
| 7 to 9 | Icebound Fleet, Sundered Rime, Hollow Barrow | 6 to 7 | Yes, passive 2 | Uncommon | 2 | 1 to 2 |
| 10 to 12 | Venom Spires, Stilled Spire, White Silence | 8 to 9 | Yes | Uncommon and rare | 3 | 2 |
| 13 to 15 | Black Pyre, Blighted Garden, Torn Sky | 9 to 10 | Yes, passive 3 | Rare | 3 to 4 | 2 to 3 |
Pacing (rule 22). The estimate is about one minute per round of play:
| Part of a descent | Count | Minutes each | Minutes |
| Foe fights | 7 | 5 | 35 |
| Elite fights | 2 | 7 | 14 |
| Guardian | 1 | 9 | 9 |
| Ruler | 1 | 11 | 11 |
| Map, events, rewards, camps |  |  | 12 |
| Total |  |  | 81 |
The map's node weights are tuned so a typical path has about 7 foe fights. Your playtest timings replace the estimate.

## Tests and next steps
Every To test item gets a simulator verdict, added to this doc before Gate 1 closes.
| Test | Method | Decides |
| Vigour size | Descents with 2, 3 and 4 heroes under 2 per hero, then 3 plus 1 per hero | Rule 1 |
| Draw | Draw 3, 4 and 5 at the new fight lengths | Rule 2 |
| Conjunctions | Log every Conjunction's frequency and effect in descent runs, before and after the three changes | Rule 6 and any others |
| Armor | Hero Armor reached by the reference companies against multi-hit foes | The Armor cap fallback |
| Levelling | Simulated roster across 15 doors, with failed descents and fallen heroes | Rule 21 and the reference table |
| Pacing | Actions per round and rounds per fight, converted to minutes, then checked in playtests | Rule 22 |
These tests run on today's cards and enemies, so they settle the rules, not final numbers; the numbers come once the new cards exist.
Next steps, in order:
Cole reviews this draft (Gate 1). Approve, change or reject each Proposed row; comments in the doc are fine.
Descent simulator (in progress). Whole 13-layer descents with HP carried between fights, rewards, camps and the guardian, then the tests above. Results go into this doc.
Rules coded. The approved rules go into my copy of the game, with the card check and preview tests extended. They move into the real project when the GitHub repo arrives.
Gate 2 briefs. A one-page brief for each of the 7 callings, and a role map for each world's 19 creatures.
Gate 3 sheets. All cards and enemies in card sheets for review.
