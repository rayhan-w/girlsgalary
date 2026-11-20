const https = require('https');

https.get('https://amirabd.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Search for swiper-slide-bg or repeater items in CSS
    const matches = [...data.matchAll(/\.elementor-repeater-item-[a-f0-9]+\s*\{[^}]+\}/gi)];
    console.log("Repeater CSS rules:", matches.map(m => m[0]));
    
    // Also look for background-image in inline styles
    const bgMatches = [...data.matchAll(/background-image:\s*url\(([^)]+)\)/gi)];
    console.log("Background images:", bgMatches.slice(0, 10).map(m => m[1]));
  });
});
