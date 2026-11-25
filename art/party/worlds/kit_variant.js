// Bone-less variants (final consistency pass, 2026-11-25). A boss whose boss room supplies its own stage drops the bone
// that draws the stage: withoutBone(entry, bone) builds the figure as usual, then removes every rig run drawn on that bone.
// The joint itself is kept (an empty pivot), so bone names and parents stay identical to the full rig and all motion
// keys transfer. The random stream is untouched, so every other part is pixel-identical to the full render.
'use strict';
function withoutBone(h, bone, suffix) {
  return Object.assign({}, h, {
    name: `${h.name} (no ${bone})`,
    build: () => {
      const f = h.build(), out = f.out, nOut = [], nMarks = [];
      f.marks.forEach((m, k) => {
        const end = k + 1 < f.marks.length ? f.marks[k + 1].i : out.length;
        if (end <= m.i || m.bone === bone) return;
        nMarks.push({ i: nOut.length, bone: m.bone }); nOut.push(...out.slice(m.i, end));
      });
      f.out = nOut; f.marks = nMarks.length ? nMarks : [{ i: 0, bone: 'root' }];
      f.variant = { of: h.key, without: bone, suffix };
      return f;
    },
  });
}
module.exports = { withoutBone };
