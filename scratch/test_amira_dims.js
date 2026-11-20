const https = require('https');

function getJpegDimensions(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let buffer = Buffer.alloc(0);
      res.on('data', (chunk) => {
        buffer = Buffer.concat([buffer, chunk]);
        for (let i = 0; i < buffer.length - 8; i++) {
          if (buffer[i] === 0xFF && (buffer[i + 1] === 0xC0 || buffer[i + 1] === 0xC2)) {
            const height = buffer.readUInt16BE(i + 5);
            const width = buffer.readUInt1BE ? buffer.readUInt16BE(i + 7) : 0;
            res.destroy();
            return resolve({ url, width, height, aspect: (width / height).toFixed(2) });
          }
        }
      });
      res.on('end', () => resolve({ url, end: true }));
      res.on('error', e => resolve({ url, error: e.message }));
    });
  });
}

const list = [
  'https://amirabd.com/wp-content/uploads/2026/05/2.jpg',
  'https://amirabd.com/wp-content/uploads/2025/12/2.jpg',
  'https://amirabd.com/wp-content/uploads/2026/01/Web-banner-intermix-25.jpg',
  'https://amirabd.com/wp-content/uploads/2026/05/2.1.jpg',
  'https://amirabd.com/wp-content/uploads/2026/01/MOBILE-banner-intermix-25-420-x-480-px.jpg'
];

Promise.all(list.map(getJpegDimensions)).then(console.log);
