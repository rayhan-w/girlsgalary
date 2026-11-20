const https = require('https');

https.get('https://amirabd.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Find the main banner or slider in the body
    const bodyIdx = data.indexOf('<body');
    const bodyContent = data.slice(bodyIdx);
    
    // Look for revolution slider or elementor slider or banner widget
    const matches = [...bodyContent.matchAll(/<div[^>]+class="[^"]*(?:banner|slider|slideshow)[^"]*"[^>]*>[\s\S]*?<\/div>/gi)];
    console.log("Found matches count:", matches.length);
    for (let i = 0; i < Math.min(5, matches.length); i++) {
      console.log(`--- MATCH ${i} ---`);
      console.log(matches[i][0].slice(0, 400));
    }
  });
});
