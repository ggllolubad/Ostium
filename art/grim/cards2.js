// Card scenes, step 1: for every card decide the staging (who acts, on whom, in which room, which pose) and
// draw the ability's effect layer as an SVG. Step 2 (cards2.py) composites rigged figures, rooms and effects.
// Usage: node grim/cards2.js <cards.json>
const fs = require('fs');
const W = 840, H = 460;
const cards = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
fs.mkdirSync('grim/cards2', { recursive: true });
const POS = fs.existsSync('grim/cards2/pos.json') ? JSON.parse(fs.readFileSync('grim/cards2/pos.json', 'utf8')) : {};
const hash = s => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const rng = seed => { let s = seed || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; };
const f = n => +n.toFixed(1);
const ENEMIES = ['thrall', 'siren', 'eelkin', 'bellringer', 'barnacle_knight', 'bloated', 'hookline', 'weeping_nun', 'anchor_brute', 'choirboy', 'warden', 'abbess', 'pearl_diver', 'lamprey', 'crab'];
const ROOMS = ['nave', 'stair', 'belfry', 'ossuary', 'throne'];
const HEROES = ['bulwark', 'duelist', 'elementalist', 'alchemist', 'oracle', 'hexweaver'];
const EC = { fire: ['#ff9a3c', '#f6d27a', '#b8401c'], frost: ['#cfe8f6', '#ffffff', '#5a8ab8'], lightning: ['#f8e27a', '#ffffff', '#c89a2a'], water: ['#6aa6d6', '#d8eef8', '#2a5a8a'],
  toxin: ['#a8c860', '#e8f0b0', '#4a6a20'], void: ['#9a7ac8', '#e0d0ff', '#2a1a3a'], physical: ['#f0e6d0', '#ffffff', '#8a7a64'], attuned: ['#b8a0e0', '#ffffff', '#5a4a7a'] };

function fxSvg(c, id, st, R) {
  const parts = [];
  const defs = [];
  const el = st.elem, col = EC[el] || EC.physical;
  let gid = 0;
  const glow = (cx, cy, r, color, op = 0.8) => { const g = 'g' + (gid++); defs.push(`<radialGradient id="${g}"><stop offset="0" stop-color="${color}" stop-opacity="${op}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`); return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="url(#${g})"/>`; };
  const [tx, ty] = st.tpos, [hx, hy] = st.hand;
  const FX = {
    slash: () => { let o = ''; for (let k = 0; k < 3; k++) { const r = 120 + k * 22 + R() * 20, a0 = -1.2 + R() * 0.3, a1 = 1.1; const p = (a, rr) => [tx - Math.cos(a) * rr * 0.5 + k * 16, ty + Math.sin(a) * rr]; const A = p(a0, r), B = p(0, r * 1.08), C = p(a1, r), D = p(0, r * 0.82); o += `<path d="M${f(A[0])} ${f(A[1])} Q${f(B[0] + 60)} ${f(B[1])} ${f(C[0])} ${f(C[1])} Q${f(D[0] + 40)} ${f(D[1])} ${f(A[0])} ${f(A[1])} Z" fill="${k ? '#1c130c' : col[1]}" opacity="${k ? 0.55 : 0.92}"/>`; } return glow(tx, ty, 140, col[0], 0.5) + o; },
    impact: () => { let o = glow(tx, ty, 120, col[0], 0.7); for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2 + R() * 0.2, r0 = 20, r1 = 70 + R() * 80; o += `<path d="M${f(tx + Math.cos(a) * r0)} ${f(ty + Math.sin(a) * r0)} L${f(tx + Math.cos(a + 0.06) * r1)} ${f(ty + Math.sin(a + 0.06) * r1)} L${f(tx + Math.cos(a - 0.06) * r1 * 0.9)} ${f(ty + Math.sin(a - 0.06) * r1 * 0.9)} Z" fill="${col[1]}" opacity="0.85"/>`; } return o; },
    blood: () => { let o = ''; for (let i = 0; i < 40; i++) { const a = -Math.PI / 2 + (R() - 0.5) * 2.6 + (st.face > 0 ? 0.6 : -0.6), d = 20 + R() * 160, r = 1.5 + R() * 6; const x = tx + Math.cos(a) * d, y = ty + Math.sin(a) * d * 0.8; o += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#7a0e08"/>`; if (R() < 0.3) o += `<path d="M${f(tx)} ${f(ty)} L${f(x)} ${f(y)}" stroke="#6a0a06" stroke-width="${f(r * 0.8)}" stroke-linecap="round" opacity="0.8"/>`; } return o; },
    fire: () => { let o = glow(tx, ty, 170, '#ff7a2a', 0.65); for (let i = 0; i < 9; i++) { const x = tx + (R() - 0.5) * 140, b = ty + 60 + R() * 30, h = 90 + R() * 150, w = 22 + R() * 30; o += `<path d="M${f(x - w)} ${f(b)} C${f(x - w * 1.3)} ${f(b - h * 0.5)} ${f(x - w * 0.2)} ${f(b - h * 0.6)} ${f(x + (R() - 0.5) * 20)} ${f(b - h)} C${f(x + w * 0.4)} ${f(b - h * 0.55)} ${f(x + w * 1.3)} ${f(b - h * 0.4)} ${f(x + w)} ${f(b)} Z" fill="${['#c8401c', '#ff8a2c', '#ffc24a'][i % 3]}" opacity="0.88"/>`; } for (let i = 0; i < 30; i++) o += `<circle cx="${f(tx + (R() - 0.5) * 260)}" cy="${f(ty - R() * 220)}" r="${f(1 + R() * 2.5)}" fill="#ffd27a"/>`; return o; },
    frost: () => { let o = glow(tx, ty, 160, '#bfe0f0', 0.6); for (let i = 0; i < 16; i++) { const a = R() * Math.PI * 2, d = 20 + R() * 90, x = tx + Math.cos(a) * d, y = ty + Math.sin(a) * d * 0.8, l = 30 + R() * 70, w = 7 + R() * 10, ang = a + (R() - 0.5); o += `<path d="M${f(x)} ${f(y)} L${f(x + Math.cos(ang + 0.2) * w)} ${f(y + Math.sin(ang + 0.2) * w)} L${f(x + Math.cos(ang) * l)} ${f(y + Math.sin(ang) * l)} L${f(x + Math.cos(ang - 0.2) * w)} ${f(y + Math.sin(ang - 0.2) * w)} Z" fill="${['#e8f6ff', '#9cc8e8', '#ffffff'][i % 3]}" stroke="#2a4a6a" stroke-width="1.2" opacity="0.9"/>`; } return o; },
    lightning: () => { let o = glow(tx, ty, 160, '#f8e27a', 0.6); const bolt = (x0, y0, x1, y1, w) => { let d = `M${f(x0)} ${f(y0)}`; for (let i = 1; i <= 9; i++) { const t = i / 9; d += ` L${f(x0 + (x1 - x0) * t + (i < 9 ? (R() - 0.5) * 50 : 0))} ${f(y0 + (y1 - y0) * t + (i < 9 ? (R() - 0.5) * 24 : 0))}`; } return `<path d="${d}" stroke="#f8e27a" stroke-width="${w * 3}" fill="none" opacity="0.4"/><path d="${d}" stroke="#ffffff" stroke-width="${w}" fill="none"/>`; };
      o += bolt(st.cast ? hx : tx + (R() - 0.5) * 100, st.cast ? hy : 0, tx, ty, 4); for (let i = 0; i < 3; i++) o += bolt(tx, ty, tx + (R() - 0.5) * 300, ty + (R() - 0.3) * 200, 2); return o; },
    water: () => { let o = glow(tx, ty, 150, '#6aa6d6', 0.55); for (let i = 0; i < 5; i++) { const y = ty + 40 - i * 26, w = 200 - i * 26; o += `<path d="M${f(tx - w)} ${f(y)} C${f(tx - w * 0.5)} ${f(y - 50)} ${f(tx + w * 0.3)} ${f(y + 30)} ${f(tx + w)} ${f(y - 30)}" stroke="${i % 2 ? '#d8eef8' : '#4f8abf'}" stroke-width="${10 - i}" fill="none" opacity="0.85" stroke-linecap="round"/>`; } for (let i = 0; i < 40; i++) o += `<ellipse cx="${f(tx + (R() - 0.5) * 300)}" cy="${f(ty - R() * 200)}" rx="${f(2 + R() * 4)}" ry="${f(3 + R() * 6)}" fill="#bfe0f8" opacity="0.85"/>`; return o; },
    toxin: () => { let o = ''; for (let i = 0; i < 12; i++) o += glow(tx + (R() - 0.5) * 220, ty + (R() - 0.5) * 140, 50 + R() * 60, ['#7a9a3a', '#a8c860', '#4a6a20'][i % 3], 0.6); for (let i = 0; i < 18; i++) { const r = 3 + R() * 10; o += `<circle cx="${f(tx + (R() - 0.5) * 240)}" cy="${f(ty + (R() - 0.5) * 180)}" r="${f(r)}" fill="none" stroke="#d8f0a0" stroke-width="1.6" opacity="0.8"/>`; } return o; },
    void: () => { let o = glow(tx, ty, 160, '#2a1a3a', 0.9); for (let k = 0; k < 4; k++) { let d = ''; for (let i = 0; i <= 40; i++) { const a = i / 40 * Math.PI * 3 + k * 1.6, r = 140 * (1 - i / 44); d += (i ? ' L' : 'M') + `${f(tx + Math.cos(a) * r)} ${f(ty + Math.sin(a) * r * 0.7)}`; } o += `<path d="${d}" stroke="${k % 2 ? '#b89ae8' : '#5a3a8a'}" stroke-width="${4 - k * 0.6}" fill="none" opacity="0.85"/>`; } return o + glow(tx, ty, 40, '#000', 1); },
    projectile: () => { const mx = (hx + tx) / 2, my = Math.min(hy, ty) - 80; let o = `<path d="M${f(hx)} ${f(hy)} Q${f(mx)} ${f(my)} ${f(tx)} ${f(ty)}" stroke="${col[0]}" stroke-width="14" fill="none" opacity="0.35" stroke-linecap="round"/><path d="M${f(hx)} ${f(hy)} Q${f(mx)} ${f(my)} ${f(tx)} ${f(ty)}" stroke="${col[1]}" stroke-width="4" fill="none" opacity="0.9" stroke-linecap="round"/>`; return o + glow(hx, hy, 50, col[0], 0.8); },
    shield: () => { const [sx, sy] = st.selfpos; let o = glow(sx, sy, 190, '#93b3da', 0.45); o += `<ellipse cx="${f(sx)}" cy="${f(sy)}" rx="150" ry="190" fill="none" stroke="#cfe0f8" stroke-width="6" opacity="0.8"/><ellipse cx="${f(sx)}" cy="${f(sy)}" rx="132" ry="170" fill="none" stroke="#6a8ac8" stroke-width="2" opacity="0.8" stroke-dasharray="14 8"/>`; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; o += `<path d="M${f(sx + Math.cos(a) * 150)} ${f(sy + Math.sin(a) * 190)} l-8 -14 l16 0 Z" fill="#cfe0f8" opacity="0.8"/>`; } return o; },
    ward: () => { const [sx, sy] = st.selfpos; let o = glow(sx, sy, 170, '#b8a0e0', 0.45); o += `<circle cx="${f(sx)}" cy="${f(sy)}" r="130" fill="none" stroke="#e0d0ff" stroke-width="4"/><circle cx="${f(sx)}" cy="${f(sy)}" r="110" fill="none" stroke="#8a6ac8" stroke-width="2"/>`; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; o += `<text x="${f(sx + Math.cos(a) * 120)}" y="${f(sy + Math.sin(a) * 120 + 5)}" font-size="16" font-family="serif" fill="#e0d0ff" text-anchor="middle">${'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃ'[i]}</text>`; } return o; },
    heal: () => { const [sx, sy] = st.allypos; let o = glow(sx, sy - 60, 220, '#f6e6a0', 0.6); for (let i = 0; i < 9; i++) { const x = sx + (i - 4) * 26; o += `<path d="M${f(x)} 0 L${f(x + 18)} 0 L${f(sx + (i - 4) * 8 + 6)} ${f(sy)} L${f(sx + (i - 4) * 8)} ${f(sy)} Z" fill="#fff4c8" opacity="0.18"/>`; } for (let i = 0; i < 30; i++) o += `<circle cx="${f(sx + (R() - 0.5) * 240)}" cy="${f(sy - R() * 300)}" r="${f(1.5 + R() * 3)}" fill="#fff4c8" opacity="0.9"/>`; return o; },
    stress: () => { const [sx, sy] = st.allypos; let o = ''; for (let i = 0; i < 10; i++) o += glow(sx + (R() - 0.5) * 200, sy - 100 + (R() - 0.5) * 160, 60 + R() * 50, '#1a0e24', 0.75); for (let i = 0; i < 6; i++) { const x = sx + (R() - 0.5) * 220; o += `<path d="M${f(x)} ${f(sy + 80)} C${f(x - 30)} ${f(sy)} ${f(x + 40)} ${f(sy - 80)} ${f(x + (R() - 0.5) * 40)} ${f(sy - 200)}" stroke="#2a1a3a" stroke-width="5" fill="none" opacity="0.8"/>`; } return o; },
    calm: () => { const [sx, sy] = st.allypos; let o = glow(sx, sy - 40, 200, '#f0d890', 0.45); for (let i = 0; i < 3; i++) o += `<path d="M${f(sx - 120 + i * 20)} ${f(sy - 160 + i * 30)} C${f(sx - 40)} ${f(sy - 220 + i * 30)} ${f(sx + 40)} ${f(sy - 100 + i * 30)} ${f(sx + 140 - i * 20)} ${f(sy - 170 + i * 30)}" stroke="#fff0c0" stroke-width="2" fill="none" opacity="0.7"/>`; return o; },
    mark: () => { let o = glow(tx, ty - 20, 90, '#c42a1a', 0.5); o += `<circle cx="${f(tx)}" cy="${f(ty - 20)}" r="60" fill="none" stroke="#e04a2a" stroke-width="5"/><circle cx="${f(tx)}" cy="${f(ty - 20)}" r="36" fill="none" stroke="#e04a2a" stroke-width="3"/><path d="M${f(tx - 80)} ${f(ty - 20)} L${f(tx + 80)} ${f(ty - 20)} M${f(tx)} ${f(ty - 100)} L${f(tx)} ${f(ty + 60)}" stroke="#e04a2a" stroke-width="3"/>`; return o; },
    bleed: () => FX.blood() + Array.from({ length: 6 }, () => { const x = tx + (R() - 0.5) * 100, y = ty + (R() - 0.5) * 80; return `<path d="M${f(x)} ${f(y)} C${f(x - 2)} ${f(y + 30)} ${f(x + 2)} ${f(y + 50)} ${f(x)} ${f(y + 70 + R() * 40)}" stroke="#7a0e08" stroke-width="${f(3 + R() * 3)}" stroke-linecap="round" fill="none"/>`; }).join(''),
    stun: () => { let o = glow(tx, ty - 80, 80, '#f8e27a', 0.6); for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2, x = tx + Math.cos(a) * 60, y = ty - 110 + Math.sin(a) * 18; o += `<path d="M${f(x)} ${f(y - 10)} L${f(x + 3)} ${f(y - 3)} L${f(x + 10)} ${f(y)} L${f(x + 3)} ${f(y + 3)} L${f(x)} ${f(y + 10)} L${f(x - 3)} ${f(y + 3)} L${f(x - 10)} ${f(y)} L${f(x - 3)} ${f(y - 3)} Z" fill="#fff6c0"/>`; } return o + FX.impact(); },
    hex: () => { let o = glow(tx, ty, 140, '#5a2a7a', 0.6); for (let i = 0; i < 3; i++) { const r = 70 + i * 30; o += `<circle cx="${f(tx)}" cy="${f(ty)}" r="${r}" fill="none" stroke="#a87ad8" stroke-width="2" stroke-dasharray="${6 + i * 4} 6" opacity="0.8"/>`; } let pent = ''; for (let i = 0; i <= 5; i++) { const a = -Math.PI / 2 + i * 4 * Math.PI / 5; pent += (i ? ' L' : 'M') + `${f(tx + Math.cos(a) * 70)} ${f(ty + Math.sin(a) * 70)}`; } return o + `<path d="${pent}" stroke="#d0a8ff" stroke-width="3" fill="none"/>`; },
    doom: () => { let o = glow(tx, ty - 40, 140, '#1a0a14', 0.85); o += `<path d="M${f(tx - 40)} ${f(ty - 120)} L${f(tx + 40)} ${f(ty - 120)} L${f(tx + 6)} ${f(ty - 60)} L${f(tx + 40)} ${f(ty)} L${f(tx - 40)} ${f(ty)} L${f(tx - 6)} ${f(ty - 60)} Z" fill="none" stroke="#c8a8e8" stroke-width="4"/><path d="M${f(tx - 26)} ${f(ty - 112)} L${f(tx + 26)} ${f(ty - 112)} L${f(tx)} ${f(ty - 66)} Z" fill="#c8a8e8" opacity="0.6"/>`; return o + FX.chains(); },
    chains: () => { let o = ''; for (let k = 0; k < 2; k++) { for (let i = 0; i < 14; i++) { const t = i / 13, x = (k ? W : 0) + (tx - (k ? W : 0)) * t, y = (k ? 60 : 40) + (ty - (k ? 60 : 40)) * t + Math.sin(t * 6) * 10; o += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${i % 2 ? 5 : 11}" ry="8" fill="none" stroke="#3a3a3a" stroke-width="5"/><ellipse cx="${f(x)}" cy="${f(y)}" rx="${i % 2 ? 5 : 11}" ry="8" fill="none" stroke="#8a8a80" stroke-width="2"/>`; } } return o; },
    prime: () => glow(hx, hy, 90, '#f6d27a', 0.8) + `<circle cx="${f(hx)}" cy="${f(hy)}" r="54" fill="none" stroke="#f6d27a" stroke-width="3"/><path d="M${f(hx)} ${f(hy - 70)} L${f(hx)} ${f(hy + 70)} M${f(hx - 70)} ${f(hy)} L${f(hx + 70)} ${f(hy)}" stroke="#fff0c0" stroke-width="2" opacity="0.7"/>`,
    buff: () => { const [sx, sy] = st.selfpos; return glow(sx, sy, 180, '#f6d27a', 0.45) + Array.from({ length: 12 }, () => `<path d="M${f(sx + (R() - 0.5) * 200)} ${f(sy + 120)} l0 -${f(60 + R() * 120)}" stroke="#ffe8a0" stroke-width="2" opacity="0.6"/>`).join(''); },
    move: () => { const [sx, sy] = st.selfpos; let o = ''; for (let i = 0; i < 8; i++) { const y = sy - 120 + i * 32; o += `<path d="M${f(sx - 260)} ${f(y)} L${f(sx - 60)} ${f(y)}" stroke="#f0e6d0" stroke-width="${f(2 + R() * 3)}" opacity="${f(0.3 + R() * 0.4)}"/>`; } return o; },
    execute: () => { let o = glow(tx, ty, 160, '#6a0a06', 0.8); o += `<path d="M${f(tx - 200)} ${f(ty - 160)} L${f(tx + 200)} ${f(ty + 140)} L${f(tx + 180)} ${f(ty + 160)} L${f(tx - 220)} ${f(ty - 140)} Z" fill="#ffefe0" opacity="0.95"/>`; return o + FX.blood(); },
    delay: () => { let o = glow(tx, ty - 40, 150, '#8a7ab8', 0.5); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; o += `<path d="M${f(tx + Math.cos(a) * 100)} ${f(ty - 40 + Math.sin(a) * 100)} L${f(tx + Math.cos(a) * 112)} ${f(ty - 40 + Math.sin(a) * 112)}" stroke="#e0d0ff" stroke-width="4"/>`; } o += `<circle cx="${f(tx)}" cy="${f(ty - 40)}" r="118" fill="none" stroke="#e0d0ff" stroke-width="2"/><path d="M${f(tx)} ${f(ty - 40)} L${f(tx)} ${f(ty - 120)} M${f(tx)} ${f(ty - 40)} L${f(tx + 50)} ${f(ty - 20)}" stroke="#e0d0ff" stroke-width="5" stroke-linecap="round"/>`; return o; },
    pages: () => { const [sx, sy] = st.selfpos; let o = glow(sx, sy - 60, 160, '#f6e6c0', 0.45); for (let i = 0; i < 7; i++) { const x = sx + (R() - 0.5) * 260, y = sy - 60 - R() * 200, r = (R() - 0.5) * 40; o += `<rect x="${f(x)}" y="${f(y)}" width="34" height="44" fill="#efe4c9" stroke="#3a2a1a" stroke-width="1" transform="rotate(${f(r)} ${f(x)} ${f(y)})" opacity="0.9"/>`; } return o; },
    thorns: () => { const [sx, sy] = st.selfpos; let o = ''; for (let i = 0; i < 4; i++) { const y = sy - 120 + i * 70; let d = `M${f(sx - 170)} ${f(y)}`; for (let k = 1; k <= 8; k++) d += ` Q${f(sx - 170 + k * 42 - 21)} ${f(y + (k % 2 ? -26 : 26))} ${f(sx - 170 + k * 42)} ${f(y)}`; o += `<path d="${d}" stroke="#2a3a1a" stroke-width="8" fill="none"/><path d="${d}" stroke="#5e6b47" stroke-width="5" fill="none"/>`; for (let k = 0; k < 8; k++) o += `<path d="M${f(sx - 160 + k * 42)} ${f(y - 4)} l8 -18 l6 18 Z" fill="#d8ccaa" stroke="#1c130c" stroke-width="1"/>`; } return o; },
    dread: () => { const [sx, sy] = st.selfpos; return FX.stress() + glow(sx, sy - 120, 120, '#000', 0.6); },
    flask: () => { const g = glow(tx, ty, 120, col[0], 0.6); return g + `<path d="M${f(hx)} ${f(hy)} Q${f((hx + tx) / 2)} ${f(Math.min(hy, ty) - 140)} ${f(tx)} ${f(ty)}" stroke="#d8ccaa" stroke-width="2" fill="none" stroke-dasharray="6 8" opacity="0.7"/>`; },
  };
  for (const name of st.fx) if (FX[name]) parts.push(FX[name]());
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs.join('')}</defs>${parts.join('')}</svg>`;
}

const manifest = {};
for (const [id, c] of Object.entries(cards)) {
  const seed = hash(id), R = rng(seed % 999983 + 7);
  const cls = HEROES.includes(c.cls) ? c.cls : HEROES[seed % 6];
  const types = (c.fx || []).map(x => x.t);
  const stOf = (s) => (c.fx || []).some(x => (x.t === 'status' || x.t === 'self_status') && x.s === s);
  const elem = ['fire', 'frost', 'lightning', 'water', 'toxin', 'void'].includes(c.cat) ? c.cat : (c.cat === 'attuned' ? ['fire', 'frost', 'lightning', 'water', 'toxin', 'void'][seed % 6] : '');
  const enemyT = c.target === 'enemy' || c.target === 'all_enemies';
  const allyT = ['ally', 'ally_other', 'adjacent_ally', 'all_allies'].includes(c.target);
  const dmg = types.some(t => ['dmg', 'coup', 'dmg_per_element', 'execute'].includes(t));
  // staging
  let layout = enemyT ? (c.target === 'all_enemies' ? 'versus_many' : 'versus') : (allyT ? 'ally' : 'solo');
  if (c.target === 'none') layout = 'cursed';
  const cast = !dmg || ['elementalist', 'oracle', 'hexweaver'].includes(cls) || (elem && cls !== 'duelist' && cls !== 'bulwark');
  const pose = c.target === 'none' ? 'slump' : (dmg && !cast ? (cls === 'duelist' ? 'thrust' : (cls === 'alchemist' ? 'throw' : 'swing')) : (cls === 'alchemist' && enemyT ? 'throw' : (types.includes('block') && cls === 'bulwark' ? 'guard' : 'cast')));
  const fx = [];
  if (enemyT) {
    if (cast && (elem || dmg)) fx.push(cls === 'alchemist' ? 'flask' : 'projectile');
    if (elem) fx.push(elem);
    if (dmg && !elem) fx.push(types.includes('execute') ? 'execute' : 'slash', 'blood');
    if (dmg && elem && !cast) fx.push('slash');
    if (stOf('bleed')) fx.push('bleed');
    if (stOf('mark') || stOf('vulnerable')) fx.push('mark');
    if (stOf('stun') || types.includes('bash_stun')) fx.push('stun');
    if (stOf('hex') || types.includes('consume') && (c.fx.find(x => x.t === 'consume').s === 'hex')) fx.push('hex');
    if (stOf('doom')) fx.push('doom');
    if (types.includes('delay') || types.includes('turn')) fx.push('delay');
    if (types.includes('push') || types.includes('pull')) fx.push('impact');
    if (types.includes('transfer') || stOf('anchor')) fx.push('chains');
    if (!fx.length) fx.push('impact');
  } else if (allyT) {
    if (types.includes('heal')) fx.push('heal');
    if (types.some(t => ['block', 'guard'].includes(t))) fx.push('shield');
    if (types.includes('ward')) fx.push('ward');
    if (types.includes('stress') || types.includes('cleanse')) fx.push('calm');
    if (types.includes('prime') || stOf('might') || stOf('momentum') || stOf('focus')) fx.push('buff');
    if (types.includes('swap')) fx.push('move');
    if (!fx.length) fx.push('buff');
  } else if (layout === 'cursed') fx.push('dread');
  else {
    if (types.some(t => ['block', 'self_block', 'armor'].includes(t)) || stOf('fortify')) fx.push('shield');
    if (types.includes('ward')) fx.push('ward');
    if (stOf('thorns') || stOf('riposte')) fx.push('thorns');
    if (types.includes('heal') || stOf('regen')) fx.push('heal');
    if (types.includes('stress')) fx.push((c.fx.find(x => x.t === 'stress').n || 0) < 0 ? 'calm' : 'stress');
    if (types.includes('draw') || types.includes('add')) fx.push('pages');
    if (types.includes('prime') || types.includes('energy') || stOf('might') || stOf('focus') || stOf('momentum') || types.includes('attune') || types.includes('omen') || types.includes('cap')) fx.push('prime', 'buff');
    if (types.some(t => ['advance', 'retreat', 'to_front', 'swap'].includes(t)) || stOf('dodge')) fx.push('move');
    if (stOf('taunt')) fx.push('impact');
    if (types.includes('self_dmg') || types.includes('kill_self_hp')) fx.push('blood');
    if (!fx.length) fx.push('buff');
  }
  const nEnemies = layout === 'versus_many' ? 2 + (seed % 2) : (layout === 'versus' ? 1 : 0);
  const foes = []; for (let i = 0; i < nEnemies; i++) foes.push(ENEMIES[(seed >>> (i * 4)) % ENEMIES.length]);
  const ally = layout === 'ally' ? HEROES.filter(h => h !== cls)[seed % 5] : null;
  const room = ROOMS[(seed >>> 5) % ROOMS.length];
  // positions in the 840x460 frame used by the effect layer
  const tpos = layout === 'versus_many' ? [640, 250] : [620, 240];
  const selfpos = layout === 'solo' || layout === 'cursed' ? [420, 260] : [220, 250];
  const allypos = layout === 'ally' ? [620, 250] : selfpos;
  const hand = [{ bulwark: 330, duelist: 380, elementalist: 340, alchemist: 300, oracle: 340, hexweaver: 350 }[cls] || 330, 190];
  const st = { elem, tpos, selfpos, allypos, hand, cast, face: 1, fx };
  if (layout === 'versus_many') st.tpos = [650, 260];
  if (POS[id]) Object.assign(st, POS[id]);
  fs.writeFileSync(`grim/cards2/${id}.svg`, fxSvg(c, id, st, R));
  manifest[id] = { cls, layout, pose, foes, ally, room, elem, seed, flip: (seed >> 9) % 2 === 0 };
}
fs.writeFileSync('grim/cards2/manifest.json', JSON.stringify(manifest));
console.log('scenes', Object.keys(manifest).length);
