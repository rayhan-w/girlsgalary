const https = require('https');

https.get('https://amirabd.com/wp-content/uploads/elementor/css/post-21327.css?ver=1795023043', (res) => {
  let cssData = '';
  res.on('data', c => cssData += c);
  res.on('end', () => {
    // Find all repeater rules with their image url
    const rules = [...cssData.matchAll(/\.elementor-repeater-item-([a-f0-9]+)[^{]*\{[^}]*background-image:\s*url\(([^)]+)\)[^}]*\}/gi)];
    rules.forEach(r => {
      console.log(`ID: ${r[1]} -> ${r[2]}`);
    });
  });
});
