# Ostium: Bestiary and Character Design Bible

2026-11-22 · Cole

Every hero, keeper and creature in Ostium is described here in words, from the lore, before anything is modelled. The current in-game look is set aside. One design language runs through every entry so the whole cast reads as one manuscript.

## The shared design language

Every body in Ostium was a human place, a trade or an animal before a Conjunction remade it. The silhouette states what it was; the course states what happened to it. These rules apply to every entry in this bible.

### 1. Proportion and scale

Humans are drawn at 7.5 heads tall, grounded and heavy, never heroic 9-head stylisation. Hands and feet are full size. No chibi, no oversized heads.

| Scale class | Height (human = 1.0) | Ranks occupied | Examples |
|---|---|---|---|
| Small | 0.3 to 0.6 | 1 | Swarms, imps, crabs, choirboys |
| Human | 0.9 to 1.15 | 1 | Heroes, thralls, nuns, miners |
| Large | 1.3 to 1.8 | 1 | Brutes, knights in heavy plate, beasts |
| Elite | 1.8 to 2.5 | 1 to 2 | Elites; they break the top of the frame line |
| Ruler | 3 and above | 2 to 4 | Rulers; shown partly off-frame, cropped like a cathedral seen from inside |

Heroes face right, foes face left, all in a three-quarter side view. The camera height is a standing human's chest.

### 2. Shape language per course

Each course leaves one physical mark. A two-course creature carries both marks, with its world's first course dominant.

| Course | What it does to a body | Shapes | Never |
|---|---|---|---|
| Fire | Consumes from the inside | Split skin with glowing seams, charred edges, upward curling ash, flaking | Cartoon flames on heads |
| Frost | Stills and preserves | Rime crust on windward side, icicles that point down, faceted planes, frozen mid-gesture | Clean ice crystals or snowflakes |
| Lightning | Strikes and scars | Branching Lichtenberg burns, fused copper and bronze, standing hair, scorched metal | Glowing outlines, sci-fi arcs |
| Water | Fills and bloats | Swollen flesh, barnacles, verdigris, kelp, pale wrinkled skin, sag | Fish faces on everything |
| Toxin | Ripens and rots | Swelling, pustules, fungal growth, peeling, mould bloom, fruiting bodies | Slime puddles, neon green glow |
| Void | Unmakes | Holes where matter should be, edges that thin into nothing, missing pieces with clean rims, eyes (void worlds only) | Purple sparkles, galaxies |

### 3. Silhouette first

Every creature must be recognisable as a solid black shape at 64 pixels tall. Each entry names a **signature shape**: the one feature that reads in silhouette (the Bulwark's door-shield, the Thrall's boat hook). No two foes in the same world share a silhouette.

### 4. Human first

Keep the trade legible: tools, clothing and posture tell the viewer what the creature used to be before the horror registers. A fisher still holds a line. A nun still wears a wimple. Horror sits on top of the human read, never instead of it.

### 5. Materials

One shared material library keeps every world consistent. Every entry draws from it.

- **Metals:** wrought iron (dark, pitted), steel plate (cold blue-grey), bronze (warm brown, green in crevices), lead (dull grey: ostia, seals, coffins), gold leaf (holy only).
- **Cloth:** undyed wool, linen, sackcloth, waxed canvas, velvet for the rich and dead.
- **Organic:** leather, horn, bone, wax, tallow, rope, wood (oak, darkened by hands).
- **Wear:** everything is used. Edges are worn bright; recesses hold grime; cloth hems are torn and wet or charred.

### 6. Colour and ink

- **Black ink line and hatching carry the form.** Colour is laid in like illumination, flat and slightly translucent.
- **Each world uses only its own palette** (from the lore) plus black, bone and grey.
- **Gold** appears only on the holy: abbey items, saints, halos, the Torn Sky. One exception (Cole, 2026-11-24): money. The gold supply and coins are gold.
- **Red** appears only for blood, doom and rubric.
- **Eyes** as a motif (many eyes, eyes in wrong places) appear only in void worlds.

### 7. Light

One key light from upper left at 45 degrees, behind the viewer's left shoulder. A cool, dim fill from the right. The shadow side is dense crosshatch, not a gradient. The same light setup renders every asset.

### 8. Grit and visual noise

The target is Darkest Dungeon 2's density: every figure looks lived-in, busy and interesting at a glance, but the silhouette stays clean. Noise lives **inside** the silhouette, never on its edge.

- **Secondary detail count.** A cast foe carries at least 6 small secondary details; elites at least 10; heroes and rulers at least 12. Examples: straps, buckles, rivets, pouches, charms, rope wraps, patches, bandages, nicks, chains, trophies, scratched marks.
- **Layering.** Every outfit has at least three layers, such as skin, cloth and armour, or shirt, coat and harness. Layers overlap at hems, sleeves and collars so the edges of each layer show.
- **Asymmetry.** No figure is mirrored. One pauldron is bigger, one sleeve is torn, a patch sits on one knee only.
- **Wear and damage.** Every surface shows use: dents and scratches on metal, frayed hems, worn-bright edges, mud and grime rising from the feet to about knee height, blood and spatter where the figure fights.
- **Surface breakup.** No flat area of colour larger than a palm reads empty. Every material carries a texture: grain on wood, rings on mail, weave on cloth, mottling on skin, pitting on iron.
- **Ink density.** Shadow sides get dense crosshatching; mid-tones carry a light single hatch; the lit side keeps a few contour strokes. Deep recesses go to solid black.
- **Read order.** Silhouette first, then the signature shape, then the face, then the noise. If the noise hides the signature shape, cut noise.

## Entry template

Every character and creature entry fills the same fields, in this order. A modeller should be able to build the asset from the entry alone.

| Field | What it holds |
|---|---|
| **Lore line** | The house-voice line from the game data, when one exists. |
| **Was** | The human trade, animal or object before the Conjunction. |
| **Scale and stance** | Scale class (see above), posture, weight, where its centre of mass sits. |
| **Body** | Anatomy, proportions, skin or surface, and how the courses changed it. |
| **Dress and gear** | Clothing, armour, tools and weapons, with materials from the shared library. |
| **Head** | Face, hair, headgear, expression. |
| **Signature shape** | The one feature that reads in silhouette. |
| **Colour** | Two or three colours from the world palette, beyond ink black, bone and grey. |
| **Motion** | Idle and signature attack, in a sentence each. |

Path variants for heroes and minor variants share the base entry and list only what changes.

## How the descriptions drive the models

The entries are the specification for both art pilots. The Blender pilot builds models from them; the improved 2D cutout pipeline draws parts from them. Either way, the entry comes first and the asset follows.

- **One kit, many bodies.** A shared base body (human, quadruped, crustacean, serpent) is built once. Each entry is that base plus its listed changes, so proportions and joints match across the cast.
- **One render setup.** The camera, the key light from the upper left, the ink outline and the hatching shader are identical for every asset.
- **Pilot order:** the Bulwark (hard-surface, armour) and the Drowned Thrall (organic, bloated flesh) test the two ends of the method.
- **Change control.** When an entry changes, its model is rebuilt from the entry. The model never drifts away from the text.
