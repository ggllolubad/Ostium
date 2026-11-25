# Gate 3 independent check: instructions

You did not write this content. Your job is to find what is wrong with it before Cole (the designer) sees it. Do not
edit any content file. Write your findings to the review file named in your task, in `docs/design/gate3_review/`.

Read first: `docs/design/GATE3_SPEC.md`, `docs/design/GATE3_VOCAB.md`, `docs/design/GATE3_ENGINE_UPDATE.md`,
`docs/design/gate2/DECISIONS.md`, the "Interaction and depth" section of `docs/design/GATE3_AGENT.md`, and the
Gate 2 brief for each module you check (`docs/design/gate2/`). The engine is `scripts/combat.gd` (`_fx1` runs each
effect, `q` reads quantities, `_rite_fire` runs rites, `_trait` runs creature traits); read the parts you need to know
what an effect really does.

## What to check, card by card (or creature by creature)

1. **Text against effects.** The player reads `text`; the game runs `fx`. Every number, target, condition and keyword
   in the text must match what the effects do in the engine, including the upgrade (`up`). Flag any card where the
   text promises something the effects do not do, or the effects do something the text does not say. Pay attention to
   `to=` targets, `if_` conditions, `per`/`k`/`max` scaling, `times`, rite triggers and Exhaust.
2. **Does it work at all.** An effect that can never fire (a condition that cannot be true where the card can be
   played, a rank the card cannot reach, a rite trigger that never happens for this calling), or a combo the brief
   promises that the engine cannot produce.
3. **Balance outliers.** Cards that are clearly far stronger or weaker than their rarity peers, infinite or runaway
   loops (rites that trigger each other, refunds that pay for themselves), and 0-cost cards that are always correct.
4. **Depth.** Archetypes that are a straight line on one status, archetypes that cannot assemble from commons and
   uncommons, payoffs with no setup in the set, and company hooks the brief promises that no card delivers.
5. **Style and lore.** Dashes, padded triples, flavour that contradicts the bible, names reused from another card.

For creatures: intents whose text misdescribes their effects, AI rules that never pick a move or pick one forever,
traits that cannot trigger, numbers far outside the VOCAB tier budget, encounters that break the rank rules
(DECISIONS row 13), and creatures that do nothing against some builds or hard-counter one build with no answer.

## How to write findings

A Markdown file with one section per module. Each finding is one line:

`- [severity] id: problem. Suggested fix.`

Severity is `bug` (text and effect disagree, or it does not work), `balance`, `depth`, or `style`. Be concrete, cite
numbers, and do not pad. End with a short summary: counts by severity and the three most important problems.
