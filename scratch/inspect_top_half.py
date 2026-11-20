from PIL import Image
import numpy as np

img = Image.open('public/images/logo.png').convert('RGB')
arr = np.array(img)

# In the top half (woman illustration), what are the pixel values?
top_half = arr[:250, :]
print("Top half min:", top_half.min(axis=(0,1)), "max:", top_half.max(axis=(0,1)))
# Look at non-black pixels in top half
non_black = top_half[np.max(top_half, axis=2) > 50]
print("Number of non-black pixels in top half:", len(non_black))
# What are their RGB averages?
print("Average RGB of non-black in top half:", np.mean(non_black, axis=0))
# Sample of values
print("Sample values in top half:", non_black[:10])
