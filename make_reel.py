from moviepy import ColorClip, TextClip, CompositeVideoClip, AudioFileClip
import pyttsx3
import os

W, H = 1080, 1920
DURATION = 60

script_lines = [
    (0, 4, "STOP SCROLLING"),
    (4, 10, "Busy rehna\nproductive hona nahi hota"),
    (10, 18, "Perfect plan se zyada\nexecution matter karta hai"),
    (18, 26, "10 minute ke kaam ko\n2 din mat kheecho"),
    (26, 35, "Aaj ka rule:\nIMPORTANT WORK FIRST"),
    (35, 45, "7 din ye follow karo\noutput double ho jayega"),
    (45, 55, "Small daily steps\nBIG results"),
    (55, 60, "SAVE + FOLLOW for more")
]

voice_text = (
    "Sach bolun? 90 percent log fail talent ki wajah se nahi, direction ki wajah se hote hain. "
    "Busy rehna productive hona nahi hota. "
    "Perfect planning se result nahi aata, execution se aata hai. "
    "Jo kaam 10 minute mein ho sakta hai, usko 2 din mat kheecho. "
    "Aaj se ek rule rakho, pehle important kaam, baad mein baaki sab. "
    "Agar tum yeh 7 din follow kar lo, output double ho jayega. "
    "Save karo aur follow karo."
)

# Generate voiceover WAV
voice_path = "reel_voice.wav"
engine = pyttsx3.init()
engine.setProperty('rate', 165)
engine.save_to_file(voice_text, voice_path)
engine.runAndWait()

# Base background clip
bg = ColorClip(size=(W, H), color=(15, 18, 28), duration=DURATION)

clips = [bg]

# Top & bottom accents
header = TextClip(text="1 MINUTE RESET", font_size=64, color="yellow", size=(W-80, None), method='caption') \
    .with_position((40, 90)).with_start(0).with_duration(DURATION)
sub = TextClip(text="Hindi Motivational Reel", font_size=42, color="white", size=(W-120, None), method='caption') \
    .with_position((60, 180)).with_start(0).with_duration(DURATION)
clips.extend([header, sub])

for start, end, txt in script_lines:
    tc = TextClip(
        text=txt,
        font_size=74 if len(txt) < 20 else 62,
        color="white",
        stroke_color="black",
        stroke_width=2,
        size=(W-120, None),
        method='caption',
        text_align='center'
    ).with_position((60, H//2 - 140)).with_start(start).with_duration(end-start)
    clips.append(tc)

final = CompositeVideoClip(clips, size=(W, H)).with_duration(DURATION)

if os.path.exists(voice_path):
    audio = AudioFileClip(voice_path)
    if audio.duration < DURATION:
        from moviepy import concatenate_audioclips
        loops = int(DURATION // audio.duration) + 1
        audio = concatenate_audioclips([audio] * loops).subclipped(0, DURATION)
    else:
        audio = audio.subclipped(0, DURATION)
    final = final.with_audio(audio)

out = "reel_1min_motivation.mp4"
final.write_videofile(out, fps=30, codec="libx264", audio_codec="aac", preset="medium", bitrate="5000k")
print(out)
