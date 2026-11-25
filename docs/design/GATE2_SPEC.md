# Gate 2 spec: calling briefs and world role maps

You are drafting part of Gate 2 of the Ostium card and enemy redesign. Cole (the designer) reviews Gate 2 before any card or enemy stat is written (Gate 3). Your output is a design brief, not final numbers.

## Read first (all paths are in /home/claude/ostium)

- `docs/design/redesign_plan.md`: the redesign plan. "Decisions so far" and "Stage 3" / "Stage 4" are binding.
- `docs/design/combat_rules_v2.md`: Combat Rules v2 (Gate 1, approved for testing). The rules every card and enemy is built on.
- `art/party/bible/`: the lore and art bible. `00_design_language.md`, `01_company.md` (the six callings and their paths), `hero_vessel.md` (the seventh calling), `afflictions.md`, `LORE_CHANGES_2026-11-23.md`, `RIVAL_RULERS.md`, and one `world_<n>_<name>.md` per world (its rulers, elites and cast, with lore and anatomy).
- `tools/content/<calling>.py`: the current (pre-redesign) cards of each calling, in the card DSL (`tools/content/dsl.py` lists every effect the engine supports). Use them to see what the engine can already do; the redesign replaces them, so do not copy them.
- `tools/content/bestiary.py` and `tools/content/worlds.py`: current enemy data for 131 creatures (pre-redesign).

## Decisions you must respect (from Cole)

- About 85 cards per calling: 5 starters (10 in deck), 24 common, 20 uncommon, 12 rare, 18 path (6 per path), 6 legendary (2 per path), 1 kit skill (a path may add a second at level 4).
- Commons are simple, or set up a unique interaction. Higher rarities build off the basics with more complexity. Legendaries are build capstones (each one a win condition), offered 3 at a time at the midpoint guardian (layer 7).
- Decks reset every descent: a build must assemble inside one descent from about 10 card offers of 3 cards each. Design archetypes that can come together from commons and uncommons, with rares and legendaries as accelerants, not requirements.
- Strong cross-calling synergy hooks: each calling gives the company something the others use (examples: Bulwark protects the back ranks, Oracle's Prime boosts anyone's next action, Hexweaver moves the company's afflictions onto foes).
- Identities stay; tweaks are allowed if listed. Cards may be renamed freely.
- Swap is a universal 1-vigour move. Vigour is a fixed pool per fight (2 per hero). Hex: a foe deals 1 less damage per 2 Hex.
- Some summons are allowed. Fights: foes 4 to 6 rounds, elites 6 to 8, rulers 8 to 12. Steady stress pressure.
- Difficulty (Cole, 2026-11-25): err on the side of harder; real players will out-play the simulator. Enemies scale with descents completed (Threat), never with which world is rolled.
- Every card gets flavour text. Card layout: name, art, description with underlined hover keywords, flavour.

## Simulator findings to design against (2026-11-25)

- With generic drafting, kit skills dominated play (Duelist's Slash was the most-used action). Kits are cut to 1 per calling.
- Late-game power came from levels, gear, runes and relics multiplying together; no single source was strong alone. Keep card power growth inside a descent, not across descents.
- Under the current rarity odds, a specific rare is seen in only about a quarter of descents. A build that needs 3 specific rares will almost never assemble.

## Deliverable A: calling brief (one per calling)

Markdown, about 1 to 1.5 pages each, with these sections:

1. **Fantasy**: one paragraph, in the lore's voice, grounded in `01_company.md` or `hero_vessel.md`.
2. **Ranks**: home ranks (1 is the front) and which ranks its cards usually hit.
3. **Core loop**: what the calling does every round, in two or three sentences, naming its resources (for example Momentum, Hex, Prime, Thorns, courses).
4. **Kit skill**: name, cost, one-line effect, and why it is not a card. Optional path kit skills at level 4 (one per path at most).
5. **Archetypes**: one per path (three), each with its plan (setup, payoff, finisher), its key commons (about 6 named concepts, no numbers needed), and what it is weak against.
6. **Company hooks**: what it gives each other calling, and what it wants from them. Name concrete pairings.
7. **Legendaries**: the six capstones (2 per path), each a one-line win condition in plain words.
8. **Weakness**: what beats this calling, so encounters can test it.
9. **Keywords**: new keywords it needs beyond Rules v2, each with a one-line definition. Prefer existing ones.
10. **Risks**: what could break balance or be unfun, and how the design guards against it.

## Deliverable B: world role map (one per world)

Markdown, about 1 page each, with these sections:

1. **World**: name, course pair, Conjunction, and what that Conjunction means for fights here (one paragraph).
2. **Roster table**: every creature in the world's bible file (rulers, elites, cast; usually 19): name | tier (foe, elite, ruler) | role (attacker, defender, support, afflicter, summoner) | rank preference | one-line combat idea grounded in its lore and anatomy | trait idea (round start, on hit, on death; foes 0 or 1, elites 1, rulers 1 or 2) | resistances by the lore rule (immune only to what it is made of, resists what it lives in, weak to what undoes it).
3. **Rulers**: for each of the 3 rulers (the world's original plus the 2 rivals from `RIVAL_RULERS.md`; Act I's Drowned Kingdom already has 3): its phases (2 or 3) with the turn in each, and the commission flavour that sends a company after it.
4. **Encounter plan**: about 8 foe groups and 4 elite groups as creature lists (2 to 4 creatures, ranks 1 to 4, large creatures take 2 ranks), each with a room from the world's rooms and a one-line tactical idea. Each ruler fights in its own room.
5. **What this world tests**: which callings and builds it pressures, so the 15 worlds together test everything.

Existing game keys: where a creature already has game data, give its key (see `tools/content/bestiary.py` and `tools/content/worlds.py`; note `cyclops_smith` is the Sparkblind Smith). New creatures get a snake_case key from their name.

## Style

- Plain, direct English. No em dashes or double hyphens; use commas, colons, full stops or brackets.
- Do not pad lists to three items; use the number the content needs.
- Ground every creature idea in its bible entry. If the bible gives nothing for a field, write "open" rather than inventing lore.
- No final numbers (HP, damage, costs) in Gate 2, except where a number is the idea itself.

Write each file to `docs/design/gate2/` as named in your task. Do not edit any other file in the repository.
