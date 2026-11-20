import cv2
import numpy as np
from PIL import Image

# Read image with OpenCV
img_bgr = cv2.imread('public/images/logo.png')
h, w = img_bgr.shape[:2]

# Method 1: Flood fill from corners with tolerance to get the external background
# Create mask for cv2.floodFill (size must be (h+2, w+2))
mask = np.zeros((h + 2, w + 2), np.uint8)

# Convert to grayscale to check brightness
gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

# Find outer black areas by flood filling from (0,0) and other outer points
flood_filled = np.zeros((h, w), dtype=np.uint8)

# Threshold for near-black outer background (e.g. brightness < 20)
# Let's inspect brightness of the image
print("Min gray:", gray.min(), "Max gray:", gray.max())
print("Border gray average:", np.mean([gray[0, :], gray[-1, :], gray[:, 0], gray[:, -1]]))

# Seed points: corners and edges
seeds = [(0, 0), (w-1, 0), (0, h-1), (w-1, h-1), 
         (w//2, 0), (0, h//2), (w-1, h//2), (w//2, h-1),
         (10, 10), (w-10, 10), (10, h-10), (w-10, h-10)]

flood_mask = np.zeros((h + 2, w + 2), np.uint8)
# We fill with tolerance up to 35 to catch JPEG compression artifacts near borders
for sx, sy in seeds:
    cv2.floodFill(img_bgr, flood_mask, (sx, sy), (0, 0, 0), loDiff=(18, 18, 18), upDiff=(18, 18, 18), flags=4 | (255 << 8) | cv2.FLOODFILL_MASK_ONLY)

# flood_mask contains 255 where background was flooded
outer_bg = (flood_mask[1:-1, 1:-1] == 255)
print("Outer background pixel ratio:", np.mean(outer_bg))

# Also find if there are enclosed black areas inside the hair or frame that are also outer background
# Let's see if the cartouche inside has white text "Girlsgalary"
# In the center (around h//2, w//2), let's inspect the text
center_crop = gray[int(h*0.4):int(h*0.65), int(w*0.3):int(w*0.7)]
print("Center min/max:", center_crop.min(), center_crop.max())
