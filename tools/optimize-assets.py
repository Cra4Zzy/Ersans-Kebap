"""Generate responsive WebP images and local WOFF2 fonts from retained sources."""
from pathlib import Path
import json, shutil
from PIL import Image, ImageOps
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'img/optimized'
hero_source = ROOT / 'img/hero-kebap-source.webp'
if not hero_source.exists():
    shutil.copyfile(OUT / 'hero-kebap.webp', hero_source)
manifest = {}
for old in sorted(OUT.glob('*.webp')):
    if old.stem.endswith(('-480', '-960')) or old.stem == 'logo-header':
        continue
    name = old.stem
    source = hero_source if name == 'hero-kebap' else next(
        p for p in (ROOT / 'img').glob(name + '.*') if p.suffix.lower() in ['.jpg', '.jpeg', '.png'])
    with Image.open(source) as im:
        im = ImageOps.exif_transpose(im).convert('RGB')
        im.thumbnail((1440, 1600), Image.Resampling.LANCZOS)
        variants = []
        for width in sorted(set([480, 960, im.width])):
            if width > im.width:
                continue
            size = (width, round(im.height * width / im.width))
            image = im.resize(size, Image.Resampling.LANCZOS)
            filename = name + ('' if width == im.width else '-' + str(width)) + '.webp'
            image.save(OUT / filename, 'WEBP', quality=74 if name == 'hero-kebap' else 70, method=6)
            variants.append({'file': filename, 'width': width, 'height': size[1], 'bytes': (OUT / filename).stat().st_size})
        manifest[name] = {'width': im.width, 'height': im.height, 'variants': variants}
with Image.open(ROOT / 'img/logo-header.png') as im:
    im = im.convert('RGBA')
    im.thumbnail((560, 284), Image.Resampling.LANCZOS)
    im.save(OUT / 'logo-header.webp', 'WEBP', lossless=True, method=6)
manifest['logo-header'] = {'width': im.width, 'height': im.height}
(ROOT / 'data/images.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
for source in (ROOT / 'fonts').glob('*.woff'):
    font = TTFont(source)
    font.flavor = 'woff2'
    font.save(source.with_suffix('.woff2'))
print('Generated', len(manifest)-1, 'responsive image sets, small transparent logo and 4 WOFF2 fonts')
