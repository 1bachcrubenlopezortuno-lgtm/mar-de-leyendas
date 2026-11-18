import sys
from PIL import Image
from collections import deque
def clean_bg(im,thr=232):
    im=im.convert('RGBA');W,H=im.size;px=im.load()
    def bgl(p):r,g,b,a=p;return a<20 or (r>thr and g>thr and b>thr)
    seen=bytearray(W*H);q=deque()
    for x in range(W):q.append((x,0));q.append((x,H-1))
    for y in range(H):q.append((0,y));q.append((W-1,y))
    while q:
        x,y=q.popleft()
        if x<0 or y<0 or x>=W or y>=H:continue
        i=y*W+x
        if seen[i]:continue
        seen[i]=1
        if not bgl(px[x,y]):continue
        px[x,y]=(0,0,0,0)
        q.extend(((x+1,y),(x-1,y),(x,y+1),(x,y-1)))
    # suavizar halo blanco: pixeles casi blancos pegados a transparente
    for _ in range(2):
        rm=[]
        for y in range(1,H-1):
            for x in range(1,W-1):
                r,g,b,a=px[x,y]
                if a and r>215 and g>215 and b>215 and any(px[x+dx,y+dy][3]==0 for dx,dy in((1,0),(-1,0),(0,1),(0,-1))):rm.append((x,y))
        for p in rm:px[p]=(0,0,0,0)
    return im
def segments(im,gap):
    W,H=im.size;a=im.getchannel('A').load()
    cols=[any(a[x,y]>0 for y in range(H)) for x in range(W)]
    segs=[];x=0
    while x<W:
        if cols[x]:
            s=x
            while x<W and (cols[x] or any(cols[x:x+gap])):x+=1
            segs.append((s,x))
        else:x+=1
    return segs
def frames(path,n,gap=12):
    im=clean_bg(Image.open(path))
    segs=segments(im,gap)
    # unir segmentos pequeños al vecino más cercano hasta tener n
    while len(segs)>n:
        widths=[b-a for a,b in segs];i=widths.index(min(widths))
        if i==0:j=1
        elif i==len(segs)-1:j=i-1
        else:j=i-1 if segs[i][0]-segs[i-1][1]<segs[i+1][0]-segs[i][1] else i+1
        a=min(segs[i][0],segs[j][0]);b=max(segs[i][1],segs[j][1]);segs=[s for k,s in enumerate(segs) if k not in(i,j)]+[(a,b)];segs.sort()
    out=[]
    for a,b in segs:
        fr=im.crop((a,0,b,im.size[1]));bb=fr.getbbox();out.append(fr.crop(bb))
    return out,segs
def place(frs,size,bodyH,anchor='left'):
    ref=frs[0];s=bodyH/ref.size[1];res=[]
    refW=round(ref.size[0]*s);left0=(size-refW)//2
    for f in frs:
        w=max(1,round(f.size[0]*s));h=max(1,round(f.size[1]*s));g=f.resize((w,h),Image.LANCZOS)
        al=g.getchannel('A').point(lambda v:255 if v>=128 else 0);g.putalpha(al)
        c=Image.new('RGBA',(size,size),(0,0,0,0))
        x=left0 if anchor=='left' else (size-w)//2
        if x+w>size:x=max(0,size-w)
        c.paste(g,(x,size-h-2),g);res.append(c)
    return res
