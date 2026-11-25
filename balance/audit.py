import json,re,collections,sys
C=json.load(open('data/cards.json'))
KW=set("Block Armor Ward Conjunction Burn Weaken Static Soak Toxin Erode Bleed Stun Tenacity Mark Vulnerable Might Focus Momentum Riposte Taunt Guard Prime Echo Exhaust Retain Thorns Dodge Regen Hex Doom Fortify Anchor Grit Omen".split())
issues=collections.defaultdict(list)
def nums_fx(c):
    out=[]
    for f in c['fx']:
        if f['t'] in ('add',): continue
        n=f.get('n')
        if isinstance(n,(int,float)) and n not in (0,):
            out.append(abs(int(n)))
        for k in ('k','max','times','lifesteal'):
            if k in f and isinstance(f[k],(int,float)) and f[k] not in (1,): out.append(int(f[k]))
    return out
for id,c in C.items():
    t=c['text']
    tn=[int(x) for x in re.findall(r'(?<![\w.])(\d+)(?![\w])',t)]
    fn=nums_fx(c)
    # numbers in text not in fx
    miss=[x for x in tn if x not in fn and x not in (1,2,3,4) or (x not in fn and x>=5)]
    extra=[x for x in fn if x not in tn and x>=2]
    if miss or extra:
        issues['numbers'].append((id,c['name'],t,'text-only:',sorted(set(tn)-set(fn)),'fx-only:',sorted(set(fn)-set(tn)),json.dumps(c['fx'])))
    kws=set(c.get('kw',[]))
    for k in ('Exhaust','Retain','Echo'):
        if (k in t) != (k in kws):
            issues['keyword'].append((id,c['name'],k,'in text' if k in t else 'kw only',t))
    if 'Prime' in kws and not any(f['t']=='prime' for f in c['fx']) and 'Prime' not in t:
        issues['keyword'].append((id,c['name'],'Prime kw w/o prime fx',t))
    # element apply vs text mention
    for f in c['fx']:
        if f['t']=='apply':
            st={'fire':'Burn','frost':'Weaken','lightning':'Static','water':'Soak','toxin':'Toxin','void':'Erode'}[f['e']]
            if st not in t and f['e'].capitalize() not in t:
                issues['element_name'].append((id,c['name'],f['e'],st,t))
        if f['t'] in('status','self_status'):
            nm=f['s']
            if nm.lower() not in t.lower() and not (nm=='freeze' and 'Froz' in t) and not (nm=='neuro'):
                issues['status_name'].append((id,c['name'],nm,t))
    if c['target']=='enemy' and 'hit' not in c:
        issues['no_hit_ranks'].append((id,c['name']))
for k,v in issues.items():
    print(f'== {k}: {len(v)}')
    for x in v[:400]: print('  ',x)
