const https = require('https');

https.get('https://amirabd.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const swiperIdx = data.indexOf('elementor-slides-wrapper');
    console.log(data.slice(swiperIdx, swiperIdx + 3000));
  });
});
