const https = require('https');

https.get('https://amirabd.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const headerEnd = data.indexOf('</header>');
    console.log("=== AFTER HEADER ===");
    console.log(data.slice(headerEnd + 9, headerEnd + 2500));
  });
});
