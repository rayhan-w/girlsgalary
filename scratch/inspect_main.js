const https = require('https');

https.get('https://amirabd.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const mainIdx = data.indexOf('<main');
    console.log("=== FIRST 2000 CHARS OF MAIN ===");
    console.log(data.slice(mainIdx, mainIdx + 2500));
  });
});
