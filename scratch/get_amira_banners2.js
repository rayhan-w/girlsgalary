const https = require('https');

https.get('https://amirabd.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const urls = [...data.matchAll(/https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/gi)].map(m => m[0]);
    console.log("Total image URLs:", urls.length);
    console.log("Unique image URLs:", [...new Set(urls)].slice(0, 20));
  });
});
