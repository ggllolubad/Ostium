"""Summarises the Rules v2 experiments in balance/runs/*.jsonl: one row per config and door, plus per-config totals."""
import json, glob, collections, statistics as st, os, sys

R = collections.defaultdict(list)
for p in sorted(glob.glob(os.path.join(os.path.dirname(os.path.abspath(__file__)), os.environ.get('RUNS', 'runs'), '*.jsonl'))):
    name = os.path.basename(p)[:-6]
    cfg, door = name.rsplit('_d', 1)
    for line in open(p):
        try:
            R[(cfg, int(door))].append(json.loads(line))
        except Exception:
            pass

def mins(d):
    # pacing estimate: 10 s per action, 15 s per round to read intents and review the plan, 90 s per non-fight node
    f = d['fights']
    return (sum(x['actions'] for x in f) * 10 + sum(x['rounds'] for x in f) * 15) / 60 + 1.5 * max(0, d.get('layer', 12) - len(f))

def row(ds):
    n = len(ds)
    win = sum(d.get('outcome') == 'victory' for d in ds) / n
    fights = [f for d in ds for f in d['fights']]
    by = collections.defaultdict(list)
    for f in fights: by[f['tier']].append(f)
    rr = {t: round(st.mean(f['rounds'] for f in v), 1) for t, v in by.items()}
    lost = {t: round(st.mean(f['hp_lost'] for f in v), 1) for t, v in by.items()}
    deaths = st.mean(sum(h['dead'] for h in d['heroes']) for d in ds)
    stress = st.mean(max([h['stress'] for h in d['heroes']] or [0]) for d in ds)
    virt = st.mean(len(d['virtues']) for d in ds)
    aff = st.mean(sum(h['aff'] for h in d['heroes']) for d in ds)
    conj = collections.Counter()
    for d in ds: conj.update(d['conj'])
    return dict(n=n, win=round(win, 2), layer=round(st.mean(d.get('layer', 0) for d in ds), 1), rounds=rr, hp_lost=lost,
                deaths=round(deaths, 2), max_stress=round(stress), virtues=round(virt, 2), afflictions=round(aff, 2),
                minutes=round(st.mean(mins(d) for d in ds)), upgrades=round(st.mean(d['upgrades'] for d in ds), 1),
                conj={k: round(v / n, 1) for k, v in conj.most_common(8)})

cfgs = sorted({c for c, _ in R})
out = {}
for c in cfgs:
    doors = sorted(d for cc, d in R if cc == c)
    allds = [x for d in doors for x in R[(c, d)]]
    out[c] = {'all': row(allds), **{f'd{d}': row(R[(c, d)]) for d in doors}}
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), os.environ.get('OUT', 'rules_results.json')), 'w'), indent=1)
for c in cfgs:
    a = out[c]['all']
    per = ' '.join(f"d{d}:{out[c][f'd{d}']['win']:.2f}" for d in (1, 5, 9, 13) if f'd{d}' in out[c])
    print(f"{c:14} n={a['n']:3} clear {a['win']:.2f} [{per}] layer {a['layer']} rounds {a['rounds']} deaths {a['deaths']} "
          f"stress {a['max_stress']} virt {a['virtues']} aff {a['afflictions']} min {a['minutes']}")
