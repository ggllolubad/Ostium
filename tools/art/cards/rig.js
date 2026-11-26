// Hero rigs per calling, used by samples.js (rigOf).
'use strict';
// Each calling has a list of act poses (attacks and casts) and a list of block poses. A card picks the first pose whose
// words match its name or note, else one by a hash of its id, so cards of one calling do not repeat one pose.
// A pose: bone rotations (posed the way card_figure.js does), placement (the head joint lands on `at`, at `scale`),
// a style for the FX, and the points the FX hang on, as [bone, point in figure px] (point null = the bone's joint).
// Path variants share their calling's poses: their joints sit where the base figure's do.
const RIG = {
  bulwark: {
    act: [
      { style: 'swing', words: /swing|smash|over|crush|blow|maul|hook/, pose: { upperarm_n: -160, forearm_n: 40, hand_n: 160, torso: 10, upperarm_f: -10, lean: 4 }, at: [330, 372], scale: 1.22, weapon: ['mace', [500, 236]], pivot: 'upperarm_n', sweep: 85 },
      { style: 'strike', words: /thrust|jab|drive|punch|pommel|butt/, pose: { upperarm_n: -80, forearm_n: 30, hand_n: 70, torso: 8, lean: 6, upperarm_f: -8 }, at: [340, 330], scale: 1.3, weapon: ['mace', [500, 236]] },
      { style: 'strike', words: /shove|shield|door|push|bash|ram|shoulder|slam/, pose: { torso: 14, lean: 9, head: 6, upperarm_f: -14 }, at: [360, 330], scale: 1.32, weapon: ['door', [530, 300]], off: [40, 0] },
    ],
    block: [
      { words: /brace|set|stand|hold|plant|wall/, pose: { torso: 4, head: 4, lean: -2, upperarm_f: -2 }, at: [380, 352], scale: 1.42, face: ['door', [526, 330]], wood: true },
      { words: /raise|cover|duck|overhead|under|kneel/, pose: { torso: 14, head: 14, lean: 7, upperarm_f: -24, forearm_f: -6, upperarm_n: 10 }, at: [370, 390], scale: 1.38, face: ['door', [526, 270]], wood: true },
    ],
  },
  duelist: {
    act: [
      { style: 'cuts', words: /cut|slash|two|step|flurry|dance|blade/, pose: { upperarm_n: -35, forearm_n: -5, hand_n: -10, torso: 6, lean: 6, head: -6, cape: -10 }, at: [300, 236], scale: 1.2, weapon: ['rapier', [588, 518]], off: 'dagger' },
      { style: 'strike', words: /lunge|thrust|point|pierce|touch|measure|run through|gap/, pose: { upperarm_n: -22, forearm_n: 2, hand_n: -18, torso: 12, lean: 11, head: -10, cape: -16 }, at: [290, 262], scale: 1.18, weapon: ['rapier', [588, 518]], off: [30, 0] },
      { style: 'swing', words: /dagger|stab|off-hand|knife|bleed|bled|execut|riposte|down/, pose: { upperarm_n: -105, forearm_n: 35, hand_n: -50, torso: 8, lean: 6, head: -4 }, at: [290, 340], scale: 1.08, weapon: ['rapier', [588, 518]], pivot: 'upperarm_n', sweep: 70 },
    ],
    block: [
      { words: /parry|guard|bind|high|en garde/, pose: { upperarm_n: -30, forearm_n: -70, hand_n: -30, torso: -4, lean: -3 }, at: [330, 250], scale: 1.25, face: ['rapier', [520, 460]] },
      { words: /deflect|turn|step|evade|dodge|aside|low|back/, pose: { upperarm_n: 10, forearm_n: -20, hand_n: 10, torso: -10, lean: -6, head: -4, cape: 10 }, at: [330, 250], scale: 1.25, face: ['rapier', [540, 480]] },
    ],
  },
  elementalist: {
    act: [
      { style: 'cast', words: /flick|bolt|bead|ink|drop|dot/, pose: { upperarm_n: -60, forearm_n: 110, hand_n: -30, torso: -4, head: -10 }, hide: ['sign'], at: [262, 300], scale: 1.32, hand: ['hand_n', [394, 296]] },
      { style: 'cast', words: /page|book|read|codex|script|rite|word/, pose: { upperarm_f: -65, forearm_f: -30, torso: -6, head: -8, upperarm_n: 15 }, hide: ['sign'], at: [280, 300], scale: 1.3, hand: ['book', null] },
      { style: 'cast', words: /sweep|spray|all|wave|spill|ring|spectrum|flood/, pose: { upperarm_n: -100, forearm_n: 95, hand_n: -50, torso: -8, head: -10 }, hide: ['sign'], at: [280, 310], scale: 1.3, hand: ['hand_n', null], spray: true },
    ],
    block: [
      { words: /book|page|cover|shield/, pose: { upperarm_f: -12, forearm_f: -12, torso: -5, head: -4, upperarm_n: 10 }, hide: ['sign'], at: [300, 290], scale: 1.3, face: ['book', null] },
      { words: /ward|palm|sign|hand|still|calm/, pose: { upperarm_n: -70, forearm_n: 60, hand_n: -80, torso: -6, head: -6 }, hide: ['sign'], at: [290, 300], scale: 1.3, face: ['hand_n', null] },
    ],
  },
  alchemist: {
    act: [
      { style: 'cast', words: /throw|lob|toss|hurl|overarm|bomb|flask|pot/, pose: { upperarm_f: -25, forearm_f: -15, torso: 5, lean: 4 }, at: [300, 300], scale: 1.2, hand: ['flask', null], glass: true },
      { style: 'pour', words: /pour|spill|drip|tip|dose|coat|anoint|acid|oil|douse|alkahest|transmut/, pose: { upperarm_f: 35, forearm_f: 70, hand_f: 40, torso: 8, lean: 5 }, at: [300, 300], scale: 1.25, hand: ['flask', null] },
      { style: 'cast', words: /flick|splash|spray|vial|chaser|fling|dash/, pose: { upperarm_n: -65, forearm_n: 25, torso: 6, lean: 3, upperarm_f: 25, forearm_f: 40 }, at: [300, 300], scale: 1.25, hand: ['hand_n', null] },
    ],
    block: [
      { words: /apron|arm|guard|leather|hide|cover/, pose: { upperarm_n: -55, forearm_n: -85, torso: -8, lean: -4, head: 6, upperarm_f: 20, forearm_f: 30 }, at: [330, 300], scale: 1.25, face: ['hand_n', null], off: [90, -20] },
      { style: 'pour', words: /pour|barrier|line|wall|fume|smoke|hood|oil|tar|coat/, pose: { upperarm_f: 35, forearm_f: 70, hand_f: 40, torso: 8, lean: 5 }, at: [300, 300], scale: 1.25, face: ['flask', null] },
    ],
  },
  oracle: {
    act: [
      { style: 'cast', words: /hour|time|glass|sand|turn/, pose: { upperarm_n: -55, forearm_n: 25, torso: 3, head: -4 }, at: [300, 280], scale: 1.25, hand: ['hourglass', null] },
      { style: 'cast', words: /raise|star|sky|heaven|unmak|end|all/, pose: { upperarm_n: -125, forearm_n: -15, torso: -4, head: -8 }, at: [310, 320], scale: 1.22, hand: ['hourglass', null], spray: true },
      { style: 'cast', words: /point|foretell|see|name|doom|mark|fate|omen/, pose: { upperarm_f: -70, forearm_f: -5, torso: 6, head: -4, upperarm_n: 20 }, at: [300, 290], scale: 1.25, hand: ['hand_f', null] },
    ],
    block: [
      { words: /glass|hour|hold|ward/, pose: { upperarm_n: 10, forearm_n: 20, torso: -5, lean: -2 }, at: [330, 290], scale: 1.25, face: ['hourglass', null], off: [120, 0] },
      { words: /turn|away|cloak|robe|hide|veil|seen/, pose: { torso: -14, lean: -6, head: 10, upperarm_n: 30, forearm_n: 30 }, at: [340, 300], scale: 1.25, face: ['hourglass', null], off: [130, -40] },
    ],
  },
  hexweaver: {
    act: [
      { style: 'strike', words: /pin|stab|pierce|needle|twist|knife|bone|blood|cut/, pose: { upperarm_f: 50, forearm_f: 60, hand_f: 10, torso: 8, lean: 5 }, at: [300, 300], scale: 1.3, weapon: ['hand_f', null] },
      { style: 'cast', words: /poppet|doll|whisper|bind|cord|knot/, pose: { upperarm_n: -45, forearm_n: 15, torso: 4, head: -6 }, at: [300, 300], scale: 1.3, hand: ['poppet', null] },
      { style: 'cast', words: /fling|dirt|throw|spit|curse|raise|ring|bell|toll|hour|glass|mirror/, pose: { upperarm_f: -20, forearm_f: -30, torso: -6, head: -4, upperarm_n: 25, forearm_n: 20 }, at: [300, 320], scale: 1.25, hand: ['hand_f', null], spray: true },
    ],
    block: [
      { words: /poppet|bind|charm|ward|doll|mirror|glass/, pose: { upperarm_n: -85, forearm_n: 35, torso: -6, lean: -3 }, at: [310, 300], scale: 1.3, face: ['poppet', null], off: [80, -10] },
      { style: 'salt', words: /salt|line|threshold|circle|ground|dirt|ash/, pose: { torso: 14, lean: 6, head: 8, upperarm_n: 30, forearm_n: 40, upperarm_f: 40, forearm_f: 50 }, at: [320, 300], scale: 1.25, face: ['hand_n', null] },
    ],
  },
  vessel: {
    act: [
      { style: 'strike', words: /strike|palm|blow|push|hit|drive/, pose: { upperarm_f: -60, forearm_f: -20, torso: 6, lean: 4 }, at: [300, 200], scale: 1.55, weapon: ['hand_f', null] },
      { style: 'cast', words: /reach|draw|take|pull|across|breath|out/, pose: { upperarm_n: -70, forearm_n: -40, hand_n: -20, torso: 8, lean: 5, upperarm_f: 20 }, at: [300, 200], scale: 1.55, hand: ['hand_n', null] },
      { style: 'cast', words: /give|gift|offer|pour|both|open|mantle/, pose: { upperarm_n: -50, forearm_n: -30, upperarm_f: -50, forearm_f: -30, torso: 4 }, at: [320, 200], scale: 1.5, hand: ['hand_f', null], spray: true },
    ],
    block: [
      { words: /cross|bar|brace|guard|hold|nimbus/, pose: { upperarm_n: -40, forearm_n: -100, upperarm_f: -40, forearm_f: -100, torso: -4 }, at: [330, 200], scale: 1.55, face: ['hand_f', null] },
      { words: /palm|ward|stop|raise|still|breath/, pose: { upperarm_f: -90, forearm_f: -60, torso: -6, lean: -3, upperarm_n: 15 }, at: [320, 200], scale: 1.55, face: ['hand_f', null] },
    ],
  },
};
const DEFAULT_RIG = { act: [{ style: 'cast', pose: {}, at: [300, 300], scale: 1.25 }], block: [{ pose: {}, at: [380, 330], scale: 1.3 }] };
module.exports = { RIG, DEFAULT_RIG };
