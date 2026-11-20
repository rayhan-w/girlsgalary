const https = require('https');

https.get('https://amirabd.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const cssLinks = [...data.matchAll(/<link[^>]+href="([^">]+\.css[^">]*)"[^>]*>/gi)].map(m => m[1]);
    console.log("CSS links:", cssLinks.filter(c => c.includes('elementor') || c.includes('post-21327')));
  });
});
