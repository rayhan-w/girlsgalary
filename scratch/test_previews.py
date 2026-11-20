from PIL import Image

for name in ['logo-transparent.png', 'logo-clean.png', 'logo-gold.png']:
    img = Image.open(f'public/images/{name}')
    white_bg = Image.new('RGB', img.size, (255, 255, 255))
    white_bg.paste(img, (0, 0), img)
    white_bg.save(f'scratch/preview-{name}.jpg')
    print(f"Generated preview for {name}")
