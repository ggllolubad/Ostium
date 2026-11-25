# Composite scenes for the A+C direction from rendered figure PNGs.
from PIL import Image, ImageDraw, ImageFilter
O='out'
def fig(name, h=None):
    im=Image.open(f'{O}/{name}.png').convert('RGBA')
    return im
def scene(W,H,top=(74,62,48),bot=(18,15,12)):
    bg=Image.new('RGBA',(W,H))
    d=ImageDraw.Draw(bg)
    for y in range(H):
        t=y/H; c=tuple(int(top[i]*(1-t)+bot[i]*t) for i in range(3)); d.line([(0,y),(W,y)],fill=c+(255,))
    d.rectangle([0,H-58,W,H],fill=(14,11,9,255))
    return bg
def place(bg, im, x, y=22, shadow=True):
    if shadow:
        sh=Image.new('RGBA',bg.size,(0,0,0,0)); ImageDraw.Draw(sh).ellipse([x+110,y+790-18,x+490,y+790+22],fill=(0,0,0,150))
        bg.alpha_composite(sh.filter(ImageFilter.GaussianBlur(10)))
    bg.alpha_composite(im,(x,y))
# encounter: party facing the Thrall
bg=scene(1900,860)
for k,x in [('dirAC_elementalist',40),('dirAC_duelist',420),('dirAC_bulwark',800)]: place(bg,fig(k),x)
place(bg,fig('dirAC2_thrall'),1300)
bg.convert('RGB').save(f'{O}/AC_encounter.png')
# roster: six callings + keeper
bg=scene(3000,860)
xs=[0,400,800,1200,1600,2000,2420]
for k,x in zip(['dirAC_bulwark','dirAC_duelist','dirAC_elementalist','dirAC2_alchemist','dirAC2_oracle','dirAC2_hexweaver','dirAC2_smith'],xs): place(bg,fig(k),x)
bg.convert('RGB').save(f'{O}/AC_roster.png')
# silhouettes at game size
row=[]
for k in ['dirAC_bulwark','dirAC_duelist','dirAC_elementalist','dirAC2_alchemist','dirAC2_oracle','dirAC2_hexweaver','dirAC2_thrall','dirAC2_smith']:
    s=Image.open(f'{O}/{k}.png').convert('RGBA'); a=s.split()[3]; bb=a.getbbox()
    blk=Image.new('RGBA',s.size,(0,0,0,255)); blk.putalpha(a); blk=blk.crop((bb[0]-8,0,bb[2]+8,s.height)); blk=blk.resize((int(blk.width*190/blk.height),190))
    row.append(blk)
w=sum(r.width for r in row)+12*len(row); c=Image.new('RGBA',(w,190),(216,210,196,255)); x=0
for r in row: c.alpha_composite(r,(x,0)); x+=r.width+12
c.convert('RGB').save(f'{O}/AC_sil.png')
