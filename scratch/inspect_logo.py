from PIL import Image
import numpy as np

img = Image.open('public/images/logo.png').convert('RGBA')
print("Image size:", img.size)
arr = np.array(img)
print("Corners:", arr[0, 0], arr[0, -1], arr[-1, 0], arr[-1, -1])
print("Shape:", arr.shape)
