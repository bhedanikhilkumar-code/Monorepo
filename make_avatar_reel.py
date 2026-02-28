from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
import imageio.v2 as imageio
from pathlib import Path

img_path = Path(r"C:\Users\bheda\Downloads\Indian girl dance tik tok hindi song music video.jpg")
out_path = Path(r"C:\Users\bheda\Downloads\ai_influencer_avatar_reel.mp4")

base = Image.open(img_path).convert('RGB')
W,H = 1080,1920
fps = 30
duration = 18
frames = fps*duration

# fit base as full screen background style
bw,bh = base.size
scale = max(W/bw, H/bh)
resized = base.resize((int(bw*scale), int(bh*scale)), Image.LANCZOS)

# font fallback
try:
    f1 = ImageFont.truetype("arial.ttf", 68)
    f2 = ImageFont.truetype("arial.ttf", 44)
    f3 = ImageFont.truetype("arial.ttf", 36)
except:
    f1 = ImageFont.load_default()
    f2 = ImageFont.load_default()
    f3 = ImageFont.load_default()

writer = imageio.get_writer(str(out_path), fps=fps, codec='libx264', quality=8)

for i in range(frames):
    t = i/frames
    zoom = 1.0 + 0.08*t
    rw,rh = resized.size
    zw,zh = int(rw*zoom), int(rh*zoom)
    zimg = resized.resize((zw,zh), Image.LANCZOS)
    x = (zw - W)//2 + int(20*np.sin(i/40))
    y = (zh - H)//2 + int(25*np.cos(i/55))
    frame = zimg.crop((x,y,x+W,y+H))

    # dark gradient overlay
    ov = Image.new('RGBA', (W,H), (0,0,0,0))
    d = ImageDraw.Draw(ov)
    for yy in range(H):
        a = int(180*(yy/H))
        d.line((0,yy,W,yy), fill=(0,0,0,a))
    frame = Image.alpha_composite(frame.convert('RGBA'), ov)

    d = ImageDraw.Draw(frame)

    # scenes text
    if i < fps*5:
        headline = "AI INFLUENCER\nAVATAR STYLE"
        sub = "Create viral short videos with one face + smart script"
    elif i < fps*11:
        headline = "HOOK + STORY + CTA"
        sub = "Formula: 3-sec hook, 20-sec value, clear action"
    else:
        headline = "READY TO POST"
        sub = "Daily consistency beats perfection. Start today."

    # glow box
    d.rounded_rectangle((60,1220,1020,1780), radius=40, fill=(0,0,0,110), outline=(255,255,255,70), width=2)

    d.multiline_text((90,1280), headline, font=f1, fill=(255,255,255,240), spacing=8)
    d.text((90,1500), sub, font=f3, fill=(220,220,220,230))
    d.text((90,1705), "@yourhandle  •  #AIInfluencer #AvatarReels", font=f2, fill=(255,215,120,240))

    writer.append_data(np.array(frame.convert('RGB')))

writer.close()
print(out_path)
