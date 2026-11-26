// Hero rigs per calling, used by samples.js (rigOf).
// Each calling has a list of act poses (attacks and casts) and a list of block poses. A card picks the first pose whose
// words match its name or note, else one by a hash of its id, so cards of one calling do not repeat one pose.
// A pose: bone rotations in degrees about each bone chain's rest pivot, parent outermost (posed the way card_figure.js
// does), placement (the head joint lands on `at`, at `scale`), a style for the FX, and the points the FX hang on, as
// [bone, point in figure px] (point null = the bone's joint).
// `pose.vary[<figure key>]` overrides bones for one path variant whose rest arm differs from the base figure's
// (card_kit.hero merges it), so the same act reads the same on every figure.
//
// Joint rules every pose keeps (checked on every figure, 2026-11-25):
// - Wrist: hand_* stays within 45 degrees of the forearm. A held thing is aimed by shoulder and elbow.
// - Elbow: each arm folds only the way its rest drawing folds (sign of the rest bend from upper arm to forearm,
//   positive = clockwise on screen). Negative folds: every near arm except the Vessel's; the far arms of the
//   Elementalist, Alchemist and the Executioner. Positive folds: the Duelist's raised far (dagger) arm, the
//   Hexweaver's raised far (pin) arm, the Vessel's near arm. The Vessel's far arm folds negative. The Bulwark's
//   far arm (behind the door) and the Oracle's far arm (holding the robe front) rest straight and barely move.
// - Rigid props hanging from or standing in a hand (crucible chain, cane, staff, hourglass, poppet) are kept
//   near plumb by the wrist, within that 45 degrees.
'use strict';
const RIG = {
  bulwark: {
    act: [
      // the overhead chop at its end: the mace driven down ahead, the arc trailing over the top from behind. An
      // overhead near arm in profile crosses the great helm unless it is vertical, and a vertical mace runs off the
      // frame at hero scale (LESSONS L28, L30), so the chop is shown landing.
      { style: 'swing', words: /swing|smash|over|crush|blow|maul|hook/, pose: { upperarm_n: -54, forearm_n: 74, hand_n: 15, torso: 16, lean: 6, head: -6, upperarm_f: -6 }, at: [330, 230], scale: 1.25, weapon: ['mace', [500, 236]], pivot: 'upperarm_n', sweep: 110 },
      // the mace punched up and out from a lowered elbow, weight on the front foot
      { style: 'strike', words: /thrust|jab|drive|punch|pommel|butt/, pose: { upperarm_n: -38, forearm_n: 9, hand_n: 20, torso: 10, lean: 6, head: -4, upperarm_f: -8 }, at: [330, 330], scale: 1.25, weapon: ['mace', [500, 236]], off: [40, 10] },
      // shoulder behind the door, driving it forward
      { style: 'strike', words: /shove|shield|door|push|bash|ram|shoulder|slam/, pose: { torso: 14, lean: 9, head: -4, upperarm_f: -18, upperarm_n: -20, forearm_n: 10 }, at: [360, 330], scale: 1.32, weapon: ['door', [530, 300]], off: [40, 0] },
    ],
    block: [
      { words: /brace|\bset\b|\bstand\b|hold|plant|wall/, pose: { torso: 4, head: 2, lean: -2, upperarm_f: -2 }, at: [380, 352], scale: 1.42, face: ['door', [526, 330]], wood: true },
      { words: /raise|cover|duck|overhead|under|kneel/, pose: { torso: 12, head: 2, lean: 6, upperarm_f: -24, forearm_f: -6, upperarm_n: 10 }, at: [370, 390], scale: 1.38, face: ['door', [526, 270]], wood: true },
    ],
  },
  duelist: {
    // the Executioner holds a two-handed greatsword: its far arm is solved so the far hand stays on the grip
    act: [
      { style: 'cuts', words: /\bcut|slash|\btwo\b(?!-)|step|flurry|\bdanc/, pose: { upperarm_n: -35, forearm_n: -5, hand_n: -10, torso: 6, lean: 6, head: -6, cape: -10, vary: { duelist_executioner: { upperarm_f: -28.5, forearm_f: 13, hand_f: -34 } } }, at: [300, 236], scale: 1.2, weapon: ['rapier', [588, 518]], off: 'dagger' },
      { style: 'strike', words: /lunge|thrust|point|pierce|touch|measure|run through|gap/, pose: { upperarm_n: -22, forearm_n: 2, hand_n: -18, torso: 12, lean: 11, head: -8, cape: -16, vary: { duelist_executioner: { upperarm_f: -17, forearm_f: 14, hand_f: -35 } } }, at: [290, 262], scale: 1.18, weapon: ['rapier', [588, 518]], off: [30, 0] },
      // the down-cut caught as the blade passes level, the arc trailing down from above
      { style: 'swing', words: /dagger|stab|off-hand|knife|bleed|bled|execut(?!ioner)|riposte|down/, pose: { upperarm_n: -70, forearm_n: -5, hand_n: 35, torso: 8, lean: 6, head: -4, cape: -12, vary: { duelist_executioner: { upperarm_f: -66, forearm_f: 21, hand_f: 5 } } }, at: [300, 300], scale: 1.12, weapon: ['rapier', [588, 518]], pivot: 'upperarm_n', sweep: 70 },
    ],
    block: [
      { words: /parry|\bguard|\bbind|high|en garde/, pose: { upperarm_n: -30, forearm_n: -70, hand_n: -30, torso: -4, lean: -3, vary: { duelist_executioner: { upperarm_n: -30, forearm_n: -30, hand_n: 0, upperarm_f: -19, forearm_f: -12, hand_f: -29 } } }, at: [330, 250], scale: 1.25, face: ['rapier', [520, 460]] },
      { words: /deflect|turn|step|evade|dodge|aside|low|back/, pose: { upperarm_n: 10, forearm_n: -20, hand_n: 10, torso: -10, lean: -6, head: 6, cape: 10, vary: { duelist_executioner: { upperarm_f: 7.5, forearm_f: -18.5, hand_f: 11 } } }, at: [330, 250], scale: 1.25, face: ['rapier', [540, 480]] },
    ],
  },
  elementalist: {
    act: [
      { style: 'cast', words: /flick|bolt|bead|ink|drop|dot/, pose: { upperarm_n: -60, forearm_n: 100, hand_n: -30, torso: -4, head: -6, vary: { elementalist_catalyst: { forearm_n: 73 } } }, hide: ['sign'], at: [262, 300], scale: 1.32, hand: ['hand_n', null] },
      // the book kept carried at the chest (the figure's book is drawn closed, cover out, so it is not lifted to the
      // face), head bowed to it, the near hand laid on it, the cast thrown off the book
      { style: 'cast', words: /page|book|read|codex|script|rite|word/, pose: { upperarm_f: -6, forearm_f: -4, torso: -4, head: 8, upperarm_n: -15, forearm_n: 57, vary: { elementalist_catalyst: { upperarm_n: 10, forearm_n: 30 }, elementalist_accumulator: { upperarm_n: -27, forearm_n: 54 } } }, hide: ['sign'], at: [280, 300], scale: 1.3, hand: ['book', null] },
      // the sweep: the arm flung straight out at chest height, below the face (L28)
      { style: 'cast', words: /sweep|spray|all|wave|spill|ring|spectrum|flood/, pose: { upperarm_n: -18, forearm_n: 80, hand_n: -20, torso: -6, head: -6, vary: { elementalist_catalyst: { upperarm_n: 7, forearm_n: 53 }, elementalist_accumulator: { upperarm_n: -30, forearm_n: 77 } } }, hide: ['sign'], at: [280, 310], scale: 1.3, hand: ['hand_n', null], spray: true },
    ],
    block: [
      { words: /book|page|cover|shield/, pose: { upperarm_f: -4, forearm_f: -6, torso: -5, head: -4, upperarm_n: 10 }, hide: ['sign'], at: [300, 290], scale: 1.3, face: ['book', null] },
      // the warding palm raised ahead of the face from a lowered elbow (a level arm at shoulder height crosses the chin)
      { words: /\bward|palm|sign|hand|still|calm/, pose: { upperarm_n: -33, forearm_n: 50, hand_n: -25, torso: -6, head: -4, vary: { elementalist_catalyst: { upperarm_n: -8, forearm_n: 23 }, elementalist_accumulator: { upperarm_n: -45, forearm_n: 47 } } }, hide: ['sign'], at: [290, 300], scale: 1.3, face: ['hand_n', null] },
    ],
  },
  alchemist: {
    // every alchemist holds the flask by the neck, mouth up, in the far hand; the mouth's screen angle is the far
    // forearm's plus 42 (base, transmuter), -51 (apothecary) or -73 (plaguewright), so a pour (mouth 10 or more below
    // level) comes from the forearm, with the wrist inside its limit
    act: [
      // overarm throw at release: flask arm forward and up, wrist following through
      { style: 'cast', words: /throw|lob|toss|hurl|overarm|bomb|flask|\bpot/, pose: { upperarm_f: -16, forearm_f: 78, hand_f: 15, torso: 6, lean: 4, upperarm_n: 15, vary: { alchemist_plaguewright: { upperarm_f: -97, forearm_f: 43 }, alchemist_apothecary: { upperarm_f: -34, forearm_f: 3 } } }, at: [300, 300], scale: 1.2, hand: ['flask', null], glass: true },
      { style: 'pour', words: /pour|spill|drip|tip|dose|coat|anoint|acid|\boil\b|douse|alkahest|transmut(?!er)/, pose: { upperarm_f: 54, forearm_f: 68, hand_f: 15, torso: 8, lean: 5, vary: { alchemist_plaguewright: { upperarm_f: -3, forearm_f: 51, hand_f: 42 }, alchemist_apothecary: { upperarm_f: 38, forearm_f: 9, hand_f: 42 } } }, at: [300, 300], scale: 1.25, hand: ['flask', null], mouth: [10, 150] },
      // underarm fling from the flask hand at waist height
      { style: 'cast', words: /flick|splash|spray|vial|chaser|fling|dash/, pose: { upperarm_f: 60, forearm_f: 23, hand_f: -10, torso: 6, lean: 3, upperarm_n: 20, vary: { alchemist_plaguewright: { upperarm_f: -12, forearm_f: 48 }, alchemist_apothecary: { upperarm_f: 51, forearm_f: 8 } } }, at: [300, 300], scale: 1.25, hand: ['flask', null], spray: true, mouth: [-70, 30] },
    ],
    block: [
      // near forearm up as a guard, the flask pulled back out of the blow; held things (crucible, bandage) kept hanging
      { words: /apron|\barm\b|\bguard|leather|hide|cover/, pose: { upperarm_n: -85, forearm_n: -30, torso: -8, lean: -4, head: 4, upperarm_f: 20, forearm_f: 30, vary: { alchemist_plaguewright: { upperarm_n: -76, forearm_n: -16 }, alchemist_apothecary: { upperarm_n: -60, forearm_n: -10, hand_n: 40, upperarm_f: 60, forearm_f: -20 }, alchemist_transmuter: { upperarm_n: -40, forearm_n: 0, hand_n: 40 } } }, at: [330, 300], scale: 1.25, face: ['hand_n', null], off: [90, -20] },
      { style: 'pour', words: /pour|barrier|line|wall|fume|smoke|hood|oil|tar|coat/, pose: { upperarm_f: 54, forearm_f: 68, hand_f: 15, torso: 8, lean: 5, vary: { alchemist_plaguewright: { upperarm_f: -3, forearm_f: 51, hand_f: 42 }, alchemist_apothecary: { upperarm_f: 38, forearm_f: 9, hand_f: 42 } } }, at: [300, 300], scale: 1.25, face: ['flask', null], mouth: [10, 150] },
    ],
  },
  oracle: {
    // the near hand carries the hourglass by its ring (the staff and quill on two paths); the wrist keeps it plumb.
    // The far hand holds the robe front and stays put.
    act: [
      { style: 'cast', words: /hour|time|glass|sand|turn/, pose: { upperarm_n: -33, forearm_n: 43, hand_n: -13, torso: 3, head: -2, vary: { oracle_chronomancer: { upperarm_n: -39, forearm_n: 17, hand_n: 19 }, oracle_fatebinder: { upperarm_n: -52, forearm_n: 31, hand_n: 18 } } }, at: [300, 280], scale: 1.25, hand: ['hourglass', null] },
      // raised straight up, the arm behind the line of the face (L28)
      { style: 'cast', words: /raise|star|sky|heaven|unmak|\bend\b|\ball\b/, pose: { upperarm_n: -124, forearm_n: 83, hand_n: 45, torso: -4, head: -8, vary: { oracle_chronomancer: { upperarm_n: -40, forearm_n: 17, hand_n: 27 }, oracle_fatebinder: { upperarm_n: -53, forearm_n: 31, hand_n: 26 } } }, at: [310, 370], scale: 1.2, hand: ['hourglass', null], spray: true },
      { style: 'cast', words: /point|foretell|\bsee|name|doom(?!sayer)|mark|fate(?!binder)|omen/, pose: { upperarm_n: -53, forearm_n: 78, hand_n: -34, torso: 6, lean: 3, head: -2, vary: { oracle_chronomancer: { upperarm_n: -59, forearm_n: 52, hand_n: -2 }, oracle_fatebinder: { upperarm_n: -72, forearm_n: 66, hand_n: -3 } } }, at: [300, 290], scale: 1.25, hand: ['hourglass', null] },
    ],
    block: [
      { words: /glass|hour|hold|\bward/, pose: { upperarm_n: -10, forearm_n: 10, hand_n: 7, torso: -5, lean: -2 }, at: [330, 290], scale: 1.25, face: ['hourglass', null], off: [120, 0] },
      { words: /turn|away|cloak|robe|hide|veil|seen/, pose: { torso: -14, lean: -6, head: 8, upperarm_n: 30, forearm_n: 20, hand_n: -30 }, at: [340, 300], scale: 1.25, face: ['hourglass', null], off: [130, -40] },
    ],
  },
  hexweaver: {
    // far hand: the pin in an ice-pick grip (staff and mirror on two paths); near hand: the poppet (a handbell on one),
    // kept upright by the wrist
    act: [
      // the pin driven down toward the poppet held out in the other hand
      { style: 'strike', words: /pin|stab|pierce|needle|twist|knife|bone|blood(?!letter)|\bcut/, pose: { upperarm_f: 19, forearm_f: -32, hand_f: -15, torso: 8, lean: 5, upperarm_n: -20, forearm_n: 10, hand_n: 10 }, at: [300, 300], scale: 1.3, weapon: ['pin', [440, 372]], off: [20, 30] },
      { style: 'cast', words: /poppet|doll|whisper|\bbind|cord|knot/, pose: { upperarm_n: -51, forearm_n: 33, hand_n: 14, torso: 4, head: -6, vary: { hexweaver_doomsayer: { upperarm_n: -24, forearm_n: 31, hand_n: -11 } } }, at: [300, 300], scale: 1.3, hand: ['poppet', null] },
      { style: 'cast', words: /fling|dirt|throw|spit|curse|raise|bell|toll|hour|glass|mirror(?!hex)/, pose: { upperarm_f: -20, forearm_f: -30, torso: -6, head: -4, upperarm_n: 25, forearm_n: 20, hand_n: -35, vary: { hexweaver_doomsayer: { upperarm_f: 0, forearm_f: 0, hand_f: 6 }, hexweaver_mirrorhex: { hand_f: 35 } } }, at: [300, 320], scale: 1.25, hand: ['hand_f', null], spray: true },
    ],
    block: [
      { words: /poppet|\bbind|charm|\bward|doll|mirror(?!hex)|glass/, pose: { upperarm_n: -28, forearm_n: 23, hand_n: 14, torso: -6, lean: -3, vary: { hexweaver_doomsayer: { upperarm_n: -1, forearm_n: 21, hand_n: -11 } } }, at: [310, 300], scale: 1.3, face: ['poppet', null], off: [80, -10] },
      { style: 'salt', words: /salt|line|threshold|circle|ground|dirt|ash/, pose: { torso: 14, lean: 6, upperarm_n: -22, forearm_n: 68, hand_n: -40, upperarm_f: 20, forearm_f: -10, hand_f: -20 }, at: [320, 300], scale: 1.25, face: ['hand_n', null] },
    ],
  },
  vessel: {
    // faces the viewer, and both forearms and the far upper arm carry wide sleeves hanging far below them, so a sleeved
    // bone turns at most 25 degrees in all (LESSONS L33). One arm acts, the other rests; the hands carry the gesture,
    // and the crop is tight on the acting hand.
    act: [
      // palm strike: the far forearm swung level and the heel of the palm driven out, leaning into it
      { style: 'strike', words: /strike|palm|blow|push|hit|drive/, pose: { upperarm_f: -20, forearm_f: 30, hand_f: -40, torso: 6, lean: 4 }, at: [270, 190], scale: 1.6, weapon: ['hand_f', null] },
      // reaching up and out with the far hand, fingers open
      { style: 'cast', words: /reach|draw|take|pull|across|breath|out/, pose: { upperarm_f: -18, forearm_f: -5, hand_f: 25, torso: 4, lean: 3 }, at: [270, 200], scale: 1.6, hand: ['hand_f', null] },
      // offering: the far forearm lowered forward, palm turned up and out
      { style: 'cast', words: /give|gift|offer|pour|both|open|mantle/, pose: { upperarm_f: -10, forearm_f: 32, hand_f: 30, torso: 3 }, at: [270, 190], scale: 1.6, hand: ['hand_f', null], spray: true },
    ],
    block: [
      // braced: leaning back, the far palm turned out to the blow
      { words: /cross|\bbar\b|brace|\bguard|hold|nimbus/, pose: { upperarm_f: -5, forearm_f: -10, hand_f: -20, torso: -5, lean: -3 }, at: [300, 210], scale: 1.55, face: ['hand_f', null] },
      // recoiling, both palms still raised
      { words: /palm|\bward|stop|raise|still|breath/, pose: { hand_f: -30, hand_n: 20, torso: -10, lean: -5 }, at: [310, 210], scale: 1.55, face: ['hand_f', null] },
    ],
  },
};
const DEFAULT_RIG = { act: [{ style: 'cast', pose: {}, at: [300, 300], scale: 1.25 }], block: [{ pose: {}, at: [380, 330], scale: 1.3 }] };

// ==== L4: joint limits, checked on load for every calling and path variant (LESSONS.md L4)
// Measured from each figure's rest joints (degrees on screen, y down, positive = clockwise):
// up = the upper arm's direction (90 = hanging), bend = the forearm's angle from the upper arm, fold = the way the elbow
// bends (sign of the rest bend; for the two arms drawn straight it was found by posing both ways). After a pose the
// bend is exactly bend + forearm, and the upper arm points at up + upperarm + torso + lean.
const WRIST_MAX = 45;         // hand rotation against the forearm, either way
const ELBOW_MAX = 150;        // tightest fold
const ELBOW_SLACK = 5;        // how far past straight an elbow may read before it is hyperextended
// shoulder: the upper arm's screen direction must stay in this range. Profile figures face right: from 150 (60 back
// of hanging) round through forward to -100 (10 past straight up). The front-facing Vessel abducts to the side up to
// about 170 and crosses the chest about 120. An arm whose rest lies outside its range gets rest +- 50 instead.
const SHOULDER = { profile: { n: [-100, 150], f: [-100, 150] }, front: { n: [-30, 265], f: [-85, 210] } };
const ARMS = {   // [up, bend, fold] per arm
  bulwark: { view: 'profile', n: [92, -99, -1], f: [58, 2, -1] },
  duelist: { view: 'profile', n: [44, -16, -1], f: [-170, 140, 1] },
  duelist_executioner: { view: 'profile', n: [80, -71, -1], f: [68, -78, -1] },
  elementalist: { view: 'profile', n: [69, -125, -1], f: [81, -93, -1] },
  elementalist_accumulator: { view: 'profile', n: [81, -122, -1], f: [88, -83, -1] },
  elementalist_catalyst: { view: 'profile', n: [44, -98, -1], f: [77, -110, -1] },
  alchemist: { view: 'profile', n: [115, -60, -1], f: [-29, -103, -1] },
  alchemist_transmuter: { view: 'profile', n: [117, -21, -1], f: [-29, -103, -1] },
  alchemist_plaguewright: { view: 'profile', n: [106, -74, -1], f: [52, -68, -1] },
  alchemist_apothecary: { view: 'profile', n: [99, -45, -1], f: [-11, -28, -1] },
  oracle: { view: 'profile', n: [38, -88, -1], f: [64, -7, -1] },
  oracle_chronomancer: { view: 'profile', n: [44, -62, -1], f: [64, -7, -1] },
  oracle_fatebinder: { view: 'profile', n: [57, -76, -1], f: [64, -7, -1] },
  hexweaver: { view: 'profile', n: [77, -83, -1], f: [-72, 92, 1] },
  hexweaver_doomsayer: { view: 'profile', n: [50, -81, -1], f: [-72, 92, 1] },
  vessel: { view: 'front', n: [95, 116, 1], f: [85, -116, -1] },
};
// the figures each calling's poses must work on (the base figure first, then its path variants)
const FIGURES = {
  bulwark: { bulwark: 'bulwark', bulwark_last_bastion: 'bulwark', bulwark_ironwarden: 'bulwark', bulwark_thornguard: 'bulwark' },
  duelist: { duelist: 'duelist', duelist_bladedancer: 'duelist', duelist_executioner: 'duelist_executioner', duelist_bloodletter: 'duelist' },
  elementalist: { elementalist: 'elementalist', elementalist_accumulator: 'elementalist_accumulator', elementalist_catalyst: 'elementalist_catalyst', elementalist_prismatic: 'elementalist' },
  alchemist: { alchemist: 'alchemist', alchemist_transmuter: 'alchemist_transmuter', alchemist_plaguewright: 'alchemist_plaguewright', alchemist_apothecary: 'alchemist_apothecary' },
  oracle: { oracle: 'oracle', oracle_chronomancer: 'oracle_chronomancer', oracle_augur: 'oracle', oracle_fatebinder: 'oracle_fatebinder' },
  hexweaver: { hexweaver: 'hexweaver', hexweaver_pactbound: 'hexweaver', hexweaver_doomsayer: 'hexweaver_doomsayer', hexweaver_mirrorhex: 'hexweaver' },
  vessel: { vessel: 'vessel' },
};
// L6: the bones a block's hit may land on (the guard), per calling; never the head or torso
const GUARD = {
  bulwark: ['door'], duelist: ['rapier'], elementalist: ['book', 'hand_n', 'vessel'], alchemist: ['hand_n', 'flask'],   // vessel: the Accumulator's brass vessel (Under the Weight)
  oracle: ['hourglass', 'hand_n'], hexweaver: ['poppet', 'hand_n'], vessel: ['hand_f', 'hand_n'],
};
// held props that must stay near plumb: the most a hand's total rotation may tilt them, per figure and hand
// (the crucible on its chain, staffs, the hourglass on its ring). The Plaguewright's cane is left free: it is raised as a guard.
const PLUMB = { alchemist_transmuter: { n: 45 }, oracle: { n: 30 }, oracle_augur: { n: 30 }, oracle_chronomancer: { n: 45 }, hexweaver_doomsayer: { f: 45 } };
// flasks are held by the neck, mouth up: the mouth's screen angle is the far forearm's plus this (measured on the rest
// drawings), plus hand_f. A pose with `mouth: [lo, hi]` must keep the mouth in that range (pour: 10 or more below level, enough for a full flask).
const MOUTH = { alchemist: 42, alchemist_transmuter: 42, alchemist_apothecary: -51, alchemist_plaguewright: -73 };
// two-handed holds: both hands must turn together (the far arm is solved so the far hand stays on the grip;
// check_poses.js measures the grip distance)
const TWO_HANDED = ['duelist_executioner'];
const wrap = a => ((a % 360) + 540) % 360 - 180;
// every joint fault of one pose on one figure, as strings
function jointFaults(pose, arms) {
  const out = [], P = pose;
  for (const s of ['n', 'f']) {
    const [up, bend, fold] = arms[s], wrist = P['hand_' + s] || 0, b = bend + (P['forearm_' + s] || 0);
    if (Math.abs(wrist) > WRIST_MAX) out.push(`hand_${s} ${wrist} is past the ${WRIST_MAX} degree wrist limit`);
    if (fold * b < -ELBOW_SLACK) out.push(`elbow_${s} bends the wrong way (bend ${b}, folds ${fold < 0 ? 'negative' : 'positive'})`);
    if (fold * b > ELBOW_MAX) out.push(`elbow_${s} folds ${Math.abs(b)}, past ${ELBOW_MAX}`);
    let [lo, hi] = SHOULDER[arms.view][s];
    const inRange = a => { const m = (lo + hi) / 2; const d = m + wrap(a - m); return d >= lo && d <= hi; };
    if (!inRange(up)) { lo = up - 50; hi = up + 50; }
    const dir = up + (P['upperarm_' + s] || 0) + (P.torso || 0) + (P.lean || 0) + (P.pelvis || 0);
    if (!inRange(dir)) out.push(`upperarm_${s} points at ${wrap(dir)}, outside the shoulder range ${lo} to ${hi}`);
  }
  return out;
}
// check every pose of every calling on every figure; throws with the full list
function validate(rig = RIG) {
  const bad = [];
  for (const [cls, figs] of Object.entries(FIGURES)) {
    for (const list of ['act', 'block']) {
      (rig[cls][list] || []).forEach((R, i) => {
        const where = `${cls}.${list}[${i}]`;
        for (const k of Object.keys(R.pose.vary || {})) if (!(k in figs)) bad.push(`${where}: vary names ${k}, not a figure of ${cls}`);
        for (const [key, armKey] of Object.entries(figs)) {
          const pose = Object.assign({}, R.pose, (R.pose.vary || {})[key] || {});
          for (const f of jointFaults(pose, ARMS[armKey])) bad.push(`${where} on ${key}: ${f}`);
          const t = (pose.torso || 0) + (pose.lean || 0), tilt = s => t + (pose['upperarm_' + s] || 0) + (pose['forearm_' + s] || 0) + (pose['hand_' + s] || 0);
          for (const [s, lim] of Object.entries(PLUMB[key] || {})) if (Math.abs(tilt(s)) > lim) bad.push(`${where} on ${key}: the prop in hand_${s} tilts ${tilt(s)} from plumb (limit ${lim})`);
          if (TWO_HANDED.includes(key) && Math.abs(tilt('n') - tilt('f')) > 3) bad.push(`${where} on ${key}: two-handed grip, but the hands turn ${tilt('n')} and ${tilt('f')}`);
          if (R.mouth && key in MOUTH) { const A = ARMS[armKey], m = wrap(A.f[0] + A.f[1] + (pose.upperarm_f || 0) + (pose.forearm_f || 0) + t + MOUTH[key] + (pose.hand_f || 0)); if (m < R.mouth[0] || m > R.mouth[1]) bad.push(`${where} on ${key}: flask mouth points at ${m}, outside ${R.mouth[0]} to ${R.mouth[1]}`); }
        }
        if (list === 'block' && (!R.face || !GUARD[cls].includes(R.face[0]))) bad.push(`${where}: block hit anchors on ${R.face && R.face[0]}, not a guard part (${GUARD[cls].join(', ')})`);
      });
    }
  }
  if (bad.length) throw new Error('rig.js pose limits (LESSONS L4, L6):\n  ' + bad.join('\n  '));
}
validate();
module.exports = { RIG, DEFAULT_RIG, FIGURES, ARMS, GUARD, PLUMB, MOUTH, TWO_HANDED, WRIST_MAX, ELBOW_MAX, ELBOW_SLACK, SHOULDER, jointFaults, validate };
