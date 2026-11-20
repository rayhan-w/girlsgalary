from PIL import Image
import numpy as np
from scipy import ndimage

img = Image.open('public/images/logo.png').convert('RGB')
arr = np.array(img, dtype=np.float32)

# Luminance / brightness
luminance = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]

# Outer black background is very dark (luminance < 15 or 20)
is_dark = (luminance < 20)

# Connected components from the outer edge
# Create a seed mask starting at the borders
seed = np.zeros_like(is_dark, dtype=bool)
seed[0, :] = is_dark[0, :]
seed[-1, :] = is_dark[-1, :]
seed[:, 0] = is_dark[:, 0]
seed[:, -1] = is_dark[:, -1]

# Binary dilation or connected components to find all dark pixels connected to the borders
labels, num_features = ndimage.label(is_dark)
# Which labels touch the border?
border_labels = set(labels[0, :]).union(set(labels[-1, :])).union(set(labels[:, 0])).union(set(labels[:, -1]))
border_labels.discard(0) # 0 is non-dark

outer_bg_mask = np.isin(labels, list(border_labels))
print(f"Total dark pixels: {np.sum(is_dark)}, connected to border: {np.sum(outer_bg_mask)}")
print(f"Percentage of image that is outer background: {np.mean(outer_bg_mask)*100:.1f}%")
