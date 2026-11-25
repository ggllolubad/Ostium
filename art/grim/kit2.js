// Non-humanoid archetypes for the door worlds: beast, serpent, crawler, floater, golem, bird, moth, swarm.
const { G, INK, smooth, limb, poly, blob } = require('../gr');
const { dark, light, mix, EGLOW, f } = require('./kit');

// ------------------------------------------------------------------ four-legged beasts, side view facing left
function beast(a, D, s) {
  const R = a.R, pal = s.pal, els = s.els, el = els[0], hide = pal.skin;
  const k = s.kind || 'hound';
  if (k === 'toad' || k === 'walrus') return squat(a, D, s, k);
  const C = { hound: { bw: 230, bh: 120, leg: 150, y: 490, head: 'canine' }, wolf: { bw: 250, bh: 130, leg: 150, y: 480, head: 'canine' }, stag: { bw: 230, bh: 116, leg: 190, y: 430, head: 'cervine' },
    boar: { bw: 250, bh: 150, leg: 110, y: 450, head: 'boar' }, bear: { bw: 280, bh: 190, leg: 130, y: 420, head: 'bear' }, toad: { bw: 260, bh: 150, leg: 70, y: 500, head: 'toad' },
    mammoth: { bw: 300, bh: 230, leg: 170, y: 380, head: 'mammoth' }, walrus: { bw: 280, bh: 170, leg: 40, y: 500, head: 'walrus' }, lizard: { bw: 260, bh: 90, leg: 80, y: 520, head: 'lizard' } }[k];
  const cx = 250, cy = C.y, bw = C.bw, bh = C.bh, front = cx - bw / 2 + 30, rear = cx + bw / 2 - 30, foot = 672;
  a.layer('shadow'); a.raw(a.ground(cx, 676, bw * 0.6, 12));
  // tail
  a.layer('back', [rear + 20, cy - 10]);
  if (k === 'stag') a.shape({ d: smooth([[rear + 18, cy - bh * 0.5], [rear + 44, cy - bh * 0.56], [rear + 50, cy - bh * 0.3], [rear + 30, cy - bh * 0.24]], true, 0.5), fill: light(hide, 0.4), depth: 4, ink: 1 });
  else if (k !== 'toad' && k !== 'walrus') a.limb([[rear + 20, cy - 20], [rear + 60, cy - 30 + (k === 'lizard' ? 40 : -10)], [rear + 90, cy + (k === 'lizard' ? 60 : -40)], [rear + 100, cy + (k === 'lizard' ? 100 : -30)]], k === 'lizard' ? [50, 36, 20, 6] : (k === 'stag' ? [16, 12, 8, 4] : [26, 22, 14, 6]), { fill: hide, depth: 8, mottle: 0.6, hatch: 60 });
  // far legs
  a.layer('legs', [cx, cy]);
  const leg = (x, front2, far) => {
    const top = [x, cy + bh * 0.15], col = far ? dark(hide, 0.25) : hide, sc = bh / 120;
    if (k === 'walrus') { a.shape({ d: smooth([[x - 30, foot - 40], [x + 20, foot - 50], [x + 10, foot - 4], [x - 50, foot - 2]], true, 0.5), fill: col, depth: 10, mottle: 0.6 }); return; }
    const hoof = k === 'stag' || k === 'boar' || k === 'mammoth';
    const span = foot - 14 - top[1];
    // front legs: elbow then a near-straight forearm; hind legs: stifle forward, hock back
    const spine = front2 ? [top, [x - 6, top[1] + span * 0.42], [x + 6, top[1] + span * 0.82], [x - 2, foot - 14]]
      : [top, [x - 22, top[1] + span * 0.4], [x + 22, top[1] + span * 0.72], [x + 12, foot - 14]];
    const wd = k === 'stag' ? [40, 24, 14, 12] : (k === 'toad' ? [64, 46, 34, 26] : (k === 'mammoth' ? [90, 76, 66, 64] : [62 * sc, 40 * sc, 24 * sc, 20 * sc]));
    if (!front2 && k !== 'mammoth') wd[0] *= 1.35;
    a.limb(spine, wd, { fill: col, depth: 10, mottle: 0.6, fine: true, hatch: far ? 40 : 110, decals: far ? '' : D.skin(els[1] || el, spine[1][0], spine[1][1], 20) });
    const ank = spine[3];
    a.shape({ d: smooth(hoof ? [[ank[0] - 12, ank[1] - 6], [ank[0] + 12, ank[1] - 6], [ank[0] + 14, foot], [ank[0] - 14, foot]] : [[ank[0] - 10, ank[1] - 8], [ank[0] + 14, ank[1] - 6], [ank[0] + 12, foot], [ank[0] - 30, foot], [ank[0] - 32, foot - 8]], true, 0.4), fill: hoof ? G.black : dark(col, 0.1), depth: 4, ink: 1.1,
      after: hoof ? '' : [0, 1, 2].map(i => `<path d="M${f(ank[0] - 26 + i * 8)} ${foot - 2} l-6 4" stroke="${G.bone}" stroke-width="2.2"/>`).join('') });
  };
  leg(front + 20, true, true); leg(rear + 10, false, true);
  // body
  a.layer('body', [cx, cy]);
  const back = k === 'boar' || k === 'bear' ? -bh * 0.62 : -bh * 0.5;
  const lean = k === 'hound' || k === 'wolf' || k === 'stag' || k === 'lizard';
  const body = lean ? smooth([[front - 40, cy - bh * 0.02], [front - 22, cy - bh * 0.42], [front + 14, cy - bh * 0.64], [front + 50, cy - bh * 0.56], [cx + 10, cy - bh * 0.5], [rear - 6, cy - bh * 0.56], [rear + 30, cy - bh * 0.36], [rear + 36, cy - bh * 0.02], [rear + 20, cy + bh * 0.28], [rear - 10, cy + bh * 0.24], [cx + 14, cy + bh * 0.0], [cx - 30, cy + bh * 0.34], [front + 16, cy + bh * 0.58], [front - 24, cy + bh * 0.4]], true, 0.55)
    : smooth([[front - 40, cy - bh * 0.05], [front - 6, cy + back], [cx - 10, cy + back - 10 - (k === 'bear' || k === 'mammoth' ? 20 : 0)], [rear - 10, cy - bh * 0.5], [rear + 34, cy - bh * 0.18], [rear + 22, cy + bh * 0.3], [rear - 20, cy + bh * 0.42], [cx + 10, cy + bh * 0.46], [front + 20, cy + bh * 0.5], [front - 26, cy + bh * 0.32]], true, 0.6);
  // muscle landmarks: scapula, triceps line, thigh sweep
  const mus = [{ d: `M${f(front + 4)} ${f(cy - bh * 0.5)} C${f(front + 20)} ${f(cy - bh * 0.2)} ${f(front + 10)} ${f(cy + bh * 0.05)} ${f(front - 6)} ${f(cy + bh * 0.2)}`, w: 1, op: 0.8 },
    { d: `M${f(rear - 30)} ${f(cy - bh * 0.4)} C${f(rear - 40)} ${f(cy - bh * 0.05)} ${f(rear - 20)} ${f(cy + bh * 0.18)} ${f(rear + 12)} ${f(cy + bh * 0.24)}`, w: 1, op: 0.8 }];
  let dec = D.skin(el, cx, cy - 10, bh * 0.6) + a.stain(cx + 20, cy + 20, 24, G.blood, 0.4);
  if (k === 'hound' || k === 'wolf') dec += `<g stroke="${INK}" stroke-width="1" fill="none" opacity="0.8">` + [0, 1, 2, 3, 4].map(i => `<path d="M${front + 40 + i * 16} ${cy - bh * 0.3} C${front + 34 + i * 16} ${cy} ${front + 40 + i * 16} ${cy + 20} ${front + 48 + i * 16} ${cy + bh * 0.3}"/>`).join('') + `</g>`;
  if (k === 'mammoth' || s.fur) dec += `<g stroke="${dark(hide, 0.4)}" stroke-width="1.1">` + Array.from({ length: 50 }, () => { const x = front + R() * bw, y = cy - bh * 0.4 + R() * bh * 0.9; return `<path d="M${f(x)} ${f(y)} l${f(-2 + R() * 4)} ${f(10 + R() * 14)}"/>`; }).join('') + `</g>`;
  if (k === 'toad') dec += D.pustules(cx, cy - 20, 60, 14);
  if (k === 'lizard') dec += `<g fill="none" stroke="${INK}" stroke-width="0.6" opacity="0.7">` + Array.from({ length: 30 }, () => { const x = front + R() * bw, y = cy - bh * 0.3 + R() * bh * 0.7; return `<path d="M${f(x)} ${f(y)} l4 -3 l4 3"/>`; }).join('') + `</g>`;
  a.shape({ d: body, fill: hide, lines: mus, depth: bh * 0.26, mottle: 0.6, fine: true, hatch: 70, decals: dec, spec: [`M${front + 20} ${cy + back + 12} C${cx} ${cy + back} ${rear - 20} ${cy - bh * 0.45 + 10} ${rear + 10} ${cy - bh * 0.3}`], specOp: 0.25 });
  if (k === 'boar' || s.ridge) a.raw(D.spikes(cx, cy + back + 4, 9, 26, -Math.PI / 2, 1.4, els.includes('frost') ? '#cfe6f4' : (s.ridgeCol || '#3a3028')));
  if (s.saddle) a.raw(D.chain(front + 30, cy - bh * 0.3, rear - 30, cy - bh * 0.25, 12));
  if (s.body_extra) s.body_extra(a, D, cx, cy, bw, bh);
  leg(rear - 6, false, false);
  // head
  const hx = front - 40, hy = cy - bh * (k === 'stag' ? 0.9 : (lean ? 0.72 : 0.35));
  a.layer('head', [front, cy - bh * 0.2]);
  if (k !== 'toad' && k !== 'walrus') a.limb([[front + 10, cy - bh * 0.1], [hx + 30, hy + 10]], [bh * 0.62, bh * 0.45], { fill: hide, depth: 10, mottle: 0.6, fine: true, hatch: 90 });
  const H = {
    canine: [[hx + 36, hy - 18], [hx + 14, hy - 32], [hx - 12, hy - 28], [hx - 26, hy - 14], [hx - 58, hy - 8], [hx - 74, hy - 2], [hx - 76, hy + 8], [hx - 62, hy + 16], [hx - 44, hy + 24], [hx - 10, hy + 30], [hx + 22, hy + 26], [hx + 40, hy + 10]],
    cervine: [[hx + 28, hy - 22], [hx + 6, hy - 30], [hx - 14, hy - 22], [hx - 44, hy + 4], [hx - 62, hy + 18], [hx - 64, hy + 30], [hx - 50, hy + 36], [hx - 20, hy + 30], [hx + 14, hy + 24], [hx + 32, hy + 6]],
    boar: [[hx + 40, hy - 40], [hx + 10, hy - 44], [hx - 20, hy - 28], [hx - 52, hy - 4], [hx - 70, hy + 6], [hx - 72, hy + 26], [hx - 54, hy + 34], [hx - 20, hy + 42], [hx + 24, hy + 40], [hx + 46, hy + 10]],
    bear: [[hx + 34, hy - 40], [hx + 6, hy - 46], [hx - 20, hy - 34], [hx - 34, hy - 14], [hx - 58, hy - 6], [hx - 64, hy + 10], [hx - 50, hy + 26], [hx - 20, hy + 40], [hx + 20, hy + 40], [hx + 44, hy + 8]],
    toad: [[front + 30, cy - bh * 0.5], [front - 30, cy - bh * 0.72], [front - 96, cy - bh * 0.52], [front - 124, cy - bh * 0.12], [front - 100, cy + bh * 0.22], [front - 10, cy + bh * 0.26]],
    mammoth: [[hx + 50, hy - 70], [hx + 60, hy + 10], [hx + 20, hy + 40], [hx - 30, hy + 30], [hx - 40, hy - 20], [hx - 10, hy - 70]],
    walrus: [[front + 30, cy - bh * 0.5], [front - 40, cy - bh * 0.4], [front - 70, cy - 10], [front - 60, cy + 30], [front + 10, cy + 30]],
    lizard: [[hx + 30, hy - 16], [hx + 34, hy + 18], [hx - 10, hy + 24], [hx - 70, hy + 16], [hx - 74, hy + 4], [hx - 20, hy - 14]],
  }[C.head];
  a.shape({ d: smooth(H, true, 0.6), fill: hide, depth: 16, mottle: 0.6, fine: true, hatch: 100, decals: D.skin(els[1] || el, hx, hy, 30) });
  const eyeX = C.head === 'toad' ? front - 50 : (C.head === 'walrus' ? front - 30 : hx - 10), eyeY = C.head === 'toad' ? cy - bh * 0.66 : (C.head === 'walrus' ? cy - bh * 0.25 : hy - 2);
  a.raw(s.glowEyes !== false ? D.glowEye(eyeX, eyeY, 3, EGLOW[el] || '#d8c060') : `<circle cx="${eyeX}" cy="${eyeY}" r="3" fill="${G.black}"/>`);
  // maws
  if (C.head === 'canine' || C.head === 'lizard' || C.head === 'bear') { const mx0 = hx - (C.head === 'bear' ? 58 : 70), my = hy + (C.head === 'canine' ? 10 : 16), mx1 = hx - 8;
    a.raw(`<path d="M${mx0} ${my} C${mx0 + 20} ${my + 4} ${mx1 - 20} ${my + 2} ${mx1} ${my + 6} C${mx1 - 20} ${my + 16} ${mx0 + 20} ${my + 18} ${mx0 + 4} ${my + 12} Z" fill="#2a0e0a" stroke="${INK}" stroke-width="1.2"/><path d="M${mx0 + 4} ${my + 2} C${mx0 + 24} ${my + 5} ${mx1 - 24} ${my + 4} ${mx1 - 2} ${my + 7}" stroke="#8a3a34" stroke-width="2" fill="none"/>` + Array.from({ length: 7 }, (_, i) => { const tx = mx0 + 6 + i * (mx1 - mx0 - 14) / 6; return `<path d="M${f(tx)} ${my + 2} l${i === 1 ? 2.5 : 2} ${i === 1 ? 10 : 6} l${i === 1 ? 2.5 : 2} ${i === 1 ? -10 : -6} Z M${f(tx + 3)} ${my + 14} l2 -6 l2 6 Z" fill="${G.bone}" stroke="${INK}" stroke-width="0.5"/>`; }).join('') + a.drip(mx0 + 16, my + 14, 30, 1.8, '#c8c0a8'));
    a.raw(`<path d="${blob(hx - (C.head === 'bear' ? 62 : 74), hy + (C.head === 'canine' ? 0 : 6), 6, R, 7, 0.2)}" fill="${G.black}"/><path d="M${hx - 30} ${hy - 14} C${hx - 20} ${hy - 6} ${hx - 6} ${hy - 4} ${hx + 6} ${hy - 10}" stroke="${INK}" stroke-width="1" fill="none"/>`); }
  if (C.head === 'canine' || C.head === 'cervine') { a.shape({ d: smooth([[hx + 8, hy - 26], [hx + 30, hy - 66], [hx + 38, hy - 22]], true, 0.4), fill: dark(hide, 0.15), depth: 6, ink: 1.1, lines: [{ d: `M${hx + 18} ${hy - 30} L${hx + 30} ${hy - 58}`, w: 0.8, col: '#6a3a30' }] }); a.shape({ d: smooth([[hx + 18, hy - 22], [hx + 44, hy - 58], [hx + 46, hy - 16]], true, 0.4), fill: dark(hide, 0.3), depth: 4, ink: 1 }); }
  if (C.head === 'cervine' || s.antlers) for (const sg of [0, 1]) { const bx = hx + 10 + sg * 14, by = hy - 20; let o = `M${bx} ${by} C${bx + 10} ${by - 60} ${bx - 30 + sg * 20} ${by - 110} ${bx - 10 + sg * 40} ${by - 150}`; for (let i = 0; i < 4; i++) o += ` M${f(bx - 4 + sg * 10 + i * 3)} ${f(by - 40 - i * 26)} l${f(-20 + sg * 30 + R() * 10)} ${f(-24)}`; a.raw(`<path d="${o}" stroke="${INK}" stroke-width="${sg ? 9 : 7}" fill="none" stroke-linecap="round"/><path d="${o}" stroke="${pal.horn || '#b8a888'}" stroke-width="${sg ? 6 : 4}" fill="none" stroke-linecap="round"/>` + (els.includes('toxin') ? D.fungus(bx - 10 + sg * 40, by - 120, 2, 0.6) + D.spores(bx, by - 120, 40, 10) : '') + (els.includes('frost') ? D.icicles(bx - 30, bx + 20, by - 60, 4, 20) : '')); }
  if (C.head === 'boar' || C.head === 'mammoth' || C.head === 'walrus') { const tx = C.head === 'walrus' ? front - 40 : hx - 40, ty = C.head === 'walrus' ? cy + 20 : hy + 30; a.shape({ d: smooth(C.head === 'walrus' ? [[tx, ty], [tx + 10, ty], [tx + 2, ty + 90], [tx - 4, ty + 90]] : [[tx + 10, ty - 6], [tx + 20, ty], [tx - 30, ty - 50], [tx - 40, ty - 54], [tx - 20, ty - 30]], true, 0.4), fill: G.bone, depth: 5, ink: 1.1 }); }
  if (C.head === 'mammoth') a.limb([[hx - 20, hy + 10], [hx - 50, hy + 80], [hx - 44, hy + 160], [hx - 70, hy + 190]], [40, 30, 22, 14], { fill: hide, depth: 8, mottle: 0.6, hatch: 120, lines: [0, 1, 2, 3, 4, 5].map(i => `M${hx - 62 + i * 2} ${hy + 50 + i * 24} l20 4`) });
  if (C.head === 'toad') a.raw(`<path d="M${front - 120} ${cy - 4} C${front - 80} ${cy + 14} ${front - 30} ${cy + 14} ${front + 10} ${cy}" stroke="${INK}" stroke-width="3.4" fill="none"/>` + a.drip(front - 90, cy + 10, 44, 3, '#a8b858') + D.pustules(front - 60, cy - bh * 0.4, 30, 6));
  if (s.head_extra) s.head_extra(a, D, hx, hy);
  // near front leg is the striking limb
  a.layer('arm', [front + 20, cy + bh * 0.1]);
  leg(front + 4, true, false);
  if (s.auraAt !== false) a.raw(D.aura(el, cx, cy + back, 0.8));
  return { hand: [hx - 60, hy + 20], idle: k === 'mammoth' || k === 'bear' ? 'heavy' : 'crouch', attack: 'bite' };
}

// ------------------------------------------------------------------ squat bodies: toad (low, wide, legs folded) and walrus (hauled out)
function squat(a, D, s, k) {
  const R = a.R, pal = s.pal, els = s.els, el = els[0], hide = pal.skin, foot = 672;
  a.layer('shadow'); a.raw(a.ground(240, 676, 190, 12));
  if (k === 'toad') {
    const cx = 250, cy = 560;
    a.layer('back', [cx + 80, cy]);
    // far hind leg folded beside the body
    a.shape({ d: smooth([[cx + 40, cy - 40], [cx + 150, cy - 30], [cx + 170, cy + 40], [cx + 120, cy + 100], [cx + 40, foot - 4], [cx + 10, cy + 60]], true, 0.6), fill: dark(hide, 0.25), depth: 20, mottle: 0.6, hatch: 40 });
    a.layer('legs', [cx - 60, cy + 40]);
    a.limb([[cx - 70, cy + 10], [cx - 110, cy + 60], [cx - 120, foot - 14]], [40, 30, 22], { fill: dark(hide, 0.25), depth: 8, mottle: 0.6, hatch: 40 });
    a.layer('body', [cx, cy]);
    const body = smooth([[cx - 150, cy - 10], [cx - 120, cy - 90], [cx - 40, cy - 130], [cx + 70, cy - 124], [cx + 160, cy - 70], [cx + 190, cy + 10], [cx + 150, cy + 80], [cx + 40, cy + 104], [cx - 80, cy + 96], [cx - 140, cy + 50]], true, 0.6);
    a.shape({ d: body, fill: hide, depth: 44, mottle: 0.7, fine: true, hatch: 70, spec: [`M${cx - 60} ${cy - 118} C${cx} ${cy - 132} ${cx + 80} ${cy - 120} ${cx + 140} ${cy - 76}`], specOp: 0.3,
      decals: D.pustules(cx + 10, cy - 70, 70, 24) + a.stain(cx + 40, cy + 40, 40, light(hide, 0.35), 0.6) + D.skin(el, cx + 40, cy - 40, 80) + `<g fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.7">` + Array.from({ length: 22 }, () => { const x = cx - 100 + R() * 260, y = cy - 100 + R() * 160; return `<path d="${blob(x, y, 3 + R() * 6, R, 6, 0.4)}"/>`; }).join('') + `</g>` });
    // near hind leg: huge folded thigh
    a.shape({ d: smooth([[cx + 30, cy - 10], [cx + 140, cy - 20], [cx + 170, cy + 50], [cx + 120, cy + 100], [cx + 20, cy + 106], [cx - 10, cy + 60]], true, 0.6), fill: hide, depth: 22, mottle: 0.6, hatch: 110, decals: D.pustules(cx + 90, cy + 30, 30, 8) });
    a.shape({ d: smooth([[cx + 10, foot - 20], [cx + 110, foot - 26], [cx + 130, foot], [cx - 10, foot], [cx - 20, foot - 10]], true, 0.5), fill: dark(hide, 0.1), depth: 6, ink: 1.1, lines: [-6, 10, 26].map(dx => `M${cx + dx} ${foot - 2} l-10 4`) });
    a.layer('head', [cx - 110, cy - 50]);
    a.shape({ d: smooth([[cx - 196, cy - 20], [cx - 180, cy - 80], [cx - 120, cy - 110], [cx - 60, cy - 104], [cx - 40, cy - 40], [cx - 60, cy + 30], [cx - 150, cy + 34], [cx - 194, cy + 14]], true, 0.6), fill: hide, depth: 24, mottle: 0.7, fine: true, hatch: 100, decals: D.pustules(cx - 110, cy - 70, 26, 8) + a.stain(cx - 130, cy + 10, 26, light(hide, 0.3), 0.6) });
    for (const [ex, ey, r] of [[cx - 150, cy - 96, 15], [cx - 96, cy - 112, 13]]) a.raw(`<path d="${blob(ex, ey, r + 5, R, 9, 0.1)}" fill="${hide}" stroke="${INK}" stroke-width="1.3"/>` + D.glowEye(ex - 2, ey - 2, r * 0.42, EGLOW[el] || '#d8c060') + `<path d="M${ex - r} ${ey - 2} Q${ex} ${ey - r * 0.9} ${ex + r} ${ey - 2}" stroke="${INK}" stroke-width="1.4" fill="none"/><ellipse cx="${ex - 2}" cy="${ey - 1}" rx="${r * 0.18}" ry="${r * 0.5}" fill="${G.black}"/>`);
    a.raw(`<path d="M${cx - 194} ${cy} C${cx - 150} ${cy + 18} ${cx - 90} ${cy + 18} ${cx - 50} ${cy - 4}" stroke="${INK}" stroke-width="3.6" fill="none"/>` + a.drip(cx - 160, cy + 12, 50, 3, light(pal.accent || '#a8b858', 0.1)) + a.drip(cx - 110, cy + 14, 34, 2.4, '#a8b858') + `<circle cx="${cx - 186}" cy="${cy - 34}" r="2.4" fill="${G.black}"/>`);
    if (s.body_extra) s.body_extra(a, D, cx, cy - 40, 300, 160);
    a.layer('arm', [cx - 120, cy + 20]);
    a.limb([[cx - 110, cy + 20], [cx - 150, cy + 70], [cx - 160, foot - 12]], [44, 32, 22], { fill: hide, depth: 8, mottle: 0.6, hatch: 110 });
    a.shape({ d: smooth([[cx - 150, foot - 18], [cx - 200, foot - 8], [cx - 210, foot], [cx - 130, foot], [cx - 140, foot - 18]], true, 0.4), fill: dark(hide, 0.1), depth: 4, ink: 1.1, lines: [-180, -164].map(dx => `M${cx + dx} ${foot - 12} l-12 12`) });
    a.raw(D.aura(el, cx, cy - 130, 0.8));
    return { hand: [cx - 190, cy], idle: 'crouch', attack: 'bite' };
  }
  // walrus: hauled out, fore-flippers planted, the front raised, hide in heavy folds
  const cx = 260, cy = 540;
  a.layer('back', [cx + 120, cy + 60]);
  a.shape({ d: smooth([[cx + 120, cy + 40], [cx + 200, cy + 90], [cx + 230, foot - 4], [cx + 170, foot - 6], [cx + 110, cy + 100]], true, 0.5), fill: dark(hide, 0.25), depth: 10, mottle: 0.6, hatch: 40 });
  a.layer('legs', [cx - 60, cy + 60]);
  a.shape({ d: smooth([[cx - 40, cy + 40], [cx - 20, cy + 110], [cx - 70, foot], [cx - 130, foot - 2], [cx - 90, cy + 100]], true, 0.5), fill: dark(hide, 0.3), depth: 10, mottle: 0.6, hatch: 40 });
  a.layer('body', [cx, cy]);
  a.shape({ d: smooth([[cx - 120, cy - 60], [cx - 60, cy - 130], [cx + 40, cy - 120], [cx + 150, cy - 40], [cx + 200, cy + 40], [cx + 180, cy + 110], [cx + 40, foot - 6], [cx - 90, foot - 10], [cx - 140, cy + 40]], true, 0.6), fill: hide, depth: 46, mottle: 0.7, fine: true, hatch: 70,
    lines: Array.from({ length: 7 }, (_, i) => ({ d: `M${cx - 80 + i * 36} ${cy - 110 + i * 10} C${cx - 70 + i * 36} ${cy - 40} ${cx - 90 + i * 36} ${cy + 40} ${cx - 70 + i * 34} ${foot - 20}`, w: 0.9, op: 0.7 })),
    decals: D.skin(el, cx + 40, cy - 30, 80) + a.stain(cx - 40, cy + 30, 30, light(hide, 0.25), 0.6) + a.gash(cx + 70, cy - 40, cx + 110, cy + 10, 4, { rim: '#a87a6a', dripLen: 16 }) + Array.from({ length: 16 }, () => `<circle cx="${f(cx - 60 + R() * 220)}" cy="${f(cy - 90 + R() * 180)}" r="${f(1 + R() * 2)}" fill="${INK}" opacity="0.5"/>`).join('') });
  a.layer('head', [cx - 110, cy - 90]);
  a.shape({ d: smooth([[cx - 190, cy - 100], [cx - 160, cy - 150], [cx - 100, cy - 160], [cx - 60, cy - 120], [cx - 60, cy - 60], [cx - 110, cy - 40], [cx - 180, cy - 50], [cx - 204, cy - 74]], true, 0.6), fill: hide, depth: 22, mottle: 0.7, fine: true, hatch: 100,
    decals: a.stain(cx - 170, cy - 70, 20, light(hide, 0.35), 0.7) + Array.from({ length: 20 }, () => `<circle cx="${f(cx - 196 + R() * 40)}" cy="${f(cy - 90 + R() * 34)}" r="0.9" fill="${INK}"/>`).join('') });
  a.raw(Array.from({ length: 9 }, (_, i) => `<path d="M${cx - 196 + i * 4} ${cy - 66 + i} q-14 6 -26 ${4 + i}" stroke="${light(hide, 0.5)}" stroke-width="1" fill="none"/>`).join('') + D.glowEye(cx - 140, cy - 126, 3, EGLOW[el] || '#d8c060'));
  for (const dx of [-182, -160]) a.shape({ d: smooth([[cx + dx, cy - 56], [cx + dx + 12, cy - 56], [cx + dx + 4, cy + 50], [cx + dx - 4, cy + 52]], true, 0.4), fill: G.bone, depth: 5, ink: 1.1, lines: [`M${cx + dx + 4} ${cy - 40} l-2 80`], decals: a.stain(cx + dx + 4, cy - 40, 6, '#8a7a5a', 0.7) });
  a.layer('arm', [cx - 80, cy + 20]);
  a.shape({ d: smooth([[cx - 70, cy - 10], [cx - 40, cy + 60], [cx - 80, foot - 2], [cx - 170, foot], [cx - 150, foot - 20], [cx - 110, cy + 60]], true, 0.5), fill: hide, depth: 14, mottle: 0.6, hatch: 110, lines: [-150, -130, -110].map(dx => `M${cx + dx} ${foot - 4} l20 -14`) });
  a.raw(D.aura(el, cx, cy - 130, 0.8));
  return { hand: [cx - 190, cy - 60], idle: 'heavy', attack: 'bite' };
}

// ------------------------------------------------------------------ serpents and worms rising from a coil
function serpent(a, D, s) {
  const R = a.R, pal = s.pal, els = s.els, el = els[0], hide = pal.skin, k = s.kind || 'wyrm';
  a.layer('shadow'); a.raw(a.ground(240, 676, 170, 12));
  a.layer('back', [300, 620]);
  a.limb([[90, 650], [180, 676], [320, 664], [400, 620], [380, 570], [300, 560]], [20, 50, 70, 70, 60, 54], { fill: dark(hide, 0.15), depth: 18, mottle: 0.6, fine: true, hatch: 50, decals: D.skin(els[1] || el, 300, 640, 40) });
  a.layer('body', [280, 560]);
  const spine = [[300, 560], [250, 590], [190, 560], [200, 470], [260, 400], [270, 320], [230, 250], [190, 210]];
  const widths = [60, 70, 72, 70, 64, 56, 48, 42].map(v => v * (s.thick || 1));
  let dec = D.skin(el, 230, 420, 70) + a.stain(250, 500, 24, G.blood, 0.4);
  if (k === 'worm' || k === 'leech') dec += `<g stroke="${INK}" stroke-width="1.2" fill="none" opacity="0.8">` + Array.from({ length: 16 }, (_, i) => { const p = spine[Math.min(7, Math.floor(i / 2))]; return `<path d="M${p[0] - 36} ${p[1] - 8 + (i % 2) * 18} C${p[0]} ${p[1] + (i % 2) * 18} ${p[0] + 20} ${p[1] + (i % 2) * 18} ${p[0] + 36} ${p[1] - 6 + (i % 2) * 18}"/>`; }).join('') + `</g>`;
  else dec += `<g fill="none" stroke="${INK}" stroke-width="0.6" opacity="0.7">` + Array.from({ length: 90 }, () => { const p = spine[Math.floor(R() * 8)], x = p[0] + (R() - 0.5) * 50, y = p[1] + (R() - 0.5) * 50; return `<path d="M${f(x)} ${f(y)} q4 -4 8 0"/>`; }).join('') + `</g>`;
  a.limb(spine, widths, { fill: hide, depth: 22, mottle: 0.6, fine: true, hatch: 70, decals: dec, spec: ['M220 520 C200 460 250 400 262 330'], specOp: 0.25 });
  a.limb([[196, 552], [210, 470], [262, 404], [270, 330], [236, 264]], [30, 34, 30, 24, 18], { fill: pal.belly || light(hide, 0.35), depth: 6, mottle: 0.4, hatch: 120, core: false, lines: Array.from({ length: 12 }, (_, i) => `M${180 + i * 6} ${540 - i * 24} l30 -4`) });
  if (s.fins || k === 'eel') a.shape({ d: smooth([[262, 410], [300, 380], [310, 300], [290, 240], [270, 330]], true, 0.5), fill: pal.fin || dark(hide, 0.3), fillOp: 0.85, depth: 6, ink: 1, lines: [0, 1, 2, 3, 4].map(i => `M${270 - i * 2} ${400 - i * 34} l34 -10`) });
  if (s.spikes !== false && k === 'wyrm') a.raw(D.spikes(280, 360, 6, 30, -0.4, 1.4, els.includes('frost') ? '#cfe6f4' : '#3a3028'));
  a.layer('head', [200, 220]);
  const hx = 160, hy = 190;
  if (k === 'tentacle') {
    // no head: the arm tapers to a curling tip, suckers along its inner face
    a.limb([[hx + 40, hy + 30], [hx, hy - 10], [hx - 30, hy - 60], [hx - 10, hy - 110], [hx + 30, hy - 120], [hx + 40, hy - 96]], [42, 34, 24, 14, 8, 3], { fill: pal.skin, depth: 10, mottle: 0.6, fine: true, hatch: 100 });
    const sp = [[190, 560], [200, 470], [260, 400], [270, 320], [230, 250], [hx + 40, hy + 30], [hx, hy - 10], [hx - 30, hy - 60], [hx - 10, hy - 110]];
    a.raw(Array.from({ length: 22 }, (_, i) => { const t = i / 22, u = t * (sp.length - 1), j = Math.min(sp.length - 2, Math.floor(u)), v = u - j, q = [sp[j][0] + (sp[j + 1][0] - sp[j][0]) * v + 14 - t * 10, sp[j][1] + (sp[j + 1][1] - sp[j][1]) * v]; const p = [q[0] + 20 - t * 10, q[1]]; const r = 9 - t * 6; return `<ellipse cx="${f(p[0] - 20 + t * 10)}" cy="${f(p[1])}" rx="${f(r)}" ry="${f(r * 0.75)}" fill="${light(pal.belly || pal.skin, 0.3)}" stroke="${INK}" stroke-width="0.9"/><ellipse cx="${f(p[0] - 20 + t * 10)}" cy="${f(p[1])}" rx="${f(r * 0.45)}" ry="${f(r * 0.32)}" fill="#5a2a30"/>`; }).join(''));
  } else if (k === 'worm' || k === 'leech') {
    a.shape({ d: smooth([[hx + 60, hy - 30], [hx + 40, hy + 40], [hx - 10, hy + 54], [hx - 46, hy + 36], [hx - 54, hy - 10], [hx - 30, hy - 52], [hx + 20, hy - 50]], true, 0.6), fill: hide, depth: 18, mottle: 0.6, fine: true, hatch: 90, lines: [0, 1, 2].map(i => `M${hx - 10 + i * 22} ${hy - 50} C${hx - 20 + i * 22} ${hy - 10} ${hx - 20 + i * 22} ${hy + 20} ${hx - 8 + i * 22} ${hy + 50}`) });
    a.raw(`<ellipse cx="${hx - 36}" cy="${hy}" rx="22" ry="38" fill="#6a1a14" stroke="${INK}" stroke-width="1.4"/><ellipse cx="${hx - 38}" cy="${hy}" rx="12" ry="24" fill="${G.black}"/>` + Array.from({ length: 22 }, (_, i) => { const t = i / 22 * 6.28; return `<path d="M${f(hx - 36 + Math.cos(t) * 20)} ${f(hy + Math.sin(t) * 35)} L${f(hx - 36 + Math.cos(t) * 12)} ${f(hy + Math.sin(t) * 22)}" stroke="${G.bone}" stroke-width="2.4" stroke-linecap="round"/>`; }).join('') + a.drip(hx - 30, hy + 36, 40, 2.4, '#c8b8a0'));
  } else {
    const H = k === 'eel' ? [[hx + 50, hy - 30], [hx + 56, hy + 26], [hx - 20, hy + 34], [hx - 74, hy + 22], [hx - 80, hy + 6], [hx - 30, hy - 24]] : [[hx + 54, hy - 40], [hx + 60, hy + 30], [hx - 20, hy + 40], [hx - 84, hy + 30], [hx - 92, hy + 8], [hx - 60, hy - 14], [hx - 10, hy - 36]];
    a.shape({ d: smooth(H, true, 0.55), fill: hide, depth: 16, mottle: 0.6, fine: true, hatch: 100, decals: D.skin(els[1] || el, hx, hy, 30) });
    a.raw(`<path d="M${hx - 88} ${hy + 14} L${hx + 6} ${hy + 18} L${hx - 70} ${hy + 46} Z" fill="${G.black}"/>` + Array.from({ length: 7 }, (_, i) => `<path d="M${hx - 82 + i * 12} ${hy + 15} l3 10 l3 -10 Z M${hx - 76 + i * 10} ${hy + 40 - i * 3} l3 -9 l3 9 Z" fill="${G.bone}" stroke="${INK}" stroke-width="0.5"/>`).join('') + D.glowEye(hx - 30, hy - 8, 3.4, EGLOW[el] || '#d8c060') + a.drip(hx - 60, hy + 40, 30, 2, '#c8c0a8'));
    if (k === 'wyrm') for (const sg of [0, 1]) a.limb([[hx + 30 + sg * 10, hy - 30], [hx + 60 + sg * 16, hy - 70], [hx + 90 + sg * 10, hy - 80]], [16, 10, 3], { fill: pal.horn || G.bone, depth: 4, hatch: 120 });
  }
  if (s.head_extra) s.head_extra(a, D, hx, hy);
  a.layer('arm', [200, 220]);
  a.raw(D.aura(el, hx + 20, hy - 30, 0.8));
  return { hand: [hx - 70, hy + 20], idle: 'coil', attack: 'bite' };
}

// ------------------------------------------------------------------ crawlers: spider, crab, beetle, mantis, centipede
function crawler(a, D, s) {
  const R = a.R, pal = s.pal, els = s.els, el = els[0], shell = pal.skin, k = s.kind || 'spider';
  const cx = k === 'crab' ? 266 : (k === 'spider' ? 210 : 190), cy = k === 'mantis' ? 380 : 520;
  a.layer('shadow'); a.raw(a.ground(cx, 676, 200, 12));
  const legN = k === 'centipede' ? 9 : (k === 'mantis' ? 2 : (k === 'crab' ? 4 : (k === 'spider' ? 4 : 3)));
  const legSpan = k === 'spider' ? 150 : (k === 'crab' ? 96 : 140);
  const drawLegs = (far) => {
    for (let i = 0; i < legN; i++) {
      const cp = [[cx + 220, cy + 110], [cx + 170, cy + 60], [cx + 120, cy + 34], [cx + 70, cy + 22], [cx + 20, cy + 4], [cx - 20, cy - 30], [cx - 50, cy - 80], [cx - 60, cy - 110], [cx - 64, cy - 130]];
      const bx = k === 'centipede' ? cp[i][0] + (far ? 10 : 0) : (k === 'crab' ? [cx - 80, cx - 40, cx + 40, cx + 70][i] + (far ? 12 : 0) : cx - 60 + i * 40 + (far ? 14 : 0)), by = k === 'centipede' ? cp[i][1] : cy + (k === 'mantis' ? 80 : 0);
      const dir = k === 'centipede' ? (far ? 1 : -1) * (i % 2 ? 1 : -1) : (i < legN / 2 ? -1 : 1);
      // coxa, femur rising to a high knee, tibia dropping, a short hooked tarsus on the ground
      const cent = k === 'centipede';
      const arach = k === 'spider' || k === 'beetle';
      const knee = cent ? [bx + dir * 22, by - 18] : (arach ? [bx + dir * legSpan * 0.38 + (R() - 0.5) * 10, by - 140 + (far ? 16 : 0) - i * 4] : [bx + dir * legSpan * (k === 'crab' ? 0.62 : 0.42) + (R() - 0.5) * 16, by - (k === 'crab' ? 54 : 70) + (far ? 10 : 0)]);
      const ank = cent ? [bx + dir * 36, by + 26] : (arach ? [bx + dir * legSpan * 0.8, by + 40 - (far ? 6 : 0)] : [bx + dir * legSpan * (k === 'crab' ? 0.95 : 0.6), 640 - (far ? 6 : 0)]);
      const tip = cent ? [bx + dir * 44, by + 42] : (arach ? [bx + dir * legSpan * 0.95, 670 - (far ? 6 : 0)] : [bx + dir * legSpan * (k === 'crab' ? 1.08 : 0.68), 670 - (far ? 6 : 0)]);
      const wd = cent ? [11, 9, 6, 2] : (k === 'crab' ? [30, 24, 16, 5] : (k === 'spider' ? [18, 15, 10, 3] : [20, 16, 11, 3]));
      a.limb([[bx, by], knee, ank, tip], wd, { fill: far ? dark(shell, 0.3) : shell, depth: 5, mottle: 0.4, hatch: far ? 40 : 110,
        lines: [`M${f(knee[0] - wd[1] * 0.5)} ${f(knee[1] + 4)} l${f(wd[1])} -2`, `M${f(ank[0] - wd[2] * 0.5)} ${f(ank[1] - 2)} l${f(wd[2])} 0`],
        after: k === 'spider' || k === 'crab' ? Array.from({ length: 4 }, (_, j) => { const t = (j + 1) / 5, p = [knee[0] + (ank[0] - knee[0]) * t, knee[1] + (ank[1] - knee[1]) * t]; return `<path d="M${f(p[0])} ${f(p[1])} l${f(dir * 7)} -3" stroke="${INK}" stroke-width="1"/>`; }).join('') : '' });
    }
  };
  a.layer('legs', [cx, cy]); drawLegs(true);
  a.layer('back', [cx + 80, cy - 30]);
  if (k === 'spider' || k === 'mantis' || k === 'beetle') {
    const ab = k === 'spider' ? Array.from({ length: 14 }, (_, i) => { const t = i / 14 * 6.28; return [cx + 140 + Math.cos(t) * 100, cy - 60 + Math.sin(t) * 78 - (Math.sin(t) < 0 ? 10 : 0)]; }) : (k === 'mantis' ? [[cx + 20, cy + 60], [cx + 110, cy + 40], [cx + 200, cy + 90], [cx + 190, cy + 140], [cx + 60, cy + 120]] : [[cx + 20, cy - 60], [cx + 140, cy - 110], [cx + 230, cy - 60], [cx + 220, cy + 30], [cx + 60, cy + 30]]);
    a.shape({ d: smooth(ab, true, 0.6), fill: shell, depth: 30, mottle: 0.6, fine: true, hatch: 60, spec: [`M${cx + 90} ${cy - 90} C${cx + 150} ${cy - 110} ${cx + 200} ${cy - 90} ${cx + 220} ${cy - 60}`], specOp: 0.4,
      decals: D.skin(el, cx + 150, cy - 50, 70) + (k === 'spider' ? `<path d="M${cx + 120} ${cy - 90} l20 30 l-20 30 l20 30 M${cx + 180} ${cy - 90} l-20 30 l20 30" stroke="${pal.accent || '#a83a2a'}" stroke-width="4" fill="none"/>` : '') + (k === 'beetle' ? `<path d="M${cx + 30} ${cy - 50} C${cx + 120} ${cy - 70} ${cx + 180} ${cy - 40} ${cx + 225} ${cy - 20}" stroke="${INK}" stroke-width="1.4" fill="none"/>` : '') + (k === 'mantis' ? Array.from({ length: 6 }, (_, i) => `<path d="M${cx + 50 + i * 24} ${cy + 50 + i * 6} l0 60" stroke="${INK}" stroke-width="0.8"/>`).join('') : '') });
    if (s.wings) wingsMini(a, D, [cx + 60, cy - 40], pal);
  }
  if (k === 'centipede') a.limb([[cx + 250, cy + 130], [cx + 200, cy + 70], [cx + 120, cy + 34], [cx + 40, cy + 14], [cx - 30, cy - 40], [cx - 64, cy - 130]], [30, 46, 54, 56, 52, 44], { fill: shell, depth: 18, mottle: 0.6, hatch: 70, lines: Array.from({ length: 12 }, (_, i) => `M${cx + 230 - i * 26} ${cy + 140 - i * 20} l-6 -50`), decals: D.skin(el, cx + 60, cy, 60) });
  a.layer('body', [cx, cy]);
  if (k === 'crab') a.shape({ d: smooth([[cx - 130, cy - 20], [cx - 110, cy - 70], [cx - 50, cy - 110], [cx + 40, cy - 116], [cx + 110, cy - 84], [cx + 140, cy - 30], [cx + 120, cy + 14], [cx + 40, cy + 30], [cx - 60, cy + 30], [cx - 120, cy + 12]], true, 0.6), lines: [`M${cx - 100} ${cy - 40} C${cx - 40} ${cy - 60} ${cx + 40} ${cy - 60} ${cx + 120} ${cy - 30}`, `M${cx - 30} ${cy - 100} C${cx - 20} ${cy - 60} ${cx - 10} ${cy - 30} ${cx} ${cy + 20}`], fill: shell, depth: 34, mottle: 0.6, fine: true, hatch: 70, decals: D.skin(el, cx, cy - 50, 80) + a.stain(cx + 30, cy - 20, 24, G.black, 0.5) + Array.from({ length: 14 }, (_, i) => `<circle cx="${f(cx - 90 + R() * 200)}" cy="${f(cy - 90 + R() * 90)}" r="${f(2 + R() * 3)}" fill="${light(shell, 0.3)}" stroke="${INK}" stroke-width="0.7"/>`).join('') });
  if (k === 'crab') a.raw(Array.from({ length: 7 }, (_, i) => { const t = i / 6, x = cx - 120 + t * 250, y = cy - 30 - Math.sin(t * 3.14) * 86; return `<path d="M${f(x - 5)} ${f(y + 4)} L${f(x)} ${f(y - 12)} L${f(x + 5)} ${f(y + 4)} Z" fill="${light(shell, 0.2)}" stroke="${INK}" stroke-width="0.8"/>`; }).join(''));
  else if (k !== 'centipede') a.shape({ d: smooth(k === 'mantis' ? [[cx - 20, cy + 70], [cx - 40, cy - 60], [cx - 10, cy - 140], [cx + 20, cy - 60], [cx + 30, cy + 70]] : Array.from({ length: 12 }, (_, i) => { const t = i / 12 * 6.28; return [cx + Math.cos(t) * 70, cy - 30 + Math.sin(t) * 44]; }), true, 0.6), fill: shell, depth: 20, mottle: 0.6, fine: true, hatch: 80, decals: D.skin(els[1] || el, cx, cy - 30, 40) });
  drawLegs(false);
  a.layer('head', [cx - 60, cy - 40]);
  if (k === 'crab') {
    for (const dx of [-70, -40]) a.raw(`<path d="M${cx + dx} ${cy - 90} L${cx + dx - 6} ${cy - 130}" stroke="${INK}" stroke-width="6"/><path d="M${cx + dx} ${cy - 90} L${cx + dx - 6} ${cy - 130}" stroke="${shell}" stroke-width="3.4"/>` + D.glowEye(cx + dx - 6, cy - 134, 4, EGLOW[el] || '#d8c060'));
    a.raw(Array.from({ length: 6 }, (_, i) => `<path d="M${cx - 104 + i * 6} ${cy - 30} l-${8 + i % 2 * 6} ${14 + i * 2}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`).join('') + a.drip(cx - 96, cy - 10, 30, 2, '#c8c0a8'));
  }
  const hx = k === 'mantis' ? cx - 40 : (k === 'centipede' ? cx - 80 : cx - 90), hy = k === 'mantis' ? cy - 170 : (k === 'centipede' ? cy - 150 : cy - 40);
  if (k !== 'crab') a.shape({ d: smooth(k === 'mantis' ? [[hx - 40, hy - 10], [hx, hy - 34], [hx + 40, hy - 10], [hx, hy + 40]] : [[hx - 40, hy - 30], [hx + 20, hy - 40], [hx + 40, hy], [hx + 10, hy + 34], [hx - 44, hy + 20]], true, 0.6), fill: shell, depth: 14, mottle: 0.6, hatch: 100,
    after: (k === 'spider' ? D.eyes(hx - 10, hy - 14, 16, 6, EGLOW[el] || '#c8a040') : D.glowEye(hx - 26, hy - 8, 4, EGLOW[el] || '#c8a040') + (k === 'mantis' ? D.glowEye(hx + 24, hy - 8, 4, EGLOW[el] || '#c8a040') : '')) });
  // mandibles / fangs
  if (k !== 'crab') for (const sg of [-1, 1]) a.raw(`<path d="M${hx - 36} ${hy + sg * 10 + 8} C${hx - 66} ${hy + sg * 14 + 10} ${hx - 70} ${hy + sg * 2 + 26} ${hx - 56} ${hy + 30}" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M${hx - 36} ${hy + sg * 10 + 8} C${hx - 66} ${hy + sg * 14 + 10} ${hx - 70} ${hy + sg * 2 + 26} ${hx - 56} ${hy + 30}" stroke="${G.bone}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`);
  if (k === 'mantis' || k === 'beetle') a.raw(`<path d="M${hx} ${hy - 30} C${hx - 30} ${hy - 90} ${hx - 70} ${hy - 110} ${hx - 100} ${hy - 100} M${hx + 10} ${hy - 30} C${hx - 10} ${hy - 100} ${hx - 40} ${hy - 130} ${hx - 60} ${hy - 130}" stroke="${INK}" stroke-width="2" fill="none"/>`);
  if (s.head_extra) s.head_extra(a, D, hx, hy);
  // striking limbs: claws, scythes, or fangs
  a.layer('arm', [cx - 50, cy - 30]);
  if (k === 'crab' || k === 'mantis' || s.pincers) {
    const sh = [cx - 90, cy - 10], el2 = k === 'mantis' ? [cx - 120, cy - 150] : [cx - 130, cy + 10], wr = k === 'mantis' ? [cx - 160, cy - 60] : [cx - 150, cy - 60];
    a.limb([sh, el2, wr], k === 'crab' ? [40, 34, 30] : [34, 26, 20], { fill: shell, depth: 8, mottle: 0.5, hatch: 120 });
    if (k === 'mantis') a.shape({ d: smooth([[wr[0], wr[1]], [wr[0] - 20, wr[1] + 50], [wr[0] - 10, wr[1] + 110], [wr[0] + 6, wr[1] + 50]], true, 0.4), fill: G.bone, depth: 4, ink: 1.1, after: Array.from({ length: 6 }, (_, i) => `<path d="M${wr[0] + 2} ${wr[1] + 20 + i * 14} l8 4 l-8 4" fill="${INK}"/>`).join('') });
    else a.shape({ d: smooth([[wr[0] + 30, wr[1] + 30], [wr[0] + 10, wr[1] - 40], [wr[0] - 40, wr[1] - 80], [wr[0] - 80, wr[1] - 76], [wr[0] - 50, wr[1] - 44], [wr[0] - 20, wr[1] - 22], [wr[0] - 70, wr[1] - 16], [wr[0] - 90, wr[1] + 10], [wr[0] - 30, wr[1] + 50]], true, 0.4), lines: [`M${wr[0] - 20} ${wr[1] - 20} C${wr[0] + 0} ${wr[1]} ${wr[0] + 10} ${wr[1] + 20} ${wr[0] + 20} ${wr[1] + 30}`], after: Array.from({ length: 5 }, (_, j) => `<path d="M${wr[0] - 70 + j * 10} ${wr[1] - 14 + j * 2} l3 6 l3 -6" fill="${G.bone}" stroke="${INK}" stroke-width="0.6"/>`).join(''), fill: shell, depth: 14, mottle: 0.6, ink: 1.3, decals: D.skin(el, wr[0] - 30, wr[1] + 10, 30) });
    a.raw(D.aura(el, wr[0] - 30, wr[1], 0.6));
    return { hand: [wr[0] - 50, wr[1]], idle: 'scuttle', attack: k === 'mantis' ? 'claw' : 'pinch' };
  }
  a.raw(D.aura(el, hx, hy - 30, 0.7));
  return { hand: [hx - 60, hy + 20], idle: 'scuttle', attack: 'bite' };
}
function wingsMini(a, D, at, pal) {
  const [x, y] = at;
  for (const o of [0, 40]) a.shape({ d: smooth([[x, y], [x + 110, y - 190 + o], [x + 170, y - 170 + o], [x + 50, y + 10]], true, 0.6), fill: pal.wing || '#c8c0a0', fillOp: 0.55, depth: 6, ink: 0.9, lines: [0, 1, 2, 3].map(i => `M${x} ${y} L${x + 110 + i * 14} ${y - 186 + o + i * 6}`) });
}

// ------------------------------------------------------------------ floaters: wraith, eye, wisp, jelly, head
function floater(a, D, s) {
  if ((s.kind || 'wraith') === 'wraith') return require('./kit').humanoid(a, D, Object.assign({}, s, { build: 'gaunt', dress: 'robe', float: true, gear: 'hood', lean: 18, weapon: s.weapon || 'claws', attack: s.attack || 'claw', idle: 'float',
    headSpec: { style: 'skull', eye: 'socket', jaw: 0.5, flesh: false }, hoodFill: dark(s.pal.cloth || G.black, 0.35), pal: Object.assign({}, s.pal, { cloth: s.pal.cloth || G.black, skin: '#b8ae98' }), armFill: s.pal.cloth || G.black }));
  const R = a.R, pal = s.pal, els = s.els, el = els[0], k = s.kind || 'wraith', cx = 230;
  a.layer('shadow'); a.raw(a.ground(cx, 676, 90, 8) + a.glow(cx, 660, 90, EGLOW[el] || '#888', 0.25));
  a.layer('back', [cx, 400]);
  if (k === 'wraith') a.shape({ d: smooth([[cx - 70, 240], [cx + 70, 236], [cx + 110, 400], [cx + 90, 560], [cx + 50, 520], [cx + 30, 620], [cx - 10, 540], [cx - 40, 640], [cx - 70, 530], [cx - 110, 580], [cx - 100, 400]], true, 0.5), fill: pal.cloth || G.black, fillOp: 0.9, depth: 40, mottle: 0.6, hatch: 30, decals: D.skin(el, cx, 420, 80) + a.fold(cx - 40, 300, cx - 60, 560, 8) + a.fold(cx + 30, 300, cx + 50, 540, 8) });
  if (k === 'jelly' || k === 'eye' || k === 'head') for (let i = 0; i < 7; i++) { const x0 = cx - 60 + i * 20; a.limb([[x0, 360], [x0 + (R() - 0.5) * 50, 460], [x0 + (R() - 0.5) * 70, 560], [x0 + (R() - 0.5) * 60, 630]], [16, 12, 8, 3], { fill: pal.skin, depth: 4, mottle: 0.4, hatch: 70, decals: i % 2 ? D.skin(els[1] || el, x0, 500, 20) : '' }); }
  if (k === 'wisp') a.raw(a.glow(cx, 330, 180, EGLOW[el] || '#fff', 0.55) + D.aura(el, cx, 420, 1.6));
  a.layer('body', [cx, 330]);
  if (k === 'eye') {
    a.shape({ d: blob(cx, 300, 110, R, 14, 0.06), fill: pal.skin, depth: 40, mottle: 0.6, fine: true, hatch: 60, decals: `<g stroke="${G.bloodL}" stroke-width="1.2" fill="none">` + Array.from({ length: 14 }, () => { const a0 = R() * 6.28; return `<path d="M${f(cx + Math.cos(a0) * 100)} ${f(300 + Math.sin(a0) * 100)} Q${f(cx + Math.cos(a0 + 0.3) * 60)} ${f(300 + Math.sin(a0 + 0.3) * 60)} ${f(cx + Math.cos(a0) * 40)} ${f(300 + Math.sin(a0) * 40)}"/>`; }).join('') + '</g>' });
    a.raw(`<circle cx="${cx - 30}" cy="300" r="52" fill="${pal.iris || EGLOW[el] || '#c8a040'}" stroke="${INK}" stroke-width="1.6"/><ellipse cx="${cx - 34}" cy="300" rx="12" ry="40" fill="${G.black}"/><circle cx="${cx - 48}" cy="280" r="8" fill="#fff" opacity="0.8"/>` + a.glow(cx - 30, 300, 80, EGLOW[el] || '#fff', 0.3));
  } else if (k === 'jelly') {
    a.shape({ d: smooth([[cx - 130, 360], [cx - 110, 230], [cx, 180], [cx + 110, 230], [cx + 130, 360], [cx + 60, 340], [cx, 370], [cx - 60, 340]], true, 0.6), fill: pal.skin, fillOp: 0.8, depth: 30, mottle: 0.5, hatch: 60, decals: D.skin(el, cx, 290, 80) + a.glow(cx, 280, 60, EGLOW[el] || '#fff', 0.6) });
  } else if (k === 'wisp') {
    const recol = el === 'void' ? (t => t.replace(/#8a2a12/g, '#1a1020').replace(/#e0621e/g, '#4a2a6a').replace(/#ffc860/g, '#b89ae8').replace(/#ff7a2a/g, '#6a3aa0'))
      : (el === 'lightning' ? (t => t.replace(/#8a2a12/g, '#6a5a2a').replace(/#e0621e/g, '#d8c050').replace(/#ffc860/g, '#fffbe0').replace(/#ff7a2a/g, '#ffe680')) : (t => t));
    // a teardrop of fire: round below the skull, drawn up into licking tongues
    const tear = (k2, col, ink) => { const pts = [[cx, 470 + 60 * k2 - 60]]; for (let i = 0; i <= 16; i++) { const t = i / 16 * Math.PI * 2 - Math.PI / 2; const r = 110 * k2, up = Math.sin(t) < -0.2; pts.push([cx + Math.cos(t) * r * (up ? 0.7 : 1), 360 + Math.sin(t) * r * (up ? 2.2 + (i % 2) * 0.6 : 0.9)]); } return `<path d="${smooth(pts.slice(1), true, 0.5)}" fill="${col}"${ink ? ` stroke="${INK}" stroke-width="1.2"` : ''}/>`; };
    a.raw(a.glow(cx, 360, 200, el === 'void' ? '#6a3aa0' : (el === 'lightning' ? '#ffe680' : '#ff7a2a'), 0.5) + `<g filter="url(#rough)" opacity="0.92">` + recol(tear(1, '#8a2a12', false) + tear(0.75, '#e0621e', false) + tear(0.45, '#ffc860', false)) + `</g>` + recol(D.flame(cx - 40, 330, 150, 40, -0.1) + D.flame(cx + 30, 320, 170, 46, 0.08) + D.flame(cx, 300, 200, 50, 0)));
    require('./anatomy')(a).head({ x: cx - 4, y: 330, k: 1.5, style: 'skull', jaw: 0.7, eye: 'socket', glow: EGLOW[el] || '#fff', flesh: false });
    a.raw(a.glow(cx, 340, 140, EGLOW[el] || '#fff', 0.3) + (el === 'lightning' || els.includes('lightning') ? D.arcs(cx, 340, 120, 4) : '') + D.embers(cx, 260, 200, 18));
  } else if (k === 'head') {
    const Hd = require('./anatomy')(a).head({ x: cx + 16, y: 300, k: 2.5, skin: pal.skin, style: 'bloated', jaw: 0.75, eye: 'milky', hair: s.hair,
      decals: `<g stroke="${G.bloodD}" stroke-width="1.4" fill="none" opacity="0.7">` + Array.from({ length: 9 }, () => { const x0 = cx - 60 + R() * 140, y0 = 220 + R() * 140; return `<path d="M${f(x0)} ${f(y0)} q${f((R() - 0.5) * 30)} ${f(10 + R() * 20)} ${f((R() - 0.5) * 40)} ${f(30 + R() * 30)}"/>`; }).join('') + '</g>' + a.stain(cx - 30, 360, 30, G.bruise, 0.6) + a.stain(cx + 60, 260, 40, dark(pal.skin, 0.3), 0.6) });
    a.raw(D.skin(el, cx + 40, 240, 70) + D.eyes(cx + 50, 230, 36, 4, EGLOW[el]) + D.pustules(cx + 70, 330, 30, 8) + a.gash(cx + 40, 250, cx + 90, 290, 5, { rim: '#a86a5a', dripLen: 20 }));
  } else {
    a.shape({ d: smooth([[cx - 60, 230], [cx + 60, 226], [cx + 66, 380], [cx - 62, 384]], true, 0.5), fill: pal.cloth || G.black, depth: 24, mottle: 0.5, hatch: 40, decals: D.skin(el, cx, 300, 50) });
  }
  a.layer('head', [cx - 10, 220]);
  if (k === 'wraith') {
    a.shape({ d: smooth([[cx - 70, 200], [cx - 40, 120], [cx + 30, 110], [cx + 70, 160], [cx + 66, 250], [cx - 66, 254]], true, 0.6), fill: pal.cloth || G.black, depth: 20, mottle: 0.5, hatch: 30 });
    a.raw(`<path d="M${cx - 54} 170 C${cx - 30} 150 ${cx + 10} 150 ${cx + 30} 180 C${cx + 24} 230 ${cx - 40} 236 ${cx - 54} 170 Z" fill="${G.black}"/>` + D.glowEye(cx - 30, 186, 3.2, EGLOW[el] || '#fff') + D.glowEye(cx - 6, 188, 2.6, EGLOW[el] || '#fff') + (s.skullFace ? `<path d="M${cx - 40} 196 C${cx - 30} 210 ${cx - 10} 212 ${cx} 200" stroke="${G.bone}" stroke-width="2" fill="none"/>` : ''));
  }
  if (s.head_extra) s.head_extra(a, D, cx, 200);
  a.layer('arm', [cx + 40, 250]);
  if (k === 'wraith') { a.limb([[cx + 40, 250], [cx - 10, 300], [cx - 80, 300]], [30, 24, 18], { fill: pal.cloth || G.black, depth: 8, hatch: 120 }); const tip = require('./kit').held(a, D, s.weapon || 'claws', [cx - 84, 300], [-1, 0], pal, els); a.raw(D.aura(el, tip[0], tip[1], 0.6)); return { hand: tip, idle: 'float', attack: s.attack || 'claw' }; }
  a.raw(D.aura(el, cx, 220, 0.8));
  return { hand: [cx - 60, 300], idle: k === 'wisp' ? 'wobble' : 'float', attack: s.attack || 'wail' };
}

// ------------------------------------------------------------------ golems: bronze, ice, obsidian, stone, wood, clockwork
function golem(a, D, s) {
  // A made thing in the shape of a man: cast or carved plates over a heavy frame, seams, rivets, a fire or storm inside.
  const K = require('./kit'), el = s.els[0], mat = s.pal.skin;
  const core = s.core, gears = s.gears, crown = s.crown, extra = s.body_extra, hx = s.head_extra;
  const spec = Object.assign({}, s, { build: s.build || 'giant', dress: 'bare', noLoin: true, weapon: s.weapon || 'none', armPose: s.armPose || 'low', belt: false, headK: 0.92, idle: 'heavy', attack: 'slam', lean: 14,
    pal: Object.assign({}, s.pal, { skin: mat, cloth: dark(mat, 0.25), metal: mat }),
    headSpec: { style: 'brute', eye: 'glow', jaw: 0, glow: EGLOW[el] || '#ffb050' },
    body_extra: (a2, D2, cx, w) => {
      // cast plate seams, rivet rows, cracks venting the inner element
      a.raw(`<g stroke="${INK}" stroke-width="1.6" fill="none">` + [[cx - 50 * w, 236, cx + 40 * w, 232], [cx - 56 * w, 300, cx + 48 * w, 296], [cx - 44 * w, 372, cx + 36 * w, 368], [cx - 8, 214, cx - 16, 450]].map(([x0, y0, x1, y1]) => `<path d="M${f(x0)} ${y0} Q${f((x0 + x1) / 2)} ${y0 + 8} ${f(x1)} ${y1}"/>`).join('') + `</g>` +
        [236, 300, 372].map(y => Array.from({ length: 6 }, (_, i) => a.rivet(cx - 44 * w + i * 16 * w, y + 6, 2.2)).join('')).join('') + (s.els.includes('fire') ? D.crack(cx - 30, 250, cx + 10, 340) + D.crack(cx + 20, 380, cx - 6, 440) : D.skin(el, cx - 10, 330, 50)));
      if (core) a.raw(a.glow(cx - 10, 300, 70, EGLOW[el] || '#fff', 0.85) + `<circle cx="${cx - 10}" cy="300" r="22" fill="${dark(mat, 0.4)}" stroke="${INK}" stroke-width="2"/><circle cx="${cx - 10}" cy="300" r="15" fill="${light(EGLOW[el] || '#ffffff', 0.45)}" stroke="${INK}" stroke-width="1.2"/>` + Array.from({ length: 8 }, (_, i) => { const t = i / 8 * 6.28; return `<path d="M${f(cx - 10 + Math.cos(t) * 16)} ${f(300 + Math.sin(t) * 16)} L${f(cx - 10 + Math.cos(t) * 22)} ${f(300 + Math.sin(t) * 22)}" stroke="${INK}" stroke-width="1.6"/>`; }).join(''));
      if (gears) a.raw([[cx + 40, 400, 24], [cx - 36, 420, 16]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${G.gold}" stroke="${INK}" stroke-width="1.4"/>` + Array.from({ length: 10 }, (_, i) => { const t = i / 10 * 6.28; return `<rect x="${f(x + Math.cos(t) * r - 3)}" y="${f(y + Math.sin(t) * r - 3)}" width="6" height="6" fill="${G.gold}" stroke="${INK}" stroke-width="0.8" transform="rotate(${f(t * 57.3)} ${f(x + Math.cos(t) * r)} ${f(y + Math.sin(t) * r)})"/>`; }).join('') + `<circle cx="${x}" cy="${y}" r="${r * 0.3}" fill="${G.black}"/>`).join(''));
      if (extra) extra(a, D, cx, w);
    },
    head_extra: (a2, D2, x, y) => {
      a.raw(`<path d="M${x - 44} ${y - 10} L${x + 20} ${y - 14} L${x + 22} ${y + 2} L${x - 44} ${y + 6} Z" fill="${dark(mat, 0.35)}" stroke="${INK}" stroke-width="1.4"/>` + a.glow(x - 20, y - 4, 40, EGLOW[el] || '#fff', 0.7) + `<path d="M${x - 40} ${y - 4} L${x + 14} ${y - 6}" stroke="${light(EGLOW[el] || '#ffffff', 0.6)}" stroke-width="2.6"/>`);
      if (crown) a.raw(D.spikes(x, y - 46, 5, 34, -Math.PI / 2, 1.3, crown));
      if (hx) hx(a, D, x, y);
    } });
  return K.humanoid(a, D, spec);
}

// ------------------------------------------------------------------ bird (thunderbird, carrion, gull): perched, wings mantled
function bird(a, D, s) {
  const R = a.R, pal = s.pal, els = s.els, el = els[0], cx = 240, cy = 400;
  a.layer('shadow'); a.raw(a.ground(cx, 676, 110, 10));
  a.layer('back', [cx + 20, cy - 60]);
  const require2 = require('./kit');
  require2.wings(a, D, s.wingKind || 'feather', [cx + 20, cy - 60], { wing: pal.skin, cloth: pal.skin }, els, 1.1);
  a.layer('legs', [cx, cy + 100]);
  for (const x of [cx - 10, cx + 30]) { a.limb([[x, cy + 90], [x - 10, cy + 180], [x - 4, 656]], [26, 12, 9], { fill: pal.leg || '#8a7a5a', depth: 4, hatch: 120, lines: Array.from({ length: 8 }, (_, i) => `M${x - 14} ${cy + 190 + i * 10} l14 0`) }); for (const t of [-1, 0, 1]) a.raw(`<path d="M${x - 4} 656 l${t * 16 - 14} 16" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M${x - 4} 656 l${t * 16 - 14} 16" stroke="${G.bone}" stroke-width="2.4" stroke-linecap="round"/>`); }
  a.layer('body', [cx, cy]);
  a.shape({ d: smooth([[cx - 70, cy - 120], [cx + 30, cy - 140], [cx + 90, cy - 40], [cx + 80, cy + 80], [cx + 160, cy + 160], [cx + 20, cy + 120], [cx - 60, cy + 60]], true, 0.6), fill: pal.skin, depth: 40, mottle: 0.6, hatch: 70,
    lines: Array.from({ length: 30 }, () => { const x = cx - 50 + R() * 120, y = cy - 110 + R() * 210; return `M${f(x)} ${f(y)} q6 6 0 12`; }), decals: D.skin(el, cx, cy - 20, 60) + a.stain(cx - 20, cy + 40, 20, G.blood, 0.5) });
  a.layer('head', [cx - 50, cy - 120]);
  a.limb([[cx - 40, cy - 100], [cx - 70, cy - 170]], [60, 44], { fill: pal.skin, depth: 10, hatch: 90, mottle: 0.5 });
  a.shape({ d: smooth([[cx - 110, cy - 200], [cx - 70, cy - 230], [cx - 30, cy - 200], [cx - 40, cy - 160], [cx - 90, cy - 160]], true, 0.6), fill: s.bald ? '#b89a8a' : pal.skin, depth: 14, hatch: 100, mottle: 0.6 });
  a.shape({ d: smooth([[cx - 106, cy - 196], [cx - 160, cy - 180], [cx - 170, cy - 168], [cx - 150, cy - 166], [cx - 100, cy - 174]], true, 0.5), fill: pal.beak || '#c8a860', depth: 5, ink: 1.2, lines: [`M${cx - 104} ${cy - 184} L${cx - 166} ${cy - 172}`] });
  a.raw(D.glowEye(cx - 84, cy - 200, 3.2, EGLOW[el] || '#e0c050'));
  if (s.head_extra) s.head_extra(a, D, cx - 80, cy - 200);
  a.layer('arm', [cx - 40, cy - 100]);
  a.raw(D.aura(el, cx - 90, cy - 230, 0.9));
  return { hand: [cx - 160, cy - 170], idle: 'float', attack: 'bite' };
}

// ------------------------------------------------------------------ moth / winged insect, hovering
function moth(a, D, s) {
  // A moth seen from the side and above: furred thorax, segmented abdomen, long forewings with a scalloped margin,
  // banded pattern and a discal spot, rounded hindwings carrying an eyespot. Wings raised, mid-beat.
  const R = a.R, pal = s.pal, els = s.els, el = els[0], cx = 236, cy = 340;
  const wc = pal.wing || pal.skin, band = dark(wc, 0.45), acc = pal.accent || '#c8a040';
  a.layer('shadow'); a.raw(a.ground(cx, 676, 90, 8));
  a.layer('back', [cx, cy]);
  const wing = (root, tip, back, rear, far, fore) => {
    const k = far ? 0.82 : 1, c = far ? dark(wc, 0.25) : wc;
    const T = (p) => [root[0] + (p[0] - root[0]) * k, root[1] + (p[1] - root[1]) * k];
    const margin = []; const n = 9;
    for (let i = 0; i <= n; i++) { const t = i / n; const p = [tip[0] + (rear[0] - tip[0]) * t, tip[1] + (rear[1] - tip[1]) * t]; const bulge = Math.sin(t * 3.14) * (fore ? 26 : 40); margin.push(T([p[0] + bulge * (back[0] > root[0] ? 0.6 : -0.6), p[1] + bulge + (i % 2 ? 5 : 0)])); }
    const pts = [T(root), T(back), ...margin];
    let dec = '';
    const mid = (f1) => T([root[0] + (tip[0] - root[0]) * f1, root[1] + (tip[1] - root[1]) * f1]);
    for (const f1 of [0.38, 0.66]) { const p0 = mid(f1), p1 = T([root[0] + (rear[0] - root[0]) * f1 * 1.05, root[1] + (rear[1] - root[1]) * f1 * 1.05]); dec += `<path d="M${f(p0[0])} ${f(p0[1])} Q${f((p0[0] + p1[0]) / 2 + 14)} ${f((p0[1] + p1[1]) / 2 - 8)} ${f(p1[0])} ${f(p1[1])}" stroke="${band}" stroke-width="${fore ? 7 : 5}" fill="none" opacity="0.8"/>`; }
    if (fore) { const d0 = mid(0.52); dec += `<path d="${blob(d0[0], d0[1] + 14, 7, R, 7, 0.3)}" fill="${band}"/>`; }
    else { const e = T([root[0] + (rear[0] - root[0]) * 0.55 + (tip[0] - root[0]) * 0.2, root[1] + (rear[1] - root[1]) * 0.55 + (tip[1] - root[1]) * 0.2]); dec += `<circle cx="${f(e[0])}" cy="${f(e[1])}" r="${f(22 * k)}" fill="${G.black}"/><circle cx="${f(e[0])}" cy="${f(e[1])}" r="${f(16 * k)}" fill="${acc}"/><circle cx="${f(e[0] - 2)}" cy="${f(e[1])}" r="${f(8 * k)}" fill="${G.black}"/><circle cx="${f(e[0] - 4)}" cy="${f(e[1] - 3)}" r="${f(2.4 * k)}" fill="#fff"/>`; }
    dec += D.skin(el, mid(0.5)[0], mid(0.5)[1] + 30, 40);
    const veins = Array.from({ length: 6 }, (_, i) => { const p = margin[Math.min(margin.length - 1, i * 2)]; return { d: `M${f(T(root)[0])} ${f(T(root)[1])} Q${f((T(root)[0] + p[0]) / 2)} ${f((T(root)[1] + p[1]) / 2 - 10)} ${f(p[0])} ${f(p[1])}`, w: 0.7, op: 0.6 }; });
    a.shape({ d: smooth(pts, true, 0.45), fill: c, depth: 22, mottle: 0.8, fine: true, hatch: far ? 40 : 70, lines: veins, decals: dec, ink: 1.2 });
    a.raw(margin.map(p => `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="1.6" fill="${light(c, 0.4)}"/>`).join(''));
  };
  const root = [cx + 10, cy - 6];
  wing(root, [cx + 200, cy - 210], [cx + 70, cy - 150], [cx + 170, cy + 10], true, true);
  wing(root, [cx + 150, cy + 40], [cx + 120, cy - 10], [cx + 60, cy + 150], true, false);
  wing(root, [cx - 120, cy - 240], [cx - 20, cy - 170], [cx - 170, cy - 20], false, true);
  wing(root, [cx - 120, cy + 30], [cx - 120, cy - 30], [cx - 40, cy + 150], false, false);
  a.layer('body', [cx, cy]);
  a.limb([[cx + 14, cy + 30], [cx + 24, cy + 100], [cx + 34, cy + 180], [cx + 40, cy + 230]], [52, 50, 36, 14], { fill: dark(pal.skin, 0.05), depth: 12, mottle: 0.6, hatch: 70, lines: Array.from({ length: 9 }, (_, i) => ({ d: `M${cx - 10 + i * 2} ${cy + 50 + i * 20} q24 8 48 0`, w: 0.9 })), decals: D.skin(els[1] || el, cx + 24, cy + 120, 30) });
  a.shape({ d: blob(cx + 8, cy, 40, R, 10, 0.12), fill: pal.fur || light(pal.skin, 0.2), depth: 12, mottle: 0.7, hatch: 90, lines: Array.from({ length: 30 }, () => { const t = R() * 6.28, r0 = 30 + R() * 8; return `M${f(cx + 8 + Math.cos(t) * r0)} ${f(cy + Math.sin(t) * r0)} l${f(Math.cos(t) * 8)} ${f(Math.sin(t) * 8)}`; }) });
  for (let i = 0; i < 3; i++) a.limb([[cx - 10, cy + 20 + i * 12], [cx - 46, cy + 50 + i * 26], [cx - 40, cy + 104 + i * 26], [cx - 54, cy + 120 + i * 26]], [8, 6, 4, 2], { fill: dark(pal.skin, 0.3), depth: 3, hatch: 120 });
  a.layer('head', [cx - 20, cy - 30]);
  a.shape({ d: blob(cx - 30, cy - 30, 26, R, 9, 0.12), fill: pal.fur || light(pal.skin, 0.2), depth: 10, mottle: 0.7, hatch: 100, lines: Array.from({ length: 18 }, () => `M${f(cx - 50 + R() * 40)} ${f(cy - 50 + R() * 36)} l${f(-3 + R() * 6)} 7`) });
  a.raw(`<path d="${blob(cx - 46, cy - 30, 13, R, 9, 0.06)}" fill="${G.black}" stroke="${INK}" stroke-width="1"/>` + a.glow(cx - 46, cy - 30, 30, EGLOW[el] || '#e0c050', 0.5) + `<path d="${blob(cx - 50, cy - 34, 4, R, 7, 0.1)}" fill="${light(EGLOW[el] || '#e0c050', 0.5)}"/>`);
  for (const [dx, dy] of [[0, 0], [16, -6]]) { let o = `M${cx - 40 + dx} ${cy - 52 + dy} C${cx - 70 + dx} ${cy - 110 + dy} ${cx - 110 + dx} ${cy - 130 + dy} ${cx - 140 + dx} ${cy - 120 + dy}`; for (let i = 1; i < 12; i++) { const t = i / 12, x = cx - 40 + dx - 100 * t, y = cy - 52 + dy - 70 * Math.sin(t * 2); o += ` M${f(x)} ${f(y)} l-6 -8 M${f(x)} ${f(y)} l6 -9`; } a.raw(`<path d="${o}" stroke="${INK}" stroke-width="1.6" fill="none"/>`); }
  a.raw(`<path d="M${cx - 50} ${cy - 10} C${cx - 64} ${cy + 10} ${cx - 60} ${cy + 30} ${cx - 50} ${cy + 36}" stroke="${INK}" stroke-width="2.2" fill="none"/>`);
  if (s.face) s.face(a, D, cx - 30, cy - 30);
  a.layer('arm', [cx, cy]);
  a.raw(D.spores(cx, cy + 100, 140, 30) + D.aura(el, cx - 40, cy - 20, 0.6));
  return { hand: [cx - 50, cy - 40], idle: 'float', attack: s.attack || 'wail' };
}

// ------------------------------------------------------------------ swarm: many small things in one rank
function swarm(a, D, s) {
  const R = a.R, pal = s.pal, els = s.els, el = els[0], k = s.kind || 'gull';
  a.layer('shadow'); a.raw(a.ground(230, 676, 140, 10));
  const spots = Array.from({ length: s.n || 11 }, (_, i) => [130 + R() * 220, 160 + R() * 440, (k === 'eyes' ? 1.1 : 0.6) + R() * 0.6]).sort((p, q) => p[2] - q[2]);
  const one = (x, y, sc) => {
    if (k === 'gull' || k === 'crow' || k === 'bat') {
      const col = pal.skin, up = R() < 0.5;
      const body = [[x - 34 * sc, y - 2 * sc], [x - 20 * sc, y - 9 * sc], [x + 10 * sc, y - 8 * sc], [x + 36 * sc, y - 2 * sc], [x + 50 * sc, y + 2 * sc], [x + 30 * sc, y + 7 * sc], [x - 10 * sc, y + 9 * sc], [x - 28 * sc, y + 5 * sc]];
      for (const far of [true, false]) {
        const wy = (up ? -1 : 1) * (far ? 0.7 : 1), sh = [x - 2 * sc, y - 4 * sc], el2 = [x + 20 * sc, y + wy * 30 * sc - 10 * sc], tipw = [x + 66 * sc, y + wy * 46 * sc - 4 * sc];
        const fe = Array.from({ length: 5 }, (_, i) => { const t = i / 4; return [tipw[0] + (x + 10 * sc - tipw[0]) * t + 4 * sc, tipw[1] + (y + 4 * sc - tipw[1]) * t + (i % 2 ? 6 : 0) * sc * (up ? 1 : -1)]; });
        a.shape({ d: smooth([sh, el2, tipw, ...fe], true, 0.35), fill: far ? dark(col, 0.25) : col, depth: 6, mottle: 0.4, hatch: 60, ink: 0.9, lines: fe.map(p => `M${f(el2[0])} ${f(el2[1])} L${f(p[0])} ${f(p[1])}`), decals: `<path d="${smooth([tipw, fe[0], fe[1], [(fe[1][0] + tipw[0]) / 2, (fe[1][1] + tipw[1]) / 2 - 4]], true, 0.4)}" fill="${G.black}" opacity="0.7"/>` });
        if (far) a.shape({ d: smooth(body, true, 0.6), fill: col, depth: 7, mottle: 0.4, hatch: 70, ink: 1 });
      }
      a.raw(`<path d="M${f(x - 34 * sc)} ${f(y - 3 * sc)} l${f(-16 * sc)} ${f(3 * sc)} l${f(16 * sc)} ${f(4 * sc)} Z" fill="${pal.beak || '#c8a860'}" stroke="${INK}" stroke-width="0.8"/><path d="M${f(x + 46 * sc)} ${f(y)} l${f(12 * sc)} ${f(-4 * sc)} l${f(-2 * sc)} ${f(8 * sc)} Z" fill="${col}" stroke="${INK}" stroke-width="0.8"/>` + D.glowEye(x - 22 * sc, y - 3 * sc, 1.3 * sc, EGLOW[el] || '#e0c050'));
    } else if (k === 'wasp' || k === 'fly') {
      a.shape({ d: smooth([[x - 20 * sc, y], [x, y - 10 * sc], [x + 40 * sc, y - 2 * sc], [x + 50 * sc, y + 8 * sc], [x + 4 * sc, y + 10 * sc]], true, 0.6), fill: pal.skin, depth: 6, hatch: 70, lines: [0, 1, 2].map(i => `M${f(x + (14 + i * 10) * sc)} ${f(y - 6 * sc)} l0 ${f(14 * sc)}`), lineCol: pal.accent || '#c8a030', lineW: 3 * sc });
      a.shape({ d: smooth([[x + 4 * sc, y - 6 * sc], [x + 20 * sc, y - 46 * sc], [x + 36 * sc, y - 40 * sc]], true, 0.6), fill: '#e8e4d0', fillOp: 0.6, depth: 3, ink: 0.8 });
      a.raw(`<path d="M${f(x + 50 * sc)} ${f(y + 6 * sc)} l${f(14 * sc)} ${f(4 * sc)}" stroke="${INK}" stroke-width="2"/>` + `<circle cx="${f(x - 14 * sc)}" cy="${f(y - 2 * sc)}" r="${f(5 * sc)}" fill="${G.black}"/>`);
    } else if (k === 'leech' || k === 'maggot') {
      // leeches heap on the floor and rear up; each is a ringed, glistening body with a sucker mouth
      const gy = 520 + (y - 160) / 440 * 150, ang = (R() - 0.5) * 2.4, l = 42 * sc;
      const p0 = [x, gy], p1 = [x + Math.cos(ang) * l * 0.5, gy - Math.abs(Math.sin(ang)) * l * 0.6 - 10 * sc], p2 = [x + Math.cos(ang) * l, gy - Math.abs(Math.sin(ang)) * l * 1.1 - 18 * sc];
      a.limb([p0, p1, p2], [16 * sc, 18 * sc, 10 * sc], { fill: pal.skin, depth: 5, mottle: 0.4, hatch: 70, lines: Array.from({ length: 6 }, (_, i) => { const t = i / 6, p = [p0[0] + (p2[0] - p0[0]) * t, p0[1] + (p2[1] - p0[1]) * t]; return `M${f(p[0] - 8 * sc)} ${f(p[1] - 2)} q${f(8 * sc)} 5 ${f(16 * sc)} 0`; }), spec: [`M${f(p0[0])} ${f(p0[1] - 5 * sc)} Q${f(p1[0])} ${f(p1[1] - 6 * sc)} ${f(p2[0])} ${f(p2[1] - 3 * sc)}`], specOp: 0.5 });
      a.raw(`<circle cx="${f(p2[0])}" cy="${f(p2[1])}" r="${f(6 * sc)}" fill="#5a1410" stroke="${INK}" stroke-width="0.9"/><circle cx="${f(p2[0])}" cy="${f(p2[1])}" r="${f(3 * sc)}" fill="${G.black}"/>` + a.drip(p2[0], p2[1] + 5 * sc, 10 * sc, 1.4, G.blood));
    } else if (k === 'motes') {
      a.raw(a.glow(x, y, 26 * sc, EGLOW[el] || '#ffe680', 0.6) + `<circle cx="${f(x)}" cy="${f(y)}" r="${f(4 * sc)}" fill="#fff6d0"/>` + Array.from({ length: 5 }, () => { const t = R() * 6.28, l = (8 + R() * 18) * sc; return `<path d="M${f(x)} ${f(y)} l${f(Math.cos(t) * l * 0.5 + (R() - 0.5) * 4)} ${f(Math.sin(t) * l * 0.5 + (R() - 0.5) * 4)} l${f(Math.cos(t) * l * 0.5)} ${f(Math.sin(t) * l * 0.5)}" stroke="${R() < 0.5 ? '#ffe680' : '#ff9a3a'}" stroke-width="${f(1.2 * sc)}" fill="none"/>`; }).join('') + `<path d="M${f(x)} ${f(y)} L${f(x + 20 * sc)} ${f(y + 30 * sc)}" stroke="#ff9a3a" stroke-width="${f(2 * sc)}" opacity="0.35"/>`);
    } else { // eyes
      a.shape({ d: blob(x, y, 18 * sc, R, 9, 0.3), fill: pal.skin || '#8a7a6a', depth: 6, mottle: 0.5, hatch: 70 });
      a.raw(`<ellipse cx="${f(x - 3 * sc)}" cy="${f(y)}" rx="${f(11 * sc)}" ry="${f(8 * sc)}" fill="#e8dcc0" stroke="${INK}" stroke-width="1"/><circle cx="${f(x - 5 * sc)}" cy="${f(y)}" r="${f(5 * sc)}" fill="${EGLOW[el] || '#c8a040'}"/><circle cx="${f(x - 5 * sc)}" cy="${f(y)}" r="${f(2.2 * sc)}" fill="${G.black}"/>` + a.drip(x, y + 12 * sc, 14 * sc, 1.4, G.bloodD) + `<path d="M${f(x + 12 * sc)} ${f(y + 6 * sc)} C${f(x + 30 * sc)} ${f(y + 20 * sc)} ${f(x + 20 * sc)} ${f(y + 40 * sc)} ${f(x + 34 * sc)} ${f(y + 56 * sc)}" stroke="${G.bloodD}" stroke-width="${f(3 * sc)}" fill="none"/>`);
    }
  };
  for (const layer of ['back', 'body', 'head']) {
    a.layer(layer, [230, 400]);
    for (let i = 0; i < spots.length; i++) if ((layer === 'back' && i < spots.length / 3) || (layer === 'body' && i >= spots.length / 3 && i < spots.length * 2 / 3) || (layer === 'head' && i >= spots.length * 2 / 3)) one(...spots[i]);
  }
  a.layer('arm', [230, 400]);
  a.raw(D.aura(el, 200, 300, 0.8) + (s.extra || ''));
  return { hand: [150, 300], idle: 'wobble', attack: 'bite' };
}

module.exports = { beast, serpent, crawler, floater, golem, bird, moth, swarm };
