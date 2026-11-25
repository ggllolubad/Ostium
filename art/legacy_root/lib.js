// Tiny part-based SVG builder for Ostium art.
// A part: { d, fill, ink, inkColor, shade, shadeFill, shade2, tex, lines, lineW, hl, hlFill, op, filter }
//  d        outline path (closed)
//  fill     base fill colour (opaque)
//  ink      outline stroke width (0 = none)
//  shade    path for the shadow region, clipped to d. shadeFill: colour or pattern id (e.g. 'url(#h45)')
//  shade2   deeper shadow region (second pass), shade2Fill
//  hl       highlight region clipped to d, hlFill
//  tex      texture pattern fill clipped to d (e.g. 'url(#mail)')
//  lines    array of interior line paths (stroked, clipped to d unless free:true)
//  free     array of interior line paths not clipped
let uid = 0;
function esc(s) { return s; }
function part(p, S) {
  const id = 'c' + (uid++);
  const inkC = p.inkColor || S.ink;
  const inkW = p.ink === undefined ? S.inkW : p.ink;
  const lw = p.lineW || S.lineW;
  let o = `<g${p.op !== undefined ? ` opacity="${p.op}"` : ''}${p.filter ? ` filter="${p.filter}"` : ''}>`;
  o += `<clipPath id="${id}"><path d="${p.d}"/></clipPath>`;
  if (p.fill) o += `<path d="${p.d}" fill="${p.fill}"${p.fillOp !== undefined ? ` fill-opacity="${p.fillOp}"` : ''}/>`;
  if (p.grad) o += `<path d="${p.d}" fill="${p.grad}"/>`;
  if (p.tex) o += `<path d="${p.d}" fill="${p.tex}" clip-path="url(#${id})"/>`;
  if (p.hl) o += `<path d="${p.hl}" fill="${p.hlFill || S.hl || '#fff'}" clip-path="url(#${id})"${p.hlOp !== undefined ? ` opacity="${p.hlOp}"` : ''}/>`;
  if (p.shade) o += `<path d="${p.shade}" fill="${p.shadeFill || S.shade}" clip-path="url(#${id})"${p.shadeOp !== undefined ? ` opacity="${p.shadeOp}"` : ''}/>`;
  if (p.shade2) o += `<path d="${p.shade2}" fill="${p.shade2Fill || S.shade2 || S.shade}" clip-path="url(#${id})"${p.shade2Op !== undefined ? ` opacity="${p.shade2Op}"` : ''}/>`;
  if (p.lines) o += `<g clip-path="url(#${id})">` + p.lines.map(l => `<path d="${l}" fill="none" stroke="${p.lineColor || inkC}" stroke-width="${lw}" stroke-linecap="round" stroke-linejoin="round"/>`).join('') + `</g>`;
  if (p.free) o += p.free.map(l => `<path d="${l}" fill="none" stroke="${p.lineColor || inkC}" stroke-width="${p.freeW || lw}" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  if (inkW > 0) o += `<path d="${p.d}" fill="none" stroke="${inkC}" stroke-width="${inkW}" stroke-linejoin="round" stroke-linecap="round"/>`;
  if (p.after) o += p.after;
  o += `</g>`;
  return o;
}
function doc(w, h, defs, body, opts = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${opts.filter ? `<g filter="${opts.filter}">` : '<g>'}${body}</g>${opts.post || ''}</svg>`;
}
function build(w, h, S, parts, opts = {}) {
  const body = parts.map(p => typeof p === 'string' ? p : part(p, S)).join('\n');
  return doc(w, h, S.defs + (opts.defs || ''), body, opts);
}
// hatch pattern helper
function hatch(id, angle, gap, color, w) {
  return `<pattern id="${id}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})"><path d="M0 ${gap / 2} L${gap} ${gap / 2}" stroke="${color}" stroke-width="${w}"/></pattern>`;
}
function cross(id, angle, gap, color, w) {
  return `<pattern id="${id}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})"><path d="M0 ${gap / 2} L${gap} ${gap / 2} M${gap / 2} 0 L${gap / 2} ${gap}" stroke="${color}" stroke-width="${w}"/></pattern>`;
}
module.exports = { part, build, hatch, cross, doc };
