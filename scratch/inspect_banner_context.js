const https = require('https');

https.get('https://amirabd.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const idx = data.indexOf('Web-banner-eidul-adha-EDIT-25.jpg');
    if (idx !== -1) {
      console.log("SURROUNDING HTML OF BANNER:\n", data.slice(Math.max(0, idx - 400), idx + 600));
    }
  });
});
