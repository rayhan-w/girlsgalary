const https = require('https');

https.get('https://amirabd.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Find all swiper slides with their aria-label and links
    const slides = [...data.matchAll(/<div[^>]+swiper-slide[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi)];
    console.log("Total slides found:", slides.length);
    slides.forEach(s => {
      const aria = s[0].match(/aria-label="([^"]+)"/);
      const href = s[0].match(/href="([^"]+)"/);
      const bg = s[0].match(/elementor-repeater-item-([a-f0-9]+)/);
      console.log('Slide:', aria ? aria[1] : 'none', '| Link:', href ? href[1] : 'none', '| ID:', bg ? bg[1] : '');
    });
  });
});
