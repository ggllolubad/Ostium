# Card text tightening (proposal, not installed)

Problem: card rules text shrinks from size 15 down to 10 to fit under the art.
Measured with the card's own fit logic (W 186, H 252) over all 1466 card versions:

- 64 versions set at 11 or smaller, 8 of them at 10.
- The Weighing and The Weighing+ still overflow at 10 and clip.

Proposal (text_tighten.csv): rewrite 41 cards (78 versions) without changing any effect.

- After: nothing clips, nothing sets at 10, 15 versions at 11, the rest at 12 or larger.
- Numbers, targets, caps and conditions are unchanged; only wording moves.

## Wording rules used
- Rite cards drop "Exhaust." and "for the rest of the fight". The Rite keyword already says
  "Sets a lasting effect for the rest of the fight. Exhausts." (51 Rite cards carry "Exhaust." today;
  the proposal changes only the wordy ones, so approve or reject this as a global rule).
- "three times a round, when the company sets off a Conjunction on a foe" becomes
  "on the first 3 Conjunctions each round".
- "Even out your held stacks across the courses you hold" becomes "Even out your held stacks".
- "per different course you hold" becomes "per course you hold".
- "take every course stack from every other hero" becomes "take all course stacks from the other heroes".
- "your largest held course" becomes "your largest course".
- "other hero who has acted before this card this round" becomes "hero who acted before you this round".

## New phrasings to approve (not in any card today)
- "attuned Volatile" (Chain of Sigils), for "Volatile of your attuned course".
- "each course you lack", for "each course you do not hold".
- "belt flask", for "flask on the belt".

Kept as is on purpose: "means to strike/attack" (59 uses) and "2 or more" (93 uses); no "2+" shorthand.
