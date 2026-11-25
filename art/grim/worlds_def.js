// The door worlds (one per element pair; the Drowned Kingdom, water+void, is drawn by bestiary2.js).
// cast rows: [key, tier, archetype, spec]. Gameplay data lives in tools/content/worlds.py.
module.exports = {
  // ---------------------------------------------------------------- fire + frost: Thermal Shock
  rime: {
    name: 'The Sundered Rime', els: ['frost', 'fire'],
    pal: { skin: '#9aa8b0', cloth: '#3e4048', metal: '#4e4a48', accent: '#e8823a', wood: '#4a3a30', fur: '#8a8478', horn: '#d8d0c0' },
    cast: [
      ['rime_thrall', 'foe', 'humanoid', { build: 'gaunt', dress: 'rags', weapon: 'pick', gear: 'hood', headSpec: { style: 'gaunt', eye: 'milky', jaw: 0.5 }, els: ['frost'] }],
      ['magma_hound', 'foe', 'beast', { kind: 'hound', pal: { skin: '#3a302c' }, els: ['fire', 'frost'] }],
      ['obsidian_maiden', 'foe', 'humanoid', { dress: 'armor', weapon: 'sword', off: 'shield', gear: 'horns', pal: { metal: '#3a3634' }, els: ['fire'] }],
      ['steam_wraith', 'foe', 'floater', { kind: 'wraith', pal: { cloth: '#6a7078' }, els: ['frost', 'fire'], weapon: 'claws' }],
      ['fissure_worm', 'foe', 'serpent', { kind: 'worm', pal: { skin: '#5a4a44' }, els: ['fire', 'frost'] }],
      ['jotun_thane', 'elite', 'humanoid', { build: 'giant', dress: 'furs', weapon: 'hammer', gear: 'horns', headSpec: { style: 'gaunt', jaw: 0.6, eye: 'glint', hair: '#c8c0b0' }, pal: { skin: '#8aa0b0' }, els: ['frost'], shoulderAura: true, pauldron: true }],
      ['twin_seeress', 'elite', 'humanoid', { build: 'gaunt', dress: 'robe', weapon: 'staff', off: 'orb', gear: 'mask', pal: { cloth: '#5a2a24', mask: '#e8e0d0' }, els: ['fire', 'frost'] }],
      ['riven_jarl', 'boss', 'humanoid', { build: 'giant', dress: 'armor', weapon: 'greatsword', gear: 'crown', headSpec: { style: 'skull', jaw: 0.4 }, chains: true, pal: { metal: '#4a4a52', crown: '#c8d8e0' }, els: ['frost', 'fire'], weaponAura: true, shoulderAura: true }],
    ],
  },
  // ---------------------------------------------------------------- fire + lightning: Plasma
  foundry: {
    name: 'The Storm Foundry', els: ['lightning', 'fire'],
    pal: { skin: '#b08a6a', cloth: '#4a3a2c', metal: '#9a7a3a', accent: '#f4dc78', wood: '#5a3f28', apron: '#6a4a30' },
    cast: [
      ['slag_slave', 'foe', 'humanoid', { build: 'normal', dress: 'bare', weapon: 'hammer', gear: 'cage', headSpec: { style: 'gaunt', jaw: 0.3, eye: 'glint' }, pal: { skin: '#a07a5a' }, els: ['fire'] }],
      ['bronze_automaton', 'foe', 'golem', { build: 'heavy', pal: { skin: '#a8823a' }, core: true, gears: true, body_extra: (a, D, cx) => a.raw(`<rect x="${cx - 40}" y="340" width="60" height="40" rx="4" fill="#1a1210" stroke="#1c130c" stroke-width="2"/>` + [0, 1, 2, 3].map(i => `<path d="M${cx - 36 + i * 15} 342 L${cx - 36 + i * 15} 378" stroke="#6a5a3a" stroke-width="3"/>`).join('') + a.glow(cx - 10, 360, 40, '#ff8a2a', 0.8)), els: ['lightning', 'fire'] }],
      ['arc_smith', 'foe', 'humanoid', { build: 'heavy', dress: 'apron', weapon: 'hammer', gear: 'helm', els: ['lightning'], weaponAura: true }],
      ['bellows_imp', 'foe', 'humanoid', { build: 'gaunt', dress: 'bare', weapon: 'claws', wings: 'bat', gear: 'horns', float: true, headSpec: { style: 'gaunt', jaw: 0.6, eye: 'glow', hair: null }, pal: { skin: '#6a3a2a', wing: '#4a2a20', horn: '#2a2018' }, els: ['fire'] }],
      ['spark_swarm', 'foe', 'swarm', { kind: 'motes', n: 14, els: ['lightning', 'fire'] }],
      ['cyclops_smith', 'elite', 'humanoid', { build: 'giant', dress: 'apron', weapon: 'hammer', off: 'torch', headSpec: { style: 'bloated', jaw: 0.5, eye: 'glint', hair: '#3a2a20' }, pal: { skin: '#b08068' }, els: ['fire', 'lightning'], head_extra: (a, D, hx, hy) => a.raw(`<ellipse cx="${hx - 10}" cy="${hy - 14}" rx="14" ry="11" fill="#efe4c9" stroke="#1c130c" stroke-width="1.6"/><circle cx="${hx - 14}" cy="${hy - 14}" r="6" fill="#e8a030"/><circle cx="${hx - 14}" cy="${hy - 14}" r="2.6" fill="#1c130c"/>`) }],
      ['talos_sentinel', 'elite', 'golem', { gear: 'helm', pal: { skin: '#8a6a2a', metal: '#7a5a2a' }, off: 'shield', weapon: 'spear', armPose: 'forward', core: true, crown: '#c9a653', els: ['lightning'] }],
      ['anvil_titan', 'boss', 'golem', { pal: { skin: '#5a5048', metal: '#3a3634', wood: '#3a3634' }, weapon: 'hammer', armPose: 'raised', core: true, gears: true, crown: '#f4dc78', els: ['fire', 'lightning'] }],
    ],
  },
  // ---------------------------------------------------------------- fire + water: Scald
  baths: {
    name: 'The Boiling Baths', els: ['water', 'fire'],
    pal: { skin: '#c88a78', cloth: '#d8ccb0', metal: '#8a7a5a', accent: '#d8604a', wood: '#6a4a30' },
    cast: [
      ['scalded_attendant', 'foe', 'humanoid', { build: 'gaunt', dress: 'rags', weapon: 'hook', headSpec: { style: 'bloated', eye: 'milky', jaw: 0.4 }, pal: { skin: '#d08a78', cloth: '#c8bca0' }, els: ['fire'] }],
      ['kettle_crab', 'foe', 'crawler', { kind: 'crab', pal: { skin: '#b04a30' }, els: ['fire', 'water'] }],
      ['boiled_brute', 'foe', 'humanoid', { build: 'heavy', dress: 'bare', weapon: 'claws', headSpec: { style: 'bloated', jaw: 0.8, eye: 'socket' }, pal: { skin: '#c87a6a' }, els: ['water'] }],
      ['steam_nymph', 'foe', 'floater', { kind: 'jelly', pal: { skin: '#e0c8c0' }, els: ['water', 'fire'] }],
      ['bath_leech', 'foe', 'serpent', { kind: 'leech', pal: { skin: '#5a2a28' }, els: ['water'] }],
      ['bath_mistress', 'elite', 'humanoid', { build: 'normal', dress: 'robe', weapon: 'censer', gear: 'mask', pal: { cloth: '#8a2a2a', mask: '#d8b8a0' }, els: ['fire', 'water'] }],
      ['cauldron_bearer', 'elite', 'humanoid', { build: 'giant', dress: 'apron', weapon: 'mace', headSpec: { style: 'bloated', jaw: 0.3, eye: 'milky' }, gear: 'cage', els: ['fire'], body_extra: (a, D, cx, w) => a.raw(D.flame(cx + 70, 260, 40, 14) + D.drips(cx - 40, cx + 40, 300, 6, 30, '#a8c8d8')) }],
      ['simmering_matron', 'boss', 'humanoid', { build: 'giant', dress: 'robe', weapon: 'scythe', gear: 'crown', headSpec: { style: 'bloated', jaw: 0.9, eye: 'glint', hair: '#3a2a24' }, pal: { cloth: '#6a2a24', skin: '#d0907a' }, els: ['water', 'fire'], weaponAura: true }],
    ],
  },
  // ---------------------------------------------------------------- fire + toxin: Combust
  pits: {
    name: 'The Sulphur Pits', els: ['toxin', 'fire'],
    pal: { skin: '#a89a70', cloth: '#5a5030', metal: '#6a6048', accent: '#d8c040', wood: '#4a3a24', apron: '#5a4a2a' },
    cast: [
      ['gas_miner', 'foe', 'humanoid', { build: 'normal', dress: 'apron', weapon: 'pick', off: 'lantern', gear: 'brim', headSpec: { style: 'gaunt', jaw: 0.2, eye: 'milky' }, els: ['toxin'] }],
      ['brimstone_toad', 'foe', 'beast', { kind: 'toad', pal: { skin: '#8a7a3a' }, els: ['toxin', 'fire'] }],
      ['fuse_imp', 'foe', 'humanoid', { build: 'gaunt', dress: 'bare', weapon: 'torch', headSpec: { style: 'skull', jaw: 0.7 }, pal: { skin: '#8a4a2a' }, gear: 'horns', els: ['fire'] }],
      ['pit_crawler', 'foe', 'crawler', { kind: 'centipede', pal: { skin: '#6a5a2a' }, els: ['toxin'] }],
      ['canary_priest', 'foe', 'humanoid', { build: 'gaunt', dress: 'robe', weapon: 'censer', gear: 'hood', pal: { cloth: '#8a7a2a' }, els: ['toxin', 'fire'] }],
      ['powder_ogre', 'elite', 'humanoid', { build: 'giant', dress: 'furs', weapon: 'mace', headSpec: { style: 'bloated', jaw: 0.6, eye: 'glint' }, pal: { skin: '#9a8a60', fur: '#5a4a30' }, chains: true, els: ['fire'] }],
      ['miasma_matriarch', 'elite', 'floater', { kind: 'head', pal: { skin: '#8a9a50' }, els: ['toxin'] }],
      ['burning_lung', 'boss', 'beast', { kind: 'toad', pal: { skin: '#6a5a30' }, els: ['toxin', 'fire'], body_extra: (a, D, cx, cy) => a.raw(D.flame(cx - 30, cy - 70, 70, 24) + D.flame(cx + 50, cy - 60, 56, 20) + D.spores(cx, cy - 120, 120, 30)) }],
    ],
  },
  // ---------------------------------------------------------------- fire + void: Hollow Flame
  pyre: {
    name: 'The Black Pyre', els: ['void', 'fire'],
    pal: { skin: '#5a5048', cloth: '#1e1a1c', metal: '#3a3438', accent: '#a47ae0', wood: '#2a2020' },
    cast: [
      ['ash_penitent', 'foe', 'humanoid', { build: 'gaunt', dress: 'rags', weapon: 'chain', gear: 'hood', headSpec: { style: 'skull', jaw: 0.3 }, pal: { skin: '#6a6058' }, els: ['fire'] }],
      ['cinder_hound', 'foe', 'beast', { kind: 'wolf', pal: { skin: '#2a2226' }, els: ['void', 'fire'] }],
      ['censer_deacon', 'foe', 'humanoid', { build: 'normal', dress: 'robe', weapon: 'censer', gear: 'mask', pal: { cloth: '#2a2228', mask: '#c8c0b0' }, els: ['void', 'fire'] }],
      ['candle_wraith', 'foe', 'floater', { kind: 'wisp', els: ['void', 'fire'] }],
      ['pyre_knight', 'foe', 'humanoid', { build: 'heavy', dress: 'armor', weapon: 'axe', gear: 'helm', pal: { metal: '#2e2a2c' }, els: ['fire'], shoulderAura: true }],
      ['unburnt_inquisitor', 'elite', 'humanoid', { build: 'normal', dress: 'robe', weapon: 'book', off: 'torch', gear: 'brim', pal: { cloth: '#3a1a1a' }, els: ['fire', 'void'] }],
      ['pyre_seraph', 'elite', 'humanoid', { build: 'gaunt', dress: 'robe', weapon: 'spear', wings: 'tattered', halo: true, float: true, headSpec: { style: 'gaunt', eye: 'socket', jaw: 0.2 }, pal: { cloth: '#d8ccb0', wing: '#2a2026', accent: '#a47ae0' }, els: ['void', 'fire'] }],
      ['saint_unending', 'boss', 'humanoid', { build: 'giant', dress: 'robe', weapon: 'staff', halo: true, gear: 'crown', headSpec: { style: 'skull', jaw: 0.5 }, pal: { cloth: '#2a1a1e', crown: '#5a4a6a', accent: '#c89ae8' }, els: ['void', 'fire'], chains: true, body_extra: (a, D, cx) => a.raw(D.flame(cx - 30, 300, 90, 30, -0.1) + D.flame(cx + 40, 320, 70, 24)) }],
    ],
  },
  // ---------------------------------------------------------------- frost + lightning: Lockdown
  spire: {
    name: 'The Stilled Spire', els: ['frost', 'lightning'],
    pal: { skin: '#b8c4cc', cloth: '#3a4a5a', metal: '#7a8a96', accent: '#f4dc78', wood: '#4a4a52' },
    cast: [
      ['stopped_pilgrim', 'foe', 'humanoid', { build: 'gaunt', dress: 'robe', weapon: 'staff', gear: 'hood', headSpec: { style: 'gaunt', eye: 'milky', jaw: 0.1 }, pal: { cloth: '#5a6470' }, els: ['frost'] }],
      ['clock_sentry', 'foe', 'golem', { build: 'normal', gear: 'cage', pal: { skin: '#8a8a7a', metal: '#6a6a5a' }, weapon: 'spear', armPose: 'forward', gears: true, els: ['lightning', 'frost'] }],
      ['gear_spider', 'foe', 'crawler', { kind: 'spider', pal: { skin: '#9a8a5a', accent: '#5a6a7a' }, els: ['lightning'] }],
      ['aurora_moth', 'foe', 'moth', { pal: { skin: '#5a6a7a', wing: '#8aa8b8', accent: '#d8e8a0' }, els: ['lightning', 'frost'] }],
      ['frozen_halberdier', 'foe', 'humanoid', { build: 'normal', dress: 'armor', weapon: 'spear', gear: 'helm', pal: { metal: '#8a9aa6' }, els: ['frost'] }],
      ['horologist', 'elite', 'humanoid', { build: 'gaunt', dress: 'robe', weapon: 'orb', off: 'book', gear: 'cage', pal: { cloth: '#2a3448' }, els: ['lightning', 'frost'] }],
      ['rime_colossus', 'elite', 'golem', { pal: { skin: '#a8c0cc' }, shoulderAura: true, core: true, body_extra: (a, D, cx) => a.raw(D.spikes(cx + 40, 230, 5, 50, -1.2, 1.2) + D.spikes(cx - 50, 226, 4, 40, -1.9, 1) + D.icicles(cx - 60, cx + 40, 450, 9, 30)), crown: '#e8f4f8', els: ['frost'] }],
      ['last_hour', 'boss', 'golem', { pal: { skin: '#6a6a5a' }, core: true, gears: true, crown: '#c9a653', els: ['frost', 'lightning'], head_extra: (a, D, cx, y) => a.raw(`<circle cx="${cx - 10}" cy="${y - 100}" r="60" fill="#efe4c9" stroke="#1c130c" stroke-width="3"/>` + Array.from({ length: 12 }, (_, i) => { const t = i / 12 * 6.28; return `<path d="M${(cx - 10 + Math.cos(t) * 50).toFixed(1)} ${(y - 100 + Math.sin(t) * 50).toFixed(1)} L${(cx - 10 + Math.cos(t) * 58).toFixed(1)} ${(y - 100 + Math.sin(t) * 58).toFixed(1)}" stroke="#1c130c" stroke-width="3"/>`; }).join('') + `<path d="M${cx - 10} ${y - 100} L${cx - 10} ${y - 146} M${cx - 10} ${y - 100} L${cx + 24} ${y - 90}" stroke="#1c130c" stroke-width="5" stroke-linecap="round"/>`) }],
    ],
  },
  // ---------------------------------------------------------------- frost + water: Freeze
  fleet: {
    name: 'The Icebound Fleet', els: ['frost', 'water'],
    pal: { skin: '#a8b4b8', cloth: '#3a4448', metal: '#6a7478', accent: '#cfe6f4', wood: '#5a4a3a', fur: '#7a7060' },
    cast: [
      ['frozen_whaler', 'foe', 'humanoid', { build: 'normal', dress: 'furs', weapon: 'harpoon', gear: 'hood', headSpec: { style: 'drowned', eye: 'milky', jaw: 0.3 }, els: ['frost'] }],
      ['rime_gulls', 'foe', 'swarm', { kind: 'gull', n: 10, pal: { skin: '#c8c8c0' }, els: ['frost'] }],
      ['ice_eel', 'foe', 'serpent', { kind: 'eel', pal: { skin: '#4a6a78', belly: '#c8d8e0' }, fins: true, els: ['frost', 'water'] }],
      ['deck_hand', 'foe', 'humanoid', { build: 'normal', dress: 'rags', weapon: 'axe', headSpec: { style: 'drowned', jaw: 0.6, eye: 'socket', hair: '#3a3430' }, pal: { skin: '#9aa8a8' }, els: ['water'] }],
      ['walrus_brute', 'foe', 'beast', { kind: 'walrus', pal: { skin: '#7a6a5a' }, els: ['frost'] }],
      ['icewed_captain', 'elite', 'humanoid', { build: 'heavy', dress: 'armor', weapon: 'sword', off: 'lantern', gear: 'brim', pal: { metal: '#4a5458' }, els: ['frost', 'water'], chains: true }],
      ['frost_selkie', 'elite', 'humanoid', { build: 'gaunt', dress: 'furs', weapon: 'claws', headSpec: { style: 'drowned', jaw: 0.9, eye: 'glint', hair: '#2a2a2a' }, pal: { skin: '#b8c4c8', fur: '#4a4a48' }, els: ['water', 'frost'] }],
      ['leviathan_ice', 'boss', 'serpent', { kind: 'wyrm', thick: 1.3, pal: { skin: '#5a7a88', belly: '#d8e8ec', horn: '#e8f4f8' }, fins: true, els: ['frost', 'water'], head_extra: (a, D) => a.raw(D.icicles(120, 230, 210, 7, 30)) }],
    ],
  },
  // ---------------------------------------------------------------- frost + toxin: Cryo-rot
  barrow: {
    name: 'The Hollow Barrow', els: ['frost', 'toxin'],
    pal: { skin: '#8a9480', cloth: '#3a3a30', metal: '#5a5a50', accent: '#b4d860', wood: '#4a3a2a', fur: '#6a6050', horn: '#c8c0a8' },
    cast: [
      ['barrow_draugr', 'foe', 'humanoid', { build: 'normal', dress: 'furs', weapon: 'axe', headSpec: { style: 'skull', jaw: 0.6 }, gear: 'helm', els: ['frost'] }],
      ['plague_wolf', 'foe', 'beast', { kind: 'wolf', pal: { skin: '#6a6a58' }, fur: true, els: ['toxin', 'frost'] }],
      ['frostbit_leper', 'foe', 'humanoid', { build: 'gaunt', dress: 'rags', weapon: 'bell', gear: 'hood', headSpec: { style: 'drowned', eye: 'milky', jaw: 0.4 }, pal: { skin: '#a8a888' }, els: ['toxin'] }],
      ['mold_wight', 'foe', 'floater', { kind: 'wraith', pal: { cloth: '#4a5038' }, skullFace: true, weapon: 'claws', els: ['toxin', 'frost'] }],
      ['grave_worm', 'foe', 'serpent', { kind: 'worm', pal: { skin: '#a89a88' }, els: ['toxin'] }],
      ['barrow_thane', 'elite', 'humanoid', { build: 'heavy', dress: 'armor', weapon: 'greatsword', gear: 'crown', headSpec: { style: 'skull', jaw: 0.2 }, pal: { metal: '#4a4a40', crown: '#8a8a70' }, els: ['frost', 'toxin'] }],
      ['rot_witch', 'elite', 'humanoid', { build: 'gaunt', dress: 'robe', weapon: 'staff', gear: 'antlers', headSpec: { style: 'gaunt', eye: 'glint', jaw: 0.5, hair: '#d8d8c8' }, pal: { cloth: '#3a4030' }, els: ['toxin', 'frost'] }],
      ['barrow_king', 'boss', 'humanoid', { build: 'giant', dress: 'furs', weapon: 'axe', off: 'shield', gear: 'crown', headSpec: { style: 'skull', jaw: 0.5 }, pal: { fur: '#5a5a48', crown: '#b8c8a0', metal: '#5a6058' }, chains: true, els: ['frost', 'toxin'], shoulderAura: true, pauldron: true }],
    ],
  },
  // ---------------------------------------------------------------- frost + void: Absolute Zero
  silence: {
    name: 'The White Silence', els: ['void', 'frost'],
    pal: { skin: '#d0d4d8', cloth: '#2a2a34', metal: '#5a5a6a', accent: '#a47ae0', wood: '#3a3a40', fur: '#c8c8c8', horn: '#e8e8e8' },
    cast: [
      ['hollow_wanderer', 'foe', 'humanoid', { build: 'gaunt', dress: 'furs', weapon: 'spear', gear: 'hood', headSpec: { style: 'gaunt', eye: 'none', jaw: 0.2 }, els: ['void'] }],
      ['silence_stag', 'foe', 'beast', { kind: 'stag', pal: { skin: '#c8c8c8' }, els: ['frost', 'void'] }],
      ['starless_eye', 'foe', 'floater', { kind: 'eye', pal: { skin: '#d8d0c8', iris: '#2a1a3a' }, els: ['void'] }],
      ['frozen_saint', 'foe', 'humanoid', { build: 'normal', dress: 'robe', weapon: 'book', halo: true, headSpec: { style: 'drowned', eye: 'milky', jaw: 0 }, pal: { cloth: '#c8ccd0' }, els: ['frost'] }],
      ['rime_shade', 'foe', 'floater', { kind: 'wraith', pal: { cloth: '#1a1a24' }, weapon: 'scythe', attack: 'swing', els: ['void', 'frost'] }],
      ['pale_hunter', 'elite', 'humanoid', { build: 'normal', dress: 'furs', weapon: 'spear', off: 'claws', gear: 'antlers', headSpec: { style: 'skull', jaw: 0.1 }, pal: { fur: '#e0e0e0' }, els: ['frost', 'void'] }],
      ['void_mammoth', 'elite', 'beast', { kind: 'mammoth', pal: { skin: '#4a4450' }, els: ['void', 'frost'] }],
      ['cold_star', 'boss', 'floater', { kind: 'eye', pal: { skin: '#2a2234', iris: '#e8f4f8' }, els: ['void', 'frost'], head_extra: (a, D, cx) => { a.raw(a.glow(cx, 300, 240, '#a47ae0', 0.45) + Array.from({ length: 18 }, (_, i) => { const t = i / 18 * 6.28, r0 = 116, r1 = 160 + (i % 3) * 40; return `<path d="M${(cx + Math.cos(t - 0.05) * r0).toFixed(1)} ${(300 + Math.sin(t - 0.05) * r0).toFixed(1)} L${(cx + Math.cos(t) * r1).toFixed(1)} ${(300 + Math.sin(t) * r1).toFixed(1)} L${(cx + Math.cos(t + 0.05) * r0).toFixed(1)} ${(300 + Math.sin(t + 0.05) * r0).toFixed(1)} Z" fill="${i % 2 ? '#dceef8' : '#1a1024'}" stroke="#1c130c" stroke-width="1.2"/>`; }).join('') + `<circle cx="${cx}" cy="300" r="124" fill="none" stroke="#c8b0f0" stroke-width="3" opacity="0.6"/>`); a.raw([[cx - 170, 170, 16], [cx + 160, 200, 12], [cx - 150, 430, 14], [cx + 170, 410, 18]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + 6}" fill="#2a2234" stroke="#1c130c" stroke-width="1.4"/><circle cx="${x - 3}" cy="${y}" r="${r}" fill="#e8f4f8" stroke="#1c130c" stroke-width="1"/><ellipse cx="${x - 4}" cy="${y}" rx="${r * 0.25}" ry="${r * 0.7}" fill="#0a0810"/>`).join('') + D.motes(cx, 300, 200, 30) + D.icicles(cx - 80, cx + 80, 420, 9, 50)); } }],
    ],
  },
  // ---------------------------------------------------------------- lightning + water: Electrocute
  coast: {
    name: 'The Stormwrack Coast', els: ['lightning', 'water'],
    pal: { skin: '#a89a88', cloth: '#3a4440', metal: '#6a6a60', accent: '#f4dc78', wood: '#5a4a38' },
    cast: [
      ['wrecker', 'foe', 'humanoid', { build: 'normal', dress: 'rags', weapon: 'hook', off: 'lantern', gear: 'brim', headSpec: { style: 'gaunt', jaw: 0.4, eye: 'glint', hair: '#4a3a2a' }, els: ['water'] }],
      ['shock_eel', 'foe', 'serpent', { kind: 'eel', pal: { skin: '#3a4a3a', belly: '#d8d8a0' }, fins: true, els: ['lightning', 'water'] }],
      ['storm_harpy', 'foe', 'humanoid', { build: 'gaunt', dress: 'bare', weapon: 'claws', wings: 'feather', float: true, headSpec: { style: 'gaunt', jaw: 0.8, eye: 'glint', hair: '#2a2a2a' }, pal: { skin: '#a8a090', wing: '#4a4a48' }, els: ['lightning'] }],
      ['tide_crab', 'foe', 'crawler', { kind: 'crab', pal: { skin: '#5a6a5a' }, els: ['water'] }],
      ['drowned_bosun', 'foe', 'humanoid', { build: 'heavy', dress: 'rags', weapon: 'chain', headSpec: { style: 'drowned', jaw: 0.5, eye: 'milky' }, pal: { skin: '#8a9a90' }, els: ['water'] }],
      ['lighthouse_keeper', 'elite', 'humanoid', { build: 'normal', dress: 'robe', weapon: 'lantern', off: 'book', gear: 'hood', pal: { cloth: '#2a3438' }, els: ['lightning', 'water'] }],
      ['harpy_matron', 'elite', 'humanoid', { build: 'heavy', dress: 'bare', weapon: 'claws', wings: 'feather', float: true, gear: 'crown', headSpec: { style: 'gaunt', jaw: 1, eye: 'glint', hair: '#1a1a1a' }, pal: { skin: '#b8a898', wing: '#2a2a2a', crown: '#a8873e' }, els: ['lightning', 'water'] }],
      ['thunder_whale', 'boss', 'serpent', { kind: 'wyrm', thick: 1.45, pal: { skin: '#3a4448', belly: '#a8a898', horn: '#d8ccaa' }, fins: true, spikes: false, els: ['lightning', 'water'], head_extra: (a, D, hx, hy) => a.raw(D.arcs(hx, hy - 60, 90, 5)) }],
    ],
  },
  // ---------------------------------------------------------------- lightning + toxin: Neurotoxin
  hive: {
    name: 'The Venom Spires', els: ['toxin', 'lightning'],
    pal: { skin: '#5a4a2a', cloth: '#3a3020', metal: '#6a5a3a', accent: '#d8b030', wood: '#4a3a24', wing: '#c8c0a0' },
    cast: [
      ['spire_wasps', 'foe', 'swarm', { kind: 'wasp', n: 12, pal: { skin: '#3a3020', accent: '#d8b030' }, els: ['toxin'] }],
      ['venom_spider', 'foe', 'crawler', { kind: 'spider', pal: { skin: '#3a2a24', accent: '#c84a2a' }, els: ['toxin'] }],
      ['puppet_host', 'foe', 'humanoid', { build: 'gaunt', dress: 'rags', weapon: 'claws', headSpec: { style: 'drowned', eye: 'milky', jaw: 0.7 }, pal: { skin: '#b0a888' }, els: ['toxin', 'lightning'], head_extra: (a, D, hx) => a.raw(D.fungus(hx + 20, 110, 3, 0.8, '#d8b030')) }],
      ['galvanic_beetle', 'foe', 'crawler', { kind: 'beetle', pal: { skin: '#2a3a3a' }, els: ['lightning'] }],
      ['hive_drone', 'foe', 'moth', { pal: { skin: '#5a4a20', wing: '#d8d0b0', accent: '#d8b030' }, els: ['toxin'] }],
      ['mantis_duelist', 'elite', 'crawler', { kind: 'mantis', pal: { skin: '#6a7a3a' }, els: ['lightning', 'toxin'] }],
      ['brood_mother', 'elite', 'crawler', { kind: 'spider', pal: { skin: '#2a2020', accent: '#d8b030' }, els: ['toxin'], head_extra: (a, D, hx, hy) => a.raw(Array.from({ length: 9 }, (_, i) => { const x = 300 + (i % 3) * 30 + (i > 5 ? 14 : 0), y = 420 + Math.floor(i / 3) * 22; return `<ellipse cx="${x}" cy="${y}" rx="13" ry="10" fill="#d8d0b0" stroke="#1c130c" stroke-width="1"/><path d="M${x - 8} ${y} q8 -6 16 0" stroke="#8a7a5a" stroke-width="0.8" fill="none"/>`; }).join('') + Array.from({ length: 6 }, (_, i) => { const x = 260 + i * 26, y = 400 - (i % 2) * 14; return `<circle cx="${x}" cy="${y}" r="5" fill="#2a2020" stroke="#1c130c"/><path d="M${x - 8} ${y + 2} l-6 6 M${x + 8} ${y + 2} l6 6 M${x - 7} ${y - 2} l-7 -3 M${x + 7} ${y - 2} l7 -3" stroke="#1c130c" stroke-width="1.2"/>`; }).join('')) }],
      ['hive_queen', 'boss', 'crawler', { kind: 'beetle', wings: true, pincers: true, pal: { skin: '#4a3a1a', wing: '#e0d8b0' }, els: ['toxin', 'lightning'], head_extra: (a, D, hx, hy) => a.raw(D.spikes(hx, hy - 40, 5, 40, -Math.PI / 2, 1.4, '#d8b030')) }],
    ],
  },
  // ---------------------------------------------------------------- lightning + void: Discharge
  sky: {
    name: 'The Torn Sky', els: ['lightning', 'void'],
    pal: { skin: '#c8c0b0', cloth: '#d8d0c0', metal: '#a8a090', accent: '#f4dc78', wood: '#5a5048', wing: '#e8e0d0' },
    cast: [
      ['fallen_angel', 'foe', 'humanoid', { build: 'normal', dress: 'robe', weapon: 'sword', wings: 'feather', halo: true, float: true, headSpec: { style: 'gaunt', eye: 'socket', jaw: 0.2 }, els: ['lightning'] }],
      ['rift_hound', 'foe', 'beast', { kind: 'hound', pal: { skin: '#3a3048' }, els: ['void'] }],
      ['storm_shade', 'foe', 'floater', { kind: 'wisp', els: ['lightning', 'void'] }],
      ['choir_of_eyes', 'foe', 'swarm', { kind: 'eyes', n: 13, els: ['void'] }],
      ['skywreck_knight', 'foe', 'humanoid', { build: 'heavy', dress: 'armor', weapon: 'mace', off: 'shield', gear: 'helm', pal: { metal: '#8a8478' }, els: ['lightning'] }],
      ['thunder_seraph', 'elite', 'humanoid', { build: 'normal', dress: 'armor', weapon: 'spear', wings: 'feather', halo: true, float: true, gear: 'mask', pal: { metal: '#c8b880', mask: '#e8d8a0' }, els: ['lightning', 'void'], weaponAura: true }],
      ['rift_leviathan', 'elite', 'serpent', { kind: 'wyrm', pal: { skin: '#2a2438', belly: '#6a5a8a' }, els: ['void', 'lightning'] }],
      ['shattered_god', 'boss', 'humanoid', { build: 'giant', dress: 'bare', weapon: 'orb', wings: 'feather', halo: true, float: true, gear: 'crown', headSpec: { style: 'gaunt', eye: 'none', jaw: 0.6 }, pal: { skin: '#d8d0c0', crown: '#e8d080' }, els: ['void', 'lightning'], body_extra: (a, D, cx) => a.raw(D.cracks(cx, 320, 120) + D.cracks(cx - 20, 400, 80) + D.arcs(cx, 300, 80, 4)) }],
    ],
  },
  // ---------------------------------------------------------------- toxin + water: Toxic Pool
  mire: {
    name: 'The Rotmire', els: ['toxin', 'water'],
    pal: { skin: '#7a7a58', cloth: '#3a4030', metal: '#5a5a48', accent: '#b4d860', wood: '#4a3a28' },
    cast: [
      ['bog_body', 'foe', 'humanoid', { build: 'gaunt', dress: 'bare', weapon: 'claws', headSpec: { style: 'drowned', eye: 'socket', jaw: 0.5, hair: 'weed' }, pal: { skin: '#6a5a40' }, els: ['water'] }],
      ['fen_hag', 'foe', 'humanoid', { build: 'gaunt', dress: 'robe', weapon: 'staff', gear: 'hood', headSpec: { style: 'gaunt', eye: 'glint', jaw: 0.6 }, pal: { cloth: '#3a4a2a' }, els: ['toxin'] }],
      ['mire_toad', 'foe', 'beast', { kind: 'toad', pal: { skin: '#5a6a3a' }, els: ['toxin', 'water'] }],
      ['leech_swarm', 'foe', 'swarm', { kind: 'leech', n: 22, pal: { skin: '#3a2a24' }, els: ['water'] }],
      ['fen_lurker', 'foe', 'beast', { kind: 'lizard', pal: { skin: '#4a5a3a' }, els: ['water', 'toxin'] }],
      ['bog_troll', 'elite', 'humanoid', { build: 'giant', dress: 'bare', weapon: 'mace', headSpec: { style: 'bloated', jaw: 0.7, eye: 'glint', hair: 'weed' }, pal: { skin: '#6a7a50' }, els: ['toxin', 'water'], body_extra: (a, D, cx) => a.raw(D.fungus(cx - 20, 260, 4, 1) + D.weed(cx + 40, 230, 120)) }],
      ['coven_mother', 'elite', 'humanoid', { build: 'heavy', dress: 'robe', weapon: 'censer', off: 'book', gear: 'antlers', headSpec: { style: 'bloated', eye: 'milky', jaw: 0.3, hair: '#5a5a48' }, pal: { cloth: '#2a3424' }, els: ['toxin'] }],
      ['mire_mother', 'boss', 'floater', { kind: 'head', pal: { skin: '#6a7448' }, els: ['toxin', 'water'], head_extra: (a, D, cx) => a.raw(D.weed(cx - 80, 160, 200) + D.weed(cx + 60, 150, 230) + D.fungus(cx, 150, 5, 1.2)) }],
    ],
  },
  // ---------------------------------------------------------------- toxin + void: Blight
  garden: {
    name: 'The Blighted Garden', els: ['toxin', 'void'],
    pal: { skin: '#8a8068', cloth: '#3a3028', metal: '#5a5040', accent: '#c8a0e0', wood: '#4a3a2a', horn: '#c8b898', wing: '#a89ab8' },
    cast: [
      ['fungal_husk', 'foe', 'humanoid', { build: 'normal', dress: 'rags', weapon: 'claws', headSpec: { style: 'gaunt', eye: 'socket', jaw: 0.4 }, pal: { skin: '#9a8a70' }, els: ['toxin'], head_extra: (a, D, hx) => a.raw(D.fungus(hx + 10, 108, 5, 1.1, '#c8a878')) }],
      ['spore_deer', 'foe', 'beast', { kind: 'stag', pal: { skin: '#8a7a60' }, els: ['toxin', 'void'] }],
      ['thorn_knight', 'foe', 'humanoid', { build: 'heavy', dress: 'armor', weapon: 'sword', off: 'shield', gear: 'helm', pal: { metal: '#4a4a30' }, els: ['toxin'], body_extra: (a, D, cx) => a.raw(D.spikes(cx, 300, 8, 30, 0, 6.28, '#5a5a3a')) }],
      ['moth_witch', 'foe', 'moth', { pal: { skin: '#5a4a5a', wing: '#8a7a9a', accent: '#d8c0e8' }, els: ['void', 'toxin'] }],
      ['root_horror', 'foe', 'serpent', { kind: 'worm', pal: { skin: '#5a4a3a' }, els: ['toxin'] }],
      ['the_gardener', 'elite', 'humanoid', { build: 'giant', dress: 'apron', weapon: 'scythe', gear: 'brim', headSpec: { style: 'skull', jaw: 0.3 }, pal: { apron: '#5a4a30' }, els: ['toxin', 'void'] }],
      ['blight_dryad', 'elite', 'humanoid', { build: 'gaunt', dress: 'bare', weapon: 'claws', gear: 'antlers', float: false, headSpec: { style: 'gaunt', eye: 'glint', jaw: 0.4, hair: '#3a2a3a' }, pal: { skin: '#7a6a50' }, els: ['void', 'toxin'], body_extra: (a, D, cx) => a.raw(D.fungus(cx - 20, 380, 4, 1, '#a88ab8') + D.cracks(cx, 300, 60)) }],
      ['antlered_mother', 'boss', 'beast', { kind: 'stag', pal: { skin: '#6a5a50', horn: '#d8c8a8' }, els: ['toxin', 'void'], fur: true, body_extra: (a, D, cx, cy, bw, bh) => a.raw(`<g stroke="#1c130c" stroke-width="2" fill="#c8b898">` + [0, 1, 2, 3, 4].map(i => `<path d="M${cx - 50 + i * 22} ${cy - 40} C${cx - 56 + i * 22} ${cy} ${cx - 50 + i * 22} ${cy + 30} ${cx - 40 + i * 22} ${cy + 46}" fill="none" stroke-width="7"/><path d="M${cx - 50 + i * 22} ${cy - 40} C${cx - 56 + i * 22} ${cy} ${cx - 50 + i * 22} ${cy + 30} ${cx - 40 + i * 22} ${cy + 46}" fill="none" stroke="#c8b898" stroke-width="4"/>`).join('') + `</g>` + a.stain(cx - 6, cy, 40, '#2a1a14', 0.6) + D.fungus(cx, cy - 60, 9, 1.5, '#a88ab8') + D.fungus(cx + 80, cy - 40, 5, 1.1, '#c8b0a0') + D.eyes(cx + 40, cy - 10, 46, 7, '#c8a0e0') + D.spores(cx, cy - 120, 160, 40) + Array.from({ length: 7 }, (_, i) => `<path d="M${cx - 60 + i * 26} ${cy + 50} C${cx - 64 + i * 26} ${cy + 80} ${cx - 56 + i * 26} ${cy + 100} ${cx - 62 + i * 26} ${cy + 120 + (i % 3) * 14}" stroke="#4a5a30" stroke-width="3" fill="none"/>`).join('')),
      head_extra: (a, D, hx, hy) => a.raw(Array.from({ length: 2 }, (_, s2) => { const bx = hx + 10 + s2 * 14; let o = `M${bx} ${hy - 20} C${bx + 20} ${hy - 90} ${bx - 60 + s2 * 40} ${hy - 170} ${bx - 20 + s2 * 70} ${hy - 240}`; for (let i = 0; i < 6; i++) o += ` M${bx - 6 + s2 * 12 + i * 4} ${hy - 50 - i * 32} l${-36 + s2 * 60} ${-30 - i * 2}`; return `<path d="${o}" stroke="#1c130c" stroke-width="14" fill="none" stroke-linecap="round"/><path d="${o}" stroke="#d8c8a8" stroke-width="9" fill="none" stroke-linecap="round"/>`; }).join('') + D.fungus(hx - 10, hy - 140, 5, 1.1, '#a88ab8') + D.fungus(hx + 40, hy - 200, 4, 0.9, '#c8b0a0') + Array.from({ length: 8 }, (_, i) => `<path d="M${hx - 40 + i * 14} ${hy - 110 - (i % 3) * 30} C${hx - 44 + i * 14} ${hy - 80} ${hx - 36 + i * 14} ${hy - 60} ${hx - 42 + i * 14} ${hy - 30 + (i % 2) * 20}" stroke="#4a5a30" stroke-width="2.4" fill="none"/>`).join('') + D.eyes(hx - 20, hy - 30, 14, 3, '#c8a0e0')) }],
    ],
  },
};
