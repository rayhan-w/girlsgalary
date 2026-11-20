from PIL import Image
import numpy as np

img = Image.open('public/images/logo-gold.png')
# Check bounding box of non-transparent pixels
bbox = img.getbbox()
print("Bounding box of artwork:", bbox)
cropped = img.crop(bbox)
print("Cropped size:", cropped.size)
# Also check if there's any black fringe
arr = np.array(cropped)
print("Cropped aspect ratio:", cropped.size[0] / cropped.size[1])
