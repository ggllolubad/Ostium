
# Ostium: Card and Enemy Redesign Plan
·

## Goal and exit criteria
Redesign every card, kit skill and enemy ability from scratch on a reviewed rules foundation, then balance the whole game so a competent player clears a world about half the time at base difficulty.
The phase is done when all of these hold:
Rules and mechanics are approved before any card is written (Stage 1).
Every calling, the Vessel, the neutral pool, the world cards, the afflictions and every enemy are designed, reviewed in card sheets and approved.
The simulator, running the game's own combat code, shows about 50% clear rate per world for a three-hero company with a strong player, no vows.
No dominant deck: no single archetype per calling clears more than 15 points above that calling's average.
No dead cards: every card is picked by the sim drafter in some winning deck, and none lowers the clear rate when added.
Every card, upgrade, enemy intent, relic, rune, gear item and Conjunction has been exercised in the sim and checked against its text.
A Windows build has been playtested by Cole, and his notes are folded in.

## Decisions so far
Cole answered these on 2026-11-25; this table is the record.
| Topic | Decision |
| Scope | Full redesign of every card. Enemies, their intents and abilities are redesigned too. |
| Rules | Small rule changes allowed; each one listed for approval. |
| Pool size | About 85 cards per calling. |
| Difficulty | About 50% clear rate per world for a competent player, no vows. |
| Company size | Balanced for three heroes; two and four checked so neither breaks. |
| Complexity | Commons simple, or set up unique interactions. Higher rarities grow in complexity and build off the basics. |
| Legendaries | New top rarity: build capstones. Offered as a boss reward: one hero picks 1 of 3 for its calling, at most one per hero per descent. |
| Upgrades | Every card gets an upgraded version. Upgrades at field camps, shrines and events, and the merchant. |
| Deck persistence | Decks reset to the starter deck each descent. Level, path and gear persist. |
| Neutral pool | A small neutral pool (about 20 cards), offered rarely. |
| World cards | 4 neutral cards per world (60 in all), offered only inside that world, themed on its Conjunction. |
| Kit skills | Cut to 1 or 2 per calling and redesigned. |
| Identities | The six callings and 18 paths stay as foundations; mechanics may move between callings, each move listed for approval. |
| Names | Every card is named fresh, in the lore's naming registers. |
| New content | The Vessel, the 15 afflictions, the world cards and the kin-world stress bonus all ship in this phase. |
| Retune scope | Enemies, gear, runes, relics, path passives and flasks may all change. |
| Order | Mechanics and rules first, then all cards at once. |
| Review | Card sheets: one sortable sheet per calling. |
| Playtest | Windows builds sent by Claude at each milestone. |
Second round, same day:
| Topic | Decision |
| Kit skills | Cut and redesigned (confirmed). |
| Enemies | Every creature's intents and abilities are fully designed in this phase. |
| The Vessel | A full pool of about 85 cards; the lore's 14 become its starter and signature cards. |
| Rulers | The commission picks the ruler; if the commission leaves it unspecified or unknown, it is random. |
| Legendaries | 6 per calling, 2 per path. |
| Godot project | Cole will share it as a GitHub repo later; until then work runs on the scripts and data already here. |
Third round, same day:
| Topic | Decision |
| Vigour | A fixed pool, set by company size at the start of the fight; it never drops when a hero falls. |
| Swap | A universal move: any hero may Swap once per round for 1 vigour. |
| Virtues | Several (about 5), each a strong temporary boon. |
| Hex | Weakens the foe: 1 less damage per 2 Hex; Hexweaver cards spend Hex for payoffs. |
| Card rewards | Every hero is offered 3 cards from its calling after a won fight, and may skip. |
| Flasks | Any hero can use the company's belt; the Alchemist's cards brew, improve and refill flasks. |
| Card layout | Top to bottom: name, art, rules text with keywords underlined (hover for the definition), flavour line. Every card gets a flavour line. |
| Card art | Each card has its own illustration; its upgrade gets a variant of the same scene. |
| Power curve | Each world is tuned against the level and gear a typical company has when its door opens. |
| First world | No teaching curve: 50% like the rest. |
| Summons | Some foes and rulers may summon or call reinforcements into empty ranks (new engine mechanic). |
| Fight length | Longer: foes 4 to 6 rounds, elites 6 to 8, rulers 8 to 12. |
| Stress | Steady pressure: a long descent tests resolve about once per hero. |
| Synergy | Strong hooks: every calling stands alone but has clear payoffs with the others. |
| Talents | Redesigned per calling; Cull the Deck is replaced since decks reset. |
| Vows | Retuned in this phase, each with a measured difficulty cost. |
Fourth round, from the risk review:
| Topic | Decision |
| Legendaries | Earned at a midpoint guardian, not the ruler: the waypoint at layer 7 becomes a guardian fight (a rival claimant or the ruler's herald). Beating it offers each hero 1 of 3 legendaries for its calling. Replaces the boss-reward rule above, which failed because the ruler is the last fight and decks reset. |
| Descent time | 60 to 90 minutes per descent; fight length and fight count are tuned to fit. |
| Upgrade art | An added layer on the same scene (gilding, a stronger effect, a second figure), not a full redraw. |
Risks to manage, from the same review:
Code drift. The repo should arrive before Stage 1 code changes, not only before builds.
Sim versus human. The planner's skill is calibrated against Cole's first playtest before full balancing.
Power curve. Stage 1 writes a reference company (level, path, gear tier, runes) for each of the 15 doors.
Hex and Weaken. Weaken fades each round; Hex lasts until a card spends it.
Summons. The preview must stay exact; the existing preview test covers summons, multi-rank foes and rank changes.
The Vessel. Designed last, so it never holds up the six main callings.

## What exists today
The game data holds 513 cards and 131 enemies; the art holds 285 finished creatures, so 154 drawn creatures have no game data yet.
| Area | Today |
| Cards per calling | About 85: 6 to 8 starter, 20 to 24 common, 16 to 19 uncommon, 10 to 12 rare, 24 path cards (8 per path), 3 kit skills |
| Other cards | 10 Alchemist flasks, Swap (shared kit), 2 curses (Dread, Festering Wound) |
| Effect types | 45 effect types; the most used are damage (180), status (164), apply a course (121) and Block (70) |
| Enemies in data | 131: 82 foes, 32 elites, 17 bosses; 111 encounters |
| Enemies drawn only | 154, including the 28 added rival rulers |
| Combat | Shared vigour of 2 per living hero; each hero draws 4; plan, then the Ordo resolves in order; ranks 1 to 4 with rank-locked cards; 6 courses and 15 Conjunctions; Death's Door and Grit; stress and resolve tests |
| Runs | 13 layers per descent; card reward of 3; no card upgrades; decks persist between descents |
Checks already run. The game's own combat code now runs headless here (Godot 4.3).
Every card was played once in a live fight: 510 exercised, no runtime errors, none without a visible effect.
554 fights with a naive planner and the starting company ran in 27 seconds; 502 were won. Single fights are easy today even for weak play.
Card text matches its effect data almost everywhere. Three cards exhaust without saying so: Oathkeeper, Sentinel, Vigour Tonic.
Hex has no effect of its own; only other cards read it.
Weaknesses are lopsided: 43 foes are weak to fire, 4 to void.

## Stage 1: mechanics and rules
Stage 1 ends with a written Combat Rules v2 that Cole approves, coded and tested in the game, before any card is written. Each rule below gets a keep, tune or change verdict backed by sim numbers.

### Rules to review
| Rule | Today | Starting proposal |
| Vigour | Shared pool, 2 per living hero (6 for three) | Decided: a fixed pool set by company size at the start of the fight. The sim sets the size per company of 2, 3 and 4. |
| Draw | 4 per hero per round, from each hero's own deck | Keep; test 3 and 5. |
| Starter deck | 10 cards, about 5 distinct | Keep 10; every starter card teaches the calling's core loop. |
| Kit skills | 3 per calling, once per round, cost vigour | 1 or 2 per calling, redesigned as the calling's signature move. Swap becomes a universal move costing 1 vigour, not a kit slot. |
| Ordo | Plan all, then resolve in order; Momentum for the same hero acting twice in a row | Keep. Momentum, Prime and Follow-up stay as the ordering mechanics. |
| Keywords | Exhaust, Retain, Echo, Prime, Follow-up | Keep; add Follow-up to the keyword list (it is used but undefined). Add Upgrade (+) and Legendary. |
| Ranks | Cards lock the user's rank and the target's rank | Keep. Each calling gets a home rank pattern so ranks stay readable. |
| Courses | Stable stacks pile up; Volatile reacts at once; stacks fall by 1 a round; Focus adds to the next application; Ward cancels stacks | Keep. Review the decay rule and the Conjunction power cap of 12. |
| Conjunctions | 15, each with its own effect | Keep all 15. Retune the swingy ones: Absolute Zero (executes a foe at 4x power or less, casts a hero to Death's Door), Freeze, Lockdown and Drown on heroes. |
| Statuses | 25 statuses | Decided: Hex weakens the foe (1 less damage per 2 Hex). Cut any status that no redesigned card uses. |
| Defence | Block clears each round (Fortify keeps it); Armor persists; Ward stops courses | Keep. Check that Armor does not outscale foes late. |
| Death's Door | At 0 HP each hit costs 1 Grit; at 0 Grit the next hit kills | Keep; tune Grit per calling. |
| Stress | Resolve test at 100: a virtue at 50+ resolve, otherwise an affliction | Keep; about 5 virtues replace Steadfast alone, and afflictions replace Dread inside worlds (below). |
| Enemy AI | Visible intents, deterministic rule lists, boss phases | Keep the model; every enemy gets a fuller intent set (Stage 4). |

### New systems
Rarity ladder. Starter, Common, Uncommon, Rare, Path, Legendary; outside it sit Kit, Flask, Neutral, World, Curse and Affliction.
Upgrades. Each card carries an upgrade block that overrides its numbers or text; an upgraded card shows a +. Field camps offer rest or upgrade one card; some shrines and events upgrade; the merchant sells upgrades for gold.
Legendaries. At the midpoint guardian (layer 7), each hero picks 1 of 3 legendaries for its calling; at most one per hero per descent.
Decks reset each descent. The return home stops writing decks back to the roster. Talents that edit the deck (Cull the Deck) are replaced. Run-only deck edits (removal at shrines) stay.
Afflictions. A failed resolve test inside a world adds that world's affliction; Dread stays for practice rooms and the finale. Values start from the lore doc table.
Neutral and world pools. Reward weights: calling pool first, the neutral pool rarely, the world's 4 cards only inside that world.
Kin-world bonus. A path gains less stress in its kin world; starting value 20%.
The Vessel. The body rule (courses never harm it and never form a Conjunction on it), a new effect that takes courses from a target onto itself, and a "holds all six" check.
Weakness rebalance. Holy and light foes become weak to void; creatures of heat and haste weak to frost, on every foe.

## Stage 2: the simulator
The simulator drives the game's own combat and run code in headless Godot, so its numbers cannot drift from what the player gets. It is built alongside Stage 1, because the rules verdicts need its numbers.

### Three layers
Card check. Plays every card and every upgrade once in a live fight; fails on a runtime error, a card with no effect, or a card whose result differs from its text.
Fight sim. A planner that tries orderings of the company's hands through the game's own preview, then scores the result: foe HP removed, kills, hero HP, Death's Door and stress. A weak planner runs beside it to bracket player skill.
Descent sim. Whole 13-layer descents: map choices, card rewards picked by a drafter that learns card values, upgrades at camps, merchants, events, relics and the boss legendary.

### What it measures
| Measure | Used for | Target |
| Clear rate per world, strong planner, three heroes | Difficulty | About 50% |
| Clear rate with two and four heroes | Company size | Neither breaks: within 15 points of three |
| Clear rate per calling, path and company | Dominant decks | No archetype more than 15 points above its calling's average |
| Card pick rate and clear rate with the card in deck | Dead and dominant cards | Every card picked in some winning deck; none lowers the clear rate |
| Damage, Block and courses per vigour | Card costing | Each rarity inside its band |
| HP lost per fight by tier | Pacing | Foes cheap, elites costly, rulers the main cause of losses; a descent plays in 60 to 90 minutes (estimated from actions per fight, then checked in playtests) |
| Enemy damage share, fight length, kills | Enemy tuning | No foe dominates losses; foes last 4 to 6 rounds, elites 6 to 8, rulers 8 to 12 |
For scale: today 554 simple fights run in 27 seconds. The planner is slower, so batches run in parallel and finish in minutes, not hours.

## Stage 3: all cards at once
All seven callings and the shared pools are designed together on the approved rules, about 700 cards in all, each with an upgrade.

### Per calling (about 85 cards)
| Rarity | Count | Role |
| Starter | 5 distinct (10 in the deck) | Teach the calling's core loop. |
| Common | 24 | Simple verbs, or a setup that opens a unique interaction. About 6 per archetype. |
| Uncommon | 20 | Payoffs for the commons, and bridges between archetypes. |
| Rare | 12 | Engines and scaling that build off the basics. |
| Path | 18 (6 per path) | Deepen the path's archetype; work with its passive. |
| Legendary | 6 (2 per path) | Build capstones: each one is a win condition. Offered 3 at a time by the midpoint guardian. |
| Kit | 1 or 2 | The calling's signature move; not in the deck. |

### Design method for each calling
Brief. Fantasy, home ranks, core loop, two or three archetypes, what it gives the rest of the company, and its weakness.
Card budget. A value per vigour by rarity (for example, 1 vigour buys about 6 damage or 6 Block at common), so costs are set by rule, then corrected by the sim.
Ladder. Commons first, then the uncommons, rares, path cards and legendaries that pay them off.
Company hooks. Each calling gives the others something to use: Bulwark protects the back ranks, Oracle's Prime boosts anyone's next action, Hexweaver moves the company's afflictions onto foes.
Upgrade rule. An upgrade raises numbers by about a third, removes a drawback, or cuts the cost by 1; legendaries upgrade by gaining a new clause.
Names and art notes. Named in the lore's registers; each card gets a one-line chronicle moment for the phase 3 art.

### Shared pools
| Pool | Count | Notes |
| The Vessel | About 85, a full calling | The lore's 14 cards become its starter and signature cards. |
| Neutral | About 20 | Utility, movement, stress and supply. |
| World cards | 60 (4 per world) | Themed on the world's Conjunction; offered only inside it. |
| Afflictions | 15 | Unplayable curses, one per world. |
| Curses | Dread, Festering Wound, plus injury curses as needed | Read as wounds and fears. |
| Flasks | 10 | Belt consumables; retuned with the redesign. |

### Card sheet columns
Calling, path, rarity, name, cost, user ranks, target ranks, text, upgraded text, archetype, naming register, art note, and later the sim's pick rate and clear-rate change.

## Stage 4: enemies
Every one of the 285 drawn creatures gets a full combat design, including the 154 that have no game data yet. Enemies are designed in the same pass as the cards so both sides are built against the same rules.

### What each creature gets
| Part | Foe | Elite | Ruler |
| Role | Attacker, defender, support or afflicter | Leads its encounter | The world's Conjunction made large |
| Intents | 3 | 4 to 5 | 5 to 7, spread over phases |
| Trait (new) | 0 or 1 | 1 | 1 or 2 |
| Phases | None | None or 1 | 2 or 3 |
| AI | Rule list, readable from the intents | Rule list with reactions | Scripted opening, then rules per phase |
Traits are a small new enemy system: an effect on round start, on being hit or on death (for example, thorns, or Soak spilled on death). It is listed in Stage 1 for approval.
Resistances follow the lore rules: immune only to the courses a creature is made of, resist the courses it lives in, weak to the course that undoes it, plus the void and frost rebalance.
Numbers (HP, damage, Armor) come from a budget per tier and act, then the sim corrects them.
Intent text is generated from the effect data, so it always matches.

### Rulers and encounters
Every world has 3 rulers (45 in all): the 17 in the data plus the 28 added rival rulers.
Encounter tables are rebuilt per world and per room: the 3 regular rooms and each ruler's own room, 62 rooms in all.
Each world gets about 8 foe groups, 4 elite groups and its rulers, so a descent rarely repeats a fight.
Enemies are reviewed in the same card-sheet format: one sheet per world.

## Stages 5 and 6: review, build, balance, playtest
Work moves through five review gates; nothing goes past a gate until Cole approves it.
Gate 1: Combat Rules v2. The written rules, every change marked with its sim evidence.
Gate 2: briefs. One page per calling (fantasy, ranks, archetypes, kit, legendary win conditions) and a role map of every world's 19 creatures.
Gate 3: card and enemy sheets. Every card with its upgrade, and every creature with its intents, traits and AI. One sheet per calling and one per world; Cole edits or comments inline.
Implementation. The sheets become game data; the new rules and systems go into the game's code; the card check must pass with zero errors.
Balance passes. The sim runs; numbers move until the Stage 2 targets hold. Sheets update with each card's pick rate and clear-rate change, and every change is logged.
Gate 4: playtest. A Windows build goes to Cole with a short list of what to try. His notes go back into the sheets and the sim.
Gate 5: lock. Final sheets lock the names, text and art notes that phase 3 (card art) starts from.
A rules-only build (new rules, current cards) can go out after Gate 1, so the foundation is felt in play before the cards are written.

## Open questions
All design questions are answered (see Decisions). One item remains.
GitHub repo. Cole shares the full Godot project later; Windows builds wait for it. Rules, sim and design work run on the scripts and data already here.
