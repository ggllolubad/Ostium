// Hover and locked overlays for every garth hotspot, sized to the 1600x1000 scene, from garth_hotspots.json.
// hover: warm light lifting the doorway, a soft rim along the target; locked: the target dimmed and barred.
const fs = require('fs');
const J = JSON.parse(fs.readFileSync('grim/hub/garth_hotspots.json'));
const f = n => +(+n).toFixed(1);
fs.mkdirSync('grim/hub/states', { recursive: true });
for (const [id, h] of Object.entries(J.hotspots)) {
  if (id.startsWith('company_') && id !== 'company_cross') continue;
  const d = 'M' + h.poly.map(p => p.join(' ')).join(' L') + ' Z';
  const xs = h.poly.map(p => p[0]), ys = h.poly.map(p => p[1]), cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2, r = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
  const head = `<svg xmlns="http://www.w3.org/2000/svg" width="${J.w}" height="${J.h}" viewBox="0 0 ${J.w} ${J.h}"><defs><clipPath id="c"><path d="${d}"/></clipPath><filter id="b"><feGaussianBlur stdDeviation="6"/></filter>` +
    `<radialGradient id="g" cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 0.7)}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffc870" stop-opacity="0.38"/><stop offset="1" stop-color="#ff9a3a" stop-opacity="0"/></radialGradient></defs>`;
  fs.writeFileSync(`grim/hub/states/${id}_hover.svg`, head + `<g clip-path="url(#c)"><rect width="${J.w}" height="${J.h}" fill="url(#g)"/></g><path d="${d}" fill="none" stroke="#ffcf86" stroke-width="5" opacity="0.5" filter="url(#b)"/></svg>`);
  let bars = ''; for (let x = Math.min(...xs) + 8; x < Math.max(...xs); x += 16) bars += `<path d="M${f(x)} ${f(Math.min(...ys))} L${f(x)} ${f(Math.max(...ys))}" stroke="#0e0b08" stroke-width="4"/>`;
  fs.writeFileSync(`grim/hub/states/${id}_locked.svg`, head + `<g clip-path="url(#c)"><rect width="${J.w}" height="${J.h}" fill="#0a0806" opacity="0.62"/>${bars}</g></svg>`);
}
console.log('states', fs.readdirSync('grim/hub/states').length);
