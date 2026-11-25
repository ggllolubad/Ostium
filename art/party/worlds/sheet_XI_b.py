# out/worlds/XI_b/sheet.png (the 11 at true relative scale + the Drowned Thrall), sheet19.png (all 19 of world XI),
# sil.png (all 19 at game size, 190 px per human). One pixel scale, one ground line (canvas h - 30 for every figure).
from PIL import Image, ImageDraw, ImageFont
import os
O='/home/claude/party/out/'
B=[('the_stilled_college','The Stilled College (ruler 3)',1600),('the_great_refractor','The Great Refractor (ruler 4.5)',1600),('the_gin_ox','The Gin Ox (elite 1.9)',1400),('the_rodwarden','The Rodwarden (elite 2.0)',1500),
   ('speculum_bearer','Speculum Bearer (large 1.4)',1100),('gate_mastiff','Gate Mastiff (large 1.2 long)',1100),('clock_jack','Clock Jack (1.05 on plinth)',940),('the_patroness','The Patroness (1.0)',820),
   ('ephemeris_clerk','Ephemeris Clerk (0.95)',820),('patroness_monkey',"The Patroness's Monkey (0.4)",820),('college_tortoise','The College Tortoise (0.3)',820)]
A=[('the_last_hour','The Last Hour',1600),('rime_colossus','Rime Colossus',1400),('horologist','The Horologist',1400),('clock_sentry','Clock Sentry',1100),('frozen_halberdier','Frozen Halberdier',820),('stopped_pilgrim','Stopped Pilgrim',820),('aurora_moth','Aurora Moth',820),('gear_spider','Gear Spider',820)]
ref=('THRALL','Drowned Thrall (human ref.)',820)
def load(k,sil=False):
    if k=='THRALL': p=O+'dirAC2_thrall.png'
    elif any(k==a[0] for a in A): p=O+f'worlds/world_XI_{k}.png'
    else: p=O+f'worlds/world_XI_b_{k}.png'
    im=Image.open(p).convert('RGBA')
    if sil:
        a=im.split()[3].point(lambda v:255 if v>90 else 0); im=Image.new('RGBA',im.size,(0,0,0,255)); im.putalpha(a)
    return im
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',15)
def sheet(items,out,scale,sil=False,names=True):
    tiles=[]
    for k,n,h in items:
        im=load(k,sil); bb=im.getbbox(); x0,x1=max(0,bb[0]-20),min(im.width,bb[2]+20)
        im=im.crop((x0,0,x1,im.height)); im=im.resize((max(1,int(im.width*scale)),max(1,int(im.height*scale))),Image.LANCZOS)
        tiles.append((im,n,int((h-30)*scale)))
    top=max(g for _,_,g in tiles); W=sum(t.width for t,_,_ in tiles)+70*len(tiles)+40; Hh=top+(60 if names else 20)
    c=Image.new('RGB',(W,Hh),(216,210,196) if sil else (26,26,30)); d=ImageDraw.Draw(c); x=20
    for im,n,g in tiles:
        layer=Image.new('RGBA',c.size,(0,0,0,0)); layer.paste(im,(x,top-g)); c.paste(layer,(0,0),layer)
        if names:
            tw=d.textlength(n,font=font); d.text((x+im.width/2-tw/2,top+18),n,fill=(40,36,30) if sil else (200,204,210),font=font)
        x+=im.width+70
    d.line([(0,top+2),(W,top+2)],fill=(150,140,125) if sil else (80,84,90),width=1)
    c.save(out); print(out,c.size)
os.makedirs(O+'worlds/XI_b',exist_ok=True)
sheet(B+[ref],O+'worlds/XI_b/sheet.png',0.4)
all19=[A[0],B[0],B[1],A[1],A[2],B[2],B[3],A[3],B[4],B[5],A[4],A[5],B[6],B[7],B[8],A[6],A[7],B[9],B[10],ref]
sheet(all19,O+'worlds/XI_b/sheet19.png',0.28)
sheet(all19,O+'worlds/XI_b/sil.png',190/640,sil=True)
