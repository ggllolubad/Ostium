# World XI: The Stilled Spire (role map)

Gate 2, Deliverable B. Roles and ideas only; numbers come at Gate 3 and scale with Threat, not with the world.

## 1. World

**The Stilled Spire.** Frost + lightning. Conjunction: **Lockdown** (on a foe: acts last this round, once per foe per round; on a hero: acts last for 2 rounds). Affliction: **Stillness** (acts last this round). Rising doom: the great clock's hand moves closer to twelve.

This world attacks the Ordo, not the HP bar. A company that wins by sequence (Prime into a payoff, Mark into an execute, Hex laid then spent, the same hero twice for Momentum, a Follow-up on the foe just hit) finds one link moved to the end of the plan, where it fires on nothing. The foes build stable frost (Weaken, which trims every hit, worst for multi-hit cards) and stable lightning (Static, which hurts a hero each time it acts, worst for heroes who play many cards), then a single Volatile touch locks a hero. Several foes lock without the Conjunction at all (written into the table, sighted, anchored), so Ward alone is not the whole answer. The answers are redundancy (two routes to the payoff), cleanse and Ward before the Volatile lands, Swap (some locks aim at a rank, not a hero), and killing the lockers first. Brass and clockwork are undone by water (it seizes them); frozen flesh by fire.

## 2. Roster

Ranks: 1 is the front. Elites of scale 2.3 and up, and every ruler, take 2 ranks.

| Creature (key) | Tier | Role | Ranks | Combat idea | Trait | Resistances |
|---|---|---|---|---|---|---|
| The Last Hour (`last_hour`) | Ruler | Afflicter | 3-4 (2 ranks) | A visible minute hand ticks toward twelve; its chime pushes heroes back in the Ordo, and at twelve the world stops. | Round start: the hand moves one step; each hero it locked last round moves it one more. | Res frost, lightning, physical; weak water |
| The Stilled College (`stilled_college`) (new) | Ruler | Afflicter | 1-2 (2 ranks) | Every arm swings down to point at one hero: a branching burn holds them in place (Lockdown). It votes on whoever led the last Ordo. | Round start: gains 1 Might for each hero locked down ("aye"). | Res frost, lightning; weak fire |
| The Great Refractor (`great_refractor`) (new) | Ruler | Afflicter | 3-4 (2 ranks) | It sights a rank, not a hero: whoever stands there when the drive clicks to a stop loses their next action. Swap and push move heroes out of the line. | Round start: the drive moves the sight one rank (shown a round ahead). | Res frost, lightning; weak water |
| The Horologist (`horologist`) | Elite | Support | 2-3 | A click of the watch stops the hero who acts first; Rewind returns an ally to its HP at the start of the round. | On death: the hours move again; every locked hero is freed. | Res frost, lightning; weak fire |
| Rime Colossus (`rime_colossus`) | Elite | Attacker | 1-2 (2 ranks) | A wound-up statue: crushing fist and freezing grip while the key turns, then a round of rewinding with no attack. | Round start: the key counts down; at 0 it rewinds that round and takes extra damage. | Imm frost; res physical; weak fire |
| The Gin Ox (`gin_ox`) (new) | Elite | Attacker | 1 | Still walking the circle: a head-down shove swings the broken sweep beam through ranks 1 and 2. | On hit by Stun, Lockdown or Anchor: ignores it and gains Block ("the dome has stopped; it has not"). | Res frost; weak fire |
| The Rodwarden (`rodwarden`) (new) | Elite | Afflicter | 2-3 | Plants the pole: the strike comes down his rods and burns flower across the floor into ranks 1 and 2 (lightning). | On hit: lightning applied to any foe is drawn to him and fed into his next strike. | Res lightning, frost; weak fire |
| Stopped Pilgrim (`stopped_pilgrim`) | Foe | Afflicter | 2-3 | Stands utterly still behind Block, then jerks: a staff blow, or an upward stare that lays frost and stress on the back rank. | None | Res frost; weak fire |
| Clock Sentry (`clock_sentry`) | Foe | Defender | 1 | Tick, then tock: a light blow then a heavy one, always in that order, so the company can plan Block for the tock. | On hit by Stun or Lockdown: ignores it; the cycle never moves. | Res physical, lightning; weak water |
| Gear Spider (`gear_spider`) | Foe | Summoner | 3-4 | Repairs: rebuilds a fallen brass ally (Sentry or Jack) once per fight at low HP; a copper web Anchors a hero (no Swap). | None | Res lightning; weak water |
| Aurora Moth (`aurora_moth`) | Foe | Afflicter | 3-4 | Wing dust lays one stable frost and one stable lightning on every hero, the fuel for every lock in the room; a dazzling beat adds stress. | None | Res frost; weak physical |
| Frozen Halberdier (`frozen_halberdier`) | Foe | Attacker | 2 | Reaches past the front with the halberd; hook and haul drags the rear hero forward and breaks the rank plan. | None | Res frost, physical; weak fire |
| Ephemeris Clerk (`ephemeris_clerk`) (new) | Foe | Afflicter | 3-4 | Writes a hero into the table: that hero acts last next round (a lock with no Conjunction, so Ward does not stop it). | None | Res frost, lightning; weak fire |
| The College Tortoise (`college_tortoise`) (new) | Foe | Defender | 1 | Two hundred years of shell: very high Armor; a slow crushing bite that slows the hero (acts last). | Round start: acts only every second round. | Res frost; weak fire |
| The Patroness (`patroness`) (new) | Foe | Support | 3-4 | Fixes a hero through the spyglass: Marked, and every foe acts on that hero first. | None | Res frost; weak fire |
| The Patroness's Monkey (`patroness_monkey`) (new) | Foe | Afflicter | 4 | Leaps onto a hero's back and bites: steals that hero's next buff (Prime, Might, Momentum, Block) and keeps it. | Round start: jumps to a new rank, swapping with an ally. | Res frost; weak fire |
| Speculum Bearer (`speculum_bearer`) (new) | Foe | Defender | 1-2 | Carries the great mirror face-out as a wall (guards the ally behind him), then swings it edge-first into a hero. | On hit: the first course stack applied to him each round is reflected onto the hero who applied it. | Res frost, lightning; weak fire |
| Clock Jack (`clock_jack`) (new) | Foe | Attacker | 2 | Saving up the hours: the strike on the bell stuns the nearest hero and adds stress for every hour saved. | Round start: saves 1 hour while it does not strike. | Res frost, lightning; weak fire |
| Gate Mastiff (`gate_mastiff`) (new) | Foe | Attacker | 1 | Lunges to the chain's length: a bite that holds the front hero in place (Anchored). | None | Res frost; weak fire |

Stress dealers among the 12 foes: Stopped Pilgrim, Aurora Moth, Clock Jack.

## 3. Rulers

**The Last Hour** (`last_hour`, room `spire_boss`). Signature: Lockdown made large.
- Phase 1, "One minute to" (full to 60%): Strike the Hour on the front, Pendulum on the back; the chime locks the hero who acted first. The hand ticks each round.
- Phase 2, "The hands spin backwards" (60% to 25%): Stop All Clocks: the company's Ordo resolves in reverse this round (shown in the intent). Every Prime, Mark and Follow-up chain must be planned backwards.
- Phase 3, "Twelve" (below 25%, or when the hand reaches twelve): Midnight every second round: every hero is locked and struck. The pivot (the Tooth) is exposed and takes extra damage; a race to finish it.
- Commission: Brother Lucan was a scribe here before the hour stopped. He asks for the pivot that holds the hands, taken before the last minute passes.

**The Stilled College** (`stilled_college`, room `spire_top`; no lecture-hall room exists, the open gallery under the stopped stars is the nearest fit).
- Phase 1, "In chapter": the Vote locks one hero a round (the one who led the Ordo); Point of Order lays frost and stress on the back rank.
- Phase 2, "The motion carried" (below 50%): the wave breaks forward. Every hero who acted twice in a row last round is locked (Momentum is punished), and the Vote now holds two heroes.
- Commission: the College has moved to claim the clock's pivot for itself. The prior wants the motion struck from the minutes before it is entered.

**The Great Refractor** (`great_refractor`, room `spire_dome`, the dome hall with the telescope pier; the room is the older round-1 dome hall, kept in the data beside `spire_orrery`).
- Phase 1, "Tracking": the sight walks the ranks one step a round (always shown); the sighted hero loses its next action. The assistant on the ladder adjusts the slow-motion handle: hitting rank 4 behind the pier (open: whether he is a separate target) delays the sight.
- Phase 2, "Turned round" (below 50%): the lens cracks across; the sight covers two adjacent ranks, and the frosted lens adds frost and lightning to both.
- Commission: someone has turned the great telescope round. It is aimed down the stair toward the door, and the abbey would rather it looked at the sky.

## 4. Encounter plan

| # | Room | Ranks 1 to 4 | Tactical idea |
|---|---|---|---|
| F1 | `spire_orrery` | Clock Sentry, Stopped Pilgrim, Aurora Moth, Gear Spider | The moth fuels locks, the sentry soaks, the spider rebuilds the sentry. Kill the moth, then the spider. |
| F2 | `spire_stair` | Frozen Halberdier, Clock Jack, Ephemeris Clerk | The clerk writes your striker last while the Jack saves up. Kill the Jack before it strikes. |
| F3 | `spire_top` | Stopped Pilgrim, Aurora Moth, Aurora Moth | Stress and course fuel from every side; cleanse or burst the moths. |
| F4 | `spire_orrery` | Gear Spider, Clock Sentry, Gear Spider | The gear loft: two rebuilds of the sentry. Water and focus fire on the spiders. |
| F5 | `spire_dome` | Gate Mastiff, Patroness, Patroness's Monkey | Anchored front, Marked target, and a thief for the buff you set up. |
| F6 | `spire_stair` | College Tortoise, Frozen Halberdier, Ephemeris Clerk | An armoured, slow wall; Toxin and Armor-break pay off, long sequences do not. |
| F7 | `spire_top` | Speculum Bearer, Clock Jack, Aurora Moth | The mirror guards the moth and returns your courses; use physical damage. |
| F8 | `spire_dome` | Stopped Pilgrim, Ephemeris Clerk, Patroness's Monkey, Aurora Moth | Four small locks and thefts: a fight against plans, not HP. |
| E1 | `spire_stair` | Frozen Halberdier, The Horologist, Ephemeris Clerk | He stops your first hero and rewinds damage; his death frees every lock. |
| E2 | `spire_top` | Rime Colossus (1-2), Aurora Moth, Stopped Pilgrim | Hold burst for the round its key runs down. |
| E3 | `spire_orrery` | The Gin Ox, Clock Sentry, Gear Spider | The ox shrugs off locks and stuns; Block for the beam, damage the sentry first. |
| E4 | `spire_dome` | Speculum Bearer, The Rodwarden, Aurora Moth | He grounds the company's lightning; switch courses or strike physically. |
| R1 | `spire_boss` | Clock Sentry, Clock Jack, The Last Hour (3-4) | Countdown fight; the Jack and the hand share the clock. |
| R2 | `spire_top` | The Stilled College (1-2), Ephemeris Clerk, The Patroness | Two kinds of lock plus a Mark; break the chain before the motion carries. |
| R3 | `spire_dome` | Speculum Bearer, Gear Spider, The Great Refractor (3-4) | Read the sight a round ahead and Swap out of it. |

## 5. What this world tests

- **Sequenced builds:** Oracle Prime and Chronomancer turn-order play, Duelist Momentum and Follow-up chains (Bladedancer, Executioner set-ups), Hexweaver lay-then-spend, Elementalist Volatile timing. Each must survive one link moving to the end.
- **Many-card turns** take Static damage; **multi-hit** cards lose most to Weaken.
- **Rewards:** Ward and cleanse before the Volatile lands, Swap discipline, water (brass) and fire (frozen flesh), and a second route to the payoff. Lockdown builds of the company's own are weak against the Gin Ox and Clock Sentry.
