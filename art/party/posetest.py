# Poses a rig by rotating bones about their pivots (parent transforms compose), like Godot's Skeleton2D.
import json, math, sys
from PIL import Image
def pose(d, rot, out, bg=(46,40,34,255)):
    rig=json.load(open(d+'/rig.json')); B=rig['bones']
    def chain(b):
        c=[]
        while b and b in B: c.append(b); b=B[b]['parent']
        return c[::-1]
    def xform(b):  # returns function mapping a point in rest pose to posed position
        ops=[(B[x]['pivot'], math.radians(rot.get(x,0))) for x in chain(b)]
        def f(p):
            x,y=p
            for (px,py),a in reversed(ops):
                dx,dy=x-px,y-py; x,y=px+dx*math.cos(a)-dy*math.sin(a), py+dx*math.sin(a)+dy*math.cos(a)
            return x,y
        return f, ops
    W,H=rig['canvas']; canvas=Image.new('RGBA',(W,H),bg)
    for L in rig['layers']:
        im=Image.open(f"{d}/{L['name']}.png").convert('RGBA'); b=L['bone']
        if b=='root' or b not in B: canvas.alpha_composite(im); continue
        f,ops=xform(b); total=sum(a for _,a in ops)
        piv=B[b]['pivot']; newp=f(piv)
        if abs(total)<1e-6 and abs(newp[0]-piv[0])<1e-6 and abs(newp[1]-piv[1])<1e-6: canvas.alpha_composite(im); continue
        r=im.rotate(-math.degrees(total), resample=Image.BICUBIC, center=tuple(piv), translate=(newp[0]-piv[0], newp[1]-piv[1]))
        canvas.alpha_composite(r)
    canvas.convert('RGB').save(out)
if __name__=='__main__':
    d=sys.argv[1]; out=sys.argv[2]; rot=json.loads(sys.argv[3]); pose(d,rot,out)
