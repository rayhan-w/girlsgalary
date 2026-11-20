const https = require('https');

https.get('https://amirabd.com/wp-content/uploads/elementor/css/post-21327.css?ver=1795023043', (res) => {
  let cssData = '';
  res.on('data', c => cssData += c);
  res.on('end', () => {
    const urls = [...cssData.matchAll(/url\((['"]?[^'")]+['"]?)\)/gi)].map(m => m[1].replace(/['"]/g, ''));
    console.log("Images found in post-21327.css:", urls);
  });
});
