# Ostium: Abbey Hub Spec

2026-11-22 · Cole

The hub is the Abbey of the Threshold, the Limen: the last warm place in the world. The party stands in the cloister garth; each building is a place to walk into, with its keeper and its service. Art follows the revised 2D cutout style and the design bible. The prototype shows two UI styles: A, Codex, and B, Reliquary.

## How the hub works

**Navigation is physical.** The player moves by clicking buildings, doors and people in the scene, never by picking from a menu. The HUD is close to nothing (Cole, 2026-11-22).

*[Embedded diagram: abbey plan and the two click paths]*

The plan follows the lore's Benedictine layout. Leaving any interior means clicking its doorway back to the garth.

- **No menu bar, no tabs, no back button.** Every exit is a doorway, gate or stair drawn in the scene.
- **Hover is the only label.** Pointing at a building shows its name in a small rubric caption; nothing is labelled at rest.
- **The keeper's counter is the one panel.** Trading, healing and upgrades open on an object in the room: the Almoner's ledger, the Smith's anvil, the Infirmarer's table. It closes when the player steps away.
- **State shows in the world.** Unlocked services light up; locked buildings stay dark and barred; a keeper whose home world just opened stands at the door to speak.
- **Always visible:** ostia (lead badges in a small dish) and the road's next door. Nothing else.

## Locations

Nine places, each with one keeper and one object that opens its panel. Today only the door chamber exists in the hub; the forge, merchant and camp run inside expeditions, and the persistent roster is not built yet.

| Building | Keeper | The one panel opens on | What it does | In the game today |
| --- | --- | --- | --- | --- |
| **Abbey church** | The Abbot (vigil), Prior Aldric | A side-chapel door and its brass plaque | Choose a world; read its lead from the road; Cast Lots after the road | Door chamber screen (`show_hub`) |
| **Chapter House** | Prior Aldric | The order's charter on a lectern | Unlocks paid in ostia; Ascension taken as vows signed into the charter | 9 unlocks and 15 Ascension levels in data; vows are picked on the prepare screen |
| **Guesthouse** | The Hosteller | The guest book | The persistent roster between runs; recruit heroes, each with a Reason | Not built |
| **Almonry** | Brother Fenn | His ledger on the counter | Gear and belt flasks for the next run, paid in ostia | A merchant exists inside runs only, paid in gold |
| **Undercroft smithy** | Mother Hild | The anvil | Upgrade weapons and armour; set runes | A forge exists inside runs only |
| **Infirmarium** | Sister Wenna | The treatment table | Treat injuries, lower stress, remove Dread | Treatment exists at run camps only |
| **Cellarium** | Godric | The tally board | Food, light, medicine and tools for the run | Supplies exist inside runs; buying before a run is not built |
| **Sacristy** | Sister Ide | The relic case | Buy, identify and equip relics; the Teeth are kept here | 14 relics exist inside runs |
| **Scriptorium** | Brother Lucan | The open Codex on his desk | Bestiary, lore, card and hero records; one Codex page per Tooth | Not built |

## Screens

### The cloister garth (the root)

- **View:** one wide scene from the south walk, looking north across the garth at dusk. The church fills the back, the east range runs up the right side and the west range up the left. The gatehouse frames the foreground, with the Almonry and Guesthouse at its sides.
- **The party** stands round the garth's old stone cross, where the gate-to-church path meets the almonry-to-guesthouse path. It is a stepped plinth whose shaft snapped in the first winter of the Grey; its head lies against the steps. The names of the company's dead are chalked on the risers, their swords stand planted round it, and an iron brazier beside it is the one fire. The well stands in the west garth. The camera sits low (eye about 3 m up) so the company is large and central. **Clicking any hero, or the cross, opens the company:** choose who goes, swap from the roster, and edit each hero's loadout (Cole, 2026-11-22).
- **Clickable:** each building's door, the scriptorium stair, the undercroft steps, the church's cloister door (its porch at the back of the garth) and the company. Hover lifts the door in warm light and shows its name in a small rubric caption.
- **Light:** one lighting model for every scene and sprite (Cole, 2026-11-22). The art is drawn unlit, and every brazier, lantern, candle, lit door and window is a real light at its place in the scene. Ambient is the cold, colourless Grey from above plus a weak key light from the upper left. Every surface takes light from its true normal and position, and the result is dark, with crushed blacks. The game shader and the preview renderer use the same maths and the same look file (art repo `grim/light/`, game `shaders/ostium_lit.gdshader` and `scripts/lighting.gd`).

### A building interior (one template, nine rooms)

- **View:** one box-set camera for every room, at eye height (1.6 m). The back wall faces the player and the side walls recede. The keeper stands behind or beside their object (anvil, table, counter, tally board, relic case, desk, lectern, guest book). The way out is a door at the back left; the smithy keeps its stair in the left wall. Every room is lit by its own real sources through the same lighting model as the garth (as built, 2026-11-22).
- **Talk:** clicking the keeper plays one line in a speech scroll beside them. Their lines change with the road (a keeper speaks when their home world opens).
- **The panel:** clicking the object opens it, drawn as that object seen close: the Almoner's ledger pages, the Smith's anvil with gear laid on it. The panel is styled in Codex (A) or Reliquary (B).
- **Hover:** each room has three clickables: the keeper, the object and the exit. Each shows a thin white outline on hover. People and objects are outlined by their own silhouette, and the exit by its stonework, as on the garth.
- **Guesthouse roster:** the heroes not in the party rest in the Guesthouse. Each is clickable and opens the company screen on that hero (Cole, 2026-11-22). Their resting poses are still to be drawn.

### The church and the doors

- **View:** the nave, looking east toward the high altar and the sealed door. The fifteen doors stand in side chapels along both aisles; the player pans the nave by dragging.
- **Each door** shows its world's state: sealed with chains, opened, or cleared. The next door on the road has a candle lit before it.
- **Choosing a door** opens its brass plaque: the world's name, its lead and the Prior's commission. Clicking the door again moves to preparing the company in front of it.
- **The Abbot** kneels at the altar rail. Clicking him gives his one line for the current road.

## Art list and build order

Each step goes through a rough layout first, for Cole's sign-off, before the full ink pass.

- [ ] **Cloister garth:** layout sketch, then the full scene with hover states for every door.
- [ ] **Church nave:** fifteen side-chapel doors, the sealed door, the altar and the Abbot.
- [ ] **First three interiors and keepers:** Undercroft smithy (Mother Hild), Infirmarium (Sister Wenna), Almonry (Brother Fenn).
- [ ] **Clickable prototype** on the design canvas: garth, church and the three interiors, with the panel in Codex (A) and Reliquary (B).
- [ ] **Remaining interiors and keepers:** Guesthouse, Chapter House, Cellarium, Sacristy, Scriptorium.
- [ ] **Build it in Godot** and move the forge, merchant and supplies into the abbey where the spec puts them.

## Review checklist

Every character, creature and scene passes this list before it is shown to Cole. The check is done at full size and again at game size, and anything that fails is fixed first. The result is noted in the running log.

### Characters and creatures

1. **Matches its bible entry:** every listed field is present (dress, gear, head, signature shape, colour). Nothing is added that contradicts the entry or the lore.
2. **Physically logical:** hands close around what they hold; every strap, chain and belt is attached at both ends; weight rests on the feet or a support; joints bend the right way; left and right are consistent; fingers are counted.
3. **Silhouette:** recognisable as a solid black shape at 64 pixels tall; the signature shape reads; no two foes in one world share a silhouette.
4. **Grit (design rule 8):** the minimum count of secondary details, at least three layers, asymmetry, wear, and no empty flat areas.
5. **Colour rules:** only the world's palette plus black, bone and grey; gold only on the holy; red only for blood, doom and rubric; eyes only in void worlds.
6. **Light:** key light from the upper left on every part; shadow sides hatched; no part lit from the wrong side.
7. **Scale:** matches its scale class against a 1.0 human; feet meet the floor line.
8. **Rig:** each layer has its pivot at the joint, so an idle and an attack can move it without gaps or tearing.

### Scenes

1. **One perspective:** one horizon line and consistent vanishing points; every building sits on the same ground.
2. **Plausible architecture:** arches are carried by piers, roofs shed water, doors are human-sized against the party.
3. **Clickable targets read as clickable:** every door, stair and object the player can use is lit or framed, and nothing else looks usable.
4. **Matches the lore:** the plan's compass layout, the warm abbey against the colourless Grey, every keeper's world mark present.
5. **Hover and state art exist** for every clickable thing: rest, hover, locked or unlocked.
6. **Containment:** anything seen through a door, window or hatch stays inside the opening and never crosses its frame. The scene script draws all such contents through the opening's clip. The review checks a zoomed crop of every opening, lit and unlit, first.
7. **Lit through the model:** reviewed as the lit render, not the ink preview. No surface is lit from a side with no light, nothing that should catch light is black, and it reads at game size.
