from PIL import Image
import numpy as np
from scipy import ndimage

img = Image.open('public/images/logo.png').convert('RGB')
arr = np.array(img, dtype=np.float32)

# Luminance
lum = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]

# Outer dark background (connected to border)
is_dark = (lum < 25)
labels, num_features = ndimage.label(is_dark)
border_labels = set(labels[0, :]).union(set(labels[-1, :])).union(set(labels[:, 0])).union(set(labels[:, -1]))
border_labels.discard(0)
outer_bg = np.isin(labels, list(border_labels))

# Also fill any small enclosed holes in outer_bg that are outside the main artwork
# Smooth the mask slightly for alpha feathering
# Generate Variation 1: Transparent background with white elements turned dark charcoal (#1a1a1a) for white headers
# The gold elements have high red/green and low blue (e.g. R > 150, G > 100, B < 100) or high saturation
# White elements have R ~ G ~ B > 120 and saturation < 0.2

r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
max_c = np.maximum(np.maximum(r, g), b)
min_c = np.minimum(np.minimum(r, g), b)
diff = max_c - min_c
sat = np.zeros_like(max_c)
mask_non_zero = max_c > 0
sat[mask_non_zero] = diff[mask_non_zero] / max_c[mask_non_zero]

# Is it a white/grey line (woman face, hair, text)?
# Low saturation (sat < 0.25) and bright (lum > 70)
is_white_elem = (sat < 0.25) & (lum > 70) & (~outer_bg)

# Create Version A: Transparent PNG where white strokes become dark charcoal #18181b (luxury boutique black), and gold is 100% preserved
var_a = np.zeros((arr.shape[0], arr.shape[1], 4), dtype=np.uint8)

# Alpha channel: 0 on outer_bg, 255 on artwork, smooth transition
# Distance transform for feathering
alpha = np.where(outer_bg, 0, 255).astype(np.float32)
alpha = ndimage.gaussian_filter(alpha, sigma=0.8)
alpha = np.clip(alpha, 0, 255).astype(np.uint8)

# Color for Version A:
# If is_white_elem, color is deep charcoal #18181b with original luminance inverted/mapped
new_r = r.copy()
new_g = g.copy()
new_b = b.copy()

# For white elements, map brightness to dark:
# lum 255 -> 24 (charcoal), lum 100 -> 80
new_r[is_white_elem] = 24 + (255 - lum[is_white_elem]) * 0.2
new_g[is_white_elem] = 24 + (255 - lum[is_white_elem]) * 0.2
new_b[is_white_elem] = 27 + (255 - lum[is_white_elem]) * 0.2

var_a[:, :, 0] = new_r.astype(np.uint8)
var_a[:, :, 1] = new_g.astype(np.uint8)
var_a[:, :, 2] = new_b.astype(np.uint8)
var_a[:, :, 3] = alpha

Image.fromarray(var_a).save('public/images/logo-transparent.png')
print("Saved public/images/logo-transparent.png")

# Also create Version B: Keep original colors with transparent background (for dark headers or badges)
var_b = np.zeros((arr.shape[0], arr.shape[1], 4), dtype=np.uint8)
var_b[:, :, :3] = arr.astype(np.uint8)
var_b[:, :, 3] = alpha
Image.fromarray(var_b).save('public/images/logo-clean.png')
print("Saved public/images/logo-clean.png")

# Version C: Luxury gold edition where the woman silhouette is also tinted in lustrous royal gold (#D4AF37)
var_c = np.zeros((arr.shape[0], arr.shape[1], 4), dtype=np.uint8)
new_rc = r.copy()
new_gc = g.copy()
new_bc = b.copy()
# Gold color target: [212, 175, 55]
new_rc[is_white_elem] = (lum[is_white_elem] / 255.0) * 212
new_gc[is_white_elem] = (lum[is_white_elem] / 255.0) * 175
new_bc[is_white_elem] = (lum[is_white_elem] / 255.0) * 55
var_c[:, :, 0] = new_rc.astype(np.uint8)
var_c[:, :, 1] = new_gc.astype(np.uint8)
var_c[:, :, 2] = new_bc.astype(np.uint8)
var_c[:, :, 3] = alpha
Image.fromarray(var_c).save('public/images/logo-gold.png')
print("Saved public/images/logo-gold.png")
