from PIL import Image
import sys
dirs=['dirA','dirB','dirC']
ims=[Image.open(f'out/{d}_lineup.png').convert('RGB') for d in dirs]
w=1200; ims=[i.resize((w,int(i.height*w/i.width))) for i in ims]
c=Image.new('RGB',(w,sum(i.height for i in ims)+20),(0,0,0)); y=0
for i in ims: c.paste(i,(0,y)); y+=i.height+10
c.save('out/review_all.png')
# silhouettes at in-game size: 150 px tall figure box
row=[]
for d in dirs:
    for k in ['bulwark','duelist','elementalist']:
        s=Image.open(f'out/{d}_{k}_sil.png').convert('RGB'); s=s.resize((int(s.width*190/s.height),190)); row.append(s)
sw=sum(r.width for r in row); c=Image.new('RGB',(sw,190),(216,210,196)); x=0
for r in row: c.paste(r,(x,0)); x+=r.width
c.save('out/sil_all.png')
