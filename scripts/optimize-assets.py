from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
public = root / "public"
optimized = public / "optimized"
optimized.mkdir(exist_ok=True)

sources = [public / "asem-portrait.png", *sorted((public / "orasoft").glob("*.webp"))]
for source in sources:
    image = Image.open(source).convert("RGB")
    original = image.size
    max_width = 1200 if source.name != "asem-portrait.png" else 460
    if image.width > max_width:
        height = round(image.height * max_width / image.width)
        image = image.resize((max_width, height), Image.Resampling.LANCZOS)
    target_name = source.stem + ".webp"
    target = optimized / target_name
    image.save(target, "WEBP", quality=82, method=6)
    print(f"{source.name}: {original} -> {image.size}, {source.stat().st_size} -> {target.stat().st_size} bytes")
