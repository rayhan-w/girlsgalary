from PIL import Image
import numpy as np
from scipy import ndimage

# Load original logo
img = Image.open('public/images/logo.png').convert('RGB')
arr = np.array(img, dtype=np.float32)

lum = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]
r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]

# High precision outer background extraction
# Dark border pixels:
is_border_dark = (lum < 28)
labels, num_features = ndimage.label(is_border_dark)
border_labels = set(labels[0, :]).union(set(labels[-1, :])).union(set(labels[:, 0])).union(set(labels[:, -1]))
border_labels.discard(0)
outer_bg = np.isin(labels, list(border_labels))

# Detect golden elements (gold has R > 120, G > 80, B < 120 and R > B * 1.5)
is_gold = (r > 80) & (g > 60) & (r > b * 1.3) & (~outer_bg)

# Detect white elements (woman face, hair, flowers, text) - high brightness and low saturation
max_c = np.maximum(np.maximum(r, g), b)
min_c = np.minimum(np.minimum(r, g), b)
sat = np.zeros_like(max_c)
mask_nz = max_c > 0
sat[mask_nz] = (max_c[mask_nz] - min_c[mask_nz]) / max_c[mask_nz]

is_white = (lum > 60) & (sat < 0.28) & (~outer_bg)

# Calculate clean alpha: 0 for outer_bg, 255 for artwork
# For edge pixels (lum between 5 and 35 on the boundary), use linear alpha ramp
alpha = np.zeros_like(lum)
alpha[~outer_bg] = 255
# Anti-aliasing at the boundary:
boundary = ndimage.binary_dilation(outer_bg, iterations=2) & (~outer_bg)
alpha[boundary] = np.clip((lum[boundary] - 10) / 25.0 * 255, 40, 255)

# Smooth alpha slightly
alpha = ndimage.gaussian_filter(alpha, sigma=0.6)
alpha = np.clip(alpha, 0, 255).astype(np.uint8)

# Crop to tight bounding box of artwork
bbox = Image.fromarray(alpha).getbbox()
print("Artwork Bounding Box:", bbox)

# Generate Option 1: Royal Gold & Black Luxury Logo (Transparent Background)
# In this version:
# - Woman silhouette is rendered in matching royal gold (#D4AF37)
# - Golden palanquin is preserved in vivid gold
# - Inside the cartouche remains deep black oval with gold/white "Girlsgalary"
opt1 = np.zeros((arr.shape[0], arr.shape[1], 4), dtype=np.uint8)
opt1[:, :, 0] = arr[:, :, 0]
opt1[:, :, 1] = arr[:, :, 1]
opt1[:, :, 2] = arr[:, :, 2]
opt1[:, :, 3] = alpha

# Apply rich gold tint to white elements (woman hair, face profile, flower)
for c, factor in enumerate([218, 178, 62]): # Royal Gold #DAAF3E
    opt1[is_white, c] = np.clip((lum[is_white] / 255.0) * factor + 20, 0, 255).astype(np.uint8)

opt1_cropped = Image.fromarray(opt1).crop(bbox)
opt1_cropped.save('public/images/logo-transparent.png')
print("Saved public/images/logo-transparent.png")

# Also replace public/images/logo.png with this transparent version!
opt1_cropped.save('public/images/logo.png')
print("Replaced public/images/logo.png with transparent version")

# Generate Option 2: Charcoal & Gold (Fashion Illustration look on white)
opt2 = np.zeros((arr.shape[0], arr.shape[1], 4), dtype=np.uint8)
opt2[:, :, 0] = arr[:, :, 0]
opt2[:, :, 1] = arr[:, :, 1]
opt2[:, :, 2] = arr[:, :, 2]
opt2[:, :, 3] = alpha

# Woman silhouette in charcoal #1f1f23
for c, val in enumerate([28, 28, 32]):
    opt2[is_white, c] = np.clip(val + (255 - lum[is_white]) * 0.15, 0, 255).astype(np.uint8)

opt2_cropped = Image.fromarray(opt2).crop(bbox)
opt2_cropped.save('public/images/logo-charcoal.png')
print("Saved public/images/logo-charcoal.png")

# Generate Option 3: Just the Palanquin Crest (the bottom golden palki with "Girlsgalary" text)
# Find the vertical split where the palki starts
# In bbox: ymin=34, ymax=441. The palanquin starts around y=150
palki_bbox = (bbox[0], 155, bbox[2], bbox[3])
palki_crop = Image.fromarray(opt1).crop(palki_bbox)
palki_crop.save('public/images/logo-crest.png')
print("Saved public/images/logo-crest.png")
