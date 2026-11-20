const https = require('https');

https.get('https://amirabd.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Find all images in the slider / banner section
    const imgMatches = [...data.matchAll(/<img[^>]+src="([^">]+)"[^>]*>/gi)];
    console.log("=== ALL IMAGES IN AMIRA HOME ===");
    imgMatches.forEach(m => {
      if (m[1].includes('banner') || m[1].includes('Banner') || m[1].includes('slider') || m[1].includes('slideshow')) {
        console.log(m[0]);
      }
    });

    // Also look for revslider or swiper or slick slider
    const sliderContainer = data.match(/class="[^"]*(slider|slideshow|rev_slider|banner)[^"]*"/gi);
    console.log("=== SLIDER CLASSES ===", sliderContainer?.slice(0, 10));
  });
});
