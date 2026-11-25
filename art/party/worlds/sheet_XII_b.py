# out/worlds/XII_b/sheet.png (the 11 at true relative scale + the Drowned Thrall), sheet19.png (all 19 of world XII),
# sil.png (all 19 at game size, 190 px per human). One pixel scale; every canvas's ground line is h - 30.
# Copied from the maker's scratch by the independent reviewer; silhouettes now come from each render's alpha.
from PIL import Image, ImageDraw, ImageFont
O='/home/claude/party/out/'
B=[('the_unspoken_bear','The Unspoken Bear (ruler 3.5)'),('the_hearth_grandmother','The Hearth Grandmother (ruler 3)'),('the_voiceless_chief','The Voiceless Chief (elite 2.1)'),('the_drum_seer','The Drum-Seer (elite 1.9)'),
   ('sledge_hauler','Sledge Hauler (large 1.3)'),('lead_dog','Lead Dog (large, 1.2 long)'),('snow_house_builder','Snow-House Builder (1.05)'),('the_silent_singers','The Silent Singers (1.0)'),('ice_fisher','Ice-Fisher (0.9, seated)'),('hush_child','Hush-Child (0.5)'),('lemming_drift','Lemming Drift (0.5 x 1.0)')]
A=[('cold_star','The Cold Star'),('void_mammoth','Void Mammoth'),('pale_hunter','The Pale Hunter'),('silence_stag','Silence Stag'),('hollow_wanderer','Hollow Wanderer'),('frozen_saint','Frozen Saint'),('rime_shade','Rime Shade'),('starless_eye','Starless Eye')]
ref=('THRALL','Drowned Thrall (human ref.)')
def load(k,sil=False):
    if k=='THRALL': p=O+('dirAC2_thrall_sil.png' if sil else 'dirAC2_thrall.png')
    elif any(k==a[0] for a in A): p=O+f'worlds/world_XII_{k}'+('_sil' if sil else '')+'.png'
    else: p=O+f'worlds/world_XII_b_{k}'+('_sil' if sil else '')+'.png'
    if sil: p=p.replace('_sil.png','.png').replace('dirAC2_thrall.png','dirAC2_thrall.png')
    im=Image.open(p).convert('RGBA')
    if sil:
        # (independent review) silhouettes from the colour render's alpha: render.js's CSS brightness(0) pass drops the
        # Unspoken Bear's torso (nested void-hole masks inside split clips), so the _sil.png files are not trusted here
        a=im.getchannel('A').point(lambda v:255 if v>128 else 0); im=Image.new('RGBA',im.size,(0,0,0,255)); im.putalpha(a)
    return im
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',15)
def sheet(items,out,scale,sil=False,names=True):
    tiles=[]
    for k,n in items:
        im=load(k,sil); h=im.height; bb=im.getbbox(); x0,x1=max(0,bb[0]-20),min(im.width,bb[2]+20)
        im=im.crop((x0,0,x1,im.height)); im=im.resize((max(1,int(im.width*scale)),int(im.height*scale)),Image.LANCZOS)
        tiles.append((im,n,int((h-30)*scale)))
    top=max(g for _,_,g in tiles); W=sum(max(t.width,int(font.getlength(n))+6 if names else 0) for t,n,_ in tiles)+30*len(tiles)+40; Hh=top+(60 if names else 20)
    c=Image.new('RGB',(W,Hh),(216,210,196) if sil else (26,26,30)); d=ImageDraw.Draw(c); x=20
    for im,n,g in tiles:
        wcol=max(im.width,int(font.getlength(n))+6 if names else 0)
        layer=Image.new('RGBA',c.size,(0,0,0,0)); layer.paste(im,(x+(wcol-im.width)//2,top-g)); c.paste(layer,(0,0),layer)
        if names:
            tw=d.textlength(n,font=font); d.text((x+wcol/2-tw/2,top+18),n,fill=(40,36,30) if sil else (200,204,210),font=font)
        x+=wcol+30
    d.line([(0,top+2),(W,top+2)],fill=(150,140,125) if sil else (80,84,90),width=1)
    c.save(out); print(out,c.size)
sheet(B+[ref],O+'worlds/XII_b/sheet.png',0.3)
all19=[A[0],B[0],B[1],A[1],A[2],B[2],B[3],A[3],B[4],B[5],A[4],B[6],B[7],A[5],A[6],B[8],A[7],B[9],B[10],ref]
sheet(all19,O+'worlds/XII_b/sheet19.png',0.2)
sheet(all19,O+'worlds/XII_b/sil.png',190/640,sil=True)
