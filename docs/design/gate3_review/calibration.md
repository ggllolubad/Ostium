# Gate 3 difficulty calibration

The simulation is `balance/v3_builds.sh` with N=10 runs for each company at doors 1, 7 and 13, on random worlds. That gives 30 runs per company and 210 in total.

Constants held: CONTENT_HP foe 0.55, elite 0.35, boss 0.34; CONTENT_DMG 1.1; guardian 1.1x.

Targets:
- foes take 4 to 6 rounds, elites 6 to 8, rulers 8 to 12;
- clears land at about 33 to 46%, leaning harder.

## Pass 3 (after the interaction revision, 746 cards, 2026-11-25)

| company | heroes | d1 | d7 | d13 | clears |
|---|---|---|---|---|---|
| A | bulwark last_bastion, duelist bladedancer, elementalist catalyst | 3 | 2 | 3 | 27% |
| B | bulwark ironwarden, oracle fatebinder, hexweaver doomsayer | 4 | 4 | 2 | 33% |
| C | bulwark thornguard, alchemist plaguewright, oracle augur | 7 | 2 | 4 | 43% |
| D | duelist executioner, hexweaver pactbound, alchemist apothecary (no tank) | 3 | 3 | 4 | 33% |
| E | duelist bloodletter, elementalist accumulator, oracle chronomancer | 2 | 4 | 6 | 40% |
| F | bulwark thornguard, elementalist prismatic, alchemist transmuter | 2 | 1 | 2 | 17% |
| G | duelist bladedancer, hexweaver mirrorhex, oracle augur | 3 | 5 | 6 | 47% |

The d1, d7 and d13 columns count clears out of 10 runs.

- Total: 72 of 210 (34%). Pass 2 was 33%.
- Average rounds per fight: foes 5.6, elites 7.9, guardians 10.5, bosses 11.8. All are in band, so the constants are unchanged.
- The no-tank company D went from 17% in pass 2 to 33%.
- Company F is low at 17%. Its fights are no slower than the other companies' (5.7 rounds per foe), and it loses 30 HP per foe fight against a range of 24 to 30. Its runs end earlier, at layers 3 to 7.
- At 10 runs per cell, a single cell's spread is about ±15 points. Clearing more at d13 than at d1 (companies E and G) is inside that noise.
