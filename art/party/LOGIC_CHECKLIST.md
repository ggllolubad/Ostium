# Ostium figure logic checklist

Every figure passes this audit before it is shown, separately from the style and detail review. Each item is checked by
tracing the body in 3D, not by judging whether the drawing looks busy enough. Write a one-line pass or fail per item per figure.

Origin: three misses Cole caught on 2026-11-22 that two art-director passes did not: the Bulwark's head jutting
ahead of his neck, the Elementalist holding his open book toward the viewer instead of himself, and the Drowned Thrall's
hands gripping the pole from the wrong side.

## 1. Head, neck and spine
- The head sits on the neck, and the neck rises out of the shoulders along the line of the spine. Measure it: the skull's
  centre should sit over or just ahead of the neck base, never a head-width or more in front of the chest.
- Hunch comes from the upper back curving, not from the head sliding forward on a straight torso.
- A helm or hood follows the skull: no gap between helm and collar, no helm floating ahead of the aventail.

## 2. Objects face their user
- Anything a character reads, looks into or works on (books, scrolls, flasks, mirrors, hourglasses, maps, tools) faces
  the character's eyes or hands, not the camera. Ask: if I stood where his eyes are, would I see the pages?
- Show the viewer the back, edge or spine of such objects; a sliver of the working face is fine, the full face is not.
- Gaze and object agree: the eyes are aimed at the thing being studied. `B.head` always looks along the head's axis, so measure
  the angle from the eye to the object against the head angle. More than about 25 degrees apart is a fail: tilt the head,
  or move the object.
- A cupping or holding hand actually touches what it cups or holds.

## 3. Grips and hands
- For every gripped object, trace the forearm into the hand. The back of the hand and knuckles face the side the
  forearm comes from; the fingers wrap around the far side of the haft or edge and curl back toward the palm.
- Arms that come down from above onto a pole: knuckles on top, fingers wrapping under. Arms from below: the reverse.
- Two hands on one pole: both hands wrap the same pole, spaced apart, with their wrists bent the way the arms allow.
- The gripped object passes through the fist along the knuckle row; it never sits on top of a fist or floats beside it.
- Count the hands: two per person, each attached to an arm. At game size, an elbow cop or couter must not read as a second fist.
- Never set a fist's angle by hand. Use `B.grip(fig, c, elbow, thumbAng, ...)`: it puts the back of the hand toward the elbow and
  moves the thumb by mirroring. Turning a fist by 180 degrees to move the thumb points the knuckles into the forearm. Treat a
  `grip ... move the elbow` warning as a fail.
- The forearm meets a haft, pole or neck within about 35 degrees of square. A forearm running along the object (vertical forearm
  under a vertical dagger, neck or pin) is impossible: move the elbow. Swords and tongs are the exception: they run on from the
  forearm (`inline`).
- A held point or blade must not run along or through the holder's own arm.

## 4. Weight and balance
- The centre of mass sits over the base of support, or the pose shows why it does not (mid-step, lunging, leaning on something).
- The leg carrying the weight is the straighter one; the free leg is relaxed.
- Heavy objects pull: a planted door, a raised mace or a hanging satchel changes how the body leans. A planted shield or door
  stands on the ground line.
- Hair, chains, cords and cloth hang plumb whatever the head or hand does. Do not draw them in a rotated head frame.

## 5. Contact and attachment
- Straps attach to buckles, rings or the body at both ends. Belts go round the body. Scabbards hang from something.
- Things resting on other things touch them (a mace on a rim, a hand on a pommel), with no gap and no overlap through.
- Nothing passes through a face, a limb or a body unless it is clearly behind it in the layer order.

## 6. Facing and light
- Heroes face right, foes face left. A mirrored figure keeps its key light at the upper left after the flip.
- Every element on one figure is lit from the same side.
