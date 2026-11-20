const https = require('https');

https.get('https://amirabd.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Look for all repeater items or swiper slides in post css or html
    const matches = [...data.matchAll(/elementor-repeater-item-[a-f0-9]+/g)].map(m => m[0]);
    console.log("Repeater items found:", [...new Set(matches)]);

    // Check if there are style tags with elementor-repeater-item
    const styleTags = [...data.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);
    console.log("Total style tags:", styleTags.length);
    for (const style of styleTags) {
      if (style.includes('elementor-repeater-item')) {
        const bgMatches = [...style.matchAll(/(\.elementor-repeater-item-[a-f0-9]+[^{]*\{[^}]*background-image:[^;]+;[^}]*\})/gi)];
        bgMatches.forEach(m => console.log(m[0]));
      }
    }
  });
});
