from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
public = root / "public"
source = Image.open(public / "asem-portrait.png").convert("RGB")
side = min(source.size)
left = (source.width - side) // 2
top = 0
portrait = source.crop((left, top, left + side, top + side))
for filename, size in [("favicon.ico", 32), ("favicon-16x16.png", 16), ("apple-touch-icon.png", 180)]:
    image = portrait.resize((size, size), Image.Resampling.LANCZOS)
    image.save(public / filename)
    print(filename, size)
